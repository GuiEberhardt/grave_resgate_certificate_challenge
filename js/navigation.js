/**
 * Gerenciamento de navegação do sistema GRAVE
 */

const NavigationManager = {
    currentSection: 'home',

    /**
     * Inicializa o sistema de navegação
     */
    init: function() {
        this.setupNavigationEvents();
        this.handleInitialRoute();
        DebugUtils.log('Sistema de navegação inicializado');
    },

    /**
     * Configura eventos de navegação
     */
    setupNavigationEvents: function() {
        // Event listeners para links de navegação
        const navLinks = document.querySelectorAll(DOM_SELECTORS.navigation.navLinks);
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Event listener para logo/brand
        const brandLink = document.querySelector(DOM_SELECTORS.navigation.brandLink);
        if (brandLink) {
            brandLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('home');
            });
        }

        // Event listeners para botões de navegação na home
        const homeButtons = document.querySelectorAll('.btn[data-section]');
        homeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const section = button.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Fechar menu mobile após clique
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const toggleButton = document.querySelector('.navbar-toggler');
                    if (toggleButton) {
                        toggleButton.click();
                    }
                }
            });
        });
    },

    /**
     * Mostra uma seção específica
     * @param {string} sectionName - Nome da seção
     */
    showSection: function(sectionName) {
        if (!this.isValidSection(sectionName)) {
            DebugUtils.error(`Seção inválida: ${sectionName}`);
            return;
        }

        try {
            // Esconder todas as seções
            this.hideAllSections();

            // Mostrar seção alvo
            const targetSection = document.querySelector(`#${sectionName}`);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
                
                // Adicionar animação
                AnimationUtils.slideUp(targetSection);
            }

            // Atualizar navegação
            this.updateNavigationState(sectionName);

            // Executar ações específicas da seção
            this.handleSectionLoad(sectionName);

            // Atualizar seção atual
            this.currentSection = sectionName;

            // Atualizar URL (sem reload)
            this.updateURL(sectionName);

            DebugUtils.log(`Navegação para seção: ${sectionName}`);

        } catch (error) {
            DebugUtils.error('Erro ao navegar para seção', error);
        }
    },

    /**
     * Esconde todas as seções
     */
    hideAllSections: function() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
    },

    /**
     * Atualiza estado da navegação
     * @param {string} activeSection - Seção ativa
     */
    updateNavigationState: function(activeSection) {
        // Remover estado ativo de todos os links
        const navLinks = document.querySelectorAll(DOM_SELECTORS.navigation.navLinks);
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Adicionar estado ativo ao link correspondente
        const activeLink = document.querySelector(`[data-section="${activeSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    },

    /**
     * Trata carregamento específico de cada seção
     * @param {string} sectionName - Nome da seção
     */
    handleSectionLoad: function(sectionName) {
        switch (sectionName) {
            case 'home':
                this.loadHomeSection();
                break;
            case 'generator':
                this.loadGeneratorSection();
                break;
            case 'templates':
                this.loadTemplatesSection();
                break;
            case 'about':
                this.loadAboutSection();
                break;
        }
    },

    /**
     * Carrega seção inicial
     */
    loadHomeSection: function() {
        // Atualizar contador de certificados
        const savedCount = StatsStorageManager.getCertificateCount();
        const counterElement = document.querySelector(DOM_SELECTORS.stats.certificatesGenerated);
        if (counterElement) {
            counterElement.textContent = savedCount;
        }
    },

    /**
     * Carrega seção do gerador
     */
    loadGeneratorSection: function() {
        // Restaurar dados salvos do formulário
        const savedFormData = FormStorageManager.loadFormData();
        if (savedFormData) {
            FormStorageManager.restoreFormData(savedFormData);
            
            // Auto-gerar preview se dados estão completos
            setTimeout(() => {
                if (CertificateGenerator.isFormComplete()) {
                    CertificateGenerator.generatePreview();
                }
            }, 500);
        }
    },

    /**
     * Carrega seção de templates
     */
    loadTemplatesSection: function() {
        // Renderizar galeria de templates
        TemplateManager.renderGallery();
        
        // Destacar template selecionado se houver
        const currentTemplate = DOMUtils.getValue(DOM_SELECTORS.form.template);
        if (currentTemplate) {
            TemplateManager.updateTemplateSelection(currentTemplate);
        }
    },

    /**
     * Carrega seção sobre
     */
    loadAboutSection: function() {
        // Nenhuma ação específica necessária
        DebugUtils.log('Seção sobre carregada');
    },

    /**
     * Verifica se uma seção é válida
     * @param {string} sectionName - Nome da seção
     * @returns {boolean} Se é válida
     */
    isValidSection: function(sectionName) {
        const validSections = ['home', 'generator', 'templates', 'about'];
        return validSections.includes(sectionName);
    },

    /**
     * Obtém seção atual
     * @returns {string} Nome da seção atual
     */
    getCurrentSection: function() {
        return this.currentSection;
    },

    /**
     * Trata rota inicial baseada na URL
     */
    handleInitialRoute: function() {
        const hash = window.location.hash.replace('#', '');
        const initialSection = hash && this.isValidSection(hash) ? hash : 'home';
        this.showSection(initialSection);
    },

    /**
     * Atualiza URL sem recarregar a página
     * @param {string} sectionName - Nome da seção
     */
    updateURL: function(sectionName) {
        if (history.pushState) {
            const newURL = `${window.location.pathname}#${sectionName}`;
            history.pushState({ section: sectionName }, '', newURL);
        }
    },

    /**
     * Navega para trás
     */
    goBack: function() {
        history.back();
    },

    /**
     * Navega para frente
     */
    goForward: function() {
        history.forward();
    }
};

