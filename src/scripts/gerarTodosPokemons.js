const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PASTA_DADOS = path.join(__dirname, '..', '..', 'public', 'js');
const CAMINHO_SETS = path.join(PASTA_DADOS, 'dados.js');

const API_BASE = 'https://pokeapi.co/api/v2';
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json'
};

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
    if (ultimaTentativa) throw new Error(`Falha após ${tentativas} tentativas: HTTP ${res.status}`);

    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, tentativa)));
  }
}

// extrai e avalia SÓ o trecho "[...]" de todosPokemons, isolado do resto do
// arquivo — evita qualquer conflito de escopo com a declaração de `sets`.
// Se o array ainda não existir no arquivo, retorna [] (será criado na inserção).
function carregarTodosPokemons(conteudo) {
  const idxDeclBusca = conteudo.indexOf('let todosPokemons');
  if (idxDeclBusca === -1) return [];

  const idxAbre = conteudo.indexOf('[', idxDeclBusca);
  const idxFecha = encontrarFimArray(conteudo, 'todosPokemons');

  if (idxAbre === -1 || idxFecha === -1) return [];

  const trecho = conteudo.slice(idxAbre, idxFecha + 1); // inclui os colchetes
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`this.__arr = ${trecho};`, sandbox);
  return sandbox.__arr || [];
}

function normalizar(nome) {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s.\-']/g, '');
}

// slugs da API que já batem com o formato TCG e NÃO devem virar espaço
const MANTER_HIFEN = new Set([
  'ho-oh', 'jangmo-o', 'hakamo-o', 'kommo-o',
  'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu'
]);

// casos especiais que não seguem a regra simples de hífen->espaço
const MAPA_ESPECIAL = {
  'mr-mime': 'mr. mime',
  'mime-jr': 'mime jr.',
  'mr-rime': 'mr. rime',
  'type-null': 'type null',
  'porygon-z': 'porygon z'
};

function converterParaFormatoTcg(slugApi) {
  if (Object.prototype.hasOwnProperty.call(MAPA_ESPECIAL, slugApi)) {
    return MAPA_ESPECIAL[slugApi]; // pode ser null (= pular)
  }
  if (MANTER_HIFEN.has(slugApi)) {
    return slugApi;
  }
  return slugApi.replace(/-/g, ' ');
}

async function buscarTodasEspecies() {
  const especies = [];
  let url = `${API_BASE}/pokemon-species?limit=100`;

  while (url) {
    const json = await fetchComRetry(url);
    especies.push(...json.results.map(r => r.name));
    url = json.next;
    await new Promise(r => setTimeout(r, 300));
  }

  return especies;
}

// acha o índice do ']' que fecha `let <nomeVar> = [...]`, contando colchetes
// balanceados a partir da declaração — ignora qualquer array que venha depois
function encontrarFimArray(conteudo, nomeVar) {
  const idxDecl = conteudo.indexOf(`let ${nomeVar}`);
  if (idxDecl === -1) return -1;

  const idxAbre = conteudo.indexOf('[', idxDecl);
  if (idxAbre === -1) return -1;

  let profundidade = 0;
  for (let i = idxAbre; i < conteudo.length; i++) {
    if (conteudo[i] === '[') profundidade++;
    else if (conteudo[i] === ']') {
      profundidade--;
      if (profundidade === 0) return i;
    }
  }
  return -1;
}

function inserirNovosPokemons(conteudo, novosNomes) {
  const novasEntradas = novosNomes.map(n => `"${n}"`).join(', ');
  const idxFechamento = encontrarFimArray(conteudo, 'todosPokemons');

  if (idxFechamento === -1) {
    // array ainda não existe em dados.js (ou o arquivo nem existe) — cria do zero
    const conteudoBase = conteudo.replace(/\s*$/, '');
    const separador = conteudoBase ? `${conteudoBase}\n\n` : '';
    return `${separador}let todosPokemons = [${novasEntradas}];\n`;
  }

  const antes = conteudo.slice(0, idxFechamento).replace(/\s*$/, '');
  const depois = conteudo.slice(idxFechamento); // começa em ']'
  return `${antes}, ${novasEntradas}${depois}`;
}

const REGIOES_POR_GERACAO = {
  'generation-i': 'Kanto',
  'generation-ii': 'Johto',
  'generation-iii': 'Hoenn',
  'generation-iv': 'Sinnoh',
  'generation-v': 'Unova',
  'generation-vi': 'Kalos',
  'generation-vii': 'Alola',
  'generation-viii': 'Galar/Hisui',
  'generation-ix': 'Paldea'
};

function extrairIdDaUrl(url) {
  const partes = url.replace(/\/$/, '').split('/');
  return parseInt(partes[partes.length - 1], 10);
}

