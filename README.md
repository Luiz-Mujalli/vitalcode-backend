# VitalCode

**Plataforma de gerenciamento de informações emergenciais para colaboradores, com arquitetura multiempresa, controle de acesso e credenciais de identificação.**

## Sobre o projeto

A VitalCode é uma plataforma full stack em desenvolvimento, projetada para auxiliar empresas na organização de informações essenciais de seus colaboradores para situações de emergência.

O sistema permite o cadastro de empresas, autenticação de usuários, gerenciamento de vínculos profissionais e convites para novos colaboradores.

A proposta é permitir que cada colaborador mantenha uma ficha com informações clínicas emergenciais e utilize uma credencial com QR Code para disponibilizar informações essenciais em situações de emergência, respeitando regras específicas de acesso e privacidade.

**Status:** Backend em desenvolvimento. Os módulos de autenticação, consultas administrativas e convites já possuem implementações funcionais. Os recursos clínicos e de QR Code ainda estão pendentes.

## Tecnologias

**Backend**
- Node.js
- JavaScript
- Express.js
- Sequelize ORM
- MariaDB
- JWT (JSON Web Token)
- Argon2id para hash de senhas
- Zod para validação de dados

**Infraestrutura**
- Docker
- Docker Compose

**Ferramentas**
- Git e GitHub
- Postman
- DBeaver
- dbdiagram.io

**Frontend planejado**
- React

## Arquitetura

O backend segue uma organização em camadas, com separação entre:

- **Routes:** definição dos endpoints e aplicação de middlewares.
- **Controllers:** tratamento das requisições e respostas HTTP.
- **Services:** implementação das regras de negócio.
- **Validators:** validação dos dados recebidos.
- **Middlewares:** autenticação e autorização.
- **Models:** representação das entidades persistidas.
- **Migrations:** versionamento da estrutura do banco de dados.

### Arquitetura multiempresa

A VitalCode utiliza uma estrutura em que a identidade do usuário é global e seus vínculos empresariais são representados separadamente.

As principais entidades são:

- `users`: identidades dos usuários.
- `companies`: empresas cadastradas.
- `company_memberships`: vínculos entre usuários e empresas.
- `invitations`: convites para ingresso em empresas.
- `clinical_profiles`: informações clínicas emergenciais.
- `emergency_credentials`: credenciais de emergência.
- `audit_logs`: registros destinados à auditoria.

Um usuário pode possuir vínculos com diferentes empresas, com papéis e estados independentes em cada uma.

O acesso administrativo aos funcionários é limitado à empresa autorizada, utilizando autenticação JWT e verificação de vínculo ativo com papel administrativo.

## Funcionalidades implementadas

### Cadastro e autenticação

- Cadastro público de empresas.
- Criação transacional da empresa, usuário administrador e vínculo inicial.
- Armazenamento seguro de hashes de senhas.
- Autenticação com JWT.
- Consulta da identidade autenticada.
- Consulta das empresas ativas associadas ao usuário.

### Gestão administrativa de funcionários

- Listagem de funcionários por empresa.
- Pesquisa de funcionários por nome ou sobrenome.
- Consulta individual de funcionário.
- Verificação de permissões administrativas.
- Restrição de consultas ao contexto empresarial autorizado.
- Retorno de informações administrativas sem exposição de dados clínicos.

### Convites empresariais

- Criação de convites por administradores autorizados.
- Validação de dados de entrada.
- Geração de tokens aleatórios.
- Armazenamento de hashes SHA-256 dos tokens.
- Expiração de convites.
- Verificação de vínculos ativos e convites pendentes.
- Proteção transacional básica contra criação simultânea de convites duplicados.
- Aceitação de convites por usuários autenticados.
- Validação da identidade do destinatário.
- Criação ou reativação transacional de vínculos empresariais.
- Restrição de convites comuns ao papel `employee`.
- Prevenção de reutilização de convites aceitos.

