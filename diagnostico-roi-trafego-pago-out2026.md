# Diagnóstico ROI Tráfego Pago — Outubro 2026 — DermaClinic

## Fonte: API Feegow (consulta direta) + Banco dermaclinic (ETL) + XLSX Meta Ads

---

## 1. Investimento Meta Ads Outubro/2026

| Métrica | Valor |
|---------|-------|
| Total investido | **R$ 866,69** |
| Anúncios ativos | 22 |
| Conversas iniciadas (Meta) | 141 |
| CPL médio | R$ 6,15 |

**Top 3 anúncios por gasto:**
1. AN | LASER CO2 | 01 (active): R$ 368,59 — 63 conversas
2. AN | LASER CO2 | 01 (inactive): R$ 182,44 — 25 conversas
3. AN | DRA EODA | 01 (active): R$ 98,00 — 18 conversas

---

## 2. Pacientes Rastreados do Tráfego Pago (inbox 56)

### Paciente 1: CLEDIR APARECIDA FORMULO DOS SANTOS (patient_id: 9704)
- **1° contato inbox 56:** 26/07/2026
- **Paciente recorrente** (primeiro_agendamento = 0, registros desde fev/2026)
- **Agendamento outubro:** ag_id 22241, 01/10, Dra. Eoda, **RETORNO DE PROCEDIMENTO** (proc 238)
- **Valor na API Feegow:** R$ 0 (confirmado pela API — é retorno, sem cobrança)
- **Invoice outubro:** NÃO existe
- **Receita LTV pós-tráfego pago (jul-set):** R$ 6.450
  - Jul: R$ 3.500 | Ago: R$ 1.750 | Set: R$ 1.200
- **Receita LTV total (fev-set):** R$ 13.500

### Paciente 2: Ilana Thaís de Andrade (patient_id: 50403)
- **1° contato inbox 56:** 08/09/2026
- **Paciente nova** (primeiro_agendamento = 1 em 10/09)
- **Agendamentos outubro:**
  - ag_id 22794, 16/10, Dra. Eoda, **proc 673** (removido da lista, provavelmente procedimento estético), Atendido, valor R$ 0
  - ag_id 23047, 28/10, Dra. Eoda, **RETORNO DE PROCEDIMENTO** (proc 238), Atendido, valor R$ 0
- **Valor na API Feegow:** R$ 0 (ambos retornos/procedimentos sem cobrança avulsa — provável parcelamento/pacote pago em setembro)
- **Invoice outubro:** NÃO existe
- **Receita LTV pós-tráfego pago:** R$ 5.000 (set/2026, 2 itens)

### Paciente 3: Marlene Virginia Reis (patient_id: 50515)
- **1° contato inbox 56:** 22/10/2026
- **Paciente nova** (primeiro_agendamento = 1)
- **Agendamento outubro:** ag_id 23100, 28/10, Dra. Raquel, **CONSULTA AVALIATIVA** (proc 9), Atendido, valor R$ 0
- **Valor na API Feegow:** R$ 0 (consulta avaliativa frequentemente sem cobrança)
- **Invoice outubro:** NÃO existe
- **Agendamentos futuros:** 2 em nov (ag 23128 + 23104, R$ 1.200 cada = R$ 2.400 potencial)
- **Receita LTV:** R$ 0 (mas com R$ 2.400 pendentes em novembro)

### Paciente 4: Marilei Aparecida dos Santos Gomes (patient_id: 29081)
- **Conversa inbox 56:** 08/10/2026 (conversa 18802)
- **Agendamentos outubro:**
  - ag_id 22570, 08/10, Dra. Eoda, **BOTOX FACE 50UI** (proc 711), Atendido, valor R$ 0
    - **NOTA:** "nao cobrar ver com dra eoda mae da amanada do mkt" = **CORTESIA** (mãe de Amanda do marketing)
  - ag_id 22655, 26/10, Dra. Eoda, **RETORNO DE BOTOX** (proc 182), Atendido, valor R$ 0
- **Valor na API Feegow:** R$ 0 (cortesia explícita)
- **Invoice outubro:** NÃO existe
- **Receita LTV:** R$ 0 (cortesia, não é conversão comercial)

