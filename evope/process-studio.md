# Process Studio

> Ultima atualizacao: 2026-08-31
> Status: Em desenvolvimento (v0.1.0)
> Documentacao visual: https://reports.digital-ai.tech/evope/process-studio

---

## O que e

O Process Studio e um aplicativo desktop para Windows que **grava, documenta e (futuramente) re-executa processos de trabalho no navegador** de forma totalmente automatica com inteligencia artificial.

Desenvolvido pela Digital AI, o app roda inteiramente no computador do usuario — sem servidor, sem conta, sem dados na nuvem. A unica saida de dados e a chamada a API da OpenAI, usando a chave do proprio usuario armazenada localmente.

**Em uma frase:** o colaborador executa seu processo normalmente no Chrome, e o Process Studio gera a documentacao completa do que foi feito — com screenshots, descricao de cada passo e exportacao pronta para uso.

---

## Para quem e

- Empresas que precisam documentar processos operacionais (SOPs) sem depender de redacao manual
- Times de operacoes, RH, treinamento e compliance que gastam horas documentando rotinas
- Gestores que querem visibilidade sobre como processos sao executados na pratica
- Consultorias de processos que precisam mapear fluxos de trabalho rapidamente

---

## Posicionamento de mercado

**"Uma Scribe que executa."**

A Scribe (avaliada em US$ 1,3 bilhao) lidera o segmento de documentacao automatica de processos — mas so documenta, nunca re-executa. O Process Studio fecha essa lacuna com replay deterministico e self-healing por IA (fases futuras).

| Funcionalidade | Scribe | Process Studio |
|---|---|---|
| Documentacao automatica com IA | Sim | Sim |
| Exportacao Markdown / HTML / PDF | Parcial | Sim |
| Re-execucao do processo gravado | Nao | Pendente (F2/F3) |
| Variaveis editaveis na re-execucao | Nao | Pendente (F2/F3) |
| Self-healing por LLM | Nao | Pendente (F3) |
| Local-first (sem servidor) | Nao | Sim |
| Correlacao passo <-> request de rede | Nao | Sim |
| Documentacao por video local | Nao | Sim |
| Gravacao de tela nativa | Nao | Sim |

Outros concorrentes monitorados: Codex Record & Replay (OpenAI) e workflow-use (open-source).

---

## Como funciona

### 1. Gravacao de processos no browser

O usuario abre o Process Studio e clica em "Gravar". O app conecta ao Chrome via protocolo CDP (Chrome DevTools Protocol) e acompanha tudo o que o usuario faz:

- Cliques, digitacao, navegacao entre paginas
- Screenshots automaticos de cada passo
- Requisicoes de rede correlacionadas a cada acao

O usuario executa seu processo normalmente. Ao terminar, clica em "Parar" e a gravacao fica salva localmente.

### 2. Gravacao de tela nativa

Alem da gravacao de browser, o Process Studio tambem grava a tela do computador com audio:

- Selecao de monitor e microfone na interface
- Pilula flutuante mostrando o tempo de gravacao
- Borda vermelha no monitor gravado (que nao aparece na propria gravacao)
- Recuperacao automatica de gravacoes interrompidas por crash

### 3. Documentacao automatica com IA

Com um clique no botao "Documentar", a IA analisa a gravacao e gera:

- **Titulo e resumo** do processo
- **Passo a passo detalhado** com descricao do que foi feito em cada etapa
- **Screenshots** de cada passo (retirados da gravacao)
- **Dados tecnicos** (URLs, seletores, tempos) extraidos diretamente da gravacao — sem invencao

A IA usa GPT-4.1-mini com structured outputs: os fatos vem 100% da gravacao, o modelo nao inventa dados. Informacoes sensiveis (senhas, tokens) sao removidas automaticamente antes de enviar ao modelo.

### 4. Documentacao a partir de video

Alem de processos gravados no browser, o Process Studio tambem documenta a partir de qualquer video local (.mp4, .mkv, .webm, .mov, .avi):

- Extrai frames e audio do video automaticamente
- Transcreve o audio com Whisper (OpenAI)
- Analisa os frames com visao computacional
- Gera o mesmo documento estruturado com passo a passo

Suporta videos longos (ate 120 minutos) com processamento em janelas. Antes de qualquer upload, exibe aviso de privacidade que o usuario precisa confirmar.

---

## O que entrega (formatos de exportacao)

O documento gerado pode ser exportado em tres formatos:

