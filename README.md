# ClientFlow AI

ClientFlow AI e um SaaS para freelancers gerenciarem clientes, briefings, propostas, contratos, projetos, tarefas, pagamentos e comentarios com apoio de IA.

Subtitulo do produto:

> Organize clientes, gere propostas, crie contratos e acompanhe projetos com IA.

## Funcionalidades

- Autenticacao com cadastro, login, logout, cookie JWT httpOnly e senha com bcrypt.
- Dashboard privado com metricas reais de clientes, propostas, contratos, projetos e pagamentos.
- CRUD de clientes com isolamento por usuario.
- Briefing por conversa colada ou formulario manual, com organizacao por IA ou fallback mock.
- Geracao de proposta a partir do briefing, edicao, duplicacao, PDF e link publico.
- Contrato manual ou gerado de proposta, edicao, PDF, link publico e aceite digital simples.
- Area publica do cliente por token seguro para proposta, contrato e projeto.
- Projetos com tarefas, links, comentarios e pagamentos.
- Pagamentos com receita recebida, pendente, atrasada e mensagem de cobranca com IA.
- Configuracoes do freelancer usadas em propostas, contratos e PDFs.
- Seed demo com dados reais de portfolio.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM 7 com `@prisma/adapter-pg`
- bcrypt
- jose para JWT
- React Hook Form e Zod instalados para formularios/validacao
- lucide-react
- OpenAI API com fallback mock
- `@react-pdf/renderer` para PDF real
- Vercel-ready

## Prints sugeridos

- Landing page `/`
- Dashboard `/dashboard`
- Detalhe de proposta `/dashboard/proposals/[id]`
- Link publico de proposta `/client/proposal/[token]`
- Preview de contrato `/dashboard/contracts/[id]/preview`
- Projeto com tarefas `/dashboard/projects/[id]`

## Como instalar

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
copy .env.example .env
```

Configure:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
APP_URL=http://localhost:3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
PDF_RENDER_MODE=react-pdf
```

`DATABASE_URL` deve apontar para PostgreSQL. Exemplos: Neon, Supabase, Prisma Postgres ou Postgres local.

## Banco de dados

Gerar Prisma Client:

```bash
npx prisma generate
```

Rodar migration em desenvolvimento:

```bash
npx prisma migrate dev
```

Rodar migrations em producao:

```bash
npm run db:migrate
```

Rodar seed demo:

```bash
npm run db:seed
```

Login demo:

```txt
E-mail: demo@clientflow.ai
Senha: demo123456
```

## Como rodar

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

## IA real e fallback mock

Se `OPENAI_API_KEY` estiver configurada, o app usa a API da OpenAI para:

- `generateStructuredBriefing`
- `generateProposalFromBriefing`
- `generateContractFromProposal`
- `suggestProjectPrice`
- `detectProjectRisks`
- `generateClientMessage`

Se `OPENAI_API_KEY` estiver ausente, o sistema continua funcionando em modo demo com respostas mock realistas. Todas as respostas sao validadas por Zod antes de serem salvas.

## PDF

PDFs sao gerados com `@react-pdf/renderer`.

Rotas privadas:

```txt
/api/proposals/[id]/pdf
/api/contracts/[id]/pdf
```

Rotas publicas:

```txt
/api/public/proposals/[token]/pdf
/api/public/contracts/[token]/pdf
```

## Estrutura de pastas

```txt
src/
  app/
    dashboard/
    client/
    api/
  components/
    dashboard/
    forms/
    pdf/
    ui/
  lib/
  server/
    actions/
prisma/
  schema.prisma
  seed.ts
```

## Publicando no GitHub

Com GitHub CLI autenticado:

```bash
git init
git add .
git commit -m "feat: initial ClientFlow AI SaaS"
gh repo create clientflow-ai --public --description "SaaS para freelancers gerenciarem clientes, briefings, propostas, contratos, projetos e pagamentos com IA." --source=. --remote=origin --push
```

Alternativa manual:

```bash
git remote add origin https://github.com/SEU_USUARIO/clientflow-ai.git
git branch -M main
git push -u origin main
```

Troque `SEU_USUARIO` pelo seu usuario real do GitHub.

## Publicando na Vercel

Antes do deploy:

```bash
npm install
npx prisma generate
npm run lint
npm run build
```

Variaveis obrigatorias na Vercel:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
APP_URL=
OPENAI_API_KEY=
OPENAI_MODEL=
PDF_RENDER_MODE=
```

Observacoes:

- `DATABASE_URL` deve apontar para um banco PostgreSQL cloud.
- `NEXTAUTH_SECRET` deve ser uma string segura.
- `APP_URL` deve ser a URL final da Vercel, por exemplo `https://clientflow-ai-beta.vercel.app`.
- `OPENAI_API_KEY` e opcional. Sem ela, o sistema usa IA demo.

Passo a passo via dashboard:

1. Suba o projeto para o GitHub.
2. Entre na Vercel.
3. Clique em `Add New Project`.
4. Importe o repositorio `clientflow-ai`.
5. Configure as variaveis de ambiente.
6. Confirme o framework como Next.js.
7. Faca o deploy.
8. Rode migrations no banco de producao com `npx prisma migrate deploy` ou `npm run db:migrate`.

Com Vercel CLI autenticado:

```bash
vercel link
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add APP_URL production
vercel env add OPENAI_API_KEY production
vercel env add OPENAI_MODEL production
vercel --prod
```

## Seguranca

- `.env` e `.vercel` ficam no `.gitignore`.
- `passwordHash` nunca e selecionado nas respostas de usuario autenticado.
- Dados privados sempre usam filtro por `userId`.
- Rotas publicas acessam apenas registros por `publicToken`.
- Tokens publicos sao longos, aleatorios e nao previsiveis.
- Rotas privadas tambem validam sessao no servidor.

## Proximos passos

- Adicionar testes automatizados end-to-end.
- Adicionar upload real de arquivos.
- Adicionar integracao de email/WhatsApp.
- Adicionar billing real caso vire produto comercial.