// Gerenciador de histórico do navegador
const BrowserHistoryManager = {
    /**
     * Inicializa gerenciamento de histórico
     */
    init: function() {
        this.setupPopstateHandler();
    },

    /**
     * Configura handler para navegação do navegador
     */
    setupPopstateHandler: function() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.section) {
                NavigationManager.showSection(event.state.section);
            } else {
                // Fallback para hash
                const hash = window.location.hash.replace('#', '');
                const section = hash && NavigationManager.isValidSection(hash) ? hash : 'home';
                NavigationManager.showSection(section);
            }
        });
    }
};

// Gerenciador de breadcrumbs (se necessário no futuro)
const BreadcrumbManager = {
    /**
     * Atualiza breadcrumbs
     * @param {string} currentSection - Seção atual
     */
    update: function(currentSection) {
        const breadcrumbContainer = document.querySelector('.breadcrumb-container');
        if (!breadcrumbContainer) return;

        const sectionNames = {
            'home': 'Início',
            'generator': 'Gerador de Certificados',
            'templates': 'Galeria de Templates',
            'about': 'Sobre o GRAVE'
        };

        const breadcrumbHTML = `
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#home" data-section="home">Início</a>
                    </li>
                    ${currentSection !== 'home' ? `
                        <li class="breadcrumb-item active" aria-current="page">
                            ${sectionNames[currentSection] || currentSection}
                        </li>
                    ` : ''}
                </ol>
            </nav>
        `;

        breadcrumbContainer.innerHTML = breadcrumbHTML;

        // Adicionar event listeners aos links
        const breadcrumbLinks = breadcrumbContainer.querySelectorAll('a[data-section]');
        breadcrumbLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                NavigationManager.showSection(section);
            });
        });
    }
};

// Utilitários de navegação
const NavigationUtils = {
    /**
     * Verifica se está na seção especificada
     * @param {string} sectionName - Nome da seção
     * @returns {boolean} Se está na seção
     */
    isCurrentSection: function(sectionName) {
        return NavigationManager.getCurrentSection() === sectionName;
    },

    /**
     * Obtém elemento da seção atual
     * @returns {HTMLElement|null} Elemento da seção
     */
    getCurrentSectionElement: function() {
        const currentSection = NavigationManager.getCurrentSection();
        return document.querySelector(`#${currentSection}`);
    },

    /**
     * Verifica se uma seção está visível
     * @param {string} sectionName - Nome da seção
     * @returns {boolean} Se está visível
     */
    isSectionVisible: function(sectionName) {
        const section = document.querySelector(`#${sectionName}`);
        return section && section.classList.contains('active');
    }
};