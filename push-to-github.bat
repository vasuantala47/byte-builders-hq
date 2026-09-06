@echo off
echo =======================================================
echo   Byte Builders HQ - Push to GitHub
echo   Repository: https://github.com/vasuantala47/byte-builders-hq
echo =======================================================
echo.

set "PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%"

echo Pushing main branch to origin...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo   SUCCESS! All 56 files pushed to:
    echo   https://github.com/vasuantala47/byte-builders-hq
    echo =======================================================
) else (
    echo.
    echo GitHub authentication required.
    echo Running GitHub CLI login...
    gh auth login -w -p https
    echo.
    echo Retrying git push...
    git push -u origin main
)

pause
