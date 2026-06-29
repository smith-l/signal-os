import { createMcpHandler } from 'agents/mcp'
import { z } from 'zod'

interface Env {
  signal_os_db: D1Database
}

const handler = createMcpHandler(
  (server) => {

    // ── GET APPLICATIONS ─────────────────────────────────────────────
    server.tool(
      'get_applications',
      'Get all active job applications in the Signal OS pipeline. Returns company, role, status, stability, salary, next action, recruiter, and notes for each.',
      {},
      async (_, { env }: { env: Env }) => {
        const { results } = await env.signal_os_db
          .prepare('SELECT * FROM applications ORDER BY created_at DESC')
          .all()
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(results, null, 2)
          }]
        }
      }
    )

    // ── UPDATE APPLICATION ────────────────────────────────────────────
    server.tool(
      'update_application',
      'Update fields on a job application. Provide the application_id and any fields to update. Fields: status (Applied/TA Screen/HM Interview/Peer/Panel/Offer/Closed), next_action, notes, recruiter, salary, stability_check (PASS/REVIEW/CAUTION/UNKNOWN), location, job_link.',
      {
        application_id: z.number().describe('The ID of the application to update'),
        status: z.string().optional().describe('New status: Applied, TA Screen, HM Interview, Peer, Panel, Offer, Closed'),
        next_action: z.string().optional().describe('Next action to take on this application'),
        notes: z.string().optional().describe('Notes about the application'),
        recruiter: z.string().optional().describe('Recruiter name'),
        salary: z.string().optional().describe('Salary/package details'),
        stability_check: z.string().optional().describe('Stability assessment: PASS, REVIEW, CAUTION, or UNKNOWN'),
        location: z.string().optional().describe('Job location'),
        job_link: z.string().optional().describe('Link to the job posting'),
      },
      async ({ application_id, ...fields }, { env }: { env: Env }) => {
        const allowed = ['status','next_action','notes','recruiter','salary','stability_check','location','job_link']
        const updates = Object.entries(fields).filter(([k, v]) => allowed.includes(k) && v !== undefined)

        if (updates.length === 0) {
          return { content: [{ type: 'text', text: 'No valid fields to update.' }] }
        }

        const setClauses = updates.map(([k]) => `${k} = ?`).join(', ')
        const values = updates.map(([, v]) => v)

        await env.signal_os_db
          .prepare(`UPDATE applications SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
          .bind(...values, application_id)
          .run()

        const app = await env.signal_os_db
          .prepare('SELECT company, role_title, status, next_action FROM applications WHERE id = ?')
          .bind(application_id)
          .first()

        return {
          content: [{
            type: 'text',
            text: `Updated application ${application_id} (${(app as any)?.company}). New status: ${(app as any)?.status}. Next action: ${(app as any)?.next_action}`
          }]
        }
      }
    )

    // ── CREATE APPLICATION ────────────────────────────────────────────
    server.tool(
      'create_application',
      'Create a new job application in the Signal OS pipeline.',
      {
        company: z.string().describe('Company name'),
        role_title: z.string().describe('Job title/role'),
        status: z.string().optional().default('Applied').describe('Initial status, defaults to Applied'),
        recruiter: z.string().optional().describe('Recruiter name'),
        salary: z.string().optional().describe('Salary/package details'),
        stability_check: z.string().optional().default('UNKNOWN').describe('Stability: PASS, REVIEW, CAUTION, or UNKNOWN'),
        next_action: z.string().optional().describe('First next action'),
        notes: z.string().optional().describe('Initial notes'),
        job_link: z.string().optional().describe('Link to the job posting'),
      },
      async ({ company, role_title, status, recruiter, salary, stability_check, next_action, notes, job_link }, { env }: { env: Env }) => {
        const result = await env.signal_os_db
          .prepare(`INSERT INTO applications (company, role_title, status, recruiter, salary, stability_check, next_action, notes, job_link)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(company, role_title, status || 'Applied', recruiter || '', salary || '', stability_check || 'UNKNOWN', next_action || '', notes || '', job_link || '')
          .run()

        // Seed default prep sections
        const sections = [
          ['overview','Overview',1], ['go_sheet','GO Sheet',2], ['interview_process','Interview Process',3],
          ['people_intel','People Intel',4], ['company_research','Company Research',5],
          ['stories','Behavioural Stories',6], ['notes','Notes & Activity',7]
        ]

        const appId = result.meta.last_row_id
        for (const [key, title, order] of sections) {
          await env.signal_os_db
            .prepare('INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)')
            .bind(appId, key, title, '', order)
            .run()
        }

        return {
          content: [{
            type: 'text',
            text: `Created application for ${company} (${role_title}) with ID ${appId}. Status: ${status || 'Applied'}. 7 prep sections initialised.`
          }]
        }
      }
    )

    // ── GET PREP SECTIONS ─────────────────────────────────────────────
    server.tool(
      'get_prep_sections',
      'Get all prep sections for a specific application. Returns section titles, keys, and content.',
      {
        application_id: z.number().describe('The ID of the application'),
        section_key: z.string().optional().describe('Optional: get a specific section only (e.g. go_sheet, overview, interview_process, people_intel, company_research, stories, notes)'),
      },
      async ({ application_id, section_key }, { env }: { env: Env }) => {
        const query = section_key
          ? 'SELECT id, section_key, section_title, content, updated_at FROM role_prep WHERE application_id = ? AND section_key = ?'
          : 'SELECT id, section_key, section_title, content, updated_at FROM role_prep WHERE application_id = ? ORDER BY sort_order'

        const { results } = section_key
          ? await env.signal_os_db.prepare(query).bind(application_id, section_key).all()
          : await env.signal_os_db.prepare(query).bind(application_id).all()

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(results, null, 2)
          }]
        }
      }
    )

    // ── UPDATE PREP SECTION ───────────────────────────────────────────
    server.tool(
      'update_prep_section',
      'Write or update content in a prep section for a job application. Content should be in markdown format.',
      {
        application_id: z.number().describe('The ID of the application'),
        section_key: z.string().describe('Section to update: overview, go_sheet, interview_process, people_intel, company_research, stories, or notes'),
        content: z.string().describe('The new content for this section in markdown format'),
      },
      async ({ application_id, section_key, content }, { env }: { env: Env }) => {
        const existing = await env.signal_os_db
          .prepare('SELECT id FROM role_prep WHERE application_id = ? AND section_key = ?')
          .bind(application_id, section_key)
          .first()

        if (existing) {
          await env.signal_os_db
            .prepare('UPDATE role_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .bind(content, (existing as any).id)
            .run()
        } else {
          await env.signal_os_db
            .prepare('INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, 99)')
            .bind(application_id, section_key, section_key, content)
            .run()
        }

        return {
          content: [{
            type: 'text',
            text: `Updated ${section_key} section for application ${application_id}. ${content.length} characters written.`
          }]
        }
      }
    )

    // ── GET KNOWLEDGE BASE ────────────────────────────────────────────
    server.tool(
      'get_knowledge_base',
      'Get content from the Signal OS knowledge base. Contains: stories (all 12 behavioural stories), background (Lee Smith background), meddpicc, kpis, 90_days, se_model.',
      {
        section_key: z.string().optional().describe('Optional: specific section key. If omitted, returns all sections list.'),
      },
      async ({ section_key }, { env }: { env: Env }) => {
        const { results } = section_key
          ? await env.signal_os_db.prepare('SELECT * FROM knowledge_base WHERE section_key = ?').bind(section_key).all()
          : await env.signal_os_db.prepare('SELECT id, section_key, section_title, sort_order FROM knowledge_base ORDER BY sort_order').all()

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(results, null, 2)
          }]
        }
      }
    )

  },
  {
    capabilities: {
      tools: {}
    }
  }
)

export default {
  fetch: handler
}
