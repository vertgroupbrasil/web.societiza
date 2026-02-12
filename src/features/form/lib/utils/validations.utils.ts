export function extractErrorDetails(
  errors: any,
): Array<{ field: string; message: string }> {
  const errorList: Array<{ field: string; message: string }> = [];

  const traverseErrors = (obj: any, path = '') => {
    Object.keys(obj || {}).forEach((key) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (obj[key]?.message) {
        errorList.push({
          field: currentPath,
          message: obj[key].message,
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverseErrors(obj[key], currentPath);
      }
    });
  };

  traverseErrors(errors);
  return errorList;
}

export function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function validateResponsibilityFields(
  currentValues: any,
  form: any,
  setShowFieldErrors: (show: boolean) => void,
) {
  const respErrors: string[] = [];

  if (!currentValues.info_adicionais.nome_responsavel) {
    respErrors.push('Nome do responsável');
    form.setError('info_adicionais.nome_responsavel', {
      message: 'Nome obrigatório quando há responsabilidade técnica',
    });
  }

  if (!currentValues.info_adicionais.nmr_carteira_profissional) {
    respErrors.push('Número da carteira');
    form.setError('info_adicionais.nmr_carteira_profissional', {
      message: 'Carteira obrigatória quando há responsabilidade técnica',
    });
  }

  if (!currentValues.info_adicionais.uf) {
    respErrors.push('UF da carteira');
    form.setError('info_adicionais.uf', {
      message: 'UF obrigatória quando há responsabilidade técnica',
    });
  }

  if (
    !currentValues.info_adicionais.area_resp ||
    currentValues.info_adicionais.area_resp <= 0
  ) {
    respErrors.push('Área de responsabilidade');
    form.setError('info_adicionais.area_resp', {
      message: 'Área obrigatória quando há responsabilidade técnica',
    });
  }

  if (respErrors.length > 0) {
    setShowFieldErrors(true);
  }

  return respErrors;
}
