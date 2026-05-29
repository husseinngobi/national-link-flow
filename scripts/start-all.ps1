param(
  [int]$FrontendPort = 5173
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Starting backend (server) in a new window..."
Start-Process pwsh -ArgumentList "-NoExit","-Command","cd '$root\server'; node index.js"

Write-Host "Starting frontend (client) in a new window..."
Start-Process pwsh -ArgumentList "-NoExit","-Command","cd '$root\client'; npm run dev"

Start-Sleep -Seconds 2
Write-Host "Opening browser to http://localhost:$FrontendPort/"
Start-Process "http://localhost:$FrontendPort/"

Write-Host "All started. Use the sim-runner UI at /sim-runner to control continuous simulations."
