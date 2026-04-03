export function getNextIndexedLabel(
  values: string[],
  prefix: string,
) {
  const normalizedValues = new Set(
    values.map((value) => value.trim().toLocaleLowerCase()),
  );

  let nextIndex = 1;

  while (normalizedValues.has(`${prefix} ${nextIndex}`.toLocaleLowerCase())) {
    nextIndex += 1;
  }

  return `${prefix} ${nextIndex}`;
}
