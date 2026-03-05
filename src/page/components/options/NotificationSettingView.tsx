import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { FoldableSection } from "../FoldableSection";
import { NotificationConfig } from "../../../models/configs/NotificationConfig";
import { Entry, EntryType, Fatigue, Mission, Recovery, Shipbuild, TriggerType } from "../../../models/entry";
import { NotificationService } from "../../../services/NotificationService";

type NotificationConfigMap = Record<TriggerType.START | TriggerType.END, NotificationConfig>;

const TRIGGER_ORDER: Array<TriggerType.START | TriggerType.END> = [TriggerType.START, TriggerType.END];
const ENTRY_ORDER: EntryType[] = [
  EntryType.MISSION,
  EntryType.RECOVERY,
  EntryType.SHIPBUILD,
  EntryType.FATIGUE,
];
const ENTRY_LABELS: Record<EntryType, string> = {
  [EntryType.MISSION]: "遠征",
  [EntryType.RECOVERY]: "入渠",
  [EntryType.SHIPBUILD]: "建造",
  [EntryType.FATIGUE]: "疲労回復",
  [EntryType.UNKNOWN]: "その他",
  [EntryType.TEST_DEFAULT]: "デフォルト",
};
const TRIGGER_LABELS: Record<TriggerType.START | TriggerType.END, string> = {
  [TriggerType.START]: "開始時",
  [TriggerType.END]: "完了時",
};

