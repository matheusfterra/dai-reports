# Auditoria SIGMA -- DermaClinic Set/2026

**Auditor:** SIGMA (Data Scientist)
**Data:** 02/10/2026
**Fontes verificadas:** `meta-ads-parsed.json` (21 rows), `google-ads-set-2026.csv`, `analysis.json`
**Relatorios auditados:** `meta-ads-set-2026.html`, `criativos-set-2026/index.html`

---

## 1. Relatorio Meta Ads (meta-ads-set-2026.html)

### 1.1 KPIs Header

| Metrica | Valor no HTML | Valor Fonte | Recalculo | Status |
|---------|---------------|-------------|-----------|--------|
| Conversas Meta | 86 | analysis.json: 86; soma raw: 86 | 86 | OK |
| Investimento Meta | R$439,29 | raw row0: 439.29; soma criativos: 439.29 | 439.29 | OK |
| CPA Meta | R$5,11 | analysis.json: 5.11 | 439.29/86 = 5.1058 ~5.11 | OK |
| CPM | R$26,23 | raw row0: 26.2310 | (439.29/16747)*1000 = 26.23 | OK |
| CTR Link | 1,10% | analysis.json: 1.1 | (184/16747)*100 = 1.099 ~1.10% | OK |
| Investimento Total | R$1.307,41 | 439.29+868.12 = 1307.41 | 1307.41 | OK |

### 1.2 Deltas vs Agosto

| Delta | Valor no HTML | Recalculo | Status |
|-------|---------------|-----------|--------|
| Conversas | -7,5% | (86-93)/93*100 = -7.5% | OK |
| Investimento Meta | -41,6% | (439.29-751.69)/751.69*100 = -41.6% | OK |
| CPA | -36,8% | (5.11-8.08)/8.08*100 = -36.8% | OK |
| CPM | +17,3% | (26.23-22.36)/22.36*100 = +17.3% | OK |
| CTR Link | +19,6% | (1.10-0.92)/0.92*100 = +19.6% | OK |
| Chatwoot | -50,8% | (32-65)/65*100 = -50.8% | OK |
| Investimento Total | -14,9% | (1307.41-1536.87)/1536.87*100 = -14.9% | OK |

### 1.3 Google Ads

| Metrica | Valor no HTML | Valor Fonte (CSV) | Status |
|---------|---------------|-------------------|--------|
| Cliques | 560 | 560 | OK |
| Impressoes | 14.023 | 14.023 | OK |
| CTR | 3,99% | 3,99% | OK |
| CPC | R$1,55 | 1,55 | OK |
| Custo | R$868,12 | 868,12 | OK |
| Conversoes | 67 | 67,00 | OK |
| Custo/conversao | R$12,96 | 12,96 | OK |
| Taxa conv | 11,96% | 11,96% | OK |
| Delta conversoes vs ago | +4,7% | (67-64)/64*100 = 4.7% | OK |
| Delta custo vs ago | +10,6% | (868.12-785.18)/785.18*100 = 10.6% | OK |
| Delta CPC vs hist | -82,5% | (1.55-8.85)/8.85*100 = -82.5% | OK |

### 1.4 Tabela Comparativa Historica (14 linhas)

| Metrica | Ago HTML | Set HTML | Fonte Ago | Fonte Set | Status |
|---------|----------|----------|-----------|-----------|--------|
| Conversas Meta | 93 | 86 | analysis: 93 | raw: 86 | OK |
| Invest. Meta | R$751,69 | R$439,29 | analysis: 751.69 | raw: 439.29 | OK |
| CPA Meta | R$8,08 | R$5,11 | analysis: 8.08 | calc: 5.11 | OK |
| CPM | R$22,36 | R$26,23 | analysis: 22.36 | raw: 26.23 | OK |
| CTR Link | 0,92% | 1,10% | analysis: 0.92 | calc: 1.10% | OK |
| Frequencia | 2,29 | 2,15 | -- | raw: 2.1526 | OK (2.15 arredondado) |
| Alcance Meta | -- | 7.780 | -- | raw: 7780 | OK |
| Impressoes Meta | -- | 16.747 | -- | raw: 16747 | OK |
| Chatwoot Inbox 56 | 65 | 32 | analysis: 65 | analysis: 32 | OK |
| Conv. Google Ads | 64 | 67 | analysis: 64 | CSV: 67 | OK |
| Custo Google Ads | ~R$785 | R$868,12 | analysis: 785.18 | CSV: 868.12 | OK |
| CPC Google | R$8,85 | R$1,55 | analysis: 8.85 | CSV: 1.55 | OK |
| Invest. Total | R$1.536,87 | R$1.307,41 | analysis: 1536.87 | calc: 1307.41 | OK |
| ROI Real | +889% (R$4.400) | +68,3% (R$2.200) | -- | calc: (2200/1307.41-1)*100=68.3% | OK |

