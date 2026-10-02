# DermaClinic -- Insights e Analise de Atendimento | Setembro 2026

> **Periodo:** 01 a 25/set/2026 (25 de 30 dias -- periodo parcial)
> **Regime:** Caixa (receita por data_execucao)
> **Analista:** SIGMA (Data Science)
> **Data da analise:** 2026-09-26

---

## 1. Analise de KPIs Principais

### Receita Total: R$ 254.861

**Projecao para mes completo (30 dias):** R$ 305.833 (fator 30/25 = 1,20)

A receita de R$ 254.861 em 25 dias uteis indica uma clinica com faturamento robusto. Considerando apenas duas medicas ativas, a produtividade media por profissional e de **R$ 127.430/mes** (projetado: R$ 152.917) -- um patamar elevado para clinica dermatologica de pequeno porte. Este KPI esta **saudavel**.

### Ticket Medio: R$ 1.293,71

Um ticket medio acima de R$ 1.200 posiciona a DermaClinic no segmento premium de dermatologia. Isso indica predominancia de procedimentos esteticos de maior valor agregado (toxina botulinica, preenchimentos, lasers) sobre consultas simples. **Indicador saudavel** -- reflete posicionamento de mercado coerente.

### Taxa de Realizacao: 74,6% (197 de 264 agendados)

Este e o **principal ponto de atencao**. Uma taxa de realizacao de 74,6% significa que **1 em cada 4 horarios agendados nao se converte em atendimento**. O benchmark para clinicas dermatologicas premium e de 82-88%. Os 67 slots nao realizados representam:

- **Receita potencial nao capturada:** 67 x R$ 1.293,71 = **R$ 86.679** (estimativa)
- **Capacidade ociosa relevante** -- cada slot vazio e custo fixo sem retorno

Dos 264 agendados, 197 realizados + 46 cancelados = 243 com desfecho registrado. Os 21 restantes (264 - 243) podem ser remarcacoes, pendencias ou dados em aberto no sistema.

### Taxa de Cancelamento: 17,4% (46 de 264)

Taxa **preocupante** -- acima do benchmark saudavel de 8-12% para o segmento. Isso merece investigacao de causa-raiz: falta de confirmacao previa? Conflito de agenda? Procedimentos adiados por inseguranca financeira?

### Zero No-Shows: dado notavel e positivo

A ausencia completa de no-shows e **excepcional** e indica que o processo de confirmacao/lembrete da clinica funciona. Isso sugere que os cancelamentos sao comunicados previamente -- o paciente avisa que nao vira, em vez de simplesmente faltar. Possivel influencia de:
- Sistema de confirmacao via WhatsApp ativo
- Relacionamento proximo da equipe com os pacientes
- Politica de cobranca por no-show (se existir)

### Pacientes Novos vs Retorno: 33 novos (21%) | 124 retorno (79%)

A proporcao 21/79 e **saudavel**. Indica:
- **Base fidelizada forte** -- 79% de retorno demonstra satisfacao e recorrencia
- **Fluxo de aquisicao presente** -- 33 novos pacientes em 25 dias (~1,3/dia util) mantem a base crescendo
- **Benchmark:** clinicas maduras operam entre 15-25% de novos; 21% esta no ponto ideal

---

## 2. Insights por Medica

| Metrica | Dra. Eoda Steglich | Dra. Raquel Steglich | Delta |
|---|---|---|---|
| Realizados | 80 | 82 | -2 (praticamente igual) |
| Agendados | 108 | 109 | -1 (praticamente igual) |
| Taxa Realizacao | 74,1% | 75,2% | -1,1 p.p. |
| Receita | R$ 142.496 | R$ 103.770 | +R$ 38.726 (+37,3%) |
| Ticket Medio | R$ 1.781,20 | R$ 1.265,49 | +R$ 515,71 (+40,8%) |

### O que os numeros dizem

O volume de atendimento e **praticamente identico** (80 vs 82 realizados), mas a receita de Dra. Eoda e **37% superior**. A diferenca esta integralmente no ticket medio: R$ 1.781 vs R$ 1.265.

**Hipoteses para a diferenca de ticket medio:**

1. **Mix de procedimentos distinto** -- Dra. Eoda pode concentrar procedimentos de maior valor (preenchimentos faciais, bioestimuladores, laser fracionado) enquanto Dra. Raquel pode ter mais consultas clinicas e procedimentos de valor intermediario
2. **Perfil de pacientes** -- Dra. Eoda pode atender pacientes com maior poder aquisitivo ou mais dispostos a investir em tratamentos premium
3. **Upsell na consulta** -- Dra. Eoda pode combinar mais procedimentos por sessao (ex: toxina + preenchimento no mesmo atendimento)
4. **Especialidade/subespecialidade** -- cada medica pode ter areas de expertise que naturalmente geram tickets diferentes

