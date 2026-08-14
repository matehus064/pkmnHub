# pkmnHub

Aplicação web para colecionadores de Pokémon TCG: cadastro de coleção, acompanhamento de valor de mercado, histórico de preços, binders visuais, perfis públicos e sistema de amizades.

Stack: **Node.js + Express** no backend, **MySQL** como banco de dados e **HTML/CSS/JS puro** no frontend.

## Funcionalidades

- **Coleção**: cadastro de cartas, controle de quantidade e valor investido/retornado
- **Binders**: organização visual da coleção em formato de álbum, com posse de cartas por slot
- **Dashboard**: KPIs de coleção (total gasto, retorno, valor atual) e gráficos de evolução
- **Histórico de preço**: gráfico do preço de cada carta ao longo do tempo (30 dias / 3 meses / 6 meses / 1 ano)
- **Sets**: navegação pelos sets do TCG com grid de cartas
- **Perfil público**: página `/perfil?u=usuario` com binders, showcase de cartas e dados públicos
- **Amizades**: solicitação, aceite/recusa e listagem de amigos entre usuários
- **Jobs automáticos**: snapshot periódico do valor da coleção e compactação do histórico de preços (rodam no `npm start`)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://dev.mysql.com/downloads/) 8+

## Instalação

```bash
git clone https://github.com/matehus064/pkmnHub.git
cd pkmnHub
npm install
```

### Banco de dados

Crie o banco e as tabelas a partir do dump disponível em `src/database/`:

```bash
mysql -u root -p < src/database/query_pkmnHub.sql
```

### Dados de cartas e sets

O projeto depende de dados de sets e cartas (`public/js/dados.js` e `public/js/dadosCartas.js`) que não vêm prontos no repositório e precisam ser gerados rodando os scripts em `src/scripts/`:

```bash
node src/scripts/gerarDadosCartas.teste.js   # baixa sets e cartas via API pública (pokemontcg.io)
node src/scripts/atualizarTodosPokemons.js   # atualiza lista de Pokémon via PokeAPI
```

Esses scripts geram/atualizam os arquivos usados pelo frontend e pelo processo de povoamento do banco (`base_cards`). Rode-os antes de usar a aplicação pela primeira vez, e sempre que quiser atualizar a base com sets/cartas novos.

> Opcional: defina `POKEMONTCG_API_KEY` no `.env`/`.env.dev` para evitar limites de taxa da API do pokemontcg.io.

### Variáveis de ambiente

Crie um arquivo `.env.dev` (ambiente de desenvolvimento) na raiz do projeto:

```env
AMBIENTE_PROCESSO=desenvolvimento

# Configurações de conexão com o banco de dados
DB_HOST=localhost
DB_DATABASE=pkmnhub
DB_USER=root
DB_PASSWORD=sua_senha
DB_PORT=3306

# Configurações do servidor de aplicação
APP_PORT=3333
APP_HOST=localhost
```

> Se a senha tiver caracteres especiais, coloque-a entre aspas.

Para produção, crie um `.env` equivalente e altere a linha 2 de `app.js` (`ambiente_processo`) para `'producao'`.

⚠️ **Nunca commite `.env`/`.env.dev` com credenciais reais.** Adicione-os ao `.gitignore`.

## Rodando o projeto

```bash
npm start        # produção/uso normal
npm run dev       # com nodemon, reinicia automaticamente ao salvar
```

A aplicação sobe em `http://localhost:3333` (ou na porta/host definidos em `APP_PORT`/`APP_HOST`).

Alternativamente, no Windows:

```bash
start.bat   # inicia
stop.bat    # encerra
```

## Estrutura do projeto

```
pkmnHub/
├── app.js                  # entrypoint da aplicação Express
├── public/                 # frontend (HTML/CSS/JS)
│   ├── dashboard/          # páginas do dashboard (coleção, binders, sets, perfil...)
│   ├── js/                 # scripts client-side
│   └── css/
├── src/
│   ├── routes/              # definição das rotas Express
│   ├── controllers/         # lógica das rotas
│   ├── models/               # queries e acesso ao banco
│   ├── database/             # config de conexão MySQL e scripts SQL
│   ├── jobs/                  # cron jobs (snapshot de coleção, log de preços)
│   └── scripts/               # scripts utilitários (ex: geração de dados de cartas via API)
└── package.json
```

## Rotas principais da API

| Recurso | Rota base | Descrição |
|---|---|---|
| Usuários | `/usuarios` | cadastro e autenticação |
| Cartas | `/cards` | cadastro, coleção, histórico de preço |
| Transações | `/transacoes` | registro de vendas |
| KPIs | `/kpis` | indicadores da coleção |
| Binder | `/binder` | álbuns visuais e slots |
| Perfil | `/perfil` | perfil público de usuário |
| Showcase | `/showcase` | vitrine de cartas no perfil |
| Amizades | `/amizades` | solicitação, aceite e listagem de amigos |

## Licença

Distribuído sob a licença GNU GENERAL PUBLIC LICENSE. Veja [LICENSE](LICENSE) para mais detalhes.