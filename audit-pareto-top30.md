# Auditoria Completa - Relatorio Pareto Top 30 DermaClinic

**Data da auditoria:** 2026-08-31
**Auditor:** SIGMA (Data Scientist)
**Arquivos auditados:**
- JSON: `/cortex/files/dermaclinic/pareto-top30-raw-data.json`
- HTML: `/workspace/dai-reports/dermaclinic/reports/pareto-top30-2026-08-31.html`

---

## Resumo Executivo

| # | Validacao | Resultado | Severidade |
|---|-----------|-----------|------------|
| 1 | Consistencia de totais | **PASS** | - |
| 2 | Pareto cutoff 80/20 | **PASS** | - |
| 3 | Ticket medio (90 pacientes) | **PASS** | - |
| 4 | Pacientes compartilhados | **PASS** | - |
| 5 | Receita consolidada | **PASS** | - |
| 6 | Rankings | **PASS** | - |
| 7 | Cross-check HTML vs JSON | **PASS com ALERTA** | Media |
| 8 | Percentuais acumulados | **PASS** | - |
| 9 | Datas | **PASS** | - |
| 10 | Nomes fallback | **PASS com ALERTA** | Baixa |

**Parecer final: APROVADO com 2 alertas (nenhum critico)**

---

## Validacao 1: Consistencia de Totais

**Resultado: PASS**

Os Top 30 sao subconjuntos coerentes dos totais gerais. Receita Top 30 < Receita Total em todos os casos:

| Segmento | Receita Top 30 | Receita Total | Ratio |
|----------|---------------|---------------|-------|
| Dra. Raquel | R$ 336.500,00 | R$ 1.800.174,50 | 18,69% |
| Dra. Eoda | R$ 474.740,00 | R$ 1.799.180,00 | 26,39% |
| Consolidado | R$ 617.390,00 | R$ 3.599.354,50 | 17,15% |

Observacao: A Eoda tem concentracao significativamente maior nos Top 30 (26,4% vs 18,7% da Raquel), o que indica dependencia mais forte de poucos pacientes de alto valor. Isso e corretamente destacado na secao de insights do HTML.

---

## Validacao 2: Pareto Cutoff 80/20

**Resultado: PASS**

O calculo do ponto de corte esta correto para todas as segmentacoes:

| Segmento | Pacientes p/ 80% | % Pacientes | % Receita |
|----------|-------------------|-------------|-----------|
| Dra. Raquel | 370 de 954 | 38,78% | 80,05% |
| Dra. Eoda | 226 de 613 | 36,87% | 80,08% |
| Consolidado | 508 de 1.359 | 37,38% | 80,06% |

Todos os cutoffs estao entre 36-39%, o que e plausivel para distribuicoes de receita em servicos medicos (mais equilibrado que o 80/20 classico, onde ~20% bastaria). O HTML exibe corretamente "37.4%" como valor consolidado e "508 pacientes = 80% receita".

---

## Validacao 3: Ticket Medio

**Resultado: PASS**

Todos os 90 pacientes (30 Raquel + 30 Eoda + 30 Consolidado) foram validados computacionalmente:

**Formula:** `ticket_medio = receita / procedimentos`

**Divergencias encontradas: ZERO**

Tolerancia utilizada: R$ 0,01. Todos os 90 valores de ticket_medio conferem exatamente com a divisao receita/procedimentos, incluindo os arredondamentos de ponto flutuante.

---

## Validacao 4: Pacientes Compartilhados

**Resultado: PASS**

```
954 (Raquel) + 613 (Eoda) - 208 (compartilhados) = 1.359 (total unico)
```

- Total unico declarado no JSON: 1.359 -- **confere**
- Contagem de IDs na lista `shared_patient_ids`: 208 -- **confere**
- HTML exibe "1,359" pacientes unicos e "208 compartilhados" -- **confere**

---

## Validacao 5: Receita Consolidada

**Resultado: PASS**

```
R$ 1.800.174,50 (Raquel) + R$ 1.799.180,00 (Eoda) = R$ 3.599.354,50
```

- Valor consolidado declarado: R$ 3.599.354,50 -- **confere exatamente** (diferenca = R$ 0,00)
- A receita consolidada e a soma das receitas individuais (sem dupla contagem), pois cada atendimento pertence a um unico profissional
- Pacientes compartilhados contribuem com receita separada para cada profissional (atendimentos distintos)
- HTML exibe "R$ 3.599.354,50" -- **confere**

