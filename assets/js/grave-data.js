/**
 * GRAVE - Sistema de Certificados Comunitários
 * Dados fixos da organização GRAVE
 */

$(document).ready(function() {
    'use strict';

    // Dados fixos do GRAVE baseados nos certificados reais
    window.GRAVE_DATA = {
        organizacao: {
            nomeCompleto: 'GRAVE - Grupo de Resgate e Apoio Voluntário de Emergência',
            nomeExibicao: 'Grupo de Resgate e Apoio Voluntário de Emergência',
            sigla: 'GRAVE',
            cnpj: '12.827.677/0001-87',
            endereco: {
                cidade: 'Cachoeirinha',
                estado: 'RS',
                cidadeEstado: 'Cachoeirinha/RS'
            },
            responsaveis: {
                presidente: {
                    nome: 'Liane Wagner',
                    cargo: 'Presidente'
                },
                coordenadora: {
                    nome: 'Liane Wagner', 
                    cargo: 'Coordenadora Operacional'
                },
                instrutora: {
                    nome: 'Natielle da Silva de Ávila',
                    cargo: 'Instrutora'
                }
            },
            logo: {
                principal: '../assets/images/grave-logo.png',
                placeholder: '../assets/images/placeholders/grave-logo-placeholder.png'
            }
        },
        
        // Templates baseados nos certificados reais
        templates: {
            'grave-workshop': {
                id: 'grave-workshop',
                nome: 'GRAVE Workshop',
                descricao: 'Template para workshops e cursos básicos',
                categoria: 'workshop',
                layout: 'landscape',
                cores: {
                    fundo: '#FF3B3B', // Vermelho do GRAVE
                    texto: '#000000',
                    destaque: '#FF3B3B',
                    textoClaro: '#FFFFFF'
                },
                assinaturas: ['presidente', 'coordenadora'],
                textoBase: 'CERTIFICAMOS QUE {NOME}, INSCRITO SOB O CPF Nº {CPF} PARTICIPOU DO {EVENTO}, PROMOVIDO PELO GRAVE, {DATA}, {LOCAL}, FAZENDO TOTAL DE {HORAS} HORAS.',
                exemplo: {
                    participante: 'ANDREA CRISTINA RODRIGUES DA SILVA TIOSSI',
                    cpf: '078.592.669-03',
                    evento: 'WORKSHOP PRIMEIROS SOCORROS PARA TODOS',
                    data: '26 DE MARÇO DE 2025',
                    local: 'NA APAE CACHOEIRINHA',
                    horas: '4',
                    numero: '150425'
                }
            },
            
            'grave-curso': {
                id: 'grave-curso',
                nome: 'GRAVE Curso',
                descricao: 'Template para cursos avançados e especializações',
                categoria: 'curso',
                layout: 'landscape',
                cores: {
                    fundo: '#4A4A4A', // Cinza escuro como no segundo certificado
                    texto: '#000000',
                    destaque: '#FF3B3B',
                    textoClaro: '#FFFFFF'
                },
                assinaturas: ['presidente', 'instrutora', 'coordenadora'],
                textoBase: 'CERTIFICAMOS QUE {NOME}, INSCRITO SOB O CPF Nº {CPF} CONCLUIU COM FREQUÊNCIA DE 100% O {EVENTO}, PROMOVIDO PELO GRAVE, {DATA}, FAZENDO TOTAL DE {HORAS} HORAS.',
                exemplo: {
                    participante: 'TIAGO DE ABREU PACHECO',
                    cpf: '013.512.180-93',
                    evento: 'CURSO DE ATENDIMENTO PRÉ-HOSPITALAR',
                    data: 'NOS DIAS 24, 25, 31 DE MAIO E 01 DE JUNHO DE 2025',
                    horas: '48',
                    numero: '120625'
                }
            }
        },
        
        // Conteúdos programáticos padrão
        conteudosPadrao: {
            'primeiros-socorros': [
                'Conceitos e fundamentos de Primeiros Socorros',
                'Suporte Básico de Vida (SBV)',
                'Primeiros Socorros em Emergência Traumática',
                'Primeiros Socorros em Emergências Clínica'
            ],
            
            'aph': [
                'Noções de Anatomia',
                'Fraturas e Imobilizações',
                'Sinais Vitais',
                'Oficinas PCR, sinais vitais, maca, ked',
                'Segurança de cena e do Socorrista',
                'Fratura de extremidades',
                'Cinemática do Trauma',
                'Retirada de Capacete',
                'Avaliação primária e secundária',
                'Emergências Clínicas Hemorragia e Choque',
                'Parto Emergencial',
                'RCP / RCP afogamento',
                'Queimaduras Trauma',
                'Crânio Encefálico / Face',
                'Trauma Tórax e Abdome, TRM'
            ],
            
            'capacitacao-basica': [
                'Fundamentos do socorro',
                'Avaliação da vítima',
                'Posicionamento correto',
                'Técnicas básicas de imobilização',
                'Quando acionar ajuda especializada'
            ]
        },
        
        // Tipos de eventos comuns do GRAVE
        tiposEventos: {
            'workshop': {
                nome: 'Workshop',
                template: 'grave-workshop',
                cargaHorariaPadrao: 4,
                conteudoPadrao: 'primeiros-socorros',
                textoTipo: 'participou'
            },
            'curso': {
                nome: 'Curso',
                template: 'grave-curso', 
                cargaHorariaPadrao: 48,
                conteudoPadrao: 'aph',
                textoTipo: 'concluiu'
            },
            'treinamento': {
                nome: 'Treinamento',
                template: 'grave-workshop',
                cargaHorariaPadrao: 8,
                conteudoPadrao: 'primeiros-socorros',
                textoTipo: 'participou'
            },
            'capacitacao': {
                nome: 'Capacitação',
                template: 'grave-workshop',
                cargaHorariaPadrao: 16,
                conteudoPadrao: 'capacitacao-basica',
                textoTipo: 'participou'
            }
        }
    };

    // Função para obter dados da organização
    window.getGraveData = function() {
        return window.GRAVE_DATA.organizacao;
    };

    // Função para obter template por ID
    window.getGraveTemplate = function(templateId) {
        return window.GRAVE_DATA.templates[templateId] || null;
    };

    // Função para obter conteúdo programático padrão
    window.getConteudoPadrao = function(tipo) {
        return window.GRAVE_DATA.conteudosPadrao[tipo] || [];
    };

    // Função para obter dados de tipo de evento
    window.getTipoEvento = function(tipo) {
        return window.GRAVE_DATA.tiposEventos[tipo] || null;
    };

    // Função para formatar texto do certificado
    window.formatarTextoCertificado = function(template, dados) {
        let texto = template.textoBase;
        
        // Substituir placeholders
        texto = texto.replace('{NOME}', dados.participante.nome.toUpperCase());
        texto = texto.replace('{CPF}', dados.participante.cpf);
        texto = texto.replace('{EVENTO}', dados.evento.nome.toUpperCase());
        texto = texto.replace('{DATA}', dados.evento.dataFormatada);
        texto = texto.replace('{LOCAL}', dados.evento.local ? dados.evento.local.toUpperCase() : '');
        texto = texto.replace('{HORAS}', dados.evento.cargaHoraria);
        
        return texto;
    };

    // Função para aplicar dados do GRAVE ao storage
    window.aplicarDadosGrave = function() {
        const dadosGrave = {
            nomeOrganizacao: window.GRAVE_DATA.organizacao.nomeCompleto,
            siglaOrganizacao: window.GRAVE_DATA.organizacao.sigla,
            cnpjOrganizacao: window.GRAVE_DATA.organizacao.cnpj,
            cidadeOrganizacao: window.GRAVE_DATA.organizacao.endereco.cidade,
            estadoOrganizacao: window.GRAVE_DATA.organizacao.endereco.estado,
            responsavel1Nome: window.GRAVE_DATA.organizacao.responsaveis.presidente.nome,
            responsavel1Cargo: window.GRAVE_DATA.organizacao.responsaveis.presidente.cargo,
            responsavel2Nome: window.GRAVE_DATA.organizacao.responsaveis.coordenadora.nome,
            responsavel2Cargo: window.GRAVE_DATA.organizacao.responsaveis.coordenadora.cargo,
            logoUrl: window.GRAVE_DATA.organizacao.logo.placeholder
        };
        
        GRAVE.Storage.set('organizacao', dadosGrave);
        return dadosGrave;
    };

    // Aplicar dados automaticamente na inicialização
    aplicarDadosGrave();
    
    GRAVE.Debug.log('Dados do GRAVE carregados e aplicados');
});