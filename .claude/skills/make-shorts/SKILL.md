---
name: make-shorts
description: 四コマのパネル画像からYouTube Shorts / Instagram リール用の縦動画（1080x1920 MP4）を生成する。引数は話番号（NNN）とタイトル。例: /make-shorts 001 佇む
---

四コマ漫画1話分のパネル画像から、BGM付きの縦動画を生成するスキル。
引数: `話番号 タイトル`（例: `001 佇む`）。引数が不足している場合はユーザーに聞く。

## 前提

- パネル画像: `diary/png/panels/{NNN}_1.png` 〜 `{NNN}_4.png`
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

PowerShell + System.Drawing で 1080x1920 の PNG を生成する。

```powershell
Add-Type -AssemblyName System.Drawing

$width = 1080
$height = 1920
$bgColor = [System.Drawing.ColorTranslator]::FromHtml("#faf8f5")
$textColor = [System.Drawing.ColorTranslator]::FromHtml("#3a3632")

$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear($bgColor)

$titleFont = New-Object System.Drawing.Font("Zen Maru Gothic", 80, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush($textColor)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$rect = New-Object System.Drawing.RectangleF(0, 0, $width, $height)
$g.DrawString("{タイトル}", $titleFont, $brush, $rect, $sf)

$bmp.Save("{diary/shorts}\frame_title.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $titleFont.Dispose(); $brush.Dispose()
```

### 4. パネルフレーム画像の生成

各パネル画像を 1080x1920 の背景（#faf8f5）の中央に 960px 幅で配置した PNG を生成する。

```powershell
Add-Type -AssemblyName System.Drawing

foreach ($i in 1..4) {
    $panel = [System.Drawing.Image]::FromFile("{パネルディレクトリ}\{NNN}_$i.png")

    $bmp = New-Object System.Drawing.Bitmap(1080, 1920)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#faf8f5"))

    $scaleFactor = 960.0 / $panel.Width
    $scaledW = 960
    $scaledH = [int]($panel.Height * $scaleFactor)
    $x = [int]((1080 - $scaledW) / 2)
    $y = [int]((1920 - $scaledH) / 2)

    $g.DrawImage($panel, $x, $y, $scaledW, $scaledH)
    $bmp.Save("{diary/shorts}\frame_$i.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose(); $panel.Dispose()
}
```

### 5. BGMの選択（ランダム＋連続3回制限）

ランダムで A または B を選択するが、同じバリエーションが3回連続した場合は強制的に反対を選ぶ。履歴ファイル `SNS戦略/output/.bgm_history` に直近の選択を記録。

```powershell
$histFile = "{プロジェクトルート}\diary\shorts\.bgm_history"
$history = if (Test-Path $histFile) { Get-Content $histFile } else { @() }
$variant = @("A", "B") | Get-Random
# 直近3回が同じなら4連続を防止
if ($history.Count -ge 3 -and $history[-1] -eq $history[-2] -and $history[-2] -eq $history[-3] -and $history[-1] -eq $variant) {
    $variant = if ($variant -eq "A") { "B" } else { "A" }
}
Add-Content $histFile $variant -Encoding utf8
$bgm = "K:\いのころもち.com\asset\music\ころころいのころもち_${variant}.mp3"
```

選択結果をユーザーに報告する（例: 「BGM: バリエーションB（マリンバ）を選択」）。

### 6. ffmpeg で動画生成

タイトル 1.5秒 + パネル各4秒 = 17.5秒。BGMの長さで `-shortest` で切る。

```powershell
ffmpeg -y `
  -loop 1 -t 1.5 -i "{diary/shorts}\frame_title.png" `
  -loop 1 -t 4 -i "{diary/shorts}\frame_1.png" `
  -loop 1 -t 4 -i "{diary/shorts}\frame_2.png" `
  -loop 1 -t 4 -i "{diary/shorts}\frame_3.png" `
  -loop 1 -t 4 -i "{diary/shorts}\frame_4.png" `
  -i "{BGMファイルパス}" `
  -filter_complex "[0:v]format=yuv420p,setsar=1[v0];[1:v]format=yuv420p,setsar=1[v1];[2:v]format=yuv420p,setsar=1[v2];[3:v]format=yuv420p,setsar=1[v3];[4:v]format=yuv420p,setsar=1[v4];[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v]" `
  -map "[v]" -map 5:a `
  -c:v libx264 -pix_fmt yuv420p -profile:v high -preset fast -crf 18 `
  -c:a aac -b:a 192k `
  -shortest -movflags +faststart `
  "{diary/shorts}\{NNN}_{タイトル}.mp4"
```

### 7. 中間ファイルの削除

`frame_title.png`, `frame_1.png` 〜 `frame_4.png` を削除する。

### 8. 完了報告

以下をユーザーに報告する:
- 出力ファイルパス
- 使用したBGMバリエーション（A: ピチカート弦 / B: マリンバ）
- ファイルサイズ
- 動画を開くか聞く

## 仕様メモ

- 動画仕様: 1080x1920 / H.264 High / yuv420p / 25fps / AAC 192kbps
- BGM: 変ホ長調 / BPM 110 / 8小節 / 約17.5秒
- タイトルフォント: Zen Maru Gothic Bold 80pt / 色 #3a3632 / 背景 #faf8f5
- パネル配置: 960px幅で中央配置 / 背景 #faf8f5
- Shorts とリールは同一ファイルで投稿可能
