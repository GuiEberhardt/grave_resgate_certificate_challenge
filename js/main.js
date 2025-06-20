/**
 * Arquivo principal do sistema GRAVE
 * Responsável pela inicialização e coordenação de todos os módulos
 */

// Estado global da aplicação
const GraveApp = {
    isInitialized: false,
    version: GRAVE_CONFIG.version,

    /**
     * Inicializa a aplicação
     */
    init: function() {
        try {
            DebugUtils.log(`Inicializando GRAVE v${this.version}`);
            
            // Verificar dependências
            this.checkDependencies();
            
            // Inicializar módulos na ordem correta
            this.initializeModules();
            
            // Configurar eventos globais
            this.setupGlobalEvents();
            
            // Marcar como inicializado
            this.isInitialized = true;
            
            DebugUtils.log('GRAVE inicializado com sucesso');
            
            // Mostrar notificação de boas-vindas
            this.showWelcomeMessage();
            
        } catch (error) {
            DebugUtils.error('Erro crítico na inicialização do GRAVE', error);
            this.handleInitializationError(error);
        }
    },

    /**
     * Verifica se todas as dependências estão disponíveis
     */
    checkDependencies: function() {
        const dependencies = {
            'jQuery': typeof $ !== 'undefined',
            'Bootstrap': typeof bootstrap !== 'undefined',
            'localStorage': typeof Storage !== 'undefined'
        };

        const missing = [];
        for (const [name, available] of Object.entries(dependencies)) {
            if (!available) {
                missing.push(name);
            }
        }

        if (missing.length > 0) {
            throw new Error(`Dependências não encontradas: ${missing.join(', ')}`);
        }

        DebugUtils.log('Todas as dependências verificadas com sucesso');
    },

    /**
     * Inicializa todos os módulos do sistema
     */
    initializeModules: function() {
        DebugUtils.log('Inicializando módulos...');

        // 1. Navegação (deve ser primeiro)
        NavigationManager.init();
        BrowserHistoryManager.init();

        // 2. Validação em tempo real
        RealTimeValidator.init();

        // 3. Eventos do formulário
        FormEventManager.init();

        // 4. Carregar dados salvos
        this.loadSavedData();

        // 5. Configurações iniciais
        this.applyInitialSettings();

        DebugUtils.log('Todos os módulos inicializados');
    },

    /**
     * Carrega dados salvos do localStorage
     */
    loadSavedData: function() {
        try {
            // Carregar configurações
            const settings = SettingsStorageManager.loadSettings();
            DebugUtils.log('Configurações carregadas', settings);

            // Carregar estatísticas
            const certificateCount = StatsStorageManager.getCertificateCount();
            this.updateCertificateCounter(certificateCount);

            // Carregar dados do formulário (se na seção generator)
            if (window.location.hash === '#generator') {
                const formData = FormStorageManager.loadFormData();
                if (formData) {
                    FormStorageManager.restoreFormData(formData);
                }
            }

        } catch (error) {
            DebugUtils.error('Erro ao carregar dados salvos', error);
        }
    },

    /**
     * Aplica configurações iniciais
     */
    applyInitialSettings: function() {
        const settings = SettingsStorageManager.loadSettings();

        // Aplicar tema se necessário (para futuras implementações)
        if (settings.theme && settings.theme !== 'light') {
            document.body.classList.add(`theme-${settings.theme}`);
        }

        // Configurar auto-save
        if (settings.autoSave) {
            this.enableAutoSave();
        }
    },

    /**
     * Habilita auto-save do formulário
     */
    enableAutoSave: function() {
        const formInputs = document.querySelectorAll('#certificate-form input, #certificate-form select');
        formInputs.forEach(input => {
            input.addEventListener('input', this.debounce(() => {
                const formData = FormStorageManager.collectCurrentFormData();
                FormStorageManager.saveFormData(formData);
            }, 500));
        });
    },

    /**
     * Configura eventos globais da aplicação
     */
    setupGlobalEvents: function() {
        // Evento de resize da janela
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));

        // Evento de beforeunload para salvar dados
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });

        // Evento de erro global
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });

        // Evento de clique global para fechar dropdowns
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });

        // Eventos de teclado globais
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });
    },

    /**
     * Trata redimensionamento da janela
     */
    handleWindowResize: function() {
        // Ajustar layout responsivo se necessário
        DebugUtils.log('Window resized');
    },

    /**
     * Trata evento beforeunload
     */
    handleBeforeUnload: function(e) {
        // Salvar dados importantes antes de sair
        const formData = FormStorageManager.collectCurrentFormData();
        if (this.hasUnsavedChanges(formData)) {
            FormStorageManager.saveFormData(formData);
        }
    },

    /**
     * Trata erros globais
     */
    handleGlobalError: function(e) {
        DebugUtils.error('Erro global capturado', e.error);
        
        // Mostrar notificação de erro para o usuário
        NotificationManager.show(
            'Ocorreu um erro inesperado. Por favor, recarregue a página.',
            GRAVE_CONFIG.notifications.types.ERROR
        );
    },

    /**
     * Trata cliques globais
     */
    handleGlobalClick: function(e) {
        // Fechar notificações ao clicar fora
        if (!e.target.closest('.alert')) {
            const alerts = document.querySelectorAll('.alert.show');
            alerts.forEach(alert => {
                const closeBtn = alert.querySelector('.btn-close');
                if (closeBtn && !alert.contains(e.target)) {
                    // Auto-fechar notificação após clique fora (opcional)
                }
            });
        }
    },

    /**
     * Trata teclas globais
     */
    handleGlobalKeydown: function(e) {
        // Atalho F1 para ajuda
        if (e.key === 'F1') {
            e.preventDefault();
            this.showHelp();
        }

        // Atalho Ctrl+S para salvar
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveCurrentWork();
        }
    },

    /**
     * Verifica se há mudanças não salvas
     * @param {Object} formData - Dados do formulário
     * @returns {boolean} Se há mudanças
     */
    hasUnsavedChanges: function(formData) {
        const hasData = formData.participantName || formData.activityName || 
                       formData.startDate || formData.endDate;
        return Boolean(hasData);
    },

    /**
     * Atualiza contador de certificados na interface
     * @param {number} count - Número de certificados
     */
    updateCertificateCounter: function(count) {
        const counterElement = document.querySelector(DOM_SELECTORS.stats.certificatesGenerated);
        if (counterElement) {
            counterElement.textContent = count;
        }
    },

    /**
     * Mostra mensagem de boas-vindas
     */
    showWelcomeMessage: function() {
        // Verificar se é primeira visita
        const isFirstVisit = !StorageManager.exists(GRAVE_CONFIG.localStorage.keys.certificateCount);
        
        if (isFirstVisit) {
            setTimeout(() => {
                NotificationManager.show(
                    'Bem-vindo ao sistema de certificados do GRAVE!',
                    GRAVE_CONFIG.notifications.types.SUCCESS
                );
            }, 1000);
        }
    },

    /**
     * Trata erro de inicialização
     * @param {Error} error - Erro ocorrido
     */
    handleInitializationError: function(error) {
        console.error('GRAVE Initialization Error:', error);
        
        // Mostrar mensagem de erro para o usuário
        document.body.innerHTML = `
            <div class="container mt-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Erro de Inicialização</h4>
                    <p>Ocorreu um erro ao inicializar o sistema GRAVE.</p>
                    <hr>
                    <p class="mb-0">
                        <strong>Erro:</strong> ${error.message}<br>
                        <small>Tente recarregar a página ou entre em contato com o suporte.</small>
                    </p>
                    <button class="btn btn-danger mt-3" onclick="window.location.reload()">
                        Recarregar Página
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Mostra ajuda do sistema
     */
    showHelp: function() {
        const helpContent = `
            <div class="modal fade" id="helpModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-question-circle me-2"></i>
                                Ajuda do Sistema GRAVE
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h6>Como usar o sistema:</h6>
                            <ol>
                                <li><strong>Gerador:</strong> Preencha o formulário com os dados do certificado</li>
                                <li><strong>Preview:</strong> Visualize o certificado antes de imprimir</li>
                                <li><strong>Templates:</strong> Escolha entre diferentes modelos disponíveis</li>
                                <li><strong>Impressão:</strong> Imprima ou salve o certificado finalizado</li>
                            </ol>
                            
                            <h6>Atalhos de teclado:</h6>
                            <ul>
                                <li><kbd>Ctrl+Enter</kbd> - Gerar preview</li>
                                <li><kbd>Ctrl+P</kbd> - Imprimir certificado</li>
                                <li><kbd>Esc</kbd> - Limpar formulário</li>
                                <li><kbd>F1</kbd> - Mostrar esta ajuda</li>
                            </ul>

                            <h6>Recursos:</h6>
                            <ul>
                                <li>Auto-salvamento dos dados do formulário</li>
                                <li>Validação em tempo real</li>
                                <li>Múltiplos templates disponíveis</li>
                                <li>Contador de certificados gerados</li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-grave" data-bs-dismiss="modal">
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal anterior se existir
        const existingModal = document.getElementById('helpModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Adicionar novo modal
        document.body.insertAdjacentHTML('beforeend', helpContent);

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('helpModal'));
        modal.show();
    },

    /**
     * Salva trabalho atual
     */
    saveCurrentWork: function() {
        const formData = FormStorageManager.collectCurrentFormData();
        if (this.hasUnsavedChanges(formData)) {
            FormStorageManager.saveFormData(formData);
            NotificationManager.show(
                'Dados salvos automaticamente!',
                GRAVE_CONFIG.notifications.types.SUCCESS
            );
        }
    },

    /**
     * Função debounce para otimizar performance
     * @param {Function} func - Função a ser executada
     * @param {number} wait - Tempo de espera em ms
     * @returns {Function} Função com debounce
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Obtém informações do sistema
     * @returns {Object} Informações do sistema
     */
    getSystemInfo: function() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            currentSection: NavigationManager.getCurrentSection(),
            certificatesGenerated: StatsStorageManager.getCertificateCount(),
            browser: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Reinicia a aplicação
     */
    restart: function() {
        DebugUtils.log('Reiniciando aplicação GRAVE');
        window.location.reload();
    },

    /**
     * Limpa todos os dados da aplicação
     */
    clearAllData: function() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            StorageManager.clear();
            this.restart();
        }
    }
};

