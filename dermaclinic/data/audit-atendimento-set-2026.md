# HOMELAND AUDIT -- Relatorio de Atendimento DermaClinic Set/2026

**Status**: REJEITADO (com ressalvas -- ver abaixo)
**Data da auditoria**: 02/10/2026
**Auditor**: HOMELAND (Senior Tech Lead & Gatekeeper)
**Arquivo auditado**: `/workspace/dai-reports/dermaclinic/reports/atendimento-set-2026.html`

---

## 1. TABELA METRICA A METRICA

### 1.1 KPIs Principais

| # | Metrica | Relatorio | Fonte/Calculado | Status | Detalhe |
|---|---------|-----------|-----------------|--------|---------|
| 1 | Receita Total | R$305.725 | R$305.725 (160 reg) | OK | Confere exatamente |
| 2 | Total Registros Financeiros | 160 | 160 | OK | Confere |
| 3 | Receita Derma (Raquel+Eoda+Prof5) | R$299.795 | R$299.795 (188725+100770+10300) | OK | Confere |
| 4 | Receita Raquel | R$188.725 | R$188.725 (75 reg) | OK | Confere |
| 5 | Receita Eoda | R$100.770 | R$100.770 (61 reg) | OK | Confere |
| 6 | Receita Prof 5 | R$10.300 | R$10.300 (21 reg) | OK | Confere |
| 7 | Receita Prof 2 | R$5.000 | R$5.000 (1 reg) | OK | Confere |
| 8 | Receita Fototerapia (Prof 4) | R$730 | R$730 (1 reg) | OK | Confere |
| 9 | Receita executante NULL | **Omitida** | R$200 (1 reg) | IMPRECISO | Relatorio nao menciona os R$200 do executante NULL. A soma fecha porque R$305.725 = 299.795 + 5.000 + 730 + 200. Omissao, nao erro de soma |
| 10 | TM Derma | R$1.326,53 | R$1.326,53 (299795/226) | OK | Confere exatamente |
| 11 | TM Raquel | R$1.763,79 | R$1.763,79 (188725/107) | OK | Confere. Nota: relatorio usa receita/atendimentos, NAO o TM financeiro da fonte (R$2.516,33 = 188725/75 registros financeiros) |
| 12 | TM Eoda | R$1.145,11 | R$1.145,11 (100770/88) | OK | Confere. Mesma nota: TM fin da fonte = R$1.651,97 (100770/61) |
| 13 | TM Prof 5 | R$332,26 | R$332,26 (10300/31) | OK | Confere |
| 14 | Total Agendamentos | 613 | 613 (129+152+290+42) | OK | Confere |
| 15 | Consultas Derma Realizadas | 226 | 226 (88+107+31) | OK | Confere |
| 16 | Consultas Derma Agendadas | 323 | 323 (129+152+42) | OK | Confere |
| 17 | Sessoes Fototerapia Realizadas | 254 | 254 (Atendido Prof 4) | OK | Confere |
| 18 | Sessoes Fototerapia Agendadas | 290 | 290 (Prof 4 total) | OK | Confere |
| 19 | Projecao Anual | R$3,67M | R$3.668.700 (305725x12) | OK | Confere |

### 1.2 Pacientes

| # | Metrica | Relatorio | Fonte | Status | Detalhe |
|---|---------|-----------|-------|--------|---------|
| 20 | Pacientes unicos total | 173 | 173 | OK | Confere |
| 21 | Pacientes novos | **57** | **56** | ERRADO | Fonte diz 56 novos. Relatorio diz 57. Diferenca de 1 paciente |
| 22 | Pacientes recorrentes | **116** | **117** | ERRADO | Fonte diz 117 recorrentes. Relatorio diz 116. Consequencia direta do erro #21 |
| 23 | % Novos | **32,9%** | **32,4%** (56/173) | ERRADO | Deveria ser 32,4% com 56 novos, nao 32,9% |
| 24 | Taxa de Retorno | **67,1%** | **67,6%** (117/173) | ERRADO | Com 117 recorrentes de 173 = 67,6%, nao 67,1% |

### 1.3 No-show e Cancelamentos

