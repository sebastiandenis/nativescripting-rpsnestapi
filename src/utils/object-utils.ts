export function pickRandomProperty(obj: any) {
  let result: any;
  let count = 0;
  for (const prop of obj) {
    if (Math.random() < 1 / ++count) {
      result = prop;
    }
  }
  return result;
}
