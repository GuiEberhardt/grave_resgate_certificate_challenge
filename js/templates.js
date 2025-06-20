/**
 * Gerenciamento de templates de certificados do GRAVE
 */

const TemplateManager = {
    /**
     * Renderiza a galeria de templates
     */
    renderGallery: function() {
        const gallery = document.querySelector(DOM_SELECTORS.templates.gallery);
        if (!gallery) {
            DebugUtils.error('Elemento da galeria de templates não encontrado');
            return;
        }

        gallery.innerHTML = '';

        Object.values(CERTIFICATE_TEMPLATES).forEach(template => {
            const templateCard = this.createTemplateCard(template);
            gallery.appendChild(templateCard);
        });

        DebugUtils.log('Galeria de templates renderizada');
    },

    /**
     * Cria um card de template
     * @param {Object} template - Dados do template
     * @returns {HTMLElement} Elemento do card
     */
    createTemplateCard: function(template) {
        const cardElement = document.createElement('div');
        cardElement.className = 'col-lg-4 col-md-6 mb-4';
        
        cardElement.innerHTML = `
            <div class="card template-card h-100" data-template="${template.id}">
                <div class="template-preview" style="background: ${template.style.background}; border: ${template.style.border};">
                    <div>
                        <i class="fas fa-certificate fa-3x text-danger mb-2"></i>
                        <h5>${template.name}</h5>
                    </div>
                </div>
                <div class="card-body text-center">
                    <h5 class="card-title">${template.name}</h5>
                    <p class="card-text text-muted">${template.description}</p>
                    <button class="btn btn-outline-grave btn-sm" data-action="select-template" data-template="${template.id}">
                        <i class="fas fa-eye me-1"></i>Usar Template
                    </button>
                </div>
            </div>
        `;

        // Adicionar event listeners
        this.attachTemplateEvents(cardElement, template);

        return cardElement;
    },

    /**
     * Adiciona eventos aos cards de template
     * @param {HTMLElement} cardElement - Elemento do card
     * @param {Object} template - Dados do template
     */
    attachTemplateEvents: function(cardElement, template) {
        const selectButton = cardElement.querySelector('[data-action="select-template"]');
        const card = cardElement.querySelector('.template-card');

        // Evento de seleção do template
        const selectTemplate = () => {
            this.selectTemplate(template.id);
        };

        if (selectButton) {
            selectButton.addEventListener('click', selectTemplate);
        }

        if (card) {
            card.addEventListener('click', selectTemplate);
        }

        // Efeitos visuais
        card.addEventListener('mouseenter', () => {
            const preview = card.querySelector('.template-preview');
            if (preview) {
                preview.style.transform = 'scale(1.05)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const preview = card.querySelector('.template-preview');
            if (preview) {
                preview.style.transform = 'scale(1)';
            }
        });
    },

    /**
     * Seleciona um template
     * @param {string} templateId - ID do template
     */
    selectTemplate: function(templateId) {
        const template = CERTIFICATE_TEMPLATES[templateId];
        if (!template) {
            DebugUtils.error(`Template ${templateId} não encontrado`);
            return;
        }

        // Atualizar seleção no formulário
        DOMUtils.setValue(DOM_SELECTORS.form.template, templateId);

        // Feedback visual
        this.updateTemplateSelection(templateId);

        // Mostrar notificação
        NotificationManager.show(
            `Template "${template.name}" selecionado!`,
            GRAVE_CONFIG.notifications.types.SUCCESS
        );

        // Navegar para o gerador se houver dados do formulário
        const currentFormData = FormStorageManager.collectCurrentFormData();
        if (currentFormData.participantName) {
            setTimeout(() => {
                NavigationManager.showSection('generator');
                CertificateGenerator.generatePreview();
            }, 1500);
        } else {
            setTimeout(() => {
                NavigationManager.showSection('generator');
            }, 1500);
        }

        DebugUtils.log(`Template selecionado: ${templateId}`);
    },

    /**
     * Atualiza seleção visual dos templates
     * @param {string} selectedTemplateId - ID do template selecionado
     */
    updateTemplateSelection: function(selectedTemplateId) {
        // Remover seleção anterior
        const previousSelected = document.querySelectorAll('.template-card.selected');
        previousSelected.forEach(card => {
            card.classList.remove('selected');
        });

        // Adicionar seleção atual
        const currentCard = document.querySelector(`[data-template="${selectedTemplateId}"]`);
        if (currentCard) {
            currentCard.classList.add('selected');
        }
    },

    /**
     * Obtém template por ID
     * @param {string} templateId - ID do template
     * @returns {Object|null} Dados do template
     */
    getTemplate: function(templateId) {
        return CERTIFICATE_TEMPLATES[templateId] || null;
    },

    /**
     * Obtém lista de todos os templates
     * @returns {Array} Lista de templates
     */
    getAllTemplates: function() {
        return Object.values(CERTIFICATE_TEMPLATES);
    },

    /**
     * Obtém template padrão
     * @returns {Object} Template padrão
     */
    getDefaultTemplate: function() {
        return CERTIFICATE_TEMPLATES.classic;
    }
};

// Renderizador de certificados
const CertificateRenderer = {
    /**
     * Renderiza um certificado com base nos dados e template
     * @param {Object} certificateData - Dados do certificado
     * @param {string} templateId - ID do template
     * @returns {string} HTML do certificado
     */
    render: function(certificateData, templateId = 'classic') {
        const template = TemplateManager.getTemplate(templateId);
        if (!template) {
            DebugUtils.error(`Template ${templateId} não encontrado`);
            return '';
        }

        const certificateType = CERTIFICATE_TYPES[certificateData.certificateType];
        if (!certificateType) {
            DebugUtils.error(`Tipo de certificado ${certificateData.certificateType} não encontrado`);
            return '';
        }

        return this.generateCertificateHTML(certificateData, certificateType, template);
    },

    /**
     * Gera HTML do certificado
     * @param {Object} data - Dados do certificado
     * @param {Object} type - Tipo do certificado
     * @param {Object} template - Template do certificado
     * @returns {string} HTML gerado
     */
    generateCertificateHTML: function(data, type, template) {
        const startDate = DateUtils.formatToBrazilian(data.startDate);
        const endDate = DateUtils.formatToBrazilian(data.endDate);
        const currentDate = DateUtils.getCurrentDate();

        return `
            <div style="background: ${template.style.background}; border: ${template.style.border}; border-radius: 16px; padding: 3rem; text-align: center; min-height: 500px; position: relative;">
                <div style="position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 2px solid #FF3333; border-radius: 8px; opacity: 0.3;"></div>
                
                <div style="position: relative; z-index: 2;">
                    ${this.renderHeader()}
                    ${this.renderTitle(type.title)}
                    ${this.renderContent(data, type, startDate, endDate)}
                    ${this.renderSignatures(data.instructor)}
                    ${this.renderFooter(currentDate)}
                </div>
            </div>
        `;
    },

    /**
     * Renderiza cabeçalho do certificado
     * @returns {string} HTML do cabeçalho
     */
    renderHeader: function() {
        return `
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
                <img src="imgs/logo-certificate.png" alt="GRAVE Logo" style="width: 60px; height: 60px; margin-right: 20px; border-radius: 8px; object-fit: contain; padding: 8px;">
                <div style="text-align: left;">
                    <h2 style="margin: 0; font-size: 2rem; font-weight: 700; color: #333333;">${GRAVE_CONFIG.organization.name}</h2>
                    <p style="margin: 0; color: #6C757D; font-size: 0.9rem;">Resgate Voluntário</p>
                </div>
            </div>
        `;
    },

    /**
     * Renderiza título do certificado
     * @param {string} title - Título do certificado
     * @returns {string} HTML do título
     */
    renderTitle: function(title) {
        return `
            <h1 style="font-size: 2.2rem; font-weight: 700; color: #FF3333; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 1px;">
                ${title}
            </h1>
        `;
    },

    /**
     * Renderiza conteúdo principal do certificado
     * @param {Object} data - Dados do certificado
     * @param {Object} type - Tipo do certificado
     * @param {string} startDate - Data formatada de início
     * @param {string} endDate - Data formatada de fim
     * @returns {string} HTML do conteúdo
     */
    renderContent: function(data, type, startDate, endDate) {
        const participantName = FormatUtils.formatCertificateText(data.participantName);
        const activityName = FormatUtils.formatCertificateText(data.activityName);

        return `
            <div style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem; color: #333333;">
                <p style="margin-bottom: 1.5rem;">Certificamos que</p>
                <p style="font-size: 1.8rem; font-weight: 700; color: #FF3333; margin: 1.5rem 0; text-transform: uppercase;">
                    ${participantName}
                </p>
                <p style="margin-bottom: 1rem;">
                    ${type.actionText}
                </p>
                <p style="font-size: 1.4rem; font-weight: 600; color: #333333; margin: 1rem 0;">
                    ${activityName}
                </p>
                <p style="margin: 1rem 0;">
                    realizado no período de ${startDate} a ${endDate},<br>
                    com carga horária de ${data.workload} horas.
                </p>
            </div>
        `;
    },

    /**
     * Renderiza assinaturas do certificado
     * @param {string} instructorName - Nome do instrutor
     * @returns {string} HTML das assinaturas
     */
    renderSignatures: function(instructorName) {
        const formattedInstructor = FormatUtils.formatCertificateText(instructorName);

        return `
            <div style="margin-top: 3rem; display: flex; justify-content: space-between; align-items: end;">
                <div style="text-align: center; flex: 1;">
                    <div style="border-top: 2px solid #333333; width: 200px; margin: 0 auto; padding-top: 0.5rem;">
                        <p style="font-weight: 600; margin: 0;">${formattedInstructor}</p>
                        <p style="font-size: 0.9rem; color: #6C757D; margin: 0;">Instrutor/Responsável</p>
                    </div>
                </div>
                <div style="text-align: center; flex: 1;">
                    <div style="border-top: 2px solid #333333; width: 200px; margin: 0 auto; padding-top: 0.5rem;">
                        <p style="font-weight: 600; margin: 0;">${GRAVE_CONFIG.organization.name}</p>
                        <p style="font-size: 0.9rem; color: #6C757D; margin: 0;">Coordenação Geral</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderiza rodapé do certificado
     * @param {string} currentDate - Data atual formatada
     * @returns {string} HTML do rodapé
     */
    renderFooter: function(currentDate) {
        return `
            <div style="margin-top: 2rem; text-align: center;">
                <p style="font-size: 0.8rem; color: #6C757D;">
                    Emitido em ${currentDate} • ${GRAVE_CONFIG.organization.contact.website}
                </p>
            </div>
        `;
    }
};