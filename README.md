# 🚀 Brevly API - Encurtador de URLs Premium

Sistema de encurtamento de URLs desenvolvido com **Clean Architecture** e foco em **DevOps Moderno**. A aplicação é totalmente containerizada, garantindo que o ambiente de desenvolvimento seja idêntico ao de produção.

## 🏗️ Arquitetura de Infraestrutura

A aplicação utiliza um fluxo de **Multi-stage Build** no Docker para garantir segurança e performance, dividindo-se em três estágios:

1.  **Build Stage:** Ambiente completo com Node.js e ferramentas de desenvolvimento (TypeScript, Tsup). Aqui o código TS é transpilado para ESM (ES Modules) e as dependências de desenvolvimento são utilizadas.
2.  **Runtime Stage:** Imagem base `node:20-slim`. Contém apenas o essencial: o código transpilado (`dist`), as dependências de produção e o runtime do Node.
3.  **Database Stage:** PostgreSQL 16 rodando em container isolado com volumes persistentes.

---

## 🛠️ Stack Técnica

- **Runtime:** Node.js 20 (ESM)
- **Framework:** Fastify (Zod Type Provider)
- **Banco de Dados:** PostgreSQL via Drizzle ORM
- **Storage:** Cloudflare R2 (S3 Compatible)
- **Documentação:** Swagger (OpenAPI 3.0)
- **Containerização:** Docker & Docker Compose

---

## 🚦 Fluxo de Inicialização (Bootstrap)

A API possui um mecanismo de **Self-Healing** e **Auto-Migration**. Ao iniciar:

1.  O container da API aguarda o banco de dados estar `healthy`.
2.  A função `runMigrations()` é disparada programaticamente, utilizando os arquivos `.sql` gerados pelo Drizzle.
3.  O servidor Fastify faz o bind no host `0.0.0.0` para permitir o roteamento de portas do Docker.

---

## 📦 Como Rodar

### Pré-requisitos

- Docker & Docker Compose instalado.
- Arquivo `.env` configurado com as credenciais do Cloudflare R2 e PostgreSQL.

### Comandos Principais

```bash
# Levantar todo o ecossistema (API + DB) do zero
docker compose up --build

# Rodar em modo desenvolvimento local (com banco no Docker)
pnpm dev

# Resetar o banco de dados (CUIDADO: Apaga volumes)
docker compose down -v
```

---

## 🔗 Endpoints Principais

- `GET /docs`: Documentação interativa (Swagger).
- `POST /links`: Criação de links encurtados.
- `GET /links/export`: Geração de relatório CSV enviado diretamente para o Cloudflare R2.