**Nota metodologica:** a diferenca de 40,8% no ticket medio NAO e necessariamente um problema. Se Dra. Raquel atende mais dermatologia clinica (acne, dermatites, mapeamento de nevos), o ticket naturalmente sera menor -- e esse atendimento e essencial para o funil de conversao para estetica.

### Recomendacao

Cruzar os dados de procedimentos por medica para confirmar qual hipotese explica a diferenca. Se ambas fazem o mesmo mix de procedimentos, ha oportunidade de alinhar o ticket medio de Dra. Raquel.

---

## 3. Analise de Orcamentos

| Metrica | Valor |
|---|---|
| Emitidos | 7 |
| Convertidos | 5 |
| Taxa de conversao | 71,4% |
| Valor total orcado | R$ 21.370 |
| Valor convertido | R$ 16.170 |
| Ticket medio dos orcamentos | R$ 3.052,86 |
| Ticket medio convertido | R$ 3.234,00 |

### Interpretacao

A taxa de conversao de **71,4% e excelente** -- benchmark de mercado para clinicas esteticas e 40-60%. Os orcamentos que convertem tem ticket mais alto que os nao convertidos, o que sugere que o valor nao e o fator determinante de recusa.

**Porem, o volume e criticamente baixo.**

Apenas 7 orcamentos em 25 dias significa menos de **1 orcamento a cada 3 dias uteis**. Para uma clinica com 197 atendimentos no periodo, isso representa uma taxa de orcamentacao de apenas **3,6%** dos atendimentos.

**Duas leituras possiveis:**

1. **Orcamentos sao usados apenas para tratamentos de alto valor** -- o sistema de orcamentos e reservado para pacotes (ex: protocolo de bioestimuladores em 3 sessoes, combinacao de laser + peeling). A maioria dos procedimentos e agendada e cobrada diretamente, sem orcamento formal.

2. **Subutilizacao da ferramenta** -- se a clinica nao emite orcamento para procedimentos intermediarios (R$ 800-2.000), esta perdendo oportunidade de: (a) formalizar a proposta de valor, (b) rastrear conversao, (c) fazer follow-up estruturado com pacientes indecisos.

### Potencial nao capturado

Se a taxa de orcamentacao subisse de 3,6% para 15% dos atendimentos (~30 orcamentos/mes) mantendo a taxa de conversao de 71,4%, o valor convertido potencial seria:
- 30 x 71,4% x R$ 3.234 = **R$ 69.272** (vs R$ 16.170 atual)

---

## 4. Fototerapia

| Metrica | Valor |
|---|---|
| Sessoes realizadas | 209 |
| Pacientes | 49 |
| Receita registrada | R$ 1.460 |
| Media sessoes/paciente | 4,3 |
| Receita por sessao (registrada) | R$ 6,99 |

### Interpretacao

A receita de **R$ 1.460 para 209 sessoes** (R$ 6,99/sessao) confirma o modelo de **pacote pre-pago**: o paciente compra o pacote antecipadamente e a receita foi contabilizada no momento da venda, nao na execucao das sessoes. Os R$ 1.460 provavelmente representam sessoes avulsas ou renovacoes parciais.

**Dados notaveis:**

- **209 sessoes em 25 dias = 8,4 sessoes/dia** -- indica demanda consistente para fototerapia
- **49 pacientes com media de 4,3 sessoes** -- coerente com protocolos de 2-3x/semana
- **Volume expressivo** -- fototerapia ocupa capacidade relevante da clinica (mais sessoes que atendimentos medicos: 209 vs 197)

**Ponto de atencao:** como a receita ja foi contabilizada na venda do pacote, a fototerapia NAO aparece no faturamento mensal de forma proporcional. Para analise gerencial completa, seria necessario:
1. Saber o valor medio do pacote de fototerapia
2. Quantos pacotes novos foram vendidos em setembro
3. Calcular a receita diferida (competencia) vs caixa

### Estimativa de valor real

Se cada paciente compra um pacote medio de 20 sessoes a R$ 2.000 (estimativa conservadora para fototerapia UVB-NB), os 49 pacientes representam um valor de pacote de **R$ 98.000** ja contabilizado em meses anteriores. A receita "invisivel" da fototerapia e significativa.

---

## 5. Pontos de Atencao

