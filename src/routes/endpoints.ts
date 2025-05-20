export const API_ENDPOINTS = {
  contabilidades: {
    listContabilidades: "/contabilidades/list-contabilidades/",
    getContabilidades: "/contabilidades/get-contabilidade/",
    createContabilidade: "/contabilidades/create-contabilidade/",
  },
  auth: {
    login: "/accounts/token/",
    logout: "/accounts/token/logout/",
    refresh: "/accounts/token/refresh/",
  },
  accounts: {
    getUser: "/accounts/get-user/",
    createUserAdmin: `/accounts/create-user/`,
    getUserById: (id: string) => `/accounts/get-user/?id=${id}`,
    updateUserById: (id: string) => `/accounts/get-user/?id=${id}`,
    deleteUser: (id: string) => `/accounts/delete-user/?id=${id}`,
  },
  societario: {
    formulario: {
      createFormularioAbertura: `/societario/create-form-abertura/`,
      getFormularioAberturaById: (id: string) =>
        `/societario/get-form-abertura/?form_id=${id}`,
      updateFormularioAbertura: (id: string) =>
        `/societario/update-form-abertura/?form_id=${id}`,
    },
    socio: {
      createSocios: `/societario/create-socios/`,
    },
    etapa: {
      listEtapas: "/societario/list-etapas/",
      getEtapaById: (id: string) => `/societario/get-etapa/?etapa_id=${id}`,
    },
    processo: {
      tipo: {
        listTipoProcessos: "/societario/list-tipo-processo/",
        getTipoProcessoById: (id: string) =>
          `/societario/get-tipo-processo/?tipo_processo_id=${id}`,
      },
      listProcessosPorEtapas: "/societario/list-processos-etapas/",
      createProcesso: "/societario/create-processo/",
      updateProcesso: "/societario/update-processo/",
      getProcessoById: (id: string) =>
        `/societario/get-processo/?processo_id=${id}`,
      deleteProcesso: (id: string) => `/societario/${id}/`,
    },
  },
};
