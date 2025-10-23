
export function FleetCapturePage() {
  return (
    <div className="p-8" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 className="text-3xl font-bold">艦隊キャプチャ</h1>
      <div className="mt-4">
        「編成キャプチャ」とは、艦隊編成画面のスクリーンショットを手動で取得し、統合し、一枚の画像として保存する機能です。<br />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex-1 text-8xl font-bold p-12 bg-yellow-300 text-center w-100">建設予定地</div>
      </div>
    </div>
  );
}
