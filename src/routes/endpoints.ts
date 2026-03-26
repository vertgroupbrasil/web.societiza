const api = process.env.NEXT_PUBLIC_API_URL;

const withBase = (endpoint = '') => `${api}${endpoint}`;

const WORKFLOW_TEMPLATE_BASE = '/workflow-template';

const workflowTemplateEndpoints = {
  createWorkflowTemplate: withBase(WORKFLOW_TEMPLATE_BASE),
  updateWorkflowTemplate: (workflowTemplateId: string) =>
    withBase(`${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}`),
  activateWorkflowTemplate: (workflowTemplateId: string) =>
    withBase(`${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/activate`),
  archiveWorkflowTemplate: (workflowTemplateId: string) =>
    withBase(`${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/archive`),
  getAllWorkflowTemplates: withBase(WORKFLOW_TEMPLATE_BASE),
  getWorkflowTemplateById: (workflowTemplateId: string) =>
    withBase(`${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}`),
  addWorkflowTemplateStep: (workflowTemplateId: string) =>
    withBase(`${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step`),
  updateWorkflowTemplateStep: (
    workflowTemplateId: string,
    workflowStepId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}`,
    ),
  removeWorkflowTemplateStep: (
    workflowTemplateId: string,
    workflowStepId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}`,
    ),
  addWorkflowTemplateStepTask: (
    workflowTemplateId: string,
    workflowStepId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/task`,
    ),
  updateWorkflowTemplateStepTask: (
    workflowTemplateId: string,
    workflowStepId: string,
    workflowTaskId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/task/${workflowTaskId}`,
    ),
  removeWorkflowTemplateStepTask: (
    workflowTemplateId: string,
    workflowStepId: string,
    workflowTaskId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/task/${workflowTaskId}`,
    ),
  addTemplateStepField: (workflowTemplateId: string, workflowStepId: string) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/fields`,
    ),
  updateTemplateStepField: (
    workflowTemplateId: string,
    workflowStepId: string,
    workflowFieldId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/fields/${workflowFieldId}`,
    ),
  removeTemplateStepField: (
    workflowTemplateId: string,
    workflowStepId: string,
    workflowFieldId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/fields/${workflowFieldId}`,
    ),
  addTemplateStepTaskField: (
    workflowTemplateId: string,
    workflowStepId: string,
    workflowTaskId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/task/${workflowTaskId}/fields`,
    ),
  updateTemplateStepTaskField: (
    workflowTemplateId: string,
    workflowStepId: string,
    workflowTaskId: string,
    workflowFieldId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/task/${workflowTaskId}/fields/${workflowFieldId}`,
    ),
  removeTemplateStepTaskField: (
    workflowTemplateId: string,
    workflowStepId: string,
    workflowTaskId: string,
    workflowFieldId: string,
  ) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/step/${workflowStepId}/task/${workflowTaskId}/fields/${workflowFieldId}`,
    ),
};

export const API_ENDPOINTS = {
  workflowTemplate: workflowTemplateEndpoints,
  auth: {
    login: withBase('/accounts/token/'),
    logout: withBase('/accounts/token/logout/'),
    refresh: withBase('/accounts/token/refresh/'),
  },
  accounts: {
    getUser: withBase('/accounts/get-user/'),
    createUserAdmin: withBase('/accounts/create-user/'),
    getUserById: (id: string) => withBase(`/accounts/get-user/?id=${id}`),
    updateUserById: (id: string) => withBase(`/accounts/get-user/?id=${id}`),
    deleteUser: (id: string) => withBase(`/accounts/delete-user/?id=${id}`),
  },
  accountancy: {
    create: withBase('/accountancy'),
    getAll: withBase('/accountancy'),
    getById: (id: string) => withBase(`/accountancy/${id}`),
    update: (id: string) => withBase(`/accountancy/${id}`),
    delete: (id: string) => withBase(`/accountancy/${id}`),
  },
  corporate: {
    form: {
      createOpeningForm: workflowTemplateEndpoints.createWorkflowTemplate,
      getOpeningFormById: (id: string) =>
        workflowTemplateEndpoints.getWorkflowTemplateById(id),
      updateOpeningForm: (id: string) =>
        workflowTemplateEndpoints.updateWorkflowTemplate(id),
    },
    partner: {
      createPartners: workflowTemplateEndpoints.createWorkflowTemplate,
    },
    stage: {
      listStages: workflowTemplateEndpoints.getAllWorkflowTemplates,
      getStageById: (id: string) =>
        workflowTemplateEndpoints.getWorkflowTemplateById(id),
    },
    process: {
      type: {
        listProcessTypes: workflowTemplateEndpoints.getAllWorkflowTemplates,
        getProcessTypeById: (id: string) =>
          workflowTemplateEndpoints.getWorkflowTemplateById(id),
      },
      listProcessessByStages: workflowTemplateEndpoints.getAllWorkflowTemplates,
      createProcess: workflowTemplateEndpoints.createWorkflowTemplate,
      updateProcess: (id: string) =>
        workflowTemplateEndpoints.updateWorkflowTemplate(id),
      getProcessById: (id: string) =>
        workflowTemplateEndpoints.getWorkflowTemplateById(id),
      deleteProcess: (id: string) =>
        workflowTemplateEndpoints.archiveWorkflowTemplate(id),
    },
  },
  external: {
    viacep: {
      get: (cep: string) => `https://viacep.com.br/ws/${cep}/json/`,
    },
  },
};
