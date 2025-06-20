/**
 * Gerenciamento de armazenamento local do sistema GRAVE
 */

const StorageManager = {
    /**
     * Salva dados no localStorage
     * @param {string} key - Chave do dado
     * @param {any} data - Dados a serem salvos
     * @returns {boolean} Se salvou com sucesso
     */
    save: function(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            DebugUtils.log(`Dados salvos com chave: ${key}`);
            return true;
        } catch (error) {
            DebugUtils.error('Erro ao salvar dados no localStorage', error);
            return false;
        }
    },

    /**
     * Carrega dados do localStorage
     * @param {string} key - Chave do dado
     * @returns {any} Dados carregados ou null
     */
    load: function(key) {
        try {
            const jsonData = localStorage.getItem(key);
            if (jsonData) {
                const data = JSON.parse(jsonData);
                DebugUtils.log(`Dados carregados com chave: ${key}`);
                return data;
            }
            return null;
        } catch (error) {
            DebugUtils.error('Erro ao carregar dados do localStorage', error);
            return null;
        }
    },

    /**
     * Remove dados do localStorage
     * @param {string} key - Chave do dado
     * @returns {boolean} Se removeu com sucesso
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            DebugUtils.log(`Dados removidos com chave: ${key}`);
            return true;
        } catch (error) {
            DebugUtils.error('Erro ao remover dados do localStorage', error);
            return false;
        }
    },

    /**
     * Verifica se existe uma chave no localStorage
     * @param {string} key - Chave a ser verificada
     * @returns {boolean} Se existe
     */
    exists: function(key) {
        return localStorage.getItem(key) !== null;
    },

    /**
     * Limpa todo o localStorage relacionado ao GRAVE
     * @returns {boolean} Se limpou com sucesso
     */
    clear: function() {
        try {
            Object.values(GRAVE_CONFIG.localStorage.keys).forEach(key => {
                localStorage.removeItem(key);
            });
            DebugUtils.log('Todos os dados do GRAVE foram removidos');
            return true;
        } catch (error) {
            DebugUtils.error('Erro ao limpar dados do localStorage', error);
            return false;
        }
    }
};

// Gerenciador específico para dados de formulário
const FormStorageManager = {
    /**
     * Salva dados do formulário
     * @param {Object} formData - Dados do formulário
     * @returns {boolean} Se salvou com sucesso
     */
    saveFormData: function(formData) {
        const dataToSave = {
            ...formData,
            timestamp: new Date().getTime()
        };
        return StorageManager.save(GRAVE_CONFIG.localStorage.keys.formData, dataToSave);
    },

    /**
     * Carrega dados do formulário
     * @returns {Object|null} Dados do formulário
     */
    loadFormData: function() {
        const data = StorageManager.load(GRAVE_CONFIG.localStorage.keys.formData);
        if (data && data.timestamp) {
            // Verifica se os dados não são muito antigos (24 horas)
            const hoursDiff = (new Date().getTime() - data.timestamp) / (1000 * 60 * 60);
            if (hoursDiff > 24) {
                this.clearFormData();
                return null;
            }
        }
        return data;
    },

    /**
     * Remove dados do formulário
     * @returns {boolean} Se removeu com sucesso
     */
    clearFormData: function() {
        return StorageManager.remove(GRAVE_CONFIG.localStorage.keys.formData);
    },

    /**
     * Coleta dados atuais do formulário
     * @returns {Object} Dados do formulário
     */
    collectCurrentFormData: function() {
        return {
            certificateType: DOMUtils.getValue(DOM_SELECTORS.form.certificateType),
            participantName: DOMUtils.getValue(DOM_SELECTORS.form.participantName),
            activityName: DOMUtils.getValue(DOM_SELECTORS.form.activityName),
            startDate: DOMUtils.getValue(DOM_SELECTORS.form.startDate),
            endDate: DOMUtils.getValue(DOM_SELECTORS.form.endDate),
            workload: DOMUtils.getValue(DOM_SELECTORS.form.workload),
            instructor: DOMUtils.getValue(DOM_SELECTORS.form.instructor),
            template: DOMUtils.getValue(DOM_SELECTORS.form.template)
        };
    },

    /**
     * Restaura dados do formulário na interface
     * @param {Object} formData - Dados do formulário
     */
    restoreFormData: function(formData) {
        if (!formData) return;

        Object.keys(formData).forEach(key => {
            if (key === 'timestamp') return;
            
            const selector = DOM_SELECTORS.form[key.replace(/([A-Z])/g, '-$1').toLowerCase()];
            if (selector && formData[key]) {
                DOMUtils.setValue(selector, formData[key]);
            }
        });

        DebugUtils.log('Dados do formulário restaurados');
    }
};

