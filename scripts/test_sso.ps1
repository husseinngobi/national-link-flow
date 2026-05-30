$bodyObj = @{ actor = 'officer'; role = 'police_officer'; org = 'Demo Org' }
$body = $bodyObj | ConvertTo-Json -Compress
try {
  Write-Output "POSTing to /api/sim/sso/login"
  $resp = Invoke-WebRequest -Uri 'https://ngdxh-backend.onrender.com/api/sim/sso/login' -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing -ErrorAction Stop
  Write-Output "LOGIN STATUS: $($resp.StatusCode)"
  Write-Output "LOGIN BODY:"
  Write-Output $resp.Content
  $json = $null
  try { $json = $resp.Content | ConvertFrom-Json } catch {}
  $token = $json.token
  if (![string]::IsNullOrEmpty($token)) {
    Write-Output "\nVALIDATE RESPONSE:"
    $val = Invoke-WebRequest -Uri 'https://ngdxh-backend.onrender.com/api/sim/sso/validate' -Method Get -Headers @{ Authorization = "Bearer $token" } -UseBasicParsing
    Write-Output "VALIDATE STATUS: $($val.StatusCode)"
    Write-Output "VALIDATE BODY:"
    Write-Output $val.Content
  } else {
    Write-Output "No token returned from login"
  }
} catch {
  Write-Output "ERROR: $($_.Exception.Message)"
  if ($_.Exception.Response -ne $null) {
    try { $_.Exception.Response | Format-List -Force | Out-String | Write-Output } catch {}
  }
}

Write-Output "\nNow testing /api/public/citizen/login with demo credentials"
try {
  $b2 = @{ nin = 'CM900112ABCDE'; pin = '771194' }
  $jb2 = $b2 | ConvertTo-Json -Compress
  $r2 = Invoke-WebRequest -Uri 'https://ngdxh-backend.onrender.com/api/public/citizen/login' -Method Post -Body $jb2 -ContentType 'application/json' -UseBasicParsing
  Write-Output "PUBLIC LOGIN STATUS: $($r2.StatusCode)"
  Write-Output "PUBLIC LOGIN BODY:"
  Write-Output $r2.Content
} catch {
  Write-Output "PUBLIC ERROR: $($_.Exception.Message)"
  if ($_.Exception.Response -ne $null) { try { $_.Exception.Response | Format-List -Force | Out-String | Write-Output } catch {} }
}
