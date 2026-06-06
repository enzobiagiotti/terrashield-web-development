// ==========================================
// 1. BANCO DE DADOS (MODEL)
// ==========================================
const perguntasQuiz = [
    {
        pergunta: "1. Sobre o propósito principal do TERRASHIELD:", 
        opcoes: [
            "A) Transmitir sinal de internet banda larga para áreas rurais remotas.",
            "B) Monitorar e emitir alertas precoces de queimadas, enchentes e deslizamentos.",
            "C) Mapear rotas comerciais para otimização de logística marítima.",
            "D) Fotografar exoplanetas para pesquisa astronômica profunda." 
        ], 
        correta: 1 
    },
    {
        pergunta: "2. Sobre a arquitetura de Edge Computing (Processamento na Borda):", 
        opcoes: [
            "A) Serve para aumentar o consumo de energia dos sensores em solo.",
            "B) É uma técnica para armazenar todos os dados brutos na nuvem sem filtros.",
            "C) Permite reduzir a latência e filtrar dados localmente antes da transmissão.",
            "D) É o processo de enviar dados via cabos de fibra óptica submarinos."
        ], 
        correta: 2
    },
    {
        pergunta: "3. Sobre a fonte de dados para monitoramento de incêndios:", 
        opcoes: [
            "A) Google Maps Street View.",
            "B) Starlink Weather Services.",
            "C) INPE BDQueimadas.",
            "D) OpenStreetMap Global Fire."
        ], 
        correta: 2
    },
    {
        pergunta: "4. Sobre a detecção de risco de enchentes:", 
        opcoes: [
            "A) Utiliza a OpenWeather API como proxy para risco hídrico.",
            "B) Mede o nível da maré apenas em cidades costeiras.",
            "C) Baseia-se exclusivamente em fotos enviadas por usuários via redes sociais.",
            "D) Analisa a umidade do ar através de satélites de comunicação de rádio."
        ], 
        correta: 0 
    },
    {
        pergunta: "5. Sobre a AI acelerada com hardware específico:", 
        opcoes: [
            "A) Usa processadores de texto simples para classificar os dados.",
            "B) Depende exclusivamente de memória RAM para rodar os modelos.",
            "C) Utiliza a plataforma NVIDIA CUDA / TensorRT para inferência rápida.",
            "D) Utiliza emuladores de consoles de videogame antigos para economizar energia."
        ], 
        correta: 2 
    },
    {
        pergunta: "6. Sobre a modelagem matemática de propagação de fogo:", 
        opcoes: [
            "A) É representada por uma função constante, pois o fogo não muda de ritmo.",
            "B) É modelada por uma Função Exponencial da área afetada no tempo.",
            "C) Segue uma função logarítmica, pois o fogo diminui quanto mais queima.",
            "D) É calculada através de uma regra de três simples entre calor e vento."
        ], 
        correta: 1 
    },
    {
        pergunta: "7. Sobre a modelagem da sazonalidade das chuvas:", 
        opcoes: [
            "A) Usa funções polinomiais de primeiro grau para prever o clima.",
            "B) Utiliza Funções Trigonométricas (Seno/Cosseno) para representar os ciclos anuais.",
            "C) É impossível de modelar matematicamente devido ao caos climático.",
            "D) Baseia-se em funções quadráticas que nunca se repetem."
        ], 
        correta: 1 
    },
    {
        pergunta: "8. Sobre o público-alvo e tomada de decisão:", 
        opcoes: [
            "A) Foca em turistas que buscam as melhores praias para o verão.",
            "B) Destina-se apenas a empresas de publicidade digital.",
            "C) Atende à Defesa Civil para ações de evacuação e emergência.",
            "D) É uma ferramenta exclusiva para astronautas em órbita."
        ], 
        correta: 2 
    },
    {
        pergunta: "9. Sobre o compromisso com o desenvolvimento sustentável (ONU):", 
        opcoes: [
            "A) ODS 1: Erradicação da Pobreza.",
            "B) ODS 4: Educação de Qualidade.",
            "C) ODS 13: Ação Contra a Mudança Global do Clima.",
            "D) ODS 17: Parcerias e Meios de Implementação."
        ], 
        correta: 2 
    },
    {
        pergunta: "10. Sobre a confiabilidade e o 'Fallback' do sistema:", 
        opcoes: [
            "A) Se a internet cair, o sistema é desligado permanentemente.",
            "B) O sistema apaga todos os dados em caso de falha na API.",
            "C) O satélite TERRASHIELD reinicia sua órbita automaticamente.",
            "D) O sistema utiliza datasets locais em CSV para garantir a demonstração."
        ], 
        correta: 3
    }
];

// ==========================================
// 2. VARIÁVEIS DE ESTADO
// ==========================================
let perguntaAtual = 0;
let pontuacao = 0;

// ==========================================
// 3. MAPEAMENTO DO DOM
// ==========================================
const quizConteudo = document.getElementById('quiz-conteudo');
const quizResultado = document.getElementById('quiz-resultado');

const quizProgresso = document.getElementById('quiz-progresso');
const quizPergunta = document.getElementById('quiz-pergunta');
const quizOpcoes = document.getElementById('quiz-opcoes');
const quizFeedback = document.getElementById('quiz-feedback');

const quizProximo = document.getElementById('quiz-proximo');
const quizPontuacao = document.getElementById('quiz-pontuacao');
const quizReiniciar = document.getElementById('quiz-reiniciar');

// ==========================================
// 4. FUNÇÕES DO MOTOR DO JOGO
// ==========================================

function carregarPergunta() {
    quizConteudo.style.display = "block";
    quizResultado.style.display = "none";
    
    // TRAVA: O botão de próxima pergunta fica completamente escondido até o usuário responder
    quizProximo.style.display = "none";
    
    quizFeedback.innerText = "";
    
    const questao = perguntasQuiz[perguntaAtual];
    quizProgresso.innerText = `Pergunta ${perguntaAtual + 1} de ${perguntasQuiz.length}`;
    quizPergunta.innerHTML = questao.pergunta;
    quizOpcoes.innerHTML = "";
    
    questao.opcoes.forEach((opcao, indice) => {
        const botaoAlternativa = document.createElement('button');
        botaoAlternativa.innerHTML = opcao;
        botaoAlternativa.dataset.indice = indice;
        
        // Adiciona uma classe para você poder estilizar o botão no CSS
        botaoAlternativa.classList.add('quiz-opcao-btn'); 
        
        quizOpcoes.appendChild(botaoAlternativa);

        botaoAlternativa.addEventListener('click', () => {
            verificarResposta(indice);
        });
    });
} 

function verificarResposta(indiceClicado) {
    const questao = perguntasQuiz[perguntaAtual];
    const botoes = quizOpcoes.querySelectorAll('button');
    
    if (indiceClicado === questao.correta) {
        pontuacao++;
        quizFeedback.innerText = "Resposta correta!";
        quizFeedback.style.color = "#2ecc71"; 
    } else {
        quizFeedback.innerText = "Resposta incorreta.";
        quizFeedback.style.color = "#e74c3c"; 
    }

    botoes.forEach((botao) => {
        const indiceBotao = Number(botao.dataset.indice);
        botao.disabled = true;

        if (indiceBotao === questao.correta) {
            botao.classList.add('correta'); 
        } else if (indiceBotao === indiceClicado) {
            botao.classList.add('errada'); 
        }
    });
    
    // DESBLOQUEIO: Agora que o usuário respondeu, o botão de avançar aparece na tela!
    quizProximo.style.display = "block";
}        

function mostrarResultado() {
    quizConteudo.style.display = "none";
    quizResultado.style.display = "block";
    
    // Exibe o resultado final com a pontuação acumulada
    quizPontuacao.innerHTML = `Você concluiu a simulação do <strong>TERRASHIELD</strong>!<br><br>Sua pontuação final foi: <strong>${pontuacao}</strong> de <strong>${perguntasQuiz.length}</strong> acertos.`;
} 

// ==========================================
// 5. EVENTOS DO SISTEMA
// ==========================================

quizProximo.addEventListener('click', () => {
    perguntaAtual++;

    if (perguntaAtual < perguntasQuiz.length) {
        carregarPergunta();
    } else {
        mostrarResultado();
    }
});

quizReiniciar.addEventListener('click', () => {
    perguntaAtual = 0;
    pontuacao = 0;
    carregarPergunta();
});

// ==========================================
// 6. INICIALIZAÇÃO
// ==========================================
carregarPergunta();