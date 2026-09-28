# 🟦 Alliance — Aplicativo de Controle Financeiro Inteligente

O **Alliance** é um aplicativo de controle financeiro projetado para ser **completo**, **simples** e **intuitivo**.  
Ele ajuda usuários a registrar entradas e saídas, acompanhar metas financeiras, analisar gastos e até criar objetivos compartilhados com outras pessoas — tudo em um só lugar.

---

## 📚 Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Integração com Cartões](#integração-com-cartões)
- [Metas Financeiras](#metas-financeiras)
- [Metas Compartilhadas](#metas-compartilhadas)
- [Análises Financeiras](#análises-financeiras)
- [Dependências e segurança](#dependências-e-segurança)


---

## 🔍 Visão Geral
O Alliance tem como objetivo tornar o controle financeiro algo fácil e visual.  
O usuário pode:

- Registrar entradas (salário, freelance, rendimentos etc.)
- Planejar quanto deseja gastar e quanto deseja guardar
- Criar metas financeiras
- Compartilhar metas com outra pessoa
- Acompanhar relatórios simples e diretos

Tudo isso sem burocracia, sem complexidade e com uma experiência agradável.

---

## ✅ Funcionalidades

### 📥 **Entradas de Dinheiro**
- Cadastro de entrada com valor e categoria.
- Categorias personalizáveis (salário, freelance, gorjetas...).
- Definição de planejamento:  
  - % que deseja gastar  
  - % que deseja guardar  
- O app calcula automaticamente o planejamento mensal.

---

### 📤 **Saídas de Dinheiro**
- Registro simples de gastos.
- Categorias personalizáveis (contas de casa, lazer, alimentação etc.)
- Comparação: **planejado vs. realizado**
- Avisos quando o usuário ultrapassa o limite planejado.

---

## 🎯 Metas Financeiras

O usuário pode criar metas como:

- Comprar um carro
- Viagem
- Casamento
- Fundo de emergência
- Comprar equipamentos

Em cada meta é possível:

- Registrar valores que está guardando
- Acompanhar o progresso em tempo real
- Ver valor total, quanto falta e porcentagem completa

Tudo sem movimentar dinheiro real — é um cofrinho virtual.

---

## 🤝 Metas Compartilhadas

Metas podem ser colaborativas!

- Convide outra pessoa (ex.: parceiro(a))
- Cada um registra suas contribuições
- Visualização clara de quanto cada um ajudou
- Transparência total na evolução da meta

Perfeito para metas como **casamento**, **viagem em dupla**, **projetos conjuntos**, etc.

---

## 📊 Análises Financeiras

O Alliance traz um painel de análise simples:

- Entradas totais do mês
- Saídas totais
- Quanto foi guardado
- Planejado vs. realizado
- Gráficos por categoria
- Comparação com meses anteriores
- Evolução das metas

Tudo de forma visual, rápida e fácil de entender.

## 🔐 Dependências e segurança

- O Dependabot verifica semanalmente as dependências npm de `api/` e as GitHub Actions. Ele abre pull requests com atualizações, agrupando versões minor e patch.
- O workflow OWASP Dependency-Check verifica vulnerabilidades conhecidas ao abrir pull requests, ao enviar alterações para `main` ou `develop` e toda segunda-feira. O scan falha para achados com CVSS 7 ou superior; o relatório HTML fica disponível como artefato da execução em Actions.
- Para conferir atualizações localmente, execute `cd api && npm outdated`. Para atualizar uma dependência dentro dos limites de versão já definidos, use `npm update nome-do-pacote`, revise `package.json` e `package-lock.json` e rode `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.
- Para considerar uma nova versão major, atualize explicitamente o pacote com `npm install nome-do-pacote@latest`, revise mudanças incompatíveis e rode as mesmas verificações antes de aceitar o pull request.

---

## 🚧 Status do Projeto
📌 **Em fase de planejamento e documentação.**  
Este repositório será atualizado conforme o desenvolvimento avance.