// Utilitários para desenvolvimento e debug
const DevUtils = {
    /**
     * Habilita modo de desenvolvimento
     */
    enableDevMode: function() {
        window.GRAVE = GraveApp;
        window.GRAVE_DEBUG = {
            NavigationManager,
            FormValidator,
            TemplateManager,
            CertificateGenerator,
            StorageManager,
            NotificationManager
        };
        
        console.log('Modo de desenvolvimento habilitado. Use window.GRAVE para acessar a aplicação.');
    },

    /**
     * Gera dados de teste para o formulário
     */
    fillTestData: function() {
        const testData = {
            certificateType: 'participacao',
            participantName: 'João Silva Santos',
            activityName: 'Curso Básico de Primeiros Socorros',
            startDate: '2024-01-15',
            endDate: '2024-01-19',
            workload: '40',
            instructor: 'Dr. Maria Oliveira',
            template: 'classic'
        };

        Object.keys(testData).forEach(key => {
            const selector = DOM_SELECTORS.form[key.replace(/([A-Z])/g, '-$1').toLowerCase()];
            if (selector) {
                DOMUtils.setValue(selector, testData[key]);
            }
        });

        console.log('Dados de teste preenchidos');
    },

    /**
     * Exporta dados do sistema
     */
    exportSystemData: function() {
        const data = {
            systemInfo: GraveApp.getSystemInfo(),
            formData: FormStorageManager.loadFormData(),
            settings: SettingsStorageManager.loadSettings(),
            history: HistoryStorageManager.getHistory()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `grave_export_${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('Dados do sistema exportados');
    }
};

// Verificar se está em ambiente de desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    DevUtils.enableDevMode();
}

// Event listener para quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    DebugUtils.log('DOM carregado, iniciando GRAVE');
    GraveApp.init();
});

// Event listener para quando a página estiver completamente carregada
window.addEventListener('load', function() {
    DebugUtils.log('Página completamente carregada');
    
    // Otimizações pós-carregamento
    setTimeout(() => {
        // Preload de templates se necessário
        if (!NavigationUtils.isCurrentSection('templates')) {
            TemplateManager.getAllTemplates(); // Cache templates
        }
    }, 2000);
});

// Exportar para escopo global (se necessário)
window.GraveApp = GraveApp;