### 1.5 Ranking de Criativos (meta-ads-set-2026.html, secao 4)

| # | Criativo | Msgs HTML | Msgs Fonte | Gasto HTML | Gasto Fonte | CPA HTML | CPA Calc | Impr HTML | Impr Fonte | Status |
|---|----------|-----------|------------|------------|-------------|----------|----------|-----------|------------|--------|
| 1 | LASER CO2 01 (consol.) | 63 | 36+27=63 | R$287,72 | 149.61+138.11=287.72 | R$4,57 | 287.72/63=4.57 | 11.407 | 5510+5897=11407 | OK |
| 2 | LASER CO2 02 (consol.) | 12 | 8+4=12 | R$47,37 | 23.71+23.66=47.37 | R$3,95 | 47.37/12=3.95 | 1.721 | 856+865=1721 | OK |
| 3 | Dermaclinic HI 01 | 4 | 4 | R$17,75 | 17.75 | R$4,44 | 17.75/4=4.44 | 512 | 512 | OK |
| 4 | AQUAPURE 01 | 3 | 3 | R$5,12 | 5.12 | R$1,71 | 5.12/3=1.71 | 140 | 140 | OK |
| 5 | NOVOS SERVICOS 01 (consol.) | 1 | 1+0=1 | R$12,17 | 10.08+2.09=12.17 | R$12,17 | 12.17/1=12.17 | 627 | 445+182=627 | OK |
| 6 | DRA EODA 01 | 1 | 1 | R$3,32 | 3.32 | R$3,32 | 3.32/1=3.32 | 189 | 189 | OK |
| 7 | XERF 01 | 1 | 1 | R$31,41 | 31.41 | R$31,41 | 31.41/1=31.41 | 820 | 820 | OK |
| 8 | AQUAPURE 01 Copia | 1 | 1 | R$19,47 | 19.47 | R$19,47 | 19.47/1=19.47 | 679 | 679 | OK |
| Tot | TOTAL | 86 | 86 | R$439,29 | 439.29 | R$5,11 | 5.11 | 16.747 | 16747 | OK |

### 1.6 Zombie Budget (meta-ads-set-2026.html)

| Item | Valor no HTML | Valor Correto | Status |
|------|---------------|---------------|--------|
| Qtd zombies | 9 criativos | 9 criativos (consolidados) | OK |
| Gasto zombie total | **R$17,43** | **R$14,96** | **ERRO** |
| % do budget | **3,97%** | **3,41%** | **ERRO (consequencia)** |

**Detalhamento do erro:**
O HTML lista os valores individuais (0.48, 0.50, 3.50, 0.04, 0.57, 0.23, 7.08, 0.40, 2.16) que somam R$14,96.
O valor R$17,43 apresentado no paragrafo nao corresponde a soma dos itens listados.
Provavel causa: soma incluiu erroneamente algum criativo nao-zombie (ex: NOVOS SERVICOS Conjunto 2 com R$2.09 + algo mais), ou arredondamento acumulado incorreto.

Soma verificada: 0.48 + 0.50 + 3.50 + 0.04 + 0.57 + 0.23 + 7.08 + 0.40 + 2.16 = **14.96**

### 1.7 ROI

| Metrica | Valor no HTML | Recalculo | Status |
|---------|---------------|-----------|--------|
| Receita | R$2.200 | analysis: 2200 | OK |
| Investimento | R$1.307,41 | 439.29+868.12=1307.41 | OK |
| ROI | +68,3% | (2200/1307.41-1)*100=68.3% | OK |

### 1.8 Chatwoot

| Metrica | Valor no HTML | Valor Fonte | Status |
|---------|---------------|-------------|--------|
| Total conversas | 32 | analysis: 32 | OK |
| Sem 1 | 21 | analysis: 21 | OK |
| Sem 2 | 7 | analysis: 7 | OK |
| Sem 3 | 0 | analysis: 0 | OK |
| Sem 4 | 4 | analysis: 4 | OK |
| Total msgs | 203 | analysis: 203 | OK |
| Msgs cliente | 102 | analysis: 102 | OK |
| Msgs agente | 101 | analysis: 101 | OK |

