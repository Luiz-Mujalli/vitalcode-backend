# Arquitetura da VitalCode

## 1. Visão geral

A VitalCode é uma plataforma de gerenciamento de informações emergenciais de colaboradores, estruturada para permitir o cadastro de empresas, o gerenciamento de vínculos profissionais e a disponibilização controlada de informações essenciais em situações de emergência.

A aplicação utiliza uma arquitetura backend baseada em Node.js, com persistência relacional e separação de responsabilidades entre os componentes.

## 2. Tecnologias

| Tecnologia | Responsabilidade |
|---|---|
| Node.js | Ambiente de execução do backend |
| Express.js | Framework HTTP para construção da API REST (em desenvolvimento) |
| Sequelize | ORM para modelagem e acesso ao banco |
| MariaDB | Banco de dados relacional |
| Docker Compose | Gerenciamento do ambiente de banco de dados |

## 3. Organização do backend

```text
src/
├── config/
│   └── database.js
├── controllers/
├── database/
│   ├── migrations/
│   └── index.js
├── middlewares/
├── models/
├── routes/
├── app.js
└── server.js
```

### Configuração

O diretório `config/` centraliza as configurações de infraestrutura, incluindo os parâmetros de conexão com o banco de dados.

### Banco de dados

O diretório `database/` contém as migrations e a inicialização do Sequelize.

As migrations definem e versionam a estrutura das tabelas, seus índices e suas restrições.

### Models

O diretório `models/` representa as entidades persistidas e suas associações.

Os models utilizam Sequelize e são inicializados por meio de `database/index.js`.

### Rotas (planejado)

A camada de rotas será responsável por mapear endpoints HTTP para os controllers correspondentes.

### Controllers (planejado)

Os controllers receberão as requisições HTTP, coordenarão a execução das operações e produzirão as respostas da API.

### Serviços e regras de negócio (planejado)

As regras de negócio serão separadas da lógica HTTP quando necessário, especialmente nos fluxos de autenticação, convites, credenciais emergenciais e autorização.

### Middlewares (planejado)

Os middlewares serão utilizados para responsabilidades transversais, como autenticação, autorização, validação e tratamento de erros.

## 4. Fluxo de requisições previsto

```text
Cliente HTTP
    |
    v
Rotas Express
    |
    v
Middlewares
    |
    v
Controllers
    |
    v
Regras de negócio / Serviços
    |
    v
Models Sequelize
    |
    v
MariaDB
```

Esse fluxo representa a arquitetura planejada. A implementação poderá ser ajustada conforme a complexidade das funcionalidades.

## 5. Modelo de dados

O banco de dados possui sete entidades principais:

- `companies`: empresas cadastradas.
- `users`: contas de usuários.
- `company_memberships`: vínculos entre usuários e empresas.
- `clinical_profiles`: informações clínicas associadas aos usuários.
- `invitations`: convites para ingresso em empresas.
- `emergency_credentials`: credenciais de acesso emergencial.
- `audit_logs`: registros de eventos relevantes.

O esquema relacional está documentado em `docs/database/schema.dbml`.

## 6. Segurança e privacidade

A arquitetura considera a separação entre dados de identificação, vínculos profissionais e informações clínicas.

As principais diretrizes de segurança incluem:

- Armazenamento seguro de senhas por meio de hashes.
- Armazenamento de hashes de tokens de convites e credenciais.
- Autorização baseada no vínculo e no papel do usuário.
- Restrição de acesso a informações clínicas.
- Validação do estado das credenciais antes do acesso emergencial.
- Auditoria de operações sensíveis.
- Minimização dos dados disponibilizados em situações de emergência.

Essas diretrizes deverão ser implementadas e verificadas na camada de aplicação.

## 7. Estado da implementação

A camada inicial de persistência está implementada, com sete migrations aplicadas, sete models e associações verificadas por consultas SQL.

A API REST, as regras de negócio, os mecanismos de autenticação e autorização e os testes de integração constituem as próximas etapas do desenvolvimento.