# GRAVE - Sistema de Geração de Certificados

Sistema web para geração de certificados digitais do Grupo de Resgate e Apoio Voluntário de Emergência.

## 📁 Estrutura do Projeto

```
grave-certificados/
│
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos customizados
├── js/
│   ├── config.js           # Configurações globais
│   ├── utils.js            # Funções utilitárias
│   ├── storage.js          # Gerenciamento de armazenamento
│   ├── validation.js       # Validação de formulários
│   ├── templates.js        # Gerenciamento de templates
│   ├── certificate.js      # Geração de certificados
│   ├── navigation.js       # Sistema de navegação
│   └── main.js             # Inicialização principal
└── README.md               # Documentação
```

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização e layout responsivo
- **JavaScript (ES6+)** - Lógica da aplicação
- **jQuery 3.7.0** - Manipulação DOM e eventos
- **Bootstrap 5.3.0** - Framework CSS responsivo
- **Font Awesome 6.4.0** - Ícones

## 📋 Funcionalidades

### ✅ Implementadas
- **Geração de Certificados**: Interface completa para criação
- **Múltiplos Templates**: 5 modelos diferentes disponíveis
- **Validação em Tempo Real**: Verificação automática dos campos
- **Auto-salvamento**: Dados salvos automaticamente no navegador
- **Preview Instantâneo**: Visualização em tempo real do certificado
- **Impressão Otimizada**: Layout específico para impressão
- **Sistema de Navegação**: SPA com gerenciamento de rotas
- **Estatísticas**: Contador de certificados gerados
- **Responsivo**: Adaptado para desktop, tablet e mobile

### 🎨 Templates Disponíveis
1. **Clássico** - Design tradicional e elegante
2. **Moderno** - Design contemporâneo e clean
3. **Formal** - Para certificações oficiais
4. **Emergência** - Específico para operações de resgate
5. **Voluntário** - Para reconhecimento de voluntários

### 📱 Tipos de Certificado
- Participação em Treinamento
- Conclusão de Curso
- Participação em Operação
- Reconhecimento Voluntário
- Certificação de Instrutor

## 🛠️ Como Usar

### 1. Configuração Inicial
```bash
# Clone ou baixe os arquivos
# Abra o index.html em um servidor web local
```

### 2. Gerando um Certificado
1. Acesse a seção **Gerador**
2. Preencha todos os campos obrigatórios:
   - Tipo de certificado
   - Nome do participante
   - Nome da atividade
   - Datas de início e fim
   - Carga horária
   - Nome do instrutor
3. Escolha um template
4. Clique em **Gerar Preview**
5. Revise o certificado
6. Clique em **Imprimir Certificado**

### 3. Atalhos de Teclado
- `Ctrl + Enter` - Gerar preview
- `Ctrl + P` - Imprimir certificado
- `Esc` - Limpar formulário
- `F1` - Mostrar ajuda

## 🏗️ Arquitetura do Código

### Padrões Utilizados
- **Modular**: Código separado em módulos funcionais
- **Namespace**: Evita conflitos no escopo global
- **Observer Pattern**: Para eventos e notificações
- **Storage Pattern**: Para persistência de dados
- **MVC-like**: Separação entre dados, visualização e controle

### Módulos Principais

#### `config.js`
- Configurações globais do sistema
- Constantes e enumerações
- Mapeamento de seletores DOM

#### `utils.js`
- Funções utilitárias reutilizáveis
- Formatação de datas e strings
- Validações básicas
- Animações

#### `storage.js`
- Gerenciamento do localStorage
- Auto-salvamento de formulários
- Estatísticas e configurações
- Histórico de certificados

#### `validation.js`
- Validação de campos em tempo real
- Feedback visual de erros
- Regras de negócio customizadas

#### `templates.js`
- Gerenciamento de templates
- Renderização de certificados
- Galeria de modelos

#### `certificate.js`
- Geração de certificados
- Preview e impressão
- Notificações ao usuário

#### `navigation.js`
- Sistema de navegação SPA
- Gerenciamento de rotas
- Histórico do navegador

#### `main.js`
- Inicialização da aplicação
- Coordenação entre módulos
- Tratamento de erros globais

