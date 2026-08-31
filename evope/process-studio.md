# Process Studio — Documentacao Tecnica (Referencia para IAs)

> **Ultima atualizacao:** 2026-08-31
> **URL da documentacao visual:** https://reports.digital-ai.tech/evope/process-studio
> **Repositorio:** https://github.com/DIGITAL-AI-TECH/process-studio (privado)
> **Identificador:** `tech.digitalai.process-studio`
> **Status:** Em desenvolvimento (v0.1.0)

---

## Resumo

App desktop Windows **100% local e individual** (Tauri v2) que grava, documenta e (futuramente) re-executa processos de trabalho no browser. Desenvolvido pela Digital AI.

**Posicionamento:** "Uma Scribe que executa." A Scribe (US$ 1,3 bi) lidera documentacao automatica de processos mas so documenta, nunca re-executa. O Process Studio fecha essa lacuna com replay deterministico + self-healing por LLM (fases futuras F2/F3).

---

## Funcionalidades Atuais

### 1. Gravacao de Browser (via CDP)
- Conecta ao Chrome do usuario via Chrome DevTools Protocol (CDP)
- Cria perfil isolado para o Chrome (auto-deteccao e relancamento automatico quando a porta CDP morre)
- Captura por evento: clicks, digitacao, navegacao, screenshots
- Captura requisicoes de rede correlacionadas — cada request carrega `afterStepSeq` para rastreabilidade
- Trace salvo em NDJSON append-only (nunca alterado apos fechado)

### 2. Gravacao de Tela Nativa
- Usa ffmpeg empacotado (`gdigrab` + `dshow` — Windows)
- Selecao de monitor e microfone na UI
- Pilula flutuante com tempo decorrido clicavel
- Borda vermelha `WDA_EXCLUDEFROMCAPTURE` no monitor gravado (exclui da captura da propria tela)
- Saida em `.mkv` local
- Recuperacao de gravacoes orfas apos crash no boot

### 3. Documentacao Automatica por IA (F1)
- Botao "Documentar" compila o trace em `workflow.json` + documento estruturado
- GPT-4.1-mini com structured outputs estritos — zero invencao de dados
- Fatos tecnicos (seletores, URLs, valores, tempos) vem 100% do trace
- `stripSecrets()` remove dados sensiveis antes de qualquer prompt de LLM
- Documento final exportavel em Markdown, HTML autocontido e PDF (Chrome headless)
- Log auditavel com tokens e custo USD por compilacao

### 4. Documentacao por Video Local (FV)
- Aceita qualquer video local: `.mp4 .mkv .webm .mov .avi`
- Extracao local de frames + audio com ffmpeg
- Transcricao via Whisper-1 (OpenAI)
- Chamadas de visao em janelas — suporta videos longos (ate 120 min)
- Aviso de privacidade obrigatorio com confirmacao antes de qualquer upload

### 5. Exportacao
- Sem LLM na exportacao (apenas na compilacao)
- `doc.json` -> Markdown (+ pasta de assets)
- HTML autocontido (imagens em data-URI, destaques proporcionais)
- PDF A4 renderizado por Chrome headless

### 6. Interface (4 abas)
- **Gravacoes:** traces NDJSON com visualizador paginado
- **Processos:** docs compilados, exportacao, gravador de tela
- **Config:** chave OpenAI, path do Chrome, porta CDP, retencao, video
- **Historico:** logs de compilacoes com custo
- Bandeja do sistema: fechar a janela minimiza para tray

---

## Arquitetura

```
Tauri v2 (Rust) — janela principal, tray, overlays
  |
  | JSON-RPC (NDJSON via stdio)
  |
  +-- Sidecar Node 20 + Playwright (exe via pkg)
  |     chrome-connect  -> CDP no Chrome isolado
  |     capture-store   -> traces NDJSON
  |     compiler        -> GPT-4.1-mini (browser)
  |     video-compiler  -> Whisper + GPT-4.1-mini
  |     exporter        -> md / html / pdf
  |     screen-recorder -> ffmpeg empacotado
  |
  +-- UI React + Vite (sem router; abas por estado)
  |
  +-- Chrome do usuario (perfil isolado, CDP)
  +-- API OpenAI (unica saida de dados)
```

