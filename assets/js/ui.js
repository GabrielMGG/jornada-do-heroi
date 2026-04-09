// =====================
// TEMA CLARO E ESCURO
// =====================
function temaDarkLight() {
    const htmlRoot = document.documentElement;

    const temaOnOff = document.getElementById("botao-tema");


    if (temaOnOff) {
        temaOnOff.addEventListener("click", function () {

            if (htmlRoot.classList.contains("darktema")) {
                htmlRoot.classList.replace("darktema", "lighttema");
            }
            else {
                htmlRoot.classList.replace("lighttema", "darktema");
            }
            localStorage.setItem("tema-salvo", htmlRoot.className)
        });
    }

}

// ========================================
// MENSAGEM DE ALERTA PRA SP INDISPONIVEL
// ========================================

/**
 * Mostra um alerta personalizado na tela.
 * @param {string} mensagem - O texto que será exibido.
 * @param {number} duracao - Tempo em milissegundos (padrão 3000ms).
 */
function mostrarMensagemErro(mensagem, duracao = 3000) {
    const alerta = document.getElementById('custom-alert');
    const msgSpan = document.getElementById('alerta-mensagem');

    if (!alerta) return;

    // Define a mensagem
    msgSpan.textContent = mensagem;

    // Adiciona a classe 'show' para iniciar a animação de entrada do CSS
    alerta.classList.add('show');

    // Remove a classe após o tempo definido, fazendo o alerta descer/sumir
    setTimeout(() => {
        alerta.classList.remove('show');
    }, duracao);
}

// ========================================
// SISTEMA DE PARTÍCULAS DE XP (EFEITO VISUAL)
// ========================================

/**
 * Efeito de desintegração: Partículas saem de toda a área do card.
 */
