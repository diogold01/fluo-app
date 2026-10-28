```markdown
# ⚡ Fluo

> O cronograma de estudos adaptativo baseado em níveis de energia que se molda à sua rotina, não o contrário.

O **Fluo** é uma aplicação web client-side concebida para resolver a rigidez dos cronogramas tradicionais. Em vez de acumular tarefas em atraso e gerar atrito cognitivo, o sistema introduz o conceito de **Cronograma Líquido** e **Modo Bateria**, adaptando a carga diária ao nível de energia real do utilizador e redistribuindo sessões perdidas sem sobrecarregar os dias seguintes.

---

## 🎯 Funcionalidades Principais

* 🔋 **Modo Bateria (Check-in de Energia):** Defina o seu estado ao iniciar o dia (`Alta`, `Média` ou `Baixa`). O cronograma filtra e prioriza blocos de teoria densa, exercícios práticos ou micro-revisões de manutenção (até 15 min).
* 🔄 **Cronograma Líquido (Rebalanceamento Ativo):** Ao selecionar "Não consigo fazer hoje", a aplicação redistribui o conteúdo restante em frações menores pelos dias da semana com menor carga planeada.
* ⏳ **Temporizador Adaptativo:** Timer integrado de foco (técnica Pomodoro ajustável de 25/5 min ou blocos de 15 min para modo de baixa energia).
* 🛡️ **Streaks Resilientes:** Consistência orientada à manutenção do hábito semanal, tratando descansos estratégicos como progresso válido.
* 💾 **100% Client-Side:** Persistência local segura via `localStorage`, sem dependência de infraestrutura externa de backend.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** [React](https://react.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos & UI:** CSS / Tailwind CSS
* **Persistência:** LocalStorage API

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js (versão 18 ou superior)
* npm, yarn ou pnpm

### Passos

1. Clone o repositório:
```bash
git clone [https://github.com/SEU-UTILIZADOR/fluo-app.git](https://github.com/SEU-UTILIZADOR/fluo-app.git)

```

2. Aceda ao diretório do projeto:

```bash
cd fluo-app

```

3. Instale as dependências:

```bash
npm install

```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev

```

5. Abra o navegador no endereço indicado no terminal (normalmente `http://localhost:5173` ou `http://localhost:3000`).

---

## 📁 Estrutura do Projeto

```text
src/
├── components/       # Componentes de interface (Cards, Modais, Timers)
├── services/         # Camada de lógica e persistência (storageService.ts)
├── types/            # Definições de tipos TypeScript (Objetivos, Energia, Status)
├── App.tsx           # Componente principal
└── main.tsx          # Ponto de entrada da aplicação

```


```

```
