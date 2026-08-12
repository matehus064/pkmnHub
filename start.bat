@echo off
timeout /t 15 /nobreak > nul
start /min cmd /c "cd /d %~dp0pkmnHub-vTestes && npm start"
start /min cmd /c "C:\Users\mathe\OneDrive\Desktop\projeto_pessoal\ngrok.exe http 3333"

timeout /t 5 /nobreak > nul

for /f "tokens=1" %%a in ('wmic process where "name='node.exe'" get processid ^| findstr /r "[0-9]"') do echo %%a >> "%~dp0pids.txt"
for /f "tokens=1" %%a in ('wmic process where "name='ngrok.exe'" get processid ^| findstr /r "[0-9]"') do echo %%a >> "%~dp0pids.txt"

echo Servidor inicializado!