| Formato | Descricao |
|---|---|
| **Markdown** | Arquivo .md com pasta de assets (screenshots) — ideal para wikis, Notion, Confluence |
| **HTML autocontido** | Arquivo unico com imagens embutidas (data-URI) — abre em qualquer navegador sem dependencias |
| **PDF** | Documento A4 renderizado via Chrome headless — pronto para impressao ou envio por email |

A exportacao nao usa IA — ela simplesmente converte o documento ja compilado para o formato desejado.

---

## Interface do aplicativo

O Process Studio tem 4 abas principais:

| Aba | O que faz |
|---|---|
| **Gravacoes** | Lista todas as gravacoes de browser com visualizador passo a passo |
| **Processos** | Mostra os documentos compilados, permite exportar e iniciar gravacao de tela |
| **Configuracoes** | Chave da API OpenAI, caminho do Chrome, porta CDP, retencao de dados, config de video |
| **Historico** | Log de todas as compilacoes com custo em dolares |

Ao fechar a janela, o app minimiza para a bandeja do sistema (tray) e continua rodando em background.

---

## Custos de uso

O Process Studio em si e gratuito — o unico custo e o uso da API da OpenAI (chave do proprio usuario):

| Operacao | Custo aproximado | Tempo |
|---|---|---|
| Documentar processo de browser (~6 passos) | ~US$ 0,007 | ~17 segundos |
| Documentar video narrado (55 segundos) | ~US$ 0,008 | ~13 segundos |
| Documentar video longo (6 minutos) | ~US$ 0,07 | variavel |

Cada compilacao registra os tokens consumidos e o custo exato no log de historico — transparencia total.

---

## Seguranca e privacidade

- **100% local**: nenhum dado e armazenado em servidor externo
- **Sem conta**: nao exige cadastro, login ou qualquer identificacao
- **Dados sensiveis**: removidos automaticamente antes de enviar ao modelo de IA (funcao stripSecrets)
- **Na exportacao**: campos sensiveis aparecem como "••••••"
- **Video**: aviso de privacidade obrigatorio antes de qualquer processamento
- **Chave OpenAI**: armazenada localmente no computador do usuario

---

## Roadmap

| Fase | Status | O que entrega |
|---|---|---|
| F0 — Scaffold | Entregue | App instalavel, Chrome isolado, gravacao e listagem de capturas |
| F1 — Auto-docs | Entregue | Compilacao com IA, exportacao md/html/pdf, pagina de processos |
| FV — Docs por video | Entregue | Gravacao de tela + documentacao de videos locais (suporte a videos longos) |
| FG — Gravador de tela | Entregue | Gravacao nativa com borda REC, pilula flutuante, recuperacao de gravacoes orfas |
| F2 — Replay deterministico | Pendente | Re-execucao automatica do processo gravado com variaveis editaveis |
| F3 — IA na execucao | Pendente | Self-healing por LLM quando seletores quebram, resolucao de variaveis por instrucao |

### Replay (F2/F3) — como vai funcionar

Quando implementado, o replay seguira uma "escada de fallback":

1. Tentar localizar o elemento por seletor CSS
2. Se falhar, tentar por XPath
3. Se falhar, acionar LLM para "curar" o seletor (self-healing)
4. Se falhar, verificar por assercao de rede
5. Ultimo recurso: intervencao humana

A IA so entra quando CSS e XPath falham — no maximo 1 tentativa de heal por passo por execucao.

---

## Relacao com o projeto EVOPE

O Process Studio e um produto independente da Digital AI, mas tem relacao direta com o ecossistema EVOPE:

- **Caso de uso principal**: gravar e documentar os processos dos colaboradores monitorados pelo EVOPE, criando SOPs automaticos
- **Origem tecnica**: herdado do relay do Cortex Local Agent, que tambem opera no ecossistema EVOPE
- **Complementaridade**: o EVOPE monitora QUAIS processos sao executados; o Process Studio documenta COMO cada processo e feito

---

## Stack tecnica (resumo)

| Componente | Tecnologia |
|---|---|
| App desktop | Tauri v2 (Rust) — Windows |
| Motor de gravacao | Node.js + Playwright via Chrome DevTools Protocol |
| Interface | React |
| IA | OpenAI GPT-4.1-mini (documentacao) + Whisper-1 (transcricao) |
| Armazenamento | Arquivos locais (sem banco de dados) |
| Gravacao de tela | ffmpeg empacotado |

Para detalhes tecnicos completos (arquitetura, codigo, build, gotchas), consulte a documentacao visual em https://reports.digital-ai.tech/evope/process-studio
