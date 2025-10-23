// ===== ELEMENTOS DO DOM =====
const chatMessages = document.getElementById("chatMessages")
const userInput = document.getElementById("userInput")
const sendButton = document.getElementById("sendButton")
const librasButton = document.getElementById("librasButton")

// URL do backend Flask
const API_URL = "http://localhost:5000/api/chat"

let currentRobotThinking = null
const currentRobotIdea = null

// ===== FUNÇÕES =====

/**
 * Adiciona uma mensagem ao chat
 * @param {string} text - Texto da mensagem
 * @param {boolean} isUser - Se true, mensagem do usuário; se false, mensagem do bot
 */
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${isUser ? "user" : "bot"}`

  const avatar = document.createElement("div")
  avatar.className = "message-avatar"

  if (isUser) {
    avatar.textContent = "👤"
  } else {
    avatar.innerHTML = `
      <div class="robot-container">
        <svg class="robot-body" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
           Antenna 
          <line x1="100" y1="20" x2="100" y2="50" stroke="#e91e8c" stroke-width="3"/>
          <circle cx="100" cy="15" r="5" fill="#ff0099"/>
          
           Head 
          <rect x="70" y="50" width="60" height="50" rx="10" fill="#2d1b69" stroke="#e91e8c" stroke-width="2"/>
          
           Eyes 
          <circle cx="85" cy="70" r="6" fill="#00ffff" class="robot-eye-left"/>
          <circle cx="115" cy="70" r="6" fill="#00ffff" class="robot-eye-right"/>
          
           Mouth 
          <path d="M 80 85 Q 100 92 120 85" stroke="#e91e8c" stroke-width="2" fill="none" class="robot-mouth"/>
          
           Body 
          <rect x="60" y="110" width="80" height="90" rx="15" fill="#2d1b69" stroke="#e91e8c" stroke-width="2"/>
          
           Chest panel 
          <rect x="80" y="130" width="40" height="30" rx="5" fill="#1a0a3e" stroke="#ff0099" stroke-width="1"/>
          <circle cx="90" cy="145" r="3" fill="#00ffff" class="robot-light"/>
          <circle cx="100" cy="145" r="3" fill="#00ffff" class="robot-light"/>
          <circle cx="110" cy="145" r="3" fill="#00ffff" class="robot-light"/>
          
           Arms 
          <rect x="35" y="120" width="20" height="60" rx="10" fill="#2d1b69" stroke="#e91e8c" stroke-width="2" class="robot-arm-left"/>
          <circle cx="45" cy="185" r="8" fill="#1a0a3e" stroke="#ff0099" stroke-width="2"/>
          
          <rect x="145" y="120" width="20" height="60" rx="10" fill="#2d1b69" stroke="#e91e8c" stroke-width="2" class="robot-arm-right"/>
          <circle cx="155" cy="185" r="8" fill="#1a0a3e" stroke="#ff0099" stroke-width="2"/>
          
           Legs 
          <rect x="70" y="205" width="25" height="70" rx="8" fill="#2d1b69" stroke="#e91e8c" stroke-width="2"/>
          <rect x="105" y="205" width="25" height="70" rx="8" fill="#2d1b69" stroke="#e91e8c" stroke-width="2"/>
          
           Feet 
          <ellipse cx="82.5" cy="280" rx="18" ry="8" fill="#1a0a3e" stroke="#ff0099" stroke-width="2"/>
          <ellipse cx="117.5" cy="280" rx="18" ry="8" fill="#1a0a3e" stroke="#ff0099" stroke-width="2"/>
        </svg>
        
        <div class="robot-thinking">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="white" stroke="#e91e8c" stroke-width="3"/>
            <text x="50" y="70" font-size="60" fill="#2d1b69" text-anchor="middle" font-weight="bold">?</text>
          </svg>
        </div>
               
        <div class="robot-idea">
          <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="bulbGlow-${Date.now()}">
                <stop offset="0%" style="stop-color:#ffff00;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff9900;stop-opacity:0.5" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="40" r="25" fill="url(#bulbGlow-${Date.now()})" stroke="#ff9900" stroke-width="2" class="lightbulb-glow"/>
            <rect x="42" y="60" width="16" height="8" fill="#666"/>
            <rect x="40" y="68" width="20" height="4" fill="#888"/>
            <line x1="50" y1="10" x2="50" y2="0" stroke="#ffff00" stroke-width="3" class="light-ray"/>
            <line x1="75" y1="20" x2="82" y2="13" stroke="#ffff00" stroke-width="3" class="light-ray"/>
            <line x1="80" y1="40" x2="90" y2="40" stroke="#ffff00" stroke-width="3" class="light-ray"/>
            <line x1="25" y1="20" x2="18" y2="13" stroke="#ffff00" stroke-width="3" class="light-ray"/>
            <line x1="20" y1="40" x2="10" y2="40" stroke="#ffff00" stroke-width="3" class="light-ray"/>
          </svg>
        </div>
      </div>
    `
  }

  const content = document.createElement("div")
  content.className = "message-content"
  content.textContent = text

  messageDiv.appendChild(avatar)
  messageDiv.appendChild(content)
  chatMessages.appendChild(messageDiv)

  // Scroll automático para a última mensagem
  chatMessages.scrollTop = chatMessages.scrollHeight
}

/**
 * Shows question mark above robot's head while thinking
 */
function showThinkingIndicator() {
  const messageDiv = document.createElement("div")
  messageDiv.className = "message bot"
  messageDiv.id = "thinkingMessage"

  const avatar = document.createElement("div")
  avatar.className = "message-avatar"
  avatar.innerHTML = `
    <div class="robot-container">
      <svg class="robot-body" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
        <line x1="100" y1="20" x2="100" y2="50" stroke="#e91e8c" stroke-width="3"/>
        <circle cx="100" cy="15" r="5" fill="#ff0099"/>
        <rect x="70" y="50" width="60" height="50" rx="10" fill="#2d1b69" stroke="#e91e8c" stroke-width="2"/>
        <circle cx="85" cy="70" r="6" fill="#00ffff" class="robot-eye-left"/>
        <circle cx="115" cy="70" r="6" fill="#00ffff" class="robot-eye-right"/>
        <path d="M 80 85 Q 100 92 120 85" stroke="#e91e8c" stroke-width="2" fill="none" class="robot-mouth"/>
        <rect x="60" y="110" width="80" height="90" rx="15" fill="#2d1b69" stroke="#e91e8c" stroke-width="2"/>
        <rect x="80" y="130" width="40" height="30" rx="5" fill="#1a0a3e" stroke="#ff0099" stroke-width="1"/>
        <circle cx="90" cy="145" r="3" fill="#00ffff" class="robot-light"/>
        <circle cx="100" cy="145" r="3" fill="#00ffff" class="robot-light"/>
        <circle cx="110" cy="145" r="3" fill="#00ffff" class="robot-light"/>
        <rect x="35" y="120" width="20" height="60" rx="10" fill="#2d1b69" stroke="#e91e8c" stroke-width="2" class="robot-arm-left"/>
        <circle cx="45" cy="185" r="8" fill="#1a0a3e" stroke="#ff0099" stroke-width="2"/>
        <rect x="145" y="120" width="20" height="60" rx="10" fill="#2d1b69" stroke="#e91e8c" stroke-width="2" class="robot-arm-right"/>
        <circle cx="155" cy="185" r="8" fill="#1a0a3e" stroke="#ff0099" stroke-width="2"/>
        <rect x="70" y="205" width="25" height="70" rx="8" fill="#2d1b69" stroke="#e91e8c" stroke-width="2"/>
        <rect x="105" y="205" width="25" height="70" rx="8" fill="#2d1b69" stroke="#e91e8c" stroke-width="2"/>
        <ellipse cx="82.5" cy="280" rx="18" ry="8" fill="#1a0a3e" stroke="#ff0099" stroke-width="2"/>
        <ellipse cx="117.5" cy="280" rx="18" ry="8" fill="#1a0a3e" stroke="#ff0099" stroke-width="2"/>
      </svg>
      <div class="robot-thinking active" id="activeThinking">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="white" stroke="#e91e8c" stroke-width="3"/>
          <text x="50" y="70" font-size="60" fill="#2d1b69" text-anchor="middle" font-weight="bold">?</text>
        </svg>
      </div>
         <div class="robot-idea">
        <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bulbGlowThinking">
              <stop offset="0%" style="stop-color:#ffff00;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#ff9900;stop-opacity:0.5" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="40" r="25" fill="url(#bulbGlowThinking)" stroke="#ff9900" stroke-width="2" class="lightbulb-glow"/>
          <rect x="42" y="60" width="16" height="8" fill="#666"/>
          <rect x="40" y="68" width="20" height="4" fill="#888"/>
          <line x1="50" y1="10" x2="50" y2="0" stroke="#ffff00" stroke-width="3" class="light-ray"/>
          <line x1="75" y1="20" x2="82" y2="13" stroke="#ffff00" stroke-width="3" class="light-ray"/>
          <line x1="80" y1="40" x2="90" y2="40" stroke="#ffff00" stroke-width="3" class="light-ray"/>
          <line x1="25" y1="20" x2="18" y2="13" stroke="#ffff00" stroke-width="3" class="light-ray"/>
          <line x1="20" y1="40" x2="10" y2="40" stroke="#ffff00" stroke-width="3" class="light-ray"/>
        </svg>
      </div>
    </div>
  `

  const content = document.createElement("div")
  content.className = "message-content"
  content.style.opacity = "0.6"
  content.textContent = "Pensando..."

  messageDiv.appendChild(avatar)
  messageDiv.appendChild(content)
  chatMessages.appendChild(messageDiv)
  chatMessages.scrollTop = chatMessages.scrollHeight

  currentRobotThinking = document.getElementById("activeThinking")
}

/**
 * Removes thinking indicator and shows lightbulb
 */
function removeThinkingIndicator() {
  const thinkingMsg = document.getElementById("thinkingMessage")
  if (thinkingMsg) {
    thinkingMsg.remove()
  }
}

/**
 * Shows lightbulb animation on last bot message
 */
function showIdeaIndicator() {
  // Find the last bot message
  const botMessages = document.querySelectorAll(".message.bot")
  if (botMessages.length > 0) {
    const lastBotMessage = botMessages[botMessages.length - 1]
    const ideaElement = lastBotMessage.querySelector(".robot-idea")
    if (ideaElement) {
      ideaElement.classList.add("active")

      // Remove after 3 seconds
      setTimeout(() => {
        ideaElement.classList.remove("active")
      }, 3000)
    }
  }
}

/**
 * Envia a mensagem do usuário para o backend Flask
 */
async function sendMessage() {
  const message = userInput.value.trim()
  if (message === "") return

  // Adiciona mensagem do usuário
  addMessage(message, true)
  userInput.value = ""

  // Desabilita botão enquanto processa
  sendButton.disabled = true
  showThinkingIndicator()

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })

    const data = await response.json()

    removeThinkingIndicator()
    if (data.response) {
      addMessage(data.response, false)
      setTimeout(() => {
        showIdeaIndicator()
      }, 100)
    } else {
      addMessage("⚠️ Erro: resposta inválida do servidor.", false)
    }
  } catch (error) {
    removeThinkingIndicator()
    addMessage("⚠️ Erro de conexão com o servidor.", false)
    console.error("Erro ao enviar mensagem:", error)
  } finally {
    sendButton.disabled = false
    userInput.focus()
  }
}

// ===== EVENT LISTENERS =====

// Enviar mensagem ao clicar no botão
sendButton.addEventListener("click", sendMessage)

// Enviar mensagem ao pressionar Enter
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
})

librasButton.addEventListener("click", () => {
  alert(
    "Funcionalidade de Libras em desenvolvimento! 🤟\n\nEm breve você poderá usar o chatbot com tradução em Língua Brasileira de Sinais.",
  )
})

// Foco automático no input ao carregar a página
userInput.focus()

document.getElementById("year").textContent = new Date().getFullYear()
