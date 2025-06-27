@echo off
echo ========================================
echo    GIST Proteomics Dual Launch Script
echo ========================================
echo.
echo Starting both AI and Non-AI versions...
echo.
echo AI Version:     http://localhost:4968
echo Non-AI Version: http://localhost:4967
echo.
echo ========================================
echo.

REM Check directory
if not exist "GIST_Protemics" (
    echo Error: GIST_Protemics directory not found!
    echo Please run this script from the GIST_web root directory.
    pause
    exit /b 1
)

REM Check and kill existing processes on ports 4967 and 4968
echo Checking for existing processes on ports 4967 and 4968...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4967"') do (
    echo Killing process %%a on port 4967...
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4968"') do (
    echo Killing process %%a on port 4968...
    taskkill /PID %%a /F >nul 2>&1
)

REM Wait for ports to be freed
timeout /t 2 /nobreak >nul

REM Start AI version
echo Starting AI version on port 4968...
start "GIST AI" cmd /k "cd GIST_Protemics && Rscript start_ai.R"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start Non-AI version
echo Starting Non-AI version on port 4967...
start "GIST No-AI" cmd /k "cd GIST_Protemics && Rscript start_no_ai.R"

REM Wait for startup
timeout /t 5 /nobreak >nul

echo.
echo Both applications are starting...
echo.
echo Opening browsers...
start http://localhost:4968
timeout /t 2 /nobreak >nul
start http://localhost:4967

echo.
echo Both applications should now be running!
echo Check the separate command windows for logs.
echo.
echo To stop: Close the command windows or use stop_proteomics.bat
echo.
pause
