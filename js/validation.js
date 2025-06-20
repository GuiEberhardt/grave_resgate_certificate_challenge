/**
 * Sistema de validação de formulários do GRAVE
 */

const FormValidator = {
    /**
     * Valida todos os campos do formulário
     * @param {Object} formData - Dados do formulário
     * @returns {Object} Resultado da validação
     */
    validateForm: function(formData) {
        const errors = [];
        const warnings = [];

        // Validação do tipo de certificado
        if (!formData.certificateType) {
            errors.push({
                field: 'certificateType',
                message: 'Tipo de certificado é obrigatório'
            });
        }

        // Validação do nome do participante
        const nameValidation = this.validateParticipantName(formData.participantName);
        if (!nameValidation.isValid) {
            errors.push({
                field: 'participantName',
                message: nameValidation.message
            });
        }

        // Validação do nome da atividade
        const activityValidation = this.validateActivityName(formData.activityName);
        if (!activityValidation.isValid) {
            errors.push({
                field: 'activityName',
                message: activityValidation.message
            });
        }

        // Validação das datas
        const dateValidation = this.validateDates(formData.startDate, formData.endDate);
        if (!dateValidation.isValid) {
            errors.push({
                field: 'dates',
                message: dateValidation.message
            });
        }

        // Validação da carga horária
        const workloadValidation = this.validateWorkload(formData.workload);
        if (!workloadValidation.isValid) {
            errors.push({
                field: 'workload',
                message: workloadValidation.message
            });
        }

        // Validação do instrutor
        const instructorValidation = this.validateInstructor(formData.instructor);
        if (!instructorValidation.isValid) {
            errors.push({
                field: 'instructor',
                message: instructorValidation.message
            });
        }

        // Verificações de qualidade (warnings)
        if (formData.workload && parseInt(formData.workload) > 40) {
            warnings.push({
                field: 'workload',
                message: 'Carga horária muito alta. Verifique se está correto.'
            });
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    },

    /**
     * Valida nome do participante
     * @param {string} name - Nome a ser validado
     * @returns {Object} Resultado da validação
     */
    validateParticipantName: function(name) {
        if (!name || !name.trim()) {
            return {
                isValid: false,
                message: 'Nome do participante é obrigatório'
            };
        }

        const trimmedName = name.trim();
        const rules = VALIDATION_RULES.participantName;

        if (trimmedName.length < rules.minLength) {
            return {
                isValid: false,
                message: `Nome deve ter pelo menos ${rules.minLength} caracteres`
            };
        }

        if (trimmedName.length > rules.maxLength) {
            return {
                isValid: false,
                message: `Nome deve ter no máximo ${rules.maxLength} caracteres`
            };
        }

        if (!rules.pattern.test(trimmedName)) {
            return {
                isValid: false,
                message: 'Nome deve conter apenas letras e espaços'
            };
        }

        // Verificar se tem pelo menos nome e sobrenome
        const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
        if (nameParts.length < 2) {
            return {
                isValid: false,
                message: 'Informe nome e sobrenome completos'
            };
        }

        return {
            isValid: true,
            message: 'Nome válido'
        };
    },

    /**
     * Valida nome da atividade
     * @param {string} activity - Atividade a ser validada
     * @returns {Object} Resultado da validação
     */
    validateActivityName: function(activity) {
        if (!activity || !activity.trim()) {
            return {
                isValid: false,
                message: 'Nome da atividade é obrigatório'
            };
        }

        const trimmedActivity = activity.trim();
        const rules = VALIDATION_RULES.activityName;

        if (trimmedActivity.length < rules.minLength) {
            return {
                isValid: false,
                message: `Nome da atividade deve ter pelo menos ${rules.minLength} caracteres`
            };
        }

        if (trimmedActivity.length > rules.maxLength) {
            return {
                isValid: false,
                message: `Nome da atividade deve ter no máximo ${rules.maxLength} caracteres`
            };
        }

        return {
            isValid: true,
            message: 'Nome da atividade válido'
        };
    },

    /**
     * Valida datas de início e fim
     * @param {string} startDate - Data de início
     * @param {string} endDate - Data de fim
     * @returns {Object} Resultado da validação
     */
    validateDates: function(startDate, endDate) {
        if (!startDate) {
            return {
                isValid: false,
                message: 'Data de início é obrigatória'
            };
        }

        if (!endDate) {
            return {
                isValid: false,
                message: 'Data de término é obrigatória'
            };
        }

        if (!DateUtils.isValidDate(startDate)) {
            return {
                isValid: false,
                message: 'Data de início inválida'
            };
        }

        if (!DateUtils.isValidDate(endDate)) {
            return {
                isValid: false,
                message: 'Data de término inválida'
            };
        }

        if (!DateUtils.validateDateRange(startDate, endDate)) {
            return {
                isValid: false,
                message: 'Data de término deve ser posterior à data de início'
            };
        }

        // Verificar se as datas não são muito antigas (mais de 10 anos)
        const start = new Date(startDate);
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

        if (start < tenYearsAgo) {
            return {
                isValid: false,
                message: 'Data de início não pode ser anterior a 10 anos'
            };
        }

        // Verificar se as datas não são futuras demais (mais de 1 ano)
        const end = new Date(endDate);
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        if (end > oneYearFromNow) {
            return {
                isValid: false,
                message: 'Data de término não pode ser superior a 1 ano no futuro'
            };
        }

        return {
            isValid: true,
            message: 'Datas válidas'
        };
    },

    /**
     * Valida carga horária
     * @param {string|number} workload - Carga horária
     * @returns {Object} Resultado da validação
     */
    validateWorkload: function(workload) {
        if (!workload) {
            return {
                isValid: false,
                message: 'Carga horária é obrigatória'
            };
        }

        const numWorkload = parseInt(workload, 10);
        const rules = VALIDATION_RULES.workload;

        if (isNaN(numWorkload)) {
            return {
                isValid: false,
                message: 'Carga horária deve ser um número'
            };
        }

        if (numWorkload < rules.min) {
            return {
                isValid: false,
                message: `Carga horária deve ser pelo menos ${rules.min} hora`
            };
        }

        if (numWorkload > rules.max) {
            return {
                isValid: false,
                message: `Carga horária deve ser no máximo ${rules.max} horas`
            };
        }

        return {
            isValid: true,
            message: 'Carga horária válida'
        };
    },

    /**
     * Valida nome do instrutor
     * @param {string} instructor - Nome do instrutor
     * @returns {Object} Resultado da validação
     */
    validateInstructor: function(instructor) {
        if (!instructor || !instructor.trim()) {
            return {
                isValid: false,
                message: 'Nome do instrutor é obrigatório'
            };
        }

        const trimmedInstructor = instructor.trim();
        const rules = VALIDATION_RULES.instructor;

        if (trimmedInstructor.length < rules.minLength) {
            return {
                isValid: false,
                message: `Nome do instrutor deve ter pelo menos ${rules.minLength} caracteres`
            };
        }

        if (trimmedInstructor.length > rules.maxLength) {
            return {
                isValid: false,
                message: `Nome do instrutor deve ter no máximo ${rules.maxLength} caracteres`
            };
        }

        if (!rules.pattern.test(trimmedInstructor)) {
            return {
                isValid: false,
                message: 'Nome do instrutor deve conter apenas letras e espaços'
            };
        }

        return {
            isValid: true,
            message: 'Nome do instrutor válido'
        };
    }
};

// Gerenciador de interface de validação
const ValidationUI = {
    /**
     * Aplica estilos de validação nos campos
     * @param {Object} validationResult - Resultado da validação
     */
    applyValidationStyles: function(validationResult) {
        // Limpar estilos anteriores
        this.clearValidationStyles();

        // Aplicar estilos de erro
        validationResult.errors.forEach(error => {
            this.markFieldAsInvalid(error.field);
        });

        // Mostrar mensagens de erro
        if (validationResult.errors.length > 0) {
            this.showValidationMessages(validationResult.errors, 'error');
        }

        // Mostrar warnings se não houver erros
        if (validationResult.errors.length === 0 && validationResult.warnings.length > 0) {
            this.showValidationMessages(validationResult.warnings, 'warning');
        }
    },

    /**
     * Limpa estilos de validação
     */
    clearValidationStyles: function() {
        const formElements = document.querySelectorAll('.form-control, .form-select');
        formElements.forEach(element => {
            element.classList.remove('is-invalid', 'is-valid');
        });

        // Remove mensagens de erro existentes
        const errorMessages = document.querySelectorAll('.validation-message');
        errorMessages.forEach(message => message.remove());
    },

    /**
     * Marca campo como inválido
     * @param {string} fieldName - Nome do campo
     */
    markFieldAsInvalid: function(fieldName) {
        const fieldMap = {
            'certificateType': DOM_SELECTORS.form.certificateType,
            'participantName': DOM_SELECTORS.form.participantName,
            'activityName': DOM_SELECTORS.form.activityName,
            'startDate': DOM_SELECTORS.form.startDate,
            'endDate': DOM_SELECTORS.form.endDate,
            'workload': DOM_SELECTORS.form.workload,
            'instructor': DOM_SELECTORS.form.instructor,
            'dates': DOM_SELECTORS.form.startDate // Para erros de data, destacar o campo de início
        };

        const selector = fieldMap[fieldName];
        if (selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('is-invalid');
                element.classList.remove('is-valid');
            }
        }
    },

    /**
     * Marca campo como válido
     * @param {string} fieldName - Nome do campo
     */
    markFieldAsValid: function(fieldName) {
        const fieldMap = {
            'certificateType': DOM_SELECTORS.form.certificateType,
            'participantName': DOM_SELECTORS.form.participantName,
            'activityName': DOM_SELECTORS.form.activityName,
            'startDate': DOM_SELECTORS.form.startDate,
            'endDate': DOM_SELECTORS.form.endDate,
            'workload': DOM_SELECTORS.form.workload,
            'instructor': DOM_SELECTORS.form.instructor
        };

        const selector = fieldMap[fieldName];
        if (selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('is-valid');
                element.classList.remove('is-invalid');
            }
        }
    },

    /**
     * Mostra mensagens de validação
     * @param {Array} messages - Lista de mensagens
     * @param {string} type - Tipo da mensagem (error, warning)
     */
    showValidationMessages: function(messages, type = 'error') {
        const alertClass = type === 'error' ? 'alert-danger' : 'alert-warning';
        const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';
        
        let messagesList = messages.map(msg => `<li>${msg.message}</li>`).join('');
        
        const alertHtml = `
            <div class="alert ${alertClass} validation-message mt-3" role="alert">
                <i class="fas ${icon} me-2"></i>
                <strong>${type === 'error' ? 'Erro' : 'Atenção'}:</strong>
                <ul class="mb-0 mt-2">
                    ${messagesList}
                </ul>
            </div>
        `;

        const form = document.querySelector(DOM_SELECTORS.form.certificateForm);
        if (form) {
            form.insertAdjacentHTML('beforeend', alertHtml);
        }
    },

    /**
     * Validação em tempo real
     * @param {string} fieldName - Nome do campo
     * @param {string} value - Valor do campo
     */
    validateFieldRealTime: function(fieldName, value) {
        let validationResult;

        switch (fieldName) {
            case 'participantName':
                validationResult = FormValidator.validateParticipantName(value);
                break;
            case 'activityName':
                validationResult = FormValidator.validateActivityName(value);
                break;
            case 'workload':
                validationResult = FormValidator.validateWorkload(value);
                break;
            case 'instructor':
                validationResult = FormValidator.validateInstructor(value);
                break;
            default:
                return;
        }

        if (validationResult.isValid) {
            this.markFieldAsValid(fieldName);
        } else {
            this.markFieldAsInvalid(fieldName);
        }
    }
};

