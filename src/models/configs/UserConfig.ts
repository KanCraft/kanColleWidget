import { Model } from "jstorm/chrome/local";

// ユーザー設定シングルトン（キー "user"）を持つ Config モデルの共通基底。
// 派生クラスは static default に "user" キーの初期値を必ず定義する。
// このクラス自体を直接ストレージ操作に使わないこと（_namespace_ を持たない）。
export class UserConfig extends Model {
  /** キー "user" のシングルトン設定を取得し、migrate() を通して返す。 */
  public static async user<T extends typeof UserConfig>(this: T): Promise<InstanceType<T>> {
    const config = (await this.find("user"))! as InstanceType<T>;
    return (await config.migrate()) as InstanceType<T>;
  }

  /** 保存形式の移行フック。user() での取得直後に呼ばれる。既定では何もしない。 */
  protected async migrate(): Promise<UserConfig> {
    return this;
  }
}
