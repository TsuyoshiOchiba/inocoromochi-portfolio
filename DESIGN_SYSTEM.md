# いのころもち.com デザインシステム

## 概要
いのころもちキャラクターを中心とした個人ポートレートサイト。
ナチュラル・温かみのあるトーンで、白ベースにキャラを引き立てるシンプル配色。

---

## カラーパレット

### ベースカラー
| 用途 | 色 | 値 |
|------|------|------|
| 背景（メイン） | オフホワイト | `#faf8f5` |
| 背景（セクション） | ウォームグレー | `#f3efe9` |
| カード背景 | ホワイト | `#ffffff` |
| テキスト（主） | ダークブラウン | `#3a3632` |
| テキスト（副） | — | `rgba(58, 54, 50, 0.55)` |
| テキスト（補助） | — | `rgba(58, 54, 50, 0.40)` |
| テキスト（薄） | — | `rgba(58, 54, 50, 0.35)` |
| ボーダー | — | `rgba(58, 54, 50, 0.06)` |
| カードボーダー | — | `rgba(58, 54, 50, 0.08)` |

### カテゴリカラー（アクセント）
| カテゴリ | 色名 | 値 | 用途 |
|----------|-------|------|------|
| プロダクト | テラコッタ | `#c4956a` | バッジ背景、リンク色、ホバー |
| 作曲活動 | セージグリーン | `#8b9e7a` | バッジ背景、リンク色、ホバー |
| 住吉考 | モカ | `#9b8a7a` | バッジ背景、リンク色、ホバー |
| なかまたち | ダスティローズ | `#b98a95` | バッジ背景、リンク色、ホバー |

### カテゴリ背景（カードサムネイル等）
| カテゴリ | 値 |
|----------|------|
| プロダクト | `#f5f0ea` |
| 作曲活動 | `#f0ece8` |
| 住吉考 | `#ece8e2` |
| なかまたち | `#f3efe9` |

---

## タイポグラフィ

### フォント
- **見出し・UI**: `'Zen Maru Gothic', system-ui, sans-serif`
  - ウェイト: 400, 500, 700, 900
- **本文・説明文**: `'Klee One', system-ui, sans-serif`
  - ウェイト: 400, 600

### Google Fonts 読み込み
```html
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Klee+One:wght@400;600&display=swap" rel="stylesheet">
```

### フォントサイズ基準
| 要素 | フォント | サイズ | ウェイト |
|------|----------|--------|----------|
| サイトロゴ | Zen Maru Gothic | 18px | 900 |
| ページタイトル（h1） | Zen Maru Gothic | 28–36px | 900 |
| セクション見出し（h2） | Zen Maru Gothic | 18–20px | 700 |
| カードタイトル（h3） | Zen Maru Gothic | 16px | 700 |
| ナビリンク | Zen Maru Gothic | 13px | 500 |
| 本文 | Klee One | 14–15px | 400 |
| 説明文（小） | Klee One | 12–13px | 400 |
| バッジ | Zen Maru Gothic | 10px | 700 |
| フッター | — | 11–12px | 400 |

### 行間
- 本文: `line-height: 2.0–2.2`（日本語の読みやすさ重視）
- 説明文: `line-height: 1.7`
- 見出し: `line-height: 1.5`

---

## スペーシング

### ページレイアウト
- サイト横パディング: `48px`
- コンテンツ最大幅: `780–820px`（本文エリア）
- ヒーローセクション上パディング: `64–72px`
- セクション間: `48–64px`

### コンポーネント間
- カード間ギャップ: `20–24px`
- リスト項目間: `12px`
- テキストブロック内: `16–20px`

---

## コンポーネントパターン

### ナビゲーションバー
```
構成: ロゴ（左） | ナビリンク4つ（右）
高さ: padding 20px 48px
下線: 1px solid rgba(58,54,50,0.06)
アクティブ状態: カテゴリカラー + 下線2px solid
ホバー: 対応カテゴリカラーに変化
```

### カテゴリバッジ
```css
font-size: 10px;
font-weight: 700;
color: #fff;
padding: 3px 8px;
border-radius: 4px;
letter-spacing: 0.04em;
text-transform: uppercase; /* 英語の場合 */
```

### カテゴリカード（トップページ）
```
幅: 260px
角丸: 12px
ボーダー: 1px solid rgba(58,54,50,0.08)
サムネイル部: height 160px, カテゴリ背景色
ホバー: box-shadow: 0 8px 24px rgba(58,54,50,0.10), translateY(-2px)
トランジション: 0.2s
```

### 楽曲カード（作曲活動一覧）
```
幅: 380px
サムネイル: aspect-ratio 16/9, YouTubeサムネイル使用
再生ボタンオーバーレイ: 48px円, 白90%透過
```

### 記事カード（住吉考一覧）
```
横幅: 100%（max-width内）
パディング: 20px 24px
角丸: 10px
左: タグ + タイトル + 概要（縦並び）
右: 日付
ホバー: translateY(-1px), box-shadow
```

