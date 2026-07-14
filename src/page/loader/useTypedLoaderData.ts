import { useLoaderData } from "react-router-dom";

/**
 * loader 関数の戻り値型から useLoaderData の結果を型付けするフック。
 * 型の真実源を loader 関数本体に一元化し、ページ側の手書き型注釈との乖離を防ぐ。
 * 使用例: const { sorties } = useTypedLoaderData<typeof logbook>();
 */
export function useTypedLoaderData<Loader extends (...args: never[]) => unknown>(): Awaited<ReturnType<Loader>> {
  return useLoaderData() as Awaited<ReturnType<Loader>>;
}
