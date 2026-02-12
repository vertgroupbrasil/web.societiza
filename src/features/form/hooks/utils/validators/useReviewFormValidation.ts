'use client';
import { useState, useCallback } from 'react';
import { CompanyData, PartnersData } from '@form/index';

interface UseReviewFormValidationProps {
  companyData?: CompanyData | undefined; // ✅ Explicitamente aceita undefined
  partnersData?: PartnersData | undefined; // ✅ Explicitamente aceita undefined
}

export const useReviewFormValidation = ({
  companyData,
  partnersData,
}: UseReviewFormValidationProps) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateCompanyData = useCallback((): string[] => {
    const errors: string[] = [];

    if (!companyData) {
      errors.push('Dados da empresa não encontrados');
      return errors;
    }

    // Validações básicas
    if (!companyData.nome_fantasia) errors.push('Nome fantasia é obrigatório');
    if (!companyData.email) errors.push('Email da empresa é obrigatório');
    if (!companyData.telefone) errors.push('Telefone da empresa é obrigatório');

    // Validações de endereço
    if (!companyData.endereco?.rua) errors.push('Rua da empresa é obrigatória');
    if (!companyData.endereco?.numero)
      errors.push('Número da empresa é obrigatório');
    if (!companyData.endereco?.bairro)
      errors.push('Bairro da empresa é obrigatório');
    if (!companyData.endereco?.cep) errors.push('CEP da empresa é obrigatório');
    if (!companyData.endereco?.municipio)
      errors.push('Município da empresa é obrigatório');
    if (!companyData.endereco?.uf) errors.push('UF da empresa é obrigatória');

    // Validações condicionais
    if (
      !companyData.capital_integralizado &&
      !companyData.data_integralizacao
    ) {
      errors.push(
        'Data de integralização é obrigatória quando capital não está totalmente integralizado',
      );
    }

    if (companyData.info_adicionais?.resp_tecnica) {
      if (!companyData.info_adicionais.nome_responsavel) {
        errors.push('Nome do responsável técnico é obrigatório');
      }
      if (!companyData.info_adicionais.nmr_carteira_profissional) {
        errors.push('Número da carteira profissional é obrigatório');
      }
      if (!companyData.info_adicionais.uf) {
        errors.push('UF da carteira profissional é obrigatória');
      }
      if (!companyData.info_adicionais.area_resp) {
        errors.push('Área de responsabilidade é obrigatória');
      }
    }

    return errors;
  }, [companyData]);

  const validatePartnersData = useCallback((): string[] => {
    const errors: string[] = [];

    if (!partnersData) {
      errors.push('Dados dos sócios não encontrados');
      return errors;
    }

    if (!partnersData.socios || partnersData.socios.length === 0) {
      errors.push('É necessário ter pelo menos um sócio');
      return errors;
    }

    // Validar cada sócio
    partnersData.socios.forEach((socio, index) => {
      const socioLabel = `Sócio ${index + 1}`;

      if (!socio.nome) errors.push(`${socioLabel}: Nome é obrigatório`);
      if (!socio.nacionalidade)
        errors.push(`${socioLabel}: Nacionalidade é obrigatória`);
      if (!socio.data_nascimento)
        errors.push(`${socioLabel}: Data de nascimento é obrigatória`);
      if (!socio.profissao)
        errors.push(`${socioLabel}: Profissão é obrigatória`);
      if (!socio.cpf) errors.push(`${socioLabel}: CPF é obrigatório`);
      if (!socio.rg) errors.push(`${socioLabel}: RG é obrigatório`);
      if (!socio.orgao_expedidor)
        errors.push(`${socioLabel}: Órgão expedidor é obrigatório`);
      if (!socio.uf) errors.push(`${socioLabel}: UF é obrigatória`);
      if (!socio.qtd_cotas || socio.qtd_cotas <= 0)
        errors.push(
          `${socioLabel}: Quantidade de cotas deve ser maior que zero`,
        );

      // Validações condicionais
      if (socio.estado_civil === 'casado' && !socio.regime_casamento) {
        errors.push(
          `${socioLabel}: Regime de casamento é obrigatório para casados`,
        );
      }

      if (socio.administrador && !socio.tipo_administrador) {
        errors.push(
          `${socioLabel}: Tipo de administrador é obrigatório quando é administrador`,
        );
      }

      // Validar endereço do sócio
      if (!socio.endereco?.rua) errors.push(`${socioLabel}: Rua é obrigatória`);
      if (!socio.endereco?.numero)
        errors.push(`${socioLabel}: Número é obrigatório`);
      if (!socio.endereco?.bairro)
        errors.push(`${socioLabel}: Bairro é obrigatório`);
      if (!socio.endereco?.cep) errors.push(`${socioLabel}: CEP é obrigatório`);
      if (!socio.endereco?.municipio)
        errors.push(`${socioLabel}: Município é obrigatório`);
      if (!socio.endereco?.uf) errors.push(`${socioLabel}: UF é obrigatória`);
    });

    return errors;
  }, [partnersData]);

  const validateAllData = useCallback(async (): Promise<{
    isValid: boolean;
    errors: string[];
  }> => {
    setIsValidating(true);

    try {
      const companyErrors = validateCompanyData();
      const partnersErrors = validatePartnersData();

      const allErrors = [...companyErrors, ...partnersErrors];
      setValidationErrors(allErrors);

      return {
        isValid: allErrors.length === 0,
        errors: allErrors,
      };
    } finally {
      setIsValidating(false);
    }
  }, [validateCompanyData, validatePartnersData]);

  const getTotalQuotas = useCallback((): number => {
    if (!partnersData?.socios) return 0;
    return partnersData.socios.reduce(
      (total, socio) => total + (socio.qtd_cotas || 0),
      0,
    );
  }, [partnersData]);

  const getAdministrators = useCallback(() => {
    if (!partnersData?.socios) return [];
    return partnersData.socios.filter((socio) => socio.administrador);
  }, [partnersData]);

  return {
    validationErrors,
    isValidating,
    validateAllData,
    getTotalQuotas,
    getAdministrators,
    hasCompanyData: !!companyData,
    hasPartnersData: !!partnersData && !!partnersData.socios?.length,
    isDataComplete:
      !!companyData && !!partnersData && !!partnersData.socios?.length,
  };
};