| # | Metrica | Relatorio | Fonte/Calculado | Status | Detalhe |
|---|---------|-----------|-----------------|--------|---------|
| 25 | No-show Derma (total) | 9 (2,8%) | 9 (2,8% de 323) | OK | Prof1: 2 + Prof3: 5 + Prof5: 2 = 9. Confere |
| 26 | No-show Fototerapia | 18 (6,2%) | 18 (6,2% de 290) | OK | Confere |
| 27 | No-show Geral | 27 (4,4%) | 27 (4,4% de 613) | OK | Confere |
| 28 | No-show Raquel | 5 (3,3%) | 5 (3,3% de 152) | OK | Confere |
| 29 | No-show Eoda | 2 (1,6%) | 2 (1,6% de 129) | OK | Confere |
| 30 | No-show Prof 5 | 2 (4,8%) | 2 (4,8% de 42) | OK | Confere |
| 31 | Desmarcados total | 58 | 58 (23+31+4) | OK | Confere. Foto nao tem desmarcados na fonte |
| 32 | Remarcados total | 20 | 20 (12+7+1) | OK | Confere |
| 33 | Cancelamentos total (desm+rem) | 78 (12,7%) | 78 (12,7% de 613) | OK | Confere |
| 34 | Atendidos total | 480 (78,3%) | 480 (78,3% de 613) | OK | 88+107+254+31 = 480. Confere |
| 35 | Marcado nao confirmado total | 28 | 28 (4+2+18+4) | OK | Confere |

### 1.4 Receita por Semana

| # | Metrica | Relatorio | Fonte | Status | Detalhe |
|---|---------|-----------|-------|--------|---------|
| 36 | W36 (01-04/set) | R$35.344, 30 reg, 11,6% | R$35.344, 30 reg, 11,6% calc | OK | Confere |
| 37 | W37 (08-11/set) | R$61.025, 33 reg, 20,0% | R$61.025, 33 reg, 20,0% calc | OK | Confere |
| 38 | W38 (14-18/set) | R$37.185, 18 reg, 12,2% | R$37.185, 18 reg, 12,2% calc | OK | Confere |
| 39 | W39 (21-25/set) | R$122.037, 57 reg, 39,9% | R$122.037, 57 reg, 39,9% calc | OK | Confere |
| 40 | W40 (28-30/set) | R$50.134, 22 reg, 16,4% | R$50.134, 22 reg, 16,4% calc | OK | Confere |
| 41 | Soma semanal | R$305.725, 160 reg | R$305.725, 160 reg | OK | Confere |

### 1.5 Formas de Pagamento

| # | Metrica | Relatorio | Fonte | Status | Detalhe |
|---|---------|-----------|-------|--------|---------|
| 42 | Cartao Credito | 91 trans, R$167.870, 54,9% | 91, R$167.870, 54,9% calc | OK | Confere |
| 43 | Sem forma (NULL) | 25 trans, R$52.084, 17,0% | 25, R$52.084, 17,0% calc | OK | Confere |
| 44 | Transf Bancaria | 1 trans, R$29.800, 9,7% | 1, R$29.800, 9,7% calc | OK | Confere |
| 45 | Cartao Debito | 19 trans, R$24.622, 8,1% | 19, R$24.622, 8,1% calc | OK | Confere |
| 46 | PIX | 19 trans, R$23.399, 7,7% | 19, R$23.399, 7,7% calc | OK | Confere |
| 47 | Dinheiro | 5 trans, R$7.950, 2,6% | 5, R$7.950, 2,6% calc | OK | Confere |
| 48 | Total pagamentos | 160 trans, R$305.725 | 160, R$305.725 | OK | Confere |

### 1.6 Variacoes Ago vs Set

| # | Metrica | Relatorio | Calculado | Status | Detalhe |
|---|---------|-----------|-----------|--------|---------|
| 49 | Var receita total | +12,1% | +12,1% ((305725-272805)/272805) | OK | Confere |
| 50 | Var TM derma | +11,4% | +11,4% ((1326.53-1190.36)/1190.36) | OK | Confere |
| 51 | Var TM Raquel | **+53,8% (sumario) / +53,6% (tabela)** | **+53,5%** ((1763.79-1148.72)/1148.72) | IMPRECISO | Inconsistencia interna: sumario diz "+53,8%", tabela de evolucao diz "+53,6%", valor correto = +53,5%. Tres numeros diferentes para a mesma metrica |
| 52 | Var TM Eoda | -6,1% | -6,1% ((1145.11-1219.71)/1219.71) | OK | Confere |
| 53 | Var consultas derma | +8,7% | +8,7% ((226-208)/208) | OK | Confere |
| 54 | Var sessoes foto | +6,3% | +6,3% ((254-239)/239) | OK | Confere |
| 55 | Var receita derma | +21,1% | +21,1% ((299795-247595)/247595) | OK | Confere |

