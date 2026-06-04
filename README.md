# 🌟 Val Quaresma — Site Vitrine

Site profissional com painel administrativo integrado. Stack moderna: Next.js 15 (App Router) + Prisma + PostgreSQL + Tailwind CSS.

---

## ⚡ Início Rápido (TL;DR)

```bash
npm install
cp .env.example .env  # depois edite com sua DATABASE_URL do Railway
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Abra http://localhost:3000 🎉

---

## 📚 Passo a Passo Completo (Do Zero ao Site Publicado)

### ⚠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Como verificar | Onde baixar |
|---|---|---|
| **Node.js 20+** | `node -v` | https://nodejs.org |
| **Git** | `git --version` | https://git-scm.com |
| **Conta GitHub** | — | https://github.com |
| **Conta Railway** | — | https://railway.app |

> 💡 Se não tem Node 20+, instale via [nvm](https://github.com/nvm-sh/nvm) (Linux/Mac) ou baixe do site oficial (Windows).

---

### PARTE 1 — Configurar o Banco de Dados (Railway)

#### 1.1. Criar conta no Railway
1. Acesse https://railway.app
2. Clique em **Login** → entre com sua conta do GitHub
3. Railway dá **$5 grátis por mês** (suficiente para começar)

#### 1.2. Criar o projeto e o banco PostgreSQL
1. No dashboard do Railway, clique em **+ New Project**
2. Selecione **Provision PostgreSQL**
3. Aguarde alguns segundos — o banco será criado automaticamente
4. Clique no card do **PostgreSQL** que apareceu
5. Vá na aba **Variables**
6. Encontre **`DATABASE_URL`** e clique no ícone de copiar 📋

> 💡 Guarde essa URL — você vai precisar no passo 2.4.

---

### PARTE 2 — Rodar o Projeto Localmente

#### 2.1. Colocar os arquivos do projeto em uma pasta
1. Crie uma pasta no seu computador, ex: `Documents/projetos/val-quaresma`
2. Copie TODOS os arquivos deste projeto para essa pasta
3. Abra a pasta no seu editor (VS Code recomendado)
4. Abra o terminal integrado (`Ctrl + '` no VS Code)

#### 2.2. Instalar as dependências
```bash
npm install
```
> ⏱️ Isso vai demorar uns 2-3 minutos na primeira vez. Vai aparecer um aviso sobre o Prisma — é normal.

#### 2.3. Criar o arquivo `.env`
```bash
# No Windows (PowerShell):
copy .env.example .env

# No Linux/Mac:
cp .env.example .env
```

#### 2.4. Configurar a `DATABASE_URL`
1. Abra o arquivo `.env` no seu editor
2. **Substitua** a linha `DATABASE_URL="..."` pela URL que você copiou do Railway
3. Salve o arquivo

> ⚠️ A URL precisa estar entre aspas duplas: `DATABASE_URL="postgresql://..."`

#### 2.5. Criar as tabelas no banco
```bash
npx prisma migrate dev --name init
```
> 💡 Isso vai conectar no Railway e criar TODAS as tabelas (Category, Product, etc).
> Você deve ver: `✔ Generated Prisma Client` e `Your database is now in sync with your schema.`

#### 2.6. Popular o banco com dados de exemplo
```bash
npm run db:seed
```
> 💡 Cria 4 categorias, 4 produtos e o usuário admin inicial.

#### 2.7. Rodar o site!
```bash
npm run dev
```

🎉 **Abra http://localhost:3000 — o site está no ar!**

---

### PARTE 3 — Publicar o Site no Railway (Deploy)

O Railway também hospeda a aplicação Next.js (não só o banco). Vamos colocar o site no ar com URL pública.

#### 3.1. Subir o código para o GitHub

```bash
# Inicializar git na pasta do projeto
git init
git add .
git commit -m "Initial commit: Val Quaresma vitrine"

# Criar repositório no GitHub
# Opção A: pelo site github.com → New repository → val-quaresma (privado)
# Opção B: pelo CLI: gh repo create val-quaresma --private

# Conectar e enviar (substitua SEU_USUARIO)
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/val-quaresma.git
git push -u origin main
```

#### 3.2. Conectar o repositório ao Railway

1. No dashboard do Railway, vá no projeto onde está o PostgreSQL
2. Clique em **+ New** → **GitHub Repo**
3. Autorize o Railway a acessar seus repositórios (se for a primeira vez)
4. Selecione `val-quaresma`
5. Railway vai detectar automaticamente que é um app Next.js

#### 3.3. Configurar variáveis de ambiente no Railway

1. Clique no serviço da aplicação (não o do PostgreSQL)
2. Vá em **Variables**
3. Clique em **+ New Variable** e adicione cada uma:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` ← **referência** ao banco |
| `ADMIN_EMAIL` | `val@valquaresma.com.br` |
| `ADMIN_PASSWORD` | uma senha forte |
| `NEXTAUTH_SECRET` | gere uma string aleatória |
| `NEXTAUTH_URL` | (deixa vazio agora — você preenche depois do deploy) |

> 💡 **Truque importante:** use `${{Postgres.DATABASE_URL}}` exatamente assim (com colchetes duplos). Railway substitui automaticamente pela URL real do banco. Se o banco mudar de URL, sua aplicação continua funcionando.

#### 3.4. Configurar o domínio público

1. Ainda no serviço da aplicação, vá em **Settings**
2. Em **Networking**, clique em **Generate Domain**
3. Railway vai gerar uma URL tipo `val-quaresma-production.up.railway.app`
4. Volte em **Variables** e atualize `NEXTAUTH_URL` com essa URL

#### 3.5. Configurar o build command

1. Em **Settings** → **Build**
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`

