# Auditoria Google Ads Set/2026 — SIGMA

**Data da auditoria:** 2026-10-02
**Fonte CSV:** `google-ads-set-2026.csv` (1 campanha: "Leads / By: Digital AI", Pesquisa, Ativada)
**Relatorio:** `meta-ads-set-2026.html`, secao `#google-ads` (linhas 1061-1119)

---

## Metricas vs CSV Fonte

| Metrica | CSV | Relatorio | Match |
|---------|-----|-----------|-------|
| Conversoes | 67,00 | 67 | OK |
| Investimento (Custo) | 868,12 | R$868,12 | OK |
| Custo/Conversao | 12,96 | R$12,96 | OK |
| Cliques | 560 | 560 | OK |
| CTR | 3,99% | 3,99% | OK |
| Impressoes | 14.023 | 14.023 | OK |
| Taxa de Conversao | 11,96% | 11,96% | OK |
| CPC Medio | 1,55 | R$1,55 | OK |

**Resultado: 8/8 metricas coincidem com o CSV.**

---

## Variacoes % vs Agosto

| Metrica | Valor Set | Base Ago | Var. Declarada | Var. Calculada | Match |
|---------|-----------|----------|----------------|----------------|-------|
| Conversoes | 67 | 64 | +4,7% | +4,69% | OK (arred.) |
| Investimento | R$868,12 | ~R$785 | +10,6% | +10,59% | OK (arred.) |
| Cliques | 560 | 420 | +33,3% | +33,33% | OK |
| Impressoes | 14.023 | 9.210 | +52,3% | +52,26% | OK (arred.) |
| CPC Medio | R$1,55 | R$8,85 | -82,5% | -82,49% | OK (arred.) |

**Resultado: 5/5 variacoes matematicamente corretas (arredondamentos < 0,1pp).**

**Nota sobre a base de Investimento:** o relatorio usa "~R$785" (aproximado). Se o valor real de agosto
for ligeiramente diferente (ex: R$784,50 ou R$785,30), a variacao declarada de +10,6% permanece
consistente dentro da margem do "~". Nao ha CSV de agosto para cruzamento exato.

---

## Consistencia Interna

| Calculo | Formula | Esperado | Encontrado | Match |
|---------|---------|----------|------------|-------|
| CPA | Custo / Conversoes | 868,12 / 67 = 12,957 | R$12,96 | OK (arred. 2 casas) |
| CTR | Cliques / Impressoes * 100 | 560 / 14.023 * 100 = 3,994% | 3,99% | OK (arred.) |
| Taxa Conv. | Conversoes / Cliques * 100 | 67 / 560 * 100 = 11,964% | 11,96% | OK (arred.) |
| CPC | Custo / Cliques | 868,12 / 560 = 1,5502 | R$1,55 | OK (arred.) |

**Resultado: 4/4 formulas internamente consistentes.**

Caption do Custo/Conversao ("67 conv / R$868,12") — correto.
Caption da Taxa Conv. ("67 conv / 560 cliques") — correto.

---

## Dados Faltantes no Relatorio

| Campo CSV | Valor | Presente no Relatorio | Criticidade |
|-----------|-------|----------------------|-------------|
| % de impr. (parte sup.) | 65,91% | NAO | MEDIA — metrica relevante para diagnostico de Google Ads (indica posicionamento no topo da SERP). Considerar incluir. |
| Estado da campanha | Ativada | NAO (implicito) | BAIXA — informativo |
| Tipo de campanha | Pesquisa | NAO | BAIXA — poderia ser mencionado para contexto (ja esta no subtitulo como "Google Ads") |
| Codigo da moeda | BRL | NAO (implicito via R$) | NENHUMA |

---

## Observacoes Adicionais

1. **Classe CSS do Investimento:** o card de Investimento usa `kpi-delta down` com seta para cima
   (&#9650; +10,6%). A seta aponta corretamente para cima (aumento), mas a classe `down` pode
   renderizar a cor de queda (vermelho). Isso e semanticamente correto — investimento subindo e
   um sinal de atencao (custo maior), nao necessariamente positivo. Validar se a intencao visual
   esta correta.

2. **Texto de analise (info-box):** menciona "66,4% do investimento total" — este percentual NAO
   e derivavel apenas do CSV de Google Ads. Requer dado de Meta Ads para validacao cruzada
   (investimento total = Google + Meta). Nao auditavel neste escopo.

3. **CPC historico (R$8,85):** o relatorio compara CPC com "hist." (historico), nao com agosto
   especificamente. A base de R$8,85 nao e verificavel com os dados fornecidos — pode ser media
   historica de meses anteriores. Flag informativo, nao erro.

---

## Veredicto: APROVADO

Todas as 8 metricas coincidem com o CSV fonte. Todas as 5 variacoes percentuais estao
matematicamente corretas. Todas as 4 formulas internas sao consistentes. Unico dado
omitido com relevancia media e o "% de impressoes na parte superior" (65,91%) — recomendado
incluir em futuras versoes do relatorio, mas nao constitui erro factual.
