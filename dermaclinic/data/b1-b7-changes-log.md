# Log de Correções B1–B7 — atendimento-set-2026.html

**Arquivo:** `/workspace/dai-reports/dermaclinic/reports/atendimento-set-2026.html`
**Data:** 2026-10-05
**Executado por:** Implementer (Claude Sonnet 4.6)

---

## B1 — Inversão de Nomes Raquel ↔ Eoda (PRIORIDADE MÁXIMA)

**Problema:** O relatório atribuía os números do prof_id=3 (exec_id=3) ao nome "Dra. Raquel" e os do prof_id=1 ao nome "Dra. Eoda". Os dados corretos são: prof_id=3 = Eoda (R$188.725, 107 atend., TM R$1.763,79) e prof_id=1 = Raquel (R$100.770, 88 atend., TM R$1.145,11).

**Estratégia de swap em 3 passos:**
1. "Raquel" (todas as formas) → "XTEMP_RAQUELX"
2. "Eoda" (todas as formas) → "Raquel"
3. "XTEMP_RAQUELX" → "Eoda"

**Ocorrências afetadas (~20 pontos):**
- Sumário executivo (linhas 199, 207)
- Callout de destaques e pontos de atenção (linhas 207, 215)
- Bloco de análise financeira (linha 295)
- Análise da seção 2 (linha 458)
- Bloco de análise seção 3 (linhas 565–570)
- Tabela de desempenho por médica (linhas 589–604)
- Tabela de evolução de TM (linhas 645–654)
- Barras de progresso (linhas 770–774)
- Nota abaixo das barras (linha 783)
- Tabela comparativa ago × set (linhas 860–869)
- Análise comparativa (linha 895)
- Card de oportunidade Eoda (linhas 1007–1010)
- Próximos passos (linhas 1055–1057)

**Resultado após swap:**
- Dra. Eoda Steglich: 107 atend., R$188.725, TM R$1.763,79 (63,0%)
- Dra. Raquel Steglich: 88 atend., R$100.770, TM R$1.145,11 (33,6%)

---

## B2 — Nota Nutrologia (Prof 5)

**Problema:** O KPI de "Consultas Realizadas" e o sumário não distinguiam dermatologia (195) de nutrologia (31) dentro dos 226 totais.

**Correções:**
- KPI card "Consultas Realizadas": kpi-unit alterado de `dermatologia (Prof 1+3+5)` para `dermatologia (195) + nutrologia (31)`
- Sumário executivo: "226 consultas realizadas" → "226 consultas realizadas (195 dermatologia + 31 nutrologia)"

---

## B3 — Receita Agosto Corrigida

**Problema:** Receita de agosto estava como R$272.805; o banco confirma R$282.105 (via data_execucao).

**Correções (replace_all):**
- `R$272.805` → `R$282.105` (4 ocorrências: sumário, KPI prev, tabela comparativa, callout)

---

## B4 — Variações de Agosto Corrigidas

**Problema:** Com agosto = R$282.105, a variação da receita cai de +12,1% para +8,4%. Cascata de correções:

| Campo | Antes | Depois |
|-------|-------|--------|
| Variação receita ago→set | +12,1% | +8,4% |
| Consultas derma agosto | 208 | 216 |
| Variação consultas | +8,7% | +4,6% |
| TM agosto clínica | R$1.190,36 | R$1.201,83 |
| Variação TM | +11,4% | +10,4% |
| Pacientes únicos agosto | 238 | 244 |
| Variação pacientes únicos | −27,3% | −29,1% |
| No-show derma agosto | 4,15% (27 casos) | 3,5% (13 casos) |
| Variação no-show (pp) | −1,35pp | −0,7pp |
| Projeção anual base ago | R$3,27M | R$3,39M (282.105×12) |

---

## B5 — Pacientes Novos: 57 → 56

**Problema:** A nota metodológica dizia "57 no total" para primeiras consultas, mas o dado correto é 56.

**Correção:**
- Linha 1111: `Primeiras consultas = primeiro_agendamento=1 e status=3 — 57 no total` → `56 no total`
- Nota: o "57" na linha 338 (contagem de registros da semana W39) foi preservado — não se refere a pacientes.

---

## B6 — Benchmarks Fabricados

**Problema:** Duas fontes de benchmark não verificadas estavam citadas com nome de publicação específica.

**Correções:**
- `Benchmark ABIHF 2024` (benchmark PIX) → `Referência de mercado`
- `Inquérito SBD 2024` (2 ocorrências, benchmark taxa de retorno) → `Referência de mercado`
- Valores numéricos (55–65% retorno, 18–25% PIX) foram mantidos intactos.

---

## B7 — Comparação TM vs Consulta

**Problema:** O relatório apresentava "2,7× acima da média nacional" sem explicar que o TM inclui procedimentos estéticos de alto valor, não só consultas avaliativas de R$300–500.

**Correções (3 ocorrências):**
1. Bloco análise financeira (linha 298): `2,7× acima da média nacional de R$300–500` → `acima da média nacional de R$300–500` + nota em itálico sobre procedimentos estéticos
2. Tabela indicadores clínicos (linha 501): `2,7× acima da média nacional` → `Acima da média nacional` + nota
3. Tabela benchmarks setor (linha 918): `2,7× acima da média nacional` → `Acima da média nacional` + nota

**Nota adicionada (texto):** "Nota: O ticket médio inclui procedimentos estéticos de alto valor (laser, Restylane, Botox), não apenas consultas avaliativas."

---

## Verificação Final

Grep pós-edição confirmou ausência de:
- `XTEMP_RAQUELX` — nenhuma ocorrência
- `R$272.805` — nenhuma ocorrência
- `+12,1%` — nenhuma ocorrência
- `4,15%` — nenhuma ocorrência
- `ABIHF` — nenhuma ocorrência
- `Inquérito SBD` — nenhuma ocorrência
- `2,7×` — nenhuma ocorrência
- `57 no total` — nenhuma ocorrência

Verificação de valores corretos inseridos: todos presentes e consistentes.
