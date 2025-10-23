# Chatbot Jovem Programador

Chatbot inteligente que responde perguntas sobre o programa Jovem Programador usando **Google Gemini AI**, integrado a um **backend em Flask**.

## 🚀 Funcionalidades

- Interface de chat moderna e responsiva
- Robô animado de corpo inteiro com interações visuais
- Ponto de interrogação aparece quando o robô está pensando
- Lâmpada brilhante aparece quando o robô responde
- Logo do Jovem Programador no cabeçalho
- Botão de Libras (em desenvolvimento)
- Integração com Google Gemini AI para respostas inteligentes
- Extração automática de conteúdo dos sites do Jovem Programador
- API REST com Flask
- Variáveis de ambiente seguras (.env)
- Comunicação direta do frontend com o backend via `fetch`

---

## 📋 Pré-requisitos

- Python 3.8+
- Conta Google Cloud com API Gemini habilitada
- Navegador web moderno

---

## 🔧 Instalação

1. **Clone o repositório ou baixe os arquivos**

2. **Instale as dependências Python:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
   \`\`\`
   API_KEY=sua_chave_api_do_gemini
   PORT=5000
   \`\`\`

4. **Execute o backend:**
   \`\`\`bash
   python chatbot.py
   \`\`\`

5. **Abra o frontend:**
   Abra o arquivo `index.html` no navegador ou use um servidor local.

---

## 🎨 Novidades Visuais

- **Robô Animado**: Robô de corpo inteiro com animações de flutuação, piscar de olhos e movimento de braços
- **Indicador de Pensamento**: Ponto de interrogação animado aparece sobre a cabeça do robô enquanto processa
- **Indicador de Resposta**: Lâmpada brilhante com raios de luz aparece quando o robô encontra a resposta
- **Logo no Cabeçalho**: Logo do Jovem Programador posicionada à esquerda do cabeçalho
- **Botão Libras**: Botão para futura implementação de tradução em Língua Brasileira de Sinais

---

## 📁 Estrutura do Projeto

\`\`\`
.
├── chatbot.py          # Backend Flask com integração Gemini
├── index.html          # Interface do chatbot
├── script.js           # Lógica do frontend (comunicação com backend)
├── styles.css          # Estilos CSS com animações
├── public/
│   ├── PJP.png        # Logo Jovem Programador
│   └── troia.png      # Logo Cavalo de Troia
├── .env                # Variáveis de ambiente (API Key e porta)
├── requirements.txt    # Dependências Python
└── README.md           # Documentação
\`\`\`

---

## 🤖 Como Funciona

1. O usuário digita uma pergunta no chat
2. O frontend envia a mensagem para o backend Flask
3. O robô mostra um ponto de interrogação enquanto pensa
4. O backend consulta o Google Gemini AI com contexto dos sites do Jovem Programador
5. A resposta é enviada de volta ao frontend
6. O robô mostra uma lâmpada brilhante e exibe a resposta

---

## 🔒 Segurança

- API Key armazenada em arquivo `.env` (não commitada no Git)
- CORS configurado para permitir apenas requisições necessárias
- Validação de entrada no backend

---

## 📱 Responsividade

O chatbot é totalmente responsivo e funciona em:
- Desktop
- Tablets
- Smartphones

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Python, Flask, Flask-CORS
- **IA**: Google Gemini AI
- **Web Scraping**: BeautifulSoup4, Requests
- **Animações**: CSS Animations, SVG

---

## 📝 Licença

Este projeto foi desenvolvido para o programa Jovem Programador.
