export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}

export function formatDateBR(isoDate: String | Date) {
  if (typeof isoDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    throw new Error('Data inválida. Use o formato "YYYY-MM-DD".');
  }

  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function formatISOToBRDate(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (isNaN(date.getTime())) {
    throw new Error('Data inválida. Use o formato ISO 8601.');
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D+/g, '');
  if (digits.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}
