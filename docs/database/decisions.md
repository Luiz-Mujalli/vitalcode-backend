# VitalCode | Decisões de Engenharia

**Registro de decisões arquiteturais (ADR), modelagem relacional e invariantes de negócio.**

[Arquitetura](../architecture.md) · [Esquema relacional](schema.dbml) · [README](../../README.md)

## Sobre este registro

Este documento consolida as decisões que orientam a evolução do backend da VitalCode. Cada registro apresenta contexto, decisão e consequências, incluindo os compromissos técnicos assumidos. Os identificadores são estáveis e preservam a numeração das decisões originais. Uma decisão aceita representa uma escolha de arquitetura, não uma certificação de segurança ou conclusão de todas as medidas operacionais relacionadas.

## ADR-001 — Separação entre identidade e contexto empresarial

**Contexto:** atributos profissionais variam entre empresas, enquanto a identidade pertence à plataforma.

**Decisão:** manter `users` e `companies` independentes e representar a associação em `company_memberships`, incluindo cargo, papel e estado.

**Consequências:** evita duplicação de identidades e permite múltiplos vínculos. Em contrapartida, operações empresariais precisam verificar o vínculo específico; um papel global não é suficiente.

## ADR-002 — Perfil clínico individual

**Contexto:** informações clínicas pertencem ao indivíduo, não ao empregador.

**Decisão:** estabelecer relação de um para zero ou um entre `users` e `clinical_profiles`, com unicidade de `user_id`.

**Consequências:** evita fichas divergentes entre empresas e preserva a ficha após desligamento. Alterações na ficha afetam as consultas emergenciais de todos os vínculos elegíveis.

## ADR-003 — Preenchimento progressivo e completude explícita

**Contexto:** nem todas as informações estão disponíveis no cadastro inicial.

**Decisão:** permitir campos clínicos nulos e centralizar a avaliação de completude em `isClinicalProfileComplete`. Exigir registros explícitos de alergias, medicamentos, doenças, cirurgias e contato de emergência; tipo sanguíneo permanece opcional.

**Consequências:** existência da ficha não implica elegibilidade para emissão. Campos ausentes não significam ausência de condição clínica. A regra precisa ser aplicada também na consulta emergencial.

## ADR-004 — Minimização de dados na administração empresarial

**Contexto:** gestão de colaboradores não exige acesso irrestrito a informações clínicas.

**Decisão:** disponibilizar informações administrativas e status de completude, sem retornar o conteúdo clínico nesses endpoints.

**Consequências:** reduz exposição desnecessária e separa gestão profissional de informação de saúde. Completude não representa aptidão ocupacional. A rota pública emergencial possui uma fronteira de acesso distinta.

## ADR-005 — Proteção dos tokens de convite

**Contexto:** armazenar tokens originais permitiria sua reutilização em caso de exposição dos registros.

**Decisão:** gerar tokens aleatórios criptograficamente seguros e persistir somente o hash SHA-256, associado ao prazo e estado do convite.

**Consequências:** o token original não é recuperável pelo fluxo normal de consulta. Aceitação exige convite pendente, válido e destinatário correspondente. O fluxo de entrega e a verificação de propriedade do e-mail precisam evoluir.

## ADR-006 — Credenciais vinculadas ao contexto profissional

**Contexto:** uma credencial precisa representar um vínculo específico e permitir substituição independente em caso de perda.

**Decisão:** associar `emergency_credentials` a `company_memberships`, manter histórico e permitir até duas credenciais ativas por vínculo, para uso principal e reserva. Admins e employees elegíveis podem emitir credenciais próprias.

**Consequências:** tokens independentes permitem revogar apenas o crachá comprometido. O limite é aplicado por transação e locks, não por uma restrição única no banco. Credenciais revogadas nunca são reativadas. Não há obrigação técnica de emitir ambas simultaneamente.

## ADR-007 — Consulta emergencial por credencial de posse

**Contexto:** exigir uma conta do socorrista cria atrito no acesso emergencial.

**Decisão:** permitir consulta pública mediante token válido, com resposta limitada a informações essenciais e validação dos estados da credencial, conta, empresa, vínculo e ficha.

