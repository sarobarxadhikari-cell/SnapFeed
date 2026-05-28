@echo off
cd /d "%~dp0"
echo Starting Snapverse-Pro...
echo Backend port 5000  ~  Frontend port 3000
echo.
start "Snapverse" /B /D "%~dp0backend" node server.js
start "Snapverse" /B /D "%~dp0frontend" node "node_modules\vite\bin\vite.js" --port 3000
echo Open http://localhost:3000 in your browser
echo.
echo Press any key to STOP all servers...
pause >nul
echo Stopping...
taskkill /f /im node.exe >nul 2>&1
