/**
 * Base de Dados Consolidada do Observatório do Eixo 4
 * Movimento pela Soberania Digital Popular
 * 
 * SINALIZAÇÃO DE DADOS:
 * - 'real': Dados oficiais comprovados (SIOP, Contratos.gov.br, Compras.gov.br, PNCP, Balanço Serpro, Acórdão TCU 1380/2026).
 * - 'simulacao': Estimativas metodológicas, cenários e modelos teóricos (TCO 5 anos, simulações pedagógicas de custo de oportunidade).
 * - 'a-levantar': Lacunas estruturais a serem preenchidas via Lei de Acesso à Informação (LAI) e grupos de trabalho.
 */

const OBSERVATORIO_DATA = {
  // Metadados gerais
  meta: {
    titulo: "Soberania em Dados · Observatório do Eixo 4",
    lema: "Tecnologia não é neutra: ou serve ao capital, ou constrói o poder popular.",
    atualizadoEm: "Novembro de 2026",
    versao: "Protótipo 2.0 - Interface Visual e Dados Oficiais Consolidados",
    totalOrcamentoTI: 10605000000, // R$ 10,61 bi empenhados em 2025 (Elemento 40)
    totalPagoTI: 7750400000, // R$ 7,75 bi pagos em 2025
    totalMarcasEstrangeiras: 2784700000, // R$ 2,78 bi identificados (2023-2026)
    estataisConcentracao: 46.5, // 46,5% do Elemento 40 vai para Serpro e Dataprev sem abertura de repasse
    contratosSemMarcaPct: 70.2, // 70,2% dos contratos de TI não informam marca (79,5% do valor)
    tipoDado: "real",
    fonte: "SIOP / Compras.gov.br / Contratos.gov.br / TCU Acórdão 1380/2026 (Consulta em 05/11/2026)"
  },

  // 1. Orçamento e Mapeamento de Gastos (Elemento 40 + Mapa do Dinheiro)
  orcamento: {
    // Série Histórica do Elemento de Despesa 40 (Serviços de TI - União, três Poderes)
    serieHistoricaElemento40: [
      { ano: 2022, empenhado: 8.43, pago: 5.62, tipoDado: 'real', fonte: 'SIOP / LOA 2022' },
      { ano: 2023, empenhado: 9.48, pago: 6.33, tipoDado: 'real', fonte: 'SIOP / LOA 2023' },
      { ano: 2024, empenhado: 9.03, pago: 6.19, tipoDado: 'real', fonte: 'SIOP / LOA 2024' },
      { ano: 2025, empenhado: 10.61, pago: 7.75, tipoDado: 'real', fonte: 'SIOP / LOA 2025' },
      { ano: '2026*', empenhado: 10.14, pago: 6.32, parcial: true, tipoDado: 'real', fonte: 'SIOP (parcial até 05/11/2026)' }
    ],

    // Núcleo de Marcas Estrangeiras Identificadas (Piso Mínimo Comprovado: R$ 2,78 Bi de 2023 a 2026)
    pisoPorAno: [
      { ano: 2023, valor: 602.0, tipoDado: 'real', nota: 'Valor assinado no ano' },
      { ano: 2024, valor: 588.1, tipoDado: 'real', nota: 'Valor assinado no ano' },
      { ano: 2025, valor: 1191.4, tipoDado: 'real', nota: 'Salto devido ao contrato MGI-Brasoftware (Microsoft) de R$ 606,5 Mi até 2029' },
      { ano: '2026*', valor: 403.2, parcial: true, tipoDado: 'real', nota: 'Valor assinado parcial até novembro/2026' }
    ],

    nucleoEstrangeiro: {
      totalAssinado: 2784.7, // R$ milhões
      tipoDado: 'real',
      fonte: 'Contratos.gov.br e Compras.gov.br (19.688 contratos analisados)',
      marcas: [
        { nome: "Microsoft", valor: 1541.5, percentual: 55.4, logo: "MS", cor: "#00A4EF", tipo: "Sistemas Operacionais, M365 e Azure", tipoDado: 'real' },
        { nome: "Oracle", valor: 383.6, percentual: 13.8, logo: "ORC", cor: "#C74634", tipo: "Bancos de Dados e Licenças Enterprise", tipoDado: 'real' },
        { nome: "Dell", valor: 221.2, percentual: 8.0, logo: "DELL", cor: "#007DB8", tipo: "Servidores e Infraestrutura Física Proprietária", tipoDado: 'real' },
        { nome: "Red Hat (IBM)", valor: 209.4, percentual: 7.5, logo: "RH", cor: "#EE0000", tipo: "Distribuições Linux Corporativas e OpenShift", tipoDado: 'real' },
        { nome: "Lenovo", valor: 103.8, percentual: 3.7, logo: "LEN", cor: "#E2231A", tipo: "Parque Computacional e Hardware", tipoDado: 'real' },
        { nome: "Outras Marcas Globais", valor: 320.5, percentual: 11.6, logo: "ETC", cor: "#56615C", tipo: "Cisco, SAP, Adobe, AWS, Google", tipoDado: 'real' }
      ],
      canaisDistribuicao: [
        { canal: "Revendas e Outras Terceiras", valorMi: 2175.9, pct: 78.1, contratos: 945, explicacao: "Empresas intermediárias credenciadas que repassam a maior parte dos royalties das licenças ao exterior", tipoDado: 'real' },
        { canal: "Subsidiárias Diretas das Fabricantes", valorMi: 566.5, pct: 20.3, contratos: 340, explicacao: "Filiais brasileiras diretas das matrizes transnacionais (Dell, Oracle, etc.)", tipoDado: 'real' },
        { canal: "Integradores Públicos (Serpro/Dataprev)", valorMi: 42.2, pct: 1.5, contratos: 26, explicacao: "Estatais de TI atuando como intermediadoras de tecnologia proprietária", tipoDado: 'real' }
      ]
    },

    // 10 Maiores Fornecedores do Núcleo Estrangeiro (Dados Reais Extraídos da Base)
    topFornecedores: [
      {
            "codigo": "57142978",
            "nome": "BRASOFTWARE INFORMATICA LTDA",
            "contratos": 89,
            "valorGlobal": 1037162987.0,
            "percentual": 37.25
      },
      {
            "codigo": "19877285",
            "nome": "LANLINK SOLUCOES E COMERCIALIZACAO EM INFORMATICA S/A",
            "contratos": 38,
            "valorGlobal": 284058068.0,
            "percentual": 10.2
      },
      {
            "codigo": "72381189",
            "nome": "DELL COMPUTADORES DO BRASIL LTDA",
            "contratos": 168,
            "valorGlobal": 211549513.7,
            "percentual": 7.6
      },
      {
            "codigo": "59456277",
            "nome": "ORACLE DO BRASIL SISTEMAS LTDA",
            "contratos": 56,
            "valorGlobal": 193704260.7,
            "percentual": 6.96
      },
      {
            "codigo": "21547011",
            "nome": "ALLTECH - SOLUCOES EM TECNOLOGIA LTDA",
            "contratos": 19,
            "valorGlobal": 143876690.0,
            "percentual": 5.17
      },
      {
            "codigo": "02558157",
            "nome": "TELEFONICA BRASIL S.A.",
            "contratos": 19,
            "valorGlobal": 122197123.7,
            "percentual": 4.39
      },
      {
            "codigo": "07275920",
            "nome": "LENOVO TECNOLOGIA (BRASIL) LIMITADA",
            "contratos": 48,
            "valorGlobal": 100839533.1,
            "percentual": 3.62
      },
      {
            "codigo": "03263975",
            "nome": "SYSTECH SISTEMAS E TECNOLOGIA EM INFORMATICA LTDA",
            "contratos": 9,
            "valorGlobal": 57736804.0,
            "percentual": 2.07
      },
      {
            "codigo": "73514382",
            "nome": "2R DATATEL TELEINFORMATICA LTDA",
            "contratos": 6,
            "valorGlobal": 33906414.0,
            "percentual": 1.22
      },
      {
            "codigo": "94316916",
            "nome": "LTA-RH INFORMATICA, COMERCIO, REPRESENTACOES LTDA",
            "contratos": 4,
            "valorGlobal": 31268460.0,
            "percentual": 1.12
      }
],

    // 10 Órgãos Federais que Mais Contratam Tecnologia Estrangeira (Dados Reais Extraídos da Base)
    topOrgaos: [
      {
            "codigo": "48002",
            "nome": "MINISTÉRIO DA GESTÃO E INOVAÇÃO EM SERVIÇOS PÚBLICOS - MGI",
            "contratos": 2,
            "valorGlobal": 622129188.8,
            "percentual": 22.34
      },
      {
            "codigo": "14000",
            "nome": "JUSTICA ELEITORAL",
            "contratos": 180,
            "valorGlobal": 220999280.2,
            "percentual": 7.94
      },
      {
            "codigo": "15000",
            "nome": "JUSTICA DO TRABALHO",
            "contratos": 114,
            "valorGlobal": 195761584.8,
            "percentual": 7.03
      },
      {
            "codigo": "30000",
            "nome": "MINISTERIO DA JUSTICA E SEGURANCA PUBLICA",
            "contratos": 11,
            "valorGlobal": 146073112.3,
            "percentual": 5.25
      },
      {
            "codigo": "11000",
            "nome": "SUPERIOR TRIBUNAL DE JUSTICA",
            "contratos": 17,
            "valorGlobal": 131533525.6,
            "percentual": 4.72
      },
      {
            "codigo": "63000",
            "nome": "ADVOCACIA-GERAL DA UNIAO",
            "contratos": 5,
            "valorGlobal": 125715846.3,
            "percentual": 4.51
      },
      {
            "codigo": "40000",
            "nome": "MINISTERIO DO TRABALHO E PREVIDENCIA",
            "contratos": 3,
            "valorGlobal": 107274175.8,
            "percentual": 3.85
      },
      {
            "codigo": "30108",
            "nome": "POLICIA FEDERAL/MJSP",
            "contratos": 38,
            "valorGlobal": 104046727.5,
            "percentual": 3.74
      },
      {
            "codigo": "41000",
            "nome": "MINISTERIO DAS COMUNICACOES",
            "contratos": 2,
            "valorGlobal": 100057717.8,
            "percentual": 3.59
      },
      {
            "codigo": "25205",
            "nome": "FUND.INST.BRASILEIRO DE GEOG.E ESTATISTICA",
            "contratos": 23,
            "valorGlobal": 74439592.79,
            "percentual": 2.67
      }
],

    // Os 20 Maiores Contratos do Núcleo Estrangeiro (Dados Reais Extraídos da Base)
    maioresContratos: [
      {
            "id": "403698",
            "ano": 2025,
            "orgao": "MINISTÉRIO DA GESTÃO E INOVAÇÃO EM SERVIÇOS PÚBLICOS - MGI",
            "fornecedor": "BRASOFTWARE INFORMATICA LTDA",
            "marcas": "Microsoft",
            "objeto": "O OBJETO DO PRESENTE INSTRUMENTO É A CONTRATAÇÃO DE EMPRESA ESPECIALIZADA PARA O FORNECIMENTO DE LICENÇAS DE SOFTWARES, APLICATIVOS E SISTEMAS OPERACIONAIS MICR",
            "valorGlobal": 606451766.4,
            "conferir": null
      },
      {
            "id": "329402",
            "ano": 2024,
            "orgao": "JUSTICA DO TRABALHO",
            "fornecedor": "DELL COMPUTADORES DO BRASIL LTDA",
            "marcas": "Dell",
            "objeto": "SUPORTE TÉCNICO PARA O SOFTWARE GERENCIADOR DA BACKUP DELL NETWORKER",
            "valorGlobal": 106907460.0,
            "conferir": "Valor alto para o objeto: conferir no contrato"
      },
      {
            "id": "843312",
            "ano": 2026,
            "orgao": "MINISTERIO DA JUSTICA E SEGURANCA PUBLICA",
            "fornecedor": "LANLINK SOLUCOES E COMERCIALIZACAO EM INFORMATICA S/A",
            "marcas": "Microsoft;Oracle",
            "objeto": "O OBJETO DO PRESENTE INSTRUMENTO É A CONTRATAÇÃO DE SERVIÇOS DE COMPUTAÇÃO EM NUVEM DOS PROVEDORES MICROSOFT AZURE E ORACLE CLOUD INFRAESTRUCTURE NO MODELO NUVE",
            "valorGlobal": 105198452.6,
            "conferir": null
      },
      {
            "id": "431150",
            "ano": 2025,
            "orgao": "MINISTERIO DO TRABALHO E PREVIDENCIA",
            "fornecedor": "BRASOFTWARE INFORMATICA LTDA",
            "marcas": "Microsoft",
            "objeto": "CONTRATAÇÃO DE EMPRESA ESPECIALIZADA PARA O FORNECIMENTO DE LICENÇAS DE SOFTWARES, APLICATIVOS E SISTEMAS OPERACIONAIS MICROSOFT, DESTINADOS AOS USUÁRIOS FINAIS",
            "valorGlobal": 104990771.0,
            "conferir": null
      },
      {
            "id": "235012",
            "ano": 2023,
            "orgao": "MINISTERIO DAS COMUNICACOES",
            "fornecedor": "ALLTECH - SOLUCOES EM TECNOLOGIA LTDA",
            "marcas": "Red Hat",
            "objeto": "O PRESENTE CONTRATO TEM POR OBJETO A IMPLANTAÇÃO, SUPORTE E TREINAMENTO NAS SOLUÇÕES RED HAT E VEEAM, DE ACORDO COM AS ESPECIFICAÇÕES E CONDIÇÕES NO TERMO DE RE",
            "valorGlobal": 97055660.0,
            "conferir": "Valor global 5 vezes ou mais acima do inicial"
      },
      {
            "id": "794095",
            "ano": 2026,
            "orgao": "ADVOCACIA-GERAL DA UNIAO",
            "fornecedor": "LANLINK SOLUCOES E COMERCIALIZACAO EM INFORMATICA S/A",
            "marcas": "Microsoft",
            "objeto": "CONTRATAÇÃO DE SOLUÇÃO DE TECNOLOGIA DA INFORMAÇÃO E COMUNICAÇÃO DE FORNECIMENTO DE SUBSCRIÇÃO DE LICENÇAS DE USO DE SOFTWARES DO TIPO SUÍTE DE ESCRITÓRIO E DE",
            "valorGlobal": 94537488.0,
            "conferir": null
      },
      {
            "id": "196671",
            "ano": 2023,
            "orgao": "JUSTICA ELEITORAL",
            "fornecedor": "ORACLE DO BRASIL SISTEMAS LTDA",
            "marcas": "Oracle",
            "objeto": "PRESTAÇÃO DE SERVIÇO DE PROCESSAMENTO DE BANCO DE DADOS ORACLE EM NÚVEM PRIVADA NA PLATAFORMA EXADATA CLOUD AT CUSTOMER EM DOIS EQUIPAMENTOS, SENDO UM X9M OU SU",
            "valorGlobal": 62236023.27,
            "conferir": null
      },
      {
            "id": "594321",
            "ano": 2025,
            "orgao": "SUPERIOR TRIBUNAL DE JUSTICA",
            "fornecedor": "BRASOFTWARE INFORMATICA LTDA",
            "marcas": "Microsoft",
            "objeto": "FORNECIMENTO DE USO DE LICENÇAS DE SOFTWARES MICROSOFT, NA MODALIDADE \"ENTERPRISE AGREEMENT FOR GOVERNMENT\" (EA) E \"ENTERPRISE AGREEMENT SUBSCRIPTION FOR GOVERN",
            "valorGlobal": 57394435.32,
            "conferir": null
      },
      {
            "id": "238220",
            "ano": 2023,
            "orgao": "EMPRESA BRASILEIRA DE SERVICOS HOSPITALARES",
            "fornecedor": "TELEFONICA BRASIL S.A.",
            "marcas": "Microsoft",
            "objeto": "CONTRATAÇÃO DE EMPRESA ESPECIALIZADA PARA PRESTAÇÃO DE SERVIÇO DE LICENCIAMENTO DE SOFTWARES MICROSOFT PARA SISTEMA OPERACIONAL CLIENTE E SERVIDOR, SOFTWARES DE",
            "valorGlobal": 42672047.35,
            "conferir": null
      },
      {
            "id": "451427",
            "ano": 2025,
            "orgao": "BANCO CENTRAL DO BRASIL-ORC.FISCAL/SEG.SOCIAL",
            "fornecedor": "SYSTECH SISTEMAS E TECNOLOGIA EM INFORMATICA LTDA",
            "marcas": "VMware/Broadcom",
            "objeto": "CONTRATAÇÃO DE SUBSCRIÇÕES VMWARE COM SERVIÇOS DE CONVERSÃO DE LICENCIAMENTO EM SUBSCRIÇÕES, RENOVAÇÃO DA SUBSCRIÇÃO TAM E DEFINIÇÃO DE PREÇOS PARA EVENTUAL CON",
            "valorGlobal": 34925000.0,
            "conferir": null
      },
      {
            "id": "222116",
            "ano": 2023,
            "orgao": "SUPERIOR TRIBUNAL DE JUSTICA",
            "fornecedor": "LENOVO TECNOLOGIA (BRASIL) LIMITADA",
            "marcas": "Lenovo",
            "objeto": "FORNECIMENTO DE ESTAÇÕES DE TRABALHO (MICROCOMPUTADOR, TECLADO, MOUSE) E MONITORES DE VÍDEO DE 23\" COM GARANTIA DE ASSISTÊNCIA TÉCNICA.",
            "valorGlobal": 30301442.0,
            "conferir": null
      },
      {
            "id": "318672",
            "ano": 2024,
            "orgao": "JUSTICA ELEITORAL",
            "fornecedor": "CHAIN TECNOLOGIA E SERVICOS LTDA",
            "marcas": "Red Hat",
            "objeto": "PRESTAÇÃO DE SERVIÇOS DE LICENÇA DE USO DE SOFTWARES, GERENCIAMENTO TÉCNICO, CONSULTORIA E CAPACITAÇÃO DA MARCA RED HAT, PELO PERÍODO DE 24 (VINTE E QUATRO) MES",
            "valorGlobal": 24168803.21,
            "conferir": null
      },
      {
            "id": "311218",
            "ano": 2024,
            "orgao": "POLICIA FEDERAL/MJSP",
            "fornecedor": "ORACLE DO BRASIL SISTEMAS LTDA",
            "marcas": "Oracle",
            "objeto": "CONTRATAÇÃO DE SERVIÇOS DE SOLUÇÃO ORACLE EXADATA DESTINADA A CONTER OS BANCOS DE DADOS ORACLE DAS APLICAÇÕES MAIS CRÍTICAS DA POLÍCIA FEDERAL. GEN2 EXADATA CLO",
            "valorGlobal": 20696212.79,
            "conferir": null
      },
      {
            "id": "268690",
            "ano": 2024,
            "orgao": "ADVOCACIA-GERAL DA UNIAO",
            "fornecedor": "TAREA GERENCIAMENTO LTDA",
            "marcas": "Oracle",
            "objeto": "PRESTAÇÃO DE SERVIÇOS DE SOLUÇÃO DE TECNOLOGIA DA INFORMAÇÃO E COMUNICAÇÃO DE SOLUÇÃO REDUNDANTE DE NUVEM PRIVADA ORACLE EXADATA CLOUD AT CUSTOMER (EXACC), NA V",
            "valorGlobal": 20320718.32,
            "conferir": null
      },
      {
            "id": "853708",
            "ano": 2026,
            "orgao": "POLICIA FEDERAL/MJSP",
            "fornecedor": "LENOVO TECNOLOGIA (BRASIL) LIMITADA",
            "marcas": "Lenovo",
            "objeto": "AQUISIÇÃO DE EQUIPAMENTOS DE INFORMÁTICA, NOTEBOOKS AVANÇADOS E DOCK STATION, NAS CONDIÇÕES ESTABELECIDAS NO TERMO DE REFERÊNCIA.",
            "valorGlobal": 20216494.0,
            "conferir": null
      },
      {
            "id": "219018",
            "ano": 2023,
            "orgao": "SUPERIOR TRIBUNAL DE JUSTICA",
            "fornecedor": "ORACLE DO BRASIL SISTEMAS LTDA",
            "marcas": "Oracle",
            "objeto": "PRESTAÇÃO DE SERVIÇO CONTÍNUO DE BANCO DE DADOS ORACLE EXADATA COMO INFRAESTRUTURA, EM NUVEM PRIVADA, PARA APLICAÇÕES DE MISSÃO CRÍTICA DO CONTRATANTE, INCLUIND",
            "valorGlobal": 20030551.51,
            "conferir": null
      },
      {
            "id": "208193",
            "ano": 2023,
            "orgao": "CONTROLADORIA-GERAL DA UNIAO",
            "fornecedor": "BRASOFTWARE INFORMATICA LTDA",
            "marcas": "Microsoft",
            "objeto": "O OBJETO DO PRESENTE INSTRUMENTO É A CONTRATAÇÃO DE SUBSCRIÇÃO DE LICENÇAS DE USO DE SOFTWARES DO FABRICANTE MICROSOFT, PELA CONTROLADORIA-GERAL DA UNIÃO - CGU,",
            "valorGlobal": 19483776.0,
            "conferir": null
      },
      {
            "id": "825733",
            "ano": 2025,
            "orgao": "POLICIA FEDERAL/MJSP",
            "fornecedor": "DELL COMPUTADORES DO BRASIL LTDA",
            "marcas": "Dell",
            "objeto": "AQUISIÇÃO DE WORKSTATIONS DA DELL.",
            "valorGlobal": 19010340.0,
            "conferir": null
      },
      {
            "id": "238372",
            "ano": 2023,
            "orgao": "COMANDO DA AERONAUTICA",
            "fornecedor": "2R DATATEL TELEINFORMATICA LTDA",
            "marcas": "Palo Alto",
            "objeto": "SOLUÇÃO DE TECNOLOGIA DA INFORMAÇÃO DE\nSERVIÇOS DE SUPORTE PREMIUM PALO ALTO E LICENÇAS DE PREVENÇÃO DE MALWARE E FILTRO DE URL PARA ATUALIZAÇÃO DO SOFTWARE DO",
            "valorGlobal": 18989550.0,
            "conferir": null
      },
      {
            "id": "240589",
            "ano": 2023,
            "orgao": "AGENCIA NACIONAL DE AVIACAO CIVIL",
            "fornecedor": "TELEFONICA BRASIL S.A.",
            "marcas": "Microsoft",
            "objeto": "CONTRATAÇÃO DE SERVIÇOS DE LICENÇAS DE SOFTWARE E DIREITOS DE ATUALIZAÇÃO PARA PRODUTOS MICROSOFT UTILIZADOS EM ESTAÇÕES DE TRABALHO, EQUIPAMENTOS SERVIDORES E",
            "valorGlobal": 18483540.03,
            "conferir": null
      }
],

    // Simulação de Custo Total (TCO) em 5 anos para 1.000 usuários (Escritório e E-mail)
    tcoSimulacao5Anos: {
      tipoDado: 'simulacao',
      fonte: 'Nota Técnica do Eixo 4 · Estudo de Custo e Simulação TCO 5 Anos',
      avisoMetodologico: 'Esta é uma simulação com premissas do coletivo (sem inflação, perda de produtividade ou custos de treinamento. Supõe 1,5 técnico adicional e €300 de migração por usuário no open source). Não há dados contratuais observados de migração ampla no governo federal.',
      cenarios: [
        { nome: "Office E1 (Preço Pago)", valorMi: 2.16, detalhe: "Apenas web app, sem suíte instalada", cor: "#56615C", tipoDado: 'real' },
        { nome: "Office E3 (Melhor Preço Pago)", valorMi: 6.89, detalhe: "Menor valor encontrado em compras de grande porte", cor: "#1243A5", tipoDado: 'real' },
        { nome: "Open Source (Cenário Base Simulado)", valorMi: 7.11, faixaMin: 6.27, faixaMax: 8.95, detalhe: "Equipe própria dedicada + migração assistida", cor: "#C8322A", tipoDado: 'simulacao' },
        { nome: "Office E3 (Teto Oficial SGD/MGI)", valorMi: 8.33, detalhe: "Portaria SGD nº 412 / Catálogo de Padronização", cor: "#3B7B27", tipoDado: 'real' },
        { nome: "Google Workspace (Com Migração)", valorMi: 8.58, detalhe: "Tabela de mercado + serviços de transição", cor: "#ED8D1F", tipoDado: 'simulacao' },
        { nome: "Microsoft 365 E3 (Pago - Escopo Amplo)", valorMi: 10.78, detalhe: "Inclui suíte de segurança avançada e compliance", cor: "#1C1712", tipoDado: 'real' }
      ]
    },

    // Equivalências Sociais / Simulador de Custo de Oportunidade
    equivalenciasSociais: [
      {
        referencia: "Contrato MGI-Microsoft (R$ 606,5 Milhões - 2025 a 2029)",
        valor: 606500000,
        tipoDado: 'simulacao',
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
        valor: 2784700000,
        tipoDado: 'simulacao',
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

  // 2. Diagnóstico do Banco de Dados: O Que Já Temos vs. O Que Falta (#partida)
  diagnostico: {
    titulo: "Ponto de Partida: O que já temos e o que falta",
    subtitulo: "Para medir a dependência tecnológica, o banco precisa juntar cinco blocos: orçamento, contratos, capacidade instalada, atenção política e comparação com outros governos. Hoje temos só uma parte federal dos dois primeiros, e este diagnóstico organiza o resto.",
    tipoDado: 'real',
    fonte: "Plano de levantamento de dados: orçamento e dependência tecnológica (Docx oficial do Eixo 4)",
    maiorBuraco: {
      titulo: "O Maior Buraco da Conta Pública de TI",
      porcentagem: "46,5%",
      descricao: "46,5% de todos os empenhos do Elemento 40 (serviços de TI) nos arquivos oficiais vão para Serpro e Dataprev, sem que o poder público divulgue quanto desse montante é repassado a provedores estrangeiros como AWS, Google Cloud, Huawei e Oracle Cloud. A receita do Serpro MultiCloud saltou de R$ 41,4 milhões (2023) para R$ 370,4 milhões (2025) sem transparência de repasses ao exterior.",
      tipoDado: 'real'
    },
    blocos: [
      {
        id: "bloco-orcamento",
        nome: "1. Orçamento Federal (Sub-eixo 4.1)",
        temos: "Elemento de despesa 40 (2022–2026): R$ 10,6 bi empenhados em 2025 nos três Poderes, com divisão entre empenhado e pago.",
        mostra: "O tamanho da despesa formal com serviços de TI e o crescimento anual acelerado.",
        falta: "Série histórica anterior a 2022 (desde 2011), Elemento 52 (equipamentos/hardware), pessoal próprio e orçamento direto das empresas estatais.",
        situacao: "Temos parte (2022–2026)",
        fonte: "SIOP e Siga Brasil"
      },
      {
        id: "bloco-contratos",
        nome: "2. Contratos de TI (Sub-eixo 4.1)",
        temos: "19.688 contratos federais de TI (2023–2026) analisados; piso comprovado de R$ 2,78 bilhões com marcas globais identificadas.",
        mostra: "Quais empresas ganham as disputas e quem são as principais revendas intermediárias.",
        falta: "Informação de marca nos 70,2% dos contratos que não a declaram (e que concentram 79,5% do valor total!); valores efetivamente pagos e restos a pagar por contrato.",
        situacao: "Temos parte (Piso)",
        fonte: "Compras.gov.br e Contratos.gov.br"
      },
      {
        id: "bloco-estatais",
        nome: "3. Nuvem Estatal & Intermediação (Sub-eixo 4.2)",
        temos: "Boletim de Custeio (2022–2025) do Executivo e balanço de faturamento do Serpro MultiCloud (crescimento de R$ 41,4 mi para R$ 370,4 mi).",
        mostra: "Aceleração da adesão estatal a modelos de nuvem administrados pelo Serpro.",
        falta: "Auditoria de quanto Serpro e Dataprev repassam diretamente a AWS, Google, Huawei e Oracle sob o rótulo de 'nuvem de governo'.",
        situacao: "A levantar via LAI",
        fonte: "Balanço do Serpro / TCU Acórdão 1380/2026"
      },
      {
        id: "bloco-tco",
        nome: "4. Comparativo de Preços e TCO 5 Anos (Sub-eixo 4.1)",
        temos: "Cesta de simulação de escritório e colaboração para 1.000 usuários em 5 anos, comparando Office E1, E3, Google e Open Source.",
        mostra: "Que o open source não vence com clareza apenas no preço se houver necessidade de contratação de suporte e equipe externa.",
        falta: "Custos reais de migração e histórico operacional em órgãos públicos brasileiros de grande escala.",
        situacao: "Simulação inicial",
        fonte: "Nota Técnica / Tabelas Compras.gov.br"
      },
      {
        id: "bloco-alternativas",
        nome: "5. Mapa de Alternativas Nacionais (Sub-eixo 4.3)",
        temos: "Mapeamento de maturidade em 8 camadas (sistemas de gestão, nuvem estatal, nuvem privada, computadores, IA, escritório, banco de dados e SO).",
        mostra: "Que o Brasil possui sistemas públicos próprios fortes na ponta (SIAFI, SEI, Gov.br), mas importa quase toda a infraestrutura de base.",
        falta: "Métricas auditadas do percentual de conteúdo nacional efetivo em cada camada tecnológica.",
        situacao: "Mapeado conceitualmente",
        fonte: "Levantamento de Mercado / Cetic.br"
      }
    ],

    // Índice de Dependência Tecnológica do Estado (5 Dimensões)
    indiceDependencia: {
      nome: "Índice de Dependência Tecnológica do Estado",
      descricao: "Nota sintética de 0 a 100 por ente federativo e por ano, onde 100 representa dependência absoluta e 0 representa autonomia tecnológica popular plena.",
      formula: "Índice = (p1 × D1) + (p2 × D2) + (p3 × D3) + (p4 × D4) + (p5 × D5)",
      tipoDado: 'simulacao',
      dimensoes: [
        { id: "D1", nome: "Gasto com Tecnologia Estrangeira", peso: "20%", pergunta: "Quanto do orçamento identificado vai para empresas de matriz estrangeira?", calculo: "Valor de origem estrangeira ÷ Valor de origem identificada", statusHoje: "Calculável em parte (apenas União)" },
        { id: "D2", nome: "Camadas Críticas sem Alternativa", peso: "20%", pergunta: "Em quais camadas de infraestrutura falta alternativa nacional madura em uso?", calculo: "Média das notas de dependência das 8 camadas tecnológicas (0 a 100)", statusHoje: "Calculável com mapa de alternativas" },
        { id: "D3", nome: "Dados e Jurisdição Estrangeira", peso: "20%", pergunta: "Quanto dos sistemas críticos responde a operadores sujeitos ao CLOUD Act americano?", calculo: "Proporção de sistemas críticos hospedados sob leis estrangeiras", statusHoje: "A levantar via LAI" },
        { id: "D4", nome: "Capacidade Própria de Operação", peso: "20%", pergunta: "O Estado consegue manter e evoluir o sistema sem o fornecedor externo?", calculo: "Proporção de sistemas críticos sem código acessível e sem equipe pública", statusHoje: "A levantar via LAI e entrevistas" },
        { id: "D5", nome: "Saída e Concentração de Mercado", peso: "20%", pergunta: "Quão difícil é trocar de fornecedor e qual a dependência do dólar?", calculo: "Concentração dos 5 maiores fornecedores (67,2% hoje) + contratos indexados em dólar", statusHoje: "Calculável em parte no núcleo federal" }
      ],
      faixasProvisorias: [
        { faixa: "0 a 24", nivel: "Baixa Dependência", cor: "#21672A", descricao: "Sistemas soberanos e dados operados pelo Estado com código aberto auditado." },
        { faixa: "25 a 49", nivel: "Dependência Moderada", cor: "#ED8D1F", descricao: "Uso misto com governança estatal sobre fornecedores externos." },
        { faixa: "50 a 74", nivel: "Alta Dependência", cor: "#C8322A", descricao: "Núcleo crítico privatizado ou dependente de licenças de multinacionais." },
        { faixa: "75 a 100", nivel: "Dependência Crítica", cor: "#780000", descricao: "Aprisionamento tecnológico total (lock-in), evasão de divisas e soberania ameaçada." }
      ]
    },

    // Calendário de Trabalho e Entregas (Etapas da Ação Zero)
    calendario: [
      { data: "20 de Nov de 2026", titulo: "Organização das 8 Tabelas", desc: "Definição de responsáveis por bloco e migração da base atual para formato unificado." },
      { data: "30 de Nov de 2026", titulo: "Disparo de Pedidos de LAI", desc: "Envio dos requerimentos a Serpro, Dataprev e MGI; seleção dos 20 maiores compradores." },
      { data: "18 de Dez de 2026", titulo: "Consolidação Orçamentária", desc: "Fechamento da série federal desde 2011 e mapeamento de programas digitais no PPA." },
      { data: "31 de Jan de 2027", titulo: "Classificação e Recursos LAI", desc: "Análise de respostas, recursos de negativas e início do piloto em estados/capitais." },
      { data: "28 de Fev de 2027", titulo: "Cálculo do Índice e Revisão", desc: "Primeiro cálculo de teste do Índice de Dependência a tempo da etapa Custear da Ação Zero." }
    ],

    // Modelo Padrão de Pedido de LAI
    modeloLAI: {
      destinatarios: "SERPRO, DATAPREV e Secretaria de Governo Digital (SGD/MGI)",
      texto: "Com base na Lei nº 12.527/2011 (Lei de Acesso à Informação), solicita-se o fornecimento das seguintes informações relativas aos exercícios de 2023, 2024, 2025 e 2026:\n\n1. Discriminação dos valores anuais efetivamente pagos a cada provedor estrangeiro de serviços de computação em nuvem (em especial Amazon Web Services, Google Cloud, Microsoft Azure, Huawei e Oracle), decorrentes de contratos diretos ou de contratos de revenda (MultiCloud).\n2. Relação de todos os contratos e aditivos vigentes, informando número do processo, objeto, razão social do fornecedor, moeda de faturamento, prazo de vigência, valor global contratado e valor executado até a presente data.\n3. Percentual ou montante da receita auferida com a intermediação de serviços em nuvem (como o Serpro MultiCloud) que é efetivamente repassada aos provedores titulares da tecnologia estrangeira.\n4. Identificação dos países e jurisdições territoriais onde se encontram fisicamente armazenados os dados e onde é realizado o processamento das cargas de trabalho dos órgãos públicos clientes.\n5. Caso haja alegação de sigilo comercial ou estratégico sobre qualquer um dos itens, requer-se o fornecimento dos valores de forma agregada por ano e por categoria, acompanhado da indicação fundamentada do dispositivo legal que ampara a restrição de acesso."
    }
  },

  // 3. Mapa Mental Completo do Eixo 4 (Estruturado a partir do PDF 'Eixo 4 - Incidência no Estado.pdf')
  mapaMental: {
    id: "eixo4-raiz",
    titulo: "Eixo 4: Incidência no Estado e Lutar por Reformas Estruturais",
    subtitulo: "Articulação política, inteligência cívica e tradução popular do orçamento público de TI",
    tipo: "raiz",
    cor: "#1243A5",
    subeixos: [
      {
        numero: 1,
        id: "subeixo-1",
        titulo: "1. Orçamento, Despesas e Compras Públicas",
        sigla: "Orçamento & Compras",
        cor: "#1243A5",
        icone: "💰",
        questoesCentrais: [
          "Quanto o Estado gasta com tecnologias digitais?",
          "Quanto desse gasto vai para tecnologia sob controle estrangeiro? (> 50% concentrado na Microsoft)",
          "De que forma é feita essa contratação? Há transparência efetiva e auditoria popular?",
          "O que está previsto na Lei Orçamentária Anual (LOA) e no Plano Plurianual (PPA)?",
          "Como estão as definições das emendas parlamentares? Quais são os recursos e quem são os parlamentares?"
        ],
        projetosPrincipais: [
          { nome: "Monitoramento de Gastos e Investimentos Públicos em TI", status: "Em desenvolvimento contínuo" },
          { nome: "Monitoramento de Compras Públicas (Qual instrumento e quais editais priorizar?)", status: "Planejamento" }
        ],
        responsaveis: ["Hiana Camilla", "Thiago"],
        necessidadesOrganizacionais: [
          "Product Owner (PO) dedicado",
          "Cientista de dados para tratamento das bases do SIOP e Compras.gov",
          "Especialista em orçamento público e direito financeiro"
        ]
      },
      {
        numero: 2,
        id: "subeixo-2",
        titulo: "2. Instituições, Autarquias e Empresas Públicas",
        sigla: "Instituições & Estatais",
        cor: "#21672A",
        icone: "🏛️",
        questoesCentrais: [
          "Quais são as pastas governamentais que tratam do digital?",
          "Como essas secretarias, ministérios e estatais se relacionam entre si?",
          "Qual o papel do Serpro, Dataprev, Telebras e RNP na custódia dos dados soberanos?"
        ],
        projetosPrincipais: [
          { nome: "Árvore / Mapa Dinâmico do Quem-é-Quem do Digital", status: "Protótipo no Observatório" },
          { nome: "Observatório das Empresas Estatais de TI", status: "Fase de pesquisa" }
        ],
        responsaveis: ["GT Instituições / Aberto a colaboradores"],
        necessidadesOrganizacionais: [
          "Articulação com especialistas em privacidade e proteção de dados (LGPD)",
          "Mapeamento de relações de tutela e supervisão ministerial"
        ]
      },
      {
        numero: 3,
        id: "subeixo-3",
        titulo: "3. Participação Popular nas Políticas Digitais",
        sigla: "Participação & Conselhos",
        cor: "#C8322A",
        icone: "✊",
        questoesCentrais: [
          "Quais são as instâncias de participação social vigentes? Onde se localizam e como funcionam?",
          "Quem nos representa nesses conselhos e comitês?",
          "Como a participação se concretiza nas decisões reais sobre tecnologia pública?",
          "Como as políticas digitais contribuem para a soberania popular concreta dos territórios?"
        ],
        instanciasMapeadas: [
          "Conselho Nacional de Proteção de Dados Pessoais (CNPD)",
          "Conselho Nacional de Ciência e Tecnologia (CNCT)",
          "Conselho-Gestor do Fust (CGFUST)",
          "Comitê Interministerial para a Transformação Digital (CITDigital)",
          "Comitê Consultivo da Estratégia Nacional de Governo Digital",
          "Fórum Pix (Banco Central)",
          "Comitê Nacional de Cibersegurança (CNCiber)",
          "Comitê Central de Governança de Dados (CCGD)",
          "Comissão de Tecnologia, Inovação e Transf. Digital do CDESS (Conselhão)",
          "Conselho Nacional para Industrialização de Minerais Críticos e Estratégicos (CIMCE)",
          "Comitê Gestor da Internet no Brasil (CGI.br)"
        ],
        projetosPrincipais: [
          { nome: "Agentes Populares de Soberania Digital", status: "Projeto estruturante" }
        ],
        responsaveis: ["Hernán Efrón"],
        necessidadesOrganizacionais: [
          "Formação continuada de lideranças comunitárias para incidência em conselhos",
          "Articulação com bancadas populares e movimentos sociais de base"
        ]
      },
      {
        numero: 4,
        id: "subeixo-4",
        titulo: "4. Políticas Públicas, Normas e Legislações",
        sigla: "Normas & Legislação",
        cor: "#ED8D1F",
        icone: "📜",
        questoesCentrais: [
          "Quais são as leis e projetos de lei que tratam do digital vigentes? Qual a autoria de cada um?",
          "Como se dá o lobby das Big Techs e Mid Techs no Congresso e no Executivo? (ex: ALAI, Camara-e.net)",
          "Quais são outros instrumentos normativos? Planos, Estratégias, Portarias, Resoluções e Decretos",
          "Como categorizar as políticas digitais brasileiras?",
          "Quais políticas normativas podemos elaborar e propor para a soberania digital popular?"
        ],
        projetosPrincipais: [
          { nome: "Monitor de Políticas Digitais (Normas vigentes e Normas em tramitação)", status: "Em desenvolvimento" },
          { nome: "Monitor de Editais e Chamamentos Públicos", status: "Em desenvolvimento" }
        ],
        responsaveis: ["Marina Méraki", "Leopoldo Neto"],
        necessidadesOrganizacionais: [
          "Assessoria jurídica militante para elaboração de minutas de leis",
          "Acompanhamento diário da tramitação de projetos na Câmara e Senado"
        ]
      },
      {
        numero: 5,
        id: "subeixo-5",
        titulo: "5. Governança Multinível (Global-Local)",
        sigla: "Federativo & Internacional",
        cor: "#3B7B27",
        icone: "🌎",
        questoesCentrais: [
          "Como os demais sub-eixos se manifestam nos estados e nos 5.569 municípios brasileiros?",
          "Quais municípios (ex: cerca de 50 cidades com mais de 500 mil habitantes) podem ser pilotos-modelo e por quê?",
          "Quais entes subnacionais possuem empresas públicas de TI (ex: Prodam, Emprel, Prodemge, Coderp)?",
          "Como funciona a política externa digital brasileira? Quais são as parcerias bilaterais e multilaterais?",
          "Qual é o posicionamento do Itamaraty nos foros e instâncias internacionais de governança digital?",
          "Como estruturar um modelo transversal de análise que é escalável no eixo particular-universal?"
        ],
        projetosPrincipais: [
          { nome: "Monitor da Política Externa Digital", status: "Planejamento" },
          { nome: "Monitor dos Entes Federativos (Estados e Municípios Piloto)", status: "Planejamento" }
        ],
        responsaveis: ["Gleice Barros"],
        necessidadesOrganizacionais: [
          "Rede de correspondentes e articulação com movimentos regionais",
          "Acompanhamento das reuniões do G20, BRICS e foros da ONU"
        ]
      },
      {
        numero: 6,
        id: "subeixo-organizativo",
        titulo: "Organizativo: Diretrizes, Instrumentos e Integração",
        sigla: "Organizativo & Método",
        cor: "#1C1712",
        icone: "⚙️",
        questoesCentrais: [
          "Como garantir o rigor metodológico e a sustentação técnica do Eixo 4?",
          "Como integrar os dados do Eixo 4 com a comunicação de massa e a formação de base dos outros eixos?"
        ],
        diretrizesGerais: [
          "Rigor analítico: revisão humana rigorosa e revisão por pares em cada dado publicado",
          "Transparência radical nos dados: fontes abertas, reprodutibilidade e códigos públicos",
          "Privacidade e proteção de dados: respeito estrito à LGPD (dados de pessoas físicas fora da base)",
          "Explicação metodológica clara: tradução popular sem jargões inacessíveis",
          "Pedidos de LAI padronizados com acompanhamento e recursos sistemáticos",
          "Mapeamentos e visualizações táteis e de alto impacto público",
          "Transversalidade e matriz analítica articulada",
          "Advocacy combativo: presença em atos nas casas legislativas e posicionamentos públicos firmes"
        ],
        integracaoEixos: [
          { eixo: "Eixo 1 (Desmascarar Big Techs)", canal: "Boletins semanais", responsavel: "Jane" },
          { eixo: "Eixo 2 (Infraestrutura Autônoma)", canal: "Demandas técnicas e plataformas livres", responsavel: "Guilherme" },
          { eixo: "Eixo 3 (Educação Popular)", canal: "Oficinas territoriais e laboratórios cívicos", responsavel: "Articulação com territórios" }
        ],
        formacaoLetramento: ["Grupos de estudos contínuos", "Seminários temáticos abertos"],
        cienciaDados: ["Definição clara do que demandar das bases governamentais e raspagem ética"]
      }
    ]
  },

  // 4. Mapeamento de Licitações (Federal, Estadual, Municipal)
  licitacoes: [
    {
      id: "LIC-FED-2026-089",
      esfera: "federal",
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      impactoPopular: "Supera a armadilha do zero rating (onde a juventude só acessa redes fechadas comerciais).",
      propostaEixo4: "Mobilizar coletivos populares do estado para concorrer e assumir a gestão técnica da infraestrutura."
    },
    {
      id: "LIC-EST-CE-2026-088",
      esfera: "estadual",
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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

  // 5. Mapeamento de Instituições e Pessoas (Grafo)
  grafo: {
    tipoDado: 'simulacao',
    instituicoes: [
      { id: "inst-sgpr", nome: "Secretaria-Geral da Presidência (SG-PR)", sigla: "SG-PR", tipo: "presidencia", papel: "Articulação com movimentos populares, mesas de negociação e conselhos participativos.", orcamentoTotal: "R$ 480 Mi", cor: "#1243A5", tipoDado: 'real' },
      { id: "inst-mgi", nome: "Ministério da Gestão e da Inovação (MGI)", sigla: "MGI", tipo: "ministerio", papel: "Define compras públicas federais, governança digital e contratos corporativos de TI da União.", orcamentoTotal: "R$ 3,8 Bi em TI", cor: "#21672A", tipoDado: 'real' },
      { id: "inst-mcti", nome: "Min. da Ciência, Tecnologia e Inovação (MCTI)", sigla: "MCTI", tipo: "ministerio", papel: "Fomento à pesquisa científica nacional, centros de tecnologia e política de IA.", orcamentoTotal: "R$ 1,9 Bi em P&D", cor: "#21672A", tipoDado: 'real' },
      { id: "inst-serpro", nome: "SERPRO · Serviço Federal de Proc. de Dados", sigla: "SERPRO", tipo: "estatal", papel: "Maior estatal de TI da América Latina; opera IRPF, CNH, Compras.gov e Nuvem de Governo.", orcamentoTotal: "R$ 4,2 Bi faturamento", cor: "#1243A5", tipoDado: 'real' },
      { id: "inst-dataprev", nome: "DATAPREV · Tecnologia da Previdência Social", sigla: "DATAPREV", tipo: "estatal", papel: "Guarda e processa os dados sociais do Cadastro Único, Bolsa Família e INSS.", orcamentoTotal: "R$ 2,6 Bi faturamento", cor: "#1243A5", tipoDado: 'real' },
      { id: "inst-anpd", nome: "Autoridade Nacional de Proteção de Dados (ANPD)", sigla: "ANPD", tipo: "regulador", papel: "Fiscalização da LGPD, privacidade da população e punição de abusos de dados pelas Big Techs.", orcamentoTotal: "R$ 65 Mi", cor: "#C8322A", tipoDado: 'real' },
      { id: "inst-tcu", nome: "Tribunal de Contas da União (TCU)", sigla: "TCU", tipo: "controle", papel: "Auditoria de licitações milionárias de TI e fiscalização de dependência tecnológica estrangeira.", orcamentoTotal: "Órgão de Controle", cor: "#1C1712", tipoDado: 'real' },
      { id: "inst-frente", nome: "Frente Parlamentar pela Soberania Digital", sigla: "Congresso", tipo: "legislativo", papel: "Disputa de leis, regulação de IA, PL 4218/2025 e emendas orçamentárias.", orcamentoTotal: "Poder Legislativo", cor: "#ED8D1F", tipoDado: 'real' }
    ],
    pessoas: [
      { id: "pes-01", nome: "Rogério Santana de Almeida", cargo: "Secretário de Governo Digital (SGD / MGI)", instituicaoId: "inst-mgi", origem: "carreira_publica", comoChegouLa: "Especialista em Políticas Públicas e Gestão Governamental (EPPGG) de carreira desde 2004. Atuou em sucessivas gestões no planejamento do Portal Gov.br.", alinhamento: "Moderado / Institucional", termometroSoberania: 58, projetosLiderados: ["Gov.br", "Catálogo Eletrônico de Padronização de TI", "Contrato MGI-Microsoft (R$ 606 Mi)"], posicionamento: "Defende a modernização acelerada dos serviços digitais, mas aceita modelos híbridos com alta penetração de grandes nuvens estrangeiras.", pontosDePressao: "Cobrar a inclusão de cláusulas antimonopólio e fomento obrigatório a fornecedores nacionais.", tipoDado: 'simulacao' },
      { id: "pes-02", nome: "Dra. Clarice Mendonça Ramos", cargo: "Diretora-Presidente do SERPRO", instituicaoId: "inst-serpro", origem: "academia_movimento", comoChegouLa: "Professora titular de Ciência da Computação, ex-coordenadora de pesquisa e ativista histórica da comunidade de Software Livre.", alinhamento: "Soberanista Firme", termometroSoberania: 92, projetosLiderados: ["Nuvem Soberana de Governo", "Migração de Bancos de Dados para Código Aberto", "Laboratórios Cívicos Serpro"], posicionamento: "Defende a soberania do dado público, recusa o armazenamento de informações estratégicas de cidadãos em servidores sujeitos ao Cloud Act.", pontosDePressao: "Aliada prioritária do movimento. Apoiar suas iniciativas contra o lobby de revendas privadas.", tipoDado: 'simulacao' },
      { id: "pes-03", nome: "Carlos Eduardo Faria Leite", cargo: "Diretor de Tecnologia e Infraestrutura da DATAPREV", instituicaoId: "inst-dataprev", origem: "porta_giratoria", comoChegouLa: "Atuou durante 14 anos como Diretor de Soluções para Setor Público em multinacionais americanas de tecnologia.", alinhamento: "Pró-Mercado / Big Tech", termometroSoberania: 28, projetosLiderados: ["Nuvem Híbrida do INSS", "Terceirização de Clusters Previdenciários", "Contratos de Inexigibilidade de Banco de Dados"], posicionamento: "Advoga abertamente pela contratação de infraestrutura de Big Techs como a saída mais barata no curto prazo.", pontosDePressao: "Alvo de fiscalização popular e pedidos de LAI para investigar possíveis conflitos de interesse.", tipoDado: 'simulacao' },
      { id: "pes-04", nome: "Juliana Kaingang Nogueira", cargo: "Secretária de Políticas Digitais e Inclusão (SG-PR)", instituicaoId: "inst-sgpr", origem: "movimentos_sociais", comoChegouLa: "Liderança indígena, comunicadora popular e articuladora de redes comunitárias de telecomunicação na Amazônia e no Sul.", alinhamento: "Soberanista Popular", termometroSoberania: 96, projetosLiderados: ["Mesa Nacional de Cooperativismo de Plataforma", "Programa Internet das Cozinhas Solidárias", "Comitê de Participação Cívica Digital"], posicionamento: "Construção de poder popular a partir da base. A infraestrutura digital deve atender a quem cuida, trabalha e produz.", pontosDePressao: "Canal aberto para transformar as pautas do Eixo 4 em minutas executivas e audiências.", tipoDado: 'simulacao' },
      { id: "pes-05", nome: "Dr. Marcelo Toledo Vianna", cargo: "Conselheiro e Diretor de Fiscalização da ANPD", instituicaoId: "inst-anpd", origem: "carreira_publica", comoChegouLa: "Procurador federal de carreira, doutor em Direito Constitucional. Relator da resolução que limitou o uso de dados de menores por plataformas.", alinhamento: "Garantista e Pró-Regulação", termometroSoberania: 78, projetosLiderados: ["Guia Orientativo de Inteligência Artificial e Dados Pessoais", "Fiscalização de Biometria e Reconhecimento Facial"], posicionamento: "Rigoroso na defesa da autodeterminação informativa dos cidadãos. Resiste ao afrouxamento regulatório.", pontosDePressao: "Acionar mediante representações populares com dossiês de violações algorítmicas.", tipoDado: 'simulacao' },
      { id: "pes-06", nome: "Deputada Federal Camila Guimarães", cargo: "Presidente da Frente Parlamentar pela Soberania Digital", instituicaoId: "inst-frente", origem: "parlamentar", comoChegouLa: "Eleita nas periferias e movimentos de trabalhadores por aplicativo. Autora de emendas e projetos por transparência algorítmica.", alinhamento: "Soberanista e Trabalhista", termometroSoberania: 94, projetosLiderados: ["PL 4218/2025 (Marco da Soberania de Dados)", "Emendas de Bancada para Telecentros Populares", "CPI da Dependência Tecnológica"], posicionamento: "Apresenta a soberania digital como soberania alimentar, trabalho digno e soberania nacional.", pontosDePressao: "Articulação contínua para audiências públicas e denúncia orçamentária no Congresso.", tipoDado: 'simulacao' }
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

  // 6. Projetos Públicos e Reformas Estruturais
  projetos: [
    {
      id: "PROJ-01",
      nome: "Nuvem Soberana de Governo",
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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

  // 7. Mapeamento de Chamadas e Consultas Públicas
  consultasPublicas: [
    {
      id: "CP-FED-2026-012",
      tipo: "consulta_publica",
      categoria: "orcamento",
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
      tipoDado: "simulacao",
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
