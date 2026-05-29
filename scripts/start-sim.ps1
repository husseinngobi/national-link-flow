param(
  [int]$RateMs = 2000,
  [string]$BaseUrl = 'http://localhost:4000'
)

Write-Host "Starting simulator at $BaseUrl/api/sim/runner/start (rateMs=$RateMs)"

$body = @{ rateMs = $RateMs } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/sim/runner/start" -ContentType 'application/json' -Body $body
