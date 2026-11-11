/**
 * Módulo de Grafo Interativo de Pessoas & Instituições Públicas
 * Tecnologia: HTML5 Canvas com simulação física suave (Spring-Embedder),
 * suporte a zoom, pan, arrasto de nós e abertura de perfil ao clicar.
 */

const GrafoModule = (() => {
  let canvas, ctx;
  let nodes = [];
  let edges = [];
  let animId = null;

  // Câmera / Transformação (Pan & Zoom)
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragNode = null;
  let dragStart = { x: 0, y: 0 };
  let hasMoved = false;

  // Imagens cacheadas
  const imageCache = {};

  function initData() {
    const data = window.OBSERVATORIO_DATA.grafo;
    nodes = [];
    edges = [];

    const instMap = {};
    const width = canvas ? canvas.width : 1000;
    const height = canvas ? canvas.height : 600;

    // Criar nós de Instituições
    data.instituicoes.forEach((inst, index) => {
      const angle = (index / data.instituicoes.length) * Math.PI * 2;
      const radius = 220;
      const node = {
        id: inst.id,
        tipo: "instituicao",
        dados: inst,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        w: 160,
        h: 54,
        radius: 35
      };
      nodes.push(node);
      instMap[inst.id] = node;
    });

    // Criar nós de Pessoas
    data.pessoas.forEach((pes, index) => {
      const instNode = instMap[pes.instituicaoId];
      const offsetX = (Math.random() - 0.5) * 120;
      const offsetY = 70 + (Math.random() * 40);

      const node = {
        id: pes.id,
        tipo: "pessoa",
        dados: pes,
        x: instNode ? instNode.x + offsetX : width / 2 + (Math.random() - 0.5) * 300,
        y: instNode ? instNode.y + offsetY : height / 2 + (Math.random() - 0.5) * 300,
        vx: 0,
        vy: 0,
        radius: 28
      };

      // Pré-carregar foto
      if (pes.foto && !imageCache[pes.foto]) {
        const img = new Image();
        img.src = pes.foto;
        img.onload = () => { imageCache[pes.foto] = img; };
      }

      nodes.push(node);
    });

    // Criar Arestas
    data.conexoes.forEach(con => {
      const source = nodes.find(n => n.id === con.de);
      const target = nodes.find(n => n.id === con.para);
      if (source && target) {
        edges.push({
          source,
          target,
          rotulo: con.rotulo,
          tipo: con.tipo
        });
      }
    });
  }

  function setupCanvas() {
    canvas = document.getElementById("grafoCanvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    panX = (rect.width - 900) / 2;
    panY = 20;

    initData();
    setupEvents();
    startSimulation();
  }

  function setupEvents() {
    canvas.onmousedown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panX) / scale;
      const mouseY = (e.clientY - rect.top - panY) / scale;

      // Verificar se clicou em um nó (pessoas primeiro, pois ficam por cima)
      dragNode = null;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
        if (dist <= n.radius + 6) {
          dragNode = n;
          break;
        }
      }

      isDragging = true;
      hasMoved = false;
      dragStart = { x: e.clientX, y: e.clientY };
    };

    window.onmousemove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (Math.hypot(dx, dy) > 4) {
        hasMoved = true;
      }

      if (dragNode) {
        dragNode.x += dx / scale;
        dragNode.y += dy / scale;
        dragNode.vx = 0;
        dragNode.vy = 0;
      } else {
        panX += dx;
        panY += dy;
      }

      dragStart = { x: e.clientX, y: e.clientY };
    };

    window.onmouseup = () => {
      if (isDragging && !hasMoved && dragNode) {
        onNodeClick(dragNode);
      }
      isDragging = false;
      dragNode = null;
    };

    canvas.onwheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale = Math.min(Math.max(scale * zoomFactor, 0.4), 2.2);

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      panX = mouseX - (mouseX - panX) * (newScale / scale);
      panY = mouseY - (mouseY - panY) * (newScale / scale);
      scale = newScale;
    };
  }

  function startSimulation() {
    function tick() {
      // Força de atração nas arestas
      edges.forEach(edge => {
        const dx = edge.target.x - edge.source.x;
        const dy = edge.target.y - edge.source.y;
        const dist = Math.hypot(dx, dy) || 1;
        const targetDist = edge.source.tipo === "instituicao" && edge.target.tipo === "instituicao" ? 220 : 110;
        const force = (dist - targetDist) * 0.003;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (edge.source !== dragNode) {
          edge.source.vx += fx;
          edge.source.vy += fy;
        }
        if (edge.target !== dragNode) {
          edge.target.vx -= fx;
          edge.target.vy -= fy;
        }
      });

      // Força de repulsão entre nós
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 1;
          const minDist = (a.radius + b.radius) + 50;

          if (dist < minDist) {
            const force = (minDist - dist) * 0.04;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (a !== dragNode) {
              a.vx -= fx;
              a.vy -= fy;
            }
            if (b !== dragNode) {
              b.vx += fx;
              b.vy += fy;
            }
          }
        }
      }

      // Atualizar posições com atrito
      nodes.forEach(n => {
        if (n !== dragNode) {
          n.vx *= 0.88;
          n.vy *= 0.88;
          n.x += n.vx;
          n.y += n.vy;
        }
      });

      draw();
      animId = requestAnimationFrame(tick);
    }

    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(tick);
  }

  function draw() {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scale, scale);

    // 1. Desenhar Arestas (Conexões)
    edges.forEach(edge => {
      ctx.beginPath();
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);

      if (edge.tipo === "porta_giratoria") {
        ctx.strokeStyle = "#C8322A";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
      } else {
        ctx.strokeStyle = "#1C1712";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Rótulo da conexão
      if (scale > 0.75) {
        const midX = (edge.source.x + edge.target.x) / 2;
        const midY = (edge.source.y + edge.target.y) / 2;
        ctx.font = "bold 9px 'Space Mono', monospace";
        ctx.fillStyle = edge.tipo === "porta_giratoria" ? "#C8322A" : "#56615C";
        ctx.textAlign = "center";
        ctx.fillText(edge.rotulo, midX, midY - 4);
      }
    });

    // 2. Desenhar Nós
    nodes.forEach(node => {
      if (node.tipo === "instituicao") {
        // Estilo Viga Institucional Neobrutalista
        const inst = node.dados;
        const w = 150;
        const h = 50;
        const x = node.x - w / 2;
        const y = node.y - h / 2;

        // Sombra dura
        ctx.fillStyle = "#1C1712";
        ctx.fillRect(x + 4, y + 4, w, h);

        // Bloco
        ctx.fillStyle = inst.cor || "#1243A5";
        ctx.fillRect(x, y, w, h);

        // Borda grossa
        ctx.strokeStyle = "#1C1712";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x, y, w, h);

        // Texto da Sigla
        ctx.fillStyle = "#FFFDF7";
        ctx.font = "bold 13px 'Archivo', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(inst.sigla, node.x, node.y - 4);

        // Texto do Papel Resumido
        ctx.fillStyle = "#F3E3B5";
        ctx.font = "bold 9px 'Space Mono', monospace";
        ctx.fillText(inst.orcamentoTotal, node.x, node.y + 13);
      } else {
        // Estilo Pessoa (Avatar com anel de trajetória)
        const pes = node.dados;
        const r = node.radius;

        // Sombra dura
        ctx.beginPath();
        ctx.arc(node.x + 3, node.y + 3, r, 0, Math.PI * 2);
        ctx.fillStyle = "#1C1712";
        ctx.fill();

        // Círculo base
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#FFF";
        ctx.fill();

        // Foto se houver
        if (imageCache[pes.foto]) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(imageCache[pes.foto], node.x - r, node.y - r, r * 2, r * 2);
          ctx.restore();
        } else {
          // Iniciais se não carregou foto
          ctx.fillStyle = "#1C1712";
          ctx.font = "bold 14px 'Archivo', sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const iniciais = pes.nome.split(" ").map(p => p[0]).slice(0, 2).join("");
          ctx.fillText(iniciais, node.x, node.y);
          ctx.textBaseline = "alphabetic";
        }

        // Anel colorido de Trajetória
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        if (pes.origem === "porta_giratoria") {
          ctx.strokeStyle = "#C8322A"; // Vermelho ato: atenção
        } else if (pes.origem === "movimentos_sociais" || pes.origem === "academia_movimento") {
          ctx.strokeStyle = "#21672A"; // Verde pilar: popular
        } else {
          ctx.strokeStyle = "#1243A5"; // Azul: carreira/institucional
        }
        ctx.stroke();

        // Contorno externo preto
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 2, 0, Math.PI * 2);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = "#1C1712";
        ctx.stroke();

        // Nome da pessoa abaixo do nó
        ctx.fillStyle = "#1C1712";
        ctx.font = "bold 11px 'Archivo', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(pes.nome.split(" ")[0] + " " + (pes.nome.split(" ")[1] || ""), node.x, node.y + r + 16);

        // Termômetro / Origem
        ctx.font = "bold 8.5px 'Space Mono', monospace";
        ctx.fillStyle = pes.origem === "porta_giratoria" ? "#C8322A" : "#56615C";
        const tagOrigem = pes.origem === "porta_giratoria" ? "🚨 EX-BIG TECH" : pes.origem === "movimentos_sociais" ? "🌱 MOV. SOCIAL" : "🏛️ CARREIRA";
        ctx.fillText(tagOrigem, node.x, node.y + r + 27);
      }
    });

    ctx.restore();
  }

  function onNodeClick(node) {
    if (node.tipo === "pessoa") {
      abrirPerfilPessoa(node.dados);
    } else if (node.tipo === "instituicao") {
      abrirPerfilInstituicao(node.dados);
    }
  }

  function abrirPerfilPessoa(pes) {
    const isBigTech = pes.origem === "porta_giratoria";
    const isMovimento = pes.origem === "movimentos_sociais" || pes.origem === "academia_movimento";

    const badgeCor = isBigTech ? "background: #FFF2F1; border-color: #C8322A; color: #C8322A;" :
                     isMovimento ? "background: #F1FBF2; border-color: #21672A; color: #21672A;" :
                     "background: #E8EEFA; border-color: #1243A5; color: #1243A5;";

    const badgeTexto = isBigTech ? "🚨 PORTA GIRATÓRIA (EX-BIG TECH)" :
                       isMovimento ? "🌱 ORIGEM POPULAR / ACADÊMICA" :
                       "🏛️ SERVIDOR PÚBLICO DE CARREIRA";

    const conteudo = `
      <div style="display: flex; gap: 18px; align-items: center; background: #FFF; border: var(--border-medium); padding: 18px;">
        <img src="${pes.foto}" alt="${pes.nome}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid ${isBigTech ? 'var(--vermelho-ato)' : 'var(--azul-macacao)'}; object-fit: cover; box-shadow: var(--shadow-hard-sm);">
        <div>
          <span style="display: inline-block; padding: 2px 8px; border: var(--border-thin); font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; ${badgeCor}">
            ${badgeTexto}
          </span>
          <h4 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; margin-top: 4px; line-height: 1.15;">
            ${pes.nome}
          </h4>
          <p style="font-size: 0.85rem; color: #56615C; margin-top: 2px;">${pes.cargo}</p>
        </div>
      </div>

      <!-- Termômetro de Soberania Digital -->
      <div style="background: #FFF; border: var(--border-medium); padding: 14px 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
            Termômetro de Soberania Digital
          </span>
          <span style="font-family: var(--font-mono); font-size: 1rem; font-weight: 900; color: ${pes.termometroSoberania >= 70 ? 'var(--verde-pilar)' : pes.termometroSoberania >= 50 ? 'var(--urucum)' : 'var(--vermelho-ato)'};">
            ${pes.termometroSoberania}%
          </span>
        </div>
        <div style="width: 100%; height: 12px; background: #E0DDD5; border: var(--border-thin); position: relative;">
          <div style="height: 100%; width: ${pes.termometroSoberania}%; background: ${pes.termometroSoberania >= 70 ? 'var(--verde-pilar)' : pes.termometroSoberania >= 50 ? 'var(--amarelo-sol)' : 'var(--vermelho-ato)'};"></div>
        </div>
        <span style="display: block; font-size: 0.75rem; color: #56615C; margin-top: 4px;">Alinhamento: <strong>${pes.alinhamento}</strong></span>
      </div>

      <!-- Como Chegou Lá -->
      <div style="background: var(--areia); border: var(--border-medium); padding: 16px;">
        <h5 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 900; text-transform: uppercase; color: var(--preto-tinta); margin-bottom: 6px;">
          🔍 Como Chegou Lá (Trajetória & Origem)
        </h5>
        <p style="font-size: 0.9rem; line-height: 1.45; color: #1C1712;">${pes.comoChegouLa}</p>
      </div>

      <!-- Projetos Geridos -->
      <div>
        <h5 style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #56615C; margin-bottom: 8px;">
          Projetos & Contratos sob sua Gestão
        </h5>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${pes.projetosLiderados.map(p => `
            <div style="background: #FFF; border: var(--border-thin); padding: 8px 12px; font-size: 0.88rem; font-weight: 600;">
              📌 ${p}
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Posicionamento & Conflitos -->
      <div style="background: #FFF; border: var(--border-thin); padding: 14px;">
        <h5 style="font-family: var(--font-display); font-size: 0.9rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">
          Visão e Prática Institucional
        </h5>
        <p style="font-size: 0.85rem; line-height: 1.4; color: #3d4642;">${pes.posicionamento}</p>
      </div>

      <!-- Ponto de Pressão Popular -->
      <div style="background: #FFF2F1; border: var(--border-medium); border-left: 6px solid var(--vermelho-ato); padding: 14px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--vermelho-ato); text-transform: uppercase; display: block; margin-bottom: 4px;">
          Ponto de Incidência do Eixo 4
        </span>
        <p style="font-size: 0.88rem; line-height: 1.4; font-weight: 600; color: #1C1712;">${pes.pontosDePressao}</p>
      </div>
    `;

    window.App.abrirDrawer("Perfil da Liderança de TI Pública", conteudo);
  }

  function abrirPerfilInstituicao(inst) {
    const pessoasDaInst = window.OBSERVATORIO_DATA.grafo.pessoas.filter(p => p.instituicaoId === inst.id);

    const conteudo = `
      <div style="background: ${inst.cor}; color: #FFF; border: var(--border-medium); padding: 18px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #F3E3B5; text-transform: uppercase;">
          Instituição Pública
        </span>
        <h4 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; margin-top: 4px;">
          ${inst.nome}
        </h4>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: #FFFDF7; margin-top: 4px;">
          Orçamento Estimado: ${inst.orcamentoTotal}
        </p>
      </div>

      <div style="background: #FFF; border: var(--border-thin); padding: 14px;">
        <h5 style="font-family: var(--font-display); font-size: 0.9rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">
          Papel no Estado Brasileiro
        </h5>
        <p style="font-size: 0.9rem; line-height: 1.45; color: #2b312e;">${inst.papel}</p>
      </div>

      <div>
        <h5 style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #56615C; margin-bottom: 8px;">
          Lideranças Mapeadas nesta Instituição
        </h5>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${pessoasDaInst.map(p => `
            <div style="background: #FFF; border: var(--border-medium); padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <div>
                <strong>${p.nome}</strong>
                <p style="font-size: 0.8rem; color: #56615C;">${p.cargo}</p>
              </div>
              <button class="btn-detalhes" onclick="GrafoModule.abrirPerfilPorId('${p.id}')">Ver Perfil</button>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    window.App.abrirDrawer("Dossiê da Instituição", conteudo);
  }

  function resetZoom() {
    scale = 1;
    const rect = canvas.getBoundingClientRect();
    panX = (rect.width - 900) / 2;
    panY = 20;
  }

  function zoomIn() {
    scale = Math.min(scale * 1.2, 2.2);
  }

  function zoomOut() {
    scale = Math.max(scale * 0.8, 0.4);
  }

  function init() {
    setupCanvas();
    window.addEventListener("resize", () => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
    });
  }

  return {
    init,
    resetZoom,
    zoomIn,
    zoomOut,
    abrirPerfilPorId: (id) => {
      const p = window.OBSERVATORIO_DATA.grafo.pessoas.find(x => x.id === id);
      if (p) abrirPerfilPessoa(p);
    }
  };
})();

window.GrafoModule = GrafoModule;
