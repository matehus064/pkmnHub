const { chromium } = require("playwright");

/**
 * Busca o preço mínimo de uma carta no LigaPokemon.com.br
 * @param {string} url - URL da carta
 * @returns {Promise<Object>} - Dados da carta com preço mínimo
 */
async function buscarPrecoCarta(url) {
  const browser = await chromium.launch({
    headless: true, // mude para false se quiser ver o browser abrindo
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    locale: "pt-BR",
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  try {
    console.log(`🔍 Acessando: ${url}`);
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Aguarda o conteúdo carregar
    await page.waitForTimeout(2000);

    // Salva o HTML para debug (opcional)
    // const html = await page.content();
    // require('fs').writeFileSync('page.html', html);

    // Extrai os dados da carta
    const dados = await page.evaluate(() => {
      const resultado = {};

      // Nome da carta
      const nome = document.querySelector("h1, .card-name, .nome-carta");
      resultado.nome = nome ? nome.textContent.trim() : null;

      // Estratégia 1: procura elementos com texto "mín", "min", "menor"
      const todosTextos = document.querySelectorAll("*");
      for (const el of todosTextos) {
        const texto = el.textContent.toLowerCase();
        const filhos = el.children.length;

        if (
          filhos === 0 &&
          (texto.includes("mín") ||
            texto.includes("min.") ||
            texto.includes("preço mín"))
        ) {
          // Pega o elemento pai para ver o valor ao lado
          const pai = el.parentElement;
          if (pai) {
            resultado.precoMinTexto = pai.textContent.trim();
          }
        }
      }

      // Estratégia 2: procura por classes comuns de preço
      const seletoresTentativa = [
        ".preco-min",
        ".price-min",
        ".min-price",
        '[class*="min"]',
        '[class*="preco"]',
        '[class*="price"]',
        ".valor-min",
        ".menor-preco",
      ];

      for (const seletor of seletoresTentativa) {
        const el = document.querySelector(seletor);
        if (el) {
          resultado[`seletor_${seletor}`] = el.textContent.trim();
        }
      }

      // Estratégia 3: procura tabelas de preço
      const tabelas = document.querySelectorAll("table");
      resultado.tabelas = [];
      for (const tabela of tabelas) {
        resultado.tabelas.push(tabela.textContent.replace(/\s+/g, " ").trim().substring(0, 300));
      }

      // Estratégia 4: procura por R$ nos textos
      const reais = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.includes("R$")) {
          const pai = node.parentElement;
          const avô = pai ? pai.parentElement : null;
          reais.push({
            texto: node.textContent.trim(),
            classe: pai ? pai.className : "",
            classeAvô: avô ? avô.className : "",
            html: avô ? avô.innerHTML.substring(0, 200) : "",
          });
        }
      }
      resultado.valoresReais = reais;

      return resultado;
    });

    console.log("\n📦 Dados extraídos:\n");
    console.log(JSON.stringify(dados, null, 2));

    // Tenta identificar o preço mínimo nos dados extraídos
    const precoMin = extrairPrecoMinimo(dados);
    if (precoMin) {
      console.log(`\n✅ PREÇO MÍNIMO ENCONTRADO: ${precoMin}`);
    } else {
      console.log(
        "\n⚠️  Preço mínimo não identificado automaticamente. Veja os dados acima para identificar o seletor correto."
      );
    }

    return { ...dados, precoMinimo: precoMin };
  } catch (err) {
    console.error("❌ Erro ao acessar o site:", err.message);
    throw err;
  } finally {
    await browser.close();
  }
}

/**
 * Tenta extrair o preço mínimo dos dados coletados
 */
function extrairPrecoMinimo(dados) {
  // Procura nos valores com R$
  if (dados.valoresReais && dados.valoresReais.length > 0) {
    for (const item of dados.valoresReais) {
      const textoLower = (item.classeAvô + item.classe + item.texto).toLowerCase();
      if (
        textoLower.includes("min") ||
        textoLower.includes("menor") ||
        textoLower.includes("mín")
      ) {
        const match = item.texto.match(/R\$\s*[\d.,]+/);
        if (match) return match[0];
      }
    }

    // Se não achou pelo contexto, pega o menor valor
    const valores = dados.valoresReais
      .map((item) => {
        const match = item.texto.match(/R\$\s*([\d.,]+)/);
        if (match) {
          return parseFloat(
            match[1].replace(/\./g, "").replace(",", ".")
          );
        }
        return null;
      })
      .filter((v) => v !== null && !isNaN(v));

    if (valores.length > 0) {
      const menor = Math.min(...valores);
      return `R$ ${menor.toFixed(2).replace(".", ",")}`;
    }
  }

  return null;
}

// ─── Execução ───────────────────────────────────────────────────────────────

const URL_CARTA =
  "https://www.ligapokemon.com.br/?view=cards/card&card=Steven%27s%20Metagross%20ex%20(288/217)&ed=ASC&num=289";

buscarPrecoCarta(URL_CARTA).catch(console.error);
