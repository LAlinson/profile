# Sistema Multi-Usuário - Plano de Implementação

## Objetivo

Permitir gerenciar currículos de múltiplos usuários através do mesmo sistema administrativo.

## Arquitetura Proposta

### Estrutura de Dados

```javascript
{
  "users": [
    {
      "id": "user-1",
      "name": "Lucas Alinson Azevedo Gonçalves",
      "email": "lucas.alinson@gmail.com",
      "createdAt": "2026-02-17",
      "resumeData": { /* dados do currículo */ }
    },
    {
      "id": "user-2",
      "name": "Outro Usuário",
      "email": "outro@email.com",
      "createdAt": "2026-02-17",
      "resumeData": { /* dados do currículo */ }
    }
  ],
  "currentUserId": "user-1"
}
```

### Arquivos

```
curriculo/
├── index.html                  # Landing page com lista de usuários
├── resume.html?user=user-1     # Currículo individual (gerado)
├── admin.html                  # Painel admin (modificado)
├── users.html                  # Gerenciamento de usuários (novo)
├── data/
│   └── users.json              # Todos os usuários
└── js/
    ├── user-manager.js         # Gerenciamento de usuários (novo)
    ├── resume-builder.js       # Mantém
    └── admin-panel.js          # Modificado
```

## Componentes

### 1. Landing Page (`index.html`)

**Funcionalidade:**
- Lista todos os usuários cadastrados
- Card para cada usuário com foto, nome, cargo
- Link para ver currículo de cada um
- Botão "Adicionar Novo Usuário"

### 2. Gerenciador de Usuários (`users.html`)

**Funcionalidade:**
- Listar todos os usuários
- Adicionar novo usuário
- Editar usuário existente
- Excluir usuário
- Selecionar usuário ativo

### 3. Admin Panel Modificado

**Mudanças:**
- Seletor de usuário no topo
- Carregar dados do usuário selecionado
- Salvar alterações no usuário correto
- Gerar currículo individual

### 4. User Manager (`js/user-manager.js`)

**Funções:**
- `loadUsers()` - Carregar todos os usuários
- `addUser(userData)` - Adicionar novo usuário
- `updateUser(userId, data)` - Atualizar usuário
- `deleteUser(userId)` - Excluir usuário
- `setCurrentUser(userId)` - Definir usuário ativo
- `getCurrentUser()` - Obter usuário ativo

## Fluxo de Uso

```
1. Acessar index.html
   ↓
2. Ver lista de usuários
   ↓
3. Clicar em "Adicionar Usuário" ou "Editar"
   ↓
4. Ir para admin.html com usuário selecionado
   ↓
5. Editar currículo
   ↓
6. Gerar currículo individual
   ↓
7. Voltar para lista
```

## Implementação

### Fase 1: Estrutura de Dados
- Migrar dados atuais para formato multi-usuário
- Criar `users.json`

### Fase 2: Landing Page
- Criar `index.html` com lista de usuários
- Cards visuais para cada usuário

### Fase 3: User Manager
- Criar `user-manager.js`
- Implementar CRUD de usuários

### Fase 4: Adaptar Admin
- Adicionar seletor de usuário
- Modificar funções para trabalhar com usuário selecionado

### Fase 5: Geração Individual
- Modificar `resume-builder.js` para gerar por usuário
- Criar URLs individuais (ex: `resume.html?user=user-1`)

## Decisões Técnicas

**URL dos Currículos:**
- Opção 1: `resume.html?user=user-1` ✅ (mais simples)
- Opção 2: `users/user-1/index.html` (melhor SEO, mais complexo)

**Storage:**
- Arquivo único `users.json` com todos os usuários ✅
- Facilita backup e sincronização

**Compatibilidade:**
- Manter currículo atual funcionando
- Migrar dados automaticamente