> 💡 O `npm run build` já inclui `prisma generate` (configurado no package.json).
> Para a primeira migração em produção, vamos rodar manualmente no passo seguinte.

#### 3.6. Aplicar migrações em produção (primeira vez)

Após o primeiro deploy, abra o **Shell** do Railway (na própria interface):

```bash
npx prisma migrate deploy
npm run db:seed
```

> ⚠️ **NUNCA** rode `prisma migrate dev` em produção. Sempre `migrate deploy`.

#### 3.7. 🎉 Site no ar!

Acesse a URL gerada pelo Railway. O site está publicado!

---

## 🐛 Troubleshooting (Erros Comuns)

### ❌ "Cannot find module '@prisma/client'"
**Causa:** O Prisma Client não foi gerado.
**Solução:** `npx prisma generate`

### ❌ "Environment variable not found: DATABASE_URL"
**Causa:** O arquivo `.env` não foi criado ou está com erro.
**Solução:** Confira se o `.env` existe e se a `DATABASE_URL` está entre aspas duplas.

### ❌ "Image with src ... is not configured under images"
**Causa:** Você está usando uma imagem de um domínio que não está no `next.config.ts`.
**Solução:** Abra `next.config.ts` e adicione o hostname no `remotePatterns`.

### ❌ Build falha no Railway com "P1001: Can't reach database"
**Causa:** A `DATABASE_URL` no Railway não está referenciando o banco corretamente.
**Solução:** Confirme que está usando `${{Postgres.DATABASE_URL}}` (com colchetes duplos).

### ❌ Página em branco / erro 500 em produção
**Causa:** Geralmente é a migração que não foi aplicada.
**Solução:** No Shell do Railway, rode `npx prisma migrate deploy`.

### ❌ "Module not found: Can't resolve '@/lib/db'"
**Causa:** O `tsconfig.json` não está com o path alias configurado.
**Solução:** Confirme que `"paths": { "@/*": ["./*"] }` está no `tsconfig.json`.

---

## 📂 Estrutura do Projeto

```
val-quaresma/
├── app/
│   ├── layout.tsx                  # Root layout (fontes, metadata, schema.org)
│   ├── globals.css                 # Estilos globais + paleta de cores
│   └── (site)/                     # Site público (Route Group)
│       ├── layout.tsx              # Header + Footer + WhatsApp
│       └── page.tsx                # Home
├── components/
│   ├── WhatsAppButton.tsx          # Botão flutuante
│   └── site/
│       ├── Header.tsx              # Cabeçalho responsivo
│       ├── Footer.tsx              # Rodapé com SEO local
│       ├── Hero.tsx                # Primeira tela impactante
│       ├── CategoryGrid.tsx        # Grid de categorias
│       ├── ProductCard.tsx         # Card de produto reutilizável
│       ├── FeaturedProducts.tsx    # Produtos em destaque
│       ├── AboutPreview.tsx        # "Quem somos" resumido
│       └── LocationSection.tsx     # Mapa + endereço + horários
├── lib/
│   ├── db.ts                       # Prisma Client (singleton)
│   └── utils.ts                    # formatPrice, whatsappLink
├── prisma/
│   ├── schema.prisma               # Modelos do banco
│   └── seed.ts                     # Dados iniciais
├── public/                         # Imagens estáticas (logo, og-image, etc)
├── .env                            # Variáveis (NÃO commitar)
├── .env.example                    # Template das variáveis
├── next.config.ts                  # Config do Next.js
├── tailwind.config.ts              # Config do Tailwind
├── tsconfig.json                   # Config do TypeScript
└── package.json                    # Dependências e scripts
```

---

## 🔧 Scripts Disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Roda o site localmente (modo desenvolvimento) |
| `npm run build` | Compila para produção |
| `npm start` | Roda a versão de produção |
| `npm run db:migrate` | Cria/aplica migração no banco (dev) |
| `npm run db:deploy` | Aplica migrações em produção |
| `npm run db:seed` | Popula o banco com dados iniciais |
| `npm run db:studio` | Abre a UI visual do banco (localhost:5555) |
| `npm run db:reset` | ⚠️ APAGA tudo e recria o banco |

---

## 💡 Dicas de Quem Já Apanhou Muito

1. **Sempre rode `npx prisma generate` depois de mexer no `schema.prisma`** — caso contrário, o TypeScript não vai reconhecer os novos campos.

2. **Use `npm run db:studio` muito** — você consegue ver, criar e editar produtos visualmente no banco. Ótimo para debug.

3. **Os domínios de imagem precisam estar no `next.config.ts`** — se o cliente usar Cloudinary ou outro serviço, adicione lá.

4. **Variáveis sensíveis NUNCA no código** — sempre use `.env` (que está no .gitignore).

5. **`migrate dev` é DEV, `migrate deploy` é PROD** — confundir os dois pode causar perda de dados.

6. **Logs do Railway são seus amigos** — qualquer erro de build ou deploy, abra a aba "Deployments" → clique no deploy → veja os logs.

---

## 📞 Próximas Etapas

Quando o site estiver no ar, podemos implementar:

- ✅ Autenticação do painel admin (NextAuth + middleware)
- ✅ CRUD de produtos no painel
- ✅ Upload de imagens (Cloudinary ou Railway Volume)
- ✅ Página de produto individual `/produtos/[slug]`
- ✅ Listagem com filtros `/produtos`
- ✅ Gestão de categorias pelo admin

---

**Desenvolvido com ☕ e atenção aos detalhes pelo Cláudio.**
