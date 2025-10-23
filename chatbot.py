import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup

# Carregar variáveis do arquivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permitir requisições do frontend

# Pegar API Key da variável de ambiente
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise ValueError("API_KEY não encontrada. Defina no arquivo .env")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Cache do contexto para não extrair toda vez
contexto_cache = None


def extrair_conteudo_do_site(url):
    """Extrai conteúdo de texto de um site"""
    try:
        resposta = requests.get(url, timeout=20)
        resposta.raise_for_status()
        soup = BeautifulSoup(resposta.text, 'html.parser')
        textos = []

        for tag in soup.find_all(['p', 'h1', 'h2', 'h3', 'li']):
            texto = tag.get_text(strip=True)
            if texto and len(texto) > 2:
                textos.append(texto)

        for img in soup.find_all('img'):
            alt_text = img.get('alt')
            if alt_text:
                textos.append(alt_text)

        return "\n".join(textos)

    except Exception as e:
        print(f"Erro ao acessar {url}: {str(e)}")
        return ""


def carregar_contexto():
    """Carrega o contexto dos sites do Jovem Programador"""
    global contexto_cache

    if contexto_cache:
        return contexto_cache

    urls = [
        "https://www.jovemprogramador.com.br",
        "https://www.jovemprogramador.com.br/sobre.php",
        "http://www.jovemprogramador.com.br/apoiadores.php",
        "https://www.jovemprogramador.com.br/patrocinadores.php",
        "http://www.jovemprogramador.com.br/parceiros.php",
        "https://www.jovemprogramador.com.br/queroserprofessor/",
        "http://www.jovemprogramador.com.br/duvidas.php",
        "https://www.jovemprogramador.com.br/hackathon/",
        "http://www.jovemprogramador.com.br/aluno/",
        "http://www.jovemprogramador.com.br/vagas/",
    ]

    print("Carregando contexto dos sites...")
    contexto = ""

    for url in urls:
        conteudo = extrair_conteudo_do_site(url)
        if conteudo:
            contexto += conteudo + "\n"

    contexto_cache = contexto
    print("Contexto carregado com sucesso!")
    return contexto


def perguntar_ao_gemini(pergunta, contexto):
    """Envia pergunta para o Gemini com contexto"""
    prompt = f"""Você é um assistente virtual do programa Jovem Programador. 
Responda de forma amigável, clara e objetiva com base no contexto fornecido.
Se a pergunta não estiver relacionada ao contexto, responda educadamente que você só pode ajudar com informações sobre o Jovem Programador.

Contexto:
{contexto}

Pergunta do usuário:
{pergunta}

Resposta:"""

    try:
        resposta = model.generate_content(prompt)
        return resposta.text
    except Exception as e:
        return f"Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente."


@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar se a API está funcionando"""
    return jsonify({
        "status": "ok",
        "message": "API do Chatbot está funcionando",
        "api_key_configured": bool(API_KEY)
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint principal para receber mensagens do usuário"""
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({
                "error": "Mensagem não fornecida"
            }), 400

        mensagem_usuario = data['message']

        # Carregar contexto (usa cache se já foi carregado)
        contexto = carregar_contexto()

        if not contexto:
            return jsonify({
                "response": "Desculpe, não consegui carregar as informações necessárias. Tente novamente mais tarde."
            })

        # Obter resposta do Gemini
        resposta = perguntar_ao_gemini(mensagem_usuario, contexto)

        return jsonify({
            "response": resposta
        })

    except Exception as e:
        print(f"Erro no endpoint /api/chat: {str(e)}")
        return jsonify({
            "error": "Erro interno do servidor",
            "message": str(e)
        }), 500


if __name__ == '__main__':
    # Carregar contexto ao iniciar
    carregar_contexto()

    # Iniciar servidor
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
