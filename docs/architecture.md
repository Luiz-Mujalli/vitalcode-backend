# Arquitetura da VitalCode

## 1. Visão geral

A VitalCode é uma plataforma de gerenciamento de informações emergenciais de colaboradores, com arquitetura multiempresa e controle de acesso baseado nos vínculos profissionais.

O backend utiliza Node.js, Express.js, Sequelize e MariaDB, com separação entre responsabilidades HTTP, regras de negócio, autorização e persistência.

A API REST está em desenvolvimento e já possui funcionalidades de cadastro empresarial, autenticação, consultas administrativas e convites.

As funcionalidades clínicas, credenciais emergenciais e auditoria operacional ainda serão implementadas.

## 2. Tecnologias

| Tecnologia | Responsabilidade |
|---|---|
| Node.js | Ambiente de execução |
| JavaScript | Linguagem de programação |
| Express.js | Construção da API REST |
| Sequelize | ORM e gerenciamento de transações |
| MariaDB | Persistência relacional |
| JWT | Autenticação de usuários |
| Argon2id | Hash de senhas |
| Zod | Validação dos dados de entrada |
| Docker Compose | Ambiente de banco de dados |

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
├── scripts/
├── services/
├── validators/
├── app.js
└── server.js
```

### Configuração

O diretório `config/` centraliza parâmetros de infraestrutura, incluindo a configuração do Sequelize.

### Banco de dados

O diretório `database/` contém as migrations e a inicialização da conexão.

O arquivo `database/index.js` inicializa os models e registra suas associações.

As migrations versionam a estrutura do banco, incluindo tabelas, chaves estrangeiras, índices e restrições.

### Models

Os models representam as entidades persistidas e seus relacionamentos.

As associações são configuradas por meio do Sequelize.

### Routes

As rotas definem os endpoints HTTP e aplicam os middlewares necessários.

As operações administrativas são protegidas por autenticação e autorização empresarial.

### Controllers

Os controllers recebem requisições, validam os dados de entrada, acionam os serviços e constroem as respostas HTTP.

### Services

Os serviços concentram as regras de negócio e operações de persistência.

Operações que exigem consistência entre múltiplas alterações utilizam transações do Sequelize.

### Validators

Os validators utilizam Zod para validar os dados recebidos antes da execução das regras de negócio.

### Middlewares

Os middlewares implementam responsabilidades compartilhadas.

Entre os mecanismos existentes estão:

- `authMiddleware`: valida o JWT e verifica a existência e o estado ativo do usuário.
- `authorizeCompany`: verifica a empresa solicitada, o vínculo ativo e o papel autorizado.

## 4. Fluxo das requisições

```text
Cliente HTTP
    |
    v
Rotas Express
    |
    v
Middlewares de autenticação/autorização
    |
    v
Controllers
    |
    v
Validação de entrada
    |
    v
Services
    |
    v
Models Sequelize
    |
    v
MariaDB
```

A ordem e a presença de cada etapa dependem do endpoint.

Por exemplo, o cadastro público de empresas não exige autenticação, enquanto as consultas administrativas exigem autenticação e autorização empresarial.

## 5. Modelo multiempresa

A VitalCode separa a identidade global do usuário de seus vínculos com empresas.

As entidades principais são:

- `users`: identidades dos usuários.
- `companies`: empresas cadastradas.
- `company_memberships`: vínculos profissionais, cargos, papéis e estados.
- `invitations`: convites empresariais.
- `clinical_profiles`: informações clínicas individuais.
- `emergency_credentials`: credenciais associadas aos vínculos.
- `audit_logs`: registros destinados à auditoria.

Um mesmo usuário pode estar associado a diferentes empresas e possuir papéis distintos em cada uma.

As permissões administrativas são determinadas pelo vínculo correspondente à empresa solicitada, e não apenas pela identidade global.

## 6. Autenticação e autorização

### Autenticação

A autenticação utiliza JWT.

O middleware verifica a assinatura e a validade do token, identifica o usuário e confirma que sua conta está ativa.

A autenticação global não depende da existência de um vínculo empresarial ativo.

### Autorização empresarial

O middleware `authorizeCompany` verifica:

- A identificação da empresa solicitada.
- A existência e o estado ativo da empresa.
- A existência de vínculo ativo do usuário com a empresa.
- O papel permitido para a operação.

Após a autorização, o contexto empresarial validado é disponibilizado para a requisição.

As consultas administrativas utilizam esse contexto para limitar os resultados à empresa autorizada.

## 7. Cadastro empresarial

O cadastro público de empresas cria, em uma única transação:

1. A empresa.
2. O usuário administrador inicial.
3. O vínculo administrativo entre usuário e empresa.

Se alguma operação falhar, a transação é revertida.

## 8. Convites empresariais

### Criação

A criação de convites exige autenticação e autorização administrativa.

O serviço valida vínculos existentes e convites pendentes, gera um token aleatório e armazena somente seu hash SHA-256.

O fluxo utiliza transação e bloqueio da empresa para coordenar operações concorrentes de criação.

### Aceitação

A aceitação exige um usuário autenticado.

O serviço valida:

- Token recebido.
- Status pendente.
- Prazo de validade.
- Estado da empresa.
- Identidade do destinatário.
- Existência e estado do vínculo empresarial.

A operação cria ou reativa o vínculo e marca o convite como aceito dentro de uma única transação.

Convites comuns concedem o papel `employee`.

A implementação foi validada com testes manuais, consultas ao banco e testes locais de concorrência. Testes automatizados abrangentes e revisão de segurança ainda estão pendentes.

## 9. Segurança e privacidade

Os mecanismos já implementados incluem:

- Hash de senhas com Argon2id.
- Autenticação JWT.
- Autorização por empresa e papel.
- Restrição de consultas administrativas ao contexto empresarial.
- Armazenamento de hashes de tokens de convite.
- Transações em operações críticas.
- Restrições de integridade no banco de dados.

As próximas etapas de segurança incluem proteção do último administrador ativo, controles de acesso clínico, gestão de credenciais, auditoria, testes automatizados e preparação para produção.

Dados clínicos não são retornados pelas consultas administrativas atualmente implementadas.

## 10. Estado da implementação

**Implementado:**

- Persistência relacional e associações.
- Cadastro público de empresas.
- Autenticação JWT.
- Autorização empresarial.
- Listagem, pesquisa e consulta individual de funcionários.
- Criação e aceitação de convites.
- Criação e reativação de vínculos por convite.

**Pendente:**

- Cadastro de usuários sem conta por convite.
- Gestão administrativa de vínculos.
- Fichas clínicas.
- Credenciais com QR Code.
- Auditoria operacional.
- Testes automatizados abrangentes.
- Frontend em React.
- Deploy e controles de produção.

A arquitetura continuará evoluindo conforme novas funcionalidades forem implementadas.