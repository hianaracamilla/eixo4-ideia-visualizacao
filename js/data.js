/**
 * Base de Dados do Observatório do Eixo 4
 * Movimento pela Soberania Digital Popular
 * Dados estruturados a partir das pesquisas e notas técnicas do Eixo 4
 */

const OBSERVATORIO_DATA = {
  // Metadados gerais
  meta: {
    titulo: "Soberania em Dados · Observatório do Eixo 4",
    lema: "Tecnologia não é neutra: ou serve ao capital, ou constrói o poder popular.",
    atualizadoEm: "Novembro de 2026",
    versao: "Protótipo 1.0 - Interface Visual",
    totalOrcamentoTI: 10600000000, // R$ 10,6 bi (Elemento 40 - 2025)
    totalMarcasEstrangeiras: 2780000000, // R$ 2,78 bi identificados (2023-2026)
    estataisConcentracao: 46.5 // 46,5% Serpro + Dataprev
  },

  // 1. Mapeamento de Licitações (Federal, Estadual, Municipal)
  licitacoes: [
    {
      id: "LIC-FED-2026-089",
      esfera: "federal",
      orgao: "MGI · Secretaria de Governo Digital (SGD)",
      uf: "DF",
      municipio: "Brasília",
      objeto: "Contratação de serviços de nuvem multi-cloud e suporte de licenciamento enterprise para a Administração Pública Federal",
      modalidade: "Pregão Eletrônico (SRP)",
      valorEstimado: 606500000,
      dataAbertura: "2026-11-28",
      status: "aberta",
      categoria: "Nuvem & Licenças",
      fornecedorFavorito: "Microsoft / Integradores Globais",
      tags: ["alerta-dependencia", "cloud-lockin"],
      alertaCritico: "ALERTA: Edital exige certificação de nuvem proprietária estrangeira, restringindo concorrência nacional e impedindo migração para o Serpro Nuvem Soberana.",
      impactoPopular: "Risco de aprisionamento tecnológico por 5 anos com envio de telemetria governamental ao exterior.",
      propostaEixo4: "Impugnação técnica exigindo padrões abertos, interoperabilidade e prioridade à nuvem pública nacional."
    },
    {
      id: "LIC-FED-2026-042",
      esfera: "federal",
      orgao: "Ministério da Saúde (MS)",
      uf: "DF",
      municipio: "Brasília",
      objeto: "Desenvolvimento e sustentação de módulos abertos para o Prontuário Eletrônico do SUS (e-SUS APS) em padrões livres",
      modalidade: "Concorrência Pública Técnica e Preço",
      valorEstimado: 54000000,
      dataAbertura: "2026-12-05",
      status: "aberta",
      categoria: "Software Público / SUS",
      fornecedorFavorito: "Consórcio de Universidades e Cooperativas de TI",
      tags: ["oportunidade-popular", "software-livre"],
      alertaCritico: "OPORTUNIDADE: Edital com cláusula de código aberto obrigatório e repositório público no GitLab do Ministério.",
      impactoPopular: "Fortalece a soberania de dados de saúde de mais de 160 milhões de usuárias e usuários do SUS.",
      propostaEixo4: "Apoiar a participação de redes de desenvolvedores populares e centros públicos de pesquisa."
    },
    {
      id: "LIC-FED-2026-115",
      esfera: "federal",
      orgao: "DATAPREV",
      uf: "DF",
      municipio: "Brasília",
      objeto: "Renovação de subscrições de virtualização e bancos de dados transacionais para o sistema previdenciário",
      modalidade: "Inexigibilidade de Licitação",
      valorEstimado: 142000000,
      dataAbertura: "2026-11-18",
      status: "em-analise",
      categoria: "Infraestrutura de Dados",
      fornecedorFavorito: "Oracle do Brasil / VMware",
      tags: ["alerta-dependencia", "inexigibilidade"],
      alertaCritico: "ALERTA: Contratação direta sem disputa, mantendo dependência de licenças que encarecem em dólar.",
      impactoPopular: "Custo anual de R$ 142 milhões poderia bancar migração estruturada para PostgreSQL livre.",
      propostaEixo4: "Representação no TCU cobrando cronograma obrigatório de desverticalização e plano de transição."
    },
    {
      id: "LIC-EST-SP-2026-301",
      esfera: "estadual",
      orgao: "Tribunal de Justiça de São Paulo (TJ-SP)",
      uf: "SP",
      municipio: "São Paulo",
      objeto: "Fornecimento de 45.000 licenças de sistema operacional e suíte de escritório em nuvem proprietária",
      modalidade: "Pregão Eletrônico",
      valorEstimado: 89000000,
      dataAbertura: "2026-12-10",
      status: "aberta",
      categoria: "Produtividade & Desktop",
      fornecedorFavorito: "Revenda Microsoft Corporativa",
      tags: ["alerta-dependencia", "cloud-lockin"],
      alertaCritico: "ALERTA: Bloqueio a suítes abertas como LibreOffice e Nextcloud que já são usadas com sucesso em tribunais internacionais.",
      impactoPopular: "Gasto recorrente de quase R$ 90 mi drenado para o exterior sem gerar um único emprego técnico no estado.",
      propostaEixo4: "Ação popular e nota técnica junto ao Conselho Nacional de Justiça (CNJ)."
    },
    {
      id: "LIC-EST-BA-2026-120",
      esfera: "estadual",
      orgao: "Secretaria de Educação da Bahia (SEC-BA)",
      uf: "BA",
      municipio: "Salvador",
      objeto: "Implantação de redes comunitárias de banda larga e telecentros solares em 650 comunidades rurais e quilombolas",
      modalidade: "Chamamento Público de Fomento",
      valorEstimado: 38500000,
      dataAbertura: "2026-12-15",
      status: "aberta",
      categoria: "Conectividade Popular",
      fornecedorFavorito: "Associações Comunitárias e Cooperativas Locais",
      tags: ["oportunidade-popular", "conectividade-base"],
      alertaCritico: "OPORTUNIDADE: Modelo alinhado ao Eixo 3 e 4 com infraestrutura gerida pelo próprio território.",
      impactoPopular: "Supera a armadilha do zero rating (onde a juventude só acessa WhatsApp/TikTok sem rede aberta).",
      propostaEixo4: "Mobilizar coletivos populares do estado para concorrer e assumir a gestão técnica da infraestrutura."
    },
    {
      id: "LIC-EST-CE-2026-088",
      esfera: "estadual",
      orgao: "Secretaria de Segurança Pública do Ceará (SSP-CE)",
      uf: "CE",
      municipio: "Fortaleza",
      objeto: "Aquisição de plataforma de IA preditiva e câmeras de videomonitoramento com reconhecimento facial urbano",
      modalidade: "Pregão Internacional",
      valorEstimado: 72000000,
      dataAbertura: "2026-11-25",
      status: "em-analise",
      categoria: "Vigilância & Algoritmos",
      fornecedorFavorito: "Consórcio Dahua / NEC",
      tags: ["alerta-vigilancia", "racismo-algoritmico"],
      alertaCritico: "PERIGO MÁXIMO: Sistema de reconhecimento facial em vias públicas associado a falsos positivos e prisões ilegais.",
      impactoPopular: "Criminalização desproporcional da juventude negra e periférica nas ruas de Fortaleza.",
      propostaEixo4: "Campanha pelo banimento de reconhecimento facial na segurança pública (Diretriz 3 do Eixo 4)."
    },
    {
      id: "LIC-MUN-SP-2026-512",
      esfera: "municipal",
      orgao: "Prefeitura de São Paulo · SMIT",
      uf: "SP",
      municipio: "São Paulo",
      objeto: "Expansão de 3.000 pontos do programa Smart Sampa com módulos biométricos integrados à nuvem corporativa",
      modalidade: "Concorrência Pública",
      valorEstimado: 110000000,
      dataAbertura: "2026-12-02",
      status: "aberta",
      categoria: "Vigilância & Câmeras",
      fornecedorFavorito: "Consórcio Smart SP",
      tags: ["alerta-vigilancia", "racismo-algoritmico"],
      alertaCritico: "ALERTA: Mais de R$ 110 milhões aplicados em vigilância em massa sem consulta às periferias nem auditoria aberta.",
      impactoPopular: "Câmeras espalhadas pelas periferias sem que haja investimento equivalente em saúde e saneamento.",
      propostaEixo4: "Audiência pública emergencial na Câmara Municipal de SP e ação civil pública junto ao MP-SP."
    },
    {
      id: "LIC-MUN-REC-2026-045",
      esfera: "municipal",
      orgao: "Prefeitura do Recife · EMPREL",
      uf: "PE",
      municipio: "Recife",
      objeto: "Desenvolvimento de aplicativo municipal aberto para cooperativas de entregadores e motoristas populares",
      modalidade: "Edital de Inovação Aberta",
      valorEstimado: 14500000,
      dataAbertura: "2026-12-20",
      status: "aberta",
      categoria: "Cooperativismo de Plataforma",
      fornecedorFavorito: "Cooperativas de Tecnologia e Sindicatos Locais",
      tags: ["oportunidade-popular", "cooperativismo"],
      alertaCritico: "OPORTUNIDADE: Piloto municipal nos moldes do manifesto para combater a uberização com plataforma solidária.",
      impactoPopular: "Taxa zero de intermediação para os trabalhadores e remuneração justa com seguridade social.",
      propostaEixo4: "Articular o sindicato dos entregadores e o movimento popular para co-gestão do projeto."
    },
    {
      id: "LIC-MUN-BEL-2026-019",
      esfera: "municipal",
      orgao: "Prefeitura de Belém · CINBESA",
      uf: "PA",
      municipio: "Belém",
      objeto: "Migração dos servidores municipais para cluster de software livre e nuvem cívica municipal",
      modalidade: "Pregão Eletrônico",
      valorEstimado: 8900000,
      dataAbertura: "2026-11-30",
      status: "aberta",
      categoria: "Software Livre / Soberania",
      fornecedorFavorito: "Cooperativa Amazônica de TI e Empresas Locais",
      tags: ["oportunidade-popular", "software-livre"],
      alertaCritico: "OPORTUNIDADE: Rompimento com monopólios estrangeiros de licenças e retenção de receita na economia local.",
      impactoPopular: "Fortalece a capacidade tecnológica regional amazônica sem evasão de divisas em dólar.",
      propostaEixo4: "Documentar o caso como referência de transição municipal para inspirar outros municípios."
    }
  ],

  // 2. Mapeamento de Instituições e Pessoas (Grafo)
  grafo: {
    instituicoes: [
      {
        id: "inst-sgpr",
        nome: "Secretaria-Geral da Presidência (SG-PR)",
        sigla: "SG-PR",
        tipo: "presidencia",
        papel: "Articulação com movimentos populares, mesas de negociação e conselhos participativos.",
        orcamentoTotal: "R$ 480 Mi",
        cor: "#1243A5"
      },
      {
        id: "inst-mgi",
        nome: "Ministério da Gestão e da Inovação (MGI)",
        sigla: "MGI",
        tipo: "ministerio",
        papel: "Define compras públicas federais, governança digital e contratos corporativos de TI da União.",
        orcamentoTotal: "R$ 3,8 Bi em TI",
        cor: "#21672A"
      },
      {
        id: "inst-mcti",
        nome: "Min. da Ciência, Tecnologia e Inovação (MCTI)",
        sigla: "MCTI",
        tipo: "ministerio",
        papel: "Fomento à pesquisa científica nacional, centros de tecnologia e política de IA.",
        orcamentoTotal: "R$ 1,9 Bi em P&D",
        cor: "#21672A"
      },
      {
        id: "inst-serpro",
        nome: "SERPRO · Serviço Federal de Proc. de Dados",
        sigla: "SERPRO",
        tipo: "estatal",
        papel: "Maior estatal de TI da América Latina; opera IRPF, CNH, Compras.gov e Nuvem de Governo.",
        orcamentoTotal: "R$ 4,2 Bi faturamento",
        cor: "#1243A5"
      },
      {
        id: "inst-dataprev",
        nome: "DATAPREV · Tecnologia da Previdência Social",
        sigla: "DATAPREV",
        tipo: "estatal",
        papel: "Guarda e processa os dados sociais do Cadastro Único, Bolsa Família e INSS.",
        orcamentoTotal: "R$ 2,6 Bi faturamento",
        cor: "#1243A5"
      },
      {
        id: "inst-anpd",
        nome: "Autoridade Nacional de Proteção de Dados (ANPD)",
        sigla: "ANPD",
        tipo: "regulador",
        papel: "Fiscalização da LGPD, privacidade da população e punição de abusos de dados pelas Big Techs.",
        orcamentoTotal: "R$ 65 Mi",
        cor: "#C8322A"
      },
      {
        id: "inst-tcu",
        nome: "Tribunal de Contas da União (TCU)",
        sigla: "TCU",
        tipo: "controle",
        papel: "Auditoria de licitações milionárias de TI e fiscalização de dependência tecnológica estrangeira.",
        orcamentoTotal: "Órgão de Controle",
        cor: "#1C1712"
      },
      {
        id: "inst-frente",
        nome: "Frente Parlamentar pela Soberania Digital",
        sigla: "Congresso",
        tipo: "legislativo",
        papel: "Disputa de leis, regulação de IA, PL 4218/2025 e emendas orçamentárias.",
        orcamentoTotal: "Poder Legislativo",
        cor: "#ED8D1F"
      }
    ],

    pessoas: [
      {
        id: "pes-01",
        nome: "Rogério Santana de Almeida",
        cargo: "Secretário de Governo Digital (SGD / MGI)",
        instituicaoId: "inst-mgi",
        foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        origem: "carreira_publica",
        comoChegouLa: "Especialista em Políticas Públicas e Gestão Governamental (EPPGG) de carreira desde 2004. Atuou em sucessivas gestões no planejamento do Portal Gov.br.",
        alinhamento: "Moderado / Institucional",
        termometroSoberania: 58,
        projetosLiderados: ["Gov.br", "Catálogo Eletrônico de Padronização de TI", "Contrato MGI-Microsoft (R$ 606 Mi)"],
        posicionamento: "Defende a modernização acelerada dos serviços digitais, mas aceita modelos híbridos com alta penetração de grandes nuvens estrangeiras sob alegação de comodidade e escala imediata.",
        pontosDePressao: "Cobrar a inclusão de cláusulas antimonopólio e fomento obrigatório a fornecedores nacionais nos pregões corporativos."
      },
      {
        id: "pes-02",
        nome: "Dra. Clarice Mendonça Ramos",
        cargo: "Diretora-Presidente do SERPRO",
        instituicaoId: "inst-serpro",
        foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        origem: "academia_movimento",
        comoChegouLa: "Professora titular de Ciência da Computação na UFRJ, ex-coordenadora da Rede Nacional de Pesquisa e ativista histórica da comunidade de Software Livre brasileira. Indicada pelo campo progressista em 2023.",
        alinhamento: "Soberanista Firme",
        termometroSoberania: 92,
        projetosLiderados: ["Nuvem Soberana de Governo", "Migração de Bancos de Dados para Código Aberto", "Laboratórios Cívicos Serpro"],
        posicionamento: "Defende a soberania do dado público, recusa o armazenamento de informações estratégicas de cidadãos em servidores sujeitos ao Cloud Act norte-americano.",
        pontosDePressao: "Aliada prioritária do movimento. Apoiar suas iniciativas contra o lobby dos grandes revendedores privados de licenças."
      },
      {
        id: "pes-03",
        nome: "Carlos Eduardo Faria Leite",
        cargo: "Diretor de Tecnologia e Infraestrutura da DATAPREV",
        instituicaoId: "inst-dataprev",
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        origem: "porta_giratoria",
        comoChegouLa: "Atuou durante 14 anos como Diretor de Soluções para Setor Público em multinacional americana de tecnologia (Oracle e AWS). Nomeado para o cargo no final de 2024.",
        alinhamento: "Pró-Mercado / Big Tech",
        termometroSoberania: 28,
        projetosLiderados: ["Nuvem Híbrida do INSS", "Terceirização de Clusters Previdenciários", "Contratos de Inexigibilidade de Banco de Dados"],
        posicionamento: "Advoga abertamente pela contratação de infraestrutura de Big Techs como a saída mais barata no curto prazo, minimizando riscos de dependência colonial de dados.",
        pontosDePressao: "Alvo direto de fiscalização popular e pedidos de informação via LAI para investigar possíveis conflitos de interesse e contratos sem licitação."
      },
      {
        id: "pes-04",
        nome: "Juliana Kaingang Nogueira",
        cargo: "Secretária de Políticas Digitais e Inclusão (SG-PR)",
        instituicaoId: "inst-sgpr",
        foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
        origem: "movimentos_sociais",
        comoChegouLa: "Liderança indígena, comunicadora popular e articuladora de redes comunitárias de telecomunicação na Amazônia e no Sul. Assumiu a secretaria após mobilização dos eixos populares.",
        alinhamento: "Soberanista Popular",
        termometroSoberania: 96,
        projetosLiderados: ["Mesa Nacional de Cooperativismo de Plataforma", "Programa Internet das Cozinhas Solidárias", "Comitê de Participação Cívica Digital"],
        posicionamento: "Construção de poder popular a partir da base. A infraestrutura digital deve atender a quem cuida, trabalha e produz a riqueza do país.",
        pontosDePressao: "Canal aberto para transformar as pautas do Eixo 4 em minutas executivas e audiências governamentais."
      },
      {
        id: "pes-05",
        nome: "Dr. Marcelo Toledo Vianna",
        cargo: "Conselheiro e Diretor de Fiscalização da ANPD",
        instituicaoId: "inst-anpd",
        foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        origem: "carreira_publica",
        comoChegouLa: "Procurador federal de carreira, doutor em Direito Constitucional pela USP. Foi relator da resolução que limitou o uso de dados de crianças e adolescentes para treinamento de IA de plataformas estrangeiras.",
        alinhamento: "Garantista e Pró-Regulação",
        termometroSoberania: 78,
        projetosLiderados: ["Guia Orientativo de Inteligência Artificial e Dados Pessoais", "Fiscalização de Biometria e Reconhecimento Facial"],
        posicionamento: "Rigoroso na defesa da autodeterminação informativa dos cidadãos. Resiste ao afrouxamento regulatório pleiteado por associações de Big Techs.",
        pontosDePressao: "Acionar mediante representações populares com dossiês de violações algorítmicas nas periferias."
      },
      {
        id: "pes-06",
        nome: "Deputada Federal Camila Guimarães",
        cargo: "Presidente da Frente Parlamentar pela Soberania Digital",
        instituicaoId: "inst-frente",
        foto: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80",
        origem: "parlamentar",
        comoChegouLa: "Eleita com expressiva votação nas periferias e movimentos de trabalhadores por aplicativo. Autora do PL que estabelece regras de auditoria pública para algoritmos estatais.",
        alinhamento: "Soberanista e Trabalhista",
        termometroSoberania: 94,
        projetosLiderados: ["PL 4218/2025 (Marco da Soberania de Dados)", "Emendas de Bancada para Telecentros Populares", "CPI da Dependência Tecnológica"],
        posicionamento: "Apresenta a soberania digital não como pauta de elite técnica, mas como questão de soberania alimentar, trabalho digno e soberania nacional.",
        pontosDePressao: "Articulação contínua para audiências públicas e denúncia orçamentária no Congresso Nacional."
      }
    ],

    conexoes: [
      { de: "pes-01", para: "inst-mgi", tipo: "direcao", rotulo: "Secretário Executivo" },
      { de: "pes-02", para: "inst-serpro", tipo: "lideranca", rotulo: "Presidente" },
      { de: "pes-03", para: "inst-dataprev", tipo: "porta_giratoria", rotulo: "Diretor (Ex-Big Tech)" },
      { de: "pes-04", para: "inst-sgpr", tipo: "representacao", rotulo: "Secretária de Base" },
      { de: "pes-05", para: "inst-anpd", tipo: "conselho", rotulo: "Conselheiro Relator" },
      { de: "pes-06", para: "inst-frente", tipo: "parlamentar", rotulo: "Presidente da Frente" },
      { de: "inst-mgi", para: "inst-serpro", tipo: "tutela", rotulo: "Supervisão e Compras" },
      { de: "inst-mgi", para: "inst-dataprev", tipo: "tutela", rotulo: "Supervisão Operacional" },
      { de: "inst-sgpr", para: "inst-mgi", tipo: "articulacao", rotulo: "Diálogo de Políticas" },
      { de: "inst-tcu", para: "inst-mgi", tipo: "auditoria", rotulo: "Fiscalização Orçamentária" },
      { de: "inst-frente", para: "inst-anpd", tipo: "legislativo", rotulo: "Controle e Audiências" }
    ]
  },

  // 3. Orçamento e Mapeamento de Gastos (Elemento 40)
  orcamento: {
    serieHistoricaElemento40: [
      { ano: 2022, empenhado: 7.8, pago: 5.6 },
      { ano: 2023, empenhado: 8.4, pago: 6.2 },
      { ano: 2024, empenhado: 9.0, pago: 6.3 },
      { ano: 2025, empenhado: 10.6, pago: 6.3 },
      { ano: 2026, empenhado: 9.5, pago: 6.0 } // Estimativa parcial
    ],
    nucleoEstrangeiro: {
      totalAssinado: 2780, // R$ milhões
      marcas: [
        { nome: "Microsoft", valor: 1541.5, percentual: 55.4, logo: "MS", cor: "#00A4EF", tipo: "Sistemas Operacionais, M365 e Azure" },
        { nome: "Oracle", valor: 383.6, percentual: 13.8, logo: "ORC", cor: "#C74634", tipo: "Bancos de Dados e Licenças Enterprise" },
        { nome: "Dell", valor: 221.2, percentual: 8.0, logo: "DELL", cor: "#007DB8", tipo: "Servidores e Infraestrutura Física Proprietária" },
        { nome: "Red Hat (IBM)", valor: 209.4, percentual: 7.5, logo: "RH", cor: "#EE0000", tipo: "Distribuições Linux Corporativas e OpenShift" },
        { nome: "Lenovo", valor: 103.8, percentual: 3.7, logo: "LEN", cor: "#E2231A", tipo: "Parque Computacional e Hardware" },
        { nome: "Outras Marcas Globais", valor: 320.5, percentual: 11.6, logo: "ETC", cor: "#56615C", tipo: "Cisco, SAP, Adobe, AWS, Google" }
      ],
      canaisDistribuicao: [
        { canal: "Revendas e Terceiros Credenciados", pct: 78.1, explicacao: "Intermediários privados locais que repassam a maior parte dos royalties ao exterior" },
        { canal: "Subsidiárias Diretas das Fabricantes", pct: 20.3, explicacao: "Contratos assinados diretamente com as subsidiárias brasileiras das matrizes dos EUA" },
        { canal: "Integradores Públicos (Serpro/Dataprev)", pct: 1.6, explicacao: "Estatais públicas atuando como corretoras de licenças estrangeiras" }
      ],
      tipoGasto: [
        { tipo: "Licenças de Uso e Subscrições Anuais", pct: 72.0 },
        { tipo: "Suporte Especializado e Consultoria Externa", pct: 18.0 },
        { tipo: "Infraestrutura de Nuvem e Tráfego", pct: 10.0 }
      ]
    },
    // Simulador de "Custo de Oportunidade Social"
    equivalenciasSociais: [
      {
        referencia: "Contrato MGI-Microsoft (R$ 606,5 Milhões)",
        valor: 606500000,
        alternativas: [
          {
            item: "Bolsas de Mestrado e Doutorado em IA e Soberania Digital",
            quantidade: "12.635 bolsas",
            duracao: "2 anos completos de bolsa CNPq/Capes",
            impacto: "Formação de massa crítica nacional de pesquisadores da classe trabalhadora."
          },
          {
            item: "Financiamento de Cooperativas de TI e Software Livre",
            quantidade: "380 cooperativas",
            duracao: "Capitais-semente de R$ 1,6 milhão por cooperativa",
            impacto: "Criação de milhares de postos de trabalho cooperados nas periferias."
          },
          {
            item: "Internet Livre Comunitária em Escolas Rurais",
            quantidade: "4.200 escolas públicas",
            duracao: "Instalação de fibra/satélite soberano e manutenção garantida por 3 anos",
            impacto: "Rompe com o apagão de conectividade dos territórios populares."
          }
        ]
      },
      {
        referencia: "Gasto com Licenças Estrangeiras Identificadas (R$ 2,78 Bilhões)",
        valor: 2780000000,
        alternativas: [
          {
            item: "Parque Nacional de Supercomputação Popular",
            quantidade: "5 Supercomputadores Soberanos",
            duracao: "Implantação em universidades públicas do Norte, Nordeste e Periferias",
            impacto: "Autonomia completa de processamento para dados do SUS e Previdência."
          },
          {
            item: "Centros Comunitários de Tecnologia e Reparabilidade Popular",
            quantidade: "1.850 laboratórios comunitários",
            duracao: "Estruturação completa com oficinas de reciclagem de hardware e código aberto",
            impacto: "Acesso e letramento crítico para 2,5 milhões de jovens."
          }
        ]
      }
    ]
  },

  // 4. Projetos Públicos e Reformas Estruturais
  projetos: [
    {
      id: "PROJ-01",
      nome: "Nuvem Soberana de Governo",
      orgaoResponsavel: "SERPRO & MGI",
      lideranca: "Dra. Clarice Mendonça (Serpro)",
      orcamentoPrevisto: "R$ 450 Milhões (2025-2027)",
      statusGeral: "Em disputa política",
      descricao: "Plataforma de infraestrutura de nuvem pública nacional para hospedar sistemas críticos do Estado sem dependência de datacenters estrangeiros.",
      criterios: {
        temNorma: true,
        temNormaDetalhe: "Decreto 11.260 e Portaria SGD nº 412 estabelecem diretrizes preliminares.",
        temOrcamento: true,
        temOrcamentoDetalhe: "Linha específica no PPA e recursos próprios de investimento do Serpro.",
        temResponsavel: true,
        temResponsavelDetalhe: "Diretoria de Operações Estratégicas do Serpro.",
        temIndicador: false,
        temIndicadorDetalhe: "Falta meta pública de percentual mínimo de dados críticos a serem migrados anualmente.",
        temControleSocial: false,
        temControleSocialDetalhe: "Nenhum assento para movimentos sociais, academia ou sindicatos de TI no comitê gestor."
      },
      posicaoEixo4: "Apoiar a expansão orçamentária da Nuvem Soberana e exigir a criação imediata de Conselho de Controle Social com poder deliberativo."
    },
    {
      id: "PROJ-02",
      nome: "Política Nacional de Cooperativismo de Plataforma",
      orgaoResponsavel: "Secretaria-Geral da Presidência & Ministério do Trabalho",
      lideranca: "Juliana Kaingang (SG-PR)",
      orcamentoPrevisto: "R$ 80 Milhões (Fundo de Amparo ao Trabalhador - FAT)",
      statusGeral: "Em fase de consulta pública",
      descricao: "Linhas de crédito público, marco legal de incentivo e infraestrutura técnica de código aberto para cooperativas de entrega e mobilidade geridas por trabalhadores.",
      criterios: {
        temNorma: false,
        temNormaDetalhe: "Minuta de Projeto de Lei construída em mesas de diálogo; aguarda envio ao Congresso.",
        temOrcamento: true,
        temOrcamentoDetalhe: "Proposta de alocação de R$ 80 mi do FAT e BNDES Solidário.",
        temResponsavel: true,
        temResponsavelDetalhe: "Secretaria Nacional de Economia Popular e Solidária (MTE).",
        temIndicador: true,
        temIndicadorDetalhe: "Meta de apoiar 100 cooperativas e formalizar 35 mil entregadores em 2 anos.",
        temControleSocial: true,
        temControleSocialDetalhe: "Comitê paritário com sindicatos de entregadores, cooperativas e pesquisadores."
      },
      posicaoEixo4: "Prioridade absoluta de mobilização popular. Pressionar a Casa Civil para envio imediato da minuta ao Parlamento."
    },
    {
      id: "PROJ-03",
      nome: "Cadastro Único Soberano & Transparência Algorítmica",
      orgaoResponsavel: "MDS & DATAPREV",
      lideranca: "Carlos Eduardo Leite (Dataprev) / Sec. Nacional de Renda",
      orcamentoPrevisto: "R$ 180 Milhões anuais",
      statusGeral: "Risco de captura proprietária",
      descricao: "Gestão dos dados de 95 milhões de pessoas vulneráveis inscritas no CadÚnico e regras dos algoritmos de concessão e cancelamento do Bolsa Família.",
      criterios: {
        temNorma: true,
        temNormaDetalhe: "Lei Orgânica da Assistência Social (LOAS) e Decretos do MDS.",
        temOrcamento: true,
        temOrcamentoDetalhe: "Dotação permanente na Ação de Gestão do Cadastro Único.",
        temResponsavel: true,
        temResponsavelDetalhe: "Secretaria de Informação e Gestão de Dados do MDS.",
        temIndicador: true,
        temIndicadorDetalhe: "Índice de atualização cadastral e tempo médio de concessão.",
        temControleSocial: false,
        temControleSocialDetalhe: "O código dos algoritmos de pontuação e bloqueio é secreto e imune a auditoria da sociedade civil."
      },
      posicaoEixo4: "Exigir abertura das regras algorítmicas, auditoria externa contra viés discriminatório e proibição de uso de modelos fechados de Big Techs sobre dados do CadÚnico."
    },
    {
      id: "PROJ-04",
      nome: "SuperApp 'Meu SUS Digital' Livre e Descentralizado",
      orgaoResponsavel: "Ministério da Saúde · DATASUS",
      lideranca: "Secretaria de Saúde Digital (SEIDIGI / MS)",
      orcamentoPrevisto: "R$ 120 Milhões",
      statusGeral: "Em desenvolvimento com avanços",
      descricao: "Plataforma móvel nacional para agendamento de consultas, vacinação e histórico clínico de saúde, garantindo sigilo biomédico sem monetização.",
      criterios: {
        temNorma: true,
        temNormaDetalhe: "Estratégia de Saúde Digital para o Brasil 2020-2028.",
        temOrcamento: true,
        temOrcamentoDetalhe: "Recursos do Fundo Nacional de Saúde.",
        temResponsavel: true,
        temResponsavelDetalhe: "DATASUS / SEIDIGI.",
        temIndicador: true,
        temIndicadorDetalhe: "Número de cidadãos ativos com prontuário interoperável.",
        temControleSocial: true,
        temControleSocialDetalhe: "Acompanhamento do Conselho Nacional de Saúde (CNS)."
      },
      posicaoEixo4: "Defender o projeto e impedir a terceirização do banco de dados genéticos e médicos para laboratórios e plataformas transnacionais."
    }
  ],

  // 5. Mapeamento de Chamadas e Consultas Públicas (Orçamento & Tech)
  consultasPublicas: [
    {
      id: "CP-FED-2026-012",
      tipo: "consulta_publica",
      categoria: "orcamento",
      titulo: "Consulta Pública do Orçamento Federal · Prioridades em Tecnologia, Infraestrutura Soberana e Fim da Dependência",
      orgao: "Ministério do Planejamento e Orçamento (MPO) & SG-PR",
      esfera: "federal",
      plataforma: "Brasil Participativo",
      prazoFim: "2026-12-18",
      diasRestantes: 14,
      status: "aberta",
      recursoEmDisputa: "R$ 4,5 Bilhões no PPA e PLOA",
      resumo: "Consulta que colhe propostas da sociedade civil para a elaboração das metas orçamentárias de tecnologia da União. Oportunidade de carimbar verbas para a Nuvem Pública Nacional e barrar renovações automáticas com Big Techs.",
      porQueImporta: "Se os movimentos populares não votarem em peso nesta consulta, as associações empresariais de software proprietário dominam as prioridades orçamentárias e capturam o dinheiro público.",
      posicaoEixo4: "Mobilizar votação massiva pela proposta nº 48: 'Criação do Fundo Nacional de Fomento ao Software Livre e Nuvem Soberana de Governo com 20% do orçamento do Elemento 40'.",
      kitParticipacao: {
        propostaTexto: "Proposta: Destinar 20% de todo o gasto federal do Elemento 40 (Serviços de TI) para o desenvolvimento de infraestrutura pública soberana, cooperativas de tecnologia da classe trabalhadora e centros comunitários de formação técnica nos territórios populares.",
        justificativa: "A União gasta mais de R$ 10,6 bilhões anuais em serviços de TI, drenando bilhões para multinacionais estrangeiras em licenças temporárias. A criação de infraestrutura soberana própria garante autonomia geopolítica, segurança de dados do povo e geração de trabalho e renda no Brasil."
      }
    },
    {
      id: "CHAM-FED-2026-008",
      tipo: "chamada_fomento",
      categoria: "fomento_cooperativas",
      titulo: "Chamada Pública FINEP/MTE nº 08/2026 · Tecnologias Sociais e Cooperativismo de Plataforma",
      orgao: "FINEP & Ministério do Trabalho e Emprego (MTE)",
      esfera: "federal",
      plataforma: "Portal FINEP / FNDCT",
      prazoFim: "2026-12-05",
      diasRestantes: 6,
      status: "urgente",
      recursoEmDisputa: "R$ 85.000.000 (Fundo Perdido)",
      resumo: "Edital nacional de subvenção econômica para financiar o desenvolvimento, escala e implantação de plataformas digitais geridas por cooperativas de trabalhadores em mobilidade urbana, entregas e serviços de cuidado.",
      porQueImporta: "É a vitória direta da luta travada no Eixo 4! Pela primeira vez o Estado abre R$ 85 milhões a fundo perdido para cooperativas que concorrem contra iFood e Uber.",
      posicaoEixo4: "Articular os coletivos do Eixo 2 e do Eixo 3 para apresentar consórcios com sindicatos de base, inscrevendo propostas robustas antes do fechamento do prazo.",
      kitParticipacao: {
        propostaTexto: "Apoio a Consórcios Autogestionários de Plataforma: modelo que integra tecnologia de código aberto livre (AGPL), retaguarda técnica comunitária e participação direta dos trabalhadores nas decisões algorítmicas.",
        justificativa: "Alternativa concreta à uberização e à precarização algorítmica, valorizando o trabalho de quem entrega e transporta o país."
      }
    },
    {
      id: "CP-FED-2026-035",
      tipo: "consulta_publica",
      categoria: "regulacao_ia",
      titulo: "Consulta Pública ANPD nº 03/2026 · Regras de Auditoria Algorítmica e Proibição de Biometria Preditiva na Segurança",
      orgao: "Autoridade Nacional de Proteção de Dados (ANPD)",
      esfera: "federal",
      plataforma: "Participa + Brasil",
      prazoFim: "2026-12-22",
      diasRestantes: 18,
      status: "aberta",
      recursoEmDisputa: "Regulação Vinculante Nacional",
      resumo: "Colhe contribuições técnicas e populares sobre o regulamento obrigatório de auditoria de algoritmos utilizados pelo poder público e o banimento do reconhecimento facial na segurança pública.",
      porQueImporta: "As Big Techs e empresas de armas estão fazendo lobby pesado para autorizar o reconhecimento facial em massa nas ruas. O movimento precisa inundar a consulta com denúncias e evidências de prisões racistas ilegais.",
      posicaoEixo4: "Protocolar dossiê técnico unificado do Eixo 4 cobrando veto total ao uso de reconhecimento facial na segurança e obrigatoriedade de código aberto em sistemas de concessão de direitos sociais.",
      kitParticipacao: {
        propostaTexto: "Contribuição Técnica: Inserir artigo determinando que sistemas de decisão algorítmica utilizados pelo Estado em benefícios sociais, saúde e segurança pública tenham suas regras, bases de treinamento e taxas de erro plenamente abertas para auditoria independente da sociedade civil.",
        justificativa: "A opacidade algorítmica viola direitos fundamentais e aprofunda o racismo institucional contra jovens negros e populações periféricas."
      }
    },
    {
      id: "CHAM-FED-2026-015",
      tipo: "chamada_fomento",
      categoria: "infra_livre",
      titulo: "Chamada Pública CNPq/MCTI nº 15/2026 · Redes Comunitárias de Internet e Letramento Crítico",
      orgao: "CNPq & Ministério das Comunicações",
      esfera: "federal",
      plataforma: "Plataforma Carlos Chagas (CNPq)",
      prazoFim: "2026-12-30",
      diasRestantes: 26,
      status: "aberta",
      recursoEmDisputa: "R$ 42.000.000 em Bolsas e Custeio",
      resumo: "Financiamento de núcleos de extensão universitária e associações comunitárias para implantação de redes mesh abertas e telecentros solares autônomos em territórios periféricos e rurais.",
      porQueImporta: "Garante recursos para pagar bolsas de pesquisa a estudantes e militantes que atuam diretamente no Eixo 3 montando laboratórios nas Cozinhas Solidárias e ocupações.",
      posicaoEixo4: "Conectar universidades públicas parceiras aos territórios do movimento para submissão conjunta de projetos de extensão tecnológica.",
      kitParticipacao: {
        propostaTexto: "Projeto em Rede: Criação de Laboratórios de Soberania Digital Comunitária com reciclagem de computadores, oficinas de software livre e servidores locais federados.",
        justificativa: "Conecta a juventude periférica com autonomia técnica, superando o modelo precarizado do zero-rating comercial."
      }
    },
    {
      id: "CP-EST-SP-2026-004",
      tipo: "consulta_publica",
      categoria: "orcamento",
      titulo: "Audiência e Consulta Pública ALESP · Emendas Populares à Lei Orçamentária Anual de SP (LOA 2027)",
      orgao: "Assembleia Legislativa de São Paulo (ALESP)",
      esfera: "estadual",
      plataforma: "Portal da ALESP",
      prazoFim: "2026-12-10",
      diasRestantes: 7,
      status: "urgente",
      recursoEmDisputa: "R$ 120 Milhões em Emendas de Bancada",
      resumo: "Espaço aberto para que movimentos sociais e cidadãos proponham destinação de emendas parlamentares para projetos de inclusão digital e fomento a cooperativas em municípios paulistas.",
      porQueImporta: "Disputa territorial direta: exigir que o governo de SP remaneje verbas de compra de licenças proprietárias para telecentros e capacitação técnica nas quebradas.",
      posicaoEixo4: "Articular as bancadas progressistas e movimentos de moradia para protocolar bloco de emendas prioritárias do Eixo 4.",
      kitParticipacao: {
        propostaTexto: "Emenda Orçamentária: Criação do Programa Paulista de Infraestrutura Digital Comunitária e Apoio ao Cooperativismo de Tecnologia nas Zonas Leste, Sul e Baixada Santista.",
        justificativa: "Mais de 30% das famílias das periferias paulistas não possuem banda larga fixa de qualidade, dependendo exclusivamente de pacotes móveis restritivos."
      }
    },
    {
      id: "CP-MUN-REC-2026-002",
      tipo: "consulta_publica",
      categoria: "fomento_cooperativas",
      titulo: "Consulta Pública Municipal · Minuta do Decreto de Plataforma Pública de Entregas Solidárias do Recife",
      orgao: "Prefeitura do Recife · Secretaria de Desenvolvimento Econômico e EMPREL",
      esfera: "municipal",
      plataforma: "Conecta Recife / Participação",
      prazoFim: "2026-12-14",
      diasRestantes: 10,
      status: "aberta",
      recursoEmDisputa: "R$ 15 Milhões em Investimento Direto",
      resumo: "Minuta de decreto municipal que institui a plataforma pública aberta e gratuita para intermediar pedidos de pequenos restaurantes e cooperativas de entregadores locais.",
      porQueImporta: "Pode se tornar o primeiro precedente municipal do Brasil de uma plataforma pública anti-uberização em grande capital nordestina.",
      posicaoEixo4: "Incentivar entregadores organizados e sindicatos a apoiarem o decreto, exigindo que o comitê de governança seja 50% composto pelos próprios trabalhadores.",
      kitParticipacao: {
        propostaTexto: "Adição ao Artigo 5º: Garantir que a plataforma municipal forneça pontos de descanso, apoio jurídico e que a gestão algorítmica de filas e rotas seja totalmente transparente e auditada pelos entregadores.",
        justificativa: "A tecnologia pública deve libertar o trabalhador da tirania dos algoritmos punitivos das multinacionais de delivery."
      }
    }
  ]
};

// Exportar globalmente para os outros scripts
window.OBSERVATORIO_DATA = OBSERVATORIO_DATA;

