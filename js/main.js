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

    // Tecla ESC para fechar modais e gavetas
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        fecharDrawer();
        fecharTradutorPopular();
      }
    });

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
