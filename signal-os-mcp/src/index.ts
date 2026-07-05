import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { OAuthProvider, type OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { z } from "zod";

interface Env {
  signal_os_db: D1Database;
  MCP_OBJECT: DurableObjectNamespace;
  OAUTH_KV: KVNamespace;
  MCP_SECRET: string;
}

export class MyMCP extends McpAgent<Env> {
  server = new McpServer({
    name: "Signal OS",
    version: "1.0.0",
  });

  async init() {

    // ── GET APPLICATIONS ─────────────────────────────────────────────
    this.server.registerTool(
      "get_applications",
      {
        description: "Get all job applications in the Signal OS pipeline. Returns company, role, status, stability, salary, next action, recruiter, and notes.",
        inputSchema: {}
      },
      async () => {
        const { results } = await this.env.signal_os_db
          .prepare("SELECT * FROM applications ORDER BY created_at DESC")
          .all();
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }
    );

    // ── UPDATE APPLICATION ────────────────────────────────────────────
    this.server.registerTool(
      "update_application",
      {
        description: "Update fields on a job application. Provide the application_id and any fields to update.",
        inputSchema: {
          application_id: z.number().describe("The ID of the application to update"),
          status: z.string().optional().describe("New status: Applied, TA Screen, HM Interview, Peer, Panel, Offer, Closed"),
          next_action: z.string().optional().describe("Next action to take"),
          notes: z.string().optional().describe("Notes about the application"),
          recruiter: z.string().optional().describe("Recruiter name"),
          salary: z.string().optional().describe("Salary/package details"),
          stability_check: z.string().optional().describe("Stability: PASS, REVIEW, CAUTION, or UNKNOWN"),
          location: z.string().optional().describe("Job location"),
          job_link: z.string().optional().describe("Link to the job posting"),
        }
      },
      async ({ application_id, ...fields }) => {
        const allowed = ["status", "next_action", "notes", "recruiter", "salary", "stability_check", "location", "job_link"];
        const updates = Object.entries(fields).filter(([k, v]) => allowed.includes(k) && v !== undefined);
        if (updates.length === 0) {
          return { content: [{ type: "text", text: "No valid fields to update." }] };
        }
        const setClauses = updates.map(([k]) => `${k} = ?`).join(", ");
        const values = updates.map(([, v]) => v);
        await this.env.signal_os_db
          .prepare(`UPDATE applications SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
          .bind(...values, application_id)
          .run();

        // If notes were updated, sync to role_prep notes section
        const notesUpdate = updates.find(([k]) => k === "notes");
        if (notesUpdate) {
          const notesContent = notesUpdate[1] as string;
          const existingNotes = await this.env.signal_os_db
            .prepare("SELECT id, content FROM role_prep WHERE application_id = ? AND section_key = 'notes'")
            .bind(application_id)
            .first() as any;
          if (existingNotes) {
            // Prepend new note to existing content with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            const updatedContent = `## Update — ${timestamp}\n${notesContent}\n\n---\n\n${existingNotes.content || ''}`;
            await this.env.signal_os_db
              .prepare("UPDATE role_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
              .bind(updatedContent, existingNotes.id)
              .run();
          }
        }

        const app = await this.env.signal_os_db
          .prepare("SELECT company, role_title, status, next_action FROM applications WHERE id = ?")
          .bind(application_id)
          .first() as any;
        return { content: [{ type: "text", text: `Updated ${app?.company} (ID ${application_id}). Status: ${app?.status}. Next action: ${app?.next_action}` }] };
      }
    );

    // ── CREATE APPLICATION ────────────────────────────────────────────
    this.server.registerTool(
      "create_application",
      {
        description: "Create a new job application in the Signal OS pipeline. Also creates default prep sections.",
        inputSchema: {
          company: z.string().describe("Company name"),
          role_title: z.string().describe("Job title/role"),
          status: z.string().optional().describe("Initial status, defaults to Applied"),
          recruiter: z.string().optional().describe("Recruiter name"),
          salary: z.string().optional().describe("Salary/package details"),
          stability_check: z.string().optional().describe("Stability: PASS, REVIEW, CAUTION, or UNKNOWN"),
          next_action: z.string().optional().describe("First next action"),
          notes: z.string().optional().describe("Initial notes"),
          job_link: z.string().optional().describe("Link to the job posting"),
        }
      },
      async ({ company, role_title, status, recruiter, salary, stability_check, next_action, notes, job_link }) => {
        const result = await this.env.signal_os_db
          .prepare(`INSERT INTO applications (company, role_title, status, recruiter, salary, stability_check, next_action, notes, job_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(company, role_title, status || "Applied", recruiter || "", salary || "", stability_check || "UNKNOWN", next_action || "", notes || "", job_link || "")
          .run();
        const appId = result.meta.last_row_id;
        // Schema: overview(1) → notes(2) → interview_process(3) → people_intel(4) → company_research(5) → stories/values(6)
        // No default go_sheet — these are created per interview stage via create_go_sheet
        const sections = [
          ["overview",          "Overview",          1],
          ["notes",             "Notes & Activity",  2],
          ["interview_process", "Interview Process", 3],
          ["people_intel",      "People Intel",      4],
          ["company_research",  "Company Research",  5],
          ["stories",           "Values & Stories",  6],
        ];
        for (const [key, title, order] of sections) {
          await this.env.signal_os_db
            .prepare("INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)")
            .bind(appId, key, title, "", order)
            .run();
        }
        return { content: [{ type: "text", text: `Created application for ${company} — ${role_title} (ID ${appId}). Status: ${status || "Applied"}. 6 prep sections initialised (use create_go_sheet to add GO Sheets per interview stage).` }] };
      }
    );

    // ── CREATE GO SHEET ───────────────────────────────────────────────
    this.server.registerTool(
      "create_go_sheet",
      {
        description: "Create a GO Sheet prep section for a specific interview stage. Automatically names and orders the section. Use this whenever a new interview stage is confirmed — HM call, peer interview, panel, values interview etc. The section key will be go_sheet_{stage_key} and will appear after existing GO Sheets in the section nav.",
        inputSchema: {
          application_id: z.number().describe("The ID of the application"),
          stage_name: z.string().describe("The interview stage name, e.g. 'Kira (HM)', 'Emilie (Peer)', 'Panel', 'Values'"),
          stage_key: z.string().describe("Short slug for the section key, e.g. 'kira_hm', 'emilie_peer', 'panel', 'values'. Will become go_sheet_{stage_key}"),
          content: z.string().optional().describe("Initial content in markdown format. Can be empty and filled later."),
        }
      },
      async ({ application_id, stage_name, stage_key, content }) => {
        const section_key = `go_sheet_${stage_key}`
        const section_title = `GO Sheet — ${stage_name}`

        // Check it doesn't already exist
        const existing = await this.env.signal_os_db
          .prepare("SELECT id FROM role_prep WHERE application_id = ? AND section_key = ?")
          .bind(application_id, section_key)
          .first() as any;
        if (existing) {
          return { content: [{ type: "text", text: `GO Sheet for '${stage_name}' already exists (key: ${section_key}, ID: ${existing.id}). Use update_prep_section to update its content.` }] };
        }

        // Find the highest current sort_order for this application and place after it
        const maxOrder = await this.env.signal_os_db
          .prepare("SELECT MAX(sort_order) as max_order FROM role_prep WHERE application_id = ?")
          .bind(application_id)
          .first() as any;
        const sort_order = (maxOrder?.max_order || 6) + 1;

        await this.env.signal_os_db
          .prepare("INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)")
          .bind(application_id, section_key, section_title, content || "", sort_order)
          .run();

        return { content: [{ type: "text", text: `Created GO Sheet '${section_title}' (key: ${section_key}) for application ${application_id} at position ${sort_order}.` }] };
      }
    );

    // ── GET PREP SECTIONS ─────────────────────────────────────────────
    this.server.registerTool(
      "get_prep_sections",
      {
        description: "Get prep sections for a specific application. Returns section titles, keys, and content. Applications have default sections plus any custom sections created with create_prep_section.",
        inputSchema: {
          application_id: z.number().describe("The ID of the application"),
          section_key: z.string().optional().describe("Optional: get a specific section only. Omit to get all sections."),
        }
      },
      async ({ application_id, section_key }) => {
        const { results } = section_key
          ? await this.env.signal_os_db.prepare("SELECT id, section_key, section_title, content, updated_at FROM role_prep WHERE application_id = ? AND section_key = ?").bind(application_id, section_key).all()
          : await this.env.signal_os_db.prepare("SELECT id, section_key, section_title, content, updated_at FROM role_prep WHERE application_id = ? ORDER BY sort_order").bind(application_id).all();
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }
    );

    // ── RENAME PREP SECTION ───────────────────────────────────────────
    this.server.registerTool(
      "rename_prep_section",
      {
        description: "Rename the display title of a prep section. Does not change the section_key — only the title shown in the section nav.",
        inputSchema: {
          application_id: z.number().describe("The ID of the application"),
          section_key: z.string().describe("The section key to rename"),
          section_title: z.string().describe("The new display title for this section"),
        }
      },
      async ({ application_id, section_key, section_title }) => {
        const existing = await this.env.signal_os_db
          .prepare("SELECT id FROM role_prep WHERE application_id = ? AND section_key = ?")
          .bind(application_id, section_key)
          .first() as any;
        if (!existing) {
          return { content: [{ type: "text", text: `No section found with key '${section_key}' for application ${application_id}.` }] };
        }
        await this.env.signal_os_db
          .prepare("UPDATE role_prep SET section_title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
          .bind(section_title, existing.id)
          .run();
        return { content: [{ type: "text", text: `Renamed section '${section_key}' to '${section_title}' for application ${application_id}.` }] };
      }
    );

    // ── CREATE PREP SECTION ───────────────────────────────────────────
    this.server.registerTool(
      "create_prep_section",
      {
        description: "Create a new named prep section for a job application. Use this to add sections beyond the default seven — e.g. a GO sheet per interview stage. section_key must be unique per application.",
        inputSchema: {
          application_id: z.number().describe("The ID of the application"),
          section_key: z.string().describe("Unique key for this section, e.g. go_sheet_kira, go_sheet_emilie"),
          section_title: z.string().describe("Display title shown in the section nav, e.g. 'GO Sheet — Kira (HM)'"),
          content: z.string().optional().describe("Initial content in markdown format"),
          sort_order: z.number().optional().describe("Position in the section nav. Lower numbers appear first."),
        }
      },
      async ({ application_id, section_key, section_title, content, sort_order }) => {
        const existing = await this.env.signal_os_db
          .prepare("SELECT id FROM role_prep WHERE application_id = ? AND section_key = ?")
          .bind(application_id, section_key)
          .first() as any;
        if (existing) {
          return { content: [{ type: "text", text: `Section '${section_key}' already exists for application ${application_id} (ID ${existing.id}). Use update_prep_section to update its content.` }] };
        }
        const result = await this.env.signal_os_db
          .prepare("INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)")
          .bind(application_id, section_key, section_title, content || "", sort_order || 99)
          .run();
        return { content: [{ type: "text", text: `Created section '${section_title}' (key: ${section_key}) for application ${application_id} (row ID ${result.meta.last_row_id}).` }] };
      }
    );

    // ── UPDATE PREP SECTION ───────────────────────────────────────────
    this.server.registerTool(
      "update_prep_section",
      {
        description: "Write or update content in a prep section for a job application. Content should be in markdown format. Works on any section_key — both default sections (overview, go_sheet, interview_process, people_intel, company_research, stories, notes) and custom sections created with create_prep_section.",
        inputSchema: {
          application_id: z.number().describe("The ID of the application"),
          section_key: z.string().describe("The section key to update. Use get_prep_sections to see all available keys for this application."),
          content: z.string().describe("The new content for this section in markdown format"),
        }
      },
      async ({ application_id, section_key, content }) => {
        const existing = await this.env.signal_os_db
          .prepare("SELECT id FROM role_prep WHERE application_id = ? AND section_key = ?")
          .bind(application_id, section_key)
          .first() as any;
        if (existing) {
          await this.env.signal_os_db
            .prepare("UPDATE role_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
            .bind(content, existing.id)
            .run();
        } else {
          await this.env.signal_os_db
            .prepare("INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, 99)")
            .bind(application_id, section_key, section_key, content)
            .run();
        }
        return { content: [{ type: "text", text: `Updated ${section_key} section for application ${application_id}. ${content.length} characters written.` }] };
      }
    );

    // ── GET KNOWLEDGE BASE ────────────────────────────────────────────
    this.server.registerTool(
      "get_knowledge_base",
      {
        description: "Get content from the Signal OS knowledge base. Contains: stories (all 12 behavioural stories), background, meddpicc, kpis, 90_days, se_model.",
        inputSchema: {
          section_key: z.string().optional().describe("Optional: specific section key. If omitted, returns all sections list."),
        }
      },
      async ({ section_key }) => {
        const { results } = section_key
          ? await this.env.signal_os_db.prepare("SELECT * FROM knowledge_base WHERE section_key = ?").bind(section_key).all()
          : await this.env.signal_os_db.prepare("SELECT id, section_key, section_title, sort_order FROM knowledge_base ORDER BY sort_order").all();
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }
    );
    // ── GET TASKS ──────────────────────────────────────────────────────
    this.server.registerTool(
      "get_tasks",
      {
        description: "Get tasks from the Signal OS planning board. Tasks are grouped by module (e.g. 'maintel', 'job_search', 'signal_os_build') and tracked by status/stage. Optionally filter by module and/or linked application_id.",
        inputSchema: {
          module: z.string().optional().describe("Filter by module, e.g. 'maintel', 'signal_os_build'. Omit to get all modules."),
          application_id: z.number().optional().describe("Filter by linked application ID, if the task is tied to a specific role."),
        }
      },
      async ({ module, application_id }) => {
        let query = "SELECT * FROM tasks WHERE 1=1";
        const binds: any[] = [];
        if (module) { query += " AND module = ?"; binds.push(module); }
        if (application_id) { query += " AND application_id = ?"; binds.push(application_id); }
        query += " ORDER BY updated_at DESC";
        const { results } = await this.env.signal_os_db.prepare(query).bind(...binds).all();
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }
    );

    // ── CREATE TASK ───────────────────────────────────────────────────
    this.server.registerTool(
      "create_task",
      {
        description: "Create a new task on the Signal OS planning board. Use module to group related tasks (e.g. all Maintel transformation work under module 'maintel'). Link to a job application via application_id if relevant.",
        inputSchema: {
          title: z.string().describe("Short title for the task"),
          status: z.string().optional().describe("Initial stage, e.g. Backlog, Active, Blocked, Done. Defaults to Backlog."),
          module: z.string().optional().describe("Grouping tag, e.g. 'maintel', 'job_search', 'signal_os_build'. Defaults to 'general'."),
          notes: z.string().optional().describe("Details, plan, or context in markdown format"),
          application_id: z.number().optional().describe("Optional linked application ID"),
        }
      },
      async ({ title, status, module, notes, application_id }) => {
        const result = await this.env.signal_os_db
          .prepare("INSERT INTO tasks (title, status, module, notes, application_id) VALUES (?, ?, ?, ?, ?)")
          .bind(title, status || "Backlog", module || "general", notes || "", application_id || null)
          .run();
        return { content: [{ type: "text", text: `Created task '${title}' (ID ${result.meta.last_row_id}) in module '${module || "general"}'. Status: ${status || "Backlog"}.` }] };
      }
    );

    // ── UPDATE TASK ───────────────────────────────────────────────────
    this.server.registerTool(
      "update_task",
      {
        description: "Update fields on a task. Provide the task_id and any fields to change — commonly status, to move the task across the board.",
        inputSchema: {
          task_id: z.number().describe("The ID of the task to update"),
          title: z.string().optional().describe("New title"),
          status: z.string().optional().describe("New stage, e.g. Backlog, Active, Blocked, Done"),
          module: z.string().optional().describe("New module grouping"),
          notes: z.string().optional().describe("New notes/plan content in markdown"),
          application_id: z.number().optional().describe("Link or re-link to an application ID"),
        }
      },
      async ({ task_id, ...fields }) => {
        const allowed = ["title", "status", "module", "notes", "application_id"];
        const updates = Object.entries(fields).filter(([k, v]) => allowed.includes(k) && v !== undefined);
        if (updates.length === 0) {
          return { content: [{ type: "text", text: "No valid fields to update." }] };
        }
        const setClauses = updates.map(([k]) => `${k} = ?`).join(", ");
        const values = updates.map(([, v]) => v);
        await this.env.signal_os_db
          .prepare(`UPDATE tasks SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
          .bind(...values, task_id)
          .run();
        const task = await this.env.signal_os_db
          .prepare("SELECT title, status, module FROM tasks WHERE id = ?")
          .bind(task_id)
          .first() as any;
        return { content: [{ type: "text", text: `Updated task ${task_id} (${task?.title}). Status: ${task?.status}. Module: ${task?.module}.` }] };
      }
    );

    // ── GET PROJECTS ───────────────────────────────────────────────────
    this.server.registerTool(
      "get_projects",
      {
        description: "Get projects from the Signal OS planning board. Projects are separate from job applications — used for in-role work like the Maintel SE transformation. Optionally filter by stage.",
        inputSchema: {
          stage: z.string().optional().describe("Filter by stage, e.g. 'Not Started', 'In Planning', 'Active', 'Blocked', 'Done'. Omit for all."),
        }
      },
      async ({ stage }) => {
        let query = "SELECT * FROM projects";
        const binds: any[] = [];
        if (stage) { query += " WHERE stage = ?"; binds.push(stage); }
        query += " ORDER BY updated_at DESC";
        const { results } = await this.env.signal_os_db.prepare(query).bind(...binds).all();
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }
    );

        // ── CREATE PROJECT ─────────────────────────────────────────────────
    this.server.registerTool(
      "create_project",
      {
        description: "Create a new project on the Signal OS planning board (separate from job applications). Use for in-role initiatives, e.g. the Maintel SE team transformation.",
        inputSchema: {
          title: z.string().describe("Project title, e.g. 'Maintel — SE Team Transformation'"),
          category: z.string().optional().describe("Free-text grouping tag, e.g. 'in-role', 'signal_os_build'"),
          stage: z.string().optional().describe("Initial stage. Defaults to 'Not Started'."),
          rag_status: z.enum(["GREEN", "AMBER", "RED"]).optional().describe("Initial RAG health status"),
          next_action: z.string().optional(),
          notes: z.string().optional().describe("High-level summary — richer content goes in project prep sections, not here"),
        }
      },
      async ({ title, category, stage, rag_status, next_action, notes }) => {
        const result = await this.env.signal_os_db
          .prepare("INSERT INTO projects (title, category, stage, rag_status, next_action, notes) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(title, category || "", stage || "Not Started", rag_status || "", next_action || "", notes || "")
          .run();
        const projectId = result.meta.last_row_id;
 
        const defaultSections = [
          { key: "problem_statement", title: "Problem Statement / Objective", order: 1, content: "" },
          { key: "roles_responsibilities", title: "Roles & Responsibilities", order: 2, content: "| Owner | Role | Responsibility |\n|---|---|---|\n| | | |\n" },
          { key: "risks_mitigation", title: "Risks & Mitigation", order: 3, content: "| Risk | Impact | Likelihood | Mitigation |\n|---|---|---|---|\n| | | | |\n" },
          { key: "general_info", title: "General Info", order: 4, content: "" },
        ];
        for (const s of defaultSections) {
          await this.env.signal_os_db
            .prepare("INSERT INTO project_prep (project_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)")
            .bind(projectId, s.key, s.title, s.content, s.order)
            .run();
        }
 
        return { content: [{ type: "text", text: `Created project '${title}' (ID ${projectId}) with the standard section template. Stage: ${stage || "Not Started"}.` }] };
      }
    );
 

     // ── UPDATE PROJECT ─────────────────────────────────────────────────
    this.server.registerTool(
      "update_project",
      {
        description: "Update fields on a project. Provide project_id and any fields to change — commonly stage, to move it across the board, or rag_status to update its health.",
        inputSchema: {
          project_id: z.number(),
          title: z.string().optional(),
          category: z.string().optional(),
          stage: z.string().optional(),
          rag_status: z.enum(["GREEN", "AMBER", "RED"]).optional(),
          next_action: z.string().optional(),
          notes: z.string().optional(),
        }
      },
      async ({ project_id, ...fields }) => {
        const allowed = ["title", "category", "stage", "rag_status", "next_action", "notes"];
        const updates = Object.entries(fields).filter(([k, v]) => allowed.includes(k) && v !== undefined);
        if (updates.length === 0) {
          return { content: [{ type: "text", text: "No valid fields to update." }] };
        }
        const setClauses = updates.map(([k]) => `${k} = ?`).join(", ");
        const values = updates.map(([, v]) => v);
        await this.env.signal_os_db
          .prepare(`UPDATE projects SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
          .bind(...values, project_id)
          .run();
        const project = await this.env.signal_os_db
          .prepare("SELECT title, stage, rag_status FROM projects WHERE id = ?")
          .bind(project_id)
          .first() as any;
        return { content: [{ type: "text", text: `Updated project ${project_id} (${project?.title}). Stage: ${project?.stage}. RAG: ${project?.rag_status || 'not set'}.` }] };
      }
    );
 
    // ── GET PROJECT PREP SECTIONS ────────────────────────────────────────
    this.server.registerTool(
      "get_project_prep",
      {
        description: "Get prep/content sections for a project. Returns section titles, keys, and content. Mirrors get_prep_sections but for projects instead of applications.",
        inputSchema: {
          project_id: z.number(),
          section_key: z.string().optional().describe("Optional: get a specific section only. Omit to get all sections."),
        }
      },
      async ({ project_id, section_key }) => {
        let query = "SELECT * FROM project_prep WHERE project_id = ?";
        const binds: any[] = [project_id];
        if (section_key) { query += " AND section_key = ?"; binds.push(section_key); }
        query += " ORDER BY sort_order ASC";
        const { results } = await this.env.signal_os_db.prepare(query).bind(...binds).all();
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }
    );
 
    // ── CREATE PROJECT PREP SECTION ──────────────────────────────────────
    this.server.registerTool(
      "create_project_prep_section",
      {
        description: "Create a new custom prep/content section for a project. Mirrors create_prep_section but for projects.",
        inputSchema: {
          project_id: z.number(),
          section_key: z.string().describe("Short machine key, e.g. 'stakeholder_map'"),
          section_title: z.string().describe("Display title, e.g. 'Stakeholder Map'"),
          content: z.string().optional(),
          sort_order: z.number().optional(),
        }
      },
      async ({ project_id, section_key, section_title, content, sort_order }) => {
        const result = await this.env.signal_os_db
          .prepare("INSERT INTO project_prep (project_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)")
          .bind(project_id, section_key, section_title, content || "", sort_order || 0)
          .run();
        return { content: [{ type: "text", text: `Created section '${section_title}' (ID ${result.meta.last_row_id}) on project ${project_id}.` }] };
      }
    );
 
    // ── UPDATE PROJECT PREP SECTION ───────────────────────────────────────
    this.server.registerTool(
      "update_project_prep_section",
      {
        description: "Write or update content in a prep section for a project. Mirrors update_prep_section but for projects.",
        inputSchema: {
          id: z.number().describe("The project_prep section ID (not the project ID)"),
          content: z.string(),
        }
      },
      async ({ id, content }) => {
        await this.env.signal_os_db
          .prepare("UPDATE project_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
          .bind(content, id)
          .run();
        return { content: [{ type: "text", text: `Updated project_prep section ${id}. ${content.length} characters written.` }] };
      }
    );

    // ── CREATE PROJECT PREP SECTION ──────────────────────────────────────
    this.server.registerTool(
      "create_project_prep_section",
      {
        description: "Create a new custom prep/content section for a project. Mirrors create_prep_section but for projects.",
        inputSchema: {
          project_id: z.number(),
          section_key: z.string().describe("Short machine key, e.g. 'stakeholder_map'"),
          section_title: z.string().describe("Display title, e.g. 'Stakeholder Map'"),
          content: z.string().optional(),
          sort_order: z.number().optional(),
        }
      },
      async ({ project_id, section_key, section_title, content, sort_order }) => {
        const result = await this.env.signal_os_db
          .prepare("INSERT INTO project_prep (project_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)")
          .bind(project_id, section_key, section_title, content || "", sort_order || 0)
          .run();
        return { content: [{ type: "text", text: `Created section '${section_title}' (ID ${result.meta.last_row_id}) on project ${project_id}.` }] };
      }
    );

    // ── UPDATE PROJECT PREP SECTION ───────────────────────────────────────
    this.server.registerTool(
      "update_project_prep_section",
      {
        description: "Write or update content in a prep section for a project. Mirrors update_prep_section but for projects.",
        inputSchema: {
          id: z.number().describe("The project_prep section ID (not the project ID)"),
          content: z.string(),
        }
      },
      async ({ id, content }) => {
        await this.env.signal_os_db
          .prepare("UPDATE project_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
          .bind(content, id)
          .run();
        return { content: [{ type: "text", text: `Updated project_prep section ${id}. ${content.length} characters written.` }] };
      }
    );
  }
}

// Auth gate: validates MCP_SECRET before completing OAuth
const defaultHandler = {
  async fetch(request: Request, env: Env & { OAUTH_PROVIDER: OAuthHelpers }) {
    const url = new URL(request.url);

    if (url.pathname !== "/authorize") {
      return new Response("Not Found", { status: 404 });
    }

    const oauthReq = await env.OAUTH_PROVIDER.parseAuthRequest(request);

    if (request.method === "GET") {
      return new Response(
        `<!doctype html><html><body style="font-family:sans-serif;max-width:400px;margin:80px auto;padding:0 20px">
          <h2>Signal OS</h2>
          <form method="POST" action="/authorize?${url.searchParams}">
            <label>Secret<br><input name="token" type="password" style="width:100%;padding:8px;margin:8px 0" /></label><br>
            <button type="submit" style="padding:8px 16px">Connect</button>
          </form>
        </body></html>`,
        { headers: { "content-type": "text/html" } }
      );
    }

    if (request.method === "POST") {
      const form = await request.formData();
      const token = String(form.get("token") ?? "");

      if (!token || token !== env.MCP_SECRET) {
        return new Response(
          `<!doctype html><html><body style="font-family:sans-serif;max-width:400px;margin:80px auto;padding:0 20px">
            <h2>Signal OS</h2>
            <p style="color:red">Invalid secret.</p>
            <form method="POST" action="/authorize?${url.searchParams}">
              <label>Secret<br><input name="token" type="password" style="width:100%;padding:8px;margin:8px 0" /></label><br>
              <button type="submit" style="padding:8px 16px">Connect</button>
            </form>
          </body></html>`,
          { status: 401, headers: { "content-type": "text/html" } }
        );
      }

      const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
        request: oauthReq,
        userId: "owner",
        scope: [],
        props: {},
        metadata: undefined,
      });

      return Response.redirect(redirectTo, 302);
    }

    return new Response("Method Not Allowed", { status: 405 });
  },
};

export default new OAuthProvider({
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/token",
  clientRegistrationEndpoint: "/register",
  apiHandlers: { "/mcp": MyMCP.serve("/mcp") },
  defaultHandler,
});