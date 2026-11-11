/**
 * Módulo de Projetos de Tecnologia Pública & Reformas Estruturais
 * Avalia o que o Estado está produzindo com base na régua dos 5 critérios do manifesto:
 * 1. Norma | 2. Orçamento | 3. Responsável | 4. Indicador | 5. Controle Social
 */

const ProjetosModule = (() => {

  function renderizarKPIsProjetos() {
    const container = document.getElementById("projetosKPIs");
    if (!container) return;

    const lista = window.OBSERVATORIO_DATA.projetos;
    const total = lista.length;
    const comControleSocial = lista.filter(p => p.criterios.temControleSocial).length;
    const semControleSocial = total - comControleSocial;

    container.innerHTML = `
      <div class="kpi-card destaque-azul">
        <span class="kpi-titulo">Projetos Estruturantes Mapeados</span>
        <div class="kpi-valor">${total}</div>
        <p class="kpi-desc">Iniciativas com impacto direto em direitos do povo</p>
      </div>

      <div class="kpi-card destaque-verde">
        <span class="kpi-titulo">Com Controle Social Efetivo</span>
        <div class="kpi-valor">${comControleSocial}</div>
        <p class="kpi-desc">Conselho ou comitê paritário com movimentos populares</p>
      </div>

      <div class="kpi-card destaque-vermelho">
        <span class="kpi-titulo">Déficit de Controle Social</span>
        <div class="kpi-valor">${semControleSocial}</div>
        <p class="kpi-desc">Sistemas operados em 'caixa-preta' sem participação popular</p>
      </div>

      <div class="kpi-card destaque-amarelo">
        <span class="kpi-titulo">Régua do Manifesto</span>
        <div class="kpi-valor">5 Critérios</div>
        <p class="kpi-desc">Norma, Orçamento, Responsável, Indicador e Controle Social</p>
      </div>
    `;
  }

  function renderizarProjetos() {
    renderizarKPIsProjetos();
    const container = document.getElementById("projetosGrid");
    if (!container) return;

    const lista = window.OBSERVATORIO_DATA.projetos;

    container.innerHTML = lista.map(proj => {
      const c = proj.criterios;
      return `
        <article class="card-projeto">
          <div>
            <div class="card-projeto-topo">
              <div>
                <span class="badge-versao" style="background: var(--amarelo-sol); margin-bottom: 6px; display: inline-block;">
                  ${proj.id}
                </span>
                <h4 class="projeto-nome">${proj.nome}</h4>
                <p class="projeto-orgao">🏛️ ${proj.orgaoResponsavel} · Liderança: ${proj.lideranca}</p>
              </div>
              <span class="badge-versao" style="font-size: 0.75rem; background: #FFF; border: var(--border-medium);">
                ${proj.orcamentoPrevisto}
              </span>
            </div>

            <p style="font-size: 0.92rem; line-height: 1.45; color: #2b312e; margin: 12px 0;">
              ${proj.descricao}
            </p>
          </div>

          <!-- Régua dos 5 Critérios do Manifesto -->
          <div class="regua-manifesto">
            <div class="regua-titulo">
              <span>Régua dos 5 Critérios do Manifesto</span>
              <span style="color: var(--azul-macacao);">Status: ${proj.statusGeral}</span>
            </div>
            <div class="criterios-lista">
              <div class="criterio-pill ${c.temNorma ? 'atendido' : 'nao-atendido'}" title="${c.temNormaDetalhe}">
                ${c.temNorma ? '✓' : '✗'} 1. Norma
              </div>
              <div class="criterio-pill ${c.temOrcamento ? 'atendido' : 'nao-atendido'}" title="${c.temOrcamentoDetalhe}">
                ${c.temOrcamento ? '✓' : '✗'} 2. Orçamento
              </div>
              <div class="criterio-pill ${c.temResponsavel ? 'atendido' : 'nao-atendido'}" title="${c.temResponsavelDetalhe}">
                ${c.temResponsavel ? '✓' : '✗'} 3. Responsável
              </div>
              <div class="criterio-pill ${c.temIndicador ? 'atendido' : 'nao-atendido'}" title="${c.temIndicadorDetalhe}">
                ${c.temIndicador ? '✓' : '✗'} 4. Indicador
              </div>
              <div class="criterio-pill ${c.temControleSocial ? 'atendido' : 'nao-atendido'}" title="${c.temControleSocialDetalhe}">
                ${c.temControleSocial ? '✓' : '✗'} 5. Controle Social
              </div>
            </div>
          </div>

          <!-- Posição Política do Eixo 4 -->
          <div class="projeto-posicao">
            <strong>Posição e Luta do Eixo 4:</strong>
            ${proj.posicaoEixo4}
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="btn-detalhes" onclick="ProjetosModule.abrirDetalhesProjeto('${proj.id}')">
              Ver Avaliação Completa →
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  function abrirDetalhesProjeto(id) {
    const proj = window.OBSERVATORIO_DATA.projetos.find(p => p.id === id);
    if (!proj) return;

    const c = proj.criterios;

    const conteudo = `
      <div style="background: var(--azul-macacao); color: #FFF; border: var(--border-medium); padding: 18px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #FDC303;">${proj.id} · AVALIAÇÃO DE POLÍTICA PÚBLICA</span>
        <h4 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; margin-top: 4px;">${proj.nome}</h4>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: #FFFDF7; margin-top: 4px;">Orçamento: ${proj.orcamentoPrevisto}</p>
      </div>

      <div style="background: #FFF; border: var(--border-thin); padding: 14px;">
        <h5 style="font-family: var(--font-display); font-size: 0.9rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">Descrição do Projeto</h5>
        <p style="font-size: 0.9rem; line-height: 1.45; color: #2b312e;">${proj.descricao}</p>
      </div>

      <div>
        <h5 style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #56615C; margin-bottom: 8px;">
          Auditoria da Régua dos 5 Critérios
        </h5>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="background: #FFF; border: var(--border-thin); padding: 10px 14px; border-left: 5px solid ${c.temNorma ? 'var(--verde-pilar)' : 'var(--vermelho-ato)'};">
            <strong>1. Tem Norma/Lei? ${c.temNorma ? '🟢 Sim' : '🔴 Não'}</strong>
            <p style="font-size: 0.82rem; color: #56615C; margin-top: 2px;">${c.temNormaDetalhe}</p>
          </div>

          <div style="background: #FFF; border: var(--border-thin); padding: 10px 14px; border-left: 5px solid ${c.temOrcamento ? 'var(--verde-pilar)' : 'var(--vermelho-ato)'};">
            <strong>2. Tem Orçamento? ${c.temOrcamento ? '🟢 Sim' : '🔴 Não'}</strong>
            <p style="font-size: 0.82rem; color: #56615C; margin-top: 2px;">${c.temOrcamentoDetalhe}</p>
          </div>

          <div style="background: #FFF; border: var(--border-thin); padding: 10px 14px; border-left: 5px solid ${c.temResponsavel ? 'var(--verde-pilar)' : 'var(--vermelho-ato)'};">
            <strong>3. Tem Responsável Público? ${c.temResponsavel ? '🟢 Sim' : '🔴 Não'}</strong>
            <p style="font-size: 0.82rem; color: #56615C; margin-top: 2px;">${c.temResponsavelDetalhe}</p>
          </div>

          <div style="background: #FFF; border: var(--border-thin); padding: 10px 14px; border-left: 5px solid ${c.temIndicador ? 'var(--verde-pilar)' : 'var(--vermelho-ato)'};">
            <strong>4. Tem Indicador Mensurável? ${c.temIndicador ? '🟢 Sim' : '🔴 Não'}</strong>
            <p style="font-size: 0.82rem; color: #56615C; margin-top: 2px;">${c.temIndicadorDetalhe}</p>
          </div>

          <div style="background: #FFF; border: var(--border-thin); padding: 10px 14px; border-left: 5px solid ${c.temControleSocial ? 'var(--verde-pilar)' : 'var(--vermelho-ato)'};">
            <strong>5. Tem Controle Social Popular? ${c.temControleSocial ? '🟢 Sim' : '🔴 Não'}</strong>
            <p style="font-size: 0.82rem; color: #56615C; margin-top: 2px;">${c.temControleSocialDetalhe}</p>
          </div>
        </div>
      </div>

      <div style="background: #FFFDF0; border: var(--border-medium); padding: 16px;">
        <span style="background: var(--amarelo-sol); color: var(--preto-tinta); padding: 2px 8px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;">
          DIRETRIZ POLÍTICA
        </span>
        <h5 style="font-family: var(--font-display); font-size: 1rem; font-weight: 900; margin: 8px 0 4px 0;">Como o Movimento Deve Agir</h5>
        <p style="font-size: 0.9rem; line-height: 1.45; color: #1C1712;">${proj.posicaoEixo4}</p>
      </div>
    `;

    window.App.abrirDrawer("Dossiê de Projeto Público", conteudo);
  }

  function init() {
    renderizarProjetos();
  }

  return {
    init,
    abrirDetalhesProjeto
  };
})();

window.ProjetosModule = ProjetosModule;
