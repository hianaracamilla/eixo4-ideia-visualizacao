/**
 * Módulo de Diagnóstico: Ponto de Partida (#partida)
 * O Que Já Temos vs. O Que Falta & Índice de Dependência Tecnológica do Estado
 * Baseado no relatório oficial e notas técnicas do Eixo 4
 */

const DiagnosticoModule = (() => {

  function formatarMoeda(val) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(val);
  }

  function renderizarMatrizPartida() {
    const container = document.getElementById("diagnosticoMatrizContainer");
    if (!container) return;

    const data = window.OBSERVATORIO_DATA.diagnostico;
    if (!data) return;

    container.innerHTML = `
      <!-- Alerta Destacado: O Maior Buraco da Conta -->
      <div class="box-alerta-ralo" style="margin-bottom: 24px; padding: 18px 20px; border-left: 8px solid var(--vermelho-ato);" data-tipo="real">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
          <div style="display: flex; gap: 6px; align-items: center;">
            <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('estataisOpacidade')" title="Ver metodologia e auditoria dos repasses">ℹ️ Metodologia & Fonte</button>
            <span class="badge-status badge-status-real" title="Dado comprovado no balanço do Serpro e relatórios do SIOP">
              🟢 DADO REAL COMPROVADO
            </span>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--vermelho-ato);">
            FONTE: SIOP, BALANÇO SERPRO 2025 E ACÓRDÃO TCU 1380/2026
          </span>
        </div>
        <h3 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 900; text-transform: uppercase; color: var(--preto-tinta);">
          ⚠️ O MAIOR BURACO DA CONTA PÚBLICA DE TI: ${data.maiorBuraco.porcentagem} DOS EMPENHOS
        </h3>
        <p style="margin-top: 6px; font-size: 0.95rem; line-height: 1.5; color: #1c1712;">
          ${data.maiorBuraco.descricao}
        </p>
        <div style="margin-top: 10px; font-size: 0.82rem; font-family: var(--font-mono); background: rgba(0,0,0,0.06); padding: 6px 10px; border: var(--border-thin);">
          📌 <strong>Ação Urgente do Eixo 4:</strong> Disparar pedido padronizado via LAI para abrir a caixa-preta dos repasses de nuvem das estatais federais.
        </div>
      </div>

      <!-- Grid dos 5 Blocos: O Que Já Temos vs O Que Falta -->
      <div class="matriz-partida-grid">
        ${data.blocos.map(b => `
          <div class="card-bloco-partida" data-tipo="real">
            <div class="card-bloco-header">
              <h3>${b.nome}</h3>
              <div style="display: flex; gap: 4px; align-items: center;">
                <button class="btn-info-metodologia btn-info-metodologia-sm" onclick="window.abrirModalMetodologia('elemento40')" title="Ver fonte e metodologia">ℹ️</button>
                <span class="badge-status ${b.situacao.includes('Temos') ? 'badge-status-real' : 'badge-status-lacuna'}">
                  ${b.situacao}
                </span>
              </div>
            </div>
            <div class="card-bloco-body">
              <div class="split-temos-falta">
                <div class="box-temos">
                  <div class="box-temos-title">
                    <span>🟢</span> O QUE TEMOS HOJE
                  </div>
                  <div class="box-temos-body">
                    ${b.temos}
                  </div>
                  <div style="margin-top: 8px; font-size: 0.76rem; font-family: var(--font-mono); color: #21672A;">
                    <strong>Mostra:</strong> ${b.mostra}
                  </div>
                </div>

                <div class="box-falta">
                  <div class="box-falta-title">
                    <span>🟣</span> O QUE FALTA
                  </div>
                  <div class="box-falta-body">
                    ${b.falta}
                  </div>
                  <div style="margin-top: 8px; font-size: 0.76rem; font-family: var(--font-mono); color: #C8322A;">
                    <strong>Fonte indicada:</strong> ${b.fonte}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function setupCalculadoraIndice() {
    const container = document.getElementById("calculadoraIndiceContainer");
    if (!container) return;

    const ind = window.OBSERVATORIO_DATA.diagnostico.indiceDependencia;
    if (!ind) return;

    // Valores padrão estimados a partir dos dados públicos
    let valoresD = {
      D1: 68, // Gasto estrangeiro identificado no núcleo
      D2: 72, // Camadas críticas sem alternativa madura
      D3: 85, // Risco CLOUD Act e jurisdição
      D4: 75, // Capacidade própria e código fechado
      D5: 67  // Concentração top 5 fornecedores (67,2%)
    };

    let pesos = [0.2, 0.2, 0.2, 0.2, 0.2]; // Pesos iguais padrão
    let modoPesos = "iguais";

    function calcular() {
      const d1 = parseFloat(valoresD.D1);
      const d2 = parseFloat(valoresD.D2);
      const d3 = parseFloat(valoresD.D3);
      const d4 = parseFloat(valoresD.D4);
      const d5 = parseFloat(valoresD.D5);

      const p = modoPesos === "iguais" 
        ? [0.2, 0.2, 0.2, 0.2, 0.2] 
        : [0.15, 0.15, 0.30, 0.25, 0.15]; // Pesos alternativos com foco em jurisdição e capacidade

      const total = (p[0] * d1) + (p[1] * d2) + (p[2] * d3) + (p[3] * d4) + (p[4] * d5);

      // Pior dimensão
      const arrD = [
        { id: "D1 Gasto", v: d1 },
        { id: "D2 Camadas Críticas", v: d2 },
        { id: "D3 Dados e Jurisdição", v: d3 },
        { id: "D4 Capacidade Própria", v: d4 },
        { id: "D5 Concentração & Saída", v: d5 }
      ];
      arrD.sort((a, b) => b.v - a.v);
      const pior = arrD[0];

      // Faixa
      let faixa = ind.faixasProvisorias[0];
      if (total >= 75) faixa = ind.faixasProvisorias[3];
      else if (total >= 50) faixa = ind.faixasProvisorias[2];
      else if (total >= 25) faixa = ind.faixasProvisorias[1];

      return { total: total.toFixed(1), pior, faixa, pesos: p };
    }

    function renderUI() {
      const res = calcular();

      container.innerHTML = `
        <div style="background-color: var(--branco-puro); border: var(--border-thick); box-shadow: var(--shadow-hard); padding: 24px;" data-tipo="simulacao">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;">
            <div>
              <span class="badge-status badge-status-simulacao" title="Metodologia em desenvolvimento com premissas do coletivo">
                🟡 MODELO METODOLÓGICO EXPERIMENTAL
              </span>
              <h3 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; margin-top: 6px;">
                Simulador do Índice de Dependência Tecnológica do Estado
              </h3>
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="btnPesosIguais" class="filtro-pill ${modoPesos === 'iguais' ? 'active' : ''}">
                Pesos Iguais (20% cada)
              </button>
              <button id="btnPesosJurisdicao" class="filtro-pill ${modoPesos === 'ponderados' ? 'active' : ''}">
                Pesos Ponderados (Foco em Jurisdição)
              </button>
            </div>
          </div>

          <p style="font-size: 0.92rem; color: #3d4642; margin-bottom: 20px;">
            Ajuste as notas de 0 a 100 de cada uma das 5 dimensões estabelecidas na metodologia do Eixo 4 para simular o nível de dependência do governo federal ou de entes subnacionais pilotos:
          </p>

          <!-- 5 Sliders -->
          <div class="indice-grid">
            ${ind.dimensoes.map((d, i) => `
              <div class="indice-card">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="indice-d-sigla">${d.id} · Peso ${modoPesos === 'iguais' ? '20%' : (res.pesos[i] * 100).toFixed(0) + '%'}</span>
                    <strong id="val_${d.id}" style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--vermelho-ato);">${valoresD[d.id]}</strong>
                  </div>
                  <div class="indice-d-nome">${d.nome}</div>
                  <div class="indice-d-desc">${d.pergunta}</div>
                </div>
                <div>
                  <input type="range" class="slider-dimensao" data-dim="${d.id}" min="0" max="100" value="${valoresD[d.id]}" style="width: 100%; margin: 12px 0 6px; accent-color: var(--azul-macacao); cursor: pointer;" />
                  <div style="font-size: 0.72rem; font-family: var(--font-mono); color: #56615C;">
                    ${d.statusHoje}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Placar do Resultado -->
          <div style="margin-top: 24px; background-color: var(--cinza-papel); border: var(--border-medium); padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; align-items: center;">
            <div style="text-align: center; border-right: var(--border-thin); padding-right: 20px;">
              <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #56615C;">
                Nota Geral Combinada
              </span>
              <div style="font-family: var(--font-display); font-size: 3.5rem; font-weight: 900; line-height: 1; color: ${res.faixa.cor}; margin-top: 6px;">
                ${res.total} <span style="font-size: 1.2rem; color: var(--preto-tinta);">/ 100</span>
              </div>
              <div style="margin-top: 8px;">
                <span style="background-color: ${res.faixa.cor}; color: #FFF; font-family: var(--font-mono); font-weight: 700; font-size: 0.82rem; padding: 4px 10px; border-radius: var(--radius-sm); text-transform: uppercase;">
                  ${res.faixa.nivel}
                </span>
              </div>
            </div>

            <div>
              <h4 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; margin-bottom: 6px;">
                Regra de Ouro da Publicação:
              </h4>
              <p style="font-size: 0.88rem; line-height: 1.45; color: #2b312e;">
                A nota geral nunca é divulgada sozinha. Ela sai sempre acompanhada do <strong>Ponto Mais Crítico</strong>:
              </p>
              <div style="margin-top: 10px; background: var(--branco-puro); border: var(--border-thin); padding: 8px 12px; font-size: 0.86rem;">
                🚨 <strong>Ponto Mais Crítico Atual:</strong> <span style="color: var(--vermelho-ato); font-weight: 800;">${res.pior.id} (Nota: ${res.pior.v})</span>. A média não pode camuflar um risco extremo de soberania.
              </div>
              <div style="margin-top: 8px; font-size: 0.78rem; font-family: var(--font-mono); color: #56615C;">
                📊 <strong>Cobertura da Base:</strong> Apenas 9,7% dos contratos têm marca de alta confiança. O índice atual da União é preliminar.
              </div>
            </div>
          </div>
        </div>
      `;

      // Eventos dos sliders
      container.querySelectorAll('.slider-dimensao').forEach(sl => {
        sl.addEventListener('input', (e) => {
          const dim = e.target.getAttribute('data-dim');
          valoresD[dim] = parseInt(e.target.value, 10);
          renderUI();
        });
      });

      // Alternar pesos
      const btnIguais = document.getElementById("btnPesosIguais");
      const btnPonderados = document.getElementById("btnPesosJurisdicao");

      if (btnIguais) {
        btnIguais.addEventListener('click', () => {
          modoPesos = "iguais";
          renderUI();
        });
      }
      if (btnPonderados) {
        btnPonderados.addEventListener('click', () => {
          modoPesos = "ponderados";
          renderUI();
        });
      }
    }

    renderUI();
  }

  function renderizarCalendarioELAI() {
    const container = document.getElementById("diagnosticoCalendarioContainer");
    if (!container) return;

    const data = window.OBSERVATORIO_DATA.diagnostico;
    if (!data) return;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; margin-top: 24px;">
        <!-- Calendário do Levantamento -->
        <div style="background-color: var(--branco-puro); border: var(--border-thick); box-shadow: var(--shadow-hard); padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800;">
              📅 Roteiro de Entregas do Eixo 4 (Ação Zero)
            </h3>
            <span class="badge-status badge-status-real">PLANEJAMENTO</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${data.calendario.map(c => `
              <div style="border-left: 4px solid var(--azul-macacao); padding-left: 12px; background: #FAF8F2; padding: 10px 12px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong style="font-family: var(--font-display); font-size: 0.95rem; color: var(--preto-tinta);">${c.titulo}</strong>
                  <span style="font-family: var(--font-mono); font-size: 0.76rem; font-weight: 700; color: var(--azul-macacao);">${c.data}</span>
                </div>
                <p style="font-size: 0.84rem; color: #56615C; margin-top: 4px; line-height: 1.35;">${c.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Modelo Padrão de Pedido de LAI -->
        <div style="background-color: var(--branco-puro); border: var(--border-thick); box-shadow: var(--shadow-hard); padding: 20px; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800;">
              ⚖️ Modelo Oficial de Pedido LAI (Serpro / Dataprev)
            </h3>
            <button id="btnCopiarMinutaLAI" class="btn-tradutor-popular" style="padding: 4px 10px; font-size: 0.75rem;">
              📋 Copiar Minuta
            </button>
          </div>

          <p style="font-size: 0.85rem; color: #56615C; margin-bottom: 10px;">
            <strong>Destinatários:</strong> ${data.modeloLAI.destinatarios}
          </p>

          <textarea id="textoMinutaLAI" readonly style="flex: 1; width: 100%; min-height: 220px; font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.45; padding: 12px; border: var(--border-medium); background-color: #FAF8F2; resize: vertical;">${data.modeloLAI.texto}</textarea>

          <div style="margin-top: 10px; font-size: 0.76rem; font-family: var(--font-mono); color: #56615C;">
            * Minuta elaborada para exigir detalhamento de contratos em dólar, jurisdição física dos servidores e repasses a Big Techs.
          </div>
        </div>
      </div>
    `;

    // Botão copiar
    const btnCopiar = document.getElementById("btnCopiarMinutaLAI");
    if (btnCopiar) {
      btnCopiar.addEventListener('click', () => {
        const textarea = document.getElementById("textoMinutaLAI");
        if (textarea) {
          textarea.select();
          navigator.clipboard.writeText(textarea.value).then(() => {
            btnCopiar.textContent = "✅ Copiado!";
            setTimeout(() => { btnCopiar.textContent = "📋 Copiar Minuta"; }, 2000);
          });
        }
      });
    }
  }

  function init() {
    renderizarMatrizPartida();
    setupCalculadoraIndice();
    renderizarCalendarioELAI();
  }

  return {
    init
  };

})();

window.DiagnosticoModule = DiagnosticoModule;
