export function seq(end: number): number[] {
  const start = 0
  const step = 1
  const values: number[] = []
  for (let index = start; index < end; index += step) {
    values.push(index)
  }
  return values
}
