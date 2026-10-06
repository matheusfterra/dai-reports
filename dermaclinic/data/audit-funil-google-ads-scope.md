# Auditoria de Escopo Google Ads — Relatorio Trafego Pago Set/2026

**Data da auditoria:** 2026-10-06
**Auditor:** SIGMA (data-scientist)
**Relatorio auditado:** `reports/trafego-pago-set-2026.html`
**Relatorio complementar auditado:** `reports/meta-ads-set-2026.html` (secao #google-ads, linhas 1061-1124)
**Pergunta do usuario:** O relatorio junta as duas contas Google Ads ou separa? Existe secao dedicada ao Dr. Laercio?

---

## 1. Contexto: Duas Contas Google Ads da DermaClinic

A DermaClinic opera DUAS contas Google Ads distintas:

| Conta | Descricao | Ativa desde |
|-------|-----------|-------------|
| **DermaClinic (DC)** | Conta principal da clinica, campanha "Leads / By: Digital AI" (Pesquisa) | Anterior a agosto/2026 |
| **Dr. Laercio** | Conta pessoal do Dr. Laercio para nutrologia/consultas especificas | 10/agosto/2026 |

**Evidencia no relatorio de agosto** (`meta-ads-ago-2026.html`):
- Linha 446: "Google Ads com 64 conversoes a R$8,85 -- Nova conta Dr. Laercio ativa"
- Linha 479: "Meta + Google DC + Laercio (novo)"
- Linhas 1064-1091: Secao dedicada "Dr. Laercio -- Conta Nova (10-30/ago)" com KPIs separados:
  - Investimento: R$219,06
  - Cliques: 116
  - CTR: 4,57%
  - CPC: R$1,89
  - Status: Learning (correspondencia ampla)

---

## 2. Diagnostico: O que aconteceu em Setembro/2026

### 2a. CSV fonte de Google Ads

Arquivo: `data/google-ads-set-2026.csv`

Conteudo COMPLETO:
```
Performance da campanha
1 de setembro de 2026 - 30 de setembro de 2026
Campanha,Estado da campanha,Tipo de campanha,Cliques,Impr.,CTR,...
Leads / By: Digital AI,Ativada,Pesquisa,560,14.023,3,99%,...
```

**O CSV contem APENAS 1 campanha ("Leads / By: Digital AI") de 1 unica conta.**

Nao ha nenhuma linha referente a conta do Dr. Laercio.

### 2b. Relatorio `trafego-pago-set-2026.html`

| Elemento | O que mostra | Menciona Dr. Laercio separado? |
|----------|-------------|-------------------------------|
| KPI "Google Ads (66,4%)" | R$868,12 | NAO |
| KPI "Conversoes Google" | 67 | NAO |
| Metodologia (linha 405) | "Google Ads R$868,12" | NAO |
| Caso "Comercial" (linha 251) | Lead pediu "Dr. Laercio" | SIM, mas como lead, nao como conta |
| Tabela resumo (linha 315) | "Solicitou agendamento com Dr. Laercio" | SIM, mas como lead, nao como conta |

**Conclusao:** Este relatorio apresenta Google Ads como um bloco unico (R$868,12 / 67 conversoes). NAO separa contas.

### 2c. Relatorio `meta-ads-set-2026.html` (secao Google Ads)

| Elemento | O que mostra |
|----------|-------------|
| Secao #google-ads (linhas 1061-1124) | "DermaClinic -- dados Google Ads Manager 01-30/set" |
| KPIs | 67 conversoes, R$868,12, CTR 3,99%, CPC R$1,55 |
| Insight box | "Google Ads em alta consistente" -- nenhuma mencao a Dr. Laercio |

**Nenhuma mencao a Dr. Laercio em TODO o relatorio `meta-ads-set-2026.html`** (zero matches para regex `la[eé]rcio`).

---

## 3. Veredicto

### Os dados estao MISTURADOS ou sao de apenas UMA conta?

**Resposta: OS DADOS SAO DE APENAS UMA CONTA (DermaClinic).**

O CSV fonte contem exclusivamente a campanha "Leads / By: Digital AI" — que e da conta DermaClinic (DC). Os R$868,12 e as 67 conversoes sao 100% da conta DC.

**A conta do Dr. Laercio NAO aparece em nenhum dado de setembro.**

Existem duas possibilidades:
1. A conta do Dr. Laercio foi PAUSADA em setembro (nao investiu nada)
2. Os dados da conta do Dr. Laercio nao foram EXPORTADOS/FORNECIDOS para o relatorio

Em agosto, o investimento total Google Ads era R$785,18 (DC R$566,12 + Laercio R$219,06). Em setembro, o investimento Google Ads e R$868,12, que e MAIS do que os R$566,12 que DC investia sozinha em agosto -- o que sugere que o orcamento foi redistribuido para apenas 1 conta, OU que o CSV simplesmente omitiu a conta Laercio.

### Existe secao dedicada ao Dr. Laercio?

**NAO.** Nenhum dos dois relatorios de setembro (trafego-pago ou meta-ads) tem uma secao dedicada ao Dr. Laercio.

Para comparacao:
- **Agosto**: secao dedicada "Dr. Laercio -- Conta Nova (10-30/ago)" com 4 KPI cards e insight box
- **Setembro**: ZERO mencoes, ZERO dados

---

## 4. Gaps Identificados

| # | Gap | Severidade | Impacto |
|---|-----|-----------|---------|
| G1 | Dados da conta Google Ads do Dr. Laercio AUSENTES do CSV e do relatorio | **CRITICA** | Se a conta investiu em setembro, os numeros estao INCOMPLETOS. Se nao investiu, deveria haver uma nota ("Conta Dr. Laercio pausada em setembro"). |
| G2 | Nao existe secao dedicada ao Dr. Laercio | **ALTA** | Em agosto havia secao propria. Em setembro, sumiu sem explicacao. |
| G3 | Comparativo vs agosto usa "~R$785" como base | **MEDIA** | A base de agosto era R$566,12 (DC) + R$219,06 (Laercio) = R$785,18. Se setembro so tem DC, o comparativo e de contas diferentes (DC+Laercio vs so DC). |
| G4 | Lead "Comercial" pediu Dr. Laercio no Chatwoot | **INFORMATIVA** | O lead chegou pelo trafego pago buscando Dr. Laercio, mas nao ha dados de campanha do Dr. Laercio. Pode indicar que a campanha Laercio gerou o lead mas os dados nao foram reportados. |

---

## 5. Recomendacoes

### 5a. Acoes imediatas

1. **Verificar com o gestor de trafego**: A conta Google Ads do Dr. Laercio investiu em setembro? Se sim, solicitar o CSV de performance e incluir no relatorio.
2. **Se investiu**: Criar secao dedicada "Dr. Laercio -- Setembro 2026" com KPIs separados (mesmo formato de agosto).
3. **Se NAO investiu**: Adicionar nota explicativa no relatorio: "Conta Google Ads Dr. Laercio pausada em setembro. Investimento zerado."

### 5b. Correcoes no relatorio

| Cenario | O que corrigir |
|---------|---------------|
| Laercio investiu e dados faltam | Incluir dados + secao separada + recalcular investimento total |
| Laercio NAO investiu | Adicionar nota na secao Google Ads + ajustar comparativo (agosto DC-only: R$566,12 vs setembro DC: R$868,12 = +53,3%) |
| Dados ja estao consolidados no CSV | Improvavel (CSV so tem 1 campanha "Leads / By: Digital AI"), mas verificar |

### 5c. Padrao para proximos meses

Para evitar recorrencia, o relatorio mensal deve SEMPRE:
1. Listar EXPLICITAMENTE quais contas Google Ads estao no escopo
2. Ter secao separada por conta (DermaClinic / Dr. Laercio)
3. Indicar quando uma conta esta pausada/sem investimento
4. Usar comparativo consistente (mesma base de contas)

---

## 6. Resumo Executivo

| Pergunta | Resposta |
|----------|---------|
| Quantas contas Google Ads aparecem no relatorio? | **1 (apenas DermaClinic)** |
| Os dados estao misturados? | **NAO** -- sao de 1 conta so |
| Existe secao dedicada ao Dr. Laercio? | **NAO** |
| A conta Dr. Laercio deveria estar no relatorio? | **SIM, se investiu em setembro. Se nao investiu, deveria ter nota explicativa.** |
| Comparativo vs agosto e confiavel? | **QUESTIONAVEL** -- agosto incluia Laercio (R$785,18 total), setembro so tem DC (R$868,12). Bases diferentes. |

---

**Proximo passo sugerido:** Confirmar com o gestor de trafego se houve investimento na conta Dr. Laercio em setembro, e solicitar os dados para complementar o relatorio.
