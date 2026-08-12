const fs = require('fs');
const path = require('path');
const vm = require('vm');

// aponta pra public/js dentro da pasta copiada do projeto
const PASTA_DADOS = path.join(__dirname, 'public', 'js');
const CAMINHO_SETS = path.join(PASTA_DADOS, 'dados.js');
const CAMINHO_CARTAS = path.join(PASTA_DADOS, 'dadosCartas.js');

const API_BASE = 'https://api.pokemontcg.io/v2';
const API_KEY = process.env.POKEMONTCG_API_KEY || null;
const headers = {
  ...(API_KEY ? { 'X-Api-Key': API_KEY } : {}),
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json'
};
const DATA_MINIMA = new Date('2023-03-31');

// coloque FORCE_ATUALIZAR=1 antes do comando pra ignorar o cache e rebaixar tudo, ex:
// no PowerShell: $env:FORCE_ATUALIZAR="1"; node gerarbancoDados.teste.js
const FORCE_ATUALIZAR = process.env.FORCE_ATUALIZAR === '1';

// dados.js é usado direto no front (variável global `sets`, sem module.exports),
// então é lido como texto e executado num sandbox pra extrair o array.
// Se o arquivo não existir ainda, retorna [] (será criado do zero).
function carregarSets() {
  if (!fs.existsSync(CAMINHO_SETS)) return [];

  const codigo = fs.readFileSync(CAMINHO_SETS, 'utf-8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(codigo + '\nthis.sets = sets;', sandbox);
  return sandbox.sets || [];
}

// bancoDados.js é usado direto no front (variável global, sem module.exports).
// Se já existir, carrega pra reaproveitar sets que já foram baixados antes.
function carregarbancoDadosExistente() {
  if (!fs.existsSync(CAMINHO_CARTAS)) return {};

  const codigo = fs.readFileSync(CAMINHO_CARTAS, 'utf-8');
  const sandbox = {};
  vm.createContext(sandbox);
  try {
    vm.runInContext(codigo + '\nthis.bancoDados = bancoDados;', sandbox);
    return sandbox.bancoDados || {};
  } catch {
    console.warn('⚠️  Não consegui ler bancoDados.js existente — vai baixar tudo do zero.');
    return {};
  }
}
function corAleatoria() {
  const cores = [
    '#CB2453', '#4A90D9', '#8B00FF', '#FF69B4', '#FF8C00',
    '#FFD700', '#00CED1', '#9B59B6', '#2ECC71', '#F1C40F',
    '#E74C3C', '#1ABC9C', '#3498DB', '#E67E22', '#8E44AD',
    '#D35400', '#27AE60', '#2980B9', '#C0392B'
  ];
  return cores[Math.floor(Math.random() * cores.length)];
}

async function fetchComRetry(url, tentativas = 4) {
  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    const res = await fetch(url, { headers });
    const texto = await res.text();

    if (res.ok) {
      try {
        return JSON.parse(texto);
      } catch {
        console.error('Resposta não é JSON válido:', texto.slice(0, 200));
      }
    }

    const ultimaTentativa = tentativa === tentativas;
    console.warn(`  ⚠️  HTTP ${res.status} (tentativa ${tentativa}/${tentativas})${ultimaTentativa ? ' — desistindo' : ''}`);

    if (ultimaTentativa) {
      throw new Error(`Falha após ${tentativas} tentativas: HTTP ${res.status}`);
    }

    const espera = 1000 * Math.pow(2, tentativa); // 2s, 4s, 8s, 16s...
    await new Promise(r => setTimeout(r, espera));
  }
}

async function fetchCardsDoSet(apiId) {
  let page = 1;
  const pageSize = 250;
  const cartas = [];

  while (true) {
    const url = `${API_BASE}/cards?q=set.id:${apiId}&page=${page}&pageSize=${pageSize}`;
    const json = await fetchComRetry(url);
    cartas.push(...json.data);
    if (json.data.length < pageSize) break;
    page++;
  }
  return cartas;
}

async function checarSetsFaltando(sets) {
  const json = await fetchComRetry(`${API_BASE}/sets`);
  const idsConhecidos = new Set(sets.map(s => s.apiId));

  return json.data.filter(s =>
    !idsConhecidos.has(s.id) && new Date(s.releaseDate) >= DATA_MINIMA
  );
}

