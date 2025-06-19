/**
 * GRAVE - Sistema de Certificados Comunitários
 * JavaScript Principal
 * Usando jQuery para manipulação DOM e funcionalidades
 */

$(document).ready(function() {
    'use strict';

    // Configurações globais
    const GRAVE = {
        version: '1.0.0',
        debug: true,
        storage: {
            prefix: 'grave_certificados_'
        },
        animation: {
            duration: 300,
            easing: 'ease-in-out'
        }
    };

    // Utilitários de Debug
    const Debug = {
        log: function(message, data = null) {
            if (GRAVE.debug) {
                console.log(`[GRAVE] ${message}`, data || '');
            }
        },
        error: function(message, error = null) {
            console.error(`[GRAVE ERROR] ${message}`, error || '');
        }
    };

    // Sistema de Storage Local
    const Storage = {
        set: function(key, value) {
            try {
                const fullKey = GRAVE.storage.prefix + key;
                localStorage.setItem(fullKey, JSON.stringify(value));
                Debug.log(`Storage SET: ${key}`, value);
                return true;
            } catch (error) {
                Debug.error(`Erro ao salvar no storage: ${key}`, error);
                return false;
            }
        },

        get: function(key, defaultValue = null) {
            try {
                const fullKey = GRAVE.storage.prefix + key;
                const value = localStorage.getItem(fullKey);
                if (value === null) {
                    return defaultValue;
                }
                const parsed = JSON.parse(value);
                Debug.log(`Storage GET: ${key}`, parsed);
                return parsed;
            } catch (error) {
                Debug.error(`Erro ao recuperar do storage: ${key}`, error);
                return defaultValue;
            }
        },

        remove: function(key) {
            try {
                const fullKey = GRAVE.storage.prefix + key;
                localStorage.removeItem(fullKey);
                Debug.log(`Storage REMOVE: ${key}`);
                return true;
            } catch (error) {
                Debug.error(`Erro ao remover do storage: ${key}`, error);
                return false;
            }
        },

        clear: function() {
            try {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith(GRAVE.storage.prefix)) {
                        localStorage.removeItem(key);
                    }
                });
                Debug.log('Storage limpo completamente');
                return true;
            } catch (error) {
                Debug.error('Erro ao limpar storage', error);
                return false;
            }
        }
    };

    // Utilitários de Formatação
    const Format = {
        cpf: function(value) {
            if (!value) return '';
            
            // Remove tudo que não é número
            const numbers = value.replace(/\D/g, '');
            
            // Aplica a máscara
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        },

        cnpj: function(value) {
            if (!value) return '';
            
            // Remove tudo que não é número
            const numbers = value.replace(/\D/g, '');
            
            // Aplica a máscara
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        },

        phone: function(value) {
            if (!value) return '';
            
            // Remove tudo que não é número
            const numbers = value.replace(/\D/g, '');
            
            // Aplica a máscara baseada no tamanho
            if (numbers.length === 11) {
                return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (numbers.length === 10) {
                return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            
            return value;
        },

        date: function(dateString) {
            if (!dateString) return '';
            
            try {
                const date = new Date(dateString);
                const day = date.getDate();
                const monthNames = [
                    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
                    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
                ];
                const month = monthNames[date.getMonth()];
                const year = date.getFullYear();
                
                return `${day} DE ${month} DE ${year}`;
            } catch (error) {
                Debug.error('Erro ao formatar data', error);
                return dateString;
            }
        },

        currency: function(value) {
            if (!value) return 'R$ 0,00';
            
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        }
    };

    // Validações
    const Validate = {
        cpf: function(cpf) {
            if (!cpf) return false;
            
            // Remove formatação
            cpf = cpf.replace(/\D/g, '');
            
            // Verifica se tem 11 dígitos
            if (cpf.length !== 11) return false;
            
            // Verifica se não são todos iguais
            if (/^(\d)\1{10}$/.test(cpf)) return false;
            
            // Validação dos dígitos verificadores
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let remainder = 11 - (sum % 11);
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.charAt(9))) return false;
            
            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf.charAt(i)) * (11 - i);
            }
            remainder = 11 - (sum % 11);
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.charAt(10))) return false;
            
            return true;
        },

        cnpj: function(cnpj) {
            if (!cnpj) return false;
            
            // Remove formatação
            cnpj = cnpj.replace(/\D/g, '');
            
            // Verifica se tem 14 dígitos
            if (cnpj.length !== 14) return false;
            
            // Verifica se não são todos iguais
            if (/^(\d)\1{13}$/.test(cnpj)) return false;
            
            // Validação dos dígitos verificadores
            let size = cnpj.length - 2;
            let numbers = cnpj.substring(0, size);
            let digits = cnpj.substring(size);
            let sum = 0;
            let pos = size - 7;
            
            for (let i = size; i >= 1; i--) {
                sum += numbers.charAt(size - i) * pos--;
                if (pos < 2) pos = 9;
            }
            
            let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
            if (result !== parseInt(digits.charAt(0))) return false;
            
            size = size + 1;
            numbers = cnpj.substring(0, size);
            sum = 0;
            pos = size - 7;
            
            for (let i = size; i >= 1; i--) {
                sum += numbers.charAt(size - i) * pos--;
                if (pos < 2) pos = 9;
            }
            
            result = sum % 11 < 2 ? 0 : 11 - sum % 11;
            if (result !== parseInt(digits.charAt(1))) return false;
            
            return true;
        },

        email: function(email) {
            if (!email) return false;
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        required: function(value) {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        }
    };

    // Sistema de Notificações
    const Notification = {
        show: function(message, type = 'info', duration = 5000) {
            // Remove notificações existentes
            $('.notification').remove();
            
            // Cria a notificação
            const notification = $(`
                <div class="notification alert alert-${type} position-fixed" 
                     style="top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${message}</span>
                        <button type="button" class="btn-close ms-3" aria-label="Fechar"></button>
                    </div>
                </div>
            `);
            
            // Adiciona ao body
            $('body').append(notification);
            
            // Animação de entrada
            notification.hide().fadeIn(GRAVE.animation.duration);
            
            // Remove automaticamente
            setTimeout(() => {
                notification.fadeOut(GRAVE.animation.duration, function() {
                    $(this).remove();
                });
            }, duration);
            
            // Event listener para botão fechar
            notification.find('.btn-close').on('click', function() {
                notification.fadeOut(GRAVE.animation.duration, function() {
                    $(this).remove();
                });
            });
            
            Debug.log(`Notificação mostrada: ${type}`, message);
        },

        success: function(message, duration = 5000) {
            this.show(message, 'success', duration);
        },

        error: function(message, duration = 8000) {
            this.show(message, 'danger', duration);
        },

        warning: function(message, duration = 6000) {
            this.show(message, 'warning', duration);
        },

        info: function(message, duration = 5000) {
            this.show(message, 'info', duration);
        }
    };

    // Sistema de Loading
    const Loading = {
        show: function(target = 'body', message = 'Carregando...') {
            const loadingId = 'loading-' + Date.now();
            const loading = $(`
                <div id="${loadingId}" class="loading-overlay position-fixed d-flex align-items-center justify-content-center"
                     style="top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9998;">
                    <div class="bg-white p-4 rounded-lg text-center">
                        <div class="spinner mb-3"></div>
                        <div>${message}</div>
                    </div>
                </div>
            `);
            
            $(target).append(loading);
            loading.hide().fadeIn(GRAVE.animation.duration);
            
            return loadingId;
        },

        hide: function(loadingId) {
            $(`#${loadingId}`).fadeOut(GRAVE.animation.duration, function() {
                $(this).remove();
            });
        }
    };

    // Utilitários de Formulário
    const Form = {
        setupMasks: function() {
            // Máscara para CPF
            $(document).on('input', 'input[data-mask="cpf"]', function() {
                const value = $(this).val();
                $(this).val(Format.cpf(value));
            });
            
            // Máscara para CNPJ
            $(document).on('input', 'input[data-mask="cnpj"]', function() {
                const value = $(this).val();
                $(this).val(Format.cnpj(value));
            });
            
            // Máscara para telefone
            $(document).on('input', 'input[data-mask="phone"]', function() {
                const value = $(this).val();
                $(this).val(Format.phone(value));
            });
            
            Debug.log('Máscaras de input configuradas');
        },

        validate: function(form) {
            let isValid = true;
            const errors = [];
            
            $(form).find('input[required], select[required], textarea[required]').each(function() {
                const $field = $(this);
                const value = $field.val();
                const fieldName = $field.attr('name') || $field.attr('id') || 'Campo';
                
                // Remove classes de erro anteriores
                $field.removeClass('is-invalid');
                $field.siblings('.form-error').remove();
                
                // Validação de campo obrigatório
                if (!Validate.required(value)) {
                    isValid = false;
                    errors.push(`${fieldName} é obrigatório`);
                    $field.addClass('is-invalid');
                    $field.after(`<div class="form-error">${fieldName} é obrigatório</div>`);
                    return;
                }
                
                // Validações específicas por tipo
                const fieldType = $field.attr('data-validate');
                
                if (fieldType === 'cpf' && !Validate.cpf(value)) {
                    isValid = false;
                    errors.push(`${fieldName} inválido`);
                    $field.addClass('is-invalid');
                    $field.after(`<div class="form-error">${fieldName} inválido</div>`);
                }
                
                if (fieldType === 'cnpj' && !Validate.cnpj(value)) {
                    isValid = false;
                    errors.push(`${fieldName} inválido`);
                    $field.addClass('is-invalid');
                    $field.after(`<div class="form-error">${fieldName} inválido</div>`);
                }
                
                if (fieldType === 'email' && !Validate.email(value)) {
                    isValid = false;
                    errors.push(`${fieldName} inválido`);
                    $field.addClass('is-invalid');
                    $field.after(`<div class="form-error">${fieldName} inválido</div>`);
                }
                
                // Se passou na validação, marca como válido
                if (isValid) {
                    $field.addClass('is-valid');
                }
            });
            
            if (!isValid) {
                Debug.log('Formulário inválido', errors);
                Notification.error('Por favor, corrija os erros no formulário');
            }
            
            return isValid;
        },

        serialize: function(form) {
            const data = {};
            
            $(form).find('input, select, textarea').each(function() {
                const $field = $(this);
                const name = $field.attr('name') || $field.attr('id');
                
                if (name && $field.val()) {
                    data[name] = $field.val();
                }
            });
            
            Debug.log('Formulário serializado', data);
            return data;
        }
    };

    // Navegação e Roteamento
    const Navigation = {
        updateActiveLink: function() {
            const currentPath = window.location.pathname;
            
            $('.nav-link').removeClass('active');
            $(`.nav-link[href="${currentPath}"]`).addClass('active');
            
            // Fallback para páginas dentro de subdiretórios
            $('.nav-link').each(function() {
                const href = $(this).attr('href');
                if (currentPath.includes(href.replace('.html', ''))) {
                    $(this).addClass('active');
                }
            });
            
            Debug.log('Link ativo atualizado', currentPath);
        },

        goTo: function(url) {
            window.location.href = url;
        }
    };

    // Sistema de Modais
    const Modal = {
        show: function(modalId) {
            $(`#${modalId}`).addClass('show').css('display', 'flex');
            $('body').addClass('modal-open');
            Debug.log(`Modal aberto: ${modalId}`);
        },

        hide: function(modalId) {
            $(`#${modalId}`).removeClass('show').css('display', 'none');
            $('body').removeClass('modal-open');
            Debug.log(`Modal fechado: ${modalId}`);
        },

        setup: function() {
            // Event listeners para modais
            $(document).on('click', '[data-modal-target]', function(e) {
                e.preventDefault();
                const target = $(this).attr('data-modal-target');
                Modal.show(target);
            });
            
            $(document).on('click', '[data-modal-close]', function(e) {
                e.preventDefault();
                const target = $(this).attr('data-modal-close');
                Modal.hide(target);
            });
            
            // Fechar modal clicando fora
            $(document).on('click', '.modal', function(e) {
                if (e.target === this) {
                    const modalId = $(this).attr('id');
                    Modal.hide(modalId);
                }
            });
            
            Debug.log('Sistema de modais configurado');
        }
    };

    // Inicialização da aplicação
    const App = {
        init: function() {
            Debug.log('Inicializando aplicação GRAVE');
            
            // Configurar sistemas básicos
            Form.setupMasks();
            Modal.setup();
            Navigation.updateActiveLink();
            
            // Event listeners globais
            this.setupEventListeners();
            
            // Carregar dados salvos se existirem
            this.loadSavedData();
            
            Notification.success('Sistema carregado com sucesso!', 3000);
            Debug.log('Aplicação inicializada com sucesso');
        },

        setupEventListeners: function() {
            // Smooth scroll para âncoras
            $(document).on('click', 'a[href^="#"]', function(e) {
                e.preventDefault();
                const target = $($(this).attr('href'));
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 800);
                }
            });
            
            // Validação em tempo real
            $(document).on('blur', 'input[required], select[required], textarea[required]', function() {
                const $field = $(this);
                const value = $field.val();
                
                $field.removeClass('is-invalid is-valid');
                $field.siblings('.form-error').remove();
                
                if (Validate.required(value)) {
                    $field.addClass('is-valid');
                } else {
                    $field.addClass('is-invalid');
                    $field.after('<div class="form-error">Este campo é obrigatório</div>');
                }
            });
            
            Debug.log('Event listeners globais configurados');
        },

        loadSavedData: function() {
            // Verificar se há dados salvos e carregar se necessário
            const organizacao = Storage.get('organizacao');
            const evento = Storage.get('evento');
            
            if (organizacao) {
                Debug.log('Dados da organização carregados', organizacao);
            }
            
            if (evento) {
                Debug.log('Dados do evento carregados', evento);
            }
        }
    };

    // Exposição global para uso em outras páginas
    window.GRAVE = {
        Storage,
        Format,
        Validate,
        Notification,
        Loading,
        Form,
        Navigation,
        Modal,
        Debug
    };

    // Inicializar aplicação quando DOM estiver pronto
    App.init();
});