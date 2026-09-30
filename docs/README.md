# docs — 記録

**設計の正典は [`constitution.md`](constitution.md) の憲章。** それ以外の文書はその適用記録であって正典ではなく、コードと食い違ったらコードが正しい。

| 置き場 | 中身 | frontmatter |
|---|---|---|
| `docs/constitution.md` | 憲章。原則が変わったときだけ直す | — |
| `docs/*.md` | 手順書（[kcsapi-recorder](kcsapi-recorder.md)）。古くなったら直す | `kind: guide` |
| `docs/history/` | 日付順の記録。更新しない、消してよい | `date` / `kind` / `principles` / `status` |

記録を足すときは `docs/history/YYYYMMDD_slug.md` に frontmatter を付けて置く。決定は「決定」と「なぜ」の 2 節、3KB 以内。訂正は本文を書き換え、対象が消えたら削除する。今の仕様と食い違うと分かったら本文は直さず `status: obsolete` と `reason` を足す。

`principles` には憲章の原則 id（`ownership-scope` / `idempotent-handlers` / `non-intrusive`）を書く。
