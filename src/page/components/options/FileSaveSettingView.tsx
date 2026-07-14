import { FileSaveConfig, type ImageFormat } from "../../../models/configs/FileSaveConfig";
import { FoldableSection } from "../FoldableSection";
import { useConfigField } from "./useConfigField";

export function FileSaveSettingView({
  config,
}: {
  config: FileSaveConfig;
}) {
  const [askAlways, saveAskAlways] = useConfigField(config, "askAlways", config.askAlways);
  const [editBeforeSave, saveEditBeforeSave] = useConfigField(config, "editBeforeSave", config.editBeforeSave);
  const [folder, saveFolder] = useConfigField(config, "folder", config.folder || "");
  const [filenameTemplate, saveFilenameTemplate] = useConfigField(config, "filenameTemplate", config.filenameTemplate || "");
  const [format, saveFormat] = useConfigField(config, "format", config.format);
  const preview = config.getFilename(new Date());

  return (
    <FoldableSection title="スクショ保存の設定" id="file-save">
      <div className="mb-4">
        <p>スクリーンショットの保存先フォルダとファイル名のテンプレートを設定できます.</p>
      </div>

      <div className="mb-6">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={askAlways}
            onChange={(e) => void saveAskAlways(e.target.checked)}
          />
          <div>
            <div className="font-bold">毎回保存先を確認する</div>
            <div className="text-sm text-gray-600">
              有効にすると保存ダイアログを開き、任意のファイル名や場所を都度選べます。
            </div>
          </div>
        </label>
      </div>

      <div className="mb-6">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={editBeforeSave}
            onChange={(e) => void saveEditBeforeSave(e.target.checked)}
          />
          <div>
            <div className="font-bold">保存前に編集画面を開く</div>
            <div className="text-sm text-gray-600">
              有効にすると撮影後すぐにはダウンロードせず、切り取りや描き込みができる編集画面を開きます。ダウンロードは編集画面の保存ボタンで行ないます。
            </div>
          </div>
        </label>
      </div>

      <div className="mb-4">
        <div className="mb-4">
          <label className="block mb-2">
            <span className="font-bold">保存先フォルダ名</span>
            <span className="text-sm text-gray-600 ml-2">(~/Downloads/ 以下のフォルダ)</span>
          </label>
          <input
            type="text"
            value={folder}
            onChange={(e) => void saveFolder(e.target.value)}
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
            <span className="text-sm text-gray-600 ml-2">(拡張子は保存フォーマットに従う)</span>
          </label>
          <div className="flex items-center gap-2 w-full max-w-md">
            <input
              type="text"
              value={filenameTemplate}
              onChange={(e) => void saveFilenameTemplate(e.target.value)}
              className="border rounded p-2 flex-1 font-mono"
              placeholder="%Y%m%d_%H%M%S"
            />
            <select
              value={format}
              onChange={(e) => void saveFormat(e.target.value as ImageFormat)}
              className="border rounded p-2 font-mono"
            >
              <option value="png">.png</option>
              <option value="jpeg">.jpeg</option>
            </select>
          </div>
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
