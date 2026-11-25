/**
 * Mapa Mental Dinâmico do Eixo 4: Incidência no Estado
 * Baseado no documento 'Eixo 4 - Incidência no Estado.pdf'
 * Renderização dinâmica em Canvas/SVG interativo, nós expansíveis, zoom, pan e busca.
 */

const MapaMentalModule = (() => {

  let canvas, ctx;
  let scale = 1;
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

  // Cores dos ramos
  const CORES_SUBEIXOS = {
    1: "#1243A5", // Azul Macacão
    2: "#21672A", // Verde Pilar
    3: "#C8322A", // Vermelho Ato
    4: "#ED8D1F", // Urucum
    5: "#3B7B27", // Verde Morro
    6: "#1C1712"  // Preto Tinta / Organizativo
  };

  function inicializarArvore() {
    const raw = window.OBSERVATORIO_DATA.mapaMental;
    if (!raw) return;

    // Constrói árvore hierárquica
    treeData = {
      id: "raiz",
      titulo: "EIXO 4 · INCIDÊNCIA NO ESTADO",
      subtitulo: "Lutar por reformas estruturais e articular políticas públicas",
      tipo: "raiz",
      cor: "#1243A5",
      x: 0,
      y: 0,
      largura: 320,
      altura: 90,
      expandido: true,
      filhos: []
    };

    raw.subeixos.forEach((sub, idx) => {
      const subNode = {
        id: sub.id,
        subeixoNum: sub.numero,
        titulo: sub.titulo,
        sigla: sub.sigla,
        icone: sub.icone,
        tipo: "subeixo",
        cor: sub.cor,
        expandido: true,
        questoesCentrais: sub.questoesCentrais || [],
        projetosPrincipais: sub.projetosPrincipais || [],
        responsaveis: sub.responsaveis || [],
        necessidadesOrganizacionais: sub.necessidadesOrganizacionais || [],
        instanciasMapeadas: sub.instanciasMapeadas || [],
        diretrizesGerais: sub.diretrizesGerais || [],
        integracaoEixos: sub.integracaoEixos || [],
        filhos: []
      };

      // Ramo 1: Questões Centrais
      if (sub.questoesCentrais && sub.questoesCentrais.length > 0) {
        subNode.filhos.push({
          id: `${sub.id}-questoes`,
          titulo: `❓ Questões Centrais (${sub.questoesCentrais.length})`,
          tipo: "grupo",
          cor: sub.cor,
          expandido: false,
          itens: sub.questoesCentrais,
          filhos: sub.questoesCentrais.map((q, qIdx) => ({
            id: `${sub.id}-q-${qIdx}`,
            titulo: q,
            tipo: "questao",
            cor: sub.cor,
            expandido: false,
            filhos: []
          }))
        });
      }

      // Ramo 2: Projetos Principais
      if (sub.projetosPrincipais && sub.projetosPrincipais.length > 0) {
        subNode.filhos.push({
          id: `${sub.id}-projetos`,
          titulo: `🚀 Projetos Principais (${sub.projetosPrincipais.length})`,
          tipo: "grupo",
          cor: sub.cor,
          expandido: false,
          itens: sub.projetosPrincipais,
          filhos: sub.projetosPrincipais.map((p, pIdx) => ({
            id: `${sub.id}-p-${pIdx}`,
            titulo: p.nome,
            status: p.status,
            tipo: "projeto",
            cor: sub.cor,
            expandido: false,
            filhos: []
          }))
        });
      }

      // Ramo 3: Responsáveis
      if (sub.responsaveis && sub.responsaveis.length > 0) {
        subNode.filhos.push({
          id: `${sub.id}-responsaveis`,
          titulo: `👤 Responsáveis: ${sub.responsaveis.join(", ")}`,
          tipo: "responsavel",
          cor: sub.cor,
          responsaveis: sub.responsaveis,
          expandido: false,
          filhos: []
        });
      }

      // Ramo 4: Necessidades Organizacionais
      if (sub.necessidadesOrganizacionais && sub.necessidadesOrganizacionais.length > 0) {
        subNode.filhos.push({
          id: `${sub.id}-necessidades`,
          titulo: `🛠️ Necessidades de Equipe (${sub.necessidadesOrganizacionais.length})`,
          tipo: "grupo",
          cor: sub.cor,
          expandido: false,
          itens: sub.necessidadesOrganizacionais,
          filhos: sub.necessidadesOrganizacionais.map((n, nIdx) => ({
            id: `${sub.id}-n-${nIdx}`,
            titulo: n,
            tipo: "necessidade",
            cor: sub.cor,
            expandido: false,
            filhos: []
          }))
        });
      }

      // Ramo 5: Instâncias de Participação (se houver, como no Subeixo 3)
      if (sub.instanciasMapeadas && sub.instanciasMapeadas.length > 0) {
        subNode.filhos.push({
          id: `${sub.id}-instancias`,
          titulo: `🏛️ Instâncias Mapeadas (${sub.instanciasMapeadas.length} Conselhos)`,
          tipo: "grupo",
          cor: sub.cor,
          expandido: false,
          itens: sub.instanciasMapeadas,
          filhos: sub.instanciasMapeadas.map((inst, iIdx) => ({
            id: `${sub.id}-inst-${iIdx}`,
            titulo: inst,
            tipo: "instancia",
            cor: sub.cor,
            expandido: false,
            filhos: []
          }))
        });
      }

      // Ramo 6: Diretrizes e Integração (Subeixo 6 Organizativo)
      if (sub.diretrizesGerais && sub.diretrizesGerais.length > 0) {
        subNode.filhos.push({
          id: `${sub.id}-diretrizes`,
          titulo: `📋 Diretrizes Gerais & Métodos (${sub.diretrizesGerais.length})`,
          tipo: "grupo",
          cor: sub.cor,
          expandido: false,
          itens: sub.diretrizesGerais,
          filhos: sub.diretrizesGerais.map((d, dIdx) => ({
            id: `${sub.id}-dir-${dIdx}`,
            titulo: d,
            tipo: "diretriz",
            cor: sub.cor,
            expandido: false,
            filhos: []
          }))
        });
      }

      if (sub.integracaoEixos && sub.integracaoEixos.length > 0) {
        subNode.filhos.push({
          id: `${sub.id}-integracao`,
          titulo: `🔗 Integração com Outros Eixos`,
          tipo: "grupo",
          cor: sub.cor,
          expandido: false,
          itens: sub.integracaoEixos,
          filhos: sub.integracaoEixos.map((integ, inIdx) => ({
            id: `${sub.id}-integ-${inIdx}`,
            titulo: `${integ.eixo}: ${integ.canal} (${integ.responsavel})`,
            tipo: "integracao",
            cor: sub.cor,
            expandido: false,
            filhos: []
          }))
        });
      }

      treeData.filhos.push(subNode);
    });

    calcularPosicoes();
  }

  // Layout espacial radial / horizontal balanceado
  function calcularPosicoes() {
    flatNodes = [];
    if (!treeData) return;

    treeData.x = 0;
    treeData.y = 0;
    treeData.largura = 320;
    treeData.altura = 80;
    flatNodes.push(treeData);

    const subeixos = treeData.filhos;
    const total = subeixos.length;

    // Distribuir 3 para a direita e 3 para a esquerda para clareza tátil
    const direita = subeixos.slice(0, 3); // Subeixos 1, 2, 3
    const esquerda = subeixos.slice(3, 6); // Subeixos 4, 5, 6

    function posicionarLado(lista, direcaoX) {
      const espacamentoY = 240;
      const startY = -((lista.length - 1) * espacamentoY) / 2;

      lista.forEach((sub, i) => {
        sub.x = direcaoX * 420;
        sub.y = startY + i * espacamentoY;
        sub.largura = 280;
        sub.altura = 75;
        flatNodes.push(sub);

        if (sub.expandido && sub.filhos && sub.filhos.length > 0) {
          const numFilhos = sub.filhos.length;
          const espFilhosY = 75;
          const startFilhosY = sub.y - ((numFilhos - 1) * espFilhosY) / 2;

          sub.filhos.forEach((g, j) => {
            g.x = sub.x + direcaoX * 320;
            g.y = startFilhosY + j * espFilhosY;
            g.largura = 250;
            g.altura = 50;
            flatNodes.push(g);

            // Nível 3 (itens)
            if (g.expandido && g.filhos && g.filhos.length > 0) {
              const numItens = g.filhos.length;
              const espItensY = 55;
              const startItensY = g.y - ((numItens - 1) * espItensY) / 2;

              g.filhos.forEach((item, k) => {
                item.x = g.x + direcaoX * 300;
                item.y = startItensY + k * espItensY;
                item.largura = 260;
                item.altura = 45;
                flatNodes.push(item);
              });
            }
          });
        }
      });
    }

    posicionarLado(direita, 1);
    posicionarLado(esquerda, -1);
  }

  function desenharCurva(x1, y1, x2, y2, cor, espessura = 2) {
    ctx.strokeStyle = cor;
    ctx.lineWidth = espessura;
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    const cpX = (x1 + x2) / 2;
    ctx.bezierCurveTo(cpX, y1, cpX, y2, x2, y2);
    ctx.stroke();
  }

  function renderizar() {
    if (!canvas || !ctx) return;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ajusta origem e escala
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    ctx.translate(w / 2 + panX, h / 2 + panY);
    ctx.scale(scale, scale);

    // 1. Desenhar conexões
    function desenharConexoes(node) {
      if (!node.expandido || !node.filhos) return;

      node.filhos.forEach(child => {
        // Ponto de saída do pai e entrada do filho
        const paiSaiPelaDireita = child.x >= node.x;
        const xSai = paiSaiPelaDireita ? node.x + node.largura / 2 : node.x - node.largura / 2;
        const ySai = node.y;

        const xEntra = paiSaiPelaDireita ? child.x - child.largura / 2 : child.x + child.largura / 2;
        const yEntra = child.y;

        const corLinha = child.cor || "#1C1712";
        const espessura = node.tipo === "raiz" ? 3.5 : (node.tipo === "subeixo" ? 2.5 : 1.5);
        desenharCurva(xSai, ySai, xEntra, yEntra, corLinha, espessura);

        desenharConexoes(child);
      });
    }

    if (treeData) desenharConexoes(treeData);

    // 2. Desenhar nós
    flatNodes.forEach(node => {
      // Filtro de subeixo
      if (filtroSubeixo !== "todos" && node.subeixoNum && node.subeixoNum.toString() !== filtroSubeixo && node.tipo !== "raiz") {
        return;
      }

      const x = node.x - node.largura / 2;
      const y = node.y - node.altura / 2;
      const isHovered = hoveredNode === node;
      const isSelected = selectedNode === node;
      const isMatch = searchTerm && node.titulo.toLowerCase().includes(searchTerm.toLowerCase());

      // Sombra neobrutalista dura
      ctx.fillStyle = isSelected ? "#C8322A" : "#1C1712";
      const shadowDist = isSelected ? 6 : (isHovered ? 5 : 3.5);
      ctx.fillRect(x + shadowDist, y + shadowDist, node.largura, node.altura);

      // Fundo do card
      ctx.fillStyle = isMatch ? "#FFF2CC" : (isSelected ? "#FFFDF7" : "#FFFFFF");
      ctx.fillRect(x, y, node.largura, node.altura);

      // Borda grossa
      ctx.strokeStyle = isSelected ? "#C8322A" : (isMatch ? "#ED8D1F" : "#1C1712");
      ctx.lineWidth = isSelected ? 3 : (node.tipo === "raiz" ? 3 : 2);
      ctx.strokeRect(x, y, node.largura, node.altura);

      // Faixa de cor da identidade no topo do card
      if (node.cor) {
        ctx.fillStyle = node.cor;
        ctx.fillRect(x, y, node.largura, 6);
      }

      // Conteúdo textual
      ctx.fillStyle = "#1C1712";
      ctx.textAlign = "left";

      if (node.tipo === "raiz") {
        ctx.font = "bold 13px 'Space Mono', monospace";
        ctx.fillStyle = "#1243A5";
        ctx.fillText("SOBERANIA DIGITAL POPULAR", x + 14, y + 26);

        ctx.font = "900 16px 'Archivo', sans-serif";
        ctx.fillStyle = "#1C1712";
        ctx.fillText(node.titulo, x + 14, y + 48);

        ctx.font = "10px 'Archivo', sans-serif";
        ctx.fillStyle = "#56615C";
        ctx.fillText(node.subtitulo, x + 14, y + 68);
      } else if (node.tipo === "subeixo") {
        ctx.font = "900 13px 'Archivo', sans-serif";
        ctx.fillStyle = node.cor;
        ctx.fillText(`${node.icone} ${node.sigla}`, x + 12, y + 26);

        ctx.font = "bold 11px 'Archivo', sans-serif";
        ctx.fillStyle = "#1C1712";
        const maxLen = 34;
        const tit = node.titulo.length > maxLen ? node.titulo.substring(0, maxLen) + "..." : node.titulo;
        ctx.fillText(tit, x + 12, y + 44);

        if (node.responsaveis && node.responsaveis.length > 0) {
          ctx.font = "9px 'Space Mono', monospace";
          ctx.fillStyle = "#56615C";
          ctx.fillText(`👤 ${node.responsaveis.join(', ')}`, x + 12, y + 62);
        }
      } else {
        // Nós de detalhes, projetos, perguntas
        ctx.font = node.tipo === "grupo" ? "bold 11px 'Archivo', sans-serif" : "10px 'Archivo', sans-serif";
        ctx.fillStyle = "#1C1712";

        const text = node.titulo;
        const maxChars = 38;
        const linha1 = text.length > maxChars ? text.substring(0, maxChars) + "..." : text;
        ctx.fillText(linha1, x + 10, y + (node.altura / 2) + 4);
      }

      // Indicador de expansão (+) se tiver filhos
      if (node.filhos && node.filhos.length > 0) {
        const btnX = node.x >= 0 ? x + node.largura + 4 : x - 18;
        const btnY = node.y - 7;
        ctx.fillStyle = node.expandido ? "#1C1712" : (node.cor || "#1243A5");
        ctx.fillRect(btnX, btnY, 14, 14);
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 10px 'Space Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.expandido ? "−" : "+", btnX + 7, btnY + 11);
      }
    });

    ctx.restore();
  }

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    const mouseCanvasX = (clientX - rect.left);
    const mouseCanvasY = (clientY - rect.top);

    // Converte para coordenadas do grafo
    const worldX = (mouseCanvasX - (w / 2 + panX)) / scale;
    const worldY = (mouseCanvasY - (h / 2 + panY)) / scale;

    return { worldX, worldY, clientX, clientY };
  }

  function findNodeAt(x, y) {
    for (let i = flatNodes.length - 1; i >= 0; i--) {
      const n = flatNodes[i];
      if (filtroSubeixo !== "todos" && n.subeixoNum && n.subeixoNum.toString() !== filtroSubeixo && n.tipo !== "raiz") {
        continue;
      }
      const left = n.x - n.largura / 2;
      const right = n.x + n.largura / 2;
      const top = n.y - n.altura / 2;
      const bottom = n.y + n.altura / 2;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        return n;
      }
    }
    return null;
  }

  function abrirGavetaDetalhes(node) {
    selectedNode = node;
    renderizar();

    const drawer = document.getElementById("mindmapDrawer");
    const tituloEl = document.getElementById("drawerNodeTitulo");
    const bodyEl = document.getElementById("drawerNodeBody");

    if (!drawer || !tituloEl || !bodyEl) return;

    tituloEl.textContent = node.titulo;

    let html = `
      <div style="background-color: ${node.cor || '#1243A5'}; color: #FFF; padding: 6px 12px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; border: var(--border-thin);">
        ${node.tipo.toUpperCase()} ${node.subeixoNum ? `· SUB-EIXO ${node.subeixoNum}` : ''}
      </div>
    `;

    if (node.subtitulo) {
      html += `<p style="font-size: 1rem; font-weight: 600; margin-bottom: 16px; color: #2b312e;">${node.subtitulo}</p>`;
    }

    if (node.responsaveis && node.responsaveis.length > 0) {
      html += `
        <div style="border: var(--border-thin); background: #FAF8F2; padding: 12px; margin-bottom: 16px;">
          <h4 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; color: var(--preto-tinta); margin-bottom: 6px;">
            👤 Responsáveis Nomeados no PDF:
          </h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${node.responsaveis.map(r => `
              <span class="badge-status badge-status-real" style="font-size: 0.8rem;">
                ${r}
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (node.questoesCentrais && node.questoesCentrais.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <h4 style="font-family: var(--font-display); font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: var(--azul-macacao);">
            ❓ Questões Centrais a Responder:
          </h4>
          <ul style="list-style-type: none; display: flex; flex-direction: column; gap: 8px;">
            ${node.questoesCentrais.map((q, idx) => `
              <li style="border-left: 3px solid var(--azul-macacao); padding-left: 10px; font-size: 0.88rem; line-height: 1.4; color: #1c1712;">
                <strong>${idx + 1}.</strong> ${q}
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    if (node.projetosPrincipais && node.projetosPrincipais.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <h4 style="font-family: var(--font-display); font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: var(--vermelho-ato);">
            🚀 Projetos Principais do Sub-eixo:
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${node.projetosPrincipais.map(p => `
              <div style="border: var(--border-thin); padding: 10px; background-color: var(--branco-puro); box-shadow: 2px 2px 0px var(--preto-tinta);">
                <strong style="font-size: 0.9rem;">${p.nome}</strong>
                <div style="font-size: 0.75rem; font-family: var(--font-mono); color: #56615C; margin-top: 4px;">Status: ${p.status}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (node.necessidadesOrganizacionais && node.necessidadesOrganizacionais.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <h4 style="font-family: var(--font-display); font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: var(--verde-pilar);">
            🛠️ Necessidades Organizacionais & Equipe:
          </h4>
          <ul style="list-style-type: square; margin-left: 20px; font-size: 0.88rem; color: #2b312e;">
            ${node.necessidadesOrganizacionais.map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (node.instanciasMapeadas && node.instanciasMapeadas.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <h4 style="font-family: var(--font-display); font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: var(--urucum);">
            🏛️ As 11 Instâncias de Participação Popular Mapeadas:
          </h4>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${node.instanciasMapeadas.map(inst => `
              <div style="border-left: 3px solid var(--urucum); padding: 4px 8px; background: #FAF8F2; font-size: 0.82rem; font-weight: 600;">
                ${inst}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (node.diretrizesGerais && node.diretrizesGerais.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <h4 style="font-family: var(--font-display); font-size: 1rem; font-weight: 800; margin-bottom: 8px; color: var(--preto-tinta);">
            📋 Diretrizes Gerais e Instrumentos de Ação:
          </h4>
          <ul style="list-style-type: disc; margin-left: 20px; font-size: 0.85rem; line-height: 1.45;">
            ${node.diretrizesGerais.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (node.integracaoEixos && node.integracaoEixos.length > 0) {
      html += `
        <div style="margin-bottom: 16px;">
          <h4 style="font-family: var(--font-display); font-size: 1rem; font-weight: 800; margin-bottom: 8px;">
            🔗 Pontes de Integração com Outros Eixos:
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${node.integracaoEixos.map(integ => `
              <div style="border: var(--border-thin); padding: 8px; background: #FAF8F2;">
                <strong>${integ.eixo}</strong><br>
                <span style="font-size: 0.82rem; color: #56615C;">Canal: ${integ.canal} · Resp: ${integ.responsavel}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Botão de navegação ao Observatório
    html += `
      <div style="margin-top: 24px; border-top: var(--border-medium); padding-top: 16px;">
        <a href="index.html#orcamento" class="btn-tradutor-popular" style="width: 100%; justify-content: center; text-decoration: none;">
          📊 Ver Dados no Observatório do Eixo 4
        </a>
      </div>
    `;

    bodyEl.innerHTML = html;
    drawer.classList.add("open");
  }

  function setupEventos() {
    canvas.addEventListener("mousedown", (e) => {
      const pos = getMousePos(e);
      const clickedNode = findNodeAt(pos.worldX, pos.worldY);

      if (clickedNode) {
        // Se clicar no nó, alterna expansão ou abre gaveta
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
      const node = findNodeAt(pos.worldX, pos.worldY);
      if (node !== hoveredNode) {
        hoveredNode = node;
        canvas.style.cursor = node ? "pointer" : "grab";
        renderizar();
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Zoom com a roda do mouse
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const novoScale = Math.max(0.35, Math.min(2.4, scale * zoomFactor));
      scale = novoScale;
      renderizar();
    }, { passive: false });

    // Controles de zoom nos botões
    const btnZoomIn = document.getElementById("btnZoomIn");
    const btnZoomOut = document.getElementById("btnZoomOut");
    const btnZoomReset = document.getElementById("btnZoomReset");
    const btnExpandirTudo = document.getElementById("btnExpandirTudo");
    const btnRecolherTudo = document.getElementById("btnRecolherTudo");
    const inputBusca = document.getElementById("inputBuscaMindmap");

    if (btnZoomIn) {
      btnZoomIn.addEventListener("click", () => {
        scale = Math.min(2.4, scale * 1.2);
        renderizar();
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener("click", () => {
        scale = Math.max(0.35, scale / 1.2);
        renderizar();
      });
    }

    if (btnZoomReset) {
      btnZoomReset.addEventListener("click", () => {
        scale = 0.9;
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
          if (n.tipo !== "raiz") n.expandido = false;
          if (n.filhos) n.filhos.forEach(recolherRec);
        }
        if (treeData) recolherRec(treeData);
        calcularPosicoes();
        renderizar();
      });
    }

    if (inputBusca) {
      inputBusca.addEventListener("input", (e) => {
        searchTerm = e.target.value;
        if (searchTerm) {
          // Se houver busca, expande nós que contêm a busca
          function expandirBusca(n) {
            let matchInChild = false;
            if (n.filhos) {
              n.filhos.forEach(c => {
                if (expandirBusca(c)) matchInChild = true;
              });
            }
            if (n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || matchInChild) {
              n.expandido = true;
              return true;
            }
            return false;
          }
          if (treeData) expandirBusca(treeData);
          calcularPosicoes();
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

  function init() {
    canvas = document.getElementById("canvasMindMap");
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    scale = 0.85;
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
      renderizar();
    }
  };

})();

window.MapaMentalModule = MapaMentalModule;
