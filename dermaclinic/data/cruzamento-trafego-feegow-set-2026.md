# Cruzamento Trafego Pago x Feegow — Setembro 2026

**Cliente:** DermaClinic
**Gerado em:** 29/09/2026
**Fonte:** Chatwoot (inbox 56 — Trafego Pago) x Feegow (PostgreSQL dermaclinic)
**Metodo:** Match por ultimos 8 digitos do telefone + match exato sem codigo de pais

---

## Resumo Executivo

| Metrica | Valor |
|---------|-------|
| Leads inbox 56 em setembro | **32** |
| Encontrados no Feegow | **3** (9,4%) |
| Com agendamento set+out | **0** dos 32 leads de setembro |
| Taxa conversao direta (lead set → agendamento) | **0,0%** |
| Pacientes historicos trafego com agendamento set+out | **3 pacientes** / **6 agendamentos** |
| Receita confirmada (via trafego historico) | **R$ 2.200,00** |

---

## Etapa 1 — Leads do Inbox 56 (Trafego Pago)

**32 leads unicos** tiveram mensagens no inbox "Trafego Pago" durante setembro/2026.

### Distribuicao temporal
- Semana 1 (01-07/set): 18 leads (56%)
- Semana 2 (08-14/set): 6 leads (19%)
- Semana 3 (15-21/set): 0 leads
- Semana 4 (22-30/set): 8 leads (25%)

### Engajamento
- Media de mensagens por lead: **6,2 msgs**
- Leads com 2 msgs (apenas 1 troca): **12** (37,5%) — baixo engajamento
- Leads com 10+ msgs (alta interacao): **6** (18,8%)

---

## Etapa 2 — Cruzamento Chatwoot → Feegow

Dos 32 leads de setembro, **apenas 3 foram encontrados no Feegow** (9,4%):

| Lead (Chatwoot) | Paciente (Feegow) | Match | Agendamentos set+out |
|-----------------|-------------------|-------|---------------------|
| Milena Henrique Andre | MARIA GORETI PETRY | Last 8 digits | Nenhum |
| Neuza Lorenco | Marta das Gracas Pikisius | Exato | Nenhum |
| Rozani Grein | ROSANI GREIN | Last 8 digits | Nenhum |

**Classificacao dos 32 leads:**

| Classificacao | Quantidade | % |
|---------------|------------|---|
| NAO_ENCONTRADO | 29 | 90,6% |
| PACIENTE_SEM_AGENDAMENTO | 3 | 9,4% |
| CONVERTIDO (agendou+atendido) | 0 | 0,0% |
| AGENDADO (marcado) | 0 | 0,0% |

**Conclusao Etapa 2:** Nenhum dos leads de setembro/2026 do trafego pago converteu diretamente em agendamento. Os 3 pacientes encontrados ja existiam no Feegow mas nao reagendaram.

---

## Etapa 3 — Cruzamento Reverso: Feegow → Chatwoot

Verificamos todos os **585 agendamentos de set+out/2026** (excluindo cancelados) e cruzamos com TODAS as conversas do inbox 56 (historico completo, nao apenas setembro).

### Resultado

> Fototerapia (profissional_id=4) excluida — nao gera receita dermatologica.

| Origem | Setembro | Outubro | Total |
|--------|----------|---------|-------|
| Via Trafego Pago | 4 (0,8%) | 2 (2,2%) | **6 (1,0%)** |
| Outra Origem | 491 (99,2%) | 88 (97,8%) | **579 (99,0%)** |
| **Total** | **495** | **90** | **585** |

### 3 Pacientes Originados do Trafego Pago

#### 1. CLEDIR APARECIDA FORMULO DOS SANTOS (patient_id: 9704)
- **Chatwoot:** Conversa #16622, contato "Cledir"
- **Agendamentos:**
  - 03/set — Atendido — Profissional 3 — **R$ 1.200,00** (Cartao Credito)
  - 01/out — Marcado (nao confirmado) — Profissional 3
- **Receita confirmada:** R$ 1.200,00

#### 2. ELIZABETH KLEMTZ (patient_id: 14112)
- **Chatwoot:** Conversa #17745, contato "silent-tree-786"
- **Agendamentos:**
  - 08/set — Atendido — Profissional 3 — **R$ 1.000,00** (PIX)
  - 23/set — Atendido — Profissional 3 — R$ 0,00 (retorno)
  - 13/out — Marcado (nao confirmado) — Profissional 3
- **Receita confirmada:** R$ 1.000,00

