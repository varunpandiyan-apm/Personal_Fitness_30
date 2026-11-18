# Ember — tiny local static server for Windows PowerShell.
# Usage: right-click > Run with PowerShell, or:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\serve.ps1
# Serves this folder on http://127.0.0.1:4321/ and opens your browser.

param(
  [int]$Port = 4321,
  [switch]$NoBrowser
)

$rootFull = [System.IO.Path]::GetFullPath($PSScriptRoot)

# Pick the first free port in a small range so a stale server does not block you.
$listener = $null
for ($p = $Port; $p -lt $Port + 10; $p++) {
  try {
    $candidate = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $p)
    $candidate.Start()
    $listener = $candidate
    $Port = $p
    break
  } catch {
    if ($candidate) { try { $candidate.Stop() } catch {} }
  }
}

if (-not $listener) {
  Write-Host "Could not find a free port between $Port and $($Port + 9)." -ForegroundColor Red
  exit 1
}

$url = "http://127.0.0.1:$Port/"
Write-Host "Ember is running at $url" -ForegroundColor Green
Write-Host "Serving $rootFull"
Write-Host "Press Ctrl+C to stop."
if (-not $NoBrowser) { Start-Process $url }

$mime = @{
  '.html'  = 'text/html; charset=utf-8'
  '.css'   = 'text/css; charset=utf-8'
  '.js'    = 'application/javascript; charset=utf-8'
  '.json'  = 'application/json; charset=utf-8'
  '.png'   = 'image/png'
  '.jpg'   = 'image/jpeg'
  '.jpeg'  = 'image/jpeg'
  '.svg'   = 'image/svg+xml'
  '.woff2' = 'font/woff2'
  '.woff'  = 'font/woff'
  '.ico'   = 'image/x-icon'
  '.md'    = 'text/markdown; charset=utf-8'
}

function Send-Response($stream, [int]$code, [string]$status, [byte[]]$body, [string]$contentType) {
  $header = "HTTP/1.1 $code $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
  $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($hb, 0, $hb.Length)
  if ($body.Length -gt 0) { $stream.Write($body, 0, $body.Length) }
  $stream.Flush()
}

while ($true) {
  try {
    $client = $listener.AcceptTcpClient()
  } catch { break }

  try {
    $client.ReceiveTimeout = 5000
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $requestLine = $reader.ReadLine()
    if ([string]::IsNullOrWhiteSpace($requestLine)) { $client.Close(); continue }
    while ($true) {
      $line = $reader.ReadLine()
      if ([string]::IsNullOrEmpty($line)) { break }
    }

    $parts = $requestLine.Split(' ')
    if ($parts.Length -lt 2) { $client.Close(); continue }
    $method = $parts[0]
    $rawPath = $parts[1]
    $qIndex = $rawPath.IndexOf('?')
    if ($qIndex -ge 0) { $rawPath = $rawPath.Substring(0, $qIndex) }
    $rawPath = [System.Uri]::UnescapeDataString($rawPath)
    if ($rawPath -eq '/') { $rawPath = '/index.html' }
    $rawPath = $rawPath.TrimStart('/') -replace '/', '\'

    $full = [System.IO.Path]::GetFullPath((Join-Path $rootFull $rawPath))
    if (-not $full.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
      Send-Response $stream 403 'Forbidden' ([System.Text.Encoding]::UTF8.GetBytes('Forbidden')) 'text/plain'
      $client.Close(); continue
    }

    if ($method -ne 'GET') {
      Send-Response $stream 405 'Method Not Allowed' ([System.Text.Encoding]::UTF8.GetBytes('Method not allowed')) 'text/plain'
      $client.Close(); continue
    }

    if (Test-Path -LiteralPath $full -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      Send-Response $stream 200 'OK' $bytes $ct
    } else {
      Send-Response $stream 404 'Not Found' ([System.Text.Encoding]::UTF8.GetBytes("Not found: $rawPath")) 'text/plain'
    }
    $client.Close()
  } catch {
    try { $client.Close() } catch {}
  }
}
