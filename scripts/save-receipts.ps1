param(
  [string]$BaseUrl = 'http://localhost:4000',
  [string]$OutDir = "$PSScriptRoot\..\data\receipts"
)

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

Write-Host "Fetching simulator logs to collect audit receipts..."
$logs = Invoke-RestMethod "$BaseUrl/api/sim/runner/logs"

foreach ($l in $logs.logs) {
  $id = $l.auditId
  Write-Host "Fetching receipt for audit id $id"
  try {
    $receipt = Invoke-RestMethod "$BaseUrl/api/audit/receipt/$id"
    $file = Join-Path $OutDir "audit-receipt-$($receipt.payload.id).json"
    $receipt | ConvertTo-Json -Depth 10 | Out-File -FilePath $file -Encoding utf8
    Write-Host "Saved $file"
  } catch {
    Write-Host "Failed to fetch receipt for $id"
  }
}

Write-Host "Done. Receipts saved under $OutDir"