#### 3. Francine Menezes (patient_id: 50319)
- **Chatwoot:** Conversa #16502, contato "Maninha"
- **Agendamentos:**
  - 29/set — Marcado (nao confirmado) — Profissional 3 — R$ 400,00
  - 30/set — Marcado (nao confirmado) — Profissional 1 — R$ 4,00
- **Receita confirmada:** R$ 0,00 (ainda nao atendida)
- **Receita potencial:** R$ 404,00

---

## Metricas Financeiras

| Metrica | Valor |
|---------|-------|
| Receita confirmada (atendidos via trafego) | **R$ 2.200,00** |
| Receita potencial (agendados nao atendidos) | **R$ 404,00** |
| Receita total potencial | **R$ 2.604,00** |
| Investimento estimado Meta Ads set/2026 | ~R$ 900,00 (estimativa) |
| **ROI estimado (receita confirmada / investimento)** | **~2,4x** |

> **Nota:** Receita calculada via `feegow_financial_records` (regime de caixa), excluindo `executante_id = 4` (fototerapia) e registros cancelados. Investimento Meta Ads e estimativa baseada na media historica — valor exato depende do export do Meta Ads Manager.

---

## Gargalos Identificados

### 1. Baixa taxa de cadastro no Feegow (90,6% nao encontrados)
- **Problema:** A maioria dos leads do trafego pago nao chega a ser cadastrada no Feegow
- **Hipoteses:**
  - Leads nao qualificados (curiosos, fora da regiao)
  - Processo de agendamento nao captura o telefone do WhatsApp no Feegow
  - Leads usam telefone diferente ao agendar presencialmente
- **Acao sugerida:** Verificar manualmente os 10 leads com maior engajamento (10+ msgs) se agendaram por outro canal

### 2. Conversao historica vs direta
- **Insight:** Os 4 pacientes que converteram vieram de conversas de MESES ANTERIORES (conv #16502, #16622, #17600, #17745), nao de setembro
- **Implicacao:** O ciclo de conversao do trafego pago e mais longo do que 1 mes — o lead interage em um mes e agenda em outro
- **Acao sugerida:** Ampliar a janela de analise para 3 meses de conversas (jul+ago+set)

### 3. Receita concentrada
- **2 pacientes (Cledir e Elizabeth)** respondem por 100% da receita confirmada (R$ 2.200)
- Francine tem R$ 404 potencial (agendada, nao atendida ainda)

### 4. Leads de baixo engajamento
- **37,5% dos leads** tiveram apenas 2 mensagens (1 do lead + 1 resposta automatica)
- Indica que a mensagem inicial do anuncio nao esta gerando interesse suficiente para manter a conversa

---

## Proximos Passos Recomendados

1. **Verificacao manual:** Conferir os 6 leads com 10+ mensagens (Ivanilda, Mime, Ilana, Rosaneteiranete, Rosa Maria, sou feliz) se agendaram por outro canal/telefone
2. **Ampliar janela:** Repetir o cruzamento com conversas de jul+ago+set para capturar o ciclo longo de conversao
3. **Melhorar rastreabilidade:** Implementar campo "origem" no agendamento Feegow vinculado ao canal Chatwoot
4. **Otimizar criativos:** 37,5% de leads com 2 msgs sugere que a mensagem inicial precisa de CTA mais forte
5. **Workflow recorrente:** Se o formato funcionar, transformar em workflow n8n mensal automatizado

---

## Metodologia

### Normalizacao de telefones
1. Remover caracteres nao-numericos de ambos os lados
2. Remover prefixo `+55` do Chatwoot
3. Match primario: telefone completo (10-11 digitos)
4. Match secundario: ultimos 8 digitos (captura Feegow com telefones sem DDD)

### Fontes de dados
- **Chatwoot:** Tabela `conversation_sessions` filtrada por `inbox_id = 56`
- **Feegow pacientes:** Tabela `feegow_patients`, campo `celular_principal`
- **Feegow agendamentos:** Tabela `feegow_appointments`, filtro `status_id NOT IN (11, 15, 22)`
- **Receita:** Tabela `feegow_financial_records`, filtro `is_cancelado = false`

### Status Feegow (referencia)
| ID | Nome | Semantica |
|----|------|-----------|
| 1 | Marcado - nao confirmado | Agendado |
| 3 | Atendido | Consulta realizada |
| 6 | Nao compareceu | No-show |
| 7 | Marcado - confirmado | Confirmado |

---

*Relatorio gerado pela Digital AI — Pipeline de Cruzamento Trafego Pago x Feegow*
*Fonte: Feegow (PostgreSQL) + Chatwoot (PostgreSQL) | Regime de caixa*