**Consequências:** reduz a barreira de acesso, mas qualquer portador de uma cópia válida pode consultar os dados disponibilizados. Rate limiting, cabeçalhos e auditoria reduzem riscos específicos, sem comprovar identidade ou necessidade de acesso. A adequação desse modelo para uso real exige avaliação de privacidade e segurança.

## ADR-008 — Auditoria de eventos relevantes

**Contexto:** operações sensíveis precisam de rastreabilidade.

**Decisão:** utilizar `audit_logs` com contexto empresarial, autor e alvo quando identificáveis, ação, recurso, metadados e data. Emissão, revogação e desligamento registram auditoria na mesma transação das alterações; consultas emergenciais também são auditadas.

**Consequências:** facilita investigação e correlação de eventos. A consulta pública não fornece identidade autenticada do autor. A tabela não é, por si só, um registro inviolável; retenção, controle de acesso e proteção contra alteração indevida permanecem necessários.

## ADR-009 — Integridade referencial na persistência

**Contexto:** validações da API não substituem garantias estruturais do banco.

**Decisão:** utilizar chaves estrangeiras, índices e restrições de unicidade conforme as migrations, complementados por validações de negócio.

**Consequências:** reduz inconsistências estruturais e exige tratamento de violações de integridade. Regras dependentes de estado, como o limite de credenciais ativas, continuam sob coordenação transacional da aplicação.

## ADR-010 — Evolução versionada do esquema

**Contexto:** mudanças manuais dificultam a reprodução e a manutenção dos ambientes.

**Decisão:** versionar alterações estruturais com migrations do Sequelize e manter o DBML como representação documental.

**Consequências:** alterações futuras devem ser registradas em novas migrations, preservando o histórico aplicado. Models, migrations e DBML precisam permanecer coerentes; mudanças destrutivas exigem planejamento próprio.

## ADR-011 — Autenticação independente do vínculo

**Contexto:** desligamento empresarial não equivale à exclusão da identidade global.

**Decisão:** permitir autenticação de contas ativas mesmo sem vínculos empresariais ativos.

**Consequências:** o usuário mantém acesso às funcionalidades individuais e pode aceitar novos convites. JWT válido não concede automaticamente acesso empresarial.

## ADR-012 — Autorização contextual por vínculo e papel

**Contexto:** usuários podem possuir permissões distintas em empresas diferentes.

**Decisão:** aplicar `authorizeCompany` nas rotas empresariais, validando empresa ativa, vínculo ativo e papel permitido. Utilizar o contexto autorizado nas consultas e revalidar condições críticas dentro das transações.

**Consequências:** reduz risco de acesso cruzado entre empresas por identificadores conhecidos. A proteção depende da aplicação consistente desses controles em todos os endpoints; o isolamento é lógico, não físico.

## ADR-013 — Ciclo transacional de convites

**Contexto:** criação, aceitação e recusa concorrentes podem produzir duplicidade ou transições conflitantes.

**Decisão:** coordenar operações críticas com transações, locks e validações de estado. A aceitação cria ou reativa o vínculo e marca o convite como aceito atomicamente. Cadastro do convidado não implica aceitação automática.

**Consequências:** convites aceitos ou recusados não podem ser reutilizados como pendentes. A validade temporal e o e-mail da conta são verificados. Testes locais cobrem cenários de concorrência, mas não demonstram ausência de todas as condições de corrida.

## ADR-014 — Restrição de privilégios em convites comuns

**Contexto:** dados enviados pelo cliente não devem permitir elevação de privilégios.

**Decisão:** definir `employee` no servidor durante a aceitação de convites comuns, inclusive na reativação de vínculo inativo.

**Consequências:** convites comuns não concedem privilégios administrativos. A gestão de administradores exige fluxo próprio, incluindo proteção do último responsável ativo. O desligamento de administradores não integra o endpoint atual de funcionários.

## ADR-015 — Separação entre token original e hash emergencial

**Contexto:** o QR Code precisa transportar uma chave utilizável sem tornar o valor persistido uma credencial diretamente reutilizável.

