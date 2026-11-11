/**
 * Módulo de Mapeamento de Licitações de Tecnologia
 * Granularidade: Federal -> Estadual -> Municipal
 * Filtros por alertas de dependência e oportunidades populares
 */

const LicitacoesModule = (() => {
  let esferaAtiva = "todas";
  let tagAtiva = "todas";
  let termoBusca = "";

  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(valor);
  }

  function renderizarKPIs(lista) {
    const totalEditais = lista.length;
    const valorGlobal = lista.reduce((acc, curr) => acc + curr.valorEstimado, 0);
    const alertasDependencia = lista.filter(item => item.tags.includes("alerta-dependencia") || item.tags.includes("alerta-vigilancia")).length;
    const oportunidadesPopulares = lista.filter(item => item.tags.includes("oportunidade-popular")).length;

    const container = document.getElementById("licitacoesKPIs");
    if (!container) return;

    container.innerHTML = `
      <div class="kpi-card destaque-azul">
        <span class="kpi-titulo">Total de Editais Mapeados</span>
        <div class="kpi-valor">${totalEditais}</div>
        <p class="kpi-desc">Granularidade ativa: <strong>${esferaAtiva.toUpperCase()}</strong></p>
      </div>

      <div class="kpi-card destaque-amarelo">
        <span class="kpi-titulo">Volume Orçamentário em Disputa</span>
        <div class="kpi-valor">${formatarMoeda(valorGlobal)}</div>
        <p class="kpi-desc">Recurso público sob decisão de compra</p>
      </div>

      <div class="kpi-card destaque-vermelho">
        <span class="kpi-titulo">Editais sob Alerta de Risco</span>
        <div class="kpi-valor">${alertasDependencia}</div>
        <p class="kpi-desc">Risco de lock-in com Big Techs ou vigilância</p>
      </div>

      <div class="kpi-card destaque-verde">
        <span class="kpi-titulo">Oportunidades Populares</span>
        <div class="kpi-valor">${oportunidadesPopulares}</div>
        <p class="kpi-desc">Fomento a software livre e cooperativas</p>
      </div>
    `;
  }

  function filtrar() {
    let dados = window.OBSERVATORIO_DATA.licitacoes;

    // Filtro por Esfera (Federal / Estadual / Municipal)
    if (esferaAtiva !== "todas") {
      dados = dados.filter(item => item.esfera === esferaAtiva);
    }

    // Filtro por Tag Crítica
    if (tagAtiva !== "todas") {
      dados = dados.filter(item => item.tags.includes(tagAtiva));
    }

    // Busca textual
    if (termoBusca.trim() !== "") {
      const q = termoBusca.toLowerCase();
      dados = dados.filter(item => 
        item.objeto.toLowerCase().includes(q) ||
        item.orgao.toLowerCase().includes(q) ||
        item.uf.toLowerCase().includes(q) ||
        item.municipio.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }

    return dados;
  }

  function renderizarCards() {
    const lista = filtrar();
    renderizarKPIs(lista);

    const container = document.getElementById("licitacoesGrid");
    if (!container) return;

    if (lista.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; background: #FFF; border: var(--border-thick); padding: 40px; text-align: center;">
          <h3 style="font-family: var(--font-display); font-size: 1.3rem;">Nenhum edital encontrado com os filtros selecionados</h3>
          <p style="margin-top: 8px; color: #56615C;">Tente remover filtros ou buscar por outro termo.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = lista.map(item => {
      const isOportunidade = item.tags.includes("oportunidade-popular");
      return `
        <article class="card-licitacao" data-id="${item.id}">
          <div>
            <div class="card-licitacao-header">
              <span class="badge-esfera ${item.esfera}">
                ${item.esfera === 'federal' ? '🇧🇷 União (Federal)' : item.esfera === 'estadual' ? `📍 Estadual · ${item.uf}` : `🏛️ Municipal · ${item.municipio}/${item.uf}`}
              </span>
              <span class="licitacao-id">${item.id}</span>
            </div>

            <h4 class="licitacao-orgao">${item.orgao}</h4>
            <p class="licitacao-objeto" style="margin-top: 8px;">${item.objeto}</p>
          </div>

          <div class="licitacao-alerta ${isOportunidade ? 'oportunidade' : ''}">
            <strong>${isOportunidade ? '🟢 OPORTUNIDADE POPULAR' : '🚨 ALERTA CRÍTICO'}</strong>:
            ${item.alertaCritico}
          </div>

          <div class="card-licitacao-footer">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #56615C; display: block;">VALOR ESTIMADO</span>
              <span class="licitacao-valor">${formatarMoeda(item.valorEstimado)}</span>
            </div>
            <button class="btn-detalhes" onclick="LicitacoesModule.abrirDossie('${item.id}')">
              Ver Dossiê →
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  function abrirDossie(id) {
    const item = window.OBSERVATORIO_DATA.licitacoes.find(l => l.id === id);
    if (!item) return;

    const isOportunidade = item.tags.includes("oportunidade-popular");

    const conteudo = `
      <div style="background-color: ${isOportunidade ? '#F1FBF2' : '#FFF2F1'}; border: var(--border-medium); padding: 16px;">
        <span class="badge-esfera ${item.esfera}" style="display: inline-block; margin-bottom: 8px;">
          ${item.esfera.toUpperCase()} · ${item.municipio}/${item.uf}
        </span>
        <h4 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 900; margin-bottom: 4px;">
          ${item.orgao}
        </h4>
        <p style="font-family: var(--font-mono); font-size: 0.8rem; color: #56615C;">Identificador: ${item.id} | Modalidade: ${item.modalidade}</p>
      </div>

      <div>
        <h5 style="font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: #56615C; margin-bottom: 4px;">Objeto do Edital</h5>
        <p style="font-size: 0.95rem; line-height: 1.45; background: #FFF; border: var(--border-thin); padding: 12px;">${item.objeto}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="background: #FFF; border: var(--border-thin); padding: 12px;">
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #56615C; display: block;">VALOR TOTAL ESTIMADO</span>
          <span style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--azul-macacao);">${formatarMoeda(item.valorEstimado)}</span>
        </div>
        <div style="background: #FFF; border: var(--border-thin); padding: 12px;">
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #56615C; display: block;">DATA DE ABERTURA / PRAZO</span>
          <span style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700;">${item.dataAbertura}</span>
        </div>
      </div>

      <div>
        <h5 style="font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: #56615C; margin-bottom: 4px;">Fornecedor Provável / Canal</h5>
        <div style="background: var(--areia); border: var(--border-thin); padding: 10px 14px; font-weight: 700; font-size: 0.9rem;">
          ${item.fornecedorFavorito}
        </div>
      </div>

      <div style="border-left: 6px solid ${isOportunidade ? 'var(--verde-pilar)' : 'var(--vermelho-ato)'}; background: #FFF; border: var(--border-thin); padding: 14px;">
        <h5 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; color: ${isOportunidade ? 'var(--verde-pilar)' : 'var(--vermelho-ato)'};">
          Impacto Popular na Vida Real
        </h5>
        <p style="font-size: 0.88rem; line-height: 1.4;">${item.impactoPopular}</p>
      </div>

      <div style="background: #FFFDF0; border: var(--border-medium); padding: 16px;">
        <span style="background: var(--amarelo-sol); color: var(--preto-tinta); padding: 2px 8px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;">
          ENCAMINHAMENTO EIXO 4
        </span>
        <h5 style="font-family: var(--font-display); font-size: 1rem; font-weight: 900; margin: 8px 0 4px 0;">
          Ação do Movimento
        </h5>
        <p style="font-size: 0.9rem; line-height: 1.45; color: #1C1712;">${item.propostaEixo4}</p>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button class="btn-tradutor-popular" style="width: 100%; justify-content: center;" onclick="alert('Minuta de impugnação popular gerada com sucesso! Você pode baixar o texto para enviar ao Tribunal de Contas ou Ministério Público.')">
          📋 Gerar Minuta de Impugnação Popular
        </button>
      </div>
    `;

    window.App.abrirDrawer("Dossiê de Licitação de Tecnologia", conteudo);
  }

  function init() {
    // Event listeners dos filtros de esfera
    const esferaBtns = document.querySelectorAll("[data-esfera]");
    esferaBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        esferaBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        esferaAtiva = btn.getAttribute("data-esfera");
        renderizarCards();
      });
    });

    // Event listeners dos filtros de tag crítica
    const tagBtns = document.querySelectorAll("[data-tag]");
    tagBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tagBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        tagAtiva = btn.getAttribute("data-tag");
        renderizarCards();
      });
    });

    // Campo de busca
    const buscaInput = document.getElementById("buscaLicitacoes");
    if (buscaInput) {
      buscaInput.addEventListener("input", (e) => {
        termoBusca = e.target.value;
        renderizarCards();
      });
    }

    renderizarCards();
  }

  return {
    init,
    abrirDossie
  };
})();

window.LicitacoesModule = LicitacoesModule;
