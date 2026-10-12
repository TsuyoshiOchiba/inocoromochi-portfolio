---
name: make-shorts
description: 四コマのパネル画像からYouTube Shorts / Instagram リール用の縦動画（1080x1920 MP4）を生成する。引数は話番号（NNN）とタイトル、公開順。例: /make-shorts 001 佇む 1
---

四コマ漫画1話分のパネル画像から、BGM付きの縦動画を生成するスキル。
引数: `話番号 タイトル 公開順`（例: `001 佇む 1`）。不足している場合はユーザーに聞く。公開順は通し番号で、BGMとエンドカードの組み合わせを決めるのに使う（下の「公開順ごとの組み合わせ」）。

## 前提

- パネル画像: `diary/png/panels/{NNN}_1.png` 〜 `{NNN}_4.png`
- 背景: `diary/PR動画素材/背景テンプレート_1080x1920.png`（プロモ動画と同じ背景。上に「ころころもちもち」、下に「ふしぎな いのころもち」の文字入り）
- エンドカード: `diary/PR動画素材/エンドカード/{エンドカード名}.png`（1080x1920。`おわり` / `かわらばん` / `タスクリスト`）
- BGM: `K:\いのころもち.com\asset\music\ころころいのころもち_A.mp3`（ピチカート弦）と `ころころいのころもち_B.mp3`（マリンバ）
- フォント: Zen Maru Gothic（システムにインストール済み前提）
- ツール: ffmpeg（パスが通っている前提）

## 手順

### 1. パネル画像の存在確認

`diary/png/panels/{NNN}_1.png` 〜 `{NNN}_4.png` の4ファイルが存在するか確認する。不足があればユーザーに報告して中断。

### 2. 出力ディレクトリの作成

```
diary/shorts/
```

出力ファイル名は `{NNN}_{タイトル}.mp4`。ディレクトリがなければ作成する。

### 3. タイトルカード画像の生成

PowerShell + System.Drawing で、背景テンプレートの白い帯（y=538〜1264）の中央にタイトルを描いた 1080x1920 の PNG を生成する。
文字は 160pt から始め、幅 960px に収まるまで 4pt ずつ縮める（下限 96pt）。

```powershell
Add-Type -AssemblyName System.Drawing

$bandTop = 538; $bandBottom = 1264   # 背景テンプレートの白い帯
$bg = [System.Drawing.Image]::FromFile("{背景テンプレート}")

$bmp = New-Object System.Drawing.Bitmap(1080, 1920)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.DrawImage($bg, 0, 0, 1080, 1920)

$size = 160
while ($true) {
    $titleFont = New-Object System.Drawing.Font("Zen Maru Gothic", $size, [System.Drawing.FontStyle]::Bold)
    $w = $g.MeasureString("{タイトル}", $titleFont, 4000, [System.Drawing.StringFormat]::GenericTypographic).Width
    if ($w -le 960 -or $size -le 96) { break }
    $titleFont.Dispose(); $size -= 4
}
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$rect = New-Object System.Drawing.RectangleF(0, $bandTop, 1080, ($bandBottom - $bandTop))
$g.DrawString("{タイトル}", $titleFont, $brush, $rect, $sf)

$bmp.Save("{diary/shorts}\frame_title.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $titleFont.Dispose(); $brush.Dispose(); $bg.Dispose()
```

### 4. パネルフレーム画像の生成

各パネル画像を、背景テンプレートの白い帯の中央に 960px 幅で配置した PNG を生成する。

```powershell
Add-Type -AssemblyName System.Drawing

$bandTop = 538; $bandBottom = 1264
$bg = [System.Drawing.Image]::FromFile("{背景テンプレート}")

foreach ($i in 1..4) {
    $panel = [System.Drawing.Image]::FromFile("{パネルディレクトリ}\{NNN}_$i.png")

    $bmp = New-Object System.Drawing.Bitmap(1080, 1920)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($bg, 0, 0, 1080, 1920)

    $scaledH = [int]($panel.Height * (960.0 / $panel.Width))
    $y = [int](($bandTop + $bandBottom) / 2 - $scaledH / 2)

    $g.DrawImage($panel, 60, $y, 960, $scaledH)
    $bmp.Save("{diary/shorts}\frame_$i.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose(); $panel.Dispose()
}
$bg.Dispose()
```

### 5. BGMとエンドカードの選択（公開順で決める）

BGMとエンドカードはランダムに選ばず、下の「公開順ごとの組み合わせ」の表から公開順で決める。

```powershell
$combos = @(
    @("A", "おわり"), @("A", "かわらばん"), @("B", "おわり"), @("B", "タスクリスト"),
    @("A", "おわり"), @("A", "タスクリスト"), @("B", "おわり"), @("B", "かわらばん"))
$combo = $combos[({公開順} - 1) % 8]
$bgm = "K:\いのころもち.com\asset\music\ころころいのころもち_$($combo[0]).mp3"
$endCard = "{プロジェクトルート}\diary\PR動画素材\エンドカード\$($combo[1]).png"
```