// Validador de formulário em tempo real
const RealTimeValidator = {
    /**
     * Inicializa validação em tempo real
     */
    init: function() {
        this.setupEventListeners();
    },

    /**
     * Configura event listeners para validação
     */
    setupEventListeners: function() {
        // Validação de nome do participante
        const participantName = document.querySelector(DOM_SELECTORS.form.participantName);
        if (participantName) {
            participantName.addEventListener('blur', (e) => {
                ValidationUI.validateFieldRealTime('participantName', e.target.value);
            });
        }

        // Validação de nome da atividade
        const activityName = document.querySelector(DOM_SELECTORS.form.activityName);
        if (activityName) {
            activityName.addEventListener('blur', (e) => {
                ValidationUI.validateFieldRealTime('activityName', e.target.value);
            });
        }

        // Validação de carga horária
        const workload = document.querySelector(DOM_SELECTORS.form.workload);
        if (workload) {
            workload.addEventListener('blur', (e) => {
                ValidationUI.validateFieldRealTime('workload', e.target.value);
            });
        }

        // Validação de instrutor
        const instructor = document.querySelector(DOM_SELECTORS.form.instructor);
        if (instructor) {
            instructor.addEventListener('blur', (e) => {
                ValidationUI.validateFieldRealTime('instructor', e.target.value);
            });
        }

        // Validação de datas
        const startDate = document.querySelector(DOM_SELECTORS.form.startDate);
        const endDate = document.querySelector(DOM_SELECTORS.form.endDate);
        
        if (startDate && endDate) {
            const validateDates = () => {
                const startValue = startDate.value;
                const endValue = endDate.value;
                
                if (startValue && endValue) {
                    const dateValidation = FormValidator.validateDates(startValue, endValue);
                    if (dateValidation.isValid) {
                        ValidationUI.markFieldAsValid('startDate');
                        ValidationUI.markFieldAsValid('endDate');
                    } else {
                        ValidationUI.markFieldAsInvalid('startDate');
                        ValidationUI.markFieldAsInvalid('endDate');
                    }
                }
            };

            startDate.addEventListener('change', validateDates);
            endDate.addEventListener('change', validateDates);
        }
    }
};