## Endpoints implementados

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/companies/register` | Cadastrar empresa e administrador inicial |
| POST | `/auth/login` | Autenticar usuário |
| GET | `/auth/me` | Consultar usuário autenticado |
| GET | `/companies/my` | Listar empresas associadas ao usuário |
| GET | `/companies/:companyId/employees` | Listar e pesquisar funcionários |
| GET | `/companies/:companyId/employees/:employeeId` | Consultar funcionário específico |
| POST | `/companies/:companyId/invitations` | Criar convite empresarial |
| POST | `/invitations/accept` | Aceitar convite |

A listagem de funcionários aceita o parâmetro opcional `search`.

Exemplo:

`GET /companies/5/employees?search=João`

As rotas administrativas exigem autenticação e autorização na empresa correspondente.

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
├── scripts/
├── services/
├── validators/
├── app.js
└── server.js

docs/
├── database/
│   ├── decisions.md
│   └── schema.dbml
└── architecture.md
```

## Configuração do ambiente

### Pré-requisitos

- Node.js
- npm
- Docker e Docker Compose

### Instalação

Clone o repositório:

```bash
git clone https://github.com/Luiz-Mujalli/vitalcode-backend.git
cd vitalcode-backend
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente utilizando o arquivo `.env.example` como referência.

Inicie o banco de dados:

```bash
docker compose up -d
```

Execute as migrations:

```bash
npx sequelize-cli db:migrate
```


### Executando a API

Após configurar o arquivo `.env`, iniciar o MariaDB e executar as migrations, inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

O comando utiliza o Nodemon para executar `src/server.js` e reiniciar a aplicação automaticamente durante o desenvolvimento.

Por padrão, a aplicação utiliza a porta configurada em `PORT`.

**Observação:** a API ainda não possui uma suíte automatizada de testes configurada. As funcionalidades implementadas foram verificadas manualmente com Postman, consultas ao MariaDB e scripts locais de concorrência.

**Observação:** os comandos de inicialização e as variáveis necessárias devem ser conferidos com a configuração atual do repositório.

## Testes e validações

As funcionalidades implementadas foram verificadas manualmente com Postman e consultas ao MariaDB.

Entre os cenários validados estão:

- Cadastro empresarial e regras de duplicidade.
- Autenticação e autorização.
- Restrição de acesso entre empresas.
- Pesquisa e consulta individual de funcionários.
- Criação de convites e rejeição de duplicidades.
- Aceitação de convites válidos.
- Rejeição de convites expirados, cancelados ou já utilizados.
- Rejeição de convites por usuários não destinatários.
- Criação e reativação de vínculos.
- Testes locais de concorrência na criação e aceitação de convites.

Essas verificações não substituem uma suíte automatizada de testes nem uma auditoria de segurança.

## Segurança e privacidade

A VitalCode foi projetada considerando a separação entre identidade global, vínculos empresariais e informações clínicas.

Entre os mecanismos já implementados estão:

- Hash de senhas com Argon2id.
- Autenticação JWT.
- Autorização por vínculo e papel.
- Consultas administrativas limitadas à empresa autorizada.
- Tokens de convite armazenados como hash.
- Transações para operações críticas.
- Restrições de unicidade no banco de dados.

**Limitações atuais:** a entrega dos tokens de convite ainda utiliza um fluxo de desenvolvimento. Os mecanismos de proteção de informações clínicas, auditoria, gestão completa de credenciais e controles operacionais de produção ainda precisam ser concluídos.

O projeto não deve ser utilizado para armazenar informações clínicas reais ou apoiar atendimentos emergenciais antes da implementação e validação dos controles necessários.

## Próximas etapas

- Cadastro de usuários que ainda não possuem conta por meio de convites.
- Gestão administrativa de vínculos empresariais.
- Proteção contra desativação do último administrador ativo.
- Implementação das fichas clínicas emergenciais.
- Controle de conclusão das fichas.
- Emissão, consulta e revogação de credenciais com QR Code.
- Auditoria de operações relevantes.
- Testes automatizados.
- Implementação do frontend com React.
- Preparação de ambiente de produção e deploy.

## Documentação complementar

- `docs/architecture.md` — arquitetura e organização do sistema.
- `docs/database/decisions.md` — decisões de modelagem e persistência.
- `docs/database/schema.dbml` — representação do esquema relacional.

## Objetivo

A VitalCode é um projeto autoral desenvolvido para aplicar conceitos de engenharia de software, arquitetura de APIs REST, modelagem relacional, autenticação, autorização multiempresa e desenvolvimento full stack.

O desenvolvimento prioriza a compreensão das decisões técnicas, a evolução incremental e a validação das regras de negócio.