/**
 * GRAVE - Sistema de Certificados Comunitários
 * Lógica específica para geração e manipulação de certificados
 */

$(document).ready(function() {
    'use strict';

    // Namespace para funcionalidades de certificados
    window.Certificate = {
        
        // Templates disponíveis
        templates: {
            'grave-original': {
                name: 'GRAVE Original',
                colors: {
                    primary: '#FF3B3B',
                    secondary: '#3A3A3A',
                    text: '#000000',
                    textLight: '#FFFFFF'
                },
                fonts: {
                    primary: 'Cardo, serif',
                    title: 'Inter, sans-serif'
                },
                layout: 'landscape'
            },
            'classico-azul': {
                name: 'Clássico Azul',
                colors: {
                    primary: '#1e40af',
                    secondary: '#1d4ed8',
                    text: '#000000',
                    textLight: '#FFFFFF'
                },
                fonts: {
                    primary: 'Times New Roman, serif',
                    title: 'Arial, sans-serif'
                },
                layout: 'landscape'
            },
            'minimalista-verde': {
                name: 'Minimalista Verde',
                colors: {
                    primary: '#10b981',
                    secondary: '#059669',
                    text: '#374151',
                    textLight: '#FFFFFF'
                },
                fonts: {
                    primary: 'Inter, sans-serif',
                    title: 'Inter, sans-serif'
                },
                layout: 'portrait'
            },
            'elegante-dourado': {
                name: 'Elegante Dourado',
                colors: {
                    primary: '#d97706',
                    secondary: '#b45309',
                    text: '#000000',
                    textLight: '#FFFFFF'
                },
                fonts: {
                    primary: 'Georgia, serif',
                    title: 'Georgia, serif'
                },
                layout: 'landscape'
            },
            'neutro-profissional': {
                name: 'Neutro Profissional',
                colors: {
                    primary: '#6b7280',
                    secondary: '#374151',
                    text: '#000000',
                    textLight: '#FFFFFF'
                },
                fonts: {
                    primary: 'Arial, sans-serif',
                    title: 'Arial, sans-serif'
                },
                layout: 'landscape'
            },
            'moderno-gradient': {
                name: 'Moderno Gradient',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#8b5cf6',
                    text: '#1f2937',
                    textLight: '#FFFFFF'
                },
                fonts: {
                    primary: 'Inter, sans-serif',
                    title: 'Inter, sans-serif'
                },
                layout: 'landscape'
            }
        },

        // Aplicar template selecionado
        applyTemplate: function(templateId) {
            const template = this.templates[templateId];
            if (!template) {
                GRAVE.Debug.error('Template não encontrado', templateId);
                return false;
            }

            try {
                // Aplicar cores do template
                document.documentElement.style.setProperty('--template-primary', template.colors.primary);
                document.documentElement.style.setProperty('--template-secondary', template.colors.secondary);
                document.documentElement.style.setProperty('--template-text', template.colors.text);
                document.documentElement.style.setProperty('--template-text-light', template.colors.textLight);

                // Aplicar fontes
                $('.certificate').css('font-family', template.fonts.primary);
                $('.certificate-title, .certificate-participant-name').css('font-family', template.fonts.title);

                // Aplicar classes específicas do template
                $('.certificate').removeClass('template-grave template-azul template-verde template-dourado template-neutro template-gradient');
                $('.certificate').addClass(`template-${templateId.replace('-', '')}`);

                // Configurações específicas por template
                this.applyTemplateSpecific(templateId);

                GRAVE.Debug.log('Template aplicado', templateId);
                return true;
            } catch (error) {
                GRAVE.Debug.error('Erro ao aplicar template', error);
                return false;
            }
        },

        // Aplicar configurações específicas do template
        applyTemplateSpecific: function(templateId) {
            switch (templateId) {
                case 'grave-original':
                    this.applyGraveTemplate();
                    break;
                case 'classico-azul':
                    this.applyClassicoTemplate();
                    break;
                case 'minimalista-verde':
                    this.applyMinimalistaTemplate();
                    break;
                case 'elegante-dourado':
                    this.applyEleganteTemplate();
                    break;
                case 'neutro-profissional':
                    this.applyNeutroTemplate();
                    break;
                case 'moderno-gradient':
                    this.applyModernoTemplate();
                    break;
            }
        },

        // Template GRAVE Original
        applyGraveTemplate: function() {
            $('.certificate-header').css({
                'background': 'linear-gradient(135deg, #FF3B3B 0%, #CC2C2C 100%)',
                'color': '#FFFFFF'
            });
            $('.certificate-participant-name').css('color', '#FF3B3B');
            $('.certificate-content-title').css('color', '#FF3B3B');
        },

        // Template Clássico Azul
        applyClassicoTemplate: function() {
            $('.certificate-header').css({
                'background': 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                'color': '#FFFFFF'
            });
            $('.certificate-participant-name').css('color', '#1e40af');
            $('.certificate-content-title').css('color', '#1e40af');
            
            // Adicionar borda ao certificado
            $('.certificate-text').css({
                'border': '2px solid #1e40af',
                'border-radius': '8px',
                'padding': '20px',
                'margin': '20px 0'
            });
        },

        // Template Minimalista Verde
        applyMinimalistaTemplate: function() {
            $('.certificate-header').css({
                'background': 'transparent',
                'color': '#10b981',
                'text-align': 'center'
            });
            $('.certificate-participant-name').css('color', '#10b981');
            $('.certificate-content-title').css('color', '#10b981');
            
            // Estilo minimalista
            $('.certificate-text').css({
                'text-align': 'center',
                'line-height': '1.8'
            });
        },

        // Template Elegante Dourado
        applyEleganteTemplate: function() {
            $('.certificate').css({
                'border': '3px solid #d97706',
                'margin': '10px'
            });
            $('.certificate-header').css({
                'background': 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                'color': '#FFFFFF'
            });
            $('.certificate-participant-name').css('color', '#d97706');
            $('.certificate-content-title').css('color', '#d97706');
            
            // Adicionar bordas internas
            $('.certificate-body').css({
                'border': '1px solid #d97706',
                'margin': '15px',
                'border-radius': '8px'
            });
        },

        // Template Neutro Profissional
        applyNeutroTemplate: function() {
            $('.certificate-header').css({
                'background': '#6b7280',
                'color': '#FFFFFF'
            });
            $('.certificate-participant-name').css('color', '#374151');
            $('.certificate-content-title').css('color', '#374151');
            
            // Estilo neutro e limpo
            $('.certificate').css({
                'border': '2px solid #6b7280'
            });
        },

        // Template Moderno Gradient
        applyModernoTemplate: function() {
            $('.certificate-header').css({
                'background': 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
                'color': '#FFFFFF'
            });
            $('.certificate-participant-name').css({
                'background': 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
                'background-clip': 'text'
            });
            $('.certificate-content-title').css('color', '#3b82f6');
        },

        // Validar dados do certificado
        validateData: function(data) {
            const errors = [];

            if (!data.participante || !data.participante.nome) {
                errors.push('Nome do participante é obrigatório');
            }

            if (!data.participante || !data.participante.cpf) {
                errors.push('CPF do participante é obrigatório');
            } else if (!GRAVE.Validate.cpf(data.participante.cpf)) {
                errors.push('CPF inválido');
            }

            if (!data.participante || !data.participante.numero) {
                errors.push('Número do certificado é obrigatório');
            }

            if (!data.organizacao || !data.organizacao.nome) {
                errors.push('Nome da organização é obrigatório');
            }

            if (!data.evento || !data.evento.nome) {
                errors.push('Nome do evento é obrigatório');
            }

            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },

        // Gerar dados completos do certificado
        generateCertificateData: function(participanteData) {
            const evento = GRAVE.Storage.get('evento');
            const template = GRAVE.Storage.get('template_selecionado');
            const organizacao = getGraveData(); // Usar dados fixos do GRAVE

            return {
                participante: {
                    nome: participanteData.nome || '',
                    cpf: participanteData.cpf || '',
                    numero: participanteData.numero || '',
                    observacoes: participanteData.observacoes || ''
                },
                organizacao: {
                    nome: organizacao.nomeCompleto,
                    sigla: organizacao.sigla,
                    cnpj: organizacao.cnpj,
                    cidade: organizacao.endereco.cidade,
                    estado: organizacao.endereco.estado,
                    cidadeEstado: organizacao.endereco.cidadeEstado,
                    responsavel1: organizacao.responsaveis.presidente,
                    responsavel2: organizacao.responsaveis.coordenadora,
                    logo: organizacao.logo.placeholder
                },
                evento: {
                    tipo: evento?.tipoEvento || '',
                    nome: evento?.nomeEvento || '',
                    dataInicio: evento?.dataInicioEvento || '',
                    dataFim: evento?.dataFimEvento || '',
                    local: evento?.localEvento || '',
                    cargaHoraria: evento?.cargaHorariaEvento || '',
                    topicos: evento?.topicos || [],
                    modalidade: evento?.modalidadeEvento || '',
                    numeroBase: evento?.numeroBaseEvento || ''
                },
                template: template || 'grave-workshop',
                geradoEm: new Date().toISOString()
            };
        },

        // Formatar texto do certificado
        formatCertificateText: function(data) {
            const participante = data.participante.nome.toUpperCase();
            const cpf = data.participante.cpf;
            const evento = (data.evento.tipo ? data.evento.tipo.toUpperCase() + ' ' : '') + data.evento.nome.toUpperCase();
            const organizacao = 'GRAVE'; // Sempre GRAVE
            
            let dataTexto = '';
            if (data.evento.dataInicio) {
                dataTexto = 'NO DIA ' + GRAVE.Format.date(data.evento.dataInicio);
                if (data.evento.dataFim && data.evento.dataFim !== data.evento.dataInicio) {
                    dataTexto = 'NOS DIAS ' + GRAVE.Format.date(data.evento.dataInicio) + ' A ' + GRAVE.Format.date(data.evento.dataFim);
                }
            }
            
            const local = data.evento.local ? 'NA ' + data.evento.local.toUpperCase() : '';
            const cnpj = data.organizacao.cnpj;
            const horas = data.evento.cargaHoraria;

            // Determinar verbo baseado no tipo de evento
            let verbo = 'PARTICIPOU DO';
            if (data.evento.tipo === 'curso') {
                verbo = 'CONCLUIU COM FREQUÊNCIA DE 100% O';
            }

            return {
                participante,
                cpf,
                evento,
                organizacao,
                dataTexto,
                local,
                cnpj,
                horas,
                verbo
            };
        },

        // Aplicar dados ao DOM do certificado
        applyCertificateData: function(data) {
            try {
                const formatted = this.formatCertificateText(data);

                // Atualizar elementos do certificado
                $('#nomeDestaque').text(formatted.participante);
                $('#cpfDestaque').text(formatted.cpf);
                $('#eventoDestaque').text(formatted.evento);
                $('#dataTexto').text(formatted.dataTexto);
                $('#localTexto').text(formatted.local);
                $('#cnpjTexto, #cnpjInfo').text(formatted.cnpj);
                $('#horasTexto').text(formatted.horas);
                $('#numeroCertificado, #numeroSegundaPagina').text(data.participante.numero);

                // Atualizar texto principal baseado no tipo de evento
                const textoContainer = $('.certificate-text');
                if (data.evento.tipo === 'curso') {
                    // Texto para cursos
                    textoContainer.html(`
                        CERTIFICAMOS QUE <span id="nomeDestaque" class="certificate-participant-name print-primary" style="font-size: 24px; font-weight: bold; color: #FF3B3B;">${formatted.participante}</span>,
                        INSCRITO SOB O CPF Nº <span id="cpfDestaque" class="print-black" style="font-weight: bold;">${formatted.cpf}</span> CONCLUIU COM
                        FREQUÊNCIA DE 100% O <span id="eventoDestaque" class="certificate-highlight print-black" style="font-weight: bold;">${formatted.evento}</span>, PROMOVIDO PELO
                        GRAVE, <span id="dataTexto" class="print-black" style="font-weight: bold;">${formatted.dataTexto}</span>, FAZENDO TOTAL
                        DE <span id="horasTexto" class="print-black" style="font-weight: bold;">${formatted.horas}</span> HORAS.
                    `);
                } else {
                    // Texto para workshops e outros
                    textoContainer.html(`
                        CERTIFICAMOS QUE <span id="nomeDestaque" class="certificate-participant-name print-primary" style="font-size: 24px; font-weight: bold; color: #FF3B3B;">${formatted.participante}</span>,
                        INSCRITO SOB O CPF Nº <span id="cpfDestaque" class="print-black" style="font-weight: bold;">${formatted.cpf}</span> PARTICIPOU DO
                        <span id="eventoDestaque" class="certificate-highlight print-black" style="font-weight: bold;">${formatted.evento}</span>, PROMOVIDO PELO
                        GRAVE, <span id="dataTexto" class="print-black" style="font-weight: bold;">${formatted.dataTexto}</span>, <span id="localTexto" class="print-black" style="font-weight: bold;">${formatted.local}</span>, FAZENDO TOTAL
                        DE <span id="horasTexto" class="print-black" style="font-weight: bold;">${formatted.horas}</span> HORAS.
                    `);
                }

                // Dados da organização GRAVE (fixos)
                $('#headerTitulo').text(data.organizacao.nome);
                $('#organizacaoInfo').text(`${data.organizacao.nome}.`);
                $('#cidadeInfo').text(data.organizacao.cidadeEstado);

                // Responsáveis do GRAVE
                $('#responsavel1Nome').text(data.organizacao.responsavel1.nome);
                $('#responsavel1Cargo').text(data.organizacao.responsavel1.cargo);
                $('#responsavel2Nome').text(data.organizacao.responsavel2.nome);
                $('#responsavel2Cargo').text(data.organizacao.responsavel2.cargo);

                // Configurar assinaturas baseado no tipo de evento
                if (data.evento.tipo === 'curso') {
                    // Para cursos: Presidente, Instrutora, Coordenadora
                    $('#assinatura2Container').show();
                    // Adicionar terceira assinatura se necessário
                } else {
                    // Para workshops: Presidente e Coordenadora
                    $('#assinatura2Container').show();
                }

                // Tópicos do conteúdo programático
                if (data.evento.topicos && data.evento.topicos.length > 0) {
                    const topicosHtml = data.evento.topicos.map(topico => `<li>${topico}</li>`).join('');
                    $('#listaTopicos').html(topicosHtml);
                }

                // Aplicar template
                this.applyTemplate(data.template);

                GRAVE.Debug.log('Dados aplicados ao certificado', data);
                return true;
            } catch (error) {
                GRAVE.Debug.error('Erro ao aplicar dados ao certificado', error);
                return false;
            }
        },

        // Preparar para impressão
        prepareForPrint: function() {
            // Garantir que as cores sejam impressas
            $('body').addClass('print-force-colors');
            
            // Aguardar o carregamento de imagens
            const images = $('img');
            let loadedImages = 0;
            
            return new Promise((resolve) => {
                if (images.length === 0) {
                    resolve();
                    return;
                }
                
                images.each(function() {
                    const img = this;
                    if (img.complete) {
                        loadedImages++;
                    } else {
                        $(img).on('load error', function() {
                            loadedImages++;
                            if (loadedImages === images.length) {
                                resolve();
                            }
                        });
                    }
                });
                
                if (loadedImages === images.length) {
                    resolve();
                }
                
                // Timeout de segurança
                setTimeout(resolve, 2000);
            });
        },

        // Imprimir certificado
        print: function(data) {
            return new Promise((resolve, reject) => {
                try {
                    // Aplicar dados
                    if (!this.applyCertificateData(data)) {
                        reject(new Error('Erro ao aplicar dados ao certificado'));
                        return;
                    }
                    
                    // Preparar para impressão
                    this.prepareForPrint().then(() => {
                        // Aguardar um pouco para garantir renderização
                        setTimeout(() => {
                            window.print();
                            resolve();
                        }, 500);
                    });
                } catch (error) {
                    reject(error);
                }
            });
        },

        // Exportar dados do certificado
        exportData: function(data) {
            const exportData = {
                ...data,
                exportadoEm: new Date().toISOString(),
                versao: '1.0'
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificado_${data.participante.numero}_${data.participante.nome.replace(/\s+/g, '_')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        },

        // Importar dados do certificado
        importData: function(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // Validar estrutura dos dados
                        if (!data.participante || !data.organizacao || !data.evento) {
                            reject(new Error('Arquivo de dados inválido'));
                            return;
                        }
                        
                        resolve(data);
                    } catch (error) {
                        reject(new Error('Erro ao ler arquivo: ' + error.message));
                    }
                };
                
                reader.onerror = function() {
                    reject(new Error('Erro ao ler arquivo'));
                };
                
                reader.readAsText(file);
            });
        },

        // Gerar certificados em lote
        generateBatch: function(participantes) {
            const results = [];
            
            participantes.forEach(participante => {
                try {
                    const data = this.generateCertificateData(participante);
                    const validation = this.validateData(data);
                    
                    if (validation.isValid) {
                        results.push({
                            success: true,
                            data: data,
                            participante: participante.nome
                        });
                    } else {
                        results.push({
                            success: false,
                            errors: validation.errors,
                            participante: participante.nome
                        });
                    }
                } catch (error) {
                    results.push({
                        success: false,
                        error: error.message,
                        participante: participante.nome
                    });
                }
            });
            
            return results;
        }
    };

    // Inicializar sistema de certificados
    GRAVE.Debug.log('Sistema de certificados inicializado');
});