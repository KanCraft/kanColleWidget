import { useNavigate, useRevalidator } from "react-router-dom";
import { Frame } from "../../../models/Frame";
import { Launcher } from "../../../services/Launcher";
import { ScriptingService } from "../../../services/ScriptingService";
import { FoldableSection } from "../FoldableSection";

export function FrameSettingView({frames}: {frames: Frame[]}) {
  const launcher = new Launcher();
  const scripts = new ScriptingService();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  return (
    <FoldableSection title="別窓化の設定" id="frames">
      <div className="mb-4">
        <p>現在開いている窓のサイズを新規設定として追加できます. アドレスバーの有無とかは細かいんで需要があれば将来対応します.</p>
      </div>
      <div className="mb-4">
        {frames.map((frame) => (
          <div key={frame._id} className="border rounded p-2 mb-2 flex items-center">
            <div><h3 className="text-lg">{frame.name}</h3></div>
            <div className="grow"></div>
            {frame.protected ? null : <div>
              <button className="border rounded p-2 cursor-pointer border-slate-200 bg-slate-100"
                onClick={async () => { await frame.delete(); navigate("/options?open=frames"); }}
              >削除</button>
            </div>}
          </div>
        ))}
      </div>
      <div className="mb-4 flex space-x-4">
        <div className="">
          <button className="border rounded p-2 cursor-pointer border-slate-200 bg-red-400 text-white"
            onClick={async () => { await Frame.drop(); revalidator.revalidate(); }}
          >窓設定を全部消して初期化する</button>
        </div>
        <div className="">
          <button className="border rounded p-2 cursor-pointer border-slate-200 bg-blue-400"
            onClick={async () => {
              const win = await launcher.find();
              if (!win) return window.alert("艦これウィジェットが開いている別窓が見つかりませんでした。");
              const [{ result }] = await scripts.func(win.tabs![0].id!, () => {
                return { size: { width: window.innerWidth, height: window.innerHeight } };
              });
              if (!result) return window.alert("ウィンドウサイズの取得に失敗しました。");
              const name = window.prompt("新規設定の名前を入力してください。");
              await Frame.create({ name, ...result, position: { left: win.left, top: win.top } });
              navigate("/options?open=frames");
            }}
          >今開いている別窓を新規設定として登録</button>
        </div>
      </div> 
    </FoldableSection>
  )
}