選んだ組み合わせをユーザーに報告する（例: 「公開順6: BGMはA（ピチカート弦）、エンドカードはタスクリスト」）。

### 6. ffmpeg で動画生成

タイトル 0.56秒 + パネル 4.08 / 4.12 / 4.08 / 4.08秒 + エンドカード 2.00秒 = 18.92秒(25fpsで473コマ)。
切り替えはBGM(BPM 110)の拍に合わせてある。エンドカードは16.92秒、BGMの最後の音(オチの「ぶっ」、16.91秒)で始まる。秒数を変えるときは、この位置を崩さないこと。
BGMのファイルは20.45秒あり、17.5秒以降はほぼ無音。エンドカードの後半は無音になる。

```powershell
ffmpeg -y `
  -loop 1 -t 0.56 -i "{diary/shorts}\frame_title.png" `
  -loop 1 -t 4.08 -i "{diary/shorts}\frame_1.png" `
  -loop 1 -t 4.12 -i "{diary/shorts}\frame_2.png" `
  -loop 1 -t 4.08 -i "{diary/shorts}\frame_3.png" `
  -loop 1 -t 4.08 -i "{diary/shorts}\frame_4.png" `
  -loop 1 -t 2.00 -i "{エンドカード}" `
  -i "{BGMファイルパス}" `
  -filter_complex "[0:v]format=yuv420p,setsar=1[v0];[1:v]format=yuv420p,setsar=1[v1];[2:v]format=yuv420p,setsar=1[v2];[3:v]format=yuv420p,setsar=1[v3];[4:v]format=yuv420p,setsar=1[v4];[5:v]format=yuv420p,setsar=1[v5];[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[v]" `
  -map "[v]" -map 6:a `
  -c:v libx264 -pix_fmt yuv420p -profile:v high -preset fast -crf 18 `
  -c:a aac -b:a 192k `
  -shortest -movflags +faststart `
  "{diary/shorts}\{NNN}_{タイトル}.mp4"
```

BGMのMP3を読むとき `Incorrect BOM value` / `Error reading frame TSSE, skipped` という警告が出るが、タグ情報の読み飛ばしで、音声には影響しない。

### 7. 中間ファイルの削除

`frame_title.png`, `frame_1.png` 〜 `frame_4.png` を削除する。

### 8. 完了報告

以下をユーザーに報告する:
- 出力ファイルパス
- 使用したBGMバリエーション（A: ピチカート弦 / B: マリンバ）
- ファイルサイズ
- 動画を開くか聞く

## 公開順ごとの組み合わせ

離脱の差を実測するため、エンドカードを公開順で出し分ける。奇数回は汎用の `おわり`（「おわり」の文字と、ひっくり返ってへそが出ているいのころもち）、偶数回は広告（`かわらばん` / `タスクリスト`）。

BGMは2回ごとに入れ替える。「広告のときはいつもマリンバ」のように、エンドカードの種類とBGMが結びつくのを避けるため。8回で一巡し、`おわり`・`かわらばん`・`タスクリスト` のどれにもAとBが同じ回数ずつ当たる。

| 公開順（8で割った余り） | BGM | エンドカード |
|---|---|---|
| 1 | A（ピチカート弦） | おわり |
| 2 | A（ピチカート弦） | かわらばん |
| 3 | B（マリンバ） | おわり |
| 4 | B（マリンバ） | タスクリスト |
| 5 | A（ピチカート弦） | おわり |
| 6 | A（ピチカート弦） | タスクリスト |
| 7 | B（マリンバ） | おわり |
| 0（8回目） | B（マリンバ） | かわらばん |

公開順は `SNS戦略/スケジュール.md` と各区切りの `予約表.md` で管理している。付けた組み合わせは `予約表.md` に書く。

## 仕様メモ

- 動画仕様: 1080x1920 / H.264 High / yuv420p / 25fps / AAC 192kbps
- BGM: 変ホ長調 / BPM 110 / 8小節。音が鳴るのは約17.5秒までで、ファイル自体は無音の余白を含めて20.45秒ある
- BGMの最終小節: 拍ごとに15.28秒、15.83秒、16.37秒、16.91秒で音が立つ。オチの「ぶっ」は最後の16.91秒(17.2秒ごろまで鳴る)。ユーザーが耳で確認済み
- 背景: プロモ動画と同じテンプレート。下の「いのころもち」の行はアプリのUIに隠れてもよい前提で置いてある
- タイトル: Zen Maru Gothic Bold 160pt（幅960pxに収まるよう自動で縮小、下限96pt）/ 色 黒 / 白い帯（y=538〜1264）の中央 / 表示0.56秒（1拍）
- パネル配置: 960px幅で白い帯の中央
- エンドカード `おわり`: プロモ動画の3コマ目（`frame_3.jfif`）を幅960px・上端y=610に置き、その上に「おわり」（Zen Maru Gothic Bold 120pt、黒）
- エンドカード `かわらばん` / `タスクリスト`: サイトのOGP画像（`site/assets/images/ogp-product.png` / `ogp-tasklist.png`）の絵の部分を切り出し、白い帯の中央に拡大して配置
- Shorts とリールは同一ファイルで投稿可能
