
export async function sleep(msec: number): Promise<number> {
  return new Promise<number>(resolve => setTimeout(() => resolve(msec), msec));
}
