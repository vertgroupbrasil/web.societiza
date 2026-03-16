const api = process.env.NEXT_PUBLIC_API_URL;

const withBase = (endpoint?: string) => `${api}${endpoint}`;

export const API_ENDPOINTS = {
  accountings: {
    createContabilidade: withBase('/societario/create-contabilidade/'),
    listContabilidades: withBase('/societario/list-contabilidades/'),
    deleteContabilidade: (id: string) =>
      withBase(`/societario/delete-contabilidade/?id=${id}`),
  },
  accountancy: {
    accountancy: (id: string) => withBase(`/accountancy/${id}`),
  },
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
  corporate: {
    form: {
      createOpeningForm: withBase('/societario/create-form-abertura/'),
      getOpeningFormById: (id: string) =>
        withBase(`/societario/get-form-abertura/?form_id=${id}`),
      updateOpeningForm: (id: string) =>
        withBase(`/societario/update-form-abertura/?form_id=${id}`),
    },
    partner: {
      createPartners: withBase('/societario/create-socios/'),
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
        withBase(`/societario/delete-processo/?id=${id}`),
    },
  },
  external: {
    viacep: {
      get: (cep: string) => `https://viacep.com.br/ws/${cep}/json/`,
    },
  },
};
