# Help Core — Processamento Inteligente de Base de Conhecimento

> Documentacao tecnica completa do pipeline de processamento IA para a base HELP do Bradesco.
> Projeto HELP CORE, operado pela Ello Consultoria com tecnologia Digital AI.
> Versao 2.0 — Outubro 2026. Incorpora decisoes de arquitetura do Sprint 1+2 de auditoria PE.

---

## Sumario

1. [O Desafio](#o-desafio)
2. [Arquitetura do Processing Engine](#arquitetura-do-processing-engine)
3. [Etapas do Processamento](#etapas-do-processamento)
4. [Campos Raw do SharePoint](#campos-raw-do-sharepoint)
5. [Pipeline 1: helpcore-analysis (Consolidado)](#pipeline-1-helpcore-analysis)
6. [Pipeline 2: helpcore-rewrite (Sob Demanda)](#pipeline-2-helpcore-rewrite)
7. [32 Campos de Output do LLM](#32-campos-de-output-do-llm)
8. [System Prompt Unificado](#system-prompt-unificado)
9. [Configuracao YAML Completa](#configuracao-yaml-completa)
10. [Estrategia de Deduplicacao](#estrategia-de-deduplicacao)
11. [Arvore de Categorias e Subcategorias](#arvore-de-categorias-e-subcategorias)
12. [Schema PostgreSQL](#schema-postgresql)
13. [Estimativa de Custo LLM](#estimativa-de-custo-llm)
14. [Metricas de Sucesso](#metricas-de-sucesso)
15. [Gestao de Riscos](#gestao-de-riscos)
16. [Distribuicao por Tipo de Conteudo](#distribuicao-por-tipo-de-conteudo)
17. [Plano de Execucao](#plano-de-execucao)
18. [Resultados Esperados](#resultados-esperados)

---

## O Desafio

A base HELP do Bradesco e um dos maiores ativos de conhecimento da organizacao. Esta presa em formato legado do SharePoint, sem inventario, sem qualidade medida e com duplicacao desconhecida.

### Problemas Identificados

| Problema | Descricao |
|----------|-----------|
| **Markup Pesado** | HTMLs com classes MS-*, estilos inline, tabelas aninhadas e formatacao legada do SharePoint. Impossivel extrair conteudo util diretamente. |
| **Duplicacao Desconhecida** | Sem inventario centralizado, nao se sabe quantos artigos sao duplicatas exatas ou semanticas entre as 26 areas operacionais. |
| **Classificacao Rudimentar** | Os TXTs trazem classificacao por heuristica simples (TEXTUAL, LINK_ONLY, SHORT_TEXT). Precisa de validacao e refinamento com IA. |
| **Sem Quality Score** | Nenhum artigo tem avaliacao de completude, clareza ou atualidade. Impossivel priorizar revisao humana sem uma metrica objetiva. |
| **Volume Inviavel** | 108 mil artigos sao inviaveis para revisao humana direta. Triagem automatizada com IA e pre-requisito para qualquer acao. |

---

## Arquitetura do Processing Engine

Motor de processamento agnostico, configuravel via YAML, que orquestra ingestao, deduplicacao, analise por LLM e persistencia. Pipelines paralelos e resilientes com controle de custo, cache e retry.

```
Filesystem (218.612 arquivos, 108K pares HTML+TXT, 1.4 GB, 26 areas)
    |
    v
[ETAPA PRE-PIPELINE] Ingestao do Filesystem
    +-- Leitura recursiva de TXTs (metadados estruturados)
    +-- Parsing dos 15 campos raw do SharePoint
    +-- Normalizacao de encoding (UTF-8 / CP1252 / Latin-1)
    +-- Deteccao de classificacao (TEXTUAL, LINK_ONLY, SHORT_TEXT, EMPTY, MEDIA)
    +-- INSERT em help_core.articles
    |
    v
[ETAPA PRE-PIPELINE] Deduplicacao (Hash + Embeddings + SimHash)
    +-- Camada 1: Hash SHA-256 (duplicatas exatas, custo zero)
    +-- Camada 2: Embeddings pgvector (duplicatas semanticas, ~52.7K unicos)
    +-- Camada 3: SimHash/MinHash (duplicatas estruturais)
    +-- Grafo de relacionamentos entre artigos
    |
    v
Processing Engine — Pipeline LLM
    |
    +-- Pipeline 1: helpcore-analysis (1 chamada LLM por artigo)
    |       +-- Ingestor (auto)
    |       +-- Dedup (hash)
    |       +-- LLM: gpt-4.1-mini (3 analises em 1 chamada)
    |       +-- Validators (schema + range)
    |       +-- Sink: help_core.analysis_results
    |
    +-- Pipeline 2: helpcore-rewrite (sob demanda, quality < 70)
            +-- Ingestor (auto)
            +-- LLM: Claude Sonnet 4 (reescrita editorial)
            +-- Sink: help_core.rewrites
    |
    v
Inventario Estruturado
    (Artigos classificados, qualidade medida, deduplicados, candidatos a reescrita identificados)
```

---

## Etapas do Processamento

O processamento completo tem quatro etapas distintas. As duas primeiras sao pre-pipeline (sem LLM). As duas ultimas sao pipelines LLM configurados no Processing Engine.

### Etapa 1: Ingestao do Filesystem (Pre-Pipeline)

Leitura dos arquivos TXT exportados do SharePoint. Extrai os 15 campos raw e persiste em `help_core.articles`. Nenhuma chamada LLM. Estimativa: 2-4 horas para 108K artigos.

Acoes:
- Percorre recursivamente as pastas por area
- Le cada arquivo TXT e faz parse dos campos estruturados
- Normaliza encoding (chardet: UTF-8 → CP1252 → Latin-1)
- Detecta classificacao inicial (TEXTUAL, LINK_ONLY, SHORT_TEXT, EMPTY, MEDIA)
- Gera `source_url` canonico: `bradesco-help://{area}/{iid}`
- Insere ou atualiza `help_core.articles` via upsert em `source_url`

### Etapa 2: Deduplicacao (Pre-Pipeline)

Identifica duplicatas em 3 camadas antes de submeter ao LLM. Evita custo duplo para artigos identicos. Detalhes completos na secao [Estrategia de Deduplicacao](#estrategia-de-deduplicacao).

### Etapa 3: Pipeline helpcore-analysis (LLM)

1 chamada gpt-4.1-mini por artigo. Executa 3 analises simultaneas: inventario, qualidade multi-dimensional e analise de deduplicacao intra-artigo. Output: 32 campos em 3 blocos.

### Etapa 4: Pipeline helpcore-rewrite (LLM, Sob Demanda)

Acionado apenas para artigos com `quality.overall_score < 70`. Usa Claude Sonnet 4 para reescrita editorial. Output: 12 campos com o artigo reescrito e metadados de transformacao.

---

## Campos Raw do SharePoint

15 campos extraidos dos arquivos TXT exportados do SharePoint. Sao a fonte primaria de dados estruturados antes de qualquer processamento LLM.

| # | Campo Raw | Tipo | Exemplo | Destino no Banco |
|---|-----------|------|---------|-----------------|
| R1 | `area` | string | "Alto Valor", "SAC Cartoes" | `help_core.articles.area` |
| R2 | `lista` | string | "2 Via de Senha" | `help_core.articles.lista` |
| R3 | `titulo` | string | "00. CONCEITO E QUEM PODE" | `help_core.articles.title` |
| R4 | `subtitulo` | string | "" | `help_core.articles.subtitulo` |
| R5 | `nivel3` | string | "" | `help_core.articles.nivel3` |
| R6 | `iid` | string | "139" (ID interno SharePoint) | `help_core.articles.iid` |
| R7 | `modified` | string | "08/05/2025 17:37" | `help_core.articles.modified_at` |
| R8 | `classificacao` | string | "TEXTUAL", "LINK_ONLY" | `help_core.articles.classificacao` |
| R9 | `help_name` | string | "Atendimento AOC - Cartoes" | `help_core.articles.metadata->help_name` |
| R10 | `list_url` | string (URL) | URL da lista SharePoint | `help_core.articles.metadata->list_url` |
| R11 | `links` | string[] | URLs internas SharePoint | `help_core.articles.links` |
| R12 | `source_filename` | string | "000001_00. CONCEITO..." | `help_core.articles.source_filename` |
| R13 | `source_area_path` | string | "Alto Valor/2 Via..." | `help_core.articles.metadata->source_area_path` |
| R14 | `content` | string | Texto completo do artigo | Enviado como `content` ao PE |
| R15 | `source_url` | string | "bradesco-help://Alto Valor/139" | `help_core.articles.source_url` (UNIQUE, chave de negocio) |

O campo `source_url` e gerado sinteticamente pelo ingestor no formato `bradesco-help://{area}/{iid}` e serve como chave de negocio unica. E o identificador canonico de cada artigo em todo o sistema.

---

## Pipeline 1: helpcore-analysis

Pipeline consolidado que substitui os 4 pipelines sequenciais da versao anterior (helpcore-ingest, helpcore-dedup, helpcore-classify, helpcore-quality-score).

### Racional da Consolidacao

| Versao Anterior (4 pipelines) | Versao 2.0 (1 pipeline consolidado) |
|-------------------------------|--------------------------------------|
| 3 chamadas LLM por artigo | 1 chamada LLM por artigo |
| Pipelines dependentes em sequencia | Pipeline independente e atomico |
| ~3x o custo em tokens de entrada | ~1/3 do custo em tokens de entrada |
| Output disperso em multiplas tabelas | Output consolidado em 1 tabela |
| Sink complexo com JOINs | Sink simples com 1 INSERT/UPSERT |

A justificativa tecnica: inventario, qualidade e analise de deduplicacao intra-artigo usam o mesmo input (o artigo). Enviar o mesmo texto 3 vezes ao LLM desperdicava 2/3 dos tokens de entrada. A consolidacao em 1 chamada mantem os 32 campos de output sem perda de qualidade.

### Especificacoes do Pipeline

| Parametro | Valor |
|-----------|-------|
| ID | `helpcore-analysis` |
| Provedor LLM | OpenAI |
| Modelo | gpt-4.1-mini |
| Temperature | 0.0 (deterministico) |
| Max tokens | 16.384 |
| Campos de output | 32 (3 blocos) |
| Estrategia de dedup | hash |
| Cache TTL | 720h (30 dias) |
| Max concorrencia | 5 |
| Rate limit | 60 RPM |
| Teto de budget | US$ 500/mes |

---

## Pipeline 2: helpcore-rewrite

Pipeline separado, acionado sob demanda para artigos com baixa qualidade.

### Criterio de Ativacao

Artigos com `quality.overall_score < 70` na tabela `help_core.analysis_results` sao candidatos a reescrita. Estimativa: ~10% dos artigos unicos TEXTUAL (~5.400 artigos).

### Especificacoes do Pipeline

| Parametro | Valor |
|-----------|-------|
| ID | `helpcore-rewrite` |
| Provedor LLM | Anthropic |
| Modelo | Claude Sonnet 4 |
| Temperature | 0.2 |
| Justificativa do modelo | Claude Sonnet 4 tem capacidade editorial superior para reescrita em portugues corporativo bancario. gpt-4.1-mini e adequado para classificacao/scoring, mas Claude e mais forte em producao textual de alta qualidade. |

### 12 Campos de Output (Rewrite)

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `rewritten_content` | string | Artigo reescrito completo em PT-BR |
| `changes_summary` | string | Resumo das principais alteracoes (max 300 chars) |
| `word_count_original` | integer | Contagem de palavras antes da reescrita |
| `word_count_rewritten` | integer | Contagem de palavras apos a reescrita |
| `readability_before` | number 0-100 | Score de legibilidade do original |
| `readability_after` | number 0-100 | Score de legibilidade apos reescrita |
| `sections_added` | string[] | Secoes adicionadas (ex: "Procedimento de escalacao") |
| `sections_removed` | string[] | Secoes removidas por redundancia ou obsolescencia |
| `sections_modified` | string[] | Secoes com alteracoes significativas |
| `tone_adjustments` | string[] | Ajustes de tom e linguagem realizados |
| `formatting_changes` | string[] | Mudancas de formatacao (listas, titulos, tabelas) |
| `confidence` | number 0.0-1.0 | Confianca do LLM na qualidade da reescrita |

---

## 32 Campos de Output do LLM

O pipeline `helpcore-analysis` produz 32 campos organizados em 3 blocos no output JSON. Cada bloco e mapeado para colunas tipadas na tabela `help_core.analysis_results`.

### Bloco 1: `inventory` (14 campos)

Classificacao e metadados do artigo.

| Campo | Tipo | Descricao | Valores / Restricoes |
|-------|------|-----------|----------------------|
| `doc_type` | enum | Formato estrutural do documento | `procedimento`, `passo_a_passo`, `checklist`, `faq`, `referencia`, `politica`, `outro` |
| `category` | enum | Tema operacional central | `cancelamento`, `bloqueio`, `credito`, `fraude`, `cadastro`, `contestacao`, `cartao`, `pix`, `transferencia`, `emprestimo`, `investimento`, `seguro`, `conta`, `atendimento`, `cobranca`, `senha`, `risco`, `digital`, `outro` |
| `subcategory` | string | Detalhe especifico dentro da categoria | Max 50 chars. Ex: `segunda_via`, `phishing` |
| `target_audience` | enum | Publico-alvo do artigo | `operador`, `supervisor`, `tecnico`, `cliente`, `multiplo` |
| `quality_score` | number 0-100 | Qualidade textual (clareza, organizacao, linguagem profissional) | Inteiro |
| `completeness_score` | number 0-100 | Completude (passos claros, info suficiente, sem lacunas) | Inteiro |
| `key_topics` | string[] | Palavras-chave dos temas centrais | 1-8 items, sem stopwords |
| `summary` | string | Resumo factual do artigo | Max 500 chars, 1-2 frases |
| `requires_update` | boolean | Indicios de desatualizacao (datas antigas, sistemas obsoletos) | `true` / `false` |
| `has_mandatory_fields` | boolean | Titulo, corpo e procedimento minimo presentes | `true` / `false` |
| `mandatory_fields_missing` | string[] | Lista de campos obrigatorios ausentes | Ex: `["titulo", "procedimento_de_escalacao"]` |
| `estimated_word_count` | integer | Contagem estimada de palavras | Inteiro positivo |
| `language_issues` | string[] | Problemas de linguagem detectados | Max 5 items. Ex: `["frases muito longas", "jargao sem definicao"]` |
| `confidence` | number 0.0-1.0 | Confianca do LLM na classificacao | Float. Abaixo de 0.7: revisar |

### Bloco 2: `quality` (10 campos)

Avaliacao multi-dimensional de qualidade.

| Campo | Tipo | Descricao | Peso |
|-------|------|-----------|------|
| `clarity` | number 0-100 | Clareza das instrucoes e linguagem | 30% |
| `structure` | number 0-100 | Organizacao logica e hierarquia de conteudo | 25% |
| `completeness` | number 0-100 | Cobertura completa do procedimento descrito | 25% |
| `accuracy_signals` | number 0-100 | Sinais de precisao e ausencia de contradicoes | 10% |
| `readability` | number 0-100 | Facilidade de leitura e compreensao | 10% |
| `overall_score` | number 0-100 | Media ponderada dos 5 criterios acima | Calculado |

Campos de diagnostico e priorizacao:

| Campo | Tipo | Descricao | Valores |
|-------|------|-----------|---------|
| `improvement_suggestions` | string[] | Sugestoes concretas de melhoria em PT-BR | Max 5 items |
| `priority_level` | enum | Urgencia de revisao baseada no overall_score | `critical` (<30), `high` (30-50), `medium` (50-70), `low` (>70) |
| `estimated_effort` | enum | Estimativa de esforco para revisao | `minor` (<15min), `moderate` (15-60min), `major` (>1h), `rewrite` |
| `actionable_items` | object[] | Acoes especificas com tipo e impacto | Max 5 items. Cada item: `{type, description, impact}` |

Valores possiveis para `actionable_items.type`: `fix_grammar`, `add_steps`, `restructure`, `update_reference`, `add_context`, `simplify`, `remove_redundancy`

Valores possiveis para `actionable_items.impact`: `high`, `medium`, `low`

### Bloco 3: `dedup_analysis` (8 campos)

Analise de deduplicacao intra-artigo nesta fase. Comparacao cross-artigo e feita pela deduplicacao pre-pipeline (hash + embeddings + simhash). Nesta fase, o LLM analisa apenas conflitos internos e genericidade do artigo.

| Campo | Tipo | Descricao | Valor nesta fase |
|-------|------|-----------|-----------------|
| `is_duplicate` | boolean | Se e duplicata de outro artigo | Sempre `false` (determinado pre-pipeline) |
| `duplicate_of` | string\|null | source_url do artigo canonico | Sempre `null` nesta fase |
| `duplicate_type` | enum | Tipo de duplicata | Sempre `not_duplicate` nesta fase |
| `similarity_score` | number 0.0-1.0 | Score de similaridade com canonico | Sempre `0.0` nesta fase |
| `reason` | string | Nota sobre unicidade ou genericidade do artigo | Max 300 chars |
| `conflicting_info` | boolean | Se o artigo tem conflitos internos de informacao | Analise real do LLM |
| `conflict_details` | string\|null | Detalhes do conflito interno detectado | Max 300 chars. `null` se sem conflito |
| `recommended_action` | enum | Acao recomendada | `merge`, `archive_this`, `archive_other`, `review`, `keep_both` — sempre `keep_both` nesta fase |

Nota sobre o campo `reason`: mesmo que `is_duplicate` seja `false`, o LLM pode identificar que o artigo e excessivamente generico ou que seu conteudo sobrepoem substancialmente outra categoria. Este campo captura essa observacao para revisao humana.

---

## System Prompt Unificado

System prompt do pipeline `helpcore-analysis`. O LLM recebe o artigo completo e realiza as 3 analises em uma unica resposta JSON estruturada.

```
Voce e um analista especializado em bases de conhecimento corporativas de atendimento bancario.
Voce recebera um artigo da base de conhecimento do Bradesco e deve fazer 3 analises simultaneas,
retornando um objeto JSON com 3 blocos: "inventory", "quality" e "dedup_analysis".

## ANALISE 1 — INVENTARIO (bloco "inventory")

Classifique o artigo nos seguintes 14 campos:

- doc_type: formato estrutural. Valores: procedimento, passo_a_passo, checklist, faq,
  referencia, politica, outro.
- category: tema operacional central. Valores: cancelamento, bloqueio, credito, fraude,
  cadastro, contestacao, cartao, pix, transferencia, emprestimo, investimento, seguro,
  conta, atendimento, cobranca, senha, risco, digital, outro.
- subcategory: detalhe especifico dentro da categoria. String livre, max 50 chars.
  Exemplos: "segunda_via", "phishing", "consignado".
- target_audience: publico-alvo. Valores: operador, supervisor, tecnico, cliente, multiplo.
- quality_score: nota 0-100 de qualidade textual (clareza, organizacao, linguagem
  profissional). Inteiro.
- completeness_score: nota 0-100 de completude (passos claros, info suficiente, sem
  lacunas criticas). Inteiro.
- key_topics: array de 1-8 palavras-chave dos temas centrais. Sem stopwords.
- summary: resumo factual em 1-2 frases, max 500 chars. Descreva o que o artigo ensina,
  sem jargao.
- requires_update: true se houver indicios claros de desatualizacao (datas antigas,
  sistemas obsoletos, referencias a processos descontinuados). false caso contrario.
- has_mandatory_fields: true se o artigo tem titulo identificavel, corpo com conteudo
  e pelo menos um procedimento ou instrucao. false se faltar algum desses.
- mandatory_fields_missing: array com os campos obrigatorios ausentes. Array vazio se
  has_mandatory_fields for true.
- estimated_word_count: estimativa de palavras no artigo. Inteiro positivo.
- language_issues: array com ate 5 problemas de linguagem detectados. Array vazio se
  nao houver problemas relevantes.
- confidence: sua confianca na classificacao de 0.0 a 1.0. Valores abaixo de 0.7 indicam
  ambiguidade e o artigo sera encaminhado para revisao humana.

## ANALISE 2 — QUALIDADE MULTI-DIMENSIONAL (bloco "quality")

Avalie o artigo em 5 dimensoes com os respectivos pesos:

- clarity (peso 30%): clareza das instrucoes e da linguagem. Frases objetivas, verbos
  no imperativo quando instrucional, ausencia de ambiguidades.
- structure (peso 25%): organizacao logica. Uso de listas, numeracao de passos,
  hierarquia de titulos, progresso logico do inicio ao fim.
- completeness (peso 25%): cobertura completa. Todos os passos necessarios presentes,
  pre-requisitos mencionados, excecoes e erros comuns cobertos.
- accuracy_signals (peso 10%): sinais de precisao. Ausencia de contradicoes internas,
  referencias coerentes, dados especificos quando necessarios.
- readability (peso 10%): facilidade de leitura. Paragrafos curtos, vocabulario
  acessivel ao publico-alvo, formatacao que facilita a leitura rapida.

Calcule overall_score como media ponderada dos 5 criterios.

Para priority_level:
- critical: overall_score < 30 (artigo inutilizavel, reescrita urgente)
- high: overall_score 30-50 (problemas graves, revisao prioritaria)
- medium: overall_score 50-70 (melhorias necessarias, fila normal)
- low: overall_score > 70 (pequenos ajustes ou pronto para uso)

Para estimated_effort:
- minor: < 15 minutos (ajustes pontuais de texto)
- moderate: 15-60 minutos (reorganizacao ou complementacao parcial)
- major: > 1 hora (reestruturacao significativa)
- rewrite: reescrita completa necessaria

Forneca ate 5 improvement_suggestions concretas em PT-BR. Exemplos:
"Numerar os passos do procedimento", "Adicionar secao de excecoes para sistema indisponivel",
"Remover redundancia no segundo paragrafo".

Forneca ate 5 actionable_items, cada um com:
- type: fix_grammar, add_steps, restructure, update_reference, add_context, simplify,
  remove_redundancy
- description: descricao concisa da acao (max 100 chars)
- impact: high, medium, low

## ANALISE 3 — ANALISE DE DUPLICATAS (bloco "dedup_analysis")

Nesta fase, a comparacao entre artigos e feita por hash e embeddings (pre-pipeline).
Neste bloco, analise apenas o artigo internamente.

Campos fixos nesta fase (retorne exatamente estes valores):
- is_duplicate: false
- duplicate_of: null
- duplicate_type: "not_duplicate"
- similarity_score: 0.0
- recommended_action: "keep_both"

Campos que voce deve analisar de verdade:
- conflicting_info: true se o artigo contem informacoes contraditoriascoma ele mesmo
  (ex: afirma uma coisa no inicio e contradiz no fim, ou dois passos incompativeis).
- conflict_details: se conflicting_info for true, descreva o conflito em max 300 chars.
  null se nao houver conflito.
- reason: note se o artigo e excessivamente generico, se seu conteudo sobrepoem
  claramente outra categoria, ou qualquer observacao relevante sobre unicidade.
  Max 300 chars.

## REGRAS GERAIS

- Responda EXCLUSIVAMENTE em portugues (PT-BR)
- Seja conciso e respeite os limites de tamanho indicados (maxLength)
- Use EXATAMENTE os valores dos enums listados — sem variantes, sem traducao, sem
  adaptacao
- Na duvida sobre a classificacao, reduza o campo confidence para refletir a
  incerteza em vez de forcar uma classificacao errada
- Nao adicione campos extras fora do schema definido
- Nao omita campos obrigatorios — retorne string vazia ou array vazio quando aplicavel,
  nunca null em campos requeridos
```

---

## Configuracao YAML Completa

Arquivo de configuracao do pipeline `helpcore-analysis` para o Processing Engine.

```yaml
id: helpcore-analysis
name: helpcore-analysis
description: >
  Pipeline consolidado de analise de artigos Help Core.
  Executa inventario, quality score multi-dimensional e analise de dedup intra-artigo
  em UMA unica chamada LLM por artigo.
  Substitui os 4 pipelines sequenciais da versao 1.0 (helpcore-ingest, helpcore-dedup,
  helpcore-classify, helpcore-quality-score).

ingestor_type: auto
dedup_strategy: hash
dedup_config:
  url_normalize: true

llm_provider: openai
llm_model: gpt-4.1-mini
llm_temperature: 0.0
llm_max_tokens: 16384

output_schema:
  type: object
  required: [inventory, quality, dedup_analysis]
  additionalProperties: false
  properties:
    inventory:
      type: object
      required:
        - doc_type
        - category
        - subcategory
        - target_audience
        - quality_score
        - completeness_score
        - key_topics
        - summary
        - requires_update
        - has_mandatory_fields
        - mandatory_fields_missing
        - estimated_word_count
        - language_issues
        - confidence
      additionalProperties: false
      properties:
        doc_type:
          type: string
          enum: [procedimento, passo_a_passo, checklist, faq, referencia, politica, outro]
        category:
          type: string
          enum:
            - cancelamento
            - bloqueio
            - credito
            - fraude
            - cadastro
            - contestacao
            - cartao
            - pix
            - transferencia
            - emprestimo
            - investimento
            - seguro
            - conta
            - atendimento
            - cobranca
            - senha
            - risco
            - digital
            - outro
        subcategory:
          type: string
          maxLength: 50
        target_audience:
          type: string
          enum: [operador, supervisor, tecnico, cliente, multiplo]
        quality_score:
          type: number
          minimum: 0
          maximum: 100
        completeness_score:
          type: number
          minimum: 0
          maximum: 100
        key_topics:
          type: array
          items:
            type: string
          minItems: 1
          maxItems: 8
        summary:
          type: string
          maxLength: 500
        requires_update:
          type: boolean
        has_mandatory_fields:
          type: boolean
        mandatory_fields_missing:
          type: array
          items:
            type: string
        estimated_word_count:
          type: integer
          minimum: 0
        language_issues:
          type: array
          items:
            type: string
          maxItems: 5
        confidence:
          type: number
          minimum: 0.0
          maximum: 1.0
    quality:
      type: object
      required:
        - clarity
        - structure
        - completeness
        - accuracy_signals
        - readability
        - overall_score
        - improvement_suggestions
        - priority_level
        - estimated_effort
        - actionable_items
      additionalProperties: false
      properties:
        clarity:
          type: number
          minimum: 0
          maximum: 100
        structure:
          type: number
          minimum: 0
          maximum: 100
        completeness:
          type: number
          minimum: 0
          maximum: 100
        accuracy_signals:
          type: number
          minimum: 0
          maximum: 100
        readability:
          type: number
          minimum: 0
          maximum: 100
        overall_score:
          type: number
          minimum: 0
          maximum: 100
        improvement_suggestions:
          type: array
          items:
            type: string
          maxItems: 5
        priority_level:
          type: string
          enum: [critical, high, medium, low]
        estimated_effort:
          type: string
          enum: [minor, moderate, major, rewrite]
        actionable_items:
          type: array
          maxItems: 5
          items:
            type: object
            required: [type, description, impact]
            additionalProperties: false
            properties:
              type:
                type: string
                enum:
                  - fix_grammar
                  - add_steps
                  - restructure
                  - update_reference
                  - add_context
                  - simplify
                  - remove_redundancy
              description:
                type: string
                maxLength: 100
              impact:
                type: string
                enum: [high, medium, low]
    dedup_analysis:
      type: object
      required:
        - is_duplicate
        - duplicate_of
        - duplicate_type
        - similarity_score
        - reason
        - conflicting_info
        - conflict_details
        - recommended_action
      additionalProperties: false
      properties:
        is_duplicate:
          type: boolean
        duplicate_of:
          type: ["string", "null"]
        duplicate_type:
          type: string
          enum: [exact, quasi_duplicate, overlapping, not_duplicate]
        similarity_score:
          type: number
          minimum: 0.0
          maximum: 1.0
        reason:
          type: string
          maxLength: 300
        conflicting_info:
          type: boolean
        conflict_details:
          type: ["string", "null"]
          maxLength: 300
        recommended_action:
          type: string
          enum: [merge, archive_this, archive_other, review, keep_both]

validators: [schema, range]
validator_config:
  range:
    ranges:
      inventory.quality_score: [0, 100]
      inventory.completeness_score: [0, 100]
      inventory.confidence: [0.0, 1.0]
      quality.clarity: [0, 100]
      quality.structure: [0, 100]
      quality.completeness: [0, 100]
      quality.accuracy_signals: [0, 100]
      quality.readability: [0, 100]
      quality.overall_score: [0, 100]

sink_type: postgresql
sink_config:
  database_url_env: HELPCORE_DATABASE_URL
  table: help_core.analysis_results
  conflict_column: pe_item_id
  column_mapping:
    inventory.doc_type: doc_type
    inventory.category: category
    inventory.subcategory: subcategory
    inventory.target_audience: target_audience
    inventory.quality_score: inv_quality_score
    inventory.completeness_score: completeness_score
    inventory.key_topics: key_topics
    inventory.summary: summary
    inventory.requires_update: requires_update
    inventory.has_mandatory_fields: has_mandatory_fields
    inventory.mandatory_fields_missing: mandatory_fields_missing
    inventory.estimated_word_count: estimated_word_count
    inventory.language_issues: language_issues
    inventory.confidence: classification_confidence
    quality.clarity: clarity
    quality.structure: structure
    quality.completeness: quality_completeness
    quality.accuracy_signals: accuracy_signals
    quality.readability: readability
    quality.overall_score: overall_score
    quality.improvement_suggestions: improvement_suggestions
    quality.priority_level: priority_level
    quality.estimated_effort: estimated_effort
    quality.actionable_items: actionable_items
    dedup_analysis.conflicting_info: has_internal_conflicts
    dedup_analysis.conflict_details: internal_conflict_details
    dedup_analysis.reason: content_genericness
  item_field_mapping:
    source_url: source_url
  jsonb_fallback: metadata
  array_columns:
    - key_topics
    - improvement_suggestions
    - mandatory_fields_missing
    - language_issues
  sql_defaults:
    processed_at: "NOW()"

max_concurrent: 5
rate_limit_rpm: 60
max_retries: 2
budget_limit_usd: 500.0
budget_period: month
cache:
  enabled: true
  ttl_hours: 720
```

---

## Estrategia de Deduplicacao

A analise preliminar revelou que mais da metade da base e composta por duplicatas exatas. A estrategia em tres camadas garante deteccao maxima com custo minimo de processamento. Esta etapa e executada ANTES do pipeline LLM.

### Descoberta Inicial

- **51.2% da base sao duplicatas exatas** (~55.319 artigos com hash identico)
- **48.8% sao artigos unicos a processar** (~52.743 artigos)
- Dos ~52.7K unicos, uma parcela adicional tera duplicatas semanticas detectadas pela Camada 2 (embeddings). Estimativa: 5-10% adicionais com similaridade >= 0.95.

### Camada 1: Hash SHA-256 (Duplicatas Exatas)

- **Tecnica**: Normalizacao NFC + lowercase + whitespace collapse antes do hash
- **Resultado**: Identificacao deterministica, custo zero (nenhuma chamada LLM)
- **Duplicatas esperadas**: ~55.000
- Nenhum artigo duplicado por hash e submetido ao LLM. Economia de ~55K chamadas.

### Camada 2: Embeddings + pgvector (Duplicatas Semanticas)

- **Tecnica**: text-embedding-3-small (1536 dimensoes). Indice HNSW (m=16, ef_construction=100) para busca KNN eficiente. Blocking via top-5 vizinhos evita comparacao O(n²).
- **Thresholds**:
  - `>= 0.95`: merge automatico (duplicata confirmada)
  - `0.92 - 0.95`: vai para revisao humana (zona cinzenta)
- **Duplicatas esperadas**: ~3.000 a 5.000

Apenas os ~52.7K artigos unicos (pos-Camada 1) passam para a Camada 2.

### Camada 3: SimHash / MinHash (Fingerprint Estrutural)

- **Tecnica**: Detecta artigos com o mesmo conteudo reorganizado ou reformatado de forma diferente. Complementar a similaridade semantica: captura casos onde a embedding nao alcanca threshold mas o conteudo e substancialmente o mesmo.
- **Parametros**: SimHash 64-bit, MinHash LSH, Hamming distance <= 3
- **Duplicatas esperadas**: ~1.000 a 2.000

### Deteccao entre Areas (Cross-Category)

Um mesmo artigo frequentemente aparece em multiplas das 26 areas do SharePoint. A deduplicacao identifica esses casos mesmo quando os artigos estao em pastas completamente diferentes.

**Exemplo**:
- Area "Suporte": "Cartao de Credito: limite e fatura" — **Canonico**
- Area "FAQ": "Cartao de Credito: limite e fatura" — **Duplicata**
- Area "Produtos": "Cartao de Credito: limite e fatura" — **Duplicata**

**Beneficio pratico**: A equipe de conteudo identifica qual versao e a mais completa e atualizada (canonico), e pode arquivar ou redirecionar as demais. Isso elimina trabalho de manutencao duplicado entre times de diferentes areas.

### 6 Tipos de Vinculo entre Artigos (Grafo de Relacionamentos)

Alem de identificar duplicatas, o pipeline constroi um grafo completo de relacionamentos. Cada artigo pode ter vinculos de 6 naturezas distintas com outros artigos da base:

| Tipo | Descricao | Cor |
|------|-----------|-----|
| `exact_duplicate` | Hash SHA-256 identico (conteudo byte-a-byte igual) | Laranja |
| `semantic_duplicate` | Embedding cosine >= 0.92 (mesmo significado, texto diferente) | Azul |
| `structural_duplicate` | SimHash/MinHash (mesmo conteudo reorganizado) | Roxo |
| `cross_area_link` | Mesmo conteudo encontrado em area operacional diferente | Verde |
| `references` | Artigo A cita ou linka para Artigo B explicitamente | Cinza |
| `supersedes` | Artigo A e versao atualizada de Artigo B (detectado por titulo + data) | Vermelho |

**Schema do grafo**:

```sql
CREATE TABLE help_core.article_relationships (
    id UUID PRIMARY KEY,
    source_article_id UUID REFERENCES help_core.articles(id),
    target_article_id UUID REFERENCES help_core.articles(id),
    relationship_type TEXT,
    -- exact_duplicate, semantic_duplicate, structural_duplicate,
    -- cross_area_link, references, supersedes
    similarity_score NUMERIC,
    detected_by TEXT,
    -- hash, embedding, simhash, crawler, llm
    metadata JSONB
);

CREATE TABLE help_core.article_clusters (
    id UUID PRIMARY KEY,
    cluster_type TEXT,
    canonical_id UUID REFERENCES help_core.articles(id),
    member_count INT,
    avg_similarity NUMERIC
);

CREATE TABLE help_core.article_cluster_members (
    cluster_id UUID REFERENCES help_core.article_clusters(id),
    article_id UUID REFERENCES help_core.articles(id),
    is_canonical BOOLEAN DEFAULT false,
    similarity_to_canonical NUMERIC,
    PRIMARY KEY (cluster_id, article_id)
);
```

### Sequencia de Execucao

| Fase | Camada | Acao |
|------|--------|------|
| 1 | Hash SHA-256 | Executar sobre 100% da base. Custo zero. Remove ~55K duplicatas exatas. |
| 2 | Embeddings | Gerar embeddings para os ~52.7K unicos. Indexar com HNSW. Buscar vizinhos. |
| 3 | SimHash/MinHash | Executar sobre artigos que passaram pela Camada 2 sem match. |
| 4 | Revisao humana | Artigos na zona cinzenta (0.92-0.95) vao para revisao manual assistida. |

---

## Arvore de Categorias e Subcategorias

Totais: **19 categorias**, **103 subcategorias**, **3 niveis de profundidade** (raiz → categoria → subcategoria).

### cartao (7 subcategorias)
- `segunda_via`
- `desbloqueio`
- `limite`
- `anuidade`
- `contestacao_fatura`
- `cartao_virtual`
- `aproximacao`

### credito (6 subcategorias)
- `analise_risco`
- `consignado`
- `financiamento`
- `renegociacao`
- `limite_credito`
- `cheque_especial`

### fraude (6 subcategorias)
- `clonagem`
- `phishing`
- `engenharia_social`
- `compra_indevida`
- `prevencao`
- `investigacao`

### conta (7 subcategorias)
- `abertura`
- `encerramento`
- `tarifas`
- `extrato`
- `atualizacao_cadastral`
- `conta_salario`
- `conta_poupanca`

### pix (7 subcategorias)
- `cadastro_chave`
- `limite`
- `devolucao`
- `agendamento`
- `pix_saque`
- `pix_troco`
- `falha`

### cancelamento (5 subcategorias)
- `produto`
- `servico`
- `seguro`
- `consorcio`
- `previdencia`

### atendimento (6 subcategorias)
- `reclamacao`
- `ouvidoria`
- `protocolo`
- `sla`
- `escalacao`
- `recontato`

### bloqueio (5 subcategorias)
- `senha`
- `cartao`
- `conta`
- `judicial`
- `cautelar`

### cadastro (5 subcategorias)
- `pessoa_fisica`
- `pessoa_juridica`
- `procuracao`
- `atualizacao`
- `biometria`

### transferencia (5 subcategorias)
- `ted`
- `doc`
- `entre_contas`
- `internacional`
- `agendada`

### emprestimo (5 subcategorias)
- `contratacao`
- `simulacao`
- `antecipacao`
- `quitacao`
- `portabilidade`

### investimento (6 subcategorias)
- `renda_fixa`
- `renda_variavel`
- `fundos`
- `previdencia`
- `cdb`
- `lci_lca`

### seguro (6 subcategorias)
- `vida`
- `residencial`
- `auto`
- `viagem`
- `prestamista`
- `sinistro`

### cobranca (5 subcategorias)
- `contato_indevido`
- `negativacao`
- `acordo`
- `boleto`
- `regularizacao`

### senha (5 subcategorias)
- `desbloqueio`
- `segunda_via`
- `redefinicao`
- `senha_eletronica`
- `token`

### contestacao (4 subcategorias)
- `fatura`
- `debito`
- `tarifa`
- `cobranca_indevida`

### risco (4 subcategorias)
- `analise_pf`
- `analise_pj`
- `alerta`
- `monitoramento`

### digital (5 subcategorias)
- `app`
- `internet_banking`
- `bia`
- `chat`
- `totem`

### outro (1 subcategoria)
- `geral`

---

## Schema PostgreSQL

Schema `help_core` no PostgreSQL 16 com pgvector. Duas tabelas principais para o fluxo de analise. Tabelas auxiliares para deduplicacao e reescrita.

### Tabela: `help_core.articles`

Entidade de negocio. Um registro por artigo. Chave de negocio: `source_url` (UNIQUE). Rastreia o status de processamento por pipeline.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `id` | UUID PK | Identificador interno |
| `source_url` | TEXT UNIQUE NOT NULL | Chave de negocio: `bradesco-help://{area}/{iid}` |
| `area` | TEXT | Area operacional (R1) |
| `lista` | TEXT | Nome da lista SharePoint (R2) |
| `title` | TEXT | Titulo do artigo (R3) |
| `subtitulo` | TEXT | Subtitulo (R4) |
| `nivel3` | TEXT | Nivel 3 da hierarquia (R5) |
| `iid` | TEXT | ID interno SharePoint (R6) |
| `modified_at` | TIMESTAMPTZ | Data de modificacao parseada (R7) |
| `classificacao` | TEXT | Classificacao original: TEXTUAL, LINK_ONLY, etc. (R8) |
| `source_filename` | TEXT | Nome do arquivo fonte (R12) |
| `links` | TEXT[] | URLs extraidos do artigo (R11) |
| `content_hash` | TEXT | SHA-256 do conteudo normalizado |
| `embedding` | vector(1536) | Embedding para busca semantica |
| `is_canonical` | BOOLEAN | Se e o canonico do grupo de duplicatas |
| `inventory_status` | TEXT | Status do pipeline helpcore-analysis: pending/processing/done/failed |
| `dedup_status` | TEXT | Status da deduplicacao: pending/processing/done/failed |
| `quality_status` | TEXT | Status da avaliacao de qualidade: pending/done |
| `rewrite_status` | TEXT | Status do pipeline helpcore-rewrite: not_needed/pending/done/failed |
| `pipeline_versions` | JSONB | Versao do pipeline por etapa para rastreabilidade |
| `metadata` | JSONB | Campos extras: help_name, list_url, source_area_path |
| `created_at` | TIMESTAMPTZ | Data de ingestao |
| `updated_at` | TIMESTAMPTZ | Ultima atualizacao |

### Tabela: `help_core.analysis_results`

Resultado do LLM. Um registro por artigo processado. Chave tecnica: `pe_item_id` (UNIQUE). Todos os 32 campos de output mapeados para colunas tipadas.

| Campo | Tipo | Origem |
|-------|------|--------|
| `id` | UUID PK | Gerado |
| `pe_item_id` | TEXT UNIQUE NOT NULL | ID do item no Processing Engine |
| `article_id` | UUID FK → articles | Vinculo com entidade de negocio |
| `source_url` | TEXT | Chave de negocio (item_field_mapping) |
| `doc_type` | TEXT | inventory.doc_type |
| `category` | TEXT | inventory.category |
| `subcategory` | TEXT | inventory.subcategory |
| `target_audience` | TEXT | inventory.target_audience |
| `inv_quality_score` | NUMERIC | inventory.quality_score |
| `completeness_score` | NUMERIC | inventory.completeness_score |
| `key_topics` | TEXT[] | inventory.key_topics |
| `summary` | TEXT | inventory.summary |
| `requires_update` | BOOLEAN | inventory.requires_update |
| `has_mandatory_fields` | BOOLEAN | inventory.has_mandatory_fields |
| `mandatory_fields_missing` | TEXT[] | inventory.mandatory_fields_missing |
| `estimated_word_count` | INTEGER | inventory.estimated_word_count |
| `language_issues` | TEXT[] | inventory.language_issues |
| `classification_confidence` | NUMERIC | inventory.confidence |
| `clarity` | NUMERIC | quality.clarity |
| `structure` | NUMERIC | quality.structure |
| `quality_completeness` | NUMERIC | quality.completeness |
| `accuracy_signals` | NUMERIC | quality.accuracy_signals |
| `readability` | NUMERIC | quality.readability |
| `overall_score` | NUMERIC | quality.overall_score |
| `improvement_suggestions` | TEXT[] | quality.improvement_suggestions |
| `priority_level` | TEXT | quality.priority_level |
| `estimated_effort` | TEXT | quality.estimated_effort |
| `actionable_items` | JSONB | quality.actionable_items |
| `has_internal_conflicts` | BOOLEAN | dedup_analysis.conflicting_info |
| `internal_conflict_details` | TEXT | dedup_analysis.conflict_details |
| `content_genericness` | TEXT | dedup_analysis.reason |
| `prompt_version` | TEXT | Versao do system prompt usado |
| `prompt_tokens` | INTEGER | Tokens de entrada da chamada LLM |
| `completion_tokens` | INTEGER | Tokens de saida da chamada LLM |
| `cost_usd` | NUMERIC(10,6) | Custo da chamada LLM em dolares |
| `processed_at` | TIMESTAMPTZ | Timestamp do processamento |
| `metadata` | JSONB | Campos nao mapeados (jsonb_fallback) |

Justificativa de 1 tabela consolidada em vez de 3 separadas:
1. **Atomicidade**: 1 chamada LLM = 1 INSERT. Sem risco de estado inconsistente entre tabelas.
2. **Sink simples**: O PE faz 1 INSERT/UPSERT por item sem logica condicional.
3. **Queries simples**: Visao completa de um artigo sem JOINs.
4. **Rollback natural**: Falha na chamada LLM = linha nao existe. Facil reprocessar.

### Tabelas Auxiliares

```sql
-- Grafo de relacionamentos entre artigos
CREATE TABLE help_core.article_relationships (
    id UUID PRIMARY KEY,
    source_article_id UUID REFERENCES help_core.articles(id),
    target_article_id UUID REFERENCES help_core.articles(id),
    relationship_type TEXT NOT NULL,
    similarity_score NUMERIC,
    detected_by TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grupos de duplicatas
CREATE TABLE help_core.article_clusters (
    id UUID PRIMARY KEY,
    cluster_type TEXT NOT NULL,
    canonical_id UUID REFERENCES help_core.articles(id),
    member_count INT DEFAULT 0,
    avg_similarity NUMERIC
);

-- Membros dos grupos de duplicatas
CREATE TABLE help_core.article_cluster_members (
    cluster_id UUID REFERENCES help_core.article_clusters(id),
    article_id UUID REFERENCES help_core.articles(id),
    is_canonical BOOLEAN DEFAULT false,
    similarity_to_canonical NUMERIC,
    PRIMARY KEY (cluster_id, article_id)
);

-- Resultados das reescritas
CREATE TABLE help_core.rewrites (
    id UUID PRIMARY KEY,
    article_id UUID REFERENCES help_core.articles(id),
    pe_item_id TEXT UNIQUE NOT NULL,
    rewritten_content TEXT,
    changes_summary TEXT,
    word_count_original INTEGER,
    word_count_rewritten INTEGER,
    readability_before NUMERIC,
    readability_after NUMERIC,
    sections_added TEXT[],
    sections_removed TEXT[],
    sections_modified TEXT[],
    tone_adjustments TEXT[],
    formatting_changes TEXT[],
    confidence NUMERIC,
    status TEXT DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    metadata JSONB
);
```

---

## Estimativa de Custo LLM

A consolidacao de 3 pipelines em 1 reduz o custo de tokens de entrada em ~2/3.

### Calculo de Custo por Etapa

| Etapa | Artigos | Tokens Input/Artigo | Tokens Output/Artigo | Custo Estimado |
|-------|---------|--------------------|--------------------|----------------|
| Ingestao (pre-pipeline) | 108.062 | — | — | US$ 0 |
| Embeddings (52.7K unicos) | 52.743 | ~500 | — | ~US$ 1 |
| **Pipeline helpcore-analysis** | **54.000** | **~1.800** | **~600** | **~US$ 131** |
| Pipeline helpcore-rewrite (~10%) | ~5.400 | ~2.000 | ~1.500 | Varia |
| **Total (sem rewrite)** | — | — | — | **~US$ 132** |

Notas sobre o calculo do helpcore-analysis:
- 54K artigos = ~52.7K unicos pos-hash, com margem para artigos SHORT_TEXT/ambiguos submetidos ao LLM
- ~1.800 tokens input: artigo medio (~1.200 tokens) + system prompt overhead (~600 tokens)
- ~600 tokens output: 32 campos JSON compacto
- Preco gpt-4.1-mini: input $0.40/M tokens, output $1.60/M tokens
- Custo por artigo: (1.800 × $0.40 + 600 × $1.60) / 1.000.000 ≈ $0.0024/artigo
- 54.000 × $0.0024 = **~$131**

### Comparativo com Versao Anterior (4 Pipelines)

| Pipeline | Versao 1.0 | Versao 2.0 |
|----------|-----------|-----------|
| helpcore-classify (LLM) | ~US$ 5 | Incorporado no analysis |
| helpcore-quality-score | ~US$ 52 | Incorporado no analysis |
| helpcore-analysis (novo) | — | ~US$ 131 |
| Embeddings | ~US$ 1 | ~US$ 1 |
| **Total** | **~US$ 58** | **~US$ 132** |

O custo maior na versao 2.0 reflete um output muito mais rico: 32 campos com 3 blocos de analise em vez de 9 campos flat. O custo por campo extraido caiu de ~$6.4/campo para ~$4.1/campo.

### Budget e Teto de Seguranca

| Custo | Valor |
|-------|-------|
| Estimativa base (analysis) | ~US$ 131 |
| Estimativa com rewrite (10%) | +US$ 20-50 |
| Estimativa total | ~US$ 150-180 |
| Budget maximo configurado | US$ 500/mes |
| Margem de seguranca | ~2.8x - 3.3x |

O PE interrompe automaticamente ao atingir `budget_limit_usd: 500.0`. Um dry-run de 100 artigos valida a projecao de custo antes do full run.

---

## Metricas de Sucesso

Cada objetivo tem uma metrica clara e uma meta numerica. O processamento so e considerado concluido quando todas as metas sao atingidas.

| Metrica | Meta | Descricao |
|---------|------|-----------|
| Cobertura de inventario | 100% dos 108K artigos | Todo artigo com metadados extraidos e registrado em help_core.articles |
| Duplicatas identificadas | >= 50% da base marcada | Hash + semantico + estrutural. Cada grupo com canonico eleito |
| Quality score atribuido | 100% dos TEXTUAL submetidos | overall_score com breakdown por dimensao em analysis_results |
| Classificacao validada | >= 95% de acuracia | Concordancia >= 95% em amostra auditada pela equipe |
| Custo total LLM | <= US$ 500 | Orcamento maximo incluindo margem de seguranca |
| Tempo de processamento | <= 7 dias | Full run completo com rate limiting e monitoramento |
| Artigos candidatos a reescrita | Identificados e priorizados | Lista de artigos com overall_score < 70 por priority_level |

---

## Gestao de Riscos

| Risco | Severidade | Mitigacao |
|-------|------------|-----------|
| Dedup False-Positives | Alta | Validacao com amostra de 1.000 artigos antes do full run. Threshold conservador (0.95 para merge automatico). |
| Custo LLM excede orcamento | Media | Dry-run de 100 artigos para extrapolar custo real. Budget_limit_usd = $500 interrompe pipeline automaticamente. |
| Encoding de nomes de pasta | Media | Detector automatico (chardet). Fallback chain: UTF-8 → CP1252 → Latin-1. Log de conversoes. |
| Artigos sem conteudo processavel | Baixa | EMPTY_OR_ORPHAN e MEDIA catalogados com metadados mas sem score. Flag especial: inventory_status = 'skipped'. |
| Vazamento de conteudo | Baixa | Zero logging de conteudo em plaintext. .gitignore para diretorio de dados. Revisao de seguranca antes do full run. |
| Performance do pgvector | Baixa | Indice HNSW (m=16) ja especificado. Benchmark com 10K artigos. IVFFlat como fallback se HNSW for lento. |
| Schema mismatch no sink | Baixa | Validator de schema no PE rejeita itens com output malformado antes do INSERT. Itens rejeitados ficam em status failed para reprocessamento. |
| Artigos com titulo NULL | Media | Cascata de fallbacks no sink: titulo → subtitulo → summary[:120] → "Sem titulo". Nunca insere NULL em coluna NOT NULL. |

---

## Distribuicao por Tipo de Conteudo

A classificacao preliminar por heuristica mostra a composicao da base. O pipeline de ingestao recalcula e valida cada classificacao.

| Tipo | Quantidade | Percentual | Observacao |
|------|-----------|------------|------------|
| TEXTUAL | 48.363 | 44.8% | Artigos com conteudo textual substancial. Submetidos ao pipeline LLM. |
| Nao classificados | 54.221 | 50.2% | Sem classificacao heuristica definitiva. Submetidos ao pipeline LLM para classificacao. |
| LINK_ONLY | 2.240 | 2.1% | Apenas links internos. Metadados extraidos, sem LLM. |
| SHORT_TEXT | 1.790 | 1.7% | Texto muito curto (< 50 palavras). Submetidos ao LLM apenas para classificacao. |
| EMPTY_OR_ORPHAN + MEDIA | 1.638 | 1.5% | Sem conteudo processavel. Catalogados sem LLM. |
| **Total** | **108.062** | **100%** | |

Artigos submetidos ao LLM (helpcore-analysis): ~54K (TEXTUAL + Nao classificados + SHORT_TEXT com ambiguidade).

---

## Plano de Execucao

O processamento segue uma sequencia estruturada. Validacao com amostra pequena antes do full run para garantir qualidade e controlar custos.

| Fase | Acao | Detalhes |
|------|------|---------|
| 1 | Dry-run com 100 artigos | Amostra representativa (distribuida por area e tipo). Valida pipeline completo, mede custo real, calibra thresholds. Estimativa: 1-2 horas. |
| 2 | Validacao humana da amostra | Revisao dos 100 artigos processados: metadados corretos, classificacao coerente, scores justos. Aval da equipe Ello antes do full run. |
| 3 | Ingestao completa (pre-pipeline) | Leitura de 108K arquivos TXT. Persistencia em help_core.articles. Estimativa: 2-4 horas. |
| 4 | Deduplicacao (pre-pipeline) | Hash SHA-256 sobre 100% da base. Embeddings para ~52.7K unicos. SimHash/MinHash para residuais. Estimativa: 4-8 horas. |
| 5 | Full run: pipeline helpcore-analysis | Processamento LLM dos ~54K artigos unicos. Estimativa: 24-48 horas com rate limiting. Monitoramento em tempo real. |
| 6 | Pipeline helpcore-rewrite (sob demanda) | Reescrita dos artigos com overall_score < 70. Acionado apos revisao e aprovacao da equipe. |
| 7 | Relatorio de inventario e entrega | Consolidacao dos resultados. Base pronta para as proximas etapas do HELP CORE. |

Nota sobre a fase 5: o pipeline `helpcore-analysis` e a versao consolidada. Substitui as antigas fases de classificacao e quality score, reduzindo a sequencia de 4 passos para 1 pipeline LLM com output mais rico.

---

## Resultados Esperados

Ao final do processamento, a equipe de conteudo recebe um inventario completo e acionavel. E a base para todas as etapas seguintes do HELP CORE.

| Entregavel | Descricao |
|------------|-----------|
| **Inventario Completo** | 108K artigos com metadados estruturados: area, titulo, classificacao, status, data de modificacao e path original em help_core.articles. |
| **Analise de Qualidade** | 32 campos por artigo em help_core.analysis_results: inventario (14), qualidade multi-dimensional (10) e analise de deduplicacao intra-artigo (8). |
| **Fila de Revisao Priorizada** | Artigos ordenados por priority_level (critical > high > medium > low) com actionable_items concretos para a equipe editorial. |
| **Mapa de Duplicatas** | Grupos de duplicatas exatas (hash) e semanticas (pgvector). Artigo canonico identificado em cada grupo. Economia na revisao. |
| **Candidatos a Reescrita** | Lista de artigos com overall_score < 70, com estimated_effort e improvement_suggestions para planejamento da equipe. |
| **Relatorio de Inventario** | Total por area, por classificacao, distribuicao de overall_score, artigos com conflitos internos, artigos desatualizados. Pronto para decisao executiva. |

---

## Metadados do Documento

| Campo | Valor |
|-------|-------|
| Projeto | HELP CORE |
| Cliente | Bradesco (via Ello Consultoria) |
| Tecnologia | Processing Engine (Digital AI) |
| Data | Outubro 2026 |
| Versao | 2.0 |
| Alteracoes v2.0 | Consolidacao de 4 pipelines em 2 (1 consolidado + 1 reescrita). 32 campos em 3 blocos vs 9 campos flat. Schema de banco atualizado (articles + analysis_results). 15 campos raw do SharePoint documentados. System prompt unificado. YAML completo do helpcore-analysis. Auditoria PE Sprint 1+2: 10 fixes aplicados. |
