# Decisões de Modelagem e Persistência

Este documento registra as principais decisões técnicas adotadas na modelagem inicial do banco de dados da VitalCode.

## 1. Separação entre usuários e empresas

**Decisão:** manter as entidades `users` e `companies` independentes, utilizando `company_memberships` para representar os vínculos profissionais.

**Justificativa:** separar a identidade do usuário de seu relacionamento com uma empresa evita misturar informações pessoais com atributos específicos do vínculo, como cargo, papel e status.

**Consequência:** as permissões empresariais devem ser verificadas considerando o vínculo correspondente, e não apenas a identidade global do usuário.

## 2. Perfil clínico individual

**Decisão:** estabelecer um relacionamento de um para zero ou um entre `users` e `clinical_profiles`.

**Justificativa:** as informações clínicas pertencem ao indivíduo e não devem ser duplicadas para cada vínculo empresarial.

**Consequência:** cada usuário poderá possuir no máximo um perfil clínico, cuja existência e completude serão tratadas separadamente.

## 3. Preenchimento progressivo da ficha clínica

**Decisão:** permitir valores nulos nos campos clínicos durante o preenchimento inicial.

**Justificativa:** o usuário pode iniciar o cadastro sem possuir imediatamente todas as informações necessárias.

**Consequência:** a ausência de valores no banco não representa automaticamente uma ficha completa. A aplicação deverá validar explicitamente os campos essenciais antes de autorizar a ativação da credencial emergencial.

## 4. Separação entre dados clínicos e administração empresarial

**Decisão:** o painel administrativo deverá consultar o status de preenchimento da ficha, sem disponibilizar seu conteúdo clínico.

**Justificativa:** o gerenciamento de funcionários não exige acesso irrestrito a informações médicas.

**Consequência:** a API deverá aplicar regras específicas de autorização e minimizar os dados retornados em cada contexto.

A conclusão da ficha clínica não representa aptidão ocupacional nem autorização para executar atividades profissionais.

## 5. Convites com tokens protegidos

**Decisão:** armazenar o hash do token de convite, em vez do token original.

**Justificativa:** reduzir o risco de exposição de tokens válidos em caso de acesso indevido ao banco de dados.

**Consequência:** a aplicação deverá gerar tokens criptograficamente seguros, validar sua expiração e impedir reutilização após a aceitação.

## 6. Credenciais emergenciais vinculadas ao vínculo profissional

**Decisão:** associar `emergency_credentials` a `company_memberships`, permitindo o histórico de credenciais de cada vínculo.

**Justificativa:** a credencial representa um mecanismo de acesso emergencial associado ao contexto profissional do usuário.

**Consequência:** será necessário controlar emissão, ativação e revogação, garantindo que cada vínculo possua no máximo uma credencial ativa.

Credenciais revogadas não deverão ser reativadas.

## 7. Controle de acesso emergencial

**Decisão:** utilizar um conjunto padronizado de informações essenciais para a visualização emergencial.

**Justificativa:** a disponibilização das informações necessárias ao atendimento não deve depender da configuração individual de visibilidade de cada campo crítico.

**Consequência:** a aplicação deverá definir explicitamente quais dados poderão ser exibidos, validar a credencial e adotar mecanismos de proteção contra acessos abusivos.

## 8. Auditoria de eventos

**Decisão:** utilizar a entidade `audit_logs` para registrar eventos relevantes da aplicação.

**Justificativa:** operações sensíveis precisam ser rastreáveis para apoiar investigações, diagnóstico de problemas e controles de segurança.

**Consequência:** os registros poderão identificar empresa, autor, usuário afetado, ação, recurso, origem da requisição e data do evento.

Os logs não deverão armazenar senhas, tokens originais ou conteúdo clínico sensível.

A aplicação também deverá estabelecer controles contra alteração indevida e políticas de retenção dos registros.

## 9. Integridade referencial

**Decisão:** utilizar chaves estrangeiras, índices e restrições de unicidade no banco de dados.

**Justificativa:** regras estruturais importantes devem ser protegidas também pela camada de persistência, independentemente das validações realizadas pela API.

**Consequência:** a aplicação deverá tratar adequadamente erros de integridade e utilizar transações em operações que envolvam múltiplas entidades.

## 10. Versionamento do esquema

**Decisão:** utilizar migrations do Sequelize para controlar alterações estruturais no banco de dados.

**Justificativa:** manter um histórico reproduzível da evolução do esquema e evitar alterações manuais não rastreadas.

**Consequência:** futuras mudanças estruturais deverão ser realizadas por novas migrations, preservando o histórico já aplicado.

## 11. Identidade global e autenticação independente de vínculos

**Decisão:** permitir a autenticação de usuários ativos mesmo quando não possuem vínculos empresariais ativos.

**Justificativa:** a identidade do usuário pertence à plataforma, enquanto os vínculos representam suas relações profissionais com empresas específicas.

**Consequência:** a autenticação confirma a identidade global, mas não concede automaticamente permissões empresariais. Essas permissões devem ser verificadas separadamente para cada operação.

Essa separação também permite que usuários autenticados aceitem convites para novas empresas.

## 12. Autorização baseada no contexto empresarial

**Decisão:** utilizar um middleware de autorização que valide a empresa solicitada, o vínculo ativo e o papel permitido antes da execução de operações administrativas.

**Justificativa:** um usuário pode possuir papéis diferentes em empresas distintas. A autorização não deve depender de um papel global.

**Consequência:** consultas e alterações administrativas devem utilizar a empresa autorizada como referência.

A consulta individual de funcionários deve verificar o vínculo do funcionário com a empresa solicitada, evitando acesso a usuários de outras empresas por meio de identificadores conhecidos.

## 13. Criação e aceitação transacional de convites

**Decisão:** utilizar transações para coordenar a criação e a aceitação de convites empresariais.

**Justificativa:** operações simultâneas podem causar inconsistências quando verificações e alterações são realizadas sem coordenação.

**Consequência:** a implementação utiliza bloqueios transacionais e validações de estado para reduzir condições de corrida.

Na aceitação, a criação ou reativação do vínculo e a atualização do convite devem ocorrer atomicamente.

O token deve ser de uso único e somente o usuário autenticado com o e-mail correspondente ao convite pode aceitá-lo.

Testes locais de concorrência foram realizados, mas a proteção completa ainda dependerá de testes automatizados e revisão dos demais fluxos de escrita.

## 14. Restrição de privilégios na aceitação de convites

**Decisão:** convites empresariais comuns concedem exclusivamente o papel `employee`.

**Justificativa:** a criação de convites não deve permitir que administradores atribuam privilégios adicionais por meio de dados enviados pelo cliente.

**Consequência:** o papel do vínculo é definido pelo servidor durante a aceitação.

Quando um vínculo inativo é reativado por convite comum, o papel é definido como `employee`, mesmo que o vínculo anterior possuísse outro papel.

A futura gestão de administradores deverá possuir regras próprias, incluindo a proteção contra remoção ou desativação do último administrador ativo da empresa.