### Camadas

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Shell | Tauri v2 (Rust) | Janela, tray, overlays de gravacao, supervisor do sidecar, comandos FS |
| Sidecar | Node.js 20 + Playwright 1.59.1 | CDP, gravacao, compilacao IA, exportacao, gravador de tela |
| UI | React 18 + Vite | Interface das 4 abas |
| IA | OpenAI GPT-4.1-mini + Whisper-1 | Compilacao de documentos e transcricao |
| Dados | Arquivos locais (NDJSON + JSON) | Sem banco de dados |
| Midia | ffmpeg LGPL empacotado | Gravacao de tela e extracao de frames/audio |

### Comunicacao Shell <-> Sidecar
- Protocolo: JSON-RPC via NDJSON pelo stdio
- Sidecar empacotado como `.exe` com `@yao-pkg/pkg`
- Playwright pinado em 1.59.1 (versao estavel + compativel com pkg)
- Supervisor com backoff exponencial (max. 3 crashes antes de alertar)

---

## Stack Tecnica Completa

### Shell (Rust / Tauri v2)

| Arquivo | Tamanho | Funcao |
|---|---|---|
| `captures.rs` | 40KB | Comandos FS de capturas |
| `sidecar.rs` | 23KB | Supervisor + protocolo RPC |
| `chrome_detect.rs` | 11KB | Deteccao e relancamento do Chrome |
| `workflows.rs` | 10KB | Gerenciamento de workflows |
| `recordings.rs` | 10KB | Gravacoes de tela |
| `main.rs` | 10KB | Entry point, setup Tauri |
| `tray.rs` | 3KB | Bandeja do sistema |
| `storage.rs` | 1KB | Settings |

Dependencias Rust principais: `tauri 2` (plugins: tray-icon, store, shell, notification, dialog), `windows-sys`, `tokio`, `serde`, `serde_json`, `tracing`, `chrono`, `base64`, `zip`, `rand`

### Sidecar (Node.js)

| Arquivo | Tamanho | Funcao |
|---|---|---|
| `playwright-actions.js` | 60KB | Principal — gravacao CDP |
| `compiler.js` | 19KB | Trace -> doc estruturado (GPT-4.1-mini) |
| `video-compiler.js` | 18KB | Video -> doc estruturado (Whisper + GPT visao) |
| `index.js` | 16KB | Entry point + dispatcher RPC |
| `capture-store.js` | 12KB | Gerenciamento de traces NDJSON |
| `exporter.js` | 11KB | doc.json -> md/html/pdf |
| `screen-recorder.js` | 10KB | Gravacao de tela via ffmpeg |
| `openai-client.js` | 7KB | Cliente OpenAI com retry |
| `ffmpeg.js` | 5KB | Wrapper ffmpeg |
| `chrome-connect.js` | 4KB | Conexao CDP |
| `workflow-store.js` | 4KB | Persistencia de workflows |
| `action-cache.js` | 1KB | Cache de acoes |

Assets empacotados com pkg: `playwright-core/browsers.json`, `compile-result.schema.json`, `video-compile-result.schema.json`, `templates/doc.html`

### UI (React)

| Componente | Tamanho | Funcao |
|---|---|---|
| `Captures.tsx` | 31KB | Aba Gravacoes + visualizador NDJSON |
| `Processes.tsx` | 25KB | Aba Processos + exportacao + gravador |
| `Settings.tsx` | 8KB | Aba Config |
| `Logs.tsx` | 7KB | Aba Historico |
| `RecPill.tsx` | 3KB | Pilula flutuante de gravacao |
| `RecOverlay.tsx` | 862B | Overlay borda vermelha |

