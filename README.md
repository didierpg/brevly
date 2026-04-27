# Brev.ly - Encurtador de URLs

Solução Fullstack de encurtamento de links, desenvolvida com foco em performance, escalabilidade e manutenibilidade.

## 🚀 Arquitetura

### Frontend (`/web`)

Aplicação **SPA** construída com **React 19** e **Vite**, utilizando **Tailwind CSS v4** para uma interface performática e responsiva.

- **Gerenciamento de Estado:** **TanStack Query** para cache eficiente de dados do servidor e **Zustand** para orquestração de UI global (Toasts).
- **Validação:** **Zod** e **React Hook Form** garantem a integridade dos dados na entrada.
- **UX:** Implementado sistema de feedback otimizado (Linear Progress Bar e Toasts customizados) para uma experiência de navegação fluida.

### Backend (`/server`)

API REST de alta performance, desacoplada e segura.

- **Framework:** **Fastify** com **Zod** para validação estrita de esquemas.
- **Persistência:** **PostgreSQL** com **Drizzle ORM**, garantindo queries performáticas e tipagem de banco de dados robusta.
- **Infraestrutura:** Integração com **Cloudflare R2** para armazenamento via stream de relatórios CSV, minimizando o uso de memória do servidor.
- **Docker:** Configuração completa para containerização com `docker-compose`.

---

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js (v20+)
- **pnpm** (recomendado)
- Docker e Docker Compose

### Configuração

Clone o repositório e configure as variáveis de ambiente:

```bash
# Na pasta /server e /web
cp .env.example .env
```

### Rodando o projeto

1. **Backend:**

   ```bash
   cd server
   pnpm install
   # O comando abaixo sobe o DB via Docker, aguarda a conexão e inicia a API
   pnpm run dev
   ```

2. **Frontend:**
   ```bash
   cd web
   pnpm install
   pnpm run dev
   ```

---

## 📋 Funcionalidades Implementadas

- [x] **Encurtamento:** Criação de links curtos com validação customizada.
- [x] **Redirecionamento:** Resolução dinâmica de URLs (/:shortCode) com incremento de acessos.
- [x] **Gestão:** Listagem performática e exclusão baseada em `shortCode`.
- [x] **Relatórios:** Exportação CSV gerada via stream e integrada com Cloudflare R2 (CDN).
- [x] **Feedback:** Sistema de notificações (Toast) para ações de copiar, criar e deletar.

---

### 🏛️ Notas de Manutenção

- **Migrations:** O servidor executa automaticamente `runMigrations()` ao iniciar, mas o comando manual `pnpm run db:migrate` está disponível para gerenciamento via Drizzle Kit.
- **Identificadores:** Por questões de consistência e segurança, o `shortCode` é utilizado como identificador principal em todas as operações da API, mantendo o UUID isolado na camada de persistência.

---