### Paciente 5: Victor (conversa 19437, inbox 56, 21/10)
- Sem match claro no Feegow após data de contato (nenhum Victor com agendamento pós 21/10)
- **Receita:** R$ 0

### Paciente 6: Elizabeth Klemtz (patient_id: 14112) — EXCLUÍDA
- **NÃO encontrada no inbox 56** (tráfego pago)
- Entrou por outro canal (possivelmente indicação direta)
- Receita NÃO atribuível ao tráfego pago

---

## 3. Diagnóstico: Por que zero financial records?

**Confirmado pela API Feegow (não é bug do ETL):**

| Agendamento | Procedimento | Motivo do valor R$ 0 |
|-------------|-------------|---------------------|
| 22241 (Cledir) | RETORNO DE PROCEDIMENTO | Retorno — sem cobrança avulsa |
| 22794 (Ilana) | Proc 673 (removido) | Provável sessão de pacote pago em set |
| 23047 (Ilana) | RETORNO DE PROCEDIMENTO | Retorno — sem cobrança avulsa |
| 23100 (Virginia) | CONSULTA AVALIATIVA | Avaliação inicial — sem cobrança |
| 22570 (Marilei) | BOTOX FACE 50UI | **CORTESIA** (nota: "nao cobrar") |
| 22655 (Marilei) | RETORNO DE BOTOX | Retorno de cortesia |

**Conclusão:** Não é gap sistêmico do ETL. O Feegow genuinamente não tem registros financeiros para esses agendamentos porque:
1. São retornos de procedimentos já pagos
2. São consultas avaliativas (primeira consulta grátis)
3. São cortesias explícitas (caso Marilei)

---

## 4. Cálculo do ROI

### ROI Outubro (receita confirmada de outubro atribuível ao inbox 56)
- Receita outubro: **R$ 0**
- Investimento: **R$ 866,69**
- **ROI: -100%** (todas as consultas de outubro foram retornos/avaliativas/cortesia)

### ROI LTV (receita total pós-primeiro contato via tráfego pago)
| Paciente | 1° contato | Receita confirmada | Fonte |
|----------|-----------|-------------------|-------|
| Cledir | Jul/26 | R$ 6.450 | financial_records jul-set |
| Ilana | Set/26 | R$ 5.000 | financial_records set |
| Virginia | Out/26 | R$ 0 (R$ 2.400 potencial nov) | agendamentos futuros |
| Marilei | Out/26 | R$ 0 | cortesia |
| Victor | Out/26 | R$ 0 | sem agendamento |
| **TOTAL** | | **R$ 11.450** | |

- Investimento acumulado (dados apenas de outubro disponíveis): R$ 866,69
- **ROI LTV vs investimento outubro: +1.221%**
- Para ROI acumulado real, seria necessário o investimento Meta Ads de mar-set/2026

### Projeção com agendamentos futuros (novembro)
- Virginia: R$ 2.400 (2 consultas agendadas)
- Cledir: R$ 2.500 (1 consulta agendada)
- **Potencial adicional: R$ 4.900**
- **ROI LTV projetado: R$ 16.350 / R$ 866,69 = +1.787%**

---

## 5. Conclusões

1. **O relatório anterior estava incorreto:** Elizabeth Klemtz (R$ 650) não veio pelo tráfego pago
2. **Outubro teve ZERO receita direta** do tráfego pago — todas as consultas foram retornos ou avaliativas
3. **O tráfego pago funciona como funil de aquisição:** os leads entram pela avaliativa gratuita, e a receita vem nos meses seguintes (Ilana gerou R$ 5.000 em setembro; Cledir gerou R$ 6.450 jul-set)
4. **Marilei é cortesia, não conversão comercial** — deve ser excluída das métricas
5. **O ROI real precisa ser medido como LTV**, não mês a mês, porque o modelo de negócio da clínica é: avaliação grátis → procedimento pago em consulta subsequente
6. **3 das 5 conversões rastreáveis são genuínas** (Cledir, Ilana, Virginia) e devem gerar receita futura

---

*Gerado em 2026-11-02 por DAI — Digital AI*
*Fonte: API Feegow (consulta direta) + PostgreSQL dermaclinic + Meta Ads XLSX*
