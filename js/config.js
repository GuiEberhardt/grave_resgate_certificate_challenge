/**
 * Configurações globais do sistema GRAVE
 */

// Configurações principais do sistema
const GRAVE_CONFIG = {
    version: '1.0.0',
    organization: {
        name: 'GRAVE',
        fullName: 'Grupo de Resgate e Apoio Voluntário de Emergência',
        contact: {
            email: 'contato@grave.org.br',
            phone: '(11) 99999-9999',
            website: 'www.grave.org.br'
        },
        social: {
            facebook: '@GRAVEOficial',
            instagram: '@grave_resgate'
        }
    },
    localStorage: {
        keys: {
            formData: 'graveFormData',
            certificateCount: 'certificateCount',
            settings: 'graveSettings'
        }
    },
    notifications: {
        duration: 3000,
        types: {
            SUCCESS: 'success',
            WARNING: 'warning',
            ERROR: 'error',
            INFO: 'info'
        }
    }
};

// Tipos de certificado disponíveis
const CERTIFICATE_TYPES = {
    participacao: {
        value: 'participacao',
        label: 'Participação em Treinamento',
        title: 'CERTIFICADO DE PARTICIPAÇÃO',
        actionText: 'participou do'
    },
    conclusao: {
        value: 'conclusao',
        label: 'Conclusão de Curso',
        title: 'CERTIFICADO DE CONCLUSÃO',
        actionText: 'concluiu com êxito o'
    },
    operacao: {
        value: 'operacao',
        label: 'Participação em Operação',
        title: 'CERTIFICADO DE PARTICIPAÇÃO EM OPERAÇÃO',
        actionText: 'participou da'
    },
    voluntario: {
        value: 'voluntario',
        label: 'Reconhecimento Voluntário',
        title: 'CERTIFICADO DE RECONHECIMENTO VOLUNTÁRIO',
        actionText: 'prestou serviços voluntários no'
    },
    instrutor: {
        value: 'instrutor',
        label: 'Certificação de Instrutor',
        title: 'CERTIFICADO DE INSTRUTOR',
        actionText: 'foi certificado como instrutor do'
    }
};

// Templates de certificado disponíveis
const CERTIFICATE_TEMPLATES = {
    classic: {
        id: 'classic',
        name: 'Clássico',
        description: 'Design tradicional e elegante',
        style: {
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '3px solid #FF3333'
        }
    },
    modern: {
        id: 'modern',
        name: 'Moderno',
        description: 'Design contemporâneo e clean',
        style: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f1f3f4 100%)',
            border: '2px solid #FF3333'
        }
    },
    formal: {
        id: 'formal',
        name: 'Formal',
        description: 'Para certificações oficiais',
        style: {
            background: 'linear-gradient(135deg, #fefefe 0%, #f5f5f5 100%)',
            border: '4px double #FF3333'
        }
    },
    emergency: {
        id: 'emergency',
        name: 'Emergência',
        description: 'Específico para operações de resgate',
        style: {
            background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
            border: '3px solid #FF3333'
        }
    },
    volunteer: {
        id: 'volunteer',
        name: 'Voluntário',
        description: 'Para reconhecimento de voluntários',
        style: {
            background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
            border: '3px solid #FF3333'
        }
    }
};

// Configurações de validação
const VALIDATION_RULES = {
    participantName: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/
    },
    activityName: {
        minLength: 5,
        maxLength: 200
    },
    workload: {
        min: 1,
        max: 1000
    },
    instructor: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/
    }
};

// Seletores DOM
const DOM_SELECTORS = {
    sections: {
        home: '#home',
        generator: '#generator',
        templates: '#templates',
        about: '#about'
    },
    navigation: {
        navLinks: '.nav-link',
        brandLink: '#brand-link'
    },
    form: {
        certificateForm: '#certificate-form',
        certificateType: '#certificate-type',
        participantName: '#participant-name',
        activityName: '#activity-name',
        startDate: '#start-date',
        endDate: '#end-date',
        workload: '#workload',
        instructor: '#instructor',
        template: '#template'
    },
    buttons: {
        generatePreview: '#generate-preview-btn',
        clearForm: '#clear-form-btn',
        print: '#print-btn'
    },
    preview: {
        container: '#certificate-preview'
    },
    templates: {
        gallery: '#templates-gallery'
    },
    stats: {
        certificatesGenerated: '#certificates-generated'
    }
};