### 1.7 Participacao e Concentracao

| # | Metrica | Relatorio | Calculado | Status | Detalhe |
|---|---------|-----------|-----------|--------|---------|
| 56 | Part Raquel na receita derma | 63,0% | 63,0% (188725/299795) | OK | Confere |
| 57 | Part Raquel - sumario executivo | **61,5% da derma** | **63,0%** | ERRADO | Sumario diz "61,5% da derma" -- incorreto. 188725/305725 = 61,7% do TOTAL, e 188725/299795 = 63,0% da DERMA. Nenhum dos dois bate com 61,5% |
| 58 | Part Eoda na receita derma | 33,6% | 33,6% (100770/299795) | OK | Confere |
| 59 | Part Prof 5 na receita derma | 3,4% | 3,4% (10300/299795) | OK | Confere |
| 60 | Concentracao Raquel+Eoda no total | 94,7% | 94,7% ((188725+100770)/305725) | OK | Confere |
| 61 | Concentracao Raquel+Eoda na derma | 96,6% (secao 5 texto) | 96,6% ((188725+100770)/299795) | OK | Confere |
| 62 | Taxa realizacao derma | 69,97% | 69,97% (226/323) | OK | Confere |

### 1.8 Fototerapia

| # | Metrica | Relatorio | Fonte | Status | Detalhe |
|---|---------|-----------|-------|--------|---------|
| 63 | Pacientes unicos foto | 48 | Nao verificavel na fonte fornecida | IMPRECISO | Fonte nao fornece dados de pacientes unicos de fototerapia. Nao pode ser confirmado |

---

## 2. CALCULOS DERIVADOS

| # | Calculo | Resultado Relatorio | Resultado Correto | Status |
|---|---------|---------------------|-------------------|--------|
| C1 | TM derma = 299795 / 226 | R$1.326,53 | R$1.326,53 | OK |
| C2 | TM Raquel = 188725 / 107 | R$1.763,79 | R$1.763,79 | OK |
| C3 | TM Eoda = 100770 / 88 | R$1.145,11 | R$1.145,11 | OK |
| C4 | TM Prof5 = 10300 / 31 | R$332,26 | R$332,26 | OK |
| C5 | Projecao = 305725 * 12 | R$3,67M | R$3.668.700 = R$3,67M | OK |
| C6 | Var receita = (305725-272805)/272805 | +12,1% | +12,06% ~ +12,1% | OK |
| C7 | Var TM = (1326.53-1190.36)/1190.36 | +11,4% | +11,44% ~ +11,4% | OK |
| C8 | No-show derma = 9/323 | 2,8% | 2,79% ~ 2,8% | OK |
| C9 | No-show foto = 18/290 | 6,2% | 6,21% ~ 6,2% | OK |
| C10 | Cancel rate = 78/613 | 12,7% | 12,72% ~ 12,7% | OK |
| C11 | Comparecimento = 480/613 | 78,3% | 78,30% ~ 78,3% | OK |
| C12 | Var TM Raquel = (1763.79-1148.72)/1148.72 | 53,8% (sum) / 53,6% (tab) | **53,55%** | IMPRECISO -- ver #51 |
| C13 | Taxa retorno = recorrentes/total | 67,1% (116/173) | **67,6% (117/173)** | ERRADO -- ver #24 |
| C14 | % novos = novos/total | 32,9% (57/173) | **32,4% (56/173)** | ERRADO -- ver #23 |

---

## 3. VALIDACAO DE INSIGHTS

