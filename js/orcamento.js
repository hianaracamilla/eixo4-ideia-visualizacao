/**
 * Módulo de Análise de Orçamento e Gastos com Tecnologia
 * Baseado na Nota Técnica do Eixo 4: Elemento de Despesa 40 e Núcleo Estrangeiro.
 * Inclui Gráficos em Canvas nativo robustos e Simulador de Custo de Oportunidade Popular.
 */

const OrcamentoModule = (() => {

  function formatarMoeda(val) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(val);
  }

  function renderizarKPIsGastos() {
    const container = document.getElementById("orcamentoKPIs");
    if (!container) return;

    container.innerHTML = `
      <div class="kpi-card destaque-azul">
        <span class="kpi-titulo">Despesa Global de TI (Elemento 40)</span>
        <div class="kpi-valor">R$ 10,6 Bi</div>
        <p class="kpi-desc">Total empenhado pela União em serviços de TI (2025)</p>
      </div>

      <div class="kpi-card destaque-vermelho">
        <span class="kpi-titulo">Piso Identificado em Marcas Globais</span>
        <div class="kpi-valor">R$ 2,78 Bi</div>
        <p class="kpi-desc">Contratos com Big Techs identificadas (2023-2026)</p>
      </div>

      <div class="kpi-card destaque-amarelo">
        <span class="kpi-titulo">Concentração em 5 Multinacionais</span>
        <div class="kpi-valor">67,2%</div>
        <p class="kpi-desc">Microsoft, Oracle, Dell, Red Hat e Lenovo dominam o núcleo</p>
      </div>

      <div class="kpi-card destaque-verde">
        <span class="kpi-titulo">Parcela em Licenças & Subscrições</span>
        <div class="kpi-valor">72,0%</div>
        <p class="kpi-desc">Gasto recorrente em 'aluguel de software' sem autonomia</p>
      </div>
    `;
  }

  function desenharGraficoHistorico() {
    const canvas = document.getElementById("canvasSerieHistorica");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const parent = canvas.parentElement;
    const parentW = parent ? parent.clientWidth : 0;
    
    // Dimensões seguras (evita 0x0 quando elemento estiver em aba oculta ou carregando)
    const w = rect.width > 50 ? rect.width : (parentW > 50 ? parentW : 560);
    const h = rect.height > 50 ? rect.height : 280;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.save();
    ctx.scale(dpr, dpr);

    const dados = window.OBSERVATORIO_DATA.orcamento.serieHistoricaElemento40;
    const padX = 52;
    const padY = 44;
    const padBottom = 38;
    const chartW = w - padX - 24;
    const chartH = h - padY - padBottom;

    ctx.clearRect(0, 0, w, h);

    // Fundo do gráfico
    ctx.fillStyle = "#FAF8F2";
    ctx.fillRect(padX, padY, chartW, chartH);

    // Eixos
    ctx.strokeStyle = "#1C1712";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX, padY);
    ctx.lineTo(padX, padY + chartH);
    ctx.lineTo(padX + chartW, padY + chartH);
    ctx.stroke();

    const maxVal = 12; // até R$ 12 bilhões

    // Linhas de grade horizontal
    ctx.strokeStyle = "#E5E0D5";
    ctx.setLineDash([4, 4]);
    ctx.fillStyle = "#56615C";
    ctx.font = "bold 9px 'Space Mono', monospace";
    ctx.textAlign = "right";

    [0, 3, 6, 9, 12].forEach(val => {
      const y = padY + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(padX + chartW, y);
      ctx.stroke();
      ctx.fillText(`R$ ${val}B`, padX - 8, y + 3);
    });
    ctx.setLineDash([]);

    const numPontos = dados.length;
    const barWidth = Math.min((chartW / numPontos) * 0.32, 38);

    dados.forEach((d, i) => {
      const cx = padX + (i + 0.5) * (chartW / numPontos);

      // Barra Empenhado (Azul macacão)
      const hEmp = Math.max((d.empenhado / maxVal) * chartH, 4);
      const xEmp = cx - barWidth - 3;
      const yEmp = padY + chartH - hEmp;

      // Sombra dura neobrutalista
      ctx.fillStyle = "#1C1712";
      ctx.fillRect(xEmp + 3, yEmp + 3, barWidth, hEmp);
      // Barra frontal
      ctx.fillStyle = "#1243A5";
      ctx.fillRect(xEmp, yEmp, barWidth, hEmp);
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 1.8;
      ctx.strokeRect(xEmp, yEmp, barWidth, hEmp);

      // Barra Pago (Amarelo Sol)
      const hPago = Math.max((d.pago / maxVal) * chartH, 4);
      const xPago = cx + 3;
      const yPago = padY + chartH - hPago;

      // Sombra dura
      ctx.fillStyle = "#1C1712";
      ctx.fillRect(xPago + 3, yPago + 3, barWidth, hPago);
      // Barra frontal
      ctx.fillStyle = "#FDC303";
      ctx.fillRect(xPago, yPago, barWidth, hPago);
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 1.8;
      ctx.strokeRect(xPago, yPago, barWidth, hPago);

      // Ano no eixo X
      ctx.fillStyle = "#1C1712";
      ctx.font = "bold 12px 'Archivo', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${d.ano}`, cx, padY + chartH + 22);

      // Valores numéricos no topo das barras
      ctx.font = "bold 9px 'Space Mono', monospace";
      ctx.fillStyle = "#1243A5";
      ctx.fillText(`${d.empenhado}B`, xEmp + barWidth / 2, yEmp - 6);
      ctx.fillStyle = "#C8322A";
      ctx.fillText(`${d.pago}B`, xPago + barWidth / 2, yPago - 6);
    });

    // Legenda no topo
    ctx.textAlign = "left";
    ctx.font = "bold 11px 'Archivo', sans-serif";
    
    // Legenda Empenhado
    ctx.fillStyle = "#1243A5";
    ctx.fillRect(padX + 10, 14, 14, 14);
    ctx.strokeStyle = "#1C1712";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(padX + 10, 14, 14, 14);
    ctx.fillStyle = "#1C1712";
    ctx.fillText("Empenhado (Decisão de Compra)", padX + 32, 25);

    // Legenda Pago
    ctx.fillStyle = "#FDC303";
    ctx.fillRect(padX + 260, 14, 14, 14);
    ctx.strokeRect(padX + 260, 14, 14, 14);
    ctx.fillStyle = "#1C1712";
    ctx.fillText("Efetivamente Pago", padX + 282, 25);

    ctx.restore();
  }

  function desenharGraficoMarcas() {
    const canvas = document.getElementById("canvasMarcasDonut");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const parent = canvas.parentElement;
    const parentW = parent ? parent.clientWidth : 0;

    const w = rect.width > 50 ? rect.width : (parentW > 50 ? parentW : 560);
    const h = rect.height > 50 ? rect.height : 280;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.save();
    ctx.scale(dpr, dpr);

    const marcas = window.OBSERVATORIO_DATA.orcamento.nucleoEstrangeiro.marcas;
    const cx = Math.min(w * 0.35, 170);
    const cy = h * 0.5;
    const rOuter = Math.min(cx, cy) * 0.82;
    const rInner = rOuter * 0.52;

    ctx.clearRect(0, 0, w, h);

    let startAngle = -Math.PI / 2;

    // Sombra geral do donut
    ctx.beginPath();
    ctx.arc(cx + 4, cy + 4, rOuter, 0, Math.PI * 2);
    ctx.fillStyle = "#1C1712";
    ctx.fill();

    // Fatias do Donut
    marcas.forEach((m) => {
      const sliceAngle = (m.percentual / 100) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, startAngle, endAngle);
      ctx.arc(cx, cy, rInner, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = m.cor;
      ctx.fill();
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Furo central com fundo limpo e texto
    ctx.beginPath();
    ctx.arc(cx, cy, rInner - 1, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFDF7";
    ctx.fill();
    ctx.strokeStyle = "#1C1712";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#1C1712";
    ctx.font = "900 15px 'Archivo', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("R$ 2,78 BI", cx, cy - 2);
    ctx.font = "bold 9px 'Space Mono', monospace";
    ctx.fillStyle = "#56615C";
    ctx.fillText("NÚCLEO ESTRANGEIRO", cx, cy + 14);

    // Legenda lateral estilizada
    const legX = Math.max(cx + rOuter + 26, w * 0.44);
    let legY = 18;

    marcas.forEach((m) => {
      // Quadrado de cor
      ctx.fillStyle = "#1C1712";
      ctx.fillRect(legX + 2, legY + 2, 13, 13);
      ctx.fillStyle = m.cor;
      ctx.fillRect(legX, legY, 13, 13);
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(legX, legY, 13, 13);

      // Nome da marca e percentual
      ctx.fillStyle = "#1C1712";
      ctx.font = "bold 11px 'Archivo', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${m.nome} (${m.percentual}%)`, legX + 22, legY + 11);

      // Valor e tipo
      ctx.font = "bold 9px 'Space Mono', monospace";
      ctx.fillStyle = "#56615C";
      ctx.fillText(`R$ ${m.valor} Mi · ${m.tipo.split(',')[0]}`, legX + 22, legY + 23);

      legY += 40;
    });

    ctx.restore();
  }

  function setupSimulador() {
    const select = document.getElementById("simuladorContratoSelect");
    const container = document.getElementById("simuladorResultados");
    if (!select || !container) return;

    function atualizar() {
      const idx = parseInt(select.value, 10);
      const simulacao = window.OBSERVATORIO_DATA.orcamento.equivalenciasSociais[idx];
      if (!simulacao) return;

      container.innerHTML = simulacao.alternativas.map(alt => `
        <div class="card-alternativa">
          <div>
            <div class="alt-qtd">${alt.quantidade}</div>
            <h4 class="alt-item">${alt.item}</h4>
            <div class="alt-duracao">⏱️ ${alt.duracao}</div>
          </div>
          <p class="alt-impacto"><strong>Impacto Popular:</strong> ${alt.impacto}</p>
        </div>
      `).join("");
    }

    select.removeEventListener?.("change", atualizar);
    select.addEventListener("change", atualizar);
    atualizar();
  }

  function init() {
    renderizarKPIsGastos();
    setupSimulador();

    // Renderiza imediatamente e também após pequenos ticks para acomodar layout
    desenharGraficoHistorico();
    desenharGraficoMarcas();

    requestAnimationFrame(() => {
      desenharGraficoHistorico();
      desenharGraficoMarcas();
    });

    setTimeout(() => {
      desenharGraficoHistorico();
      desenharGraficoMarcas();
    }, 60);

    window.removeEventListener("resize", init);
    window.addEventListener("resize", () => {
      desenharGraficoHistorico();
      desenharGraficoMarcas();
    });
  }

  return {
    init,
    redraw: () => {
      desenharGraficoHistorico();
      desenharGraficoMarcas();
    }
  };
})();

window.OrcamentoModule = OrcamentoModule;
