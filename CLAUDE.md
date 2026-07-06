# いのころもち.com メンテナンス方針

## 編集ワークフロー（worktreeベース）

`site/` 配下および `DESIGN_SYSTEM.md`（= サイト本体のソース）を編集する作業は、必ず日付単位の git worktree の中で行う。

### ルール

1. **編集はユーザーの明示的な「編集開始宣言」があってはじめて開始する。**
   - 宣言の例: 「かわらばんページの編集を始めます」「/start-edit」「/start-edit かわらばん機能追加」
   - 宣言なしにサイト本体（`site/**` または `DESIGN_SYSTEM.md`）の編集を指示された場合、`PreToolUse` フック（`.claude/hooks/check-edit-session.ps1`）が編集をブロックする。ブロックされたら、回避しようとしたり黙って別の方法で書き込もうとせず、ユーザーに編集開始宣言を促す返答をすること。
2. 宣言を受けたら `start-edit` スキルの手順で当日の worktree を用意してから編集に着手する。
   - worktree名（=ブランチ名）は `edit/YYYY-MM-DD`。
   - 同じ日付で複数の編集観点（テーマ）が発生した場合は `edit/YYYY-MM-DD-テーマスラッグ`（英数字スラッグ）とする。日本語のテーマ表現は編集開始前に簡潔な英語スラッグへ変換し、ユーザーに一度提示して確認する。
3. 「リリース宣言」（例:「リリースします」「/release-edit」）を受けたら、`release-edit` スキルの手順で現在のworktreeの変更を `main` にマージし、`origin` へpushする。

### 適用スコープ

- worktree必須ルールの対象は **`site/**` と `DESIGN_SYSTEM.md` のみ**。
- `README.md`、`CLAUDE.md`、`.claude/**` などハーネス/運用系ファイルは対象外。通常の作業ディレクトリで直接編集してよい。

### 関連ファイル

- フック実装: `.claude/hooks/check-edit-session.ps1`（設定: `.claude/settings.json`）
- スキル: `start-edit`（編集開始）, `release-edit`（リリース/マージ）
- デザイン規則: `DESIGN_SYSTEM.md`
