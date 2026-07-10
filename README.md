# いのころもち.com

いのころもちキャラクターを中心にした個人ポートレートサイト。ビルド不要の静的HTML/CSS/JSサイト。

## サイト構成

```
site/
├── index.html              トップページ（ヒーロー + 4カテゴリカード + 最新記事）
├── kawaraban.html           プロダクト紹介（かわらばん）
├── music.html               作曲活動 一覧
├── music/
│   ├── espoir.html          楽曲詳細
│   └── tanpopo.html         楽曲詳細
├── history.html             住吉考 一覧
├── history/
│   ├── ikkyu-shousaian.html        記事詳細
│   ├── ikune-tanabata-okuri.html   記事詳細
│   └── sumiyoshi-tanjouseki.html   記事詳細
├── friends.html             ゆかいな仲間たち 一覧
├── about.html                About（キャラ紹介・SNS）
├── css/style.css             全ページ共通スタイル
├── js/main.js                 共通ナビ・フッターの動的生成
└── assets/images/             キャラクター画像（a〜d）
```

- ルート直下の `DESIGN_SYSTEM.md` に配色・タイポグラフィ・コンポーネント仕様など詳細なデザイン規則がまとまっている。デザインを変更・追加する際は必ず先に確認する。
- ビルドツール・パッケージマネージャは使用していない。`site/` 配下を静的ホスティングにそのままデプロイする想定（`package.json` なし）。

## 技術スタック

- 素のHTML / CSS / JavaScript（フレームワークなし）
- フォント: Google Fonts（`Zen Maru Gothic` / `Klee One`）をCDN読み込み
- 動画: YouTube埋め込み（サムネイルは `img.youtube.com` から取得）

## 共通レイアウトの仕組み（`js/main.js`）

各ページの `<nav class="nav">` と `<footer class="footer">` は空の状態でHTMLに書かれており、`js/main.js` の `DOMContentLoaded` 時に中身が注入される。

- `<body data-base="..." data-page="...">` の2つの属性で挙動が決まる
  - `data-base`: サブディレクトリ（`music/` や `history/`）にあるページでは `"../"` を指定し、ナビのリンクを相対パスで正しく解決する
  - `data-page`: `product` / `music` / `history` / `about` のいずれかを指定すると、対応するナビリンクにアクティブ状態（カテゴリカラー + 下線）が付く
- フッターのSNSリンク（X/Twitter, GitHub, YouTube）は `js/main.js` 内に直書き。実際のURLが決まったら `createFooter()` 内の `href="#"` を差し替える

新規ページを作る際は、既存ページの `<nav class="nav"></nav>` / `<footer class="footer"></footer>` の空要素とscriptタグ、`data-base` / `data-page` 属性をそのままコピーすること。

## 更新手順

### 楽曲を追加する
1. `site/music/` に既存ファイル（例: `espoir.html`）をコピーして新規作成
2. YouTube動画IDを差し替え（`video-container` 内の `iframe src` ）
3. タイトル・説明文を編集
4. `site/music.html` の `.music-cards` にカードを追加（サムネイルURLも同じYouTube IDから生成: `https://img.youtube.com/vi/{ID}/maxresdefault.jpg`）

### 歴史記事を追加する
1. `site/history/` に既存ファイル（例: `sumiyoshi-tanjouseki.html`）をコピーして新規作成
2. タイトル・日付・本文を編集
3. `site/history.html` の `.article-list` に記事カードを追加
4. `site/index.html` の「住吉考 — 最新の記事」セクションを最新記事で更新

### 新しいプロダクト（カテゴリ）を追加する
1. 専用HTMLページを作成
2. キャラクター画像を `site/assets/images/` に追加
3. `site/index.html` の `.category-cards` にカードを追加
4. `site/js/main.js` の `pages` 配列にナビ項目を追加

## デザインルールの要点

詳細は `DESIGN_SYSTEM.md` を参照。特に注意すべき点:

- 使用フォントは `Zen Maru Gothic`（見出し・UI）と `Klee One`（本文）のみ
- パレット外の色は使わない（カテゴリカラー: プロダクト=テラコッタ `#c4956a` / 作曲活動=セージグリーン `#8b9e7a` / 住吉考=モカ `#9b8a7a` / なかまたち=ダスティローズ `#b98a95`）
- 日本語本文の `line-height` は 2.0 以上を確保
- サイト左右のパディングは常に `48px`（レスポンシブ時は `24px`）
- コンテンツ幅は `max-width: 780–820px` + `margin: 0 auto`