// Encontra o índice do ']' que fecha especificamente o array `let sets = [...]`,
// contando colchetes balanceados a partir da declaração — assim ignora
// qualquer outro array que venha depois no mesmo arquivo (ex: todosPokemons)
function encontrarFimArraySets(conteudo) {
  const idxDecl = conteudo.indexOf('let sets');
  if (idxDecl === -1) return -1;

  const idxAbre = conteudo.indexOf('[', idxDecl);
  if (idxAbre === -1) return -1;

  let profundidade = 0;
  for (let i = idxAbre; i < conteudo.length; i++) {
    if (conteudo[i] === '[') profundidade++;
    else if (conteudo[i] === ']') {
      profundidade--;
      if (profundidade === 0) return i; // índice do ']' que fecha o array sets
    }
  }
  return -1;
}

async function atualizarSetsFile(faltando) {
  if (!faltando.length) return;

  const novasEntradas = faltando.map(s => {
    return `  {
    nomePt: '${s.name}',
    nomeEn: '${s.name}',
    sigla: '${s.ptcgoCode}',
    total: '${String(s.printedTotal).padStart(3, '0')}',
    apiId: '${s.id}',
    cor: '${corAleatoria()}',
    serie: '${s.series}',
    dataLancamento: '${s.releaseDate}'
  }`;
  }).join(',\n');

  if (!fs.existsSync(CAMINHO_SETS)) {
    // dados.js ainda não existe — cria o arquivo do zero com o array sets
    const conteudoNovo = `let sets = [\n${novasEntradas}\n];\n`;
    fs.writeFileSync(CAMINHO_SETS, conteudoNovo, 'utf-8');
    console.log(`\n✏️  dados.js criado com ${faltando.length} set(s):`);
    faltando.forEach(s => console.log(`  - ${s.id} (${s.name})`));
    return;
  }

  const conteudo = fs.readFileSync(CAMINHO_SETS, 'utf-8');
  const idxFechamento = encontrarFimArraySets(conteudo);

  if (idxFechamento === -1) {
    // arquivo existe mas não tem "let sets = [...]" ainda — cria a declaração no final
    const conteudoBase = conteudo.replace(/\s*$/, '');
    const novoConteudo = `${conteudoBase}\n\nlet sets = [\n${novasEntradas}\n];\n`;
    fs.writeFileSync(CAMINHO_SETS, novoConteudo, 'utf-8');
    console.log(`\n✏️  Array "sets" criado em dados.js com ${faltando.length} set(s):`);
    faltando.forEach(s => console.log(`  - ${s.id} (${s.name})`));
    return;
  }

  const antes = conteudo.slice(0, idxFechamento).replace(/\s*$/, '');
  const depois = conteudo.slice(idxFechamento); // começa em ']'
  const novoConteudo = `${antes},\n${novasEntradas}\n${depois}`;

  fs.writeFileSync(CAMINHO_SETS, novoConteudo, 'utf-8');
  console.log(`\n✏️  ${faltando.length} set(s) novo(s) adicionado(s) em dados.js:`);
  faltando.forEach(s => console.log(`  - ${s.id} (${s.name})`));
}

