import { useEffect, useState } from "react"

export function DamageSnapshotPage() {
  const [uris, setURIs] = useState<string[]>([]);
  
  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.__action__ === "/dsnapshot/separate:push") {
        const { uri, seaArea, battleCount } = msg;
        setURIs((prev) => [...prev, uri]);
        
        // タイトルを海域と連戦数で更新
        if (seaArea && battleCount) {
          document.title = `${seaArea} (${battleCount}) - 艦隊状況`;
        } else if (seaArea) {
          document.title = `${seaArea} - 艦隊状況`;
        } else {
          document.title = "艦隊状況";
        }
      }
    });
    // TODO: このウィンドウのサイズ・位置を保存して次回起動時に復元する
  }, []);
  return (
    <div id="damage-snapshot-page-root" style={{
      display: "flex",
      flexDirection: "row-reverse",
      width: "max-content",
      height: "100vh",
    }}>
      {uris.map((uri, i) => (
        <div key={i} className="snapshot-item">
          <img src={uri} alt={`Damage Snapshot ${i + 1}`} style={{
            height: "100%",
          }} />
        </div>
      ))}
    </div>
  )
}