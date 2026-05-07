const api = process.env.NEXT_PUBLIC_API_URL;

const withBase = (endpoint = '') => `${api}${endpoint}`;

const WORKFLOW_TEMPLATE_BASE = '/workflow-template';
const WORKFLOW_PROCESS_BASE = '/workflow-process';

const workflowTemplateEndpoints = {
  createWorkflowTemplate: withBase(WORKFLOW_TEMPLATE_BASE),
  updateWorkflowTemplate: (workflowTemplateId: string) =>
    withBase(`${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}`),
  activateWorkflowTemplate: (workflowTemplateId: string) =>
    withBase(`${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/activate`),
  archiveWorkflowTemplate: (workflowTemplateId: string) =>
    withBase(`${WORKFLOW_TEMPLATE_BASE}/${workflowTemplateId}/archive`),
  getAllWorkflowTemplates: ({
    includeDraft = false,
    includeArchive = false,
    pageNumber = 1,
    pageSize = 10,
  }: {
    includeDraft?: boolean;
    includeArchive?: boolean;
    pageNumber?: number;
    pageSize?: number;
  } = {}) =>
    withBase(
      `${WORKFLOW_TEMPLATE_BASE}?includeDraft=${includeDraft}&includeArchive=${includeArchive}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    ),
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
  workflowProcess: {
    create: withBase(WORKFLOW_PROCESS_BASE),
    board: (accountancyId: string, processType?: string) =>
      withBase(
        `${WORKFLOW_PROCESS_BASE}?accountancyId=${encodeURIComponent(
          accountancyId,
        )}${processType ? `&processType=${encodeURIComponent(processType)}` : ''}`,
      ),
    detail: (processId: string) =>
      withBase(
        `${WORKFLOW_PROCESS_BASE}/${encodeURIComponent(processId)}`,
      ),
    completeTask: (
      processId: string,
      stepInstanceId: string,
      taskInstanceId: string,
    ) =>
      withBase(
        `${WORKFLOW_PROCESS_BASE}/${encodeURIComponent(
          processId,
        )}/steps/${encodeURIComponent(
          stepInstanceId,
        )}/tasks/${encodeURIComponent(taskInstanceId)}/complete`,
      ),
    skipTask: (
      processId: string,
      stepInstanceId: string,
      taskInstanceId: string,
    ) =>
      withBase(
        `${WORKFLOW_PROCESS_BASE}/${encodeURIComponent(
          processId,
        )}/steps/${encodeURIComponent(
          stepInstanceId,
        )}/tasks/${encodeURIComponent(taskInstanceId)}/skip`,
      ),
    revertTask: (
      processId: string,
      stepInstanceId: string,
      taskInstanceId: string,
    ) =>
      withBase(
        `${WORKFLOW_PROCESS_BASE}/${encodeURIComponent(
          processId,
        )}/steps/${encodeURIComponent(
          stepInstanceId,
        )}/tasks/${encodeURIComponent(taskInstanceId)}/revert`,
      ),
    fillStepField: (
      processId: string,
      stepInstanceId: string,
      fieldInstanceId: string,
    ) =>
      withBase(
        `${WORKFLOW_PROCESS_BASE}/${encodeURIComponent(
          processId,
        )}/steps/${encodeURIComponent(
          stepInstanceId,
        )}/fields/${encodeURIComponent(fieldInstanceId)}`,
      ),
    fillTaskField: (
      processId: string,
      stepInstanceId: string,
      taskInstanceId: string,
      fieldInstanceId: string,
    ) =>
      withBase(
        `${WORKFLOW_PROCESS_BASE}/${encodeURIComponent(
          processId,
        )}/steps/${encodeURIComponent(
          stepInstanceId,
        )}/tasks/${encodeURIComponent(
          taskInstanceId,
        )}/fields/${encodeURIComponent(fieldInstanceId)}`,
      ),
  },
  auth: {
    login: withBase('/identity/auth/login'),
    logout: withBase('/identity/auth/logout'),
    refresh: withBase('/identity/auth/refresh'),
    forgotPassword: withBase('/identity/auth/forgot-password'),
    resetPassword: withBase('/identity/auth/reset-password'),
  },
  identityUsers: {
    myProfile: withBase('/identity/users'),
    updateProfile: withBase('/identity/users'),
    systemAdmins: (onlyActive = true, pageNumber = 1, pageSize = 10) =>
      withBase(
        `/identity/system-admins?OnlyActive=${onlyActive}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
      ),
    accountancyMembers: (
      accountancyId: string,
      onlyActive = true,
      pageNumber = 1,
      pageSize = 10,
    ) =>
      withBase(
        `/identity/accountancies/${accountancyId}/members?OnlyActive=${onlyActive}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
      ),
    promoteAccountancyMember: (accountancyId: string, userId: string) =>
      withBase(
        `/identity/accountancies/${accountancyId}/members/${userId}/promote`,
      ),
    deleteUser: (userId: string, accountancyId?: string) =>
      withBase(
        `/identity/users/${userId}${
          accountancyId ? `?accountancyId=${accountancyId}` : ''
        }`,
      ),
  },
  identityInvitations: {
    create: withBase('/identity/invitation-link'),
    list: (
      onlyActive = true,
      accountancyId: string | undefined,
      pageNumber = 1,
      pageSize = 10,
    ) =>
      withBase(
        `/identity/invitation-link?OnlyActive=${onlyActive}${
          accountancyId ? `&AccountancyId=${accountancyId}` : ''
        }&PageNumber=${pageNumber}&PageSize=${pageSize}`,
      ),
    detail: (invitationLinkId: string) =>
      withBase(`/identity/invitation-link/${invitationLinkId}`),
    register: withBase('/identity/invitation-link/register'),
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
    list: (pageNumber: number, pageSize: number) =>
      withBase(`/accountancy?pageNumber=${pageNumber}&pageSize=${pageSize}`),
    getById: (id: string) => withBase(`/accountancy/${id}`),
    getMe: withBase('/accountancy/me'),
    update: (id: string) => withBase(`/accountancy/${id}`),
  },
  // TODO: remover mock e apontar para endpoints reais quando backend entregar
  offices: {
    getAll: withBase('/offices'),
    create: withBase('/offices'),
    getById: (id: string) => withBase(`/offices/${id}`),
    update: (id: string) => withBase(`/offices/${id}`),
    delete: (id: string) => withBase(`/offices/${id}`),
    setActive: withBase('/offices/active'),
    members: (officeId: string) => withBase(`/offices/${officeId}/members`),
    removeMember: (officeId: string, memberId: string) =>
      withBase(`/offices/${officeId}/members/${memberId}`),
    inviteByEmail: (officeId: string) =>
      withBase(`/offices/${officeId}/members/invite-email`),
    inviteLink: (officeId: string) =>
      withBase(`/offices/${officeId}/members/invite-link`),
    transferOwnership: (officeId: string) =>
      withBase(`/offices/${officeId}/ownership`),
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
