/**
 * Funções utilitárias do sistema GRAVE
 */

// Utilitários de data
const DateUtils = {
    /**
     * Formata uma data para o padrão brasileiro
     * @param {string|Date} date - Data a ser formatada
     * @returns {string} Data formatada
     */
    formatToBrazilian: function(date) {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return dateObj.toLocaleDateString('pt-BR');
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return '';
        }
    },

    /**
     * Valida se uma data é válida
     * @param {string} dateString - String da data
     * @returns {boolean} Se a data é válida
     */
    isValidDate: function(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    },

    /**
     * Verifica se a data de início é anterior à data de fim
     * @param {string} startDate - Data de início
     * @param {string} endDate - Data de fim
     * @returns {boolean} Se as datas são válidas
     */
    validateDateRange: function(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return start <= end;
    },

    /**
     * Obtém a data atual formatada
     * @returns {string} Data atual em formato brasileiro
     */
    getCurrentDate: function() {
        return new Date().toLocaleDateString('pt-BR');
    }
};

// Utilitários de string
const StringUtils = {
    /**
     * Capitaliza a primeira letra de cada palavra
     * @param {string} str - String a ser capitalizada
     * @returns {string} String capitalizada
     */
    capitalize: function(str) {
        if (!str) return '';
        return str.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
    },

    /**
     * Remove espaços extras e normaliza string
     * @param {string} str - String a ser normalizada
     * @returns {string} String normalizada
     */
    normalize: function(str) {
        if (!str) return '';
        return str.trim().replace(/\s+/g, ' ');
    },

    /**
     * Valida se a string contém apenas letras e espaços
     * @param {string} str - String a ser validada
     * @returns {boolean} Se é válida
     */
    isValidName: function(str) {
        const pattern = /^[a-zA-ZÀ-ÿ\s]+$/;
        return pattern.test(str);
    },

    /**
     * Gera um slug a partir de uma string
     * @param {string} str - String original
     * @returns {string} Slug gerado
     */
    generateSlug: function(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '_')
            .trim();
    }
};

// Utilitários de DOM
const DOMUtils = {
    /**
     * Obtém elemento por ID com verificação
     * @param {string} id - ID do elemento
     * @returns {HTMLElement|null} Elemento encontrado
     */
    getElementById: function(id) {
        const element = document.getElementById(id.replace('#', ''));
        if (!element) {
            console.warn(`Elemento com ID "${id}" não encontrado`);
        }
        return element;
    },

    /**
     * Obtém elementos por seletor
     * @param {string} selector - Seletor CSS
     * @returns {NodeList} Lista de elementos
     */
    querySelectorAll: function(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Adiciona classe com verificação
     * @param {HTMLElement} element - Elemento
     * @param {string} className - Nome da classe
     */
    addClass: function(element, className) {
        if (element && element.classList) {
            element.classList.add(className);
        }
    },

    /**
     * Remove classe com verificação
     * @param {HTMLElement} element - Elemento
     * @param {string} className - Nome da classe
     */
    removeClass: function(element, className) {
        if (element && element.classList) {
            element.classList.remove(className);
        }
    },

    /**
     * Alterna classe
     * @param {HTMLElement} element - Elemento
     * @param {string} className - Nome da classe
     */
    toggleClass: function(element, className) {
        if (element && element.classList) {
            element.classList.toggle(className);
        }
    },

    /**
     * Define valor de input com verificação
     * @param {string} selector - Seletor do input
     * @param {string} value - Valor a ser definido
     */
    setValue: function(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.value = value || '';
        }
    },

    /**
     * Obtém valor de input
     * @param {string} selector - Seletor do input
     * @returns {string} Valor do input
     */
    getValue: function(selector) {
        const element = document.querySelector(selector);
        return element ? element.value.trim() : '';
    }
};

// Utilitários de animação
const AnimationUtils = {
    /**
     * Adiciona animação de fade in
     * @param {HTMLElement} element - Elemento a ser animado
     * @param {number} duration - Duração da animação em ms
     */
    fadeIn: function(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            element.style.opacity = percentage;
            
            if (percentage < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },

    /**
     * Adiciona animação de slide up
     * @param {HTMLElement} element - Elemento a ser animado
     */
    slideUp: function(element) {
        if (!element) return;
        
        element.style.transform = 'translateY(20px)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 10);
    }
};

// Utilitários de validação
const ValidationUtils = {
    /**
     * Valida email
     * @param {string} email - Email a ser validado
     * @returns {boolean} Se é válido
     */
    isValidEmail: function(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    },

    /**
     * Valida número de telefone brasileiro
     * @param {string} phone - Telefone a ser validado
     * @returns {boolean} Se é válido
     */
    isValidBrazilianPhone: function(phone) {
        const pattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return pattern.test(phone);
    },

    /**
     * Valida se string está dentro do comprimento permitido
     * @param {string} str - String a ser validada
     * @param {number} min - Comprimento mínimo
     * @param {number} max - Comprimento máximo
     * @returns {boolean} Se é válida
     */
    isValidLength: function(str, min, max) {
        if (!str) return false;
        const length = str.trim().length;
        return length >= min && length <= max;
    }
};

// Utilitários de formatação
const FormatUtils = {
    /**
     * Formata número para exibição
     * @param {number} num - Número a ser formatado
     * @returns {string} Número formatado
     */
    formatNumber: function(num) {
        return new Intl.NumberFormat('pt-BR').format(num);
    },

    /**
     * Formata texto para exibição em certificado
     * @param {string} text - Texto a ser formatado
     * @returns {string} Texto formatado
     */
    formatCertificateText: function(text) {
        if (!text) return '';
        return StringUtils.normalize(StringUtils.capitalize(text));
    }
};

// Utilitários de debugging
const DebugUtils = {
    /**
     * Log com informações de debug
     * @param {string} message - Mensagem
     * @param {any} data - Dados adicionais
     */
    log: function(message, data = null) {
        if (console && console.log) {
            if (data) {
                console.log(`[GRAVE] ${message}`, data);
            } else {
                console.log(`[GRAVE] ${message}`);
            }
        }
    },

    /**
     * Log de erro
     * @param {string} message - Mensagem de erro
     * @param {Error} error - Objeto de erro
     */
    error: function(message, error = null) {
        if (console && console.error) {
            if (error) {
                console.error(`[GRAVE ERROR] ${message}`, error);
            } else {
                console.error(`[GRAVE ERROR] ${message}`);
            }
        }
    }
};