### コンテンツカード（詳細ページ本文）
```
パディング: 28–36px
背景: #fff
ボーダー: 1px solid rgba(58,54,50,0.06)
角丸: 12–16px
```

### パンくずリスト
```
位置: ナビ直下, padding 20px 48px 0
フォントサイズ: 12px
色: rgba(58,54,50,0.40)
区切り: ›
現在ページ: #3a3632
リンクホバー: #3a3632
```

### フッター
```
パディング: 32px 48px
上線: 1px solid rgba(58,54,50,0.06)
左: © 表示 (11px, 0.35透明度)
右: SNSリンク横並び (12px, 0.45透明度)
ホバー: #3a3632
```

---

## アニメーション

### ページ遷移
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
/* 適用: animation: fadeIn 0.3s ease */
```

### ホバーエフェクト
- カード: `transition: box-shadow 0.2s, transform 0.2s`
- リンク: `transition: color 0.2s`
- ボタン: `transition: background 0.2s`

---

## 画像アセット

| ファイル名 | 用途 |
|------------|------|
| `inocoromochi-a.png` | メインキャラクター（トップ・About） |
| `inocoromochi-b.png` | かわらばん用キャラクター |
| `inocoromochi-c.png` | 作曲活動用キャラクター |
| `inocoromochi-d.png` | 住吉考用キャラクター |
| `friend-piyokoromochi.png` | ゆかいな仲間たち: ぴよころもち |
| `friend-pute.png` | ゆかいな仲間たち: ぷて |
| `friend-kappa.png` | ゆかいな仲間たち: かっぱ |
| `friend-nyankoromochi.png` | ゆかいな仲間たち: にゃんころもち |

### 画像表示サイズ基準
- ヒーロー（トップ）: 300px幅
- ヒーロー（About）: 220px幅
- カードサムネイル内: 140–200px幅
- キャラ一覧（About）: 100px幅
- object-fit: contain を常用
- drop-shadow: `0 8px 32px rgba(58,54,50,0.10)` をヒーロー画像に適用

---

## YouTube動画埋め込み

### サムネイル取得
```
https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg
```

### 埋め込みプレーヤー（詳細ページ）
```html
<iframe
  width="100%"
  style="aspect-ratio:16/9"
  src="https://www.youtube.com/embed/{VIDEO_ID}"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

### 現在の楽曲データ
| タイトル | YouTube ID |
|----------|------------|
| 弦楽四重奏第一番「Espoir」 | `xMPrrwEnOoA` |
| 交響曲第一番「たんぽぽ」 | `LaqQBeyR5Ao` |

---

## ページ構成

```
/ (index.html)           — トップ: ヒーロー + 4カテゴリカード + 最新記事
/music.html              — 作曲活動一覧: カードグリッド
/music/espoir.html       — 楽曲詳細: YouTube埋め込み + 説明
/music/tanpopo.html      — 楽曲詳細
/history.html            — 住吉考一覧: 記事リスト
/history/sumiyoshi-tanjouseki.html — 記事詳細テンプレート
/kawaraban.html          — かわらばん紹介: ヒーロー + 特徴
/friends.html            — なかまたち一覧: 仲間キャラ紹介カード一覧（独立カテゴリ）
/about.html              — About: キャラ紹介 + バリエーション + SNS
```

---

## ページ追加時の手順

### 新しい楽曲を追加する
1. `music/` ディレクトリに新しいHTMLファイルを作成（既存をコピー）
2. YouTube IDを差し替え
3. タイトル・説明文を編集
4. `music.html` の一覧にカードを追加

### 新しい歴史記事を追加する
1. `history/` ディレクトリに新しいHTMLファイルを作成（既存をコピー）
2. タイトル・日付・本文を編集
3. `history.html` の一覧にカードを追加
4. `index.html` の「最新の記事」セクションを更新（最新3件表示）

### 新しいプロダクトを追加する
1. 専用HTMLページを作成
2. キャラクター画像を `assets/images/` に追加
3. `index.html` のカテゴリカードセクションに追加

### 新しい仲間キャラクターを追加する
1. キャラクター画像を `assets/images/` に `friend-〇〇.png` として追加
2. `friends.html` の `.friend-grid` に `.friend-card`（画像＋名前＋キャッチコピー＋紹介文）を追加
3. 必要であれば `index.html` のなかまたちカードのサムネイル画像を差し替え

---

## Claude Code向けルール

- **フォント**: 必ず Zen Maru Gothic と Klee One を使用
- **カラー**: 上記パレット外の色は原則使わない
- **角丸**: カード系は 12px、本文カードは 12–16px、バッジは 4px
- **ホバー**: 全インタラクティブ要素にホバーエフェクトを付ける
- **トランジション**: 0.2s を基本とする
- **画像**: object-fit: contain、ヒーローにはdrop-shadowを付ける
- **日本語テキスト**: line-height は 2.0 以上を確保
- **横幅**: コンテンツは max-width 780–820px + margin auto
- **パディング**: サイト左右は常に 48px