// Gerenciador de estatísticas
const StatsStorageManager = {
    /**
     * Incrementa contador de certificados
     * @returns {number} Novo valor do contador
     */
    incrementCertificateCount: function() {
        let count = this.getCertificateCount();
        count++;
        StorageManager.save(GRAVE_CONFIG.localStorage.keys.certificateCount, count);
        return count;
    },

    /**
     * Obtém contador de certificados
     * @returns {number} Contador atual
     */
    getCertificateCount: function() {
        const count = StorageManager.load(GRAVE_CONFIG.localStorage.keys.certificateCount);
        return typeof count === 'number' ? count : 0;
    },

    /**
     * Define contador de certificados
     * @param {number} count - Novo valor do contador
     * @returns {boolean} Se salvou com sucesso
     */
    setCertificateCount: function(count) {
        const numCount = parseInt(count, 10);
        if (isNaN(numCount) || numCount < 0) {
            DebugUtils.error('Valor inválido para contador de certificados');
            return false;
        }
        return StorageManager.save(GRAVE_CONFIG.localStorage.keys.certificateCount, numCount);
    },

    /**
     * Reseta contador de certificados
     * @returns {boolean} Se resetou com sucesso
     */
    resetCertificateCount: function() {
        return this.setCertificateCount(0);
    }
};

// Gerenciador de configurações
const SettingsStorageManager = {
    /**
     * Salva configurações do usuário
     * @param {Object} settings - Configurações
     * @returns {boolean} Se salvou com sucesso
     */
    saveSettings: function(settings) {
        const defaultSettings = this.getDefaultSettings();
        const mergedSettings = { ...defaultSettings, ...settings };
        return StorageManager.save(GRAVE_CONFIG.localStorage.keys.settings, mergedSettings);
    },

    /**
     * Carrega configurações do usuário
     * @returns {Object} Configurações
     */
    loadSettings: function() {
        const settings = StorageManager.load(GRAVE_CONFIG.localStorage.keys.settings);
        return settings || this.getDefaultSettings();
    },

    /**
     * Obtém configurações padrão
     * @returns {Object} Configurações padrão
     */
    getDefaultSettings: function() {
        return {
            autoSave: true,
            defaultTemplate: 'classic',
            notifications: true,
            theme: 'light'
        };
    },

    /**
     * Atualiza uma configuração específica
     * @param {string} key - Chave da configuração
     * @param {any} value - Valor da configuração
     * @returns {boolean} Se atualizou com sucesso
     */
    updateSetting: function(key, value) {
        const currentSettings = this.loadSettings();
        currentSettings[key] = value;
        return this.saveSettings(currentSettings);
    },

    /**
     * Obtém uma configuração específica
     * @param {string} key - Chave da configuração
     * @returns {any} Valor da configuração
     */
    getSetting: function(key) {
        const settings = this.loadSettings();
        return settings[key];
    }
};

// Gerenciador de histórico de certificados
const HistoryStorageManager = {
    /**
     * Adiciona certificado ao histórico
     * @param {Object} certificateData - Dados do certificado
     * @returns {boolean} Se adicionou com sucesso
     */
    addCertificate: function(certificateData) {
        try {
            const history = this.getHistory();
            const certificateRecord = {
                id: this.generateId(),
                ...certificateData,
                createdAt: new Date().toISOString(),
                status: 'generated'
            };
            
            history.push(certificateRecord);
            
            // Mantém apenas os últimos 100 certificados
            if (history.length > 100) {
                history.splice(0, history.length - 100);
            }
            
            return StorageManager.save('graveHistory', history);
        } catch (error) {
            DebugUtils.error('Erro ao adicionar certificado ao histórico', error);
            return false;
        }
    },

    /**
     * Obtém histórico de certificados
     * @returns {Array} Lista de certificados
     */
    getHistory: function() {
        const history = StorageManager.load('graveHistory');
        return Array.isArray(history) ? history : [];
    },

    /**
     * Gera ID único para certificado
     * @returns {string} ID único
     */
    generateId: function() {
        return `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Limpa histórico
     * @returns {boolean} Se limpou com sucesso
     */
    clearHistory: function() {
        return StorageManager.remove('graveHistory');
    }
};