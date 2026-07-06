---
name: release-edit
description: 現在のworktreeでの編集をmainブランチへマージしoriginへpushする。ユーザーのリリース宣言（「リリースします」「/release-edit」）を受けたときに呼び出す。
---

ユーザーが編集内容のリリースを宣言したときに実行する手順。

## 前提

現在のセッションが `EnterWorktree` 済み（worktree内）であること。worktree内でない場合はマージ対象がないので、その旨をユーザーに伝えて終了する。

## 手順

1. worktree内で `git status` を確認し、未コミットの変更があればユーザーに確認の上コミットする。
2. `git log main..HEAD --oneline` 等で、これからマージされるコミット一覧をユーザーに提示する。
3. `ExitWorktree` を `action: "keep"` で呼び出し、元の（mainの）作業ディレクトリに戻る。
4. 戻った場所で以下を実行する。
   - `git checkout main`
   - `git merge --no-ff <worktreeのブランチ名>`
5. マージが成功したら `git push origin main` を実行する。
6. push後、役目を終えたworktreeとブランチを削除してよいかユーザーに一声かけてから、クリーンアップする（`EnterWorktree` で `path` 指定して再入場し `ExitWorktree action: "remove"` を使うか、`git worktree remove` / `git branch -d` を直接使う）。
7. マージしたコミット数・pushの成否をユーザーに報告する。

## 注意

- マージコンフリクトが発生した場合は自動解決を試みず、状況をそのままユーザーに報告し指示を仰ぐ。
- 「リリース宣言」自体を、このマージ＋push操作の実行許可として扱う（このハーネスが実現したい自動化そのものであるため）。ただし何をマージするかは必ず事前に要約提示してから進める。
