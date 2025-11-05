/**
 * 通知音の再生を担うサービス。
 * 実行環境に応じて適切なドライバーを選択し、呼び出し側は単一のAPIで扱えるようにする。
 */
export class SoundPlayer {
  private static singleton: SoundPlayer | null = null;
  private readonly driver: SoundDriver;

  private constructor(driver: SoundDriver) {
    this.driver = driver;
  }

  public static shared(): SoundPlayer {
    if (!this.singleton) {
      this.singleton = new SoundPlayer(resolveDriver());
    }
    return this.singleton;
  }

  /**
   * 通知音を再生する。
   * @param url 再生する音源のURL。null/空文字の場合は何もしない。
   */
  public async play(url: string | null): Promise<void> {
    if (!url) return;
    try {
      await this.driver.play(url);
    } catch {
      // 再生失敗は通知処理そのものを阻害しない
    }
  }
}

interface SoundDriver {
  play(url: string): Promise<void>;
}

const OFFSCREEN_DOCUMENT_PATH = "offscreen/index.html";
export const SOUND_PLAY_ACTION = "/sound/play";

function resolveDriver(): SoundDriver {
  if (typeof globalThis.Audio === "function") {
    return new AudioElementSoundDriver();
  }
  if (chrome.offscreen) {
    return new OffscreenSoundDriver(OFFSCREEN_DOCUMENT_PATH, SOUND_PLAY_ACTION);
  }
  return new NullSoundDriver();
}

class AudioElementSoundDriver implements SoundDriver {
  public async play(url: string): Promise<void> {
    if (!url) return;
    const audio = new Audio(url);
    await audio.play();
  }
}

class OffscreenSoundDriver implements SoundDriver {
  private creating: Promise<void> | null = null;

  constructor(
    private readonly offscreenPath: string,
    private readonly action: string,
  ) { }

  public async play(url: string): Promise<void> {
    if (!chrome.offscreen) return;
    await this.ensureDocument();
    try {
      await chrome.runtime.sendMessage({ __action__: this.action, url });
    } catch {
      // リスナー不在などは無視
    }
  }

  private async ensureDocument(): Promise<void> {
    const offscreenUrl = chrome.runtime.getURL(this.offscreenPath);
    if (await this.hasDocument(offscreenUrl)) {
      return;
    }
    if (!this.creating) {
      this.creating = chrome.offscreen.createDocument({
        url: this.offscreenPath,
        reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: "通知音をサービスワーカーから再生するため",
      });
    }
    try {
      await this.creating;
    } finally {
      this.creating = null;
    }
  }

  private async hasDocument(offscreenUrl: string): Promise<boolean> {
    const runtime = chrome.runtime as typeof chrome.runtime & {
      getContexts?: (filter: {
        contextTypes: string[];
        documentUrls: string[];
      }) => Promise<Array<unknown>>;
    };
    if (typeof runtime.getContexts === "function") {
      const contexts = await runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [offscreenUrl],
      });
      if (contexts.length > 0) return true;
    } else {
      const scope = globalThis as typeof globalThis & {
        clients?: {
          matchAll: (options?: unknown) => Promise<Array<{ url?: string }>>;
        };
      };
      if (scope.clients) {
        const matchedClients = await scope.clients.matchAll();
        if (matchedClients.some((client) => client.url === offscreenUrl)) {
          return true;
        }
      }
    }
    return false;
  }
}

class NullSoundDriver implements SoundDriver {
  public async play(): Promise<void> {
    return;
  }
}