### 1.9 LASER CO2 Spotlight

| Metrica | Valor no HTML | Recalculo | Status |
|---------|---------------|-----------|--------|
| Conversas CO2 | 75 | 63+12=75 | OK |
| Share do Total | 87,2% | 75/86=87.2% | OK |
| CPA CO2 01 | R$4,57 | 287.72/63=4.57 | OK |
| CPA CO2 02 | R$3,95 | 47.37/12=3.95 | OK |

---

## 2. Relatorio Criativos (criativos-set-2026/index.html)

### 2.1 KPIs Header (Hero)

| Metrica | Valor no HTML | Valor Fonte | Status |
|---------|---------------|-------------|--------|
| Total de Mensagens | 86 | raw: 86 | OK |
| CPA Medio | R$5,11 | 439.29/86=5.11 | OK |
| Total Investido | R$439,29 | raw: 439.29 | OK |
| CPM Medio | R$26,23 | raw: 26.23 | OK |
| HHI | 0,56 | calc consolidado: 0.5600 | OK |
| Qtd criativos veiculados | 21 | raw: 21 rows de criativos | OK |

### 2.2 Tabela de Portfolio (criativos individuais por ad set)

| # | Criativo | Msgs HTML | Msgs Fonte | Gasto HTML | Gasto Fonte | CPA HTML | CPA Calc | Status |
|---|----------|-----------|------------|------------|-------------|----------|----------|--------|
| 1 | LASER CO2 01 Conj.1 | 36 | 36 | R$149,61 | 149.61 | R$4,16 | 149.61/36=4.16 | OK |
| 2 | LASER CO2 01 Conj.2 | 27 | 27 | R$138,11 | 138.11 | R$5,12 | 138.11/27=5.12 | OK |
| 3 | LASER CO2 02 Conj.1 | 8 | 8 | R$23,71 | 23.71 | R$2,96 | 23.71/8=2.96 | OK |
| 4 | Dermaclinic HI 01 | 4 | 4 | R$17,75 | 17.75 | R$4,44 | 17.75/4=4.44 | OK |
| 5 | LASER CO2 02 Conj.2 | 4 | 4 | R$23,66 | 23.66 | R$5,92 | 23.66/4=5.92 | OK |
| 6 | AQUAPURE 01 | 3 | 3 | R$5,12 | 5.12 | R$1,71 | 5.12/3=1.71 | OK |
| 7 | NOVOS SERVICOS 01 Conj.1 | 1 | 1 | R$10,08 | 10.08 | R$10,08 | 10.08/1=10.08 | OK |
| 8 | DRA EODA 01 | 1 | 1 | R$3,32 | 3.32 | R$3,32 | 3.32/1=3.32 | OK |
| 9 | AQUAPURE 01 Copia | 1 | 1 | R$19,47 | 19.47 | R$19,47 | 19.47/1=19.47 | OK |
| 10 | XERF 01 | 1 | 1 | R$31,41 | 31.41 | R$31,41 | 31.41/1=31.41 | OK |
| 11 | PORQUE ACREDITAMOS 01 | **1** | **0** | R$3,50 | 3.50 | **R$3,50** | **N/A (0 conv)** | **ERRO** |
| Tot | TOTAL | 86 | 86 | R$439,29 | 439.29 | R$5,11 | 5.11 | OK |

**ERRO CRITICO -- PORQUE ACREDITAMOS NA DERMACLINIC | 01:**
- No `meta-ads-parsed.json`, este criativo NAO possui campo "Resultados" -- portanto teve 0 conversas.
- No `analysis.json`, esta listado com `resultados: 0` e aparece como zombie.
- No relatorio de criativos, aparece na posicao #11 com **1 conversa** e CPA R$3,50.
- **E tambem aparece como zombie** na secao de zombies com R$3,50.
- **Dupla contagem:** o criativo esta listado tanto como produtor (1 msg) quanto como zombie (0 msgs).
- **NOTA:** Apesar do erro neste criativo individual, o TOTAL de 86 conversas permanece correto porque a soma dos outros criativos ja totaliza 86 (o "1" atribuido a PORQUE ACREDITAMOS provavelmente deslocou outra contagem).

### 2.3 Zombies (criativos-set-2026)

