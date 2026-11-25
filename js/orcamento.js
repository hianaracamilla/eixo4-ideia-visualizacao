/**
 * Módulo de Análise de Orçamento e Gastos com Tecnologia (O Mapa do Dinheiro)
 * Baseado na Nota Técnica e Planilha Real de Gastos Federais com Tecnologia Estrangeira.
 * Inclui:
 * - KPIs com identificação rigorosa de dados reais vs simulação
 * - Sub-abas do Mapa do Dinheiro (Visão Geral, Fornecedores, Órgãos, 20 Maiores Contratos, TCO 5 Anos)
 * - Gráficos interativos em Canvas (Série Histórica, Donut de Marcas, Comparativo TCO)
 * - Simulador de Custo de Oportunidade Social
 */

const OrcamentoModule = (() => {

  function formatarMoeda(val) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(val);
  }

  function formatarNumero(val) {
    return new Intl.NumberFormat("pt-BR").format(val);
  }

  // 1. KPIs do Orçamento com Badges Transparentes e Botão de Metodologia Oficial (i-zinho)
  function renderizarKPIsGastos() {
    const container = document.getElementById("orcamentoKPIs");
    if (!container) return;

    container.innerHTML = `
      <div class="kpi-card destaque-azul" data-tipo="real">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="kpi-titulo">Despesa de Serviços TI (Elemento 40)</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('elemento40')" title="🟢 Dado Real Comprovado · Fonte Oficial: SIOP / LOA 2025 (Clique para auditar metodologia)">i</button>
        </div>
        <div class="kpi-valor">R$ 10,61 Bi</div>
        <p class="kpi-desc">Total empenhado pela União em 2025 (três Poderes). R$ 7,75 Bi efetivamente pagos.</p>
      </div>

      <div class="kpi-card destaque-vermelho" data-tipo="real">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="kpi-titulo">Piso Comprovado em Marcas Globais</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('pisoMarcas')" title="🟢 Dado Real Comprovado · Fonte Oficial: Compras.gov.br e Contratos.gov.br (Clique para auditar metodologia)">i</button>
        </div>
        <div class="kpi-valor">R$ 2,78 Bi</div>
        <p class="kpi-desc">Valor assinado no núcleo de marcas estrangeiras (2023-2026 parcial). É um piso mínimo comprovado.</p>
      </div>

      <div class="kpi-card destaque-laranja" data-tipo="real" style="border-left: 5px solid var(--vermelho-ato); background-color: #FFF8F5;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="kpi-titulo" style="color: var(--vermelho-ato);">Dinheiro Não Pago no Exercício</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('naoUsado')" title="🟢 Dado Real Comprovado · Fonte Oficial: SIOP / Balanço Geral da União (Clique para auditar metodologia)">i</button>
        </div>
        <div class="kpi-valor" style="color: var(--vermelho-ato);">R$ 2,86 Bi</div>
        <p class="kpi-desc"><strong>27,0% do orçamento de 2025</strong> não foi pago no ano. Acumulado não pago: <strong>R$ 15,48 Bi</strong> (2022-2026).</p>
      </div>

      <div class="kpi-card destaque-amarelo" data-tipo="real">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="kpi-titulo">Concentração em 5 Multinacionais</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('pisoMarcas')" title="🟢 Dado Real Comprovado · Microsoft, Oracle, Dell, Red Hat e Lenovo (Clique para auditar metodologia)">i</button>
        </div>
        <div class="kpi-valor">67,2%</div>
        <p class="kpi-desc">Apenas cinco corporações monopolizam dois terços de todo o valor assinado identificado.</p>
      </div>

      <div class="kpi-card destaque-verde" data-tipo="real">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="kpi-titulo">Revendas e Intermediários</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('revendasConcentracao')" title="🟢 Dado Real Comprovado · 78,1% passa por revendas como Brasoftware e Lanlink (Clique para auditar metodologia)">i</button>
        </div>
        <div class="kpi-valor">78,1%</div>
        <p class="kpi-desc">R$ 2,17 Bi passam por terceiras e revendedoras que drenam lucros e royalties ao exterior.</p>
      </div>

      <div class="kpi-card destaque-vermelho" data-tipo="lacuna">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="kpi-titulo">Ocultação da Marca nos Contratos</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('pisoMarcas')" title="🟣 Lacuna Real · 70,2% dos contratos de TI não dizem a marca no objeto">i</button>
        </div>
        <div class="kpi-valor">70,2%</div>
        <p class="kpi-desc">Dos contratos com linguagem de TI não informam marca, correspondendo a 79,5% do valor total.</p>
      </div>

      <div class="kpi-card destaque-amarelo" data-tipo="lacuna">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="kpi-titulo">Empenhos p/ Serpro e Dataprev</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('estataisOpacidade')" title="🟣 Opacidade · Sem abertura de repasses a nuvens estrangeiras">i</button>
        </div>
        <div class="kpi-valor">46,5%</div>
        <p class="kpi-desc">Quase metade do elemento 40 vai para as estatais sem divulgação do repasse a Big Techs.</p>
      </div>
    `;
  }

  // 2. Gráfico da Série Histórica Elemento 40 (Canvas)
  function desenharGraficoHistorico() {
    const canvas = document.getElementById("canvasSerieHistorica");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    
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
    const padX = 56;
    const padY = 44;
    const padBottom = 38;
    const chartW = w - padX - 24;
    const chartH = h - padY - padBottom;

    ctx.clearRect(0, 0, w, h);

    // Fundo
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

    // Grade horizontal
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
    const slotW = chartW / numPontos;
    const barWidth = Math.min(slotW * 0.23, 24);
    const gap = 2;

    dados.forEach((d, i) => {
      const cx = padX + (i + 0.5) * slotW;
      const valorNaoPago = d.naoPago || +(d.empenhado - d.pago).toFixed(2);

      // Barra 1: Empenhado (Azul Macacão)
      const hEmp = Math.max((d.empenhado / maxVal) * chartH, 4);
      const xEmp = cx - barWidth * 1.5 - gap;
      const yEmp = padY + chartH - hEmp;

      ctx.fillStyle = "#1C1712";
      ctx.fillRect(xEmp + 2.5, yEmp + 2.5, barWidth, hEmp);
      ctx.fillStyle = "#1243A5";
      ctx.fillRect(xEmp, yEmp, barWidth, hEmp);
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 1.6;
      ctx.strokeRect(xEmp, yEmp, barWidth, hEmp);

      // Barra 2: Pago (Amarelo Sol)
      const hPago = Math.max((d.pago / maxVal) * chartH, 4);
      const xPago = cx - barWidth * 0.5;
      const yPago = padY + chartH - hPago;

      ctx.fillStyle = "#1C1712";
      ctx.fillRect(xPago + 2.5, yPago + 2.5, barWidth, hPago);
      ctx.fillStyle = "#FDC303";
      ctx.fillRect(xPago, yPago, barWidth, hPago);
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 1.6;
      ctx.strokeRect(xPago, yPago, barWidth, hPago);

      // Barra 3: Não Pago no Ano (Vermelho Ato)
      const hNaoPago = Math.max((valorNaoPago / maxVal) * chartH, 4);
      const xNaoPago = cx + barWidth * 0.5 + gap;
      const yNaoPago = padY + chartH - hNaoPago;

      ctx.fillStyle = "#1C1712";
      ctx.fillRect(xNaoPago + 2.5, yNaoPago + 2.5, barWidth, hNaoPago);
      ctx.fillStyle = "#C8322A";
      ctx.fillRect(xNaoPago, yNaoPago, barWidth, hNaoPago);
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 1.6;
      ctx.strokeRect(xNaoPago, yNaoPago, barWidth, hNaoPago);

      // Label Ano
      ctx.fillStyle = "#1C1712";
      ctx.font = "bold 11px 'Archivo', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${d.ano}`, cx, padY + chartH + 20);

      // Valores numéricos no topo de cada barra
      ctx.font = "bold 8px 'Space Mono', monospace";
      ctx.fillStyle = "#1243A5";
      ctx.fillText(`${d.empenhado}B`, xEmp + barWidth / 2, yEmp - 4);
      ctx.fillStyle = "#7F6000";
      ctx.fillText(`${d.pago}B`, xPago + barWidth / 2, yPago - 4);
      ctx.fillStyle = "#C8322A";
      ctx.fillText(`${valorNaoPago}B`, xNaoPago + barWidth / 2, yNaoPago - 4);
    });

    // Legenda superior tripla
    ctx.textAlign = "left";
    ctx.font = "bold 10px 'Archivo', sans-serif";
    
    // Empenhado
    ctx.fillStyle = "#1243A5";
    ctx.fillRect(padX + 4, 14, 11, 11);
    ctx.strokeStyle = "#1C1712";
    ctx.lineWidth = 1.3;
    ctx.strokeRect(padX + 4, 14, 11, 11);
    ctx.fillStyle = "#1C1712";
    ctx.fillText("Empenhado", padX + 19, 23);

    // Pago
    ctx.fillStyle = "#FDC303";
    ctx.fillRect(padX + 115, 14, 11, 11);
    ctx.strokeRect(padX + 115, 14, 11, 11);
    ctx.fillStyle = "#1C1712";
    ctx.fillText("Pago", padX + 130, 23);

    // Não Pago no Ano
    ctx.fillStyle = "#C8322A";
    ctx.fillRect(padX + 190, 14, 11, 11);
    ctx.strokeRect(padX + 190, 14, 11, 11);
    ctx.fillStyle = "#1C1712";
    ctx.fillText("Não Pago (Represado)", padX + 205, 23);

    ctx.restore();
  }

  // 3. Gráfico Donut de Marcas (Canvas)
  function desenharGraficoMarcas() {
    const canvas = document.getElementById("canvasMarcasDonut");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;

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

    // Fatias
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

    // Furo central
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
    ctx.fillText("PISO IDENTIFICADO", cx, cy + 14);

    // Legenda lateral
    const legX = Math.max(cx + rOuter + 26, w * 0.44);
    let legY = 18;

    marcas.forEach((m) => {
      ctx.fillStyle = "#1C1712";
      ctx.fillRect(legX + 2, legY + 2, 13, 13);
      ctx.fillStyle = m.cor;
      ctx.fillRect(legX, legY, 13, 13);
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(legX, legY, 13, 13);

      ctx.fillStyle = "#1C1712";
      ctx.font = "bold 11px 'Archivo', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${m.nome} (${m.percentual}%)`, legX + 22, legY + 11);

      ctx.font = "bold 9px 'Space Mono', monospace";
      ctx.fillStyle = "#56615C";
      ctx.fillText(`R$ ${m.valor} Mi · ${m.tipo.split(',')[0]}`, legX + 22, legY + 23);

      legY += 40;
    });

    ctx.restore();
  }

  // 4. Renderizar Canais de Distribuição
  function renderizarCanais() {
    const container = document.getElementById("orcamentoCanaisContainer");
    if (!container) return;

    const canais = window.OBSERVATORIO_DATA.orcamento.nucleoEstrangeiro.canaisDistribuicao;
    container.innerHTML = `
      <div style="background-color: var(--branco-puro); border: var(--border-medium); box-shadow: var(--shadow-hard); padding: 20px;" data-tipo="real">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800;">
            Por Onde Passa o Dinheiro do Piso Estrangeiro (Canais)
          </h4>
          <span class="badge-status badge-status-real">🟢 DADO REAL</span>
        </div>
        <p style="font-size: 0.88rem; color: #56615C; margin-bottom: 16px;">
          Empresa brasileira nem sempre significa tecnologia brasileira. A quase totalidade do valor é faturada por revendedoras intermediárias locais que repassam royalties às matrizes globais:
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
          ${canais.map(c => `
            <div style="border: var(--border-thin); background-color: #FAF8F2; padding: 14px; border-left: 6px solid var(--azul-macacao);">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <strong style="font-family: var(--font-display); font-size: 0.95rem;">${c.canal}</strong>
                <span style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 900; color: var(--vermelho-ato);">${c.pct}%</span>
              </div>
              <div style="font-size: 0.82rem; font-family: var(--font-mono); color: #56615C; margin: 4px 0 6px;">
                R$ ${c.valorMi} Milhões (${c.contratos} contratos)
              </div>
              <p style="font-size: 0.82rem; color: #3d4642; line-height: 1.35;">${c.explicacao}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. Renderizar Top Fornecedores (Tabela & Cards)
  function renderizarTopFornecedores() {
    const container = document.getElementById("subtabContentFornecedores");
    if (!container) return;

    const data = window.OBSERVATORIO_DATA.orcamento.topFornecedores;

    container.innerHTML = `
      <div class="box-traducao-rapida" style="margin-bottom: 16px;" data-tipo="real">
        <span class="tag-pop">Quem Recebe?</span>
        <div>
          <strong>Tradução Popular:</strong> Estas 10 empresas concentram mais de 90% do valor do núcleo de tecnologia estrangeira contratada pela União. A Brasoftware, revenda prioritária da Microsoft, sozinha assinou mais de R$ 1 bilhão em contratos federais de 2023 a 2026.
        </div>
      </div>

      <div class="tabela-search-bar">
        <input type="text" id="buscaFornecedor" class="tabela-input-busca" placeholder="🔍 Filtrar fornecedor por nome ou CNPJ..." />
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 0.74rem; font-family: var(--font-mono); color: #56615C;">Compras.gov.br</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('revendasConcentracao')" title="🟢 Dados Reais Comprovados · Fonte Oficial: Compras.gov.br (Clique para auditar metodologia)">i</button>
        </div>
      </div>

      <div class="tabela-neobrutalista-wrapper">
        <table class="tabela-neobrutalista" id="tabelaFornecedores">
          <thead>
            <tr>
              <th style="width: 50px;">#</th>
              <th>Razão Social / Fornecedor</th>
              <th>CNPJ Raiz</th>
              <th style="text-align: center;">Contratos</th>
              <th style="text-align: right;">Valor Global 2023-2026</th>
              <th style="text-align: right;">% do Núcleo</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((f, i) => `
              <tr class="linha-fornecedor">
                <td style="font-family: var(--font-mono); font-weight: 700;">${i + 1}</td>
                <td>
                  <strong>${f.nome}</strong>
                  ${i === 0 ? '<span class="badge-status badge-status-real" style="margin-left: 8px;">MAIOR REVENDA</span>' : ''}
                </td>
                <td style="font-family: var(--font-mono);">${f.codigo}</td>
                <td style="text-align: center; font-family: var(--font-mono); font-weight: 700;">${f.contratos}</td>
                <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: var(--azul-macacao);">${formatarMoeda(f.valorGlobal)}</td>
                <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; color: var(--vermelho-ato);">${f.percentual}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Filtro instantâneo
    const input = document.getElementById("buscaFornecedor");
    if (input) {
      input.addEventListener("input", (e) => {
        const termo = e.target.value.toLowerCase();
        document.querySelectorAll(".linha-fornecedor").forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(termo) ? "" : "none";
        });
      });
    }
  }

  // 6. Renderizar Top Órgãos Compradores
  function renderizarTopOrgaos() {
    const container = document.getElementById("subtabContentOrgaos");
    if (!container) return;

    const data = window.OBSERVATORIO_DATA.orcamento.topOrgaos;

    container.innerHTML = `
      <div class="box-traducao-rapida" style="margin-bottom: 16px;" data-tipo="real">
        <span class="tag-pop">Quem Mais Gasta?</span>
        <div>
          <strong>Tradução Popular:</strong> O Ministério da Gestão e da Inovação (MGI) lidera com folga com R$ 622 milhões assinados (em virtude da ata corporativa nacional da Microsoft para toda a administração pública), seguido pela Justiça Eleitoral, Justiça do Trabalho e Ministério da Justiça.
        </div>
      </div>

      <div class="tabela-search-bar">
        <input type="text" id="buscaOrgao" class="tabela-input-busca" placeholder="🔍 Filtrar órgão público por nome ou código..." />
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 0.74rem; font-family: var(--font-mono); color: #56615C;">SIOP / Contratos.gov</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('topOrgaos')" title="🟢 Dados Reais Comprovados · Fonte Oficial: SIOP e Contratos.gov (Clique para auditar metodologia)">i</button>
        </div>
      </div>

      <div class="tabela-neobrutalista-wrapper">
        <table class="tabela-neobrutalista" id="tabelaOrgaos">
          <thead>
            <tr>
              <th style="width: 50px;">#</th>
              <th>Órgão Público / Poder</th>
              <th>Código Siafi</th>
              <th style="text-align: center;">Contratos</th>
              <th style="text-align: right;">Valor Global 2023-2026</th>
              <th style="text-align: right;">% do Núcleo</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((o, i) => `
              <tr class="linha-orgao">
                <td style="font-family: var(--font-mono); font-weight: 700;">${i + 1}</td>
                <td>
                  <strong>${o.nome}</strong>
                  ${i === 0 ? '<span class="badge-status badge-status-real" style="margin-left: 8px;">COMPRADOR CENTRAL</span>' : ''}
                </td>
                <td style="font-family: var(--font-mono);">${o.codigo}</td>
                <td style="text-align: center; font-family: var(--font-mono); font-weight: 700;">${o.contratos}</td>
                <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: var(--azul-macacao);">${formatarMoeda(o.valorGlobal)}</td>
                <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; color: var(--vermelho-ato);">${o.percentual}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Filtro instantâneo
    const input = document.getElementById("buscaOrgao");
    if (input) {
      input.addEventListener("input", (e) => {
        const termo = e.target.value.toLowerCase();
        document.querySelectorAll(".linha-orgao").forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(termo) ? "" : "none";
        });
      });
    }
  }

  // 7. Renderizar os 20 Maiores Contratos (Base Real)
  function renderizarMaioresContratos() {
    const container = document.getElementById("subtabContentContratos");
    if (!container) return;

    const data = window.OBSERVATORIO_DATA.orcamento.maioresContratos;

    container.innerHTML = `
      <div class="box-traducao-rapida" style="margin-bottom: 16px;" data-tipo="real">
        <span class="tag-pop">Contratos Milionários</span>
        <div>
          <strong>Tradução Popular:</strong> Estes são os 20 maiores contratos individuais assinados pelo governo federal de 2023 a 2026 no núcleo estrangeiro. O maior de todos é o contrato do MGI com a Brasoftware (R$ 606,5 milhões em licenças e sistemas Microsoft, com vigência até 2029).
        </div>
      </div>

      <div class="tabela-search-bar">
        <input type="text" id="buscaContrato" class="tabela-input-busca" placeholder="🔍 Filtrar por marca (ex: Microsoft, Oracle, Dell, Red Hat), órgão ou fornecedor..." />
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 0.74rem; font-family: var(--font-mono); color: #56615C;">Contratos.gov.br</span>
          <button class="btn-info-metodologia" onclick="window.abrirModalMetodologia('topContratos')" title="🟢 Dados Reais Comprovados · 20 Maiores Contratos Auditáveis (Clique para auditar metodologia)">i</button>
        </div>
      </div>

      <div class="tabela-neobrutalista-wrapper">
        <table class="tabela-neobrutalista" id="tabelaMaioresContratos">
          <thead>
            <tr>
              <th style="width: 70px;">ID / Ano</th>
              <th>Órgão Contratante</th>
              <th>Fornecedor / Revenda</th>
              <th>Marca(s)</th>
              <th>Objeto do Contrato</th>
              <th style="text-align: right; min-width: 130px;">Valor Global</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((c, i) => `
              <tr class="linha-contrato">
                <td style="font-family: var(--font-mono); font-size: 0.8rem;">
                  <strong>#${c.id}</strong><br>
                  <span style="color: #56615C;">${c.ano}</span>
                </td>
                <td style="font-size: 0.85rem;"><strong>${c.orgao}</strong></td>
                <td style="font-size: 0.85rem;">${c.fornecedor}</td>
                <td>
                  <span class="badge-status ${c.marcas.includes('Microsoft') ? 'badge-status-real' : 'badge-status-simulacao'}" style="font-size: 0.7rem;">
                    ${c.marcas}
                  </span>
                </td>
                <td style="font-size: 0.82rem; line-height: 1.35; max-width: 320px;">
                  ${c.objeto}
                </td>
                <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; font-size: 0.95rem; color: var(--azul-macacao);">
                  ${formatarMoeda(c.valorGlobal)}
                </td>
                <td style="font-size: 0.75rem; font-family: var(--font-mono);">
                  ${c.conferir ? `<span style="background-color: #FFF2CC; color: #7F6000; padding: 2px 4px; border: var(--border-thin);">⚠️ ${c.conferir}</span>` : 'Assinado'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Filtro instantâneo
    const input = document.getElementById("buscaContrato");
    if (input) {
      input.addEventListener("input", (e) => {
        const termo = e.target.value.toLowerCase();
        document.querySelectorAll(".linha-contrato").forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(termo) ? "" : "none";
        });
      });
    }
  }

  // 8. Gráfico Canvas do TCO Comparativo em 5 Anos (Escritório e E-mail, 1.000 usuários)
  function desenharGraficoTCO() {
    const canvas = document.getElementById("canvasTCO5Anos");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;

    const w = rect.width > 50 ? rect.width : (parentW > 50 ? parentW : 680);
    const h = rect.height > 50 ? rect.height : 260;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.save();
    ctx.scale(dpr, dpr);

    const dados = window.OBSERVATORIO_DATA.orcamento.tcoSimulacao5Anos.cenarios;
    const padLeft = 210;
    const padRight = 80;
    const padTop = 20;
    const padBottom = 20;
    const chartW = w - padLeft - padRight;
    const rowH = (h - padTop - padBottom) / dados.length;
    const maxVal = 12; // até R$ 12 milhões

    ctx.clearRect(0, 0, w, h);

    // Linha vertical zero
    ctx.strokeStyle = "#1C1712";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, h - padBottom);
    ctx.stroke();

    dados.forEach((d, i) => {
      const y = padTop + i * rowH + (rowH - 14) / 2;
      const barW = Math.max((d.valorMi / maxVal) * chartW, 6);

      // Label do cenário
      ctx.fillStyle = "#1C1712";
      ctx.font = d.tipoDado === 'simulacao' ? "bold 11px 'Archivo', sans-serif" : "11px 'Archivo', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(d.nome, padLeft - 10, y + 11);

      // Sombra neobrutalista
      ctx.fillStyle = "#1C1712";
      ctx.fillRect(padLeft + 2, y + 2, barW, 14);

      // Barra
      ctx.fillStyle = d.cor;
      ctx.fillRect(padLeft, y, barW, 14);
      ctx.strokeStyle = "#1C1712";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(padLeft, y, barW, 14);

      // Faixa de variação do open source (se houver)
      if (d.faixaMin && d.faixaMax) {
        const xMin = padLeft + (d.faixaMin / maxVal) * chartW;
        const xMax = padLeft + (d.faixaMax / maxVal) * chartW;
        ctx.strokeStyle = "#1C1712";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xMin, y + 7);
        ctx.lineTo(xMax, y + 7);
        ctx.moveTo(xMin, y + 3);
        ctx.lineTo(xMin, y + 11);
        ctx.moveTo(xMax, y + 3);
        ctx.lineTo(xMax, y + 11);
        ctx.stroke();

        ctx.fillStyle = "#1C1712";
        ctx.font = "bold 9px 'Space Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`R$ ${d.valorMi} Mi (faixa: ${d.faixaMin} a ${d.faixaMax})`, xMax + 8, y + 11);
      } else {
        ctx.fillStyle = "#1C1712";
        ctx.font = "bold 9px 'Space Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`R$ ${d.valorMi} Mi`, padLeft + barW + 8, y + 11);
      }
    });

    ctx.restore();
  }

  // 9. Renderizar Sub-aba de TCO e Custo de Oportunidade
  function renderizarTCOECustoOportunidade() {
    const container = document.getElementById("subtabContentTCO");
    if (!container) return;

    container.innerHTML = `
      <div class="box-traducao-rapida" style="margin-bottom: 20px;" data-tipo="simulacao">
        <span class="tag-pop">Simulação Técnica</span>
        <div>
          <strong>A Conclusão Que Importa:</strong> A escolha real do Estado não é sobre economia milagrosa de curto prazo, mas sim entre <em>pagar por dependência contínua</em> ou <em>pagar por capacidade técnica própria</em>. Open source pode custar parecido em 5 anos, mas gera controle, soberania e autonomia técnica para o país.
        </div>
      </div>

      <div style="background-color: var(--branco-puro); border: var(--border-thick); box-shadow: var(--shadow-hard); padding: 20px; margin-bottom: 24px;" data-tipo="simulacao">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800;">
            Simulação de Custo Total (TCO): Escritório e E-mail, 1.000 Usuários em 5 Anos (R$ Milhões)
          </h4>
          <span class="badge-status badge-status-simulacao">🟡 SIMULAÇÃO TÉCNICA</span>
        </div>
        <p style="font-size: 0.86rem; color: #56615C; margin-bottom: 16px;">
          Valores sem inflação ou perda de produtividade. Cenário-base open source supõe 1,5 profissional adicional dedicado e €300 de migração por usuário.
        </p>

        <div class="chart-canvas-wrapper" style="min-height: 280px;">
          <canvas id="canvasTCO5Anos"></canvas>
        </div>

        <div style="margin-top: 14px; font-size: 0.8rem; font-family: var(--font-mono); color: #56615C; border-top: var(--border-thin); padding-top: 8px;">
          * Teto oficial fixado na Portaria SGD nº 412: R$ 1.666,44/ano por usuário (Office E3). O melhor preço pago registrado em grande compra foi R$ 1.377,48/ano.
        </div>
      </div>

      <!-- Simulador de Custo de Oportunidade Social -->
      <div class="simulador-card" data-tipo="simulacao">
        <div class="simulador-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800;">
              Simulador do Custo de Oportunidade Popular
            </h3>
            <span class="badge-status badge-status-simulacao">🟡 CONVERSÃO PEDAGÓGICA</span>
          </div>
          <p style="color: #3d4642; font-size: 0.9rem;">
            Selecione um contrato ou gasto com Big Techs e veja o que esse mesmo dinheiro faria se fosse investido na soberania do povo brasileiro:
          </p>

          <select id="simuladorContratoSelect" class="simulador-select" aria-label="Selecione o contrato para simulação">
            <option value="0">Contrato MGI-Microsoft (R$ 606,5 Milhões - vigência até 2029)</option>
            <option value="1">Total em Licenças Estrangeiras Identificadas (R$ 2,78 Bilhões)</option>
          </select>
        </div>

        <div class="simulador-resultados-grid" id="simuladorResultados"></div>
      </div>
    `;

    setupSimulador();
    setTimeout(desenharGraficoTCO, 50);
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

  // 10. Configuração da Navegação das Sub-abas do Mapa do Dinheiro
  function setupSubtabs() {
    const botoes = document.querySelectorAll(".subtab-btn");
    const paineis = document.querySelectorAll(".subtab-painel");

    botoes.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-subtab");

        botoes.forEach(b => b.classList.remove("active"));
        paineis.forEach(p => {
          p.style.display = "none";
          p.classList.remove("active");
        });

        btn.classList.add("active");
        const painelAtivo = document.getElementById(`subtab-${target}`);
        if (painelAtivo) {
          painelAtivo.style.display = "block";
          painelAtivo.classList.add("active");
        }

        // Redesenhar canvas caso a aba tenha gráfico
        if (target === "visao-geral") {
          setTimeout(() => {
            desenharGraficoHistorico();
            desenharGraficoMarcas();
          }, 30);
        } else if (target === "tco") {
          setTimeout(desenharGraficoTCO, 30);
        }
      });
    });
  }

  function init() {
    renderizarKPIsGastos();
    renderizarCanais();
    renderizarTopFornecedores();
    renderizarTopOrgaos();
    renderizarMaioresContratos();
    renderizarTCOECustoOportunidade();
    setupSubtabs();

    // Renderiza gráficos
    desenharGraficoHistorico();
    desenharGraficoMarcas();

    window.removeEventListener("resize", redrawAll);
    window.addEventListener("resize", redrawAll);
  }

  function redrawAll() {
    desenharGraficoHistorico();
    desenharGraficoMarcas();
    desenharGraficoTCO();
  }

  return {
    init,
    redraw: redrawAll
  };

})();

window.OrcamentoModule = OrcamentoModule;
