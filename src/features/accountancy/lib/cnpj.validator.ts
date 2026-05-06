// Validação estrutural de CNPJ (algoritmo dos dígitos verificadores).
// Aceita string com ou sem máscara. Não chama Receita Federal.

const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_WEIGHTS = [6, ...FIRST_WEIGHTS];

const onlyDigits = (value: string): string => value.replace(/\D/g, '');

const calcDigit = (digits: string, weights: number[]): number => {
  const sum = weights.reduce(
    (acc, weight, idx) => acc + Number(digits[idx]) * weight,
    0,
  );
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

export const isValidCNPJ = (raw: string): boolean => {
  const digits = onlyDigits(raw ?? '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const firstDigit = calcDigit(digits.slice(0, 12), FIRST_WEIGHTS);
  if (firstDigit !== Number(digits[12])) return false;

  const secondDigit = calcDigit(digits.slice(0, 13), SECOND_WEIGHTS);
  return secondDigit === Number(digits[13]);
};
