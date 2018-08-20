
export default function hello(message: string, times: number = 2): string {
  return Array<string>(times).fill(message).join(",");
}