---

## Dados Locais

Diretorio: `%APPDATA%/tech.digitalai.process-studio`

```
settings.json                      chave OpenAI, path Chrome, porta CDP, retencao
captures/<id>.ndjson               trace append-only (1 JSON por linha, seq estavel)
captures/<id>.meta.json            metadados (schema: 1)
workflows/<wfId>/meta.json         nome, origem, custo, dominios
workflows/<wfId>/v<N>.json         workflow executavel versionado
workflows/<wfId>/doc.json          doc estruturado — fonte de todas as exportacoes
workflows/<wfId>/compile-log.json  payload LLM auditavel + tokens + custo
docs/<wfId>/                       exportacoes .md (+ -assets/), .html, .pdf
recordings/*.mkv (+ .meta.json)    gravacoes de tela
```

Retencao configuravel: padrao 14 dias / 512 MB para capturas.

Politica de seguranca:
- Dados capturados em disco: sem mascaramento (decisao explicita do usuario)
- Dados enviados ao LLM: sempre sanitizados via `stripSecrets()`
- Documentacao exportada: campos sensiveis exibidos como `••••••`

---

## Principios de Design (Constitution v1.1.0)

Definidos em `.specify/memory/constitution.md` — imutaveis sem votacao formal.

| # | Principio | Regra |
|---|---|---|
| I | Local-First | Sem servidor, sem conta, sem multi-tenant. Unica saida: API OpenAI com chave do usuario |
| II | Segredos Fora do LLM | `stripSecrets()` antes de toda chamada. Exportacao exibe `••••••` |
| III | Replay Deterministico | Escada: CSS -> XPath -> LLM heal -> rede -> intervencao humana. LLM nunca e cerebro de cada passo |
| IV | Trace Imutavel | NDJSON nunca alterado. Edicoes geram `v<N+1>.json` |
| V | Heranca por Fork | Originado do relay (cortex-local-agent). Repositorio de origem nao e modificado |
| VI | Correlacao Passo<->Request | Cada request carrega `afterStepSeq` |
| VII | Transparencia de Custo | Toda chamada LLM registra tokens + custo. Sem IA silenciosa |

---

## Custos de IA (Validados)

| Operacao | Custo | Tempo |
|---|---|---|
| Compilar processo browser (~6 passos) | ~US$ 0,007 | ~17s |
| Compilar video narrado (55s) | US$ 0,0078 | 13s |
| Compilar video longo (6 min, janelas) | US$ 0,074 | — |

Modelo: gpt-4.1-mini (structured outputs). Transcricao: whisper-1.

---

## Roadmap de Fases

| Fase | Status | Descricao |
|---|---|---|
| F0 — Scaffold | Entregue | App instalavel, Chrome isolado via CDP, gravacao e listagem de capturas |
| F1 — Auto-docs | Entregue | Compilador IA, exportador md/html/pdf, pagina Processos |
| FV — Docs por video | Entregue | Gravacao de tela + documentacao de videos locais com janelas para videos longos |
| FG — Gravador de tela | Entregue | ffmpeg empacotado, borda REC, pilula clicavel, recuperacao de orfaos |
| F2 — Replay deterministico | Pendente | Re-execucao com variaveis editaveis, formulario de preenchimento |
| F3 — IA na execucao | Pendente | Self-healing por LLM quando seletor quebra, resolucao de variaveis por instrucao |

Escada de Replay (F2/F3 — design): Seletor CSS -> XPath -> LLM Heal -> Assercao de Rede -> Intervencao Humana. LLM so entra quando CSS e XPath falham. Max. 1 tentativa de heal por passo por run.

---

## Build e Deploy

Pre-requisitos: Windows 10/11 x64 + Google Chrome + Node.js 20+ + Rust estavel (MSVC Build Tools) + WebView2

