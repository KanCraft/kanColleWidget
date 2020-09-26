
export enum Group {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Quarterly = "quarterly",
  Yearly = "yearly",
  // Others = "others",
}

export enum Status {
  Open = "open", // 着手可能で未着手
  Ongoing = "ongoing", // 遂行中
  Completed = "completed", // 完了&回収済み
  Unavailable = "unavailable", // 未開放 （これ要る？）
  Hidden = "hidden", // 完了&回収済み&ダッシュボードのUIから消す
}

// 任務の出現条件
export enum Condition {
  Date037 = "date037",
  Date28 = "date28",
}

// 任務のカテゴリ. 主に未着手アラートに使う.
export enum Category {
  Sortie = "Sortie", // 出撃
  Supply = "Supply", // 補給
  Mission = "Mission", // 遠征
  Recovery = "Recovery", // 入渠
  Shipbuilding = "Shipbuilding", // 建造
  CreateItem = "CreateItem", // 開発
  Remodel = "Remodel", // 改修工廠
  DestroyShip = "DestroyShip", // 解体
  DestroyItem = "DestroyItem", // 廃棄
  Practice = "Practice", // 演習
}
