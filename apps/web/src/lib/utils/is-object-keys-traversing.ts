export function isObjectKeysTraversing<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x;
}
