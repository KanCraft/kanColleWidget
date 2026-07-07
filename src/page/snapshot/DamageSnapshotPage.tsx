import { useEffect, useRef, useState } from "react"
import { Routes } from "../../messages";
import type { DsnapshotSeparatePushPayload } from "../../messages";

export function DamageSnapshotPage() {
  const [uris, setURIs] = useState<string[]>([]);
  const [label, setLabel] = useState<string | null>(null);
  // 現在表示中の画像がどの戦闘(timestamp)のものかを保持する（osapi.ts DamageSnapshot.show()と同じ役割）
  // stellar:debt(scope) osapi.tsのDamageSnapshot.show()と同じtimestamp比較ロジックをここに個別実装している。
  // upgrade: 両者が使う共有predicate（例: shouldReplaceSnapshot）に統合し、将来の乖離を防ぐ。
  const shownTimestamp = useRef<number | undefined>(undefined);
  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.__action__ === Routes.DSNAPSHOT_SEPARATE_PUSH) {
        const push = msg as DsnapshotSeparatePushPayload;
        const timestamp = push.timestamp;
        // 新しい戦闘（timestampが変わった）なら前回までの画像を消して置き換える。
        // 同じtimestamp（連合艦隊の2ペイン目）は消さずに横へ追記する（#1815）。
        if (shownTimestamp.current !== timestamp) {
          setURIs([push.uri]);
          shownTimestamp.current = timestamp;
        } else {
          setURIs((prev) => [...prev, push.uri]);
        }
        if (push.label) setLabel(push.label);
      }
    });
    document.title = "艦隊状況";
    // TODO: このウィンドウのサイズ・位置を保存して次回起動時に復元する
  }, []);
  // 海域 (連戦数) ラベルをタイトルにも反映する（#1764）
  useEffect(() => {
    document.title = label ? `艦隊状況 ${label}` : "艦隊状況";
  }, [label]);
  return (
    <div id="damage-snapshot-page-root" style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}>
      {label && (
        <div style={{
          background: "rgba(0,0,0,0.8)",
          color: "#fff",
          fontSize: 12,
          lineHeight: 1.4,
          padding: "2px 6px",
          whiteSpace: "nowrap",
          flex: "none",
        }}>{label}</div>
      )}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "row-reverse",
        minHeight: 0,
      }}>
        {uris.map((uri, i) => (
          <div key={i} className="snapshot-item" style={{
            flex: 1,
            backgroundImage: `url(${uri})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
          }} />
        ))}
      </div>
    </div>
  )
}