async function main() {
  fs.mkdirSync(PASTA_DADOS, { recursive: true }); // garante que public/js existe

  const sets = carregarSets();

  const MAX_RODADAS_CHECAGEM = 6;
  let faltando = [];
  let checagemOk = false;

  for (let tentativaRodada = 1; tentativaRodada <= MAX_RODADAS_CHECAGEM && !checagemOk; tentativaRodada++) {
    try {
      faltando = await checarSetsFaltando(sets);
      await atualizarSetsFile(faltando);
      checagemOk = true;
    } catch (err) {
      const ultima = tentativaRodada === MAX_RODADAS_CHECAGEM;
      console.error(`\n⚠️  Checagem de sets novos falhou (${err.message}) — rodada ${tentativaRodada}/${MAX_RODADAS_CHECAGEM}${ultima ? '' : ', tentando de novo...'}`);
      if (!ultima) {
        const espera = 5000 * tentativaRodada;
        console.log(`Aguardando ${espera / 1000}s antes de checar sets novos de novo...`);
        await new Promise(r => setTimeout(r, espera));
      }
    }
  }

  if (!checagemOk) {
    console.error(`\n⚠️  Não foi possível checar sets novos após ${MAX_RODADAS_CHECAGEM} rodadas. Prosseguindo só com os sets já existentes em dados.js.`);
  }

  faltando.forEach(s => {
    sets.push({
      nomePt: s.name,
      nomeEn: s.name,
      sigla: s.ptcgoCode,
      total: String(s.printedTotal).padStart(3, '0'),
      apiId: s.id,
      cor: corAleatoria(),
      serie: s.series,
      dataLancamento: s.releaseDate
    });
  });

  const bancoDados = carregarbancoDadosExistente();

  let setsParaBuscar = sets;
  if (!FORCE_ATUALIZAR) {
    const jaExistem = sets.filter(s => Array.isArray(bancoDados[s.apiId]) && bancoDados[s.apiId].length > 0);
    setsParaBuscar = sets.filter(s => !(Array.isArray(bancoDados[s.apiId]) && bancoDados[s.apiId].length > 0));

    if (jaExistem.length) {
      console.log(`\n♻️  Reaproveitando ${jaExistem.length} set(s) já baixados: ${jaExistem.map(s => s.apiId).join(', ')}`);
    }
    if (!setsParaBuscar.length) {
      console.log('\n✅ Nada novo pra baixar — dadosCartas.js já está completo.');
      return;
    }
    console.log(`Baixando ${setsParaBuscar.length} set(s) novo(s) ou vazio(s): ${setsParaBuscar.map(s => s.apiId).join(', ')}`);
  } else {
    console.log('\n🔄 FORCE_ATUALIZAR ativo — ignorando cache, rebaixando tudo.');
  }

  let setsRestantes = [...setsParaBuscar];
  let rodada = 1;
  const MAX_RODADAS = 6;

  while (setsRestantes.length && rodada <= MAX_RODADAS) {
    console.log(`\n=== Rodada ${rodada} — ${setsRestantes.length} set(s) pendente(s) ===`);
    const falharamNestaRodada = [];

    for (const setConfig of setsRestantes) {
      const { apiId, nomePt, nomeEn, sigla } = setConfig;
      console.log(`Buscando ${apiId}...`);

      try {
        const cartasApi = await fetchCardsDoSet(apiId);

        bancoDados[apiId] = cartasApi.map(carta => ({
          name: carta.name ?? null,
          number: carta.number ? Number(carta.number) : null,
          type: carta.types?.[0] ?? null,
          rarity: carta.rarity ?? null,
          setNameBr: nomePt,
          setNameEn: carta.set.name ?? nomeEn,
          ptcgoCode: carta.set.ptcgoCode ?? sigla,
          numSet: carta.set.printedTotal ?? null,
          setId: carta.set.id,
          imageLarge: carta.images?.large ?? null
        }));
      } catch (err) {
        console.error(`Falhou ${apiId}: ${err.message}`);
        falharamNestaRodada.push(setConfig);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    setsRestantes = falharamNestaRodada;

    if (setsRestantes.length) {
      const espera = 5000 * rodada; // 5s, 10s, 15s... entre rodadas
      console.log(`\n${setsRestantes.length} set(s) falharam: ${setsRestantes.map(s => s.apiId).join(', ')}`);
      console.log(`Aguardando ${espera / 1000}s antes da próxima rodada...`);
      await new Promise(r => setTimeout(r, espera));
    }

    rodada++;
  }

  if (setsRestantes.length) {
    console.error(`\n⚠️  ${setsRestantes.length} set(s) não baixaram após ${MAX_RODADAS} rodadas: ${setsRestantes.map(s => s.apiId).join(', ')}`);
    console.error('Rode o script de novo mais tarde — o que já baixou foi salvo normalmente.');
  } else {
    console.log('\n✅ Todos os sets baixados com sucesso.');
  }

  // sem module.exports — arquivo é consumido via <script src="js/bancoDados.js"> no navegador
  const conteudo = `let bancoDados = ${JSON.stringify(bancoDados, null, 4)};\n`;
  fs.writeFileSync(CAMINHO_CARTAS, conteudo, 'utf-8');
  console.log(`\nGerado: ${CAMINHO_CARTAS}`);
}

main();