// Consulta a PokeAPI pra descobrir, pra cada geração, o menor e o maior
// número de Pokédex nacional que ela cobre. Não guarda nomes — só as faixas.
async function buscarFaixasGeracoes() {
  const listaGeracoes = await fetchComRetry(`${API_BASE}/generation?limit=100`);
  const geracoesOrdenadas = listaGeracoes.results
    .map(g => ({ nome: g.name, id: extrairIdDaUrl(g.url) }))
    .sort((a, b) => a.id - b.id);

  const resultado = [];

  for (const gerMeta of geracoesOrdenadas) {
    console.log(`  Geração ${gerMeta.id}...`);
    const detalhe = await fetchComRetry(`${API_BASE}/generation/${gerMeta.id}`);

    const idsEspecies = detalhe.pokemon_species.map(s => extrairIdDaUrl(s.url));
    const inicio = Math.min(...idsEspecies);
    const fim = Math.max(...idsEspecies);

    const regiao = REGIOES_POR_GERACAO[gerMeta.nome] || '';
    const nomeExibicao = `Geração ${gerMeta.id}${regiao ? ' — ' + regiao : ''}`;

    resultado.push({ id: gerMeta.id, nome: nomeExibicao, inicio, fim });
    await new Promise(r => setTimeout(r, 300));
  }

  return resultado;
}

// Substitui por completo (ou cria) "let <nomeVar> = ...;" no conteúdo.
// Diferente de inserirNovosPokemons (que só ANEXA): geracoes é recalculada
// inteira a cada execução, então é sobrescrita.
function substituirArray(conteudo, nomeVar, valorLiteral) {
  const idxDecl = conteudo.indexOf(`let ${nomeVar}`);

  if (idxDecl === -1) {
    const conteudoBase = conteudo.replace(/\s*$/, '');
    const separador = conteudoBase ? `${conteudoBase}\n\n` : '';
    return `${separador}let ${nomeVar} = ${valorLiteral};\n`;
  }

  const idxFechamento = encontrarFimArray(conteudo, nomeVar);
  if (idxFechamento === -1) return conteudo;

  let idxFim = idxFechamento + 1;
  if (conteudo[idxFim] === ';') idxFim++;

  const antes = conteudo.slice(0, idxDecl);
  const depois = conteudo.slice(idxFim);
  return `${antes}let ${nomeVar} = ${valorLiteral};${depois}`;
}

async function main() {
  console.log('Buscando lista completa de espécies na PokeAPI...');
  const especiesApi = await buscarTodasEspecies();
  console.log(`Total na API: ${especiesApi.length} espécies\n`);

  fs.mkdirSync(PASTA_DADOS, { recursive: true }); // garante que public/js existe

  const conteudoOriginal = fs.existsSync(CAMINHO_SETS)
    ? fs.readFileSync(CAMINHO_SETS, 'utf-8')
    : '';
  const pokemonsAtuais = carregarTodosPokemons(conteudoOriginal);
  const normalizadosAtuais = new Set(pokemonsAtuais.map(normalizar));

  const novosNomes = [];
  const pulados = [];

  for (const slugApi of especiesApi) {
    // caso especial: nidoran-f e nidoran-m viram uma única entrada "nidoran"
    if (slugApi === 'nidoran-f' || slugApi === 'nidoran-m') {
      if (!normalizadosAtuais.has(normalizar('nidoran'))) {
        novosNomes.push('nidoran');
        normalizadosAtuais.add(normalizar('nidoran'));
      } else {
        pulados.push(slugApi);
      }
      continue;
    }

    if (normalizadosAtuais.has(normalizar(slugApi))) continue; // já existe

    const nomeTcg = converterParaFormatoTcg(slugApi);

    if (nomeTcg === null) {
      pulados.push(slugApi);
      continue;
    }

    // evita duplicar se a conversão coincidir com algo já existente
    if (normalizadosAtuais.has(normalizar(nomeTcg))) continue;

    novosNomes.push(nomeTcg);
    normalizadosAtuais.add(normalizar(nomeTcg)); // evita duplicata dentro do próprio lote
  }

  if (pulados.length) {
    console.log(`ℹ️  Ignorados (já cobertos por entrada existente): ${pulados.join(', ')}`);
  }

  let conteudoAtual = conteudoOriginal;

  if (novosNomes.length) {
    conteudoAtual = inserirNovosPokemons(conteudoAtual, novosNomes);
    console.log(`\n✏️  ${novosNomes.length} Pokémon novo(s) adicionado(s) em dados.js:`);
    novosNomes.forEach(n => console.log(`  - "${n}"`));
    console.log('\n⚠️  Confira a grafia contra as cartas TCG reais — a conversão é uma aproximação (hífen -> espaço), pode não bater 100% em casos raros.');
  } else {
    console.log('\n✅ Nenhum Pokémon novo pra adicionar em todosPokemons.');
  }

  console.log('\nBuscando faixas de geração na PokeAPI...');
  const geracoesData = await buscarFaixasGeracoes();
  conteudoAtual = substituirArray(conteudoAtual, 'geracoes', JSON.stringify(geracoesData, null, 2));

  fs.writeFileSync(CAMINHO_SETS, conteudoAtual, 'utf-8');
  console.log(`✏️  "geracoes" atualizado em dados.js (${geracoesData.length} gerações).`);
}

main();