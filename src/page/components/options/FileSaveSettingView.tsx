import { useState } from "react";
import { FileSaveConfig } from "../../../models/configs/FileSaveConfig";
import { FoldableSection } from "../FoldableSection";

export function FileSaveSettingView({
  config: _config,
}: {
  config: FileSaveConfig;
}) {
  const [config] = useState<FileSaveConfig>(_config);
  const [folder, setFolder] = useState<string>(_config.folder);
  const [preview, setPreview] = useState<string>(_config.getFilename(new Date()));

  return (
    <FoldableSection title="スクショ保存の設定" id="file-save">
      <div className="mb-4">
        <p>スクリーンショットの保存先フォルダとファイル名のテンプレートを設定できます.</p>
      </div>

      <div className="mb-4">
        <div className="mb-4">
          <label className="block mb-2">
            <span className="font-bold">保存先フォルダ名</span>
            <span className="text-sm text-gray-600 ml-2">(~/Downloads/ 以下のフォルダ)</span>
          </label>
          <input
            type="text"
            defaultValue={config.folder || ""}
            onChange={async (e) => {
              await config.update({ folder: e.target.value });
              setFolder(e.target.value);
            }}
            className="border rounded p-2 w-full max-w-md"
            placeholder="艦これ"
          />
          <div className="text-sm text-gray-600 mt-1">
            保存先: <span className="font-bold">~/Downloads/{folder}/</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            <span className="font-bold">ファイル名テンプレート</span>
          </label>
          <input
            type="text"
            defaultValue={config.filenameTemplate || ""}
            onChange={async (e) => {
              await config.update({ filenameTemplate: e.target.value });
              setPreview(config!.getFilename(new Date()));
            }}
            className="border rounded p-2 w-full max-w-md font-mono"
            placeholder="%Y%m%d_%H%M%S.png"
          />
          <div className="text-sm text-gray-600 mt-1">
            <div>使用可能な変数 ( %Y: 年(4桁), %m: 月(2桁), %d: 日(2桁) %H: 時(2桁), %M: 分(2桁), %S: 秒(2桁))</div>
            <div className="mt-2">
              プレビュー: <span className="font-mono font-bold">{preview}</span>
            </div>
          </div>
        </div>
      </div>
    </FoldableSection>
  );
}
