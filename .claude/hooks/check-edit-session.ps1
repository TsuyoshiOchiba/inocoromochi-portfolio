$stdin = [Console]::In.ReadToEnd()
try { $j = $stdin | ConvertFrom-Json } catch { exit 0 }

$path = $j.tool_input.file_path
if (-not $path) { $path = $j.tool_input.notebook_path }
if (-not $path) { exit 0 }

$norm = $path -replace '\\', '/'

$inWorktree = $norm -match '/\.claude/worktrees/'
if ($inWorktree) { exit 0 }

$isGuarded = ($norm -match '/site/') -or ($norm -match '(^|/)DESIGN_SYSTEM\.md$')
if (-not $isGuarded) { exit 0 }

$reason = 'サイト本体(site/ または DESIGN_SYSTEM.md)の編集には、先に編集開始宣言が必要です。' +
  '「〇〇の編集を始めます」のように宣言するか /start-edit <テーマ> を実行してから、もう一度編集してください。'

$result = @{
  hookSpecificOutput = @{
    hookEventName            = 'PreToolUse'
    permissionDecision       = 'deny'
    permissionDecisionReason = $reason
  }
} | ConvertTo-Json -Depth 5 -Compress

Write-Output $result
exit 0
