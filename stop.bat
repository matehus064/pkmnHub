@echo off
for /f "usebackq tokens=*" %%a in ("%~dp0pids.txt") do taskkill /f /pid %%a
del "%~dp0pids.txt"
echo Servidor finalizado!