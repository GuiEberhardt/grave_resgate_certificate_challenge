/**
 * GRAVE - Sistema de Certificados Comunitários
 * Validações avançadas de formulários
 */

$(document).ready(function() {
    'use strict';

    // Namespace para validações avançadas
    window.FormValidation = {
        
        // Regras de validação customizadas
        rules: {
            // Validação de nome completo
            fullName: function(value) {
                if (!value) return { valid: false, message: 'Nome é obrigatório' };
                
                const trimmed = value.trim();
                const words = trimmed.split(/\s+/);
                
                if (words.length < 2) {
                    return { valid: false, message: 'Digite o nome completo (nome e sobrenome)' };
                }
                
                if (trimmed.length < 3) {
                    return { valid: false, message: 'Nome deve ter pelo menos 3 caracteres' };
                }
                
                if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
                    return { valid: false, message: 'Nome deve conter apenas letras e espaços' };
                }
                
                return { valid: true };
            },

            // Validação de organização
            organizationName: function(value) {
                if (!value) return { valid: false, message: 'Nome da organização é obrigatório' };
                
                const trimmed = value.trim();
                
                if (trimmed.length < 3) {
                    return { valid: false, message: 'Nome deve ter pelo menos 3 caracteres' };
                }
                
                if (trimmed.length > 200) {
                    return { valid: false, message: 'Nome muito longo (máximo 200 caracteres)' };
                }
                
                return { valid: true };
            },

            // Validação de evento
            eventName: function(value) {
                if (!value) return { valid: false, message: 'Nome do evento é obrigatório' };
                
                const trimmed = value.trim();
                
                if (trimmed.length < 5) {
                    return { valid: false, message: 'Nome deve ter pelo menos 5 caracteres' };
                }
                
                if (trimmed.length > 150) {
                    return { valid: false, message: 'Nome muito longo (máximo 150 caracteres)' };
                }
                
                return { valid: true };
            },

            // Validação de carga horária
            workload: function(value) {
                if (!value) return { valid: false, message: 'Carga horária é obrigatória' };
                
                const hours = parseInt(value);
                
                if (isNaN(hours) || hours <= 0) {
                    return { valid: false, message: 'Carga horária deve ser um número positivo' };
                }
                
                if (hours > 999) {
                    return { valid: false, message: 'Carga horária muito alta (máximo 999 horas)' };
                }
                
                return { valid: true };
            },

            // Validação de data
            eventDate: function(value) {
                if (!value) return { valid: false, message: 'Data é obrigatória' };
                
                const date = new Date(value);
                const today = new Date();
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(today.getFullYear() - 1);
                
                if (isNaN(date.getTime())) {
                    return { valid: false, message: 'Data inválida' };
                }
                
                if (date < oneYearAgo) {
                    return { valid: false, message: 'Data muito antiga (máximo 1 ano atrás)' };
                }
                
                const oneYearForward = new Date();
                oneYearForward.setFullYear(today.getFullYear() + 1);
                
                if (date > oneYearForward) {
                    return { valid: false, message: 'Data muito distante (máximo 1 ano no futuro)' };
                }
                
                return { valid: true };
            },

            // Validação de período de datas
            dateRange: function(startDate, endDate) {
                if (!startDate) return { valid: false, message: 'Data de início é obrigatória' };
                
                const start = new Date(startDate);
                
                if (isNaN(start.getTime())) {
                    return { valid: false, message: 'Data de início inválida' };
                }
                
                if (endDate) {
                    const end = new Date(endDate);
                    
                    if (isNaN(end.getTime())) {
                        return { valid: false, message: 'Data de término inválida' };
                    }
                    
                    if (end < start) {
                        return { valid: false, message: 'Data de término deve ser posterior à data de início' };
                    }
                    
                    // Verificar se não é um período muito longo
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays > 365) {
                        return { valid: false, message: 'Período muito longo (máximo 1 ano)' };
                    }
                }
                
                return { valid: true };
            },

            // Validação de número de certificado
            certificateNumber: function(value) {
                if (!value) return { valid: false, message: 'Número do certificado é obrigatório' };
                
                const trimmed = value.trim();
                
                if (trimmed.length < 1) {
                    return { valid: false, message: 'Número do certificado é obrigatório' };
                }
                
                if (trimmed.length > 20) {
                    return { valid: false, message: 'Número muito longo (máximo 20 caracteres)' };
                }
                
                // Permitir números e letras
                if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
                    return { valid: false, message: 'Número deve conter apenas letras e números' };
                }
                
                return { valid: true };
            },

            // Validação de local
            location: function(value) {
                if (!value) return { valid: false, message: 'Local é obrigatório' };
                
                const trimmed = value.trim();
                
                if (trimmed.length < 3) {
                    return { valid: false, message: 'Local deve ter pelo menos 3 caracteres' };
                }
                
                if (trimmed.length > 150) {
                    return { valid: false, message: 'Local muito longo (máximo 150 caracteres)' };
                }
                
                return { valid: true };
            },

            // Validação de tópicos
            topics: function(topics) {
                if (!topics || topics.length === 0) {
                    return { valid: false, message: 'Pelo menos um tópico é obrigatório' };
                }
                
                if (topics.length > 20) {
                    return { valid: false, message: 'Máximo 20 tópicos permitidos' };
                }
                
                for (let i = 0; i < topics.length; i++) {
                    const topic = topics[i].trim();
                    
                    if (topic.length < 3) {
                        return { valid: false, message: `Tópico ${i + 1} muito curto (mínimo 3 caracteres)` };
                    }
                    
                    if (topic.length > 200) {
                        return { valid: false, message: `Tópico ${i + 1} muito longo (máximo 200 caracteres)` };
                    }
                }
                
                return { valid: true };
            },

            // Validação de arquivo de imagem
            imageFile: function(file) {
                if (!file) return { valid: true }; // Opcional
                
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
                
                if (!allowedTypes.includes(file.type)) {
                    return { valid: false, message: 'Formato não suportado. Use JPG, PNG ou SVG' };
                }
                
                const maxSize = 5 * 1024 * 1024; // 5MB
                
                if (file.size > maxSize) {
                    return { valid: false, message: 'Arquivo muito grande (máximo 5MB)' };
                }
                
                return { valid: true };
            }
        },

        // Validar formulário completo
        validateForm: function(formSelector, customRules = {}) {
            const $form = $(formSelector);
            const errors = [];
            let isValid = true;

            // Limpar validações anteriores
            $form.find('.form-control').removeClass('is-valid is-invalid');
            $form.find('.form-error').remove();

            // Validações básicas (campos obrigatórios)
            $form.find('[required]').each(function() {
                const $field = $(this);
                const value = $field.val();
                const fieldName = $field.attr('name') || $field.attr('id') || 'Campo';
                
                if (!GRAVE.Validate.required(value)) {
                    isValid = false;
                    errors.push(`${fieldName} é obrigatório`);
                    $field.addClass('is-invalid');
                    $field.after(`<div class="form-error">${fieldName} é obrigatório</div>`);
                    return;
                }
                
                $field.addClass('is-valid');
            });

            // Validações específicas por tipo de campo
            $form.find('[data-validate]').each(function() {
                const $field = $(this);
                const value = $field.val();
                const validateType = $field.attr('data-validate');
                const fieldName = $field.attr('name') || $field.attr('id') || 'Campo';
                
                if (!value && !$field.attr('required')) return; // Skip se não obrigatório e vazio
                
                let validation = { valid: true };
                
                switch (validateType) {
                    case 'cpf':
                        if (!GRAVE.Validate.cpf(value)) {
                            validation = { valid: false, message: 'CPF inválido' };
                        }
                        break;
                    case 'cnpj':
                        if (!GRAVE.Validate.cnpj(value)) {
                            validation = { valid: false, message: 'CNPJ inválido' };
                        }
                        break;
                    case 'email':
                        if (!GRAVE.Validate.email(value)) {
                            validation = { valid: false, message: 'E-mail inválido' };
                        }
                        break;
                    case 'full-name':
                        validation = this.rules.fullName(value);
                        break;
                    case 'organization-name':
                        validation = this.rules.organizationName(value);
                        break;
                    case 'event-name':
                        validation = this.rules.eventName(value);
                        break;
                    case 'workload':
                        validation = this.rules.workload(value);
                        break;
                    case 'event-date':
                        validation = this.rules.eventDate(value);
                        break;
                    case 'certificate-number':
                        validation = this.rules.certificateNumber(value);
                        break;
                    case 'location':
                        validation = this.rules.location(value);
                        break;
                }
                
                if (!validation.valid) {
                    isValid = false;
                    errors.push(validation.message);
                    $field.removeClass('is-valid').addClass('is-invalid');
                    $field.siblings('.form-error').remove();
                    $field.after(`<div class="form-error">${validation.message}</div>`);
                } else if (value) {
                    $field.removeClass('is-invalid').addClass('is-valid');
                }
            });

            // Validações customizadas
            Object.keys(customRules).forEach(fieldName => {
                const $field = $form.find(`[name="${fieldName}"], #${fieldName}`);
                if ($field.length) {
                    const value = $field.val();
                    const validation = customRules[fieldName](value);
                    
                    if (!validation.valid) {
                        isValid = false;
                        errors.push(validation.message);
                        $field.removeClass('is-valid').addClass('is-invalid');
                        $field.siblings('.form-error').remove();
                        $field.after(`<div class="form-error">${validation.message}</div>`);
                    }
                }
            });

            return { isValid, errors };
        },

        // Validar período de datas
        validateDateRange: function(startDateSelector, endDateSelector) {
            const startDate = $(startDateSelector).val();
            const endDate = $(endDateSelector).val();
            
            const validation = this.rules.dateRange(startDate, endDate);
            
            if (!validation.valid) {
                $(endDateSelector).removeClass('is-valid').addClass('is-invalid');
                $(endDateSelector).siblings('.form-error').remove();
                $(endDateSelector).after(`<div class="form-error">${validation.message}</div>`);
            } else {
                $(endDateSelector).removeClass('is-invalid').addClass('is-valid');
                $(endDateSelector).siblings('.form-error').remove();
            }
            
            return validation.valid;
        },

        // Validar lista de tópicos
        validateTopics: function(topicsSelector) {
            const topics = [];
            $(topicsSelector).each(function() {
                const value = $(this).val().trim();
                if (value) topics.push(value);
            });
            
            const validation = this.rules.topics(topics);
            
            if (!validation.valid) {
                GRAVE.Notification.error(validation.message);
            }
            
            return validation.valid;
        },

        // Validar upload de arquivo
        validateFileUpload: function(fileInputSelector) {
            const $input = $(fileInputSelector);
            const file = $input[0].files[0];
            
            const validation = this.rules.imageFile(file);
            
            if (!validation.valid) {
                $input.addClass('is-invalid');
                $input.siblings('.form-error').remove();
                $input.after(`<div class="form-error">${validation.message}</div>`);
                $input.val(''); // Limpar o input
            } else {
                $input.removeClass('is-invalid').addClass('is-valid');
                $input.siblings('.form-error').remove();
            }
            
            return validation.valid;
        },

        // Configurar validação em tempo real
        setupRealTimeValidation: function(formSelector) {
            const $form = $(formSelector);
            
            // Validação ao sair do campo (blur)
            $form.on('blur', '[data-validate]', (e) => {
                const $field = $(e.target);
                const value = $field.val();
                const validateType = $field.attr('data-validate');
                
                if (!value && !$field.attr('required')) {
                    $field.removeClass('is-valid is-invalid');
                    $field.siblings('.form-error').remove();
                    return;
                }
                
                let validation = { valid: true };
                
                switch (validateType) {
                    case 'cpf':
                        validation = GRAVE.Validate.cpf(value) ? 
                            { valid: true } : 
                            { valid: false, message: 'CPF inválido' };
                        break;
                    case 'cnpj':
                        validation = GRAVE.Validate.cnpj(value) ? 
                            { valid: true } : 
                            { valid: false, message: 'CNPJ inválido' };
                        break;
                    case 'email':
                        validation = GRAVE.Validate.email(value) ? 
                            { valid: true } : 
                            { valid: false, message: 'E-mail inválido' };
                        break;
                    case 'full-name':
                        validation = this.rules.fullName(value);
                        break;
                    case 'organization-name':
                        validation = this.rules.organizationName(value);
                        break;
                    case 'event-name':
                        validation = this.rules.eventName(value);
                        break;
                    case 'workload':
                        validation = this.rules.workload(value);
                        break;
                    case 'event-date':
                        validation = this.rules.eventDate(value);
                        break;
                    case 'certificate-number':
                        validation = this.rules.certificateNumber(value);
                        break;
                    case 'location':
                        validation = this.rules.location(value);
                        break;
                }
                
                if (validation.valid) {
                    $field.removeClass('is-invalid').addClass('is-valid');
                    $field.siblings('.form-error').remove();
                } else {
                    $field.removeClass('is-valid').addClass('is-invalid');
                    $field.siblings('.form-error').remove();
                    $field.after(`<div class="form-error">${validation.message}</div>`);
                }
            });
            
            // Validação de período de datas
            $form.on('change', '[data-validate="event-date"]', () => {
                const $startDate = $form.find('#dataInicioEvento');
                const $endDate = $form.find('#dataFimEvento');
                
                if ($startDate.length && $endDate.length && $endDate.val()) {
                    this.validateDateRange('#dataInicioEvento', '#dataFimEvento');
                }
            });
            
            // Validação de arquivos
            $form.on('change', 'input[type="file"]', (e) => {
                this.validateFileUpload(e.target);
            });
        },

        // Validar dados completos antes do submit
        validateCompleteData: function() {
            const evento = GRAVE.Storage.get('evento');
            const template = GRAVE.Storage.get('template_selecionado');
            
            const errors = [];
            
            // Validar evento
            if (!evento) {
                errors.push('Configure os dados do evento');
            } else {
                if (!evento.nomeEvento) errors.push('Nome do evento é obrigatório');
                if (!evento.tipoEvento) errors.push('Tipo do evento é obrigatório');
                if (!evento.dataInicioEvento) errors.push('Data do evento é obrigatória');
                if (!evento.localEvento) errors.push('Local do evento é obrigatório');
                if (!evento.cargaHorariaEvento) errors.push('Carga horária é obrigatória');
                if (!evento.topicos || evento.topicos.length === 0) errors.push('Pelo menos um tópico é obrigatório');
            }
            
            // Validar template
            if (!template) {
                errors.push('Selecione um template');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },

        // Inicializar sistema de validação
        init: function() {
            // Configurar validação para todos os formulários existentes
            if ($('#eventoForm').length) {
                this.setupRealTimeValidation('#eventoForm');
            }
            
            if ($('#participanteForm').length) {
                this.setupRealTimeValidation('#participanteForm');
            }
            
            GRAVE.Debug.log('Sistema de validações inicializado');
        }
    };

    // Inicializar quando o DOM estiver pronto
    FormValidation.init();

    // Expor no namespace global
    window.GRAVE.FormValidation = FormValidation;
});