```powershell
npm install
npm run fetch:ffmpeg                               # baixa ffmpeg LGPL (~110MB)
cd sidecar
npm install
npm run build:win                                  # gera sidecar .exe via pkg
cd ..
Copy-Item sidecar\sidecar-x86_64-pc-windows-msvc.exe src-tauri\sidecar\
npm run tauri:dev                                  # desenvolvimento
npm run tauri:build                                # instalador NSIS
```

Saida: `src-tauri/target/release/bundle/nsis/` — instalador NSIS Windows.

Notas de build:
- `ffmpeg.exe` (~110MB) nao e versionado no git — baixar via `npm run fetch:ffmpeg`
- Playwright pinado em 1.59.1 para compatibilidade com `@yao-pkg/pkg`
- Sempre validar com o exe empacotado (nao apenas `node index.js`)

---

## Testes do Sidecar

```bash
cd sidecar && npm test
# test-capture-store.js
# test-tab-keys.js
# test-record-script.js
# test-compiler.js
# test-exporter.js
# test-video-compiler.js
# test-screen-recorder.js
```

---

## Estrutura do Repositorio

```
src/              UI React (Captures, Processes, Settings, Logs, RecOverlay, RecPill)
src-tauri/        Rust: supervisor sidecar, comandos, tray, overlays, deteccao Chrome
sidecar/          Node: CDP, acoes Playwright, stores, compiladores, exportador, gravador
docs/             Documentacao de produto e arquitetura (01-09)
specs/            Specs por feature (Spec Kit: spec, plan, tasks, contratos, quickstart)
.specify/         Constitution e templates do fluxo Spec Kit
scripts/          fetch-ffmpeg.ps1, geracao de icones
```

---

## Documentacao Tecnica Interna (docs/)

| Doc | Conteudo |
|---|---|
| `01-visao-produto.md` | Visao, mercado (Scribe, Codex, workflow-use), posicionamento |
| `02-arquitetura.md` | Modulos, fluxo de dados, escada de fallback do replay |
| `03-heranca-relay.md` | O que foi portado do relay (cortex-local-agent) e o que foi descartado |
| `04-spec-workflow-json.md` | Formato do workflow compilado (variaveis, assercoes, versoes) |
| `05-compilador.md` | Trace -> documentacao + workflow (GPT-4.1-mini) |
| `06-exportador.md` | Documentacao -> HTML -> PDF |
| `07-replayer.md` | Motor de re-execucao e self-healing (fase futura F2/F3) |
| `08-roadmap.md` | Fases F0-F3, tarefas e criterios de aceite |
| `09-decisoes.md` | Decisoes tomadas e questoes em aberto |

---

## Convencoes do Projeto

- Documentacao: Portugues (BR); codigo e nomes tecnicos: English
- Commits: Conventional Commits
- Desenvolvimento: Spec Kit (constitution -> specify -> clarify -> plan -> tasks -> implement)
- Schemas versionados (`schema: 1` em traces e workflows) — migracao exige bump + conversor
- Nome "Process Studio" e provisorio — renomear em `package.json` e `tauri.conf.json` quando definido

---

## Relacao com o Projeto EVOPE

O Process Studio e um produto independente desenvolvido pela Digital AI, mas tem relacao com o ecossistema EVOPE:

- **Origem tecnica:** herdado do relay do cortex-local-agent, que tambem e usado na captura de dados da plataforma EVOPE via CDP
- **Caso de uso potencial:** pode ser usado para gravar e documentar os processos dos colaboradores monitorados pelo EVOPE, criando documentacao automatica de SOPs
- **Stack compartilhada:** Playwright via CDP, NDJSON traces, arquitetura sidecar — mesmos padroes usados no relay-browser que opera no ecossistema EVOPE

---

## Gotchas (Hard-Learned Lessons)

### Tauri / Build / Instalador

