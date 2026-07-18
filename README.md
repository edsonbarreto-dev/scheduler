# Scheduler

Aplicação demonstrativa em Angular para gestão de clientes, prestadores e agendamentos.

## Status

Em desenvolvimento.

## Objetivo

Explorar recursos do Angular em um cenário funcional, incluindo:

- componentes standalone;
- roteamento;
- formulários reativos;
- RxJS;
- consumo de APIs;
- gerenciamento de estado;
- controle temporário de horários;
- atualização assíncrona da interface.

## Fluxos previstos

### Provider

Área simulada do prestador para:

- administrar clientes;
- consultar a agenda;
- cancelar ou atualizar agendamentos.

### Customer

Área pública para:

- acessar o link do prestador;
- selecionar data e horário;
- realizar agendamento;
- consultar e cancelar agendamentos ativos.

### Scheduling

Responsável pelo fluxo de disponibilidade e bloqueio temporário de horários durante o processo de agendamento.

## Tecnologias

- Angular
- TypeScript
- RxJS
- SCSS

## Executando localmente

Requisitos:

- Node.js
- npm
- Angular CLI

Instalação:

    npm install

Execução:

    npm start

Aplicação disponível em:

    http://localhost:4200

## Estrutura atual

    src/
    └── app/

A estrutura será organizada por funcionalidades conforme o projeto evoluir.

## Decisões técnicas

As principais decisões de arquitetura e implementação serão registradas durante o desenvolvimento.

## Limitações atuais

- autenticação simulada;
- backend ainda não implementado;
- dados inicialmente locais ou mockados;
- projeto destinado a demonstração técnica.

## Autor

Edson Barreto  
https://edsonbarreto.dev.br
