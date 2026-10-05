# Auditoria Final -- Meta Ads & Google Ads Set/2026 -- DermaClinic

**Auditor:** SIGMA (Data Science)
**Data:** 2026-10-05
**Fontes:** `meta-ads-set-2026-source.csv` (22 linhas, 21 criativos + 1 agregada), `google-ads-set-2026.csv`, `meta-ads-set-2026.html`

---

## 1. Meta Ads -- KPIs Principais

| Metrica | Fonte (CSV calculado) | Relatorio (HTML) | Match |
|---------|----------------------|------------------|-------|
| Total de conversas (resultados) | 86 | 86 | OK |
| Investimento Meta | R$439,29 | R$439,29 | OK |
| CPA medio | R$5,11 (439,29/86) | R$5,11 | OK |
| Impressoes | 16.747 | 16.747 | OK |
| Alcance | 7.780 (linha agregada) | 7.780 | OK |
| CTR Link | 1,10% (184/16.747) | 1,10% | OK |
| CPM | R$26,23 (439,29/16.747*1000) | R$26,23 | OK |
| Frequencia | 2,15 (16.747/7.780) | 2,15 | OK |

## 2. Distribuicao por Criativo (Top Performers)

| Criativo | Msgs (CSV) | Msgs (HTML) | Spend (CSV) | Spend (HTML) | CPA (CSV) | CPA (HTML) | Impr (CSV) | Impr (HTML) | % (CSV) | % (HTML) | Match |
|----------|-----------|-------------|-------------|--------------|-----------|------------|------------|-------------|---------|----------|-------|
| LASER CO2 \| 01 (2 conjuntos) | 36+27=63 | 63 | R$287,72 | R$287,72 | R$4,57 | R$4,57 | 11.407 | 11.407 | 73,3% | 73,3% | OK |
| LASER CO2 \| 02 (2 conjuntos) | 8+4=12 | 12 | R$47,37 | R$47,37 | R$3,95 | R$3,95 | 1.721 | 1.721 | 14,0% | 14,0% | OK |
| Dermaclinic Health Institute | 4 | 4 | R$17,75 | R$17,75 | R$4,44 | R$4,44 | 512 | 512 | 4,7% | 4,7% | OK |
| AQUAPURE \| 01 | 3 | 3 | R$5,12 | R$5,12 | R$1,71 | R$1,71 | 140 | 140 | 3,5% | 3,5% | OK |
| NOVOS SERVICOS \| 01 (2 inst.) | 1+0=1 | 1 | R$10,08+R$2,09=R$12,17 | R$12,17 | R$12,17 | R$12,17 | 627 | 627 | 1,2% | 1,2% | OK |
| DRA EODA \| 01 | 1 | 1 | R$3,32 | R$3,32 | R$3,32 | R$3,32 | 189 | 189 | 1,2% | 1,2% | OK |
| XERF \| 01 | 1 | 1 | R$31,41 | R$31,41 | R$31,41 | R$31,41 | 820 | 820 | 1,2% | 1,2% | OK |
| AQUAPURE \| 01 -- Copia | 1 | 1 | R$19,47 | R$19,47 | R$19,47 | R$19,47 | 679 | 679 | 1,2% | 1,2% | OK |

**Total tabela:** 86 msgs, R$439,29, 16.747 impr -- todos conferem com footer da tabela HTML.

## 3. Criativos Zombie (0 resultados, spend > 0)

| Criativo | Spend (CSV) | Spend (HTML) | Impr (CSV) | Impr (HTML) | Match |
|----------|-------------|--------------|------------|-------------|-------|
| TODA HISTORIA QUE CRESCE \| 01 -- Copia | R$0,48 | R$0,48 | 27 | 27 | OK |
| CASO RITA \| 01 (2 conjuntos: R$0,48+R$0,02) | R$0,50 | R$0,50 | 36 | 36 | OK |
| PORQUE ACREDITAMOS NA DERMACLINIC \| 01 | R$3,50 | R$3,50 | 190 | 190 | OK |
| CASO RENITA \| 01 | R$0,04 | R$0,04 | 2 | 2 | OK |
| CUIDADOS COM A PELE \| 01 | R$0,57 | R$0,57 | 22 | 22 | OK |
| CAIXA MISTERIOSA \| 01 | R$7,08 | R$7,08 | 291 | 291 | OK |
| CAIXA MISTERIOSA \| 01 -- Copia | R$0,40 | R$0,40 | 29 | 29 | OK |
| XERF \| 01 -- Copia | R$2,16 | R$2,16 | 48 | 48 | OK |
| CUIDADOS COM A PELE \| 01 -- Copia | R$0,23 | R$0,23 | 7 | 7 | OK |
| NOVOS SERVICOS \| 01 (2a instancia, 0 msgs) | R$2,09 | R$2,09 | 182 | 182 | OK |

