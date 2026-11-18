<#
  publish.ps1 — publish Ember to GitHub and Vercel in one command.

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File .\publish.ps1 -Message "Tweak board copy"

  Tokens are read, in order, from:
    1. -GitHubToken / -VercelToken parameters
    2. $env:GITHUB_TOKEN / $env:VERCEL_TOKEN
    3. $HOME\.ember\credentials.ps1   ($EmberGitHubToken / $EmberVercelToken)

  Push only the repo:      -GitHubOnly
  Deploy only the site:    -VercelOnly
#>
[CmdletBinding()]
param(
  [string]$Message,
  [string]$GitHubToken,
  [string]$VercelToken,
  [switch]$GitHubOnly,
  [switch]$VercelOnly
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Root        = $PSScriptRoot
$Owner       = "varunpandiyan-apm"
$Repo        = "Personal_Fitness_30"
$Branch      = "main"
$VcProject   = "ember-30"
$VcDomain    = "ember-30.vercel.app"
$AuthorName  = "Varun Pandiyan"
$AuthorEmail = "varuntn007@gmail.com"

# Asset types published as part of the website.
$SiteExtensions = @(".html", ".css", ".js", ".json", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico", ".woff2", ".woff")
# Extra files kept in the repository but not published as part of the website.
$RepoOnlyExtensions = @(".ps1", ".md", ".txt")
# Extensionless config files that must still be tracked.
$DotFiles = @(".vercelignore", ".gitignore", "CNAME", "robots.txt")

function Write-Step($text) { Write-Host ""; Write-Host "== $text ==" -ForegroundColor Cyan }

# ---------------------------------------------------------------- credentials
$credFile = Join-Path $HOME ".ember\credentials.ps1"
if (Test-Path -LiteralPath $credFile) { . $credFile }

if (-not $GitHubToken) { $GitHubToken = if ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } else { $EmberGitHubToken } }
if (-not $VercelToken) { $VercelToken = if ($env:VERCEL_TOKEN) { $env:VERCEL_TOKEN } else { $EmberVercelToken } }

if (-not $VercelOnly -and -not $GitHubToken) { throw "No GitHub token. Set -GitHubToken, `$env:GITHUB_TOKEN, or $credFile" }
if (-not $GitHubOnly -and -not $VercelToken) { throw "No Vercel token. Set -VercelToken, `$env:VERCEL_TOKEN, or $credFile" }

if (-not $Message) {
  $Message = "Publish " + (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm 'UTC'")
}

$ghHeaders = @{
  Authorization          = "Bearer $GitHubToken"
  Accept                 = "application/vnd.github+json"
  "User-Agent"           = "ember-publish"
  "X-GitHub-Api-Version" = "2022-11-28"
}
$vcHeaders = @{ Authorization = "Bearer $VercelToken"; "Content-Type" = "application/json" }

function Invoke-GH {
  param([string]$Method, [string]$Uri, $Body)
  $p = @{ Uri = "https://api.github.com$Uri"; Method = $Method; Headers = $ghHeaders; TimeoutSec = 180 }
  if ($null -ne $Body) {
    $p.Body        = [Text.Encoding]::UTF8.GetBytes(($Body | ConvertTo-Json -Depth 8 -Compress))
    $p.ContentType = "application/json; charset=utf-8"
  }
  try { Invoke-RestMethod @p }
  catch {
    $detail = $_.ErrorDetails.Message
    if (-not $detail) { $detail = $_.Exception.Message }
    throw "GitHub $Method $Uri`n    $detail"
  }
}

function Invoke-VC {
  param([string]$Method, [string]$Uri, $Body, [int]$TimeoutSec = 180)
  $p = @{ Uri = "https://api.vercel.com$Uri"; Method = $Method; Headers = $vcHeaders; TimeoutSec = $TimeoutSec }
  if ($null -ne $Body) { $p.Body = [Text.Encoding]::UTF8.GetBytes(($Body | ConvertTo-Json -Depth 8 -Compress)) }
  try { Invoke-RestMethod @p }
  catch {
    $detail = $_.ErrorDetails.Message
    if (-not $detail) { $detail = $_.Exception.Message }
    throw "Vercel $Method $Uri`n    $detail"
  }
}

# ------------------------------------------------------------------ file scan
$allFiles = Get-ChildItem -LiteralPath $Root -Recurse -File | Where-Object {
  ($_.Extension -in ($SiteExtensions + $RepoOnlyExtensions) -or $_.Name -in $DotFiles) -and
  $_.FullName -notmatch "\\\.git\\"
}

$siteFiles = $allFiles | Where-Object { $_.Extension -in $SiteExtensions } | Sort-Object FullName
$repoFiles = $allFiles | Sort-Object FullName

function Get-RelPath($file) { $file.FullName.Substring($Root.Length + 1).Replace('\', '/') }

if (-not $VercelOnly) {
  Write-Step "GitHub: syncing $($repoFiles.Count) files to $Owner/$Repo"

  $me = Invoke-GH "GET" "/user"
  Write-Host "   auth: $($me.login)"

  $tree = @()
  foreach ($f in $repoFiles) {
    $rel  = Get-RelPath $f
    $b64  = [Convert]::ToBase64String([IO.File]::ReadAllBytes($f.FullName))
    $blob = Invoke-GH "POST" "/repos/$Owner/$Repo/git/blobs" ([ordered]@{ content = $b64; encoding = "base64" })
    $tree += [ordered]@{ path = $rel; mode = "100644"; type = "blob"; sha = $blob.sha }
    Write-Host ("   {0,-38} {1}" -f $rel, $blob.sha.Substring(0, 7))
  }

  $newTree = Invoke-GH "POST" "/repos/$Owner/$Repo/git/trees" ([ordered]@{ tree = $tree })

  $parentSha = $null
  $parentTree = $null
  try {
    $ref = Invoke-GH "GET" "/repos/$Owner/$Repo/git/ref/heads/$Branch"
    $parentSha = $ref.object.sha
    $parentTree = (Invoke-GH "GET" "/repos/$Owner/$Repo/git/commits/$parentSha").tree.sha
  } catch { }

  if ($parentTree -eq $newTree.sha) {
    Write-Host "   no changes to commit" -ForegroundColor Yellow
  }
  else {
    $now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    [string[]]$parents = if ($parentSha) { @($parentSha) } else { @() }
    $commitBody = [ordered]@{
      message   = $Message
      tree      = $newTree.sha
      parents   = $parents
      author    = [ordered]@{ name = $AuthorName; email = $AuthorEmail; date = $now }
      committer = [ordered]@{ name = $AuthorName; email = $AuthorEmail; date = $now }
    }
    $commit = Invoke-GH "POST" "/repos/$Owner/$Repo/git/commits" $commitBody

    if ($parentSha) {
      Invoke-GH "PATCH" "/repos/$Owner/$Repo/git/refs/heads/$Branch" ([ordered]@{ sha = $commit.sha; force = $false }) | Out-Null
    } else {
      Invoke-GH "POST" "/repos/$Owner/$Repo/git/refs" ([ordered]@{ ref = "refs/heads/$Branch"; sha = $commit.sha }) | Out-Null
    }
    Write-Host "   commit $($commit.sha.Substring(0,7)) -> $Branch" -ForegroundColor Green
  }
  Write-Host "   https://github.com/$Owner/$Repo"
}

if (-not $GitHubOnly) {
  Write-Step "Vercel: deploying $($siteFiles.Count) site files to $VcProject"

  $list = @()
  foreach ($f in $siteFiles) {
    $list += [pscustomobject]@{
      file     = Get-RelPath $f
      data     = [Convert]::ToBase64String([IO.File]::ReadAllBytes($f.FullName))
      encoding = "base64"
    }
  }

  $payload = [pscustomobject]@{
    name   = $VcProject
    target = "production"
    files  = $list
  }

  $resp = Invoke-VC "POST" "/v13/deployments?skipAutoDetectionConfirmation=1" $payload
  Write-Host "   deployment $($resp.id)"

  $state = $resp.readyState
  $deadline = (Get-Date).AddMinutes(6)
  while ($state -notin @("READY", "ERROR", "CANCELED")) {
    if ((Get-Date) -gt $deadline) { throw "Deployment timed out in state '$state'" }
    Start-Sleep -Seconds 4
    $state = (Invoke-VC "GET" "/v13/deployments/$($resp.id)").readyState
    Write-Host "   state: $state"
  }
  if ($state -ne "READY") {
    Write-Host "   deployment failed: $state" -ForegroundColor Red
    Write-Host "   https://vercel.com/varunpandiyandesign-2281/$VcProject/deployments"
    exit 1
  }
  Write-Host "   ready: https://$($resp.url)" -ForegroundColor Green

  $check = Invoke-WebRequest -Uri "https://$VcDomain/?v=$([DateTime]::UtcNow.Ticks)" -UseBasicParsing -TimeoutSec 60
  $title = if ($check.Content -match "<title>(.*?)</title>") { $Matches[1] } else { "(no title)" }
  Write-Host "   live: $($check.StatusCode) | $title"
  Write-Host "   https://$VcDomain"
}

Write-Host ""
Write-Host "Published." -ForegroundColor Green
