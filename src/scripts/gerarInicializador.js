// src/scripts/gerar-scripts.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perguntar(pergunta) {
  return new Promise((resolve) => rl.question(pergunta, resolve));
}

// src/scripts/ -> dois níveis acima chega na raiz do projeto
const raizProjeto = path.join(__dirname, '..', '..');

const templates = {
  windows: {
    start: `@echo off
cd /d "%~dp0"

where ngrok >nul 2>&1
if errorlevel 1 (
  echo ERRO: ngrok nao encontrado no PATH. Instale com: winget install ngrok.ngrok
  pause
  exit /b 1
)

ping -n 16 127.0.0.1 > nul

if exist "%~dp0pids.txt" del "%~dp0pids.txt"

start "AppServer" /min cmd /c "npm start"
start "AppNgrok" /min cmd /c "ngrok http 3333"

ping -n 6 127.0.0.1 > nul

for /f "tokens=2" %%a in ('tasklist /v /fi "windowtitle eq AppServer*" /fo list ^| findstr /i "^PID:"') do echo %%a >> "%~dp0pids.txt"
for /f "tokens=2" %%a in ('tasklist /v /fi "windowtitle eq AppNgrok*" /fo list ^| findstr /i "^PID:"') do echo %%a >> "%~dp0pids.txt"

echo Servidor inicializado!
`,
    stop: `@echo off
if not exist "%~dp0pids.txt" (
  echo Nenhum processo registrado ^(pids.txt nao encontrado^).
  goto fim
)
for /f "usebackq tokens=*" %%a in ("%~dp0pids.txt") do (
  taskkill /f /pid %%a >nul 2>&1
)
del "%~dp0pids.txt"
echo Servidor finalizado!
:fim
`,
    startName: 'start.bat',
    stopName: 'stop.bat'
  },

  linux: {
    start: `#!/bin/bash
cd "$(dirname "$0")"
sleep 16

: > "$(dirname "$0")/pids.txt"

nohup npm start > /dev/null 2>&1 &
echo $! >> "$(dirname "$0")/pids.txt"

nohup "$(dirname "$0")/ngrok" http 3333 > /dev/null 2>&1 &
echo $! >> "$(dirname "$0")/pids.txt"

sleep 6

echo "Servidor inicializado!"
`,
    stop: `#!/bin/bash
cd "$(dirname "$0")"
if [ ! -f "pids.txt" ]; then
  echo "Nenhum processo registrado (pids.txt nao encontrado)."
  exit 0
fi
while read -r pid; do
  kill -9 "$pid" 2>/dev/null
done < "pids.txt"
rm -f "pids.txt"
echo "Servidor finalizado!"
`,
    startName: 'start.sh',
    stopName: 'stop.sh'
  }
};

async function main() {
  const resposta = (await perguntar('Gerar scripts para qual sistema? (windows/linux): '))
    .trim()
    .toLowerCase();

  const sistema = resposta.startsWith('l') ? 'linux' : 'windows';
  const cfg = templates[sistema];

  fs.writeFileSync(path.join(raizProjeto, cfg.startName), cfg.start, { encoding: 'utf8' });
  fs.writeFileSync(path.join(raizProjeto, cfg.stopName), cfg.stop, { encoding: 'utf8' });

  if (sistema === 'linux') {
    fs.chmodSync(path.join(raizProjeto, cfg.startName), 0o755);
    fs.chmodSync(path.join(raizProjeto, cfg.stopName), 0o755);
  }

  console.log(`Gerado em ${raizProjeto}: ${cfg.startName} e ${cfg.stopName}`);
  rl.close();
}

main();