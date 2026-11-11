/**
 * Módulo de Mapeamento de Chamadas e Consultas Públicas
 * Orçamento, Políticas Públicas e Editais de Tecnologia
 * Movimento pela Soberania Digital Popular · Eixo 4
 */

const ConsultasModule = (() => {
  let filtroTipo = "todos";
  let filtroCategoria = "todas";
  let filtroEsfera = "todas";
  let termoBusca = "";

  function renderizarKPIs(lista) {
    const total = lista.length;
    const urgentes = lista.filter(item => item.diasRestantes <= 10).length;
    const chamadasFomento = lista.filter(item => item.tipo === "chamada_fomento").length;
    const consultasNormativas = lista.filter(item => item.tipo === "consulta_publica").length;

    const container = document.getElementById("consultasKPIs");
    if (!container) return;

    container.innerHTML = `
      <div class="kpi-card destaque-azul">
        <span class="kpi-titulo">Total em Aberto para Incidência</span>
        <div class="kpi-valor">${total}</div>
        <p class="kpi-desc">Processos participativos ativos no momento</p>
      </div>

      <div class="kpi-card destaque-vermelho">
        <span class="kpi-titulo">Prazos em Reta Final (Urgentes)</span>
        <div class="kpi-valor">${urgentes}</div>
        <p class="kpi-desc">Fechando em menos de 10 dias úteis</p>
      </div>

      <div class="kpi-card destaque-amarelo">
        <span class="kpi-titulo">Chamadas de Fomento (Dinheiro)</span>
        <div class="kpi-valor">${chamadasFomento}</div>
        <p class="kpi-desc">Editais de verba direta a fundo perdido</p>
      </div>

      <div class="kpi-card destaque-verde">
        <span class="kpi-titulo">Consultas Normativas & Orçamento</span>
        <div class="kpi-valor">${consultasNormativas}</div>
        <p class="kpi-desc">Disputa de leis, PPA, LOA e regras de IA</p>
      </div>
    `;
  }

  function filtrar() {
    let dados = window.OBSERVATORIO_DATA.consultasPublicas || [];

    if (filtroTipo !== "todos") {
      dados = dados.filter(item => item.tipo === filtroTipo);
    }

    if (filtroCategoria !== "todas") {
      dados = dados.filter(item => item.categoria === filtroCategoria);
    }

    if (filtroEsfera !== "todas") {
      dados = dados.filter(item => item.esfera === filtroEsfera);
    }

    if (termoBusca.trim() !== "") {
      const q = termoBusca.toLowerCase();
      dados = dados.filter(item => 
        item.titulo.toLowerCase().includes(q) ||
        item.orgao.toLowerCase().includes(q) ||
        item.resumo.toLowerCase().includes(q) ||
        item.recursoEmDisputa.toLowerCase().includes(q)
      );
    }

    return dados;
  }

  function renderizarCards() {
    const lista = filtrar();
    renderizarKPIs(lista);

    const container = document.getElementById("consultasGrid");
    if (!container) return;

    if (lista.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; background: #FFF; border: var(--border-thick); padding: 40px; text-align: center;">
          <h3 style="font-family: var(--font-display); font-size: 1.3rem;">Nenhuma chamada ou consulta encontrada com os filtros selecionados</h3>
          <p style="margin-top: 8px; color: #56615C;">Tente limpar os filtros de busca.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = lista.map(item => {
      const isUrgente = item.diasRestantes <= 10;
      const isChamadaFomento = item.tipo === "chamada_fomento";

      const badgeTipoEstilo = isChamadaFomento ? 
        "background-color: var(--amarelo-sol); color: var(--preto-tinta);" : 
        "background-color: var(--azul-macacao); color: var(--branco-papel);";

      const badgeTipoTexto = isChamadaFomento ? "💰 CHAMADA PÚBLICA DE FOMENTO" : "📢 CONSULTA PÚBLICA / ORÇAMENTO";

      return `
        <article class="card-licitacao" data-id="${item.id}" style="border-top: 6px solid ${isChamadaFomento ? 'var(--amarelo-sol)' : 'var(--azul-macacao)'};">
          <div>
            <div class="card-licitacao-header">
              <span class="badge-versao" style="${badgeTipoEstilo} font-size: 0.7rem; padding: 2px 8px; border: var(--border-thin);">
                ${badgeTipoTexto}
              </span>

              <span class="badge-versao" style="font-size: 0.7rem; background: ${isUrgente ? '#FFF2F1' : '#F1FBF2'}; color: ${isUrgente ? 'var(--vermelho-ato)' : 'var(--verde-pilar)'}; border-color: ${isUrgente ? 'var(--vermelho-ato)' : 'var(--verde-pilar)'}; font-weight: 700;">
                ⏱️ ${item.diasRestantes} dias restantes
              </span>
            </div>

            <h4 class="licitacao-orgao" style="font-size: 1.15rem; margin-top: 10px; line-height: 1.25;">
              ${item.titulo}
            </h4>

            <div style="margin: 6px 0; font-family: var(--font-mono); font-size: 0.75rem; color: #56615C;">
              🏛️ <strong>${item.orgao}</strong> · Plataforma: <strong>${item.plataforma}</strong>
            </div>

            <p class="licitacao-objeto" style="margin-top: 10px;">
              ${item.resumo}
            </p>
          </div>

          <div style="background-color: var(--areia); border: var(--border-thin); padding: 10px 12px; font-size: 0.85rem;">
            <strong>🎯 Por que incidir:</strong> ${item.porQueImporta}
          </div>

          <div class="card-licitacao-footer">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #56615C; display: block;">EM DISPUTA</span>
              <span class="licitacao-valor" style="font-size: 1.05rem; color: var(--preto-tinta);">${item.recursoEmDisputa}</span>
            </div>

            <button class="btn-detalhes" onclick="ConsultasModule.abrirKit('${item.id}')" style="background-color: var(--amarelo-sol);">
              Kit de Incidência →
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  function abrirKit(id) {
    const item = window.OBSERVATORIO_DATA.consultasPublicas.find(c => c.id === id);
    if (!item) return;

    const isChamadaFomento = item.tipo === "chamada_fomento";

    const conteudo = `
      <div style="background-color: ${isChamadaFomento ? 'var(--amarelo-sol)' : 'var(--azul-macacao)'}; color: ${isChamadaFomento ? 'var(--preto-tinta)' : 'var(--branco-papel)'}; border: var(--border-medium); padding: 18px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase;">
          ${item.id} · ${item.esfera.toUpperCase()} · ${item.plataforma}
        </span>
        <h4 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 900; margin-top: 4px; line-height: 1.2;">
          ${item.titulo}
        </h4>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; margin-top: 6px;">
          Prazo final: <strong>${item.prazoFim}</strong> (${item.diasRestantes} dias restantes)
        </p>
      </div>

      <div style="background: #FFF; border: var(--border-thin); padding: 14px;">
        <h5 style="font-family: var(--font-display); font-size: 0.9rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">
          O que está em disputa neste processo?
        </h5>
        <p style="font-size: 0.9rem; line-height: 1.45; color: #2b312e;">${item.resumo}</p>
        <div style="margin-top: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--azul-macacao); font-weight: 700;">
          Volume de Recursos / Efeito: ${item.recursoEmDisputa}
        </div>
      </div>

      <!-- Orientação Política do Movimento -->
      <div style="background: #FFFDF0; border: var(--border-medium); border-left: 6px solid var(--vermelho-ato); padding: 16px;">
        <span style="background: var(--vermelho-ato); color: var(--branco-papel); padding: 2px 8px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;">
          DIRETRIZ DE INCIDÊNCIA DO EIXO 4
        </span>
        <h5 style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 900; margin: 8px 0 6px 0;">
          Como a Militância e os Outros Eixos Devem Atuar
        </h5>
        <p style="font-size: 0.9rem; line-height: 1.45; color: #1C1712;">${item.posicaoEixo4}</p>
      </div>

      <!-- Kit de Resposta Rápida (Copiar e Colar) -->
      <div style="background: #FFF; border: var(--border-thick); padding: 18px; position: relative;">
        <span style="position: absolute; top: -12px; left: 16px; background: var(--preto-tinta); color: var(--branco-papel); padding: 2px 8px; font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;">
          KIT DE RESPOSTA RÁPIDA (COPIE E COLE)
        </span>

        <h5 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 900; text-transform: uppercase; margin-bottom: 6px; margin-top: 4px;">
          Texto da Proposta Recomendada
        </h5>
        <div id="textoPropostaCopia" style="background: var(--branco-papel); border: var(--border-thin); padding: 12px; font-size: 0.88rem; line-height: 1.4; font-family: var(--font-mono); user-select: all;">
          ${item.kitParticipacao.propostaTexto}
        </div>

        <h5 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 900; text-transform: uppercase; margin: 12px 0 6px 0;">
          Justificativa Popular Pronta
        </h5>
        <div style="background: var(--branco-papel); border: var(--border-thin); padding: 12px; font-size: 0.88rem; line-height: 1.4; color: #3d4642;">
          ${item.kitParticipacao.justificativa}
        </div>

        <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-tradutor-popular" style="flex: 1; justify-content: center;" onclick="ConsultasModule.copiarTexto()">
            📋 Copiar Texto para Enviar
          </button>
          <button class="btn-detalhes" style="flex: 1; justify-content: center; background: var(--preto-tinta); color: #FFF;" onclick="alert('Redirecionando para a plataforma oficial: ' + '${item.plataforma}')">
            🔗 Abrir ${item.plataforma} →
          </button>
        </div>
      </div>
    `;

    window.App.abrirDrawer("Kit de Incidência em Consulta Pública", conteudo);
  }

  function copiarTexto() {
    const el = document.getElementById("textoPropostaCopia");
    if (el) {
      const texto = el.innerText;
      navigator.clipboard.writeText(texto).then(() => {
        alert("Texto da proposta copiado com sucesso! Agora você pode colar diretamente na plataforma oficial do governo.");
      }).catch(() => {
        alert("Texto selecionado! Use Ctrl+C para copiar.");
      });
    }
  }

  function init() {
    // Filtros de Tipo (Todas / Consultas / Chamadas)
    const tipoBtns = document.querySelectorAll("[data-consulta-tipo]");
    tipoBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tipoBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filtroTipo = btn.getAttribute("data-consulta-tipo");
        renderizarCards();
      });
    });

    // Filtros de Categoria Temática
    const catBtns = document.querySelectorAll("[data-consulta-cat]");
    catBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        catBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filtroCategoria = btn.getAttribute("data-consulta-cat");
        renderizarCards();
      });
    });

    // Filtros de Esfera
    const esferaBtns = document.querySelectorAll("[data-consulta-esfera]");
    esferaBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        esferaBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filtroEsfera = btn.getAttribute("data-consulta-esfera");
        renderizarCards();
      });
    });

    // Campo de busca
    const buscaInput = document.getElementById("buscaConsultas");
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
    abrirKit,
    copiarTexto
  };
})();

window.ConsultasModule = ConsultasModule;
