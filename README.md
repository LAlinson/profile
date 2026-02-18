# 📝 Gerenciador de Currículo - Guia de Uso

## 🎯 O que foi criado?

Uma aplicação web que permite editar seu currículo através de um painel administrativo e gera o HTML automaticamente.

## 📁 Estrutura de Arquivos

```
curriculo/
├── index.html              # Currículo público (gerado automaticamente)
├── admin.html              # Painel administrativo ⭐
├── profile-photo.png       # Sua foto
├── data/
│   └── resume.json         # Dados do currículo
├── js/
│   ├── resume-builder.js   # Gerador de HTML
│   └── admin-panel.js      # Lógica do admin
└── README.md
```

## 🚀 Como Usar

### 1. Acessar o Painel Admin

Abra o arquivo `admin.html` no navegador:

```bash
cd /Users/lucasalinsonazevedogoncalves/Documents/workspace/curriculo
open admin.html
```

### 2. Editar Informações

No painel lateral, clique nas seções para editar:

- **👤 Dados Pessoais**: Nome, email, telefone, LinkedIn
- **📄 Resumo Executivo**: Texto principal e destaques
- **⭐ Destaques**: Conquistas principais
- **💼 Experiência**: Adicionar/editar/excluir experiências
- **🎓 Formação**: Adicionar/editar/excluir formações
- **🛠️ Habilidades**: Lista de skills
- **🌍 Idiomas**: Adicionar/editar/excluir idiomas
- **📜 Certificações**: Lista de certificações

### 3. Salvar Alterações

Após editar, clique em **💾 Salvar** no topo da página.

### 4. Gerar Currículo

Clique em **🚀 Gerar Currículo**:
- Um arquivo `index.html` será baixado
- Substitua o arquivo atual na pasta `curriculo/`
- Faça commit e push para o GitHub

```bash
cd /Users/lucasalinsonazevedogoncalves/Documents/workspace/curriculo
git add index.html data/resume.json
git commit -m "Atualização do currículo"
git push origin main
```

## 💾 Backup e Restauração

### Exportar Dados

Clique em **📥 Exportar JSON** para baixar um backup dos seus dados.

### Importar Dados

Clique em **📤 Importar JSON** para restaurar dados de um backup.

## ⚙️ Funcionalidades

### Experiência Profissional
- ➕ Adicionar nova experiência
- ✏️ Editar experiência existente
- 🗑️ Excluir experiência

### Formação Acadêmica
- ➕ Adicionar nova formação
- ✏️ Editar formação existente
- 🗑️ Excluir formação

### Idiomas
- ➕ Adicionar novo idioma
- ✏️ Editar idioma (nome, nível, proficiência)
- 🗑️ Excluir idioma

## 🔄 Fluxo de Trabalho

```
1. Abrir admin.html
   ↓
2. Editar informações
   ↓
3. Clicar em "Salvar"
   ↓
4. Clicar em "Gerar Currículo"
   ↓
5. Substituir index.html
   ↓
6. Git commit + push
   ↓
7. Currículo atualizado online!
```

## 📝 Dicas

1. **Sempre salve** antes de gerar o currículo
2. **Faça backup** regularmente exportando o JSON
3. **Teste localmente** abrindo o `index.html` gerado antes de fazer push
4. **Mantenha a foto** na pasta raiz com o nome correto

## ⚠️ Importante

- Os dados são carregados de `data/resume.json`
- Alterações só aparecem no site após gerar novo `index.html` e fazer push
- O arquivo `resume.json` deve estar sempre atualizado

## 🆘 Problemas Comuns

**Dados não carregam:**
- Verifique se `data/resume.json` existe
- Abra o console do navegador (F12) para ver erros

**Currículo não atualiza:**
- Certifique-se de substituir o `index.html` antigo
- Faça commit e push para o GitHub
- Aguarde 1-2 minutos para o GitHub Pages atualizar

**Foto não aparece:**
- Verifique o nome do arquivo em "Dados Pessoais"
- Certifique-se que a foto está na pasta raiz

---

**Pronto!** Agora você pode editar seu currículo facilmente sem mexer no HTML! 🎉