| # | Insight/Afirmacao | Sustentado? | Detalhe |
|---|-------------------|-------------|---------|
| I1 | "Receita R$305.725 (+12,1% vs ago R$272.805)" | SIM | Dados conferem |
| I2 | "TM derma R$1.326,53 (+11,4% vs ago)" | SIM | Calculo correto |
| I3 | "Dra. Raquel lidera com R$188.725 e TM R$1.763,79" | SIM | Dados conferem |
| I4 | "No-show derma 2,8% -- 5-7x abaixo benchmark 15-20%" | SIM | 2,8% vs 15-20% = 5,4x a 7,1x. Afirmacao valida |
| I5 | "Taxa retorno 67,1% (116 de 173) acima benchmark 55-65%" | PARCIAL | O numero de recorrentes na fonte e 117, nao 116. A taxa correta seria 67,6%, que continua acima do benchmark. O insight e valido mas o numero esta errado |
| I6 | "Raquel 61,5% da derma" (sumario) | NAO | Raquel = 63,0% da derma (ou 61,7% do total). 61,5% nao corresponde a nenhum calculo |
| I7 | "Concentracao Raquel+Eoda 94,7% do faturamento total" | SIM | (188725+100770)/305725 = 94,67% ~ 94,7% |
| I8 | "TM Raquel +53,8% vs ago" (sumario) | IMPRECISO | Calculado = +53,55%. Relatorio alterna entre 53,8% e 53,6% |
| I9 | "Cancelamentos 12,7% -- proximo ao limite superior do benchmark 8-12%" | SIM | 12,7% de fato excede o teto de 12% |
| I10 | "W39 foi a semana mais forte com R$122.037 (39,9%)" | SIM | Dados conferem |
| I11 | "Cartao Credito domina com 54,9% (R$167.870)" | SIM | Dados conferem |
| I12 | "57 novos pacientes (32,9%) -- captacao ativa" | PARCIAL | Fonte diz 56 novos, nao 57 |
| I13 | "Receita anual R$3,67M +89% acima do teto benchmark R$1,94M" | SIM | (3.67-1.94)/1.94 = 89,2%. Calculo valido |
| I14 | "No-show fototerapia 6,2% -- acima do benchmark" | PARCIAL | O benchmark citado para foto e o geral de 15-20%. O relatorio diz "acima do benchmark de 3-5%" na secao de oportunidades, mas esse benchmark de 3-5% nao aparece na fonte citada (Panorama Doctoralia). Fonte do benchmark de foto nao e clara |
| I15 | "TM Eoda caiu -6,1%" | SIM | (1145.11-1219.71)/1219.71 = -6,12% ~ -6,1% |
| I16 | "Executante NULL R$200" omitido na composicao da receita | OMISSAO | Relatorio decompoe como R$299.795 + R$5.000 + R$730 = R$305.525, faltam R$200. Soma fecha no total de R$305.725, mas o texto narrativo ignora o executante NULL |

---

## 4. DISCREPANCIAS ENCONTRADAS

### CRITICA (bloqueiam aprovacao)

| # | Severidade | Local | Descricao | Impacto |
|---|------------|-------|-----------|---------|
| D1 | **CRITICA** | Pacientes novos/recorrentes (multiplas secoes) | Fonte diz **56 novos e 117 recorrentes**. Relatorio diz **57 novos e 116 recorrentes**. Diferenca de 1 paciente. TODOS os derivados estao contaminados: % novos (32,9% vs 32,4%), taxa de retorno (67,1% vs 67,6%). O erro se propaga por: KPI "Pacientes Unicos" (57 novos 32,9%), KPI "Taxa de Retorno" (67,1% / 116 de 173), Secao 2 texto, Secao 5 tabela, Secao 6 comparativo, Secao Agendamentos Feegow, Nota metodologica. | **Alto** -- numero errado aparece em pelo menos 8 locais do relatorio |
| D2 | **CRITICA** | Sumario Executivo, linha 207 | "61,5% da derma" para Raquel. Valor correto: **63,0% da derma** (188725/299795) ou 61,7% do total (188725/305725). **61,5% nao corresponde a NENHUM calculo valido**. | **Alto** -- sumario executivo e a primeira coisa que o cliente le |

### MEDIA

| # | Severidade | Local | Descricao | Impacto |
|---|------------|-------|-----------|---------|
| D3 | **MEDIA** | Sumario vs tabela de evolucao | Variacao TM Raquel: sumario diz **"+53,8%"** (linha 207), secao 3 texto diz **"+53,8%"** (linha 570), tabela de evolucao diz **"+53,6%"** (linha 648), comparativo ago/set diz **"+53,6%"** (linha 863). Valor correto: **+53,55%**. Inconsistencia interna -- tres arredondamentos diferentes do mesmo numero | **Medio** -- inconsistencia visual, mas qualquer dos tres e aceitavel como arredondamento |

