// ========================================
// OBJETO PRINCIPAL DO JOGADOR
// ========================================
const jogador = {
    nome: "Aventureiro",
    nivel: 1,
    xpAtual: 0,
    sp: 0, // Skill Points disponíveis para distribuir
    spPorNivel: 5, // Quantos SP ganha por level up
    
    // Multiplicador para calcular XP necessário
    multiplicadorXP: 1.5,
    xpBase: 100, // XP necessário para subir do level 1 para 2
    
    // Atributos (vamos usar depois)
    atributos: {
        forca: 0,
        inteligencia: 0,
        vitalidade: 0,
        agilidade: 0,
        sorte: 0
    }
};

// ========================================
// FUNÇÃO: CALCULAR XP NECESSÁRIO
// ========================================
function calcularXPNecessario(nivel) {
    // Formula: xpBase × (multiplicador ^ (nivel - 1))
    // Exemplo: 
    // Level 1→2: 100 × (1.5 ^ 0) = 100
    // Level 2→3: 100 × (1.5 ^ 1) = 150
    // Level 3→4: 100 × (1.5 ^ 2) = 225
    
    return Math.floor(jogador.xpBase * Math.pow(jogador.multiplicadorXP, nivel - 1));
}

// ========================================
// FUNÇÃO: GANHAR XP
// ========================================
function ganharXP(quantidade) {
    console.log(`💫 Ganhou ${quantidade} XP!`);
    
    jogador.xpAtual += quantidade;
    
    // Verifica se subiu de nível (pode subir vários!)
    let subiu = false;
    while (jogador.xpAtual >= calcularXPNecessario(jogador.nivel)) {
        subirDeNivel();
        subiu = true;
    }
    
    // Atualiza a interface visual
    if (typeof atualizarInterfaceJogador === 'function') {
        atualizarInterfaceJogador();
    }
    
    return subiu;
}

// ========================================
// FUNÇÃO: SUBIR DE NÍVEL
// ========================================
function subirDeNivel() {
    const xpNecessario = calcularXPNecessario(jogador.nivel);
    
    // Remove o XP usado para subir
    jogador.xpAtual -= xpNecessario;
    
    // Aumenta o nível
    jogador.nivel++;
    
    // Ganha SP
    jogador.sp += jogador.spPorNivel;
    
    console.log(`🎉 LEVEL UP! Agora você é nível ${jogador.nivel}`);
    console.log(`⭐ Você ganhou ${jogador.spPorNivel} SP! Total: ${jogador.sp} SP`);

    if (typeof mostrarAnimacaoLevelUp === 'function') {
        mostrarAnimacaoLevelUp(jogador.nivel, jogador.spPorNivel);
    }
    
    // Aqui você pode adicionar efeitos visuais depois
    // mostrarAnimacaoLevelUp();
}

// ========================================
// FUNÇÃO DEBUG: MUDAR RARIDADE MANUALMENTE
// (Remover quando implementar o sistema de Strike)
// ========================================
function debugMudarRaridade(idMissao, novaRaridade) {
    const missao = missoes.find(m => m.id === idMissao);
    if (!missao) {
        console.log('❌ Missão não encontrada!');
        return;
    }
    
    if (!SISTEMA_RARIDADE[novaRaridade]) {
        console.log('❌ Raridade inválida! Use: comum, raro, epico, lendario');
        return;
    }
    
    missao.raridade = novaRaridade;
    console.log(`🔧 DEBUG: Missão "${missao.titulo}" agora é ${novaRaridade}`);
    
    // Atualiza visualmente a missão
    const missaoElement = document.querySelector(`[data-id="${idMissao}"]`);
    if (missaoElement) {
        const raridade = SISTEMA_RARIDADE[novaRaridade];
        
        // Atualiza borda e sombra
        missaoElement.style.borderColor = raridade.cor;
        missaoElement.style.boxShadow = raridade.shadow;
        
        // Atualiza ícone
        const iconElement = missaoElement.querySelector('.conteiner-icon');
        iconElement.style.backgroundImage = `url(${raridade.icone})`;
        iconElement.style.backgroundColor = raridade.cor;
        iconElement.style.boxShadow = raridade.iconShadow;
        
        // Atualiza texto de raridade
        const raridadeElement = missaoElement.querySelector('.rarity-title span');
        raridadeElement.textContent = raridade.nome;
        raridadeElement.parentElement.style.backgroundColor = raridade.cor;
        
        // Atualiza XP
        const xpElement = missaoElement.querySelector('.xp-number');
        xpElement.textContent = `+ ${raridade.xp}`;
    }
}

// ========================================
// FUNÇÃO: OBTER STATUS DO JOGADOR
// ========================================
function obterStatusJogador() {
    const xpNecessario = calcularXPNecessario(jogador.nivel);
    const porcentagemXP = (jogador.xpAtual / xpNecessario) * 100;
    
    return {
        nivel: jogador.nivel,
        xpAtual: jogador.xpAtual,
        xpNecessario: xpNecessario,
        porcentagemXP: porcentagemXP,
        spDisponivel: jogador.sp,
        proximoNivel: jogador.nivel + 1
    };
}

// ========================================
// LOG INICIAL (para debug)
// ========================================
console.log('✅ Sistema de jogador carregado!');
console.log(`👤 ${jogador.nome} - Level ${jogador.nivel}`);
console.log(`📊 XP: ${jogador.xpAtual}/${calcularXPNecessario(jogador.nivel)}`);