export function NotificationSettingView({
  defaults,
  entries,
}: {
  defaults: NotificationConfigMap;
  entries: Record<EntryType, NotificationConfigMap>;
}) {
  const createInitialEnabledMap = () => {
    const map: Record<string, boolean> = {};
    TRIGGER_ORDER.forEach((trigger) => {
      map[`default-${trigger}`] = defaults[trigger].enabled ?? true;
    });
    ENTRY_ORDER.forEach((type) => {
      TRIGGER_ORDER.forEach((trigger) => {
        map[`${type}-${trigger}`] = entries[type][trigger].enabled ?? true;
      });
    });
    return map;
  };
  const initialEnabledMap = createInitialEnabledMap();
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(initialEnabledMap);
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(Object.values(initialEnabledMap).some(Boolean));
  const [updatingAll, setUpdatingAll] = useState<boolean>(false);

  const updateGlobalFlag = (map: Record<string, boolean>) => {
    setGlobalEnabled(Object.values(map).some(Boolean));
  };

  const handleEnabledChange = (id: string, next: boolean) => {
    setEnabledMap((prev) => {
      const updated = { ...prev, [id]: next };
      updateGlobalFlag(updated);
      return updated;
    });
  };

  const handleToggleAll = async (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    setUpdatingAll(true);
    const updated: Record<string, boolean> = {};
    Object.keys(enabledMap).forEach((key) => {
      updated[key] = next;
    });
    setEnabledMap(updated);
    updateGlobalFlag(updated);
    const updatedConfigs: NotificationConfig[] = [];
    const seen = new Set<NotificationConfig>();
    TRIGGER_ORDER.forEach((trigger) => {
      const config = defaults[trigger];
      if (!seen.has(config)) {
        seen.add(config);
        updatedConfigs.push(config);
      }
    });
    ENTRY_ORDER.forEach((type) => {
      TRIGGER_ORDER.forEach((trigger) => {
        const config = entries[type][trigger];
        if (!seen.has(config)) {
          seen.add(config);
          updatedConfigs.push(config);
        }
      });
    });
    try {
      await Promise.all(updatedConfigs.map(async (config) => {
        await config.update({ enabled: next });
      }));
    } finally {
      setUpdatingAll(false);
    }
  };

  return (
    <FoldableSection title="通知の設定" id="notifications">
      <div className="py-2">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={globalEnabled}
            onChange={handleToggleAll}
            disabled={updatingAll}
          />
          <span className="text-lg font-bold">通知を使用する</span>
          <span>OSの設定でChromeの通知が有効になっている必要があります</span>
        </label>
      </div>

      {globalEnabled ? (
        <>
          <div className="mb-4">
            <div className="grid gap-4 md:grid-cols-2">
              {TRIGGER_ORDER.map((trigger) => (
                <NotificationConfigEditor
                  key={`default-${trigger}`}
                  title={`${TRIGGER_LABELS[trigger]} （デフォルト）`}
                  config={defaults[trigger]}
                  configId={`default-${trigger}`}
                  enabled={enabledMap[`default-${trigger}`]}
                  onEnabledChange={handleEnabledChange}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {ENTRY_ORDER.map((type) => (
              <div key={type} className="grid gap-4 md:grid-cols-2">
                {TRIGGER_ORDER.map((trigger) => (
                  <NotificationConfigEditor
                    key={`${type}-${trigger}`}
                    title={`${ENTRY_LABELS[type]} ${TRIGGER_LABELS[trigger]}`}
                    config={entries[type][trigger]}
                    configId={`${type}-${trigger}`}
                    enabled={enabledMap[`${type}-${trigger}`]}
                    onEnabledChange={handleEnabledChange}
                  />
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="border border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 text-sm text-gray-600">
          通知は無効化されています。個別設定を変更するには「通知を使用する」をオンにしてください。
        </div>
      )}
    </FoldableSection>
  );
}

function NotificationConfigEditor({
  title,
  description,
  config,
  enabled,
  configId,
  onEnabledChange,
}: {
  title: string;
  description?: string;
  config: NotificationConfig;
  enabled: boolean;
  configId: string;
  onEnabledChange: (id: string, next: boolean) => void;
}) {
  const [type, trigger] = config._id?.split("/").slice(1) as [EntryType, TriggerType];
  return (
    <div className="border border-slate-200 rounded-md p-2 space-y-2 bg-white">
      <div className="flex">
        <div className="font-bold text-base flex-1">{title}</div>
        {description ? <p className="text-sm text-gray-600 mt-1">{description}</p> : null}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={enabled}
            onChange={async (event) => {
              const next = event.target.checked;
              onEnabledChange(configId, next);
              await config.update({ enabled: next });
            }}
          />
          <span>有効にする</span>
        </label>
      </div>

      <div className="flex items-center space-x-4">
        <IconSettingView config={config} configId={configId} />
        <SoundSettingView config={config} configId={configId} />
        <StaySettingView config={config} />
        {type !== "default" ?
          <div className="flex-1 flex justify-end">
            <TestPlayView config={config} type={type} trigger={trigger} />
          </div>
          : null}
      </div>
    </div>
  );
}

function IconSettingView({
  config, configId,
}: {
  config: NotificationConfig;
  configId: string;
}) {
  const [icon, setIcon] = useState<string>(config.icon ?? "");
  return (
    <div className="flex items-center space-x-2">
      <div className="font-bold">アイコン画像</div>
      <label className="cursor-pointer">
        <input type="file" accept="image/*" className="hidden" id={`icon-file-input-${configId}`}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async () => {
              const result = reader.result;
              if (typeof result === "string") {
                setIcon(result);
                await config.update({ icon: result });
              }
            };
            reader.readAsDataURL(file);
            event.target.value = "";
          }}
        />
        {icon
          ? <img src={icon} alt="通知アイコンのプレビュー" className="w-12 h-12 object-contain border" />
          : <div className="w-12 h-12 border bg-slate-100 flex items-center justify-center text-gray-400"></div>
        }
      </label>
    </div>
  );
}

function SoundSettingView({
  config, configId,
}: {
  config: NotificationConfig;
  configId: string;
}) {
  const [sound, setSound] = useState<string>(config.sound ?? "");
  return (
    <div className="flex items-center space-x-2">
      <div className="font-bold">通知音</div>
      <div className="flex items-center">
        {sound ? (
          <audio controls src={sound} className="h-8 m-0" />
        ) : null}
        <label className="cursor-pointer">
          <input type="file" accept="audio/mp3,wav" className="hidden" id={`sound-file-input-${configId}`}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              // Read file as data URL
              const reader = new FileReader();
              reader.onload = async () => {
                const result = reader.result;
                if (typeof result === "string") {
                  setSound(result);
                  await config.update({ sound: result });
                }
              };
              reader.readAsDataURL(file);
              // Reset input
              event.target.value = "";
            }}
          />
          {sound ? null : <div className="w-12 h-12 border bg-slate-100 flex items-center justify-center text-gray-400"></div>}
        </label>
        {sound ? (
          <button className="ml-2 text-sm text-red-500 underline"
            onClick={async () => {
              setSound("");
              await config.update({ sound: null });
            }}
          >
            クリア
          </button>
        ) : null}
      </div>
    </div>
  )
}

function StaySettingView({
  config,
}: {
  config: NotificationConfig;
}) {
  const [stay, setStay] = useState<boolean | null>(config.stay);
  return (
    <CycleButton
      value={stay}
      onChange={async (next) => {
        setStay(next);
        await config.update({ stay: next });
      }}
      label={<span className="font-bold">通知消去</span>}
      buttonClassName="bg-white hover:bg-slate-50"
      options={[
        { value: null, label: <span className="text-gray-400">デフォルト</span> },
        { value: false, label: <span>自動</span> },
        { value: true, label: <span>手動</span> },
      ]}
    />
  );
}

function TestPlayView({
  type,
  trigger,
}: {
  config: NotificationConfig;
  type: EntryType;
  trigger: TriggerType;
}) {
  const entry: Entry = (() => {
    switch (type) {
    case EntryType.MISSION:
      return new Mission("テスト", 0, { title: "テスト遠征", category: "test", time: 60 });
    case EntryType.RECOVERY:
      return new Recovery("テスト", 60);
    case EntryType.SHIPBUILD:
      return new Shipbuild("テスト", 60);
    case EntryType.FATIGUE:
      return new Fatigue("テスト", { area: 0, info: 0 });
    }
  })()!;
  return (
    <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
      onClick={async () => {
        const s = new NotificationService();
        s.notify(entry, trigger);
      }}
    >
      テスト通知を送信
    </button>
  );
}

type CycleButtonOption<T> = {
  value: T;
  label: ReactNode;
};

function CycleButton<T>({
  value,
  onChange,
  options,
  label,
  buttonClassName,
}: {
  value: T;
  onChange: (next: T) => void;
  options: CycleButtonOption<T>[];
  label?: ReactNode;
  buttonClassName?: string;
}) {
  const currentIndex = options.findIndex((opt) => opt.value === value);
  const nextIndex = (currentIndex + 1) % options.length;
  const currentLabel = options[currentIndex]?.label ?? options[0].label;
  return (
    <div className="flex items-center space-x-2">
      {label}
      <button
        onClick={() => onChange(options[nextIndex].value)}
        className={`px-3 py-1 border border-slate-200 rounded text-sm ${buttonClassName || ""}`}
      >
        {currentLabel}
      </button>
    </div>
  );
}