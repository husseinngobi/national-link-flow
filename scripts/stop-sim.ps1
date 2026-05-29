param(
  [string]$BaseUrl = 'http://localhost:4000'
)

Write-Host "Stopping simulator at $BaseUrl/api/sim/runner/stop"
Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/sim/runner/stop"