**Relatorio diz 10 zombies, R$17,05, 3,88%:**
- 9 criativos com nome distinto + 1 instancia separada de NOVOS SERVICOS = 10 OK
- R$14,96 (9 nomeados) + R$2,09 (NOVOS SERVICOS 2a inst.) = R$17,05 OK
- 17,05 / 439,29 * 100 = 3,88% OK

## 4. LASER CO2 -- Concentracao

| Metrica | Calculado | Relatorio | Match |
|---------|-----------|-----------|-------|
| Conversas CO2 total | 75 (63+12) | 75 | OK |
| Share do total | 87,2% (75/86) | 87,2% | OK |
| CPA CO2 \| 01 | R$4,57 (287,72/63) | R$4,57 | OK |
| CPA CO2 \| 02 | R$3,95 (47,37/12) | R$3,95 | OK |
| HHI | 0,56 (por criativo individual) / 0,78 (por tema LASER vs resto) | >0,76 | OK (nota 1) |

**Nota 1 (HHI):** O relatorio afirma HHI ">0,76". Depende da granularidade:
- Por criativo individual (8 com resultados): HHI = 0,5600
- Por tema (LASER CO2 como bloco unico vs demais): HHI = 0,7769
- A contribuicao isolada do LASER CO2 ao HHI: (75/86)^2 = 0,7605

A afirmacao ">0,76" e defensavel quando se agrupa por tema (como e o natural em analise de portfolio de criativos). Nao e uma discrepancia, mas a metodologia deveria estar explicita no relatorio. **Aprovado com ressalva metodologica.**

## 5. Variacoes % vs Agosto

| Metrica | Calculo | Relatorio | Match |
|---------|---------|-----------|-------|
| Conversas | (86-93)/93 = -7,5% | -7,5% | OK |
| Investimento Meta | (439,29-751,69)/751,69 = -41,6% | -41,6% | OK |
| CPA Meta | (5,11-8,08)/8,08 = -36,8% | -36,8% | OK |
| CPM | (26,23-22,36)/22,36 = +17,3% | +17,3% | OK |
| CTR Link | (1,10-0,92)/0,92 = +19,6% | +19,6% | OK |
| Frequencia | (2,15-2,29)/2,29 = -6,1% | -6,1% | OK |
| Invest. Total | (1307,41-1536,87)/1536,87 = -14,9% | -14,9% | OK |

## 6. Google Ads -- Confirmacao dos 8 KPIs + 1

| KPI | CSV | Relatorio | Match |
|-----|-----|-----------|-------|
| Conversoes | 67,00 | 67 | OK |
| Custo | R$868,12 | R$868,12 | OK |
| CPA | R$12,96 | R$12,96 | OK |
| Cliques | 560 | 560 | OK |
| CTR | 3,99% | 3,99% | OK |
| Impressoes | 14.023 | 14.023 | OK |
| Taxa de Conversao | 11,96% | 11,96% | OK |
| CPC medio | R$1,55 | R$1,55 | OK |
| % Impr. parte superior | 65,91% | 65,91% | OK |

## 7. Metricas Consolidadas

| Metrica | Calculado | Relatorio | Match |
|---------|-----------|-----------|-------|
| Investimento Total | R$1.307,41 (439,29+868,12) | R$1.307,41 | OK |
| ROI | +68,3% ((2200-1307,41)/1307,41) | +68,3% | OK |

---

## 8. Discrepancias Encontradas

**Nenhuma discrepancia numerica encontrada.** Todas as 50+ metricas cruzadas batem exatamente entre CSV fonte e relatorio HTML.

**Ressalva metodologica (nao-bloqueante):**
- **HHI:** O relatorio afirma ">0,76" sem explicitar que e HHI por tema (LASER CO2 como bloco). Por criativo individual, HHI = 0,56. Recomendacao: adicionar nota de rodape esclarecendo a granularidade. Nao impacta a conclusao (concentracao critica e real em qualquer metodo).

---

## 9. Veredicto Final

### APROVADO

Todas as metricas do relatorio Meta Ads Set/2026 conferem com as fontes de dados (CSV Meta Ads e CSV Google Ads). Os calculos de CPA, CTR, CPM, frequencia, variacoes percentuais, distribuicao por criativo, zombie budget e ROI estao matematicamente corretos. A unica ressalva e metodologica (granularidade do HHI), sem impacto no resultado ou nas conclusoes do relatorio.

**Assinatura:** SIGMA -- Data Science & Statistical Analysis
**Timestamp:** 2026-10-05T00:00:00Z
