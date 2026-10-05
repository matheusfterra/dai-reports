# Help File Processor - Processamento Inteligente de Base de Conhecimento

> Documentacao tecnica completa do pipeline de processamento IA para a base HELP do Bradesco.
> Projeto HELP CORE, operado pela Ello Consultoria com tecnologia Digital AI.

---

## Sumario

1. [O Desafio](#o-desafio)
2. [Arquitetura do Processing Engine](#arquitetura-do-processing-engine)
3. [4 Pipelines Sequenciais](#4-pipelines-sequenciais)
4. [Estrategia de Deduplicacao](#estrategia-de-deduplicacao)
5. [Configuracao da Inteligencia Artificial](#configuracao-da-inteligencia-artificial)
6. [Arvore de Categorias e Subcategorias](#arvore-de-categorias-e-subcategorias)
7. [Motor de Processamento (Parametros do Pipeline)](#motor-de-processamento)
8. [Campos Recomendados pelo PM (Proxima Fase)](#campos-recomendados-pelo-pm)
9. [Metricas de Sucesso](#metricas-de-sucesso)
10. [Schema PostgreSQL](#schema-postgresql)
11. [Estimativa de Custo LLM](#estimativa-de-custo-llm)
12. [Gestao de Riscos](#gestao-de-riscos)
13. [Resultados Esperados](#resultados-esperados)
14. [Distribuicao por Tipo de Conteudo](#distribuicao-por-tipo-de-conteudo)
15. [Plano de Execucao](#plano-de-execucao)

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

Motor de processamento agnostico, configuravel via YAML, que orquestra ingestao, deduplicacao, analise por LLM e persistencia. Tudo em pipelines paralelos e resilientes.

```
Filesystem (218.612 arquivos, 108K pares HTML+TXT, 1.4 GB, 26 areas)
    |
    v
Processing Engine (Pipeline configuravel via YAML, Workers com SKIP LOCKED, Rate limiting)
    |
    +-- Ingestor (HTML + TXT parsing)
    +-- Dedup (Hash + Semantico)
    +-- LLM (gpt-4.1-mini)
    |
    +-- Validators (Schema + Grounding)
    +-- Sink (PostgreSQL + pgvector)
    |
    v
Inventario Estruturado (Artigos limpos, classificados, deduplicados, com quality score)
```

---

## 4 Pipelines Sequenciais

Cada pipeline e uma etapa independente do processamento, configurada em YAML e executada pelo Processing Engine. Resultados de um pipeline alimentam o seguinte.

### Pipeline 1: helpcore-ingest (Ingestao)

- **Funcao**: Le o filesystem recursivamente, pareia cada HTML com seu TXT pelo nome do arquivo, extrai metadados estruturados e limpa o markup pesado do SharePoint.
- **Etapas**: Leitura recursiva → Pareamento HTML+TXT → Parse metadados → Limpeza HTML → Deteccao encoding
- **Output**: 108K registros com metadados estruturados e conteudo limpo no PostgreSQL

### Pipeline 2: helpcore-dedup (Deduplicacao)

- **Funcao**: Identifica duplicatas exatas via hash SHA-256 do conteudo normalizado e duplicatas semanticas via embeddings pgvector com threshold configuravel.
- **Etapas**: Hash SHA-256 → Embedding (text-embedding-3-small) → Cosine similarity → Agrupamento
- **Output**: Grupos de duplicatas e flags canonico/duplicata. Threshold >= 0.92

### Pipeline 3: helpcore-classify (Classificacao)

- **Funcao**: Valida e recalcula a classificacao de cada artigo. Heuristicas primeiro para casos claros. LLM so para ambiguos (cerca de 10% do total).
- **Etapas**: Heuristica (EMPTY, LINK_ONLY, SHORT_TEXT, MEDIA) → LLM para ambiguos → Delta report
- **Output**: Classificacao validada para 100% dos artigos e relatorio de divergencias

### Pipeline 4: helpcore-quality-score (Quality Score)

- **Funcao**: Gera score de qualidade (0-100) para cada artigo TEXTUAL avaliando 5 dimensoes: completude, clareza, atualidade, formatacao e aderencia ao publico-alvo.
- **Etapas**: Filtro: apenas TEXTUAL (48K) → LLM gpt-4.1-mini → Score e breakdown
- **Output**: Score 0-100 e breakdown por dimensao para 48.363 artigos TEXTUAL

---

## Estrategia de Deduplicacao

A analise preliminar revelou que mais da metade da base e composta por duplicatas exatas. A estrategia em tres camadas garante deteccao maxima com custo minimo de processamento.

### Descoberta Inicial

- **51.2% da base sao duplicatas exatas** (~55.319 artigos com hash identico)
- **48.8% sao artigos unicos a processar** (~52.743 artigos)
- Dos ~52.7K unicos, uma parcela adicional tera duplicatas semanticas detectadas pela Camada 2 (embeddings). Estimativa: 5-10% adicionais com similaridade >= 0.95.

### Camada 1: Hash SHA-256 (Duplicatas Exatas)

- **Tecnica**: Normalizacao NFC + lowercase + whitespace collapse antes do hash
- **Resultado**: Identificacao deterministica, custo zero (nenhuma chamada LLM)
- **Duplicatas esperadas**: ~55.000
- **Etiquetas tecnicas**: NFC normalize, lowercase, whitespace collapse, SHA-256, deterministico, custo zero

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
- Area "Suporte": "Cartao de Credito: limite e fatura" → **Canonico**
- Area "FAQ": "Cartao de Credito: limite e fatura" → **Duplicata**
- Area "Produtos": "Cartao de Credito: limite e fatura" → **Duplicata**

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
-- Tabela: article_relationships
CREATE TABLE article_relationships (
    id UUID PRIMARY KEY,
    source_article_id UUID REFERENCES articles(id),
    target_article_id UUID REFERENCES articles(id),
    relationship_type TEXT, -- exact_duplicate, semantic_duplicate, structural_duplicate, cross_area_link, references, supersedes
    similarity_score NUMERIC,
    detected_by TEXT, -- hash, embedding, simhash, crawler, llm
    metadata JSONB
);

-- Tabela: article_clusters
CREATE TABLE article_clusters (
    id UUID PRIMARY KEY,
    cluster_type TEXT,
    canonical_id UUID REFERENCES articles(id),
    member_count INT,
    avg_similarity NUMERIC
);

-- Tabela: article_cluster_members
CREATE TABLE article_cluster_members (
    cluster_id UUID REFERENCES article_clusters(id),
    article_id UUID REFERENCES articles(id),
    is_canonical BOOLEAN DEFAULT false,
    similarity_to_canonical NUMERIC,
    PRIMARY KEY (cluster_id, article_id)
);
```

### Sequencia de Execucao Recomendada

| Fase | Camada | Acao |
|------|--------|------|
| 1 | Hash SHA-256 | Executar sobre 100% da base. Custo zero. Remove ~55K duplicatas exatas. |
| 2 | Embeddings | Gerar embeddings para os ~52.7K unicos. Indexar com HNSW. Buscar vizinhos. |
| 3 | SimHash/MinHash | Executar sobre artigos que passaram pela Camada 2 sem match. |
| 4 | Revisao humana | Artigos na zona cinzenta (0.92-0.95) vao para revisao manual assistida. |

---

## Configuracao da Inteligencia Artificial

Como o motor de IA ve e analisa cada artigo: os 9 campos extraidos por passagem, os parametros do pipeline e os campos adicionais recomendados pelo PM para a proxima fase.

### 9 Campos Extraidos por Artigo

#### 1. `doc_type` - Tipo do Documento

- **Descricao**: Classifica o formato estrutural do artigo: procedimento, passo a passo, checklist, FAQ, referencia, politica.
- **Utilidade**: Filtrar artigos por formato na busca. Identificar areas com excesso de "outros" (sinal de artigos mal estruturados).
- **Valores possiveis**: `procedimento`, `passo_a_passo`, `checklist`, `faq`, `referencia`, `politica`, `outro`
- **Exemplo real**: `"passo_a_passo"` - Artigo "Abertura de Atendimento" (Alto Valor)

#### 2. `category` - Categoria Tematica

- **Descricao**: Identifica o tema operacional central: a qual produto, servico ou processo bancario o conteudo se refere.
- **Utilidade**: Mapear quais categorias tem mais artigos (redundancia) e quais tem menos (lacunas na base).
- **Valores possiveis**: `cancelamento`, `bloqueio`, `credito`, `fraude`, `cadastro`, `contestacao`, `cartao`, `pix`, `transferencia`, `emprestimo`, `investimento`, `seguro`, `conta`, `atendimento`, `cobranca`, `senha`, `risco`, `digital`, `outro`
- **Exemplo real**: `"cobranca"` - Artigo "Contatos Indevidos de Cobranca"

#### 3. `subcategory` - Subcategoria Especifica

- **Descricao**: Detalha a categoria em nivel granular, criando uma arvore de classificacao hierarquica. Permite analises por subarea sem perder a visao macro.
- **Utilidade**: Filtrar artigos por subarea dentro de cada categoria. Encontrar sobreposicoes entre subcategorias de areas distintas. Medir cobertura por processo especifico.
- **Exemplo real**: `"segunda_via"` dentro de cartao, ou `"phishing"` dentro de fraude
- **Arvore completa**: ver secao [Arvore de Categorias e Subcategorias](#arvore-de-categorias-e-subcategorias)

#### 4. `target_audience` - Publico-Alvo

- **Descricao**: Define a quem o artigo se destina: operador, supervisor, tecnico, cliente ou multiplo.
- **Utilidade**: Garantir que artigos de supervisor nao aparecam no treinamento de novos operadores. Auditar cobertura de escalacao.
- **Valores possiveis**: `operador`, `supervisor`, `tecnico`, `cliente`, `multiplo`
- **Exemplo real**: `"operador"` - Artigo com script de atendimento e roteiro de fala

#### 5. `quality_score` - Qualidade Textual (0-100)

- **Descricao**: Nota de 0 a 100 que mede clareza das instrucoes, organizacao logica e linguagem profissional.
- **Utilidade**: Priorizar fila de revisao editorial. Artigos abaixo de 60 entram na lista de reescrita urgente.
- **Faixas de score**:
  - `80-100`: Pronto para uso (verde)
  - `60-79`: Pequenos ajustes (amarelo)
  - `40-59`: Revisao necessaria (laranja)
  - `0-39`: Reescrita urgente (vermelho)
- **Exemplo real**: `82` - Artigo bem estruturado com passos numerados

#### 6. `completeness_score` - Completude (0-100)

- **Descricao**: Avalia se o artigo contem todas as informacoes necessarias para o operador executar sem duvidas.
- **Utilidade**: Distingue artigos bem-escritos-mas-incompletos de artigos completos-mas-mal-redigidos. Priorizar complementacao antes da migracao.
- **Diferenca para quality_score**: `quality_score` = "esta bem escrito?", `completeness_score` = "esta completo?"
- **Exemplo real**: `68` - Define regras gerais mas nao cobre cenario de sistema indisponivel

#### 7. `key_topics` - Topicos Principais (3-8)

- **Descricao**: Lista de palavras-chave que capturam temas centrais: sistemas, tipos de cliente, produtos e excecoes.
- **Tipo**: `array[string]`, 3-8 items, sem stopwords
- **Utilidade**: Busca semantica por tags. Identificar artigos com mesmos topicos em areas diferentes (duplicatas de conteudo cross-category).
- **Exemplo real**: `["2a via senha", "cartao", "titular", "procurador", "Alto Valor"]`

#### 8. `summary` - Resumo Factual

- **Descricao**: Resumo objetivo em 1-2 frases descrevendo o que o artigo ensina. Escrito sem jargao, capturando a essencia operacional.
- **Utilidade**: Preview em resultados de busca. Identificar artigos com mesmo resumo (duplicatas). Inventario legivel sem abrir cada artigo.
- **Formato**: 1-2 frases, sem jargao, factual
- **Exemplo real**: "Orienta o operador sobre como responder a clientes insatisfeitos com ligacoes de cobranca indevida, direcionando para atualizacao cadastral e registro no SACL."

#### 9. `requires_update` - Necessidade de Atualizacao

- **Descricao**: Flag que indica se o artigo apresenta indicios de desatualizacao: datas antigas, sistemas obsoletos, links quebrados.
- **Tipo**: `boolean`
- **Utilidade**: Lista automatica de artigos candidatos a revisao prioritaria. Cruzar com data de modificacao para risco composto.
- **Valores**: `false` (atualizado), `true` (revisar)
- **Exemplo real**: `true` - Artigo com referencia "conforme sistema vigente ate 2023"

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

## Motor de Processamento

Parametros do pipeline YAML (`helpcore-inventory.yaml`) que controlam o comportamento do Processing Engine.

### Modelo de IA

| Parametro | Valor | Significado |
|-----------|-------|-------------|
| `llm_provider` | openai | Provedor de LLM utilizado |
| `llm_model` | gpt-4.1-mini | Modelo otimizado para custo/velocidade |
| `llm_temperature` | 0.0 | Deterministico (sem criatividade, maximo de consistencia) |
| `llm_max_tokens` | 8.192 | Espaco maximo para resposta do LLM |

### Deduplicacao e Cache

| Parametro | Valor | Significado |
|-----------|-------|-------------|
| `dedup_strategy` | hash | Estrategia primaria de deduplicacao |
| `url_normalize` | true | Normaliza URLs antes de comparar (remove parametros, trailing slash) |
| `cache.enabled` | true | Resultados anteriores reutilizados para economia |
| `cache.ttl_hours` | 720 | Cache valido por 30 dias (artigos nao mudam frequentemente) |

### Performance

| Parametro | Valor | Significado |
|-----------|-------|-------------|
| `max_concurrent` | 5 | 5 artigos processados em paralelo |
| `rate_limit_rpm` | 60 | Maximo 60 chamadas LLM por minuto (seguranca de custo) |
| `max_retries` | 2 | Ate 2 tentativas em caso de erro (evita loops de custo) |

### Controle de Custo

| Parametro | Valor | Significado |
|-----------|-------|-------------|
| `budget_limit_usd` | 100.00 | Teto de gasto mensal em dolares (pipeline para automaticamente ao atingir) |
| `budget_period` | month | Periodo de contagem do budget |

### Sink (Destino dos Dados)

| Parametro | Valor | Significado |
|-----------|-------|-------------|
| `sink_type` | postgresql | Banco de dados destino |
| `table` | help_core.inventory | Tabela de inventario no schema help_core |
| `conflict_column` | pe_item_id | Coluna de conflito para upsert (evita duplicatas no banco) |
| `jsonb_fallback` | metadata | Campos nao mapeados vao para coluna JSONB generica |

### Column Mapping (Mapa de Colunas)

Campos do output da IA mapeados para colunas tipadas no PostgreSQL:

| Campo IA | Coluna PostgreSQL |
|----------|-------------------|
| `doc_type` | `doc_type` |
| `category` | `category` |
| `subcategory` | `subcategory` |
| `target_audience` | `target_audience` |
| `quality_score` | `quality_score` |
| `completeness_score` | `completeness_score` |

Campos **nao mapeados** (`key_topics`, `summary`, `requires_update`) caem no JSONB generico `metadata`.

---

## Campos Recomendados pelo PM (Proxima Fase)

Campos identificados pelo Product Manager como valiosos para a segunda iteracao do pipeline. Nao estao no pipeline atual, mas estao planejados.

### `area_operacional` - Area Organizacional

- **Descricao**: Mapeia o artigo para a area real da organizacao (ex: Central de Atendimento, Agencia, Retaguarda, Digital). Diferente de `category` (tematico), foca na estrutura organizacional.
- **Utilidade**: Permite filtrar a base por divisao interna do Bradesco.

### `complexity_level` - Nivel de Complexidade

- **Descricao**: Classifica em `basico`, `intermediario` ou `avancado` conforme a experiencia necessaria para aplicar o procedimento.
- **Utilidade**: Montagem automatica de trilhas de treinamento por senioridade.

### `mentions_systems` - Sistemas Mencionados

- **Descricao**: Lista de sistemas internos do Bradesco citados no artigo (ex: SACL, SFN, Bradesco Net Empresa).
- **Utilidade**: Quando um sistema muda de versao, encontrar todos os artigos impactados instantaneamente.

### `escalation_present` - Contem Escalacao

- **Descricao**: Flag boolean indicando se o artigo contem procedimento de escalacao (transferencia para supervisor, ouvidoria, canal especializado).
- **Utilidade**: Garantir que toda escalacao documentada na base esta no mapa de atendimento.

---

## Metricas de Sucesso

Cada objetivo tem uma metrica clara e uma meta numerica. O processamento so e considerado concluido quando todas as metas sao atingidas.

| Metrica | Meta | Descricao |
|---------|------|-----------|
| Cobertura de inventario | 100% dos 108K artigos | Todo artigo com metadados extraidos e registrado no PostgreSQL |
| Duplicatas identificadas | >= 50% da base marcada | Hash + semantico + estrutural. Cada grupo com canonico eleito |
| Quality score atribuido | 100% dos TEXTUAL (48K) | Score 0-100 com breakdown por dimensao |
| Classificacao validada | >= 95% de acuracia | Heuristica + LLM. Concordancia >= 95% em amostra auditada |
| Custo total LLM | <= US$ 500 | Orcamento maximo incluindo margem de seguranca |
| Tempo de processamento | <= 7 dias | Full run completo com rate limiting e monitoramento |

---

## Schema PostgreSQL

Tres tabelas estruturadas em PostgreSQL 16 com pgvector habilitado para buscas semanticas. Todos os dados ficam na infraestrutura interna.

### Tabela: `articles`

Tabela principal. Um registro por artigo (108K registros).

| Campo | Tipo |
|-------|------|
| `id` | UUID PK |
| `file_path` | TEXT |
| `area` / `subpasta` | TEXT |
| `titulo` / `subtitulo` | TEXT |
| `content_raw` | TEXT |
| `content_clean` | TEXT |
| `content_hash` | TEXT |
| `embedding` | vector(1536) |
| `classification_validated` | TEXT |
| `quality_score` | NUMERIC |
| `quality_breakdown` | JSONB |
| `is_canonical` | BOOLEAN |

### Tabela: `dedup_groups`

Grupos de artigos duplicados (exatos ou semanticos).

| Campo | Tipo |
|-------|------|
| `id` | UUID PK |
| `dedup_type` | TEXT |
| `similarity` | NUMERIC |
| `member_count` | INT |
| `canonical_id` | UUID FK → articles |

### Tabela: `article_links`

Links encontrados em artigos LINK_ONLY.

| Campo | Tipo |
|-------|------|
| `id` | UUID PK |
| `article_id` | UUID FK → articles |
| `url` | TEXT |
| `status` | TEXT |
| `checked_at` | TIMESTAMP |

---

## Estimativa de Custo LLM

Todas as etapas usam gpt-4.1-mini para otimizar custo. Um dry-run de 100 artigos valida a projecao antes do processamento completo.

| Pipeline | Custo Estimado | Detalhes |
|----------|---------------|----------|
| Classificacao | ~US$ 5 | ~10.800 artigos ambiguos, ~800 tokens input/artigo, ~100 tokens output/artigo |
| Quality Score | ~US$ 52 | 48.363 artigos TEXTUAL, ~1.500 tokens input/artigo, ~300 tokens output/artigo |
| Embeddings | ~US$ 1 | ~52.7K artigos unicos, text-embedding-3-small, ~500 tokens/artigo |
| **Total Estimado** | **~US$ 58** | Orcamento maximo: US$ 500. Margem de seguranca: 8.6x |

---

## Gestao de Riscos

Cada risco identificado tem uma mitigacao planejada. Nenhum risco e ignorado.

| Risco | Severidade | Mitigacao |
|-------|------------|-----------|
| Dedup False-Positives | Alta | Bug do PE corrigido e testado ANTES do pipeline. Validacao com amostra de 1.000 artigos antes do full run. |
| Custo LLM excede orcamento | Media | Dry-run de 100 artigos para extrapolar custo real. Heuristicas primeiro. LLM so para ambiguos (~10%). |
| Encoding de nomes de pasta | Media | Detector automatico de encoding (chardet). Fallback chain: UTF-8 → CP1252 → Latin-1. Log de conversoes. |
| Artigos sem conteudo processavel | Baixa | EMPTY_OR_ORPHAN (1.350) e MEDIA (288) catalogados com metadados mas sem score. Flag especial no schema. |
| Vazamento de conteudo | Baixa | Zero logging de conteudo em plaintext. .gitignore para diretorio de dados. Revisao de seguranca antes do full run. |
| Performance do pgvector | Baixa | Indice HNSW (m=16) ja especificado. Benchmark com 10K artigos. IVFFlat como fallback se HNSW for lento. |

---

## Resultados Esperados

Ao final do processamento, a equipe de conteudo recebe um inventario completo e acionavel. E a base para todas as etapas seguintes do HELP CORE.

| Entregavel | Descricao |
|------------|-----------|
| **Inventario Completo** | 108K artigos com metadados estruturados: area, titulo, classificacao, status, data de modificacao e path original. |
| **Conteudo Limpo** | HTML livre do markup SharePoint. Estrutura semantica preservada: headings, listas, paragrafos, links e tabelas de dados. |
| **Mapa de Duplicatas** | Grupos de duplicatas exatas (hash) e semanticas (pgvector). Artigo canonico identificado em cada grupo. Economia na revisao. |
| **Classificacao Validada** | Cada artigo com classificacao final (TEXTUAL, LINK_ONLY, SHORT_TEXT, EMPTY, MEDIA). Delta vs classificacao original reportado. |
| **Quality Score** | Score 0-100 para 48K artigos TEXTUAL com breakdown: completude, clareza, atualidade, formatacao e aderencia ao publico. |
| **Relatorio de Inventario** | Total por area, por classificacao, duplicatas encontradas, distribuicao de quality score e artigos com erro. Pronto para decisao. |

---

## Distribuicao por Tipo de Conteudo

A classificacao preliminar por heuristica mostra a composicao da base. O pipeline recalcula e valida cada classificacao.

| Tipo | Quantidade | Percentual |
|------|-----------|------------|
| TEXTUAL | 48.363 | 44.8% |
| Outros (nao classificados) | 54.221 | 50.2% |
| LINK_ONLY | 2.240 | 2.1% |
| SHORT_TEXT | 1.790 | 1.7% |
| EMPTY_OR_ORPHAN + MEDIA | 1.638 | 1.5% |
| **Total** | **108.062** | **100%** |

---

## Plano de Execucao

O processamento segue uma sequencia estruturada. Validacao com amostra pequena antes do full run para garantir qualidade e controlar custos.

| Fase | Acao | Detalhes |
|------|------|---------|
| 1 | Corrigir bug de dedup do PE | Fix de false-positives na deduplicacao semantica. Validacao com testes unitarios e integracao. |
| 2 | Dry-run com 100 artigos | Amostra representativa para validar pipeline completo, medir custo real e calibrar thresholds. |
| 3 | Validacao humana da amostra | Revisao dos 100 artigos processados: metadados corretos, HTML limpo, classificacao coerente, score justo. |
| 4 | Full run: 108K artigos | Processamento completo da base. Estimativa: <= 48 horas com rate limiting. Monitoramento em tempo real. |
| 5 | Relatorio de inventario e entrega | Consolidacao dos resultados em relatorio estruturado. Base pronta para as proximas etapas do HELP CORE. |

---

## Configuracao YAML Completa (Referencia Tecnica)

```yaml
id: helpcore-inventory
name: helpcore-inventory
description: >
  Classificacao e inventario de artigos da base de conhecimento Help Bradesco.
  Extrai tipo, categoria, publico-alvo, qualidade textual e metadados.

ingestor_type: auto
dedup_strategy: hash
dedup_config:
  url_normalize: true

llm_provider: openai
llm_model: gpt-4.1-mini
llm_temperature: 0.0
llm_max_tokens: 8192

output_schema:
  type: object
  required: [doc_type, category, subcategory, target_audience, quality_score, completeness_score, key_topics, summary, requires_update]
  additionalProperties: false
  properties:
    doc_type:
      type: string
      enum: [procedimento, passo_a_passo, checklist, faq, referencia, politica, outro]
    category:
      type: string
    subcategory:
      type: string
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
    summary:
      type: string
    requires_update:
      type: boolean

validators: [schema]

sink_type: postgresql
sink_config:
  database_url_env: VOTOLIMPO_DATABASE_URL
  table: help_core.inventory
  conflict_column: pe_item_id
  column_mapping:
    doc_type: doc_type
    category: category
    subcategory: subcategory
    target_audience: target_audience
    quality_score: quality_score
    completeness_score: completeness_score
  item_field_mapping:
    source_url: source_url
    titulo: title
  jsonb_fallback: metadata

max_concurrent: 5
rate_limit_rpm: 60
max_retries: 2
budget_limit_usd: 100.0
budget_period: month
cache:
  enabled: true
  ttl_hours: 720
```

---

## Metadados do Documento

| Campo | Valor |
|-------|-------|
| Projeto | HELP CORE |
| Cliente | Bradesco (via Ello Consultoria) |
| Tecnologia | Processing Engine (Digital AI) |
| Data | Outubro 2026 |
| Versao | 1.0 |
