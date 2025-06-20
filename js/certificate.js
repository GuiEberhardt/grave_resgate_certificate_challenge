/**
 * Gerenciamento de geração de certificados do GRAVE
 */

const CertificateGenerator = {
    currentCertificateData: null,

    /**
     * Gera preview do certificado
     */
    generatePreview: function() {
        try {
            // Mostrar loading
            this.showLoading(true);

            // Coletar dados do formulário
            const formData = FormStorageManager.collectCurrentFormData();

            // Validar formulário
            const validationResult = FormValidator.validateForm(formData);
            ValidationUI.applyValidationStyles(validationResult);

            if (!validationResult.isValid) {
                this.showLoading(false);
                return false;
            }

            // Simular delay de processamento
            setTimeout(() => {
                this.renderCertificate(formData);
                this.showLoading(false);
                this.showPrintButton(true);
                this.updateStatistics();
                
                // Salvar no histórico
                HistoryStorageManager.addCertificate(formData);
                
                DebugUtils.log('Certificado gerado com sucesso', formData);
            }, 1000);

            return true;
        } catch (error) {
            DebugUtils.error('Erro ao gerar preview do certificado', error);
            this.showLoading(false);
            NotificationManager.show(
                'Erro ao gerar certificado. Tente novamente.',
                GRAVE_CONFIG.notifications.types.ERROR
            );
            return false;
        }
    },

    /**
     * Renderiza o certificado na tela
     * @param {Object} formData - Dados do formulário
     */
    renderCertificate: function(formData) {
        const previewContainer = document.querySelector(DOM_SELECTORS.preview.container);
        if (!previewContainer) {
            DebugUtils.error('Container de preview não encontrado');
            return;
        }

        // Renderizar certificado
        const certificateHTML = CertificateRenderer.render(formData, formData.template);
        previewContainer.innerHTML = certificateHTML;

        // Salvar dados atuais
        this.currentCertificateData = { ...formData };

        // Adicionar animação
        AnimationUtils.fadeIn(previewContainer);
    },

    /**
     * Limpa o formulário
     */
    clearForm: function() {
        try {
            // Limpar campos do formulário
            const form = document.querySelector(DOM_SELECTORS.form.certificateForm);
            if (form) {
                form.reset();
            }

            // Limpar preview
            this.clearPreview();

            // Limpar estilos de validação
            ValidationUI.clearValidationStyles();

            // Esconder botão de impressão
            this.showPrintButton(false);

            // Limpar dados salvos
            this.currentCertificateData = null;
            FormStorageManager.clearFormData();

            DebugUtils.log('Formulário limpo');

            NotificationManager.show(
                'Formulário limpo com sucesso!',
                GRAVE_CONFIG.notifications.types.SUCCESS
            );
        } catch (error) {
            DebugUtils.error('Erro ao limpar formulário', error);
        }
    },

    /**
     * Limpa o preview do certificado
     */
    clearPreview: function() {
        const previewContainer = document.querySelector(DOM_SELECTORS.preview.container);
        if (previewContainer) {
            previewContainer.innerHTML = `
                <div class="text-muted">
                    <i class="fas fa-certificate fa-4x mb-3"></i>
                    <h5>Preview do Certificado</h5>
                    <p>Preencha o formulário ao lado para visualizar o certificado</p>
                </div>
            `;
        }
    },

    /**
     * Imprime o certificado
     */
    printCertificate: function() {
        if (!this.currentCertificateData) {
            NotificationManager.show(
                'Nenhum certificado foi gerado ainda.',
                GRAVE_CONFIG.notifications.types.WARNING
            );
            return;
        }

        try {
            const printWindow = window.open('', '_blank');
            const certificateContent = document.querySelector(DOM_SELECTORS.preview.container).innerHTML;
            
            const printHTML = this.generatePrintHTML(certificateContent);
            
            printWindow.document.write(printHTML);
            printWindow.document.close();
            printWindow.focus();
            
            // Aguardar carregamento e imprimir
            printWindow.onload = function() {
                printWindow.print();
                printWindow.onafterprint = function() {
                    printWindow.close();
                };
            };

            DebugUtils.log('Certificado enviado para impressão');
        } catch (error) {
            DebugUtils.error('Erro ao imprimir certificado', error);
            NotificationManager.show(
                'Erro ao preparar impressão. Tente novamente.',
                GRAVE_CONFIG.notifications.types.ERROR
            );
        }
    },

    /**
     * Gera HTML otimizado para impressão
     * @param {string} certificateContent - Conteúdo do certificado
     * @returns {string} HTML para impressão
     */
    generatePrintHTML: function(certificateContent) {
        const participantName = this.currentCertificateData ? 
            StringUtils.generateSlug(this.currentCertificateData.participantName) : 
            'certificado';

        return `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Certificado GRAVE - ${participantName}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body { 
                        margin: 0; 
                        padding: 20px; 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: white;
                    }
                    
                    .certificate-container {
                        width: 100%;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    
                    @media print {
                        body { 
                            margin: 0; 
                            padding: 0; 
                        }
                        
                        .certificate-container {
                            max-width: none;
                            width: 100%;
                            height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                    
                    @page {
                        size: A4 portrait;
                        margin: 1cm;
                    }
                </style>
            </head>
            <body>
                <div class="certificate-container">
                    ${certificateContent}
                </div>
            </body>
            </html>
        `;
    },

    /**
     * Controla exibição do loading
     * @param {boolean} show - Se deve mostrar loading
     */
    showLoading: function(show) {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            if (show) {
                loadingElement.classList.add('show');
            } else {
                loadingElement.classList.remove('show');
            }
        }
    },

    /**
     * Controla exibição do botão de impressão
     * @param {boolean} show - Se deve mostrar botão
     */
    showPrintButton: function(show) {
        const printButton = document.querySelector(DOM_SELECTORS.buttons.print);
        if (printButton) {
            printButton.style.display = show ? 'inline-block' : 'none';
        }
    },

    /**
     * Atualiza estatísticas de certificados gerados
     */
    updateStatistics: function() {
        const newCount = StatsStorageManager.incrementCertificateCount();
        this.animateCounter(newCount);
    },

    /**
     * Anima contador de certificados
     * @param {number} targetCount - Valor alvo do contador
     */
    animateCounter: function(targetCount) {
        const counterElement = document.querySelector(DOM_SELECTORS.stats.certificatesGenerated);
        if (!counterElement) return;

        const currentCount = parseInt(counterElement.textContent) || 0;
        const duration = 1000;
        const steps = 30;
        const increment = (targetCount - currentCount) / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const newValue = Math.round(currentCount + (increment * step));
            counterElement.textContent = newValue;

            if (step >= steps) {
                clearInterval(timer);
                counterElement.textContent = targetCount;
            }
        }, duration / steps);
    },

    /**
     * Verifica se o formulário está completo
     * @returns {boolean} Se está completo
     */
    isFormComplete: function() {
        const formData = FormStorageManager.collectCurrentFormData();
        const requiredFields = ['certificateType', 'participantName', 'activityName', 'startDate', 'endDate', 'workload', 'instructor'];
        
        return requiredFields.every(field => {
            const value = formData[field];
            return value && value.trim() !== '';
        });
    },

    /**
     * Auto-gera preview quando formulário está completo
     */
    autoGeneratePreview: function() {
        if (this.isFormComplete()) {
            this.generatePreview();
        }
    }
};

