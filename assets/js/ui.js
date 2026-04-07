function temaDarkLight(){
    const htmlRoot = document.documentElement;

    const temaOnOff = document.getElementById("botao-tema");
    

    if(temaOnOff){
        temaOnOff.addEventListener("click", function(){

        if(htmlRoot.classList.contains("darktema")){
            htmlRoot.classList.replace("darktema", "lighttema");
        }
        else{
            htmlRoot.classList.replace("lighttema", "darktema");
        }
        localStorage.setItem("tema-salvo", htmlRoot.className)
        });
    }

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
    
    // Se a barra não tem a div interna de progresso, cria
    let barraProgresso = barraXP.querySelector('.bar-xp-progresso');
    if (!barraProgresso) {
        barraProgresso = document.createElement('div');
        barraProgresso.className = 'bar-xp-progresso';
        barraProgresso.style.height = '100%';
        barraProgresso.style.borderRadius = '20px';
        barraProgresso.style.background = 'linear-gradient(90deg, #00d3f3 0%, #0078f5 100%)';
        barraProgresso.style.transition = 'width 0.5s ease';
        barraXP.appendChild(barraProgresso);
    }
    
    // Atualiza largura da barra
    barraProgresso.style.width = porcentagem + '%';
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
}

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarUI);