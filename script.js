const API_KEY = "AIzaSyCBEDympZY8jgERLN2Y7Ot95YBEPcm2SXo";
const MODEL_ID = "gemini-1.5-flash";
const chatLog = document.getElementById("chat-log");
const promptInput = document.getElementById("prompt");
let perguntaAtual = 0;
let respostasQuiz = {};
const perguntas = [
 "Qual área te chama mais a atenção? (Tecnologia 💻, Saúde 🩺, Artes 🎨, Exatas 📊, ou talvez algo mais humano 🤔?)",
 "Quando você está trabalhando em um projeto, você prefere liderar 🚀 a equipe, colaborar em conjunto 🤝, ou trabalhar de forma mais independente 👤?",
 "Pensando nas suas atividades favoritas, elas geralmente envolvem mais criatividade e imaginação 💡, análise lógica e resolução de problemas 🧩, ou interação e comunicação com outras pessoas 🗣️?",
 "Em relação a um ambiente de trabalho, o que te motiva mais: a estabilidade e segurança ✅, a oportunidade de inovação e mudança ✨, ou um senso de propósito e impacto social ❤️?",
 "Quais são seus maiores talentos ou habilidades naturais? (Pode ser algo como comunicação, organização, programação, desenho, etc.)",
 "Como você lida com desafios ou obstáculos? Você prefere enfrentá-los de frente 💪, buscar soluções criativas 🤔, ou pedir ajuda e colaborar com outros 🤝?",
 "Quando você aprende algo novo, você prefere um aprendizado mais teórico e conceitual 📚, prático e hands-on 🛠️, ou através de discussões e trocas de ideias 💬?",
 "Em que tipo de ambiente você se sente mais energizado e produtivo: um lugar mais estruturado e organizado 🏢, um espaço mais flexível e dinâmico 🏞️, ou um ambiente colaborativo e social 🧑‍🤝‍🧑?",
 "Se você pudesse dedicar seu tempo a resolver um problema no mundo, qual problema você escolheria 🌍?",
 "Pensando em uma carreira ideal, o que seria mais importante para você: um bom salário 💰, reconhecimento e status 🏆, a possibilidade de crescimento e aprendizado 🌱, ou um equilíbrio entre vida pessoal e profissional 🧘?",
 "Qual tipo de impacto você gostaria de ter na sua área de atuação ou na sociedade como um todo? 🌟",
 "Se você pudesse passar um dia aprendendo com um especialista em qualquer área, quem você escolheria e por quê? 🧐"
 ];

function enviarResposta() {
 const resposta = promptInput.value.trim();
 if (!resposta) return;

 exibirMensagemUsuario(resposta);
 promptInput.value = "";

 if (perguntaAtual < perguntas.length) {
 respostasQuiz[`pergunta${perguntaAtual + 1}`] = resposta;
 perguntaAtual++;
 if (perguntaAtual < perguntas.length) {
 exibirMensagemGemini(perguntas[perguntaAtual]);
 } else {
 exibirMensagemGemini("Aguarde um momento... ⏳ Estou analisando suas respostas para te dar a melhor orientação!");
 enviarAnaliseParaGemini(respostasQuiz);
 }
 } else {
 enviarPerguntaParaGemini(resposta);
 }
}

async function enviarAnaliseParaGemini(respostas) {
 const promptAnalise = `Analise as seguintes respostas de um estudante para orientação vocacional:
 ${Object.keys(respostas).map(key => `- ${perguntas[parseInt(key.replace('pergunta', '')) - 1]}: ${respostas[key]}`).join('\n')}

 Com base nessas informações detalhadas, sugira 3-5 carreiras ideais, explicando o raciocínio por trás de cada sugestão de forma clara e conectando com as respostas do estudante. Para uma das carreiras sugeridas, ofereça um plano de estudos inicial mais detalhado, incluindo possíveis áreas de foco, habilidades a desenvolver e recursos de aprendizado (cursos online, livros, etc.). Seja um orientador vocacional profissional, empático e inspirador.`;

 enviarPerguntaParaGemini(promptAnalise);
}

async function enviarPerguntaParaGemini(prompt) {
 const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL_ID}:generateContent?key=${API_KEY}`;
 const headers = {
 "Content-Type": "application/json"
 };
 const body = {
 contents: [
 {
 role: "user",
 parts: [{ text: `Você é um orientador vocacional profissional com IA generativa. Responda de forma empática, prática, clara e personalizada. Seja um coach e mentor. Responda à seguinte pergunta/análise: ${prompt}` }]
 }
 ]
 };

 try {
 const response = await fetch(url, {
 method: "POST",
 headers,
 body: JSON.stringify(body)
 });

 const data = await response.json();

 if (!response.ok) {
 exibirMensagemGemini("Ops! Algo deu errado: " + (data.error?.message || "Erro desconhecido."));
 } else {
 const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "Nenhuma resposta gerada.";
 exibirMensagemGemini(output);
 }
 } catch (error) {
 exibirMensagemGemini("Erro de conexão: " + error.message);
 }
}

function exibirMensagemUsuario(mensagem) {
 const div = document.createElement("div");
 div.classList.add("mensagem", "usuario");
 div.textContent = mensagem;
 chatLog.appendChild(div);
 chatLog.scrollTop = chatLog.scrollHeight;
}

function exibirMensagemGemini(mensagem) {
 const div = document.createElement("div");
 div.classList.add("mensagem", "gemini");
 div.innerHTML = mensagem.replace(/\n/g, '<br>');
 chatLog.appendChild(div);
 chatLog.scrollTop = chatLog.scrollHeight;
}

function limparChat() {
 chatLog.innerHTML = '<div class="mensagem gemini">Olá! 👋 Preparado(a) para descobrir seu futuro profissional? Vamos nessa! Para começar, me conta: qual área te chama mais a atenção? (Tipo, tecnologia 💻, saúde 🩺, artes 🎨, números 📊, ou talvez algo mais humano 🤔?)</div>';
 perguntaAtual = 0;
 respostasQuiz = {};
}

promptInput.addEventListener("keypress", function(event) {
 if (event.key === "Enter") {
 event.preventDefault(); 
 enviarResposta();
 }
});