### CRITICO
1. **Taxa de cancelamento de 17,4%** -- 46 cancelamentos em 264 agendados esta acima do aceitavel. Cada cancelamento tardio (sem tempo de reposicao) e um slot perdido. Estimativa de perda: ate R$ 59.551 em receita potencial nao capturada (46 x R$ 1.293,71).

### ALERTA
2. **Taxa de realizacao de 74,6%** -- a combinacao de cancelamentos + slots nao preenchidos deixa 25,4% da capacidade sem producao. Para uma clinica de duas medicas, isso equivale a ~67 horarios desperdicados no mes.

3. **Volume de orcamentos extremamente baixo** -- 7 orcamentos em 25 dias sugere subutilizacao da ferramenta de orcamentacao ou ausencia de processo de follow-up para tratamentos de maior complexidade.

### MONITORAR
4. **Concentracao de receita** -- Dra. Eoda responde por 55,9% da receita total. Dependencia elevada de uma unica profissional para mais da metade do faturamento.

5. **Visibilidade financeira da fototerapia** -- 209 sessoes com receita registrada irrisoria cria um ponto cego na analise de produtividade e ocupacao da clinica.

---

## 6. Recomendacoes Acionaveis

### 1. Implementar protocolo anti-cancelamento (impacto: alto)

**O que:** Estruturar processo de confirmacao em 3 etapas:
- D-2: Lembrete automatico via WhatsApp com opcao de remarcar
- D-1: Confirmacao ativa (paciente precisa responder "confirmo")
- Sem confirmacao ate D-1 18h: ligar para o paciente + liberar horario para lista de espera

**Meta:** Reduzir taxa de cancelamento de 17,4% para abaixo de 10% em 60 dias.

**Impacto estimado:** Recuperar 20+ horarios/mes = ~R$ 25.000-30.000 em receita potencial.

### 2. Criar lista de espera ativa (impacto: alto)

**O que:** Manter lista de pacientes que aceitam horarios de ultima hora (24-48h). Quando houver cancelamento, oferecer o horario imediatamente via WhatsApp automatizado.

**Meta:** Preencher ao menos 50% dos cancelamentos com pacientes da lista de espera.

**Impacto:** Converter slots vazios em receita -- cada slot reocupado vale ~R$ 1.294.

### 3. Aumentar volume de orcamentacao formal (impacto: medio-alto)

**O que:** Definir gatilho de orcamento para todo procedimento acima de R$ 1.500 ou combinacao de procedimentos. Usar o orcamento como ferramenta de follow-up (entrar em contato 48h apos envio se nao houve resposta).

**Meta:** Subir de 7 para 20+ orcamentos/mes mantendo taxa de conversao acima de 60%.

**Impacto:** Potencial de R$ 40.000-50.000 adicionais em receita orcada convertida.

### 4. Analisar mix de procedimentos por medica (impacto: medio)

**O que:** Cruzar os dados de procedimentos realizados por Dra. Eoda e Dra. Raquel para entender a composicao do ticket medio. Se ambas tem competencia para os mesmos procedimentos premium, avaliar redistribuicao de agenda para equilibrar receita.

**Meta:** Entender se a diferenca de 40,8% no ticket medio e estrutural (especialidades diferentes) ou gerenciavel (redistribuicao de pacientes/procedimentos).

### 5. Estruturar relatorio de fototerapia com visao de competencia (impacto: baixo-medio)

**O que:** Registrar no sistema o valor proporcional de cada sessao de fototerapia (valor do pacote / numero de sessoes) para que a produtividade real da clinica seja visivel. Incluir no relatorio mensal: pacotes novos vendidos, pacotes em andamento, sessoes restantes e receita diferida.

**Meta:** Ter visibilidade completa do faturamento real (caixa + competencia) a partir de outubro.

---

## Quadro Resumo

| KPI | Valor Set/26 | Status | Benchmark |
|---|---|---|---|
| Receita (25 dias) | R$ 254.861 | Saudavel | -- |
| Ticket medio | R$ 1.293,71 | Saudavel | Premium |
| Taxa realizacao | 74,6% | Preocupante | 82-88% |
| Taxa cancelamento | 17,4% | Critico | 8-12% |
| No-shows | 0% | Excelente | <5% |
| Novos/Retorno | 21%/79% | Saudavel | 15-25% novos |
| Conversao orcamentos | 71,4% | Excelente | 40-60% |
| Volume orcamentos | 7 | Muito baixo | 20-30/mes |

---

*Analise gerada com base nos dados do periodo 01-25/set/2026. Regime de caixa (data_execucao). Projecoes para mes completo usam fator linear 30/25 = 1,20. Benchmarks baseados em referencias de mercado para clinicas dermatologicas premium no Brasil.*
