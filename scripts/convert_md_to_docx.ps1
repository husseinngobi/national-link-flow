#!/usr/bin/env pwsh
Write-Host "Converting docs/ngdxh-system-architecture.md to NGDXH_System_Architecture.docx using Pandoc"

$md = "docs/ngdxh-system-architecture.md"
$out = "NGDXH_System_Architecture.docx"

if (-not (Get-Command pandoc -ErrorAction SilentlyContinue)) {
  Write-Error "Pandoc not found in PATH. Install Pandoc or add it to PATH."
  exit 1
}

pandoc $md -o $out --resource-path=docs --metadata title="NGDXH — System Architecture"
if ($LASTEXITCODE -eq 0) { Write-Host "Created $out" } else { Write-Error "Pandoc failed"; exit $LASTEXITCODE }
