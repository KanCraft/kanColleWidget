import { describe, expect, expectTypeOf, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { useTypedLoaderData } from "../src/page/loader/useTypedLoaderData";

// ダミー loader。実データ形状に依存しない最小のオブジェクトを返す
async function dummyLoader() {
  return { value: "hello" };
}

function DummyComponent() {
  const { value } = useTypedLoaderData<typeof dummyLoader>();
  return <div>{value}</div>;
}

// DummyComponent を loader データ付きで単体レンダリングする。
// loader の非同期初期化を待たずに済むよう、hydrationData で初期データを与える。
function renderDummy(value: string) {
  const router = createMemoryRouter(
    [{ id: "dummy", path: "/", element: <DummyComponent />, loader: dummyLoader }],
    { hydrationData: { loaderData: { dummy: { value } } } },
  );
  return render(<RouterProvider router={router} />);
}

describe("useTypedLoaderData", () => {
  it("loader の返り値をそのままコンポーネントへ素通しする", async () => {
    renderDummy("hello");
    expect(await screen.findByText("hello")).toBeInTheDocument();
  });

  it("戻り値の型が loader の Awaited<ReturnType> と一致する", () => {
    type Result = ReturnType<typeof useTypedLoaderData<typeof dummyLoader>>;
    expectTypeOf<Result>().toEqualTypeOf<Awaited<ReturnType<typeof dummyLoader>>>();
  });
});
