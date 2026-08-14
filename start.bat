@echo off
cd /d "%~dp0"
ping -n 16 127.0.0.1 > nul
start /min cmd /c "npm start"
start /min cmd /c ""%~dp0ngrok.exe" http 3333"

ping -n 6 127.0.0.1 > nul

for /f "tokens=1" %%a in ('wmic process where "name='node.exe'" get processid ^| findstr /r "[0-9]"') do echo %%a >> "%~dp0pids.txt"
for /f "tokens=1" %%a in ('wmic process where "name='ngrok.exe'" get processid ^| findstr /r "[0-9]"') do echo %%a >> "%~dp0pids.txt"

echo Servidor inicializado!