### BAIXA

| # | Severidade | Local | Descricao | Impacto |
|---|------------|-------|-----------|---------|
| D4 | **BAIXA** | Receita derma decomposicao | Texto diz R$299.795 + R$5.000 + R$730 = total. Os R$200 do executante NULL sao omitidos. A soma fecha corretamente porque o total R$305.725 e da fonte, nao da soma parcial. Mas a decomposicao narrativa esta incompleta | **Baixo** -- nao afeta nenhum calculo |
| D5 | **BAIXA** | Nota metodologica sobre TM | O relatorio calcula TM como receita/atendimentos (188725/107 = R$1.763,79). A fonte fornece um TM financeiro diferente (188725/75 registros = R$2.516,33). Ambos sao validos para propositos diferentes, mas a diferenca nao e explicada em nenhum lugar. O TM por atendimento faz mais sentido clinicamente, mas deveria haver uma nota | **Baixo** -- metodologicamente aceitavel |
| D6 | **BAIXA** | Benchmark fototerapia | Na secao 8, o no-show foto de 6,2% e comparado com "benchmark de 3-5%", mas esse benchmark nao aparece em nenhuma fonte citada. As fontes citadas (Panorama Doctoralia+Feegow 2024) falam de 15-20% generico | **Baixo** -- benchmark sem fonte |

---

## 5. RESUMO QUANTITATIVO

| Categoria | Total verificado | OK | Errado | Impreciso | Nao verificavel |
|-----------|------------------|----|--------|-----------|-----------------|
| Metricas brutas | 48 | 45 | 2 | 1 | 0 |
| Calculos derivados | 14 | 11 | 2 | 1 | 0 |
| Insights/afirmacoes | 16 | 10 | 1 | 3 | 0 |
| Percentuais semanais | 5 | 5 | 0 | 0 | 0 |
| Formas pagamento | 7 | 7 | 0 | 0 | 0 |
| **TOTAL** | **90** | **78** | **5** | **5** | **0** |

**Taxa de acuracia**: 86,7% correto, 5,6% errado, 5,6% impreciso

---

## 6. VEREDICTO HOMELAND

### REJEITADO -- 2 problemas CRITICOS

O relatorio apresenta excelente qualidade visual e narrativa, e a GRANDE MAIORIA dos numeros esta correta (78 de 90 metricas conferem exatamente). Porem, ha dois problemas criticos que impedem a aprovacao:

**1. Pacientes novos/recorrentes (D1)**: 57 vs 56 novos. Esse erro de 1 paciente contamina a taxa de retorno (67,1% vs 67,6%) e o percentual de novos (32,9% vs 32,4%), e se repete em 8+ locais do relatorio. O impacto numerico e pequeno, mas e um erro factual que um cliente atento pode cruzar com o sistema Feegow e perder confianca no relatorio inteiro.

**2. Participacao Raquel no sumario (D2)**: "61,5% da derma" nao corresponde a nenhum calculo valido. O correto e 63,0% da derma ou 61,7% do total. Esse numero esta no SUMARIO EXECUTIVO -- a parte mais lida do relatorio.

### Correcoes obrigatorias para aprovacao:

1. **Corrigir pacientes**: 56 novos, 117 recorrentes, 32,4% novos, 67,6% taxa de retorno -- em TODOS os locais
2. **Corrigir participacao Raquel no sumario**: de "61,5%" para "63,0% da derma" (ou "61,7% do total", mas ser explicito sobre a base)
3. **Padronizar variacao TM Raquel**: escolher +53,5% ou +53,6% (arredondamento aceitavel) e usar o MESMO valor em todas as mencoes

### Recomendacoes (nao bloqueiam, mas devem ser tratadas):

4. Adicionar nota sobre os R$200 do executante NULL na decomposicao de receita
5. Citar fonte do benchmark de 3-5% para no-show fototerapia, ou usar o benchmark geral de 15-20%

---

**Proximo passo**: Devolver ao implementador com esta lista de correcoes. Apos correcoes, resubmeter para re-auditoria HOMELAND.

---

*HOMELAND -- Senior Tech Lead & Gatekeeper*
*Auditoria realizada em 02/10/2026*
*90 metricas verificadas, 5 discrepancias encontradas (2 criticas, 1 media, 3 baixas)*
