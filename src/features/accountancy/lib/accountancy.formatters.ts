// Máscaras tolerantes a input parcial (não lançam exceção).
// Para apresentação fora de formulários, prefira `formatCNPJ` em src/lib/format.ts.

const onlyDigits = (value: string): string => value.replace(/\D/g, '');

export const maskCNPJ = (value: string): string => {
  const d = onlyDigits(value).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};

export const maskCEP = (value: string): string => {
  const d = onlyDigits(value).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

export const maskPhone = (value: string): string => {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

// Formatadores de exibição (input já validado: dígitos puros do backend)
export const displayCNPJ = (raw: string): string => {
  const d = onlyDigits(raw);
  if (d.length !== 14) return raw;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};

export const displayCEP = (raw: string): string => {
  const d = onlyDigits(raw);
  if (d.length !== 8) return raw;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

export const displayPhone = (raw: string): string => {
  const d = onlyDigits(raw);
  if (d.length === 11) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  if (d.length === 9) {
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  }
  return raw;
};

export const formatDateTimeBR = (date: Date | string | null): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};