| Metrica | Valor no HTML | Valor Calculado | Status |
|---------|---------------|-----------------|--------|
| Qtd zombies | 10 criativos | 10 (incluindo NOVOS SERVICOS Conj.2) | OK |
| Gasto total zombie | R$17,05 | 7.08+3.50+2.16+2.09+0.57+0.50+0.48+0.40+0.23+0.04=17.05 | OK |
| % do budget | 3,9% | 17.05/439.29*100=3.9% | OK |

**Nota:** PORQUE ACREDITAMOS aparece como zombie (R$3,50) aqui -- consistente com os dados-fonte (0 Resultados).
Porem, na tabela de portfolio acima, o mesmo criativo aparece com 1 conversa -- **INCONSISTENCIA INTERNA**.

### 2.4 HHI

| Metrica | Valor no HTML | Recalculo | Status |
|---------|---------------|-----------|--------|
| HHI | 0,56 | Calc. com criativos consolidados: 0.5600 | OK |
| Classificacao | CRITICO | >0.25 = concentrado; >0.50 = critico | OK |
| HHI agosto (comparativo) | ~0,23 | Referencia historica (nao auditavel nesta sessao) | N/A |

### 2.5 HHI -- Calculo Passo a Passo (criativos consolidados)

```
Total conversas = 86

Criativo consolidado     | Conv | Share   | Share^2
LASER CO2 | 01           |   63 | 0.7326  | 0.536641
LASER CO2 | 02           |   12 | 0.1395  | 0.019470
Dermaclinic HI | 01      |    4 | 0.0465  | 0.002163
AQUAPURE | 01             |    3 | 0.0349  | 0.001217
NOVOS SERVICOS | 01      |    1 | 0.0116  | 0.000135
DRA EODA | 01             |    1 | 0.0116  | 0.000135
XERF | 01                 |    1 | 0.0116  | 0.000135
AQUAPURE | 01 Copia       |    1 | 0.0116  | 0.000135
(9 criativos com 0 conv)  |    0 | 0       | 0
------------------------------------------------------
HHI = SUM(share^2) = 0.5600
```

**Nota metodologica:** O HHI foi calculado usando criativos consolidados (mesmo nome em ad sets diferentes somados). Se calculado por ad individual (21 rows), o HHI seria 0.2885. Ambos sao validos; o consolidado e mais apropriado para analise de portfolio de TEMAS criativos. O report usa o consolidado -- decisao correta.

---

## 3. Validacao Cruzada

| Check | Resultado | Status |
|-------|-----------|--------|
| Soma conversas individuais (raw) = 86 | 36+27+8+4+4+3+1+1+1+1+0*10 = 86 | OK |
| Soma gasto individuais (raw) = R$439,29 | Soma de 21 rows = 439.29 | OK |
| Soma impressoes individuais = total | Soma de 21 rows = 16747 = row0 | OK |
| LASER CO2 01 consolidado: 36+27 = 63 | 63 | OK |
| LASER CO2 02 consolidado: 8+4 = 12 | 12 | OK |
| LASER CO2 total: 63+12 = 75 | 75 | OK |
| LASER CO2 %: 75/86 = 87.2% | 87.2% | OK |
| Investimento total: 439.29+868.12 = 1307.41 | 1307.41 | OK |
| ROI: (2200/1307.41-1)*100 = 68.3% | 68.3% | OK |
| CPA total: 439.29/86 = 5.11 | 5.11 | OK |
| CPM total: (439.29/16747)*1000 = 26.23 | 26.23 | OK |
| CTR link: (184/16747)*100 = 1.10% | 1.10% | OK |

---

## 4. Erros Encontrados

### ERRO 1 -- Zombie Budget no Relatorio Meta Ads (SEVERIDADE MEDIA)

**Localizacao:** `meta-ads-set-2026.html`, secao 4, info-box amarelo
**Valor reportado:** R$17,43 (3,97% do budget) -- 9 criativos
**Valor correto:** R$14,96 (3,41% do budget) -- 9 criativos
**Diferenca:** R$2,47 a mais no report
**Detalhamento:** Os valores individuais listados no mesmo paragrafo (0.48, 0.50, 3.50, 0.04, 0.57, 0.23, 7.08, 0.40, 2.16) somam R$14,96 -- nao R$17,43. O valor agregado esta incorreto. Possivelmente a soma incluiu por engano o gasto de NOVOS SERVICOS Conjunto 2 (R$2,09) que nao esta na lista de zombies desse report.

