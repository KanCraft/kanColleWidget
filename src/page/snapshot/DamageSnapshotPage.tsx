import { useEffect, useState } from "react"

export function DamageSnapshotPage() {
  const [uris, setURIs] = useState<string[]>([]);
  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.__action__ === "/dsnapshot/separate:push") {
        setURIs((prev) => [...prev, msg.uri as string]);
      }
    });
    // TODO: どの海域の何戦目かを表示するタイトルにする
    document.title = "艦隊状況";
    // TODO: このウィンドウのサイズ・位置を保存して次回起動時に復元する
  }, []);
  return (
    <div id="damage-snapshot-page-root">
      {uris.map((uri, i) => (
        <div key={i} className="snapshot-item">
          <img src={uri} alt={`Damage Snapshot ${i + 1}`} />
        </div>
      ))}
    </div>
  )
}