function desintegrarCardParaXP(cardElement, cor, quantidadeXP) {
    const QUANTIDADE = 40; // Mais partículas para parecer que o card "quebrou"
    const DURACAO = 1200;
    const rect = cardElement.getBoundingClientRect();
    
    // 1. Mostrar a mensagem de XP (Substitui o alert nativo)
    mostrarXPPopup(rect.left + rect.width / 2, rect.top, quantidadeXP, cor);

    // 2. Localizar a barra de XP para o destino final
    const alvoXP = document.querySelector('.bar-xp');
    if (!alvoXP) return;
    const rectAlvo = alvoXP.getBoundingClientRect();
    const centroAlvoX = rectAlvo.left + (rectAlvo.width / 2);
    const centroAlvoY = rectAlvo.top + (rectAlvo.height / 2);

    // 3. Criar partículas saindo de pontos aleatórios DO CARD
    for (let i = 0; i < QUANTIDADE; i++) {
        const particula = document.createElement('div');
        particula.className = 'xp-particle';
        
        // Posição inicial aleatória dentro dos limites do card
        const startX = rect.left + Math.random() * rect.width;
        const startY = rect.top + Math.random() * rect.height;

        Object.assign(particula.style, {
            backgroundColor: cor,
            boxShadow: `0 0 6px ${cor}`,
            left: `${startX}px`,
            top: `${startY}px`
        });

        document.body.appendChild(particula);

        // Animação de viagem até a barra
        particula.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(1.5)`, opacity: 1, offset: 0.15 },
            { left: `${centroAlvoX}px`, top: `${centroAlvoY}px`, transform: 'scale(0.2)', opacity: 0 }
        ], {
            duration: DURACAO,
            easing: 'ease-in',
            fill: 'forwards'
        });

        setTimeout(() => particula.remove(), DURACAO);
    }
}

/**
 * Mostra o valor de XP ganho flutuando na tela.
 */
function mostrarXPPopup(x, y, valor, cor) {
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = `+${valor} XP`;
    popup.style.color = cor;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.textShadow = `0 0 10px ${cor}`;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
}
// ========================================
// ATUALIZAR INTERFACE DO JOGADOR
// ========================================
function atualizarInterfaceJogador() {
    const status = obterStatusJogador();

    // Atualiza XP atual
    const currentXpElement = document.getElementById('current-xp');
    if (currentXpElement) {
        currentXpElement.textContent = status.xpAtual;
    }

    // Atualiza XP necessário
    const xpRequiredElement = document.getElementById('xp-required');
    if (xpRequiredElement) {
        xpRequiredElement.textContent = status.xpNecessario;
    }

    // Atualiza nível
    const nivelElement = document.querySelector('.number-circle');
    if (nivelElement) {
        nivelElement.textContent = status.nivel;
    }

    // Atualiza barra de XP (visual)
    atualizarBarraXP(status.porcentagemXP);

    // Atualiza textos de level
    atualizarTextosLevel(status.nivel, status.proximoNivel);
}

// ========================================
// ATUALIZAR BARRA VISUAL DE XP
// ========================================
function atualizarBarraXP(porcentagem) {
    const barraXP = document.querySelector('.bar-xp');
    if (!barraXP) return;

    let barraProgresso = barraXP.querySelector('.bar-xp-progresso');
    if (!barraProgresso) {
        barraProgresso = document.createElement('div');
        barraProgresso.className = 'bar-xp-progresso';

        // Estilos para que a barra preencha o fundo sem empurrar o texto
        barraProgresso.style.position = 'absolute';
        barraProgresso.style.left = '0';
        barraProgresso.style.top = '0';
        barraProgresso.style.height = '100%';
        barraProgresso.style.zIndex = '1';

        barraProgresso.style.borderRadius = '20px';
        barraProgresso.style.background = 'linear-gradient(90deg, #00d3f3 0%, #0078f5 100%)';
        barraProgresso.style.transition = 'width 0.5s ease';

        // Inserimos no início do container
        barraXP.prepend(barraProgresso);
    }

    // Atualiza a largura visual
    barraProgresso.style.width = porcentagem + '%';

    // Atualiza o texto "0%" que você colocou no HTML do personagem
    const spanPorcentagem = barraXP.querySelector('.porcentagem');
    if (spanPorcentagem) {
        spanPorcentagem.textContent = Math.floor(porcentagem) + '%';
        spanPorcentagem.style.position = 'relative';
        spanPorcentagem.style.zIndex = '2'; // Garante que o texto fique acima da barra
    }
}

// ========================================
// ATUALIZAR TEXTOS DE LEVEL
// ========================================
function atualizarTextosLevel(nivelAtual, proximoNivel) {
    const currentLvlElement = document.querySelector('.current-lvl');
    if (currentLvlElement) {
        currentLvlElement.textContent = `Level ${nivelAtual}`;
    }

    const nextLvlElement = document.querySelector('.next-lvl');
    if (nextLvlElement) {
        nextLvlElement.textContent = `Level ${proximoNivel}`;
    }
}

// ========================================
// ANIMAÇÃO DE LEVEL UP (simples por enquanto)
// ========================================
function mostrarAnimacaoLevelUp(nivelNovo, spGanho) {
    // Adiciona efeito visual no círculo do nível
    const circulo = document.querySelector('.circle');
    if (circulo) {
        circulo.style.transform = 'scale(1.2)';
        circulo.style.transition = 'transform 0.3s ease';

        setTimeout(() => {
            circulo.style.transform = 'scale(1)';
        }, 300);
    }

    // Mostra mensagem no console (depois você pode fazer um modal bonito)
    console.log(`
    ╔════════════════════════════════════╗
    ║     🎉 LEVEL UP! 🎉               ║
    ║                                    ║
    ║   Você chegou ao nível ${nivelNovo}║
    ║   +${spGanho} Skill Points         ║
    ╚════════════════════════════════════╝
    `);

    // ideias pra adicionar aqui:
    // - Som de level up
    // - Partículas/confetes
    // - Modal mostrando os SP ganhos
}

// ========================================
// ATUALIZAR CONTADORES DE MISSÕES
// ========================================
function atualizarContadoresMissoes() {
    // Conta missões ativas
    const missoesAtivas = missoes.filter(m => !m.concluida).length;
    const ativasElement = document.querySelector('.active-quest span');
    if (ativasElement) {
        ativasElement.textContent = missoesAtivas;
    }

    // Conta missões concluídas
    const missoesConcluidas = missoes.filter(m => m.concluida).length;
    const concluidasElement = document.querySelector('.quest-completed span');
    if (concluidasElement) {
        concluidasElement.textContent = missoesConcluidas;
    }

    // TODO: Implementar sequência (quando fizer o sistema de strike)
}

// ========================================
// INICIALIZAÇÃO DA UI
// ========================================
function inicializarUI() {
    console.log('🎨 Sistema de UI carregado!');

    // Atualiza interface pela primeira vez
    atualizarInterfaceJogador();
    atualizarContadoresMissoes();
    temaDarkLight();
    grafico();
}

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarUI);