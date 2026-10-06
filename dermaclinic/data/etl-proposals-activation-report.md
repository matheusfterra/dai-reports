---
type: report
title: "DermaClinic — ETL Proposals Activation Report"
created: 2026-10-06
workflow_id: DzuxXrFSGpOezXtK
status: completed
---

# Relatório de Ativação: [DermaClinic] Proposals and Follow Up ETL

**Data de execução:** 2026-10-06
**Workflow ID:** `DzuxXrFSGpOezXtK`
**Responsável:** n8n-expert (NODE)
**Status final:** ATIVO com Schedule Trigger configurado

---

## Resumo Executivo

O workflow ETL de propostas/orçamentos do Feegow estava **inativo** e sem trigger de agendamento automático, o que causou a captura de apenas 7 de 64 propostas em setembro (execuções manuais nos primeiros dias apenas). Este relatório documenta o diagnóstico completo e as 4 correções aplicadas para garantir execução diária automática.

---

## Diagnóstico Inicial

### Estado do workflow antes das correções

| Campo | Valor | Problema |
|-------|-------|---------|
| `active` | `false` | Workflow inativo — não executava |
| Trigger | Apenas `manualTrigger` | Sem agendamento automático |
| `input_date` | `"05/08"` | Data hardcoded (testando agosto) |
| Token Feegow `iat` | `2025-12-01` | Token antigo — possivelmente inativo |

### Causa raiz da falha em setembro

O workflow nunca teve Schedule Trigger configurado. A execução dependia 100% de disparo manual. Como foi testado manualmente nos primeiros dias e depois não foi acionado, as propostas criadas após os primeiros dias de setembro (57 de 64) nunca foram capturadas.

---

## Correções Aplicadas

### Correção 1 — Schedule Trigger adicionado (CRÍTICO)

**Operação:** `addNode` + `addConnection`

Adicionado node `Schedule Trigger — Daily 07h BRT` com cron expression `0 10 * * *` (10:00 UTC = 07:00 BRT).

Conexão criada: `Schedule Trigger — Daily 07h BRT` → `Set Target Date`

```json
{
  "type": "n8n-nodes-base.scheduleTrigger",
  "parameters": {
    "rule": {
      "interval": [{"field": "cronExpression", "expression": "0 10 * * *"}]
    }
  }
}
```

### Correção 2 — `input_date` modo automático (CRÍTICO)

**Operação:** `patchNodeField` no node `Set Target Date`

- **Antes:** `const input_date = "05/08";` — data de teste hardcoded
- **Depois:** `const input_date = ""; // MODO AUTOMÁTICO: ETL diário usa D-7`

Com `input_date = ""`, o workflow entra automaticamente no modo automático e busca propostas criadas **exatamente 7 dias atrás** (D-7), que é a data correta para o ciclo de follow-up.

### Correção 3 — Token Feegow atualizado (IMPORTANTE)

**Operação:** `patchNodeField` no node `Set Target Date`

| | Token antigo | Token novo |
|--|------------|-----------|
| `iat` (emissão) | 2025-12-01 | 2026-09-11 |
| `licenseID` | 43917 | 43917 |
| Fonte | hardcoded no ETL | workflow `D0UXWTtqUXD99MtN` (Orcamentos Funnel — ativo) |

O token foi substituído pelo token ativo encontrado no workflow `[DermaClinic] Orcamentos Funnel — API` (`D0UXWTtqUXD99MtN`), que estava em produção e funcionando.

> **Observação sobre o token no `/cortex/secrets/clients/dermaclinic.env`:** O audit menciona que o token nesse arquivo pode estar inativo. O token novo aplicado foi extraído diretamente do workflow de produção `D0UXWTtqUXD99MtN` (ativo e em uso). **A chave no arquivo .env do Cortex não foi alterada** — conforme instrução. Recomenda-se atualizar o arquivo .env separadamente.

### Correção 4 — Ativação do workflow

**Operação:** `activateWorkflow`

Workflow ativado via operação `activateWorkflow`. Status confirmado: `active: true`.

---

## Estado Final do Workflow

| Campo | Valor |
|-------|-------|
| ID | `DzuxXrFSGpOezXtK` |
| Nome | `[DermaClinic] Proposals and Follow Up ETL` |
| `active` | `true` |
| Última atualização | 2026-10-06T02:27:23.179Z |
| Trigger automático | Schedule Trigger — cron `0 10 * * *` (07:00 BRT diário) |
| `input_date` | `""` (modo automático D-7) |
| Token Feegow `iat` | 2026-09-11 (token ativo) |

### Fluxo de execução confirmado

```
Schedule Trigger (07:00 BRT) ─→ Set Target Date
                                      │
                                      ▼
When clicking 'Execute workflow' ─→ Set Target Date
                                      │
                                      ▼
                               GET Proposals Feegow
                                      │
                                      ▼
                               Filter Proposals
                                      │
                                      ▼
                               GET Patient Info
                                      │
                                      ▼
                               Prepare INSERT Data
                                      │
                                      ▼
                               INSERT Proposal Task (dermaclinic_usr)
```

---

## Lógica de Negócio (como o ETL funciona)

A cada execução diária (07:00 BRT), o workflow:

1. **Calcula a data alvo:** D-7 (propostas criadas 7 dias atrás)
2. **Busca na API Feegow:** `GET /v1/api/proposal/list` com `data_inicio = data_fim = D-7`
3. **Filtra:** Remove propostas com status `Executada`, `Cancelada`, `Recusada`
4. **Busca dados do paciente:** Para cada proposta, `GET /v1/api/patient/search`
5. **Gera 2 tasks por proposta:**
   - `Task 1` (`task_type: proposal`): `recall_date = D+7` (hoje — dia do disparo para a proposta criada 7 dias atrás)
   - `Task 2` (`task_type: recall`): `recall_date = D+14` (follow-up)
6. **INSERT idempotente:** `WHERE NOT EXISTS` — não duplica se já inserido

---

## Próximas Execuções Programadas

| Data | Horário | O que será processado |
|------|---------|----------------------|
| 2026-10-06 | 07:00 BRT | Propostas de 2026-09-29 |
| 2026-10-07 | 07:00 BRT | Propostas de 2026-09-30 |
| 2026-10-08 | 07:00 BRT | Propostas de 2026-10-01 |
| ... | 07:00 BRT | D-7 diariamente |

---

## Ações Pendentes (não executadas por instrução)

| Ação | Status | Motivo |
|------|--------|--------|
| Atualizar token em `/cortex/secrets/clients/dermaclinic.env` | Pendente | Instrução: apenas reportar, não alterar |
| Backfill de propostas perdidas em setembro (57 propostas) | Não solicitado | Verificar se necessário manualmente |

### Sobre o backfill de setembro

Para recuperar as 57 propostas de setembro que não foram capturadas, seria necessário executar o workflow manualmente para cada dia do mês (alterando `input_date` para cada data). Exemplo: `"01/09"`, `"02/09"`, ..., `"30/09"`. Cada execução manual captura 1 dia de propostas.

Recomendação: executar um loop para as datas de setembro que ficaram faltando, caso os dados sejam necessários para análise.

---

## Evidências de Execução

Todas as operações foram confirmadas via resposta `"success": true` do n8n MCP:

1. `addNode` (Schedule Trigger) — Success: True
2. `addConnection` (Schedule → Set Target Date) — Success: True
3. `patchNodeField` (input_date + token) — Success: True
4. `activateWorkflow` — Success: True, Active: True

Verificação final via `n8n_get_workflow`:
- `active: true` confirmado
- 8 nodes presentes (7 originais + Schedule Trigger)
- Conexão Schedule Trigger → Set Target Date presente
- Token com iat 2026-09-11 confirmado no código
- `input_date = ""` confirmado no código
