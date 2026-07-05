// Config-driven definitions for each entity type that uses the shared
// Board / RecordView components. Board.js and RecordView.js should never
// reference field names directly — everything goes through these configs.

export const applicationConfig = {
  typeKey: 'application',
  label: 'Application',
  apiBase: '/api/applications',
  prepApiBase: '/api/role-prep',
  prepIdParam: 'application_id',
  aiApiBase: '/api/ai',
  idParam: 'application_id',

  stages: ['Applied', 'TA Screen', 'HM Interview', 'Peer', 'Panel', 'Offer', 'Closed'],
  stageField: 'status',
  activeStages: ['Applied', 'TA Screen', 'HM Interview', 'Peer', 'Panel', 'Offer'], // excludes Closed for nav lists

  stageClassMap: {
    'Applied': 'status-applied',
    'TA Screen': 'status-ta',
    'HM Interview': 'status-hm',
    'Peer': 'status-peer',
    'Panel': 'status-panel',
    'Offer': 'status-offer',
    'Closed': 'status-closed',
  },

  titleField: 'company',
  subtitleField: 'role_title',

  badge: {
    field: 'stability_check',
    options: ['PASS', 'REVIEW', 'CAUTION', 'UNKNOWN'],
    classMap: {
      PASS: 'badge-pass',
      REVIEW: 'badge-review',
      CAUTION: 'badge-caution',
      UNKNOWN: 'badge-unknown'
    }
  },

  cardFields: [
    { key: 'salary', showIf: r => r.salary && r.salary !== 'TBC' },
    { key: 'next_action' },
  ],

  editFields: [
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'role_title', label: 'Role Title', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Applied', 'TA Screen', 'HM Interview', 'Peer', 'Panel', 'Offer', 'Closed'] },
    { key: 'recruiter', label: 'Recruiter', type: 'text' },
    { key: 'salary', label: 'Salary / Package', type: 'text' },
    { key: 'stability_check', label: 'Stability', type: 'select', options: ['PASS', 'REVIEW', 'CAUTION', 'UNKNOWN'] },
    { key: 'next_action', label: 'Next Action', type: 'textarea' },
    { key: 'job_link', label: 'Job Link', type: 'text' },
    { key: 'applied_date', label: 'Applied Date', type: 'text' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],

  quickLinks: [{ field: 'job_link', label: 'Job Description' }],

  enableStoryBank: true, // application-only feature — not generic

  aiSystemPrompt: (record, section) =>
    `You are an expert interview prep and job search assistant for Lee Smith, a Senior Solutions Engineering leader based in London. Help prepare for SE leadership interviews at enterprise SaaS companies.

Role: ${record.company} — ${record.role_title}
Status: ${record.status}
Section: ${section.section_title}
Current content: ${section.content || ''}

Respond with the COMPLETE updated section in markdown — preserve all existing content and add or update only what the user has asked for. Do not remove anything unless explicitly asked to. No preamble or explanation.`,
}

export const projectConfig = {
  typeKey: 'project',
  label: 'Project',
  apiBase: '/api/projects',
  prepApiBase: '/api/project-prep',
  prepIdParam: 'project_id',
  aiApiBase: '/api/project-ai',
  idParam: 'project_id',

  stages: ['Not Started', 'In Planning', 'Active', 'Blocked', 'Done'],
  stageField: 'stage',
  activeStages: ['Not Started', 'In Planning', 'Active', 'Blocked'], // excludes Done for nav lists

  stageClassMap: {
    'Not Started': 'status-not-started',
    'In Planning': 'status-in-planning',
    'Active': 'status-active-stage',
    'Blocked': 'status-blocked-stage',
    'Done': 'status-done-stage',
  },

  titleField: 'title',
  subtitleField: 'category',

  badge: {
    field: 'rag_status',
    options: ['GREEN', 'AMBER', 'RED'],
    classMap: {
      GREEN: 'badge-green',
      AMBER: 'badge-amber',
      RED: 'badge-red'
    }
  },

  cardFields: [
    { key: 'next_action' },
  ],

  editFields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'stage', label: 'Stage', type: 'select', options: ['Not Started', 'In Planning', 'Active', 'Blocked', 'Done'] },
    { key: 'rag_status', label: 'RAG Status', type: 'select', options: ['GREEN', 'AMBER', 'RED'] },
    { key: 'next_action', label: 'Next Action', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],

  quickLinks: [],

  enableStoryBank: false,
  enableTasks: true,

  defaultSections: [
    { section_key: 'problem_statement', section_title: 'Problem Statement / Objective', sort_order: 1 },
    { section_key: 'roles_responsibilities', section_title: 'Roles & Responsibilities', sort_order: 2 },
    { section_key: 'risks_mitigation', section_title: 'Risks & Mitigation', sort_order: 3 },
    { section_key: 'general_info', section_title: 'General Info', sort_order: 4 },
  ],

  aiSystemPrompt: (record, section) =>
    `You are a strategic planning assistant for Lee Smith, a Senior Solutions Engineering leader, helping him think through the "${record.title}" project.

Category: ${record.category || 'n/a'}
Stage: ${record.stage}
Section: ${section.section_title}
Current content: ${section.content || ''}

Respond with the COMPLETE updated section in markdown — preserve all existing content and add or update only what the user has asked for. Do not remove anything unless explicitly asked to. No preamble or explanation.`,
}

export const entityConfigs = {
  application: applicationConfig,
  project: projectConfig,
}
