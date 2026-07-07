---
name: write-history-article
description: blog/材料/ の下書き材料から「住吉考」（site/history/）の記事を作成し、blog/原稿/ にレビュー用の単体HTMLを置く。ユーザーが「この材料で記事を書いて」「〇〇の記事を作って」のように、材料フォルダの内容を住吉考の記事にしたいと言ったときに呼び出す。
---

「住吉考」（旧称: 歴史学探索。`site/history/`, 一覧は `site/history.html`）の記事を、`blog/材料/<日付>/` の下書き材料から作るときの手順。2026-07-07 に「住吉大社の誕生石」記事を作った際の実際の作業を一般化したもの。

## 全体フロー

```
blog/材料/<日付>/*.md   （生の下書き素材、ユーザー提供）
      ↓ この記事を執筆
blog/原稿/<日付>/*.html （レビュー用の完成版HTML。単体で開いて確認できる）
      ↓ ユーザーが確認・修正指示
site/history/<slug>.html （公開ページ本体）
```

## 手順

### 1. 材料を読む
`blog/材料/<日付>/` 配下の `.md` を読み、記事の骨子（リード文・セクション構成・引用元候補）を把握する。

### 2. 編集開始宣言 → worktree
`site/**` を編集するので `start-edit` スキルの手順で日付worktreeを用意する（未宣言なら先にユーザーに編集開始宣言を促す。CLAUDE.mdの編集ワークフロー参照）。テーマスラッグは記事内容から簡潔な英語スラッグを作り、命名前にユーザーに確認する。

### 3. 既存記事のデザインを踏襲して本文HTMLを書く
`site/history/` 内の既存記事（あれば）を読み、以下のパターンをコピーする。
- `<body data-base="../" data-page="history">` / breadcrumb（`../index.html` → `../history.html` → 現在ページ） / `badge badge-lg badge-history` + 日付 / `<h1>`
- 本文は `content-card-lg` の中に `<p class="klee" style="font-size:15px;line-height:2.2;margin-bottom:20px">` を並べる。長めの記事はセクション見出しを `<h2 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:19px;margin-bottom:16px">` で区切る。
- 参考文献は本文末尾に `<div style="margin-top:36px;padding-top:24px;border-top:1px solid rgba(58,54,50,0.08)">` + `<ul>` でまとめる。
- **タイトルは記事が実際に扱う範囲より風呂敷を広げない。**「日本史700年」のような大きすぎる主語ではなく、扱う具体的な主体（誰と誰の関係、何の由来か）を主語にする。案が複数出せる場合はユーザーに選んでもらう。
- **現代を生きる、著名とは言えない個人の情報**（生年月日、実家、存命かどうか等）は、たとえWikipedia等で追えても本文に入れない。歴史上の事実として広く公知の範囲（例: 何年に誰が死去し嗣子がなく血統が途絶えた、等）に留め、その後の当主継承のような現在進行の個人情報は書かない。曖昧化するより、その一文を削る方を優先する。

### 4. CCライセンス画像を調達する
1. `WebSearch` で Wikimedia Commons 上の関連画像（建物写真、家紋SVG等）を探す。
2. `WebFetch` でファイルページを開き、ライセンス名（CC0 / CC BY-SA など）・作者名・直接ダウンロードURLを確認する。CC BY-SA 系は要クレジット。
3. `PowerShell` の `Invoke-WebRequest` でダウンロードする。**User-Agent を必ず指定する**（`upload.wikimedia.org` は匿名UAだと `429 Too many requests` を返すことがある）。
   ```powershell
   $ua = "InokoromochiSiteBot/1.0 (contact: <連絡先>; personal portrait site image fetch)"
   Invoke-WebRequest -Uri "<upload.wikimedia.orgの直リンク>" -OutFile "<保存先>" -UserAgent $ua
   ```
4. worktree内の `site/assets/images/` に `history-<内容>.<ext>` のような名前で保存する。
5. 本文の `<figcaption>` に「Photo/Author: 名前 / Wikimedia Commons（リンク）, ライセンス名（リンク）」の形でクレジットを入れる。CC0は著者不明ならクレジット省略可だが出典リンクは入れるのが望ましい。

### 5. 外部リンクはすべて新規タブ
参考文献リストの `<a>` と、画像クレジット内の `<a>` には必ず `target="_blank" rel="noopener noreferrer"` を付ける。

### 6. 一覧・トップページ・関連ドキュメントを更新する
- `site/history.html` の `.article-list` にカードを追加（既存モック記事を置き換える場合は削除）。
- `site/index.html` の `.category-cards` 内の該当カードの説明文、および `.blog-preview` の「〜最新の記事」を更新。
- ファイル名を具体例として書いている `README.md` / `DESIGN_SYSTEM.md` の該当箇所も更新する（放置すると次回の参照時に存在しないファイル名を案内してしまう）。

### 7. `blog/原稿/<日付>/` にレビュー用の単体HTMLを作る
`site/history/<slug>.html` をそのまま `blog/原稿/<日付>/<slug>.html` にコピーするだけでは **CSS/JS/画像が正しく解決されず、ブラウザで開いても崩れて見える**。以下を必ず行う。

1. `blog/原稿/<日付>/` の下に `css/` `js/` `assets/images/` を作り、`site/css/style.css`・`site/js/main.js`・記事で使う画像ファイルをコピーする。
2. コピーしたHTML内のパスを書き換える: `../css/` → `css/`、`../js/` → `js/`、`../assets/images/` → `assets/images/`、`<body data-base="../" ...>` → `data-base=""`。
3. breadcrumb / 「記事一覧に戻る」の `../index.html` `../history.html` は site内の別ページへのリンクなので、ここではリンク切れのままで良い（見た目には影響しない）。

これで `blog/原稿/<日付>/<slug>.html` をダブルクリックすればフォント・レイアウト・画像込みで正しく表示される。

### 8. 目視確認はしない
**ヘッドレスブラウザでスクリーンショットを撮って自分で見た目を確認する、という工程は行わない。** ユーザーが `blog/原稿/` のHTMLを自分のブラウザで開いて最終確認する運用のため、エージェント側の目視チェックはトークンの無駄になる（過去にユーザーから明示的に指摘済み）。HTML/CSSの整合性はコードを読んで確認する。

### 9. ユーザーの修正指示を site と 原稿 の両方に反映する
本文修正・リンク仕様変更・カテゴリ名変更など、リリース前にユーザーから指示が来たら **`site/history/<slug>.html` と `blog/原稿/<日付>/<slug>.html` の両方に同じ変更を適用する**（`原稿` 側はパスの `../` が無い形なので、置換文字列にパス部分を含めないようにするとズレを防ぎやすい）。

### 10. リリース
ユーザーの「リリースします」宣言を受けたら `release-edit` スキルの手順に従う。

## 関連
- worktree運用ルール: `CLAUDE.md`
- 編集開始/リリース: `start-edit` / `release-edit` スキル
- デザイン規則: `DESIGN_SYSTEM.md`