---

## Validacao 6: Rankings

**Resultado: PASS**

Os tres rankings (Raquel, Eoda, Consolidado) estao em ordem estritamente decrescente de receita. Nenhuma inversao encontrada.

Observacao para empates: Ranks 16-17 da Raquel (Keila Ventura e Fernanda Brandao Lapa, ambas R$ 9.200,00) e ranks 17-18 do Consolidado (Paciente #35111 e Sonia Regina Maria Balga***, ambos R$ 15.650,00) possuem o mesmo valor de receita. A ordenacao dentro do empate e arbitraria mas consistente -- nao constitui inversao.

---

## Validacao 7: Cross-check HTML vs JSON

**Resultado: PASS com ALERTA**

### Dados das tabelas

Todos os Top 5 de cada profissional foram validados campo a campo (nome, receita, procedimentos, ticket medio, datas, % acumulado):

- **Top 5 Raquel:** 5/5 OK
- **Top 5 Eoda:** 5/5 OK
- **Top 5 Consolidado:** 5/5 OK

Os 30 registros de cada aba foram verificados visualmente e todos os valores (receita, procedimentos, ticket medio, datas, percentuais arredondados) conferem com o JSON.

### Dados dos graficos

- **Grafico de barras (Top 15):** dados da Raquel e Eoda conferem com JSON -- **OK**
- **Curva de Pareto (30 pontos):** dados de ambas profissionais conferem exatamente com JSON -- **OK**
- **% acumulados arredondados:** todos os 90 valores arredondados (1 casa decimal) nas tabelas HTML conferem com o arredondamento dos valores JSON -- **OK**

### ALERTA: KPI "Ticket Medio Global"

O KPI exibido no header do HTML como **"Ticket Medio Global: R$ 59.989,24"** possui **label incorreto**:

- **Calculo real:** R$ 3.599.354,50 / 60 = R$ 59.989,24
- **O que e:** receita total dividida por 60 (soma dos tamanhos Top30 Raquel + Top30 Eoda)
- **O que deveria ser:** O label "Ticket Medio" implica receita/procedimentos, mas o calculo e receita_total/contagem_pacientes_top30
- **Problema adicional:** o denominador 60 nao desconta sobreposicao -- pacientes que aparecem no Top 30 de AMBOS profissionais sao contados 2x

**Recomendacao:** Alterar o label para "Receita Media por Paciente (Top 30)" ou remover este KPI, pois mistura base (receita total da clinica) com denominador (apenas pacientes Top 30), criando um numero sem significado pratico claro.

### ALERTA: Grafico de Barras (menor severidade)

O grafico de barras "Top 15 Pacientes" usa os nomes dos Top 15 da Raquel como labels do eixo X, mas plota os Top 15 da Eoda como segundo dataset. Isso cria uma **comparacao visualmente enganosa**, pois sugere que o mesmo paciente tem receitas diferentes em cada profissional, quando na verdade sao pacientes distintos (exceto os compartilhados). Os dados em si estao corretos; o problema e puramente de design visual.

---

## Validacao 8: Percentuais Acumulados

**Resultado: PASS**

- **Raquel:** 30 valores estritamente crescentes (1,29% -> 18,69%)
- **Eoda:** 30 valores estritamente crescentes (3,27% -> 26,39%)
- **Consolidado:** 30 valores estritamente crescentes (2,28% -> 17,15%)

Verificacao adicional: a soma dos `pct_receita` individuais confere exatamente com o ultimo `pct_acumulado` em todos os tres segmentos (diferenca = 0,00000000).

Os dados dos graficos Pareto no HTML conferem exatamente com os valores do JSON (precisao de ponto flutuante completa, sem arredondamento).

---

## Validacao 9: Datas

**Resultado: PASS**

Todas as datas de primeira e ultima visita nos 90 pacientes estao dentro do periodo declarado (set/2024 a ago/2026).

- **Data mais antiga:** 17/02/2025 (Evelyn Herte dos Santos e Teresa de Moura Gianesini, ambas Eoda)
- **Data mais recente:** 31/08/2026 (Gisleni Dos Santos Vieira, Raquel)

Observacao: O periodo declarado e "set/2024 - ago/2026", porem conforme a metodologia do proprio relatorio, os dados efetivos comecam em fev/2025 (set/2024 - jan/2025 retornou vazio). Todas as datas sao posteriores a fev/2025, o que e consistente.

---

## Validacao 10: Nomes Fallback

**Resultado: PASS com ALERTA**

### Top 30 por profissional
- **Raquel:** 0 nomes fallback
- **Eoda:** 0 nomes fallback

### Top 30 Consolidado
**5 nomes fallback encontrados:**

| Rank | Nome | ID | Receita |
|------|------|----|---------|
| 17 | Paciente #35111 | 35111 | R$ 15.650,00 |
| 20 | Paciente #284 | 284 | R$ 14.600,00 |
| 23 | Paciente #43553 | 43553 | R$ 13.900,00 |
| 29 | Paciente #27424 | 27424 | R$ 13.250,00 |
| 30 | Paciente #41397 | 41397 | R$ 13.150,00 |

**Analise:** Esses 5 pacientes nao estao no Top 30 individual de nenhuma profissional, mas aparecem no consolidado por terem receita combinada (de ambas profissionais) suficiente para entrar no ranking. Como nao foram consultados individualmente na API de pacientes durante a geracao dos Top 30 por profissional, o nome ficou como fallback.

**Impacto:** Baixo. Os valores de receita estao corretos. Os nomes fallback afetam apenas a apresentacao ao cliente. Recomenda-se resolver os nomes via API antes da entrega final.

---

## Verificacoes Adicionais (Cross-check de Pacientes Compartilhados no Consolidado)

Para pacientes compartilhados que aparecem no Top 30 de AMBOS profissionais, a receita consolidada foi validada:

| Paciente | Raquel | Eoda | Soma | Consolidado | Status |
|----------|--------|------|------|-------------|--------|
| Lourdes Maria Doria Duarte | R$ 23.280 | R$ 58.850 | R$ 82.130 | R$ 82.130 | OK |
| Aurea Fernandes De Oliveira | R$ 21.000 | R$ 26.600 | R$ 47.600 | R$ 47.600 | OK |
| Cinthia Pereira Bendini | R$ 9.500 | R$ 21.350 | R$ 30.850 | R$ 30.850 | OK |
| Simone Haritsch | R$ 8.700 | R$ 12.300 | R$ 21.000 | R$ 21.000 | OK |

Para pacientes compartilhados que aparecem no Top 30 de apenas um profissional, a receita do outro profissional esta fora do Top 30 (receita menor, nao capturada no ranking individual). A soma permanece consistente com o valor consolidado. Exemplos:

- Rosineia Brandenburg: Raquel R$ 16.000 + Eoda R$ 9.100 (fora Top30) = R$ 25.100 consolidado -- OK
- Viviane Isabel Daniel Speck De Souza: Eoda R$ 22.400 + Raquel R$ 1.050 (fora Top30) = R$ 23.450 -- OK

---

## Parecer Final

**APROVADO** -- O relatorio esta matematicamente consistente e pode ser entregue ao cliente.

### Achados que requerem atencao antes da entrega:

1. **[MEDIA] KPI "Ticket Medio Global" com label incorreto:** O valor R$ 59.989,24 nao e um ticket medio (receita/procedimentos), e sim a receita total dividida por 60. Recomendacao: corrigir o label ou remover o KPI.

2. **[BAIXA] 5 nomes fallback no Top 30 consolidado:** Pacientes #35111, #284, #43553, #27424 e #41397 aparecem como "Paciente #XXXXX". Recomendacao: resolver os nomes via API Feegow antes da entrega ao cliente.

3. **[BAIXA] Grafico de barras com comparacao visual enganosa:** Os labels do eixo X mostram nomes da Raquel, mas o dataset Eoda contem pacientes diferentes. Nao afeta a integridade dos dados, apenas a interpretacao visual.

### Integridade dos dados confirmada:

- Todas as formulas (ticket medio, pct_receita, pct_acumulado) estao corretas
- Rankings em ordem decrescente sem inversoes
- Receita consolidada = soma das receitas individuais (sem dupla contagem)
- Pacientes compartilhados: 954 + 613 - 208 = 1.359 (confere)
- Pareto cutoff coerente (~37-39% dos pacientes = 80% da receita)
- Datas dentro do periodo esperado
- Cross-check HTML vs JSON: 100% consistente (tabelas, graficos, percentuais)