## 🔧 Personalização

### Adicionando Novos Templates
```javascript
// Em config.js, adicione ao objeto CERTIFICATE_TEMPLATES
novoTemplate: {
    id: 'novo',
    name: 'Novo Template',
    description: 'Descrição do template',
    style: {
        background: 'linear-gradient(...)',
        border: '3px solid #color'
    }
}
```

### Modificando Validações
```javascript
// Em validation.js, modifique VALIDATION_RULES
participantName: {
    minLength: 3,
    maxLength: 150,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/
}
```

### Adicionando Novos Tipos de Certificado
```javascript
// Em config.js, adicione ao objeto CERTIFICATE_TYPES
novoTipo: {
    value: 'novo',
    label: 'Novo Tipo',
    title: 'CERTIFICADO DE NOVO TIPO',
    actionText: 'participou do'
}
```

## 📊 Armazenamento de Dados

### LocalStorage
O sistema utiliza localStorage para:
- **graveFormData**: Dados do formulário atual
- **certificateCount**: Contador de certificados gerados
- **graveSettings**: Configurações do usuário
- **graveHistory**: Histórico de certificados (últimos 100)

### Estrutura dos Dados
```javascript
// Exemplo de dados do formulário
{
    certificateType: "participacao",
    participantName: "João Silva",
    activityName: "Curso de Primeiros Socorros",
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    workload: "40",
    instructor: "Dr. Maria",
    template: "classic",
    timestamp: 1703123456789
}
```

## 🐛 Debug e Desenvolvimento

### Modo de Desenvolvimento
```javascript
// No console do navegador
window.GRAVE_DEBUG.fillTestData(); // Preenche dados de teste
window.GRAVE_DEBUG.exportSystemData(); // Exporta dados do sistema
window.GRAVE.clearAllData(); // Limpa todos os dados
```

### Logs
- Todos os eventos importantes são logados no console
- Use `DebugUtils.log()` para adicionar novos logs
- Em produção, os logs podem ser desabilitados

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: > 768px

### Adaptações Mobile
- Menu de navegação colapsável
- Formulário em coluna única
- Botões maiores para touch
- Preview otimizado para tela pequena

## 🖨️ Impressão

### Otimizações
- Layout específico para impressão
- Orientação paisagem (A4)
- Remoção de elementos desnecessários
- Ajuste de margens e espaçamentos

### CSS Print
```css
@media print {
    .navbar, .btn { display: none !important; }
    @page { size: A4 landscape; margin: 1cm; }
}
```

## 🔒 Segurança

### Validações
- Sanitização de entrada de dados
- Validação tanto no frontend quanto lógica
- Prevenção contra XSS básico

### Limitações
- Dados armazenados localmente (não persistem entre dispositivos)
- Sem autenticação/autorização
- Dependente do navegador do usuário

## 📈 Performance

### Otimizações Implementadas
- Debounce em eventos frequentes
- Lazy loading de templates
- Minimização de reflows/repaints
- Event delegation

### Carregamento
- Scripts carregados em ordem otimizada
- CSS crítico inline (se necessário)
- Imagens otimizadas (Font Awesome CDN)

## 🚀 Deploy

### Requisitos
- Servidor web (Apache, Nginx, ou similar)
- Navegadores modernos (ES6+ support)
- Não requer backend ou banco de dados

### Configuração
1. Faça upload dos arquivos para o servidor
2. Configure servidor para servir arquivos estáticos
3. Teste em diferentes navegadores
4. Opcional: Configure HTTPS para melhor segurança

## 🤝 Contribuição

### Padrões de Código
- Use JSDoc para documentação
- Siga convenções de nomenclatura existentes
- Teste em múltiplos navegadores
- Mantenha responsividade

### Estrutura de Commits
```
tipo(escopo): descrição

- feat: nova funcionalidade
- fix: correção de bug
- docs: documentação
- style: formatação
- refactor: refatoração
- test: testes
```

## 📞 Suporte

Para dúvidas ou problemas:
- Email: contato@grave.org.br
- Telefone: (11) 99999-9999

---

**Desenvolvido para o GRAVE - Grupo de Resgate e Apoio Voluntário de Emergência**