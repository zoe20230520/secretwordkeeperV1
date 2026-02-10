@echo off

rem Start Password Manager Generator project
echo Starting Password Manager Generator...
echo ============================

rem Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: pnpm not found, please install pnpm first
    echo You can install it via: npm install -g pnpm
    pause
    exit /b 1
)

rem Check if npm is installed (as fallback)
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm not found, please install Node.js first
    echo Download Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

rem Start development server in a new window
setlocal
set "SERVER_CMD=pnpm dev"
echo Starting development server...
echo The server will start in a new window

echo Opening browser to http://localhost:3000...
start http://localhost:3000

echo Starting server...
cmd /k "%SERVER_CMD%"

endlocal