**Decisão:** gerar token aleatório de 32 bytes, representado em hexadecimal, armazenar seu SHA-256 e utilizar o token original na URL do QR Code. Na consulta, calcular novamente o hash e buscar a correspondência.

**Alternativa considerada:** armazenar um token recuperável ou utilizar diretamente o hash persistido como chave de acesso. A primeira opção aumenta a superfície de proteção de segredos; a segunda torna o valor do banco reutilizável como credencial.

**Consequências:** a URL e o QR Code são retornados na emissão, sem recuperação posterior pela listagem. Perda exige revogação e nova emissão. O hash não protege contra acesso direto às tabelas clínicas nem contra vazamento do token original em URLs ou logs.

## ADR-016 — Revogação definitiva no desligamento

**Contexto:** reativar um vínculo não deve restaurar acesso por crachás antigos.

**Decisão:** desativar o vínculo, revogar todas as credenciais ativas, preencher `revoked_at` e registrar eventos de auditoria na mesma transação.

**Consequências:** preserva conta e ficha clínica, invalida credenciais antigas e exige nova emissão após recontratação. Falhas na operação transacional impedem alterações parciais. A regra atual restringe desligamento a funcionários.

## ADR-017 — Coordenação de operações concorrentes

**Contexto:** verificações de estado e contagens isoladas podem se tornar obsoletas antes da escrita.

**Decisão:** utilizar transações e locks de atualização, com `READ COMMITTED` nos fluxos de emissão e desligamento. O bloqueio da empresa antecede os demais registros nesses fluxos; o vínculo é bloqueado antes da contagem de credenciais ativas.

**Consequências:** operações que seguem o protocolo compartilham uma fronteira de coordenação. A granularidade por empresa pode aumentar contenção. Novos fluxos de escrita devem respeitar a ordem de locks; testes de carga, deadlocks e concorrência ampliada permanecem necessários.

## ADR-018 — Minimização de informações em logs

**Contexto:** erros do ORM, consultas SQL e URLs podem conter dados sensíveis.

**Decisão:** desabilitar logging SQL padrão, evitar objetos completos de erro em logs operacionais e excluir senhas, tokens originais e conteúdo clínico dos registros. Preservar eventos de auditoria com metadados necessários.

**Consequências:** reduz exposição acidental, mas limita detalhes disponíveis para diagnóstico. Logger estruturado, sanitização de infraestrutura, controle de acesso e retenção devem complementar essa abordagem.

## ADR-019 — Organização modular em camadas

**Contexto:** o crescimento dos módulos torna diretórios técnicos planos difíceis de navegar.

**Decisão:** manter a arquitetura em camadas, agrupando controllers, services e validators por domínio e middlewares por responsabilidade. Centralizar funções compartilhadas em `utils`.

**Consequências:** facilita localização de regras e evolução incremental sem introduzir serviços distribuídos. Dependências entre domínios continuam exigindo disciplina para evitar acoplamento excessivo.

## ADR-020 — Proteções HTTP e limites operacionais

**Contexto:** a API possui endpoints autenticados e públicos com perfis de acesso diferentes.

**Decisão:** aplicar Helmet, CORS com origem configurável, limites de corpo e rate limiters distintos para tráfego geral, autenticação e emergência. Respostas emergenciais incluem diretivas de cache, indexação e referência.

**Consequências:** reduz classes específicas de abuso e exposição. CORS não substitui autorização; cabeçalhos não garantem confidencialidade. Contadores em memória são adequados ao ambiente local, mas exigem revisão de proxy, distribuição e disponibilidade no deploy.

## Governança e evolução

Novas decisões devem receber identificadores próprios. Quando uma decisão for substituída, seu histórico e a referência à sucessora devem ser preservados. Alterações em invariantes de negócio devem ser acompanhadas de revisão das migrations, contratos HTTP e testes pertinentes.

A utilização com dados clínicos reais depende de validação técnica, jurídica e operacional, incluindo LGPD, segurança, disponibilidade e gestão de incidentes. Este registro descreve escolhas de engenharia do MVP, não certificação de conformidade.
