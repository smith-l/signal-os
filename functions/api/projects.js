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
        return { content: [{ type: "text", text: `Created project '${title}' (ID ${result.meta.last_row_id}). Stage: ${stage || "Not Started"}.` }] };
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