// Gerenciador de notificações
const NotificationManager = {
    /**
     * Mostra notificação
     * @param {string} message - Mensagem da notificação
     * @param {string} type - Tipo da notificação
     */
    show: function(message, type = GRAVE_CONFIG.notifications.types.INFO) {
        const alertClass = this.getAlertClass(type);
        const icon = this.getIcon(type);
        
        const notificationHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show notification-alert" 
                 role="alert" 
                 style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;">
                <i class="fas ${icon} me-2"></i>${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', notificationHTML);
        
        // Auto-dismiss
        setTimeout(() => {
            const alerts = document.querySelectorAll('.notification-alert');
            alerts.forEach(alert => {
                if (alert.querySelector('.btn-close')) {
                    alert.querySelector('.btn-close').click();
                }
            });
        }, GRAVE_CONFIG.notifications.duration);
    },

    /**
     * Obtém classe CSS para o tipo de alerta
     * @param {string} type - Tipo da notificação
     * @returns {string} Classe CSS
     */
    getAlertClass: function(type) {
        const classes = {
            [GRAVE_CONFIG.notifications.types.SUCCESS]: 'alert-success',
            [GRAVE_CONFIG.notifications.types.WARNING]: 'alert-warning',
            [GRAVE_CONFIG.notifications.types.ERROR]: 'alert-danger',
            [GRAVE_CONFIG.notifications.types.INFO]: 'alert-info'
        };
        
        return classes[type] || 'alert-info';
    },

    /**
     * Obtém ícone para o tipo de notificação
     * @param {string} type - Tipo da notificação
     * @returns {string} Classe do ícone
     */
    getIcon: function(type) {
        const icons = {
            [GRAVE_CONFIG.notifications.types.SUCCESS]: 'fa-check-circle',
            [GRAVE_CONFIG.notifications.types.WARNING]: 'fa-exclamation-triangle',
            [GRAVE_CONFIG.notifications.types.ERROR]: 'fa-exclamation-circle',
            [GRAVE_CONFIG.notifications.types.INFO]: 'fa-info-circle'
        };
        
        return icons[type] || 'fa-info-circle';
    }
};

// Gerenciador de eventos do formulário
const FormEventManager = {
    /**
     * Inicializa event listeners do formulário
     */
    init: function() {
        this.setupFormEvents();
        this.setupButtonEvents();
        this.setupKeyboardShortcuts();
    },

    /**
     * Configura eventos do formulário
     */
    setupFormEvents: function() {
        // Auto-save no input
        const formInputs = document.querySelectorAll('#certificate-form input, #certificate-form select');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                FormStorageManager.saveFormData(FormStorageManager.collectCurrentFormData());
            });

            input.addEventListener('change', () => {
                FormStorageManager.saveFormData(FormStorageManager.collectCurrentFormData());
                
                // Auto-gerar preview se formulário estiver completo
                setTimeout(() => {
                    CertificateGenerator.autoGeneratePreview();
                }, 500);
            });
        });

        // Validação de datas
        const startDateInput = document.querySelector(DOM_SELECTORS.form.startDate);
        const endDateInput = document.querySelector(DOM_SELECTORS.form.endDate);

        if (startDateInput && endDateInput) {
            const validateDateRange = () => {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                
                if (startDate && endDate && startDate > endDate) {
                    endDateInput.classList.add('is-invalid');
                    NotificationManager.show(
                        'Data de término deve ser posterior à data de início',
                        GRAVE_CONFIG.notifications.types.WARNING
                    );
                } else {
                    endDateInput.classList.remove('is-invalid');
                }
            };

            startDateInput.addEventListener('change', validateDateRange);
            endDateInput.addEventListener('change', validateDateRange);
        }
    },

    /**
     * Configura eventos dos botões
     */
    setupButtonEvents: function() {
        // Botão gerar preview
        const generateBtn = document.querySelector(DOM_SELECTORS.buttons.generatePreview);
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                CertificateGenerator.generatePreview();
            });
        }

        // Botão limpar formulário
        const clearBtn = document.querySelector(DOM_SELECTORS.buttons.clearForm);
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                CertificateGenerator.clearForm();
            });
        }

        // Botão imprimir
        const printBtn = document.querySelector(DOM_SELECTORS.buttons.print);
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                CertificateGenerator.printCertificate();
            });
        }
    },

    /**
     * Configura atalhos de teclado
     */
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: Gerar preview
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const activeSection = document.querySelector('.section.active');
                if (activeSection && activeSection.id === 'generator') {
                    e.preventDefault();
                    CertificateGenerator.generatePreview();
                }
            }
            
            // Ctrl/Cmd + P: Imprimir (quando certificado estiver visível)
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                const printBtn = document.querySelector(DOM_SELECTORS.buttons.print);
                if (printBtn && printBtn.style.display !== 'none') {
                    e.preventDefault();
                    CertificateGenerator.printCertificate();
                }
            }

            // Escape: Limpar formulário
            if (e.key === 'Escape') {
                const activeSection = document.querySelector('.section.active');
                if (activeSection && activeSection.id === 'generator') {
                    CertificateGenerator.clearForm();
                }
            }
        });
    }
};