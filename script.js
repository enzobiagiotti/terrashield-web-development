// ── TERRASHIELD — Web Development JavaScript ────────────────────────────
// Enzo Biagiotti · RM568894 — Slideshow, Troca de Tema, Formulário
// Leonardo Novaes · RM570991 — Quiz

// ════════════════════════════════════════════════
// 1. SLIDESHOW
// ════════════════════════════════════════════════
const slides     = document.querySelectorAll('.slide');
const btnPrev    = document.querySelector('.slide-prev');
const btnNext    = document.querySelector('.slide-next');
const indicators = document.querySelectorAll('.slide-indicator');
let currentSlide = 0;
let autoPlay;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  indicators[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  indicators[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoPlay() {
  autoPlay = setInterval(nextSlide, 4000);
}

function resetAutoPlay() {
  clearInterval(autoPlay);
  startAutoPlay();
}

if (slides.length > 0) {
  btnNext.addEventListener('click', function () { nextSlide(); resetAutoPlay(); });
  btnPrev.addEventListener('click', function () { prevSlide(); resetAutoPlay(); });
  indicators.forEach(function (ind, i) {
    ind.addEventListener('click', function () { goToSlide(i); resetAutoPlay(); });
  });
  startAutoPlay();
}

// ════════════════════════════════════════════════
// 2. TROCA DE TEMA
// ════════════════════════════════════════════════
const temaButtons = document.querySelectorAll('.tema-btn');

const temas = {
  padrao: {
    '--areia':        '#F5EFE6',
    '--areia-escura': '#E8DDD0',
    '--floresta':     '#2C3E30',
    '--floresta-mid': '#3D5244',
    '--musgo':        '#7A8C7E',
    '--agua':         '#7AAFC4',
    '--agua-clara':   '#B8D4E0',
    '--brasa':        '#C7624A',
    '--terra':        '#C8A882',
    '--terra-escura': '#9A7B58',
    '--branco':       '#FDFBF9',
  },
  noite: {
    '--areia':        '#1A1F1B',
    '--areia-escura': '#242C25',
    '--floresta':     '#0D1410',
    '--floresta-mid': '#1A2A1C',
    '--musgo':        '#4A5C4D',
    '--agua':         '#4A8FA8',
    '--agua-clara':   '#2A5A6E',
    '--brasa':        '#A04535',
    '--terra':        '#8A6840',
    '--terra-escura': '#6A5030',
    '--branco':       '#D0CCC8',
  },
  alerta: {
    '--areia':        '#FFF8F0',
    '--areia-escura': '#FFE8CC',
    '--floresta':     '#4A1A00',
    '--floresta-mid': '#6A2A00',
    '--musgo':        '#8A5A3A',
    '--agua':         '#5A90A8',
    '--agua-clara':   '#C8E0EA',
    '--brasa':        '#E03010',
    '--terra':        '#D4903A',
    '--terra-escura': '#B07020',
    '--branco':       '#FFFAF5',
  }
};

function aplicarTema(nome) {
  const tema = temas[nome];
  const root = document.documentElement;
  Object.keys(tema).forEach(function (prop) {
    root.style.setProperty(prop, tema[prop]);
  });
  temaButtons.forEach(function (btn) {
    btn.classList.remove('ativo');
    if (btn.dataset.tema === nome) btn.classList.add('ativo');
  });
  localStorage.setItem('terrashield-tema', nome);
}

temaButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    aplicarTema(btn.dataset.tema);
  });
});

const temaSalvo = localStorage.getItem('terrashield-tema');
if (temaSalvo && temas[temaSalvo]) {
  aplicarTema(temaSalvo);
}

// ════════════════════════════════════════════════
// 3. FORMULÁRIO COM VALIDAÇÃO
// ════════════════════════════════════════════════
const form         = document.getElementById('contato-form');
const formMensagem = document.getElementById('form-mensagem');

function mostrarErro(campo, msg) {
  const erro = document.getElementById('erro-' + campo);
  if (erro) {
    erro.textContent = msg;
    erro.style.display = 'block';
  }
  const input = document.getElementById(campo);
  if (input) input.classList.add('campo-erro');
}

function limparErro(campo) {
  const erro = document.getElementById('erro-' + campo);
  if (erro) {
    erro.textContent = '';
    erro.style.display = 'none';
  }
  const input = document.getElementById(campo);
  if (input) input.classList.remove('campo-erro');
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  form.querySelectorAll('input, select, textarea').forEach(function (campo) {
    campo.addEventListener('input', function () {
      limparErro(campo.id);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valido = true;

    const nome  = document.getElementById('nome');
    const email = document.getElementById('email');
    const tipo  = document.getElementById('tipo');
    const msg   = document.getElementById('mensagem');

    ['nome', 'email', 'tipo', 'mensagem'].forEach(limparErro);

    if (!nome.value.trim()) {
      mostrarErro('nome', 'Por favor, informe seu nome.');
      valido = false;
    }

    if (!email.value.trim()) {
      mostrarErro('email', 'Por favor, informe seu e-mail.');
      valido = false;
    } else if (!validarEmail(email.value.trim())) {
      mostrarErro('email', 'E-mail inválido. Use o formato: nome@exemplo.com');
      valido = false;
    }

    if (!tipo.value) {
      mostrarErro('tipo', 'Selecione seu perfil.');
      valido = false;
    }

    if (!msg.value.trim()) {
      mostrarErro('mensagem', 'Por favor, escreva sua mensagem.');
      valido = false;
    } else if (msg.value.trim().length < 10) {
      mostrarErro('mensagem', 'Mensagem muito curta. Escreva pelo menos 10 caracteres.');
      valido = false;
    }

    if (valido) {
      formMensagem.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
      formMensagem.className = 'form-msg sucesso';
      form.reset();
      setTimeout(function () {
        formMensagem.textContent = '';
        formMensagem.className = 'form-msg';
      }, 5000);
    } else {
      formMensagem.textContent = 'Por favor, corrija os campos destacados.';
      formMensagem.className = 'form-msg erro';
    }
  });
}

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