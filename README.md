# VitalCode

Sistema de gerenciamento de informações emergenciais de colaboradores, desenvolvido com foco em segurança, organização de dados e acesso rápido a informações essenciais em situações de emergência.

## Sobre o projeto

A VitalCode é uma plataforma de gerenciamento de informações emergenciais, projetada para centralizar dados essenciais de colaboradores e facilitar seu acesso em situações de emergência.

A plataforma permitirá que funcionários mantenham suas informações clínicas emergenciais atualizadas e utilizem credenciais com QR Code para disponibilizar dados essenciais em situações de emergência.

O projeto também contempla gerenciamento de empresas, vínculos profissionais, convites e auditoria de operações relevantes.

## Tecnologias

**Backend**
- Node.js
- JavaScript
- Express.js (integração em desenvolvimento)
- Sequelize ORM
- MariaDB
- Docker e Docker Compose

**Ferramentas**
- Git e GitHub
- Postman
- DBeaver
- dbdiagram.io

## Funcionalidades previstas

- Cadastro e autenticação de usuários.
- Cadastro e gerenciamento de empresas.
- Gerenciamento de vínculos entre funcionários e empresas.
- Convites para novos colaboradores.
- Cadastro e atualização de informações clínicas emergenciais.
- Emissão e revogação de credenciais com QR Code.
- Consulta controlada de informações emergenciais.
- Registro de eventos relevantes para auditoria.
- Controle de acesso conforme o perfil e as permissões do usuário.

## Estado atual do desenvolvimento

**Implementado:**
- Estrutura inicial do backend.
- Configuração do MariaDB com Docker.
- Configuração do Sequelize.
- Sete migrations aplicadas.
- Sete models implementados.
- Associações entre os models verificadas por consultas SQL.

**Em desenvolvimento:**
- API REST com Express.
- Autenticação e autorização.
- Regras de negócio e validações.
- Endpoints para gerenciamento das entidades.
- Testes de integração.

As funcionalidades descritas como previstas ainda não representam recursos disponíveis para utilização.

## Estrutura do projeto

```text
src/
├── config/
├── controllers/
├── database/
│   ├── migrations/
│   └── index.js
├── middlewares/
├── models/
├── routes/
├── app.js
└── server.js

docs/
├── database/
│   ├── decisions.md
│   └── schema.dbml
└── architecture.md
```

## Documentação

- `docs/architecture.md` — arquitetura e organização do sistema.
- `docs/database/decisions.md` — decisões de modelagem e persistência.
- `docs/database/schema.dbml` — representação do esquema relacional em DBML.

## Segurança e privacidade

O projeto considera a proteção de informações pessoais e clínicas desde sua modelagem.

Entre as diretrizes previstas estão a separação de permissões, o armazenamento de hashes de tokens, a restrição de acesso aos dados clínicos e a auditoria de operações sensíveis.

Essas medidas ainda dependem de implementação e validação nas camadas de aplicação.
