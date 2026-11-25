/**
 * Controlador Principal do Observatório do Eixo 4
 * Gerencia navegação entre protótipos, hash de URL, filtro de status de dados, drawer e modal.
 */

const App = (() => {
  let abaAtiva = "orcamento";
  let filtroDadosAtivo = "todos";

  function navegarPara(idAba) {
    abaAtiva = idAba;

    // Atualizar botões de abas
    document.querySelectorAll(".tab-btn").forEach(btn => {
      const target = btn.getAttribute("data-tab");
      if (target === idAba) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Mostrar seção ativa
    document.querySelectorAll(".tab-content").forEach(secao => {
      if (secao.id === `tab-${idAba}`) {
        secao.style.display = "block";
      } else {
        secao.style.display = "none";
      }
    });

    // Atualizar hash da URL
    window.location.hash = idAba;

    // Inicializar módulo correspondente
    if (idAba === "orcamento") {
      if (window.OrcamentoModule) window.OrcamentoModule.init();
      setTimeout(() => {
        if (window.OrcamentoModule && window.OrcamentoModule.redraw) {
          window.OrcamentoModule.redraw();
        }
      }, 50);
    } else if (idAba === "pessoas-grafo") {
      setTimeout(() => {
        if (window.GrafoModule) window.GrafoModule.init();
      }, 50);
    } else if (idAba === "projetos") {
      if (window.ProjetosModule) window.ProjetosModule.init();
    } else if (idAba === "consultas") {
      if (window.ConsultasModule) window.ConsultasModule.init();
    } else if (idAba === "licitacoes") {
      if (window.LicitacoesModule) window.LicitacoesModule.init();
    } else if (idAba === "diagnostico") {
      if (window.DiagnosticoModule) window.DiagnosticoModule.init();
    }

    aplicarFiltroDados(filtroDadosAtivo);
  }

  function aplicarFiltroDados(tipo) {
    filtroDadosAtivo = tipo;

    // Atualizar botões de filtro
    document.querySelectorAll(".filtro-pill").forEach(btn => {
      if (btn.getAttribute("data-filter") === tipo) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Elementos marcados com data-tipo
    const elementosComTipo = document.querySelectorAll("[data-tipo]");

    if (tipo === "todos") {
      elementosComTipo.forEach(el => {
        el.style.opacity = "1";
        el.style.filter = "none";
      });
      return;
    }

    elementosComTipo.forEach(el => {
      const elTipo = el.getAttribute("data-tipo");
      if (elTipo === tipo) {
        el.style.opacity = "1";
        el.style.filter = "none";
      } else {
        el.style.opacity = "0.35";
        el.style.filter = "grayscale(60%)";
      }
    });
  }

  function abrirDrawer(titulo, conteudoHtml) {
    const drawer = document.getElementById("mainDrawer");
    const overlay = document.getElementById("drawerOverlay");
    const tituloEl = document.getElementById("drawerTitulo");
    const bodyEl = document.getElementById("drawerBody");

    if (!drawer || !overlay) return;

    tituloEl.textContent = titulo;
    bodyEl.innerHTML = conteudoHtml;

    overlay.classList.add("open");
    drawer.classList.add("open");
  }

  function fecharDrawer() {
    const drawer = document.getElementById("mainDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (!drawer || !overlay) return;

    drawer.classList.remove("open");
    overlay.classList.remove("open");
  }

  function abrirTradutorPopular() {
    const modal = document.getElementById("tradutorModal");
    if (modal) modal.classList.add("open");
  }

  function fecharTradutorPopular() {
    const modal = document.getElementById("tradutorModal");
    if (modal) modal.classList.remove("open");
  }

  // Modal de Metodologia e Fonte Oficial dos Dados Reais
  function abrirModalMetodologia(idMetodologia) {
    const dadosMetodologia = (window.OBSERVATORIO_DATA && window.OBSERVATORIO_DATA.metodologias) 
      ? window.OBSERVATORIO_DATA.metodologias[idMetodologia] 
      : null;

    let modal = document.getElementById("modalMetodologia");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modalMetodologia";
      modal.className = "modal-metodologia-backdrop";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) fecharModalMetodologia();
      });
    }

    if (!dadosMetodologia) {
      modal.innerHTML = `
        <div class="modal-metodologia-card">
          <div class="modal-metodologia-header">
            <h3>📌 Metodologia e Fonte Oficial</h3>
            <button class="btn-fechar-modal" onclick="window.fecharModalMetodologia()">✕ Fechar</button>
          </div>
          <div class="modal-metodologia-body">
            <p>Informação metodológica em consolidação na base oficial do Observatório.</p>
          </div>
        </div>
      `;
      modal.classList.add("active");
      return;
    }

    modal.innerHTML = `
      <div class="modal-metodologia-card">
        <div class="modal-metodologia-header">
          <h3>
            <span>📌</span>
            <span>${dadosMetodologia.titulo}</span>
          </h3>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="badge-status badge-status-real" style="font-size: 0.7rem;">🟢 DADO REAL AUDITÁVEL</span>
            <button class="btn-fechar-modal" onclick="window.fecharModalMetodologia()" title="Fechar janela (ESC)">✕ Fechar</button>
          </div>
        </div>

        <div class="modal-metodologia-body">
          <div class="modal-campo">
            <div class="modal-campo-label">🏛️ Fonte Primária Oficial</div>
            <div class="modal-campo-valor"><strong>${dadosMetodologia.fonteOficial}</strong></div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <div class="modal-campo">
              <div class="modal-campo-label">📅 Período de Apuração</div>
              <div class="modal-campo-valor">${dadosMetodologia.periodo}</div>
            </div>
            <div class="modal-campo">
              <div class="modal-campo-label">🎯 Abrangência dos Dados</div>
              <div class="modal-campo-valor">${dadosMetodologia.abrangencia}</div>
            </div>
          </div>

          <div class="modal-campo">
            <div class="modal-campo-label">🏷️ Classificação Orçamentária / Legal</div>
            <div class="modal-campo-valor mono">${dadosMetodologia.classificacao}</div>
          </div>

          <div class="modal-campo">
            <div class="modal-campo-label">📐 Como Foi Calculado (Metodologia de Extração)</div>
            <div class="modal-campo-valor" style="line-height: 1.55;">${dadosMetodologia.metodologiaCalculo}</div>
          </div>

          <div class="modal-campo" style="background-color: #F0F7ED; border-left: 4px solid var(--verde-pilar);">
            <div class="modal-campo-label" style="color: var(--verde-pilar);">🔍 Como Auditar / Reproduzir a Consulta</div>
            <div class="modal-campo-valor" style="font-size: 0.85rem;">${dadosMetodologia.comoAuditar}</div>
          </div>

          <div class="modal-campo" style="background-color: #FFF9E6; border-left: 4px solid var(--vermelho-ato);">
            <div class="modal-campo-label" style="color: var(--vermelho-ato);">✊ Tradução Política (Por Que Importa para o Povo?)</div>
            <div class="modal-campo-valor" style="font-size: 0.86rem; line-height: 1.5;">${dadosMetodologia.politicaPopular}</div>
          </div>
        </div>

        <div class="modal-metodologia-footer">
          <span style="font-family: var(--font-mono); font-size: 0.74rem; color: #56615C;">
            Observatório do Eixo 4 · Soberania Digital Popular · Base 2026
          </span>
          <button class="btn-fechar-modal" onclick="window.fecharModalMetodologia()" style="padding: 6px 14px;">Entendido ✕</button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  function fecharModalMetodologia() {
    const modal = document.getElementById("modalMetodologia");
    if (modal) modal.classList.remove("active");
  }

  // Tecla ESC fecha modais
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fecharDrawer();
      fecharTradutorPopular();
      fecharModalMetodologia();
    }
  });

  // Exportar globalmente
  window.abrirModalMetodologia = abrirModalMetodologia;
  window.fecharModalMetodologia = fecharModalMetodologia;

  function init() {
    // Abas de navegação
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        navegarPara(target);
      });
    });

    // Filtros de tipo de dado
    document.querySelectorAll(".filtro-pill[data-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        const filtro = btn.getAttribute("data-filter");
        aplicarFiltroDados(filtro);
      });
    });

    // Drawer events
    const overlay = document.getElementById("drawerOverlay");
    const fecharBtn = document.getElementById("btnFecharDrawer");
    if (overlay) overlay.addEventListener("click", fecharDrawer);
    if (fecharBtn) fecharBtn.addEventListener("click", fecharDrawer);

    // Modal Tradutor Popular
    const btnTradutor = document.getElementById("btnAbrirTradutor");
    const btnFecharModal = document.getElementById("btnFecharModalTradutor");
    const modalOverlay = document.getElementById("tradutorModal");

    if (btnTradutor) btnTradutor.addEventListener("click", abrirTradutorPopular);
    if (btnFecharModal) btnFecharModal.addEventListener("click", fecharTradutorPopular);
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) fecharTradutorPopular();
      });
    }

    // Ler hash inicial da URL
    const hash = window.location.hash.replace("#", "");
    const abasValidas = ["orcamento", "pessoas-grafo", "projetos", "consultas", "licitacoes", "diagnostico"];
    if (abasValidas.includes(hash)) {
      navegarPara(hash);
    } else {
      navegarPara("orcamento");
    }
  }

  return {
    init,
    navegarPara,
    aplicarFiltroDados,
    abrirDrawer,
    fecharDrawer,
    abrirTradutorPopular,
    fecharTradutorPopular
  };
})();

window.App = App;

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