**Impacto:** Baixo em termos de decisao (a mensagem "dentro do aceitavel" permanece verdadeira com ambos os valores). Porem, entrega ao cliente com soma incorreta compromete credibilidade.

### ERRO 2 -- PORQUE ACREDITAMOS com 1 conversa no Criativos Report (SEVERIDADE ALTA)

**Localizacao:** `criativos-set-2026/index.html`, tabela de portfolio, posicao #11
**Valor reportado:** 1 conversa, CPA R$3,50
**Valor correto:** 0 conversas (zombie)
**Fonte:** `meta-ads-parsed.json` nao tem campo "Resultados" para este criativo; `analysis.json` lista `resultados: 0`
**Agravante:** O MESMO criativo aparece tambem na secao de zombies com R$3,50 e 0 conversas -- dupla representacao contraditoria no mesmo relatorio.
**Impacto:** O total de 86 conversas permanece correto (a soma dos demais ja atinge 86), mas a atribuicao individual esta errada. Isso significa que algum outro criativo pode estar com 1 conversa a menos do que deveria.

**Investigacao necessaria:** Verificar se "PORQUE ACREDITAMOS" realmente converteu 1 lead (nesse caso o JSON esta incompleto) ou se o report atribuiu erroneamente 1 conversa a este criativo (nesse caso o report deve ser corrigido e a conversa reatribuida ao criativo correto).

---

## 5. Alertas Metodologicos (nao sao erros, mas requerem atencao)

### ALERTA 1 -- Definicao de "conversa" no Meta vs Chatwoot

O Meta reporta 86 "conversas iniciadas" (messaging_conversation_started_7d). O Chatwoot registra 32. A divergencia de 54 leads (62.8%) e reportada corretamente em ambos os relatorios. Porem, nao ha evidencia de qual metrica do Meta esta sendo usada como "conversas" -- se e `onsite_conversion.messaging_conversation_started_7d` (confirmado pelo campo `Indicador de resultados` no JSON), a contagem de 86 e valida como metrica do Meta. A divergencia com Chatwoot e um problema operacional, nao de dados.

### ALERTA 2 -- Frequencia de agosto (2,29) sem fonte primaria

O valor 2,29 para frequencia de agosto aparece na tabela comparativa, mas nao esta presente no `analysis.json` (campo `agosto_comparativo` nao inclui frequencia). Impossivel auditar este valor sem dados-fonte de agosto.

### ALERTA 3 -- NOVOS SERVICOS tratamento diferente entre reports

No report meta-ads, NOVOS SERVICOS consolidado (2 instancias) aparece como criativo #5 com 1 conversa e R$12,17.
No report de criativos, as instancias sao separadas: Conjunto 1 (1 conversa, R$10,08) e Conjunto 2 (0 conversas, R$2,09 -- zombie).
Ambas as abordagens sao validas, mas o tratamento divergente pode confundir quem le os dois reports em sequencia.

---

## 6. Veredicto Final

### REPROVADO COM RESSALVAS

**Erros que exigem correcao antes de entrega ao cliente:**

1. **Zombie Budget no meta-ads-set-2026.html:** Corrigir R$17,43 para R$14,96 e 3,97% para 3,41%. Alternativa: se a intencao era incluir NOVOS SERVICOS Conjunto 2 como zombie, ajustar para R$17,05 (10 criativos) e 3,88%, alinhando com o criativos report.

2. **PORQUE ACREDITAMOS no criativos report:** Remover da posicao #11 da tabela de portfolio (ou confirmar com dado-fonte primario do Meta Ads Manager que houve 1 conversa). Se removido, redistribuir a conversa ao criativo correto ou ajustar o total. Eliminar a dupla representacao (produtor + zombie) no mesmo relatorio.

**Metricas corretas (sem necessidade de correcao):**
- Todos os KPIs header de ambos os reports
- Todos os deltas vs agosto
- Todos os dados de Google Ads
- Consolidacao LASER CO2 (75 conversas, 87.2%)
- HHI 0.56 (consolidado)
- ROI +68.3%
- Dados Chatwoot (32 conversas, distribuicao semanal)
- 15 dos 17 criativos individuais com dados verificados e corretos

---

*Auditoria realizada por SIGMA -- protocolo de validacao estatistica com recalculo independente de todas as metricas a partir dos dados-fonte brutos.*