**externalBin com copia manual gera instalador desatualizado (2026-08-21)**
O Tauri empacota o externalBin a partir de `src-tauri/<pasta>/`, mas o build do binario (pkg) sai em outra pasta. Se a copia for passo manual, o instalador NSIS pode sair com binario velho sem erro. Solucao: script de sync por hash chamado no `beforeBuildCommand` (`scripts/sync-sidecar.js`), falhando o build se o binario da plataforma nao existir.

**Windows limpo: exe Rust exige +crt-static (2026-08-21)**
Por padrao o alvo MSVC linka `vcruntime140.dll` dinamicamente — essa DLL NAO vem de fabrica no Windows. Num PC recem-formatado o app nao abre. Fix: `src-tauri/.cargo/config.toml` com `[target.x86_64-pc-windows-msvc] rustflags = ["-C","target-feature=+crt-static"]`.

**WebView2 default = downloadBootstrapper — instalacao exige internet (2026-08-21)**
Sem `bundle.windows.webviewInstallMode` no tauri.conf, o NSIS baixa o bootstrapper do WebView2 na hora da instalacao e aborta se o download falhar. Fix: `embedBootstrapper` (+~2 MB) embute o bootstrapper no setup; internet so e necessaria se a maquina nao tiver o runtime (Win11 sempre tem).

### OpenAI Vision / IA

**detail:'low' torna screenshots ilegiveis para o modelo (2026-08-20)**
Com `image_url: { detail: 'low' }` a OpenAI reduz a imagem a ~512px — barra de enderecos, rotulos de botoes e cabecalhos ficam ilegiveis. Fix: `detail: 'high'` + frames extraidos a >=1536px de largura (ffmpeg `scale='min(1536,iw)':-2`, JPEG `-q:v 4`).

**LLM so extrai o que o schema tem onde guardar (2026-08-20)**
Structured outputs: se o JSON Schema nao tem campo para um dado (ex.: `url` por passo) e o prompt nao manda transcreve-lo, o modelo ignora — nao adianta a imagem mostrar. Fix: campo dedicado no schema com descricao "NUNCA inventar, null se ilegivel" + instrucao explicita no prompt + validacao pos-parse.

**OCR de ids longos em screenshots e estocastico entre execucoes (2026-08-20)**
Mesmo com detail:high e frames 1536px, a transcricao de ids longos (id de planilha Google, id de agente) varia entre execucoes do mesmo prompt. Mitigacao: regra de "grafia unica" — reutilizar URLs ja registradas no resumo acumulado. Para artefatos criticos, fazer passada de verificacao manual dos literais.

### Skill Export

**Zip de skill no Windows: backslash + wrapper duplo (2026-08-27)**
`Compress-Archive` (PowerShell 5.1) grava entradas com `\` como separador — a spec de zip exige `/`. Skills exportadas pelo Process Studio vem com wrapper duplo e nome truncado no meio da palavra. Fix: usar `tar.exe -a -c -f skill.zip <pasta>` — gera `/` corretamente. Achatar e renomear antes de zipar.

---

## Comparativo com Concorrentes

| Funcionalidade | Scribe | Process Studio | Codex Record & Replay | workflow-use |
|---|---|---|---|---|
| Documentacao automatica com IA | Sim | Sim | Sim | Parcial |
| Exportacao Markdown / HTML / PDF | Parcial | Sim | Nao | Nao |
| Re-execucao do processo gravado | Nao | Pendente (F2/F3) | Sim | Sim |
| Variaveis editaveis na re-execucao | Nao | Pendente (F2/F3) | Nao | Parcial |
| Self-healing por LLM | Nao | Pendente (F3) | Sim | Nao |
| Local-first (sem servidor) | Nao | Sim | Nao | Sim |
| Correlacao passo <-> request de rede | Nao | Sim | Nao | Nao |
| Documentacao por video local | Nao | Sim | Nao | Nao |
| Gravacao de tela nativa | Nao | Sim | Nao | Nao |
