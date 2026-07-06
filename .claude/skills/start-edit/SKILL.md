---
name: start-edit
description: 日付単位のgit worktreeを作成し、サイト本体(site/, DESIGN_SYSTEM.md)の編集セッションを開始する。ユーザーの編集開始宣言（「〇〇の編集を始めます」「/start-edit [テーマ]」）を受けたときに呼び出す。
---

ユーザーがサイト本体の編集開始を宣言したときに実行する手順。引数にテーマ語彙が渡されることがある（例: `/start-edit かわらばん機能追加`）。自然言語での宣言（「かわらばんページを直します」等）でも同じ手順を実行してよい。

## 手順

1. 今日の日付を `YYYY-MM-DD` 形式で取得する。
2. `git worktree list` で当日日付のworktree（ブランチ名が `edit/YYYY-MM-DD` または `edit/YYYY-MM-DD-*`）が既に存在するか確認する。
3. worktree名を決定する。
   - 当日のworktreeがまだ無く、ユーザーもテーマを指定していない → `edit/YYYY-MM-DD`
   - 当日のworktreeが既に存在する、またはユーザーが編集観点のテーマを述べた → `edit/YYYY-MM-DD-テーマスラッグ`
     - テーマスラッグは英数字・ハイフンのみ（worktree名の制約上、日本語は使えない）。日本語のテーマ表現から簡潔な英語スラッグを作り（例:「かわらばん機能追加」→ `kawaraban-feature`）、命名前に一度ユーザーに提示して確認する。
   - 決定した名前のworktreeが既に存在する場合は、新規作成せずそのworktreeに入るだけでよい（`EnterWorktree` の `path` パラメータを使う）。
4. `EnterWorktree` ツールを呼び出す（新規なら `name` に決定した名前を指定、既存なら `path` にそのworktreeのパスを指定）。
5. worktree名とブランチ名をユーザーに一言報告する。
6. 以降、元の編集依頼に戻って作業を続ける（このworktree内であればsite/やDESIGN_SYSTEM.mdの編集はブロックされない）。

## 注意

- README.md や `.claude/**` などハーネス自体の編集にはworktreeは不要。このスキルは「サイト本体の編集」を開始する宣言に対してのみ使う。
- 既にworktreeセッション内にいる場合にこのスキルが呼ばれた場合（同一テーマの続き作業など）は、新たなworktreeを作らずその旨をユーザーに伝える。
