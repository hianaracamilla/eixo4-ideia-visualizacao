/**
 * Mapa Mental Dinâmico do Eixo 4: Incidência no Estado
 * Baseado e 100% idêntico na estrutura e palavras ao documento:
 * 'Eixo 4 - Incidência no Estado.pdf'
 *
 * Suporte a profundidade N recursiva (árvore de 120 nós), layout bilateral tidy,
 * expansão/recolhimento dinâmico, zoom, pan, busca com expansão automática e gaveta de detalhes.
 */

const MapaMentalModule = (() => {

  let canvas, ctx;
  let scale = 0.85;
  let panX = 0, panY = 0;
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;
  let hoveredNode = null;
  let selectedNode = null;
  let searchTerm = "";
  let filtroSubeixo = "todos";

  // Árvore de nós processada
  let treeData = null;
  let flatNodes = [];

  // Cores oficiais dos ramos (Design System Neobrutalista Brasileiro)
  const CORES_SUBEIXOS = {
    1: "#1243A5", // Azul Macacão · Orçamento, despesas e compras públicas
    2: "#21672A", // Verde Pilar · Instituições, autarquias e empresas públicas
    3: "#C8322A", // Vermelho Ato · Participação popular nas políticas digitais
    4: "#ED8D1F", // Urucum · Políticas públicas, normas e legislações
    5: "#3B7B27", // Verde Morro · Governança multinível (global- local)
    6: "#1C1712"  // Preto Tinta · Organizativo
  };

  /**
   * Quebra o texto em linhas de até maxChars caracteres, respeitando palavras
   */
  function quebrarTexto(texto, maxChars = 34) {
    if (!texto) return [""];
    const palavras = String(texto).split(" ");
    const linhas = [];
    let linhaAtual = [];
    let lenAtual = 0;

    for (const p of palavras) {
      const pLen = p.length;
      if (lenAtual + pLen + (linhaAtual.length > 0 ? 1 : 0) <= maxChars) {
        linhaAtual.push(p);
        lenAtual += pLen + (linhaAtual.length > 1 ? 1 : 0);
      } else {
        if (linhaAtual.length > 0) {
          linhas.push(linhaAtual.join(" "));
        }
        linhaAtual = [p];
        lenAtual = pLen;
      }
    }
    if (linhaAtual.length > 0) {
      linhas.push(linhaAtual.join(" "));
    }
    return linhas;
  }

  /**
   * Constrói a árvore de nós a partir de OBSERVATORIO_DATA.mapaMental
   */
  function inicializarArvore() {
    const raw = window.OBSERVATORIO_DATA && window.OBSERVATORIO_DATA.mapaMental;
    if (!raw) return;

    function buildNode(srcNode, nivel = 0, corPai = "#1243A5", branchNum = 0, side = 1, pai = null) {
      const cor = srcNode.cor || corPai;
      const bNum = srcNode.numero !== undefined ? srcNode.numero : branchNum;

      const node = {
        id: srcNode.id || `node-${Math.random().toString(36).substr(2, 9)}`,
        titulo: srcNode.titulo || "",
        nivel: nivel,
        cor: cor,
        branchNum: bNum,
        side: side,
        pai: pai,
        // Por padrão: raiz e níveis 1 e 2 expandidos para visão imediata completa da arquitetura
        expandido: nivel <= 1,
        filhos: []
      };

      // Quebra de texto e dimensões do card
      node.linhas = quebrarTexto(node.titulo, nivel <= 1 ? 32 : (nivel === 2 ? 30 : 28));

      if (nivel === 0) {
        node.largura = 320;
        node.altura = 64;
      } else if (nivel === 1) {
        node.largura = 280;
        node.altura = 56;
      } else if (nivel === 2) {
        node.largura = 240;
        node.altura = Math.max(44, node.linhas.length * 15 + 16);
      } else {
        node.largura = 260;
        node.altura = Math.max(42, node.linhas.length * 15 + 18);
      }

      if (srcNode.filhos && Array.isArray(srcNode.filhos)) {
        node.filhos = srcNode.filhos.map((childSrc, idx) => {
          let childSide = side;
          let childBranchNum = bNum;
          if (nivel === 0) {
            // Ramos 1, 2, 3 -> Direita (+1); Ramos 4, 5, 6 -> Esquerda (-1)
            childSide = idx < 3 ? 1 : -1;
            childBranchNum = idx + 1;
          }
          return buildNode(childSrc, nivel + 1, cor, childBranchNum, childSide, node);
        });
      }

      return node;
    }

    treeData = buildNode(raw, 0, "#1243A5", 0, 1, null);
    calcularPosicoes();
  }

  /**
   * Calcula o layout bilateral tidy (sem sobreposições verticais ou horizontais)
   */
  function calcularPosicoes() {
    flatNodes = [];
    if (!treeData) return;

    // Dimensões e posição da raiz
    treeData.x = 0;
    treeData.y = 0;
    flatNodes.push(treeData);

    const horizontalGap = 65;
    const verticalMargin = 14;

    /**
     * Calcula a altura total da subárvore de forma recursiva
     */
    function computarAlturaSubarvore(node) {
      // Se filtrado por ramo específico e este nó não pertence ao ramo
      if (filtroSubeixo !== "todos" && node.nivel === 1 && String(node.branchNum) !== filtroSubeixo) {
        node.visivel = false;
        node.subtreeH = 0;
        return 0;
      }
      node.visivel = true;

      const filhosVisiveis = (node.expandido && node.filhos) ? node.filhos : [];
      if (filhosVisiveis.length === 0) {
        node.subtreeH = node.altura + verticalMargin;
        return node.subtreeH;
      }

      let totalH = 0;
      for (const f of filhosVisiveis) {
        totalH += computarAlturaSubarvore(f);
      }
      node.subtreeH = Math.max(node.altura + verticalMargin, totalH);
      return node.subtreeH;
    }

    /**
     * Posiciona nós recursivamente no espaço
     */
    function posicionarSubarvore(node, startY, direcao) {
      flatNodes.push(node);

      const filhosVisiveis = (node.expandido && node.filhos) ? node.filhos.filter(f => f.visivel !== false) : [];
      if (filhosVisiveis.length === 0) {
        node.y = startY + node.subtreeH / 2;
        return;
      }

      let currY = startY;
      for (const f of filhosVisiveis) {
        f.x = node.x + direcao * (node.largura / 2 + horizontalGap + f.largura / 2);
        posicionarSubarvore(f, currY, direcao);
        currY += f.subtreeH;
      }

      // O nó pai fica no centro vertical entre o primeiro e o último filho visível
      node.y = (filhosVisiveis[0].y + filhosVisiveis[filhosVisiveis.length - 1].y) / 2;
    }

    // Dividir ramos de nível 1 em direita (1, 2, 3) e esquerda (4, 5, 6)
    const ramosDireita = [];
    const ramosEsquerda = [];

    treeData.filhos.forEach((branch, idx) => {
      if (idx < 3) {
        ramosDireita.push(branch);
      } else {
        ramosEsquerda.push(branch);
      }
    });

    // 1. Layout Lado Direito (+1)
    let totalHDireita = 0;
    ramosDireita.forEach(b => {
      totalHDireita += computarAlturaSubarvore(b);
    });

    let startYDireita = -totalHDireita / 2;
    ramosDireita.forEach(b => {
      if (b.visivel !== false) {
        b.x = treeData.largura / 2 + horizontalGap + b.largura / 2;
        posicionarSubarvore(b, startYDireita, 1);
        startYDireita += b.subtreeH;
      }
    });

    // 2. Layout Lado Esquerdo (-1)
    let totalHEsquerda = 0;
    ramosEsquerda.forEach(b => {
      totalHEsquerda += computarAlturaSubarvore(b);
    });

    let startYEsquerda = -totalHEsquerda / 2;
    ramosEsquerda.forEach(b => {
      if (b.visivel !== false) {
        b.x = -(treeData.largura / 2 + horizontalGap + b.largura / 2);
        posicionarSubarvore(b, startYEsquerda, -1);
        startYEsquerda += b.subtreeH;
      }
    });
  }

  /**
   * Desenha curva de Bézier suave conectando borda do pai à borda do filho
   */
  function desenharCurva(x1, y1, x2, y2, cor, espessura = 2) {
    ctx.strokeStyle = cor;
    ctx.lineWidth = espessura;
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    const cpX = (x1 + x2) / 2;
    ctx.bezierCurveTo(cpX, y1, cpX, y2, x2, y2);
    ctx.stroke();

    // Ponto de terminação no nó filho
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.arc(x2, y2, espessura * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Renderiza todo o canvas
   */
  function renderizar() {
    if (!canvas || !ctx) return;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configura DPI, pan e zoom
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    ctx.translate(w / 2 + panX, h / 2 + panY);
    ctx.scale(scale, scale);

    // 1. Desenhar conexões de forma recursiva
    function desenharConexoes(node) {
      if (!node.expandido || !node.filhos) return;

      const filhosVisiveis = node.filhos.filter(f => f.visivel !== false);
      filhosVisiveis.forEach(child => {
        const paiSaiPelaDireita = child.x >= node.x;
        const xSai = paiSaiPelaDireita ? node.x + node.largura / 2 : node.x - node.largura / 2;
        const ySai = node.y;

        const xEntra = paiSaiPelaDireita ? child.x - child.largura / 2 : child.x + child.largura / 2;
        const yEntra = child.y;

        const corLinha = child.cor || "#1C1712";
        const espessura = node.nivel === 0 ? 3.5 : (node.nivel === 1 ? 2.5 : (node.nivel === 2 ? 1.8 : 1.3));

        desenharCurva(xSai, ySai, xEntra, yEntra, corLinha, espessura);
        desenharConexoes(child);
      });
    }

    if (treeData) desenharConexoes(treeData);

    // 2. Desenhar cartões dos nós
    flatNodes.forEach(node => {
      if (node.visivel === false) return;

      const x = node.x - node.largura / 2;
      const y = node.y - node.altura / 2;
      const isHovered = hoveredNode === node;
      const isSelected = selectedNode === node;
      const isMatch = searchTerm && node.titulo.toLowerCase().includes(searchTerm.toLowerCase());

      // Sombra Neobrutalista dura
      const shadowDist = isSelected ? 5.5 : (isHovered ? 4.5 : 3);
      ctx.fillStyle = isSelected ? "#C8322A" : (isMatch ? "#ED8D1F" : "#1C1712");
      ctx.fillRect(x + shadowDist, y + shadowDist, node.largura, node.altura);

      // Fundo do cartão
      ctx.fillStyle = isMatch ? "#FFF2CC" : (isSelected ? "#FFFDF7" : "#FFFFFF");
      ctx.fillRect(x, y, node.largura, node.altura);

      // Borda grossa
      ctx.strokeStyle = isSelected ? "#C8322A" : (isMatch ? "#ED8D1F" : "#1C1712");
      ctx.lineWidth = isSelected ? 3 : (node.nivel === 0 ? 3 : 2);
      ctx.strokeRect(x, y, node.largura, node.altura);

      // Barra superior com a cor temática do ramo
      ctx.fillStyle = node.cor || "#1243A5";
      ctx.fillRect(x, y, node.largura, node.nivel === 0 ? 6 : 4);

      // Tipografia e Conteúdo Textual
      ctx.textAlign = "left";

      if (node.nivel === 0) {
        // Nó Raiz
        ctx.font = "bold 10px 'Space Mono', monospace";
        ctx.fillStyle = "#1243A5";
        ctx.fillText("ESTRUTURA OFICIAL · EIXO 4", x + 12, y + 22);

        ctx.font = "900 15px 'Archivo', sans-serif";
        ctx.fillStyle = "#1C1712";
        ctx.fillText(node.titulo, x + 12, y + 44);
      } else if (node.nivel === 1) {
        // Ramos Principais (1 a 6)
        ctx.font = "bold 9px 'Space Mono', monospace";
        ctx.fillStyle = node.cor;
        ctx.fillText(node.branchNum === 6 ? "RAMO ORGANIZATIVO" : `SUB-EIXO 4.${node.branchNum}`, x + 12, y + 20);

        ctx.font = "900 12.5px 'Archivo', sans-serif";
        ctx.fillStyle = "#1C1712";
        const tit = node.linhas[0] || node.titulo;
        ctx.fillText(tit, x + 12, y + 38);
      } else if (node.nivel === 2) {
        // Categorias (Questões centrais, Projetos principais, etc.)
        ctx.font = "bold 9px 'Space Mono', monospace";
        ctx.fillStyle = node.cor;
        ctx.fillText("CATEGORIA", x + 10, y + 18);

        ctx.font = "bold 11px 'Archivo', sans-serif";
        ctx.fillStyle = "#1C1712";
        node.linhas.forEach((linha, lIdx) => {
          ctx.fillText(linha, x + 10, y + 33 + lIdx * 15);
        });
      } else {
        // Níveis 3, 4, 5 (Questões, Instrumentos, Projetos, Itens)
        ctx.font = "500 10.5px 'Archivo', sans-serif";
        ctx.fillStyle = "#1C1712";
        node.linhas.forEach((linha, lIdx) => {
          ctx.fillText(linha, x + 10, y + 20 + lIdx * 15);
        });
      }

      // Botão indicador de expansão (+) se tiver filhos
      if (node.filhos && node.filhos.length > 0) {
        const isRight = node.x >= 0;
        const btnW = node.expandido ? 18 : 26;
        const btnH = 18;
        const btnX = isRight ? (x + node.largura + 4) : (x - btnW - 4);
        const btnY = node.y - btnH / 2;

        node.btnBounds = { x: btnX, y: btnY, w: btnW, h: btnH };

        // Sombra do botão
        ctx.fillStyle = "#1C1712";
        ctx.fillRect(btnX + 1.5, btnY + 1.5, btnW, btnH);

        // Fundo do botão
        ctx.fillStyle = node.expandido ? "#1C1712" : (node.cor || "#1243A5");
        ctx.fillRect(btnX, btnY, btnW, btnH);

        // Borda do botão
        ctx.strokeStyle = "#1C1712";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        // Texto do botão
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 9.5px 'Space Mono', monospace";
        ctx.textAlign = "center";
        const label = node.expandido ? "−" : `+${node.filhos.length}`;
        ctx.fillText(label, btnX + btnW / 2, btnY + 12.5);
      } else {
        node.btnBounds = null;
      }
    });

    ctx.restore();
  }

  /**
   * Converte coordenadas da tela para o plano do grafo
   */
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    const mouseCanvasX = clientX - rect.left;
    const mouseCanvasY = clientY - rect.top;

    const worldX = (mouseCanvasX - (w / 2 + panX)) / scale;
    const worldY = (mouseCanvasY - (h / 2 + panY)) / scale;

    return { worldX, worldY, clientX, clientY };
  }

  /**
   * Encontra nó sob a coordenada (x, y) do plano do grafo
   */
  function findNodeAt(x, y) {
    for (let i = flatNodes.length - 1; i >= 0; i--) {
      const n = flatNodes[i];
      if (n.visivel === false) continue;

      const left = n.x - n.largura / 2;
      const right = n.x + n.largura / 2;
      const top = n.y - n.altura / 2;
      const bottom = n.y + n.altura / 2;

      // Verifica clique no botão de expansão
      if (n.btnBounds) {
        const b = n.btnBounds;
        if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
          return { node: n, isBtn: true };
        }
      }

      if (x >= left && x <= right && y >= top && y <= bottom) {
        return { node: n, isBtn: false };
      }
    }
    return null;
  }

  /**
   * Constrói a trilha de navegação (breadcrumbs) a partir da raiz
   */
  function getTrilhaNavegacao(node) {
    const trilha = [];
    let curr = node;
    while (curr) {
      trilha.unshift(curr);
      curr = curr.pai;
    }
    return trilha;
  }

  /**
   * Abre a gaveta lateral exibindo detalhes exatos do nó selecionado
   */
  function abrirGavetaDetalhes(node) {
    selectedNode = node;
    renderizar();

    const drawer = document.getElementById("mindmapDrawer");
    const tituloEl = document.getElementById("drawerNodeTitulo");
    const bodyEl = document.getElementById("drawerNodeBody");

    if (!drawer || !tituloEl || !bodyEl) return;

    tituloEl.textContent = node.titulo;

    const trilha = getTrilhaNavegacao(node);

    let html = `
      <div style="background-color: ${node.cor || '#1243A5'}; color: #FFF; padding: 6px 12px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; border: var(--border-thin);">
        ${node.nivel === 0 ? 'RAIZ PRINCIPAL' : (node.nivel === 1 ? `RAMO ${node.branchNum}` : `NÍVEL ${node.nivel} DA HIERARQUIA`)}
      </div>

      <!-- Trilha Hierárquica -->
      <div style="background: #FAF8F2; border: var(--border-thin); padding: 10px; margin-bottom: 16px; font-size: 0.78rem; line-height: 1.45;">
        <strong style="font-family: var(--font-display); text-transform: uppercase; color: #56615C; display: block; margin-bottom: 4px;">
          📍 Hierarquia Exata no PDF:
        </strong>
        ${trilha.map((t, idx) => `
          <span style="${idx === trilha.length - 1 ? 'font-weight: 800; color: #1C1712;' : 'color: #56615C;'}">
            ${t.titulo}
          </span>
          ${idx < trilha.length - 1 ? ' <strong style="color: #ED8D1F;">&gt;</strong> ' : ''}
        `).join('')}
      </div>

      <!-- Texto Integral -->
      <div style="background: #FFF; border: var(--border-thin); box-shadow: 2px 2px 0px #1C1712; padding: 14px; margin-bottom: 16px;">
        <h4 style="font-family: var(--font-display); font-size: 0.85rem; text-transform: uppercase; color: ${node.cor || '#1243A5'}; margin-bottom: 6px;">
          Conteúdo Integral do Nó:
        </h4>
        <p style="font-size: 1rem; font-weight: 700; color: #1C1712; line-height: 1.4;">
          ${node.titulo}
        </p>
      </div>
    `;

    // Se tiver filhos diretos, lista todos com opção de expandir
    if (node.filhos && node.filhos.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; color: #1C1712;">
              🌿 Sub-itens Vinculados (${node.filhos.length}):
            </h4>
            <button id="drawerBtnToggleFilhos" class="subtab-btn" style="padding: 3px 8px; font-size: 0.72rem; margin: 0;">
              ${node.expandido ? '➖ Recolher no Mapa' : '➕ Expandir no Mapa'}
            </button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${node.filhos.map((f, idx) => `
              <div class="drawer-filho-card" data-filho-id="${f.id}" style="border: var(--border-thin); border-left: 4px solid ${f.cor || node.cor}; padding: 8px 10px; background: #FFF; box-shadow: 1px 1px 0px #1C1712; cursor: pointer; transition: transform 0.1s;">
                <div style="font-size: 0.84rem; font-weight: 600; color: #1C1712; line-height: 1.35;">
                  ${f.titulo}
                </div>
                ${f.filhos && f.filhos.length > 0 ? `
                  <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #56615C; margin-top: 4px; display: inline-block;">
                    ↳ ${f.filhos.length} ramificação(ões)
                  </span>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Acesso rápido a dados do observatório
    html += `
      <div style="margin-top: 20px; border-top: var(--border-medium); padding-top: 14px;">
        <a href="index.html" class="btn-tradutor-popular" style="width: 100%; justify-content: center; text-decoration: none; font-size: 0.85rem;">
          📊 Ver Indicadores e Gastos no Observatório
        </a>
      </div>
    `;

    bodyEl.innerHTML = html;
    drawer.classList.add("open");

    // Eventos dentro da gaveta
    const toggleBtn = document.getElementById("drawerBtnToggleFilhos");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        node.expandido = !node.expandido;
        calcularPosicoes();
        renderizar();
        abrirGavetaDetalhes(node);
      });
    }

    bodyEl.querySelectorAll(".drawer-filho-card").forEach(el => {
      el.addEventListener("click", () => {
        const filhoId = el.getAttribute("data-filho-id");
        const filhoNode = flatNodes.find(n => n.id === filhoId);
        if (filhoNode) {
          node.expandido = true;
          calcularPosicoes();
          abrirGavetaDetalhes(filhoNode);
          centralizarNo(filhoNode);
        }
      });
    });
  }

  /**
   * Centraliza a visualização em um nó específico
   */
  function centralizarNo(node) {
    if (!node) return;
    panX = -node.x * scale;
    panY = -node.y * scale;
    renderizar();
  }

  /**
   * Configuração de eventos de interação
   */
  function setupEventos() {
    canvas.addEventListener("mousedown", (e) => {
      const pos = getMousePos(e);
      const res = findNodeAt(pos.worldX, pos.worldY);

      if (res) {
        const clickedNode = res.node;
        if (clickedNode.filhos && clickedNode.filhos.length > 0) {
          clickedNode.expandido = !clickedNode.expandido;
          calcularPosicoes();
        }
        abrirGavetaDetalhes(clickedNode);
        return;
      }

      isDragging = true;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
    });

    window.addEventListener("mousemove", (e) => {
      if (isDragging) {
        panX = e.clientX - dragStartX;
        panY = e.clientY - dragStartY;
        renderizar();
        return;
      }

      const pos = getMousePos(e);
      const res = findNodeAt(pos.worldX, pos.worldY);
      const node = res ? res.node : null;

      if (node !== hoveredNode) {
        hoveredNode = node;
        canvas.style.cursor = node ? "pointer" : "grab";
        renderizar();
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Zoom via roda do mouse centrado na posição do cursor
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const pos = getMousePos(e);
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const novoScale = Math.max(0.2, Math.min(2.5, scale * zoomFactor));

      panX = e.clientX - (e.clientX - panX) * (novoScale / scale);
      panY = e.clientY - (e.clientY - panY) * (novoScale / scale);
      scale = novoScale;

      renderizar();
    }, { passive: false });

    // Botões de Zoom e Ações
    const btnZoomIn = document.getElementById("btnZoomIn");
    const btnZoomOut = document.getElementById("btnZoomOut");
    const btnZoomReset = document.getElementById("btnZoomReset");
    const btnExpandirTudo = document.getElementById("btnExpandirTudo");
    const btnRecolherTudo = document.getElementById("btnRecolherTudo");
    const inputBusca = document.getElementById("inputBuscaMindmap");

    if (btnZoomIn) {
      btnZoomIn.addEventListener("click", () => {
        scale = Math.min(2.5, scale * 1.25);
        renderizar();
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener("click", () => {
        scale = Math.max(0.2, scale / 1.25);
        renderizar();
      });
    }

    if (btnZoomReset) {
      btnZoomReset.addEventListener("click", () => {
        scale = 0.85;
        panX = 0;
        panY = 0;
        renderizar();
      });
    }

    if (btnExpandirTudo) {
      btnExpandirTudo.addEventListener("click", () => {
        function expandirRec(n) {
          n.expandido = true;
          if (n.filhos) n.filhos.forEach(expandirRec);
        }
        if (treeData) expandirRec(treeData);
        calcularPosicoes();
        renderizar();
      });
    }

    if (btnRecolherTudo) {
      btnRecolherTudo.addEventListener("click", () => {
        function recolherRec(n) {
          if (n.nivel > 0) n.expandido = false;
          if (n.filhos) n.filhos.forEach(recolherRec);
        }
        if (treeData) recolherRec(treeData);
        calcularPosicoes();
        renderizar();
      });
    }

    // Busca com revelação e expansão de ancestrais
    if (inputBusca) {
      inputBusca.addEventListener("input", (e) => {
        searchTerm = e.target.value.trim();

        if (searchTerm) {
          let primeiroMatch = null;

          function expandirAncestrais(n) {
            let matchNoFilho = false;
            if (n.filhos) {
              n.filhos.forEach(c => {
                if (expandirAncestrais(c)) matchNoFilho = true;
              });
            }
            const isMatch = n.titulo.toLowerCase().includes(searchTerm.toLowerCase());
            if (isMatch || matchNoFilho) {
              n.expandido = true;
              if (isMatch && !primeiroMatch) primeiroMatch = n;
              return true;
            }
            return false;
          }

          if (treeData) expandirAncestrais(treeData);
          calcularPosicoes();

          if (primeiroMatch) {
            centralizarNo(primeiroMatch);
          }
        }
        renderizar();
      });
    }

    // Fechar gaveta
    const btnFechar = document.getElementById("btnFecharDrawerNode");
    if (btnFechar) {
      btnFechar.addEventListener("click", () => {
        const drawer = document.getElementById("mindmapDrawer");
        if (drawer) drawer.classList.remove("open");
        selectedNode = null;
        renderizar();
      });
    }
  }

  /**
   * Redimensionamento responsivo do Canvas
   */
  function resizeCanvas() {
    const wrapper = document.getElementById("mindmapWrapper");
    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const w = rect.width;
    const h = Math.max(680, window.innerHeight - 200);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    renderizar();
  }

  /**
   * Inicialização do módulo
   */
  function init() {
    canvas = document.getElementById("canvasMindMap");
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    scale = 0.82;
    panX = 0;
    panY = 0;

    inicializarArvore();
    setupEventos();
    resizeCanvas();

    window.removeEventListener("resize", resizeCanvas);
    window.addEventListener("resize", resizeCanvas);
  }

  return {
    init,
    setFiltro: (filtro) => {
      filtroSubeixo = filtro;
      calcularPosicoes();
      if (filtro !== "todos") {
        const ramoAlvo = flatNodes.find(n => n.nivel === 1 && String(n.branchNum) === filtro);
        if (ramoAlvo) centralizarNo(ramoAlvo);
      } else {
        panX = 0;
        panY = 0;
        scale = 0.82;
      }
      renderizar();
    }
  };

})();

window.MapaMentalModule = MapaMentalModule;
