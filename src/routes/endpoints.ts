const api = process.env.NEXT_PUBLIC_API_URL;

const withBase = (endpoint: string) => `${api}${endpoint}`;

export const API_ENDPOINTS = {
  accountings: {
    listContabilidades: withBase('/contabilidades/list-contabilidades/'),
    getContabilidades: withBase('/contabilidades/get-contabilidade/'),
    createContabilidade: withBase('/contabilidades/create-contabilidade/'),
  },
  auth: {
    login: withBase('/accounts/token/'),
    logout: withBase('/accounts/token/logout/'),
    refresh: withBase('/accounts/token/refresh/'),
  },
  accounts: {
    getUser: withBase('/accounts/get-user/'),
    createUserAdmin: withBase('/accounts/create-user/'),
    getUserById: (id: string) =>
      withBase(`/accounts/get-user/?id=${id}`),
    updateUserById: (id: string) =>
      withBase(`/accounts/get-user/?id=${id}`),
    deleteUser: (id: string) =>
      withBase(`/accounts/delete-user/?id=${id}`),
  },
  societario: {
    form: {
      createOpeningForm: withBase('/societario/create-form-abertura/'),
      getOpeningFormById: (id: string) =>
        withBase(`/societario/get-form-abertura/?form_id=${id}`),
      updateOpeningForm: (id: string) =>
        withBase(`/societario/update-form-abertura/?form_id=${id}`),
    },
    socio: {
      createSocios: withBase('/societario/create-socios/'),
    },
    stage: {
      listStages: withBase('/societario/list-etapas/'),
      getStageById: (id: string) =>
        withBase(`/societario/get-etapa/?etapa_id=${id}`),
    },
    process: {
      type: {
        listProcessTypes: withBase('/societario/list-tipo-processo/'),
        getProcessTypeById: (id: string) =>
          withBase(`/societario/get-tipo-processo/?tipo_processo_id=${id}`),
      },
      listProcessessByStages: withBase('/societario/list-processos-etapas/'),
      createProcess: withBase('/societario/create-processo/'),
      updateProcess: withBase('/societario/update-processo/'),
      getProcessById: (id: string) =>
        withBase(`/societario/get-processo/?processo_id=${id}`),
      deleteProcess: (id: string) =>
        withBase(`/societario/${id}/`),
    },
  },
};
