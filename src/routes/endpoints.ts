export const API_ENDPOINTS = {
  accountings: {
    listContabilidades: '/contabilidades/list-contabilidades/',
    getContabilidades: '/contabilidades/get-contabilidade/',
    createContabilidade: '/contabilidades/create-contabilidade/',
  },
  auth: {
    login: '/accounts/token/',
    logout: '/accounts/token/logout/',
    refresh: '/accounts/token/refresh/',
  },
  accounts: {
    getUser: '/accounts/get-user/',
    createUserAdmin: `/accounts/create-user/`,
    getUserById: (id: string) => `/accounts/get-user/?id=${id}`,
    updateUserById: (id: string) => `/accounts/get-user/?id=${id}`,
    deleteUser: (id: string) => `/accounts/delete-user/?id=${id}`,
  },
  societario: {
    form: {
      createOpeningForm: `/societario/create-form-abertura/`,
      getOpeningFormById: (id: string) =>
        `/societario/get-form-abertura/?form_id=${id}`,
      updateOpeningForm: (id: string) =>
        `/societario/update-form-abertura/?form_id=${id}`,
    },
    socio: {
      createSocios: `/societario/create-socios/`,
    },
    stage: {
      listStages: '/societario/list-etapas/',
      getStageById: (id: string) => `/societario/get-etapa/?etapa_id=${id}`,
    },
    process: {
      type: {
        listProcessTypes: '/societario/list-tipo-processo/',
        getProcessTypeById: (id: string) =>
          `/societario/get-tipo-processo/?tipo_processo_id=${id}`,
      },
      listProcessessByStages: '/societario/list-processos-etapas/',
      createProcess: '/societario/create-processo/',
      updateProcess: '/societario/update-processo/',
      getProcessById: (id: string) =>
        `/societario/get-processo/?processo_id=${id}`,
      deleteProcess: (id: string) => `/societario/${id}/`,
    },
  },
};
