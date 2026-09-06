# Byte Builders HQ - GitHub Setup & Push Automation Script
# Usage: .\setup-git-and-push.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/byte-builders-hq.git"

param (
    [string]$RepoUrl = ""
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  BYTE BUILDERS HQ - GITHUB REPOSITORY DEPLOYMENT SCRIPT  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if Git is installed
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
    Write-Host "[!] Git command not found in PATH." -ForegroundColor Yellow
    Write-Host "[*] Checking if Git is installed in standard Program Files..." -ForegroundColor Yellow
    
    if (Test-Path "C:\Program Files\Git\cmd\git.exe") {
        $env:Path += ";C:\Program Files\Git\cmd"
        Write-Host "[+] Found Git in C:\Program Files\Git\cmd!" -ForegroundColor Green
    } elseif (Test-Path "C:\Program Files (x86)\Git\cmd\git.exe") {
        $env:Path += ";C:\Program Files (x86)\Git\cmd"
        Write-Host "[+] Found Git in C:\Program Files (x86)\Git\cmd!" -ForegroundColor Green
    } else {
        Write-Host "[*] Installing Git via Windows Package Manager (winget)..." -ForegroundColor Cyan
        winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
        $env:Path += ";C:\Program Files\Git\cmd"
    }
}

# Verify Git is now available
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
    Write-Host "[X] Git installation requires restarting your terminal or manually installing from https://git-scm.com/" -ForegroundColor Red
    Exit 1
}

Write-Host "[+] Git is ready: $((git --version))" -ForegroundColor Green

# Initialize git repo if not initialized
if (-not (Test-Path ".git")) {
    Write-Host "[*] Initializing local Git repository..." -ForegroundColor Cyan
    git init
    git branch -M main
}

Write-Host "[*] Staging project files..." -ForegroundColor Cyan
git add .

Write-Host "[*] Creating initial commit..." -ForegroundColor Cyan
git commit -m "Byte Builders HQ: Full-Stack Digital Hardware Innovation Lab with Gemini AI"

if ($RepoUrl) {
    Write-Host "[*] Linking remote repository: $RepoUrl" -ForegroundColor Cyan
    git remote remove origin -ErrorAction SilentlyContinue
    git remote add origin $RepoUrl
    Write-Host "[*] Pushing to GitHub main branch..." -ForegroundColor Cyan
    git push -u origin main
    Write-Host "[✓] Successfully published Byte Builders HQ to GitHub!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[*] Commit created locally! To push to GitHub, run:" -ForegroundColor Yellow
    Write-Host "    git remote add origin https://github.com/YOUR_USERNAME/byte-builders-hq.git" -ForegroundColor White
    Write-Host "    git push -u origin main" -ForegroundColor White
}

Write-Host "==========================================================" -ForegroundColor Cyan
