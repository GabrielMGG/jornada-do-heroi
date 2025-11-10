const missoes = [];
let menuAberto = null;

document.addEventListener('DOMContentLoaded', function(){
    const form = document.querySelector('.form');
    form.addEventListener('submit', function(evento){
        evento.preventDefault();
        salvarMissao();
    });
});

const SISTEMA_RARIDADE = {
    comum: {
        nome:'Comum',
        cor: '#485870',
        corClara: '#5e708a',
        shadow: '1px 10px 25px -1px rgba(72, 88, 112, 0.3), 1px 8px 10px -1px rgb(72 88 112 / 0.3)',
        iconShadow: '0 8px 15px -3px rgba(72, 88, 112, 0.3), 0 4px 6px -4px rgb(72 88 112 / 0.3)',
        icone: 'assets/imagens/icons-raridade/sword.svg',
        xp: 10,
        mutiplicador: 1 ,
    },
    raro: {
        nome:'Raro',
        cor: '#1861fd',
        corClara: '#287bff',
        shadow: '1px 10px 25px -1px rgba(24, 97, 253, 0.3), 1px 8px 10px -1px rgb(24 97 253 / 0.3)',
        iconShadow: '0 8px 15px -3px rgba(24, 97, 253, 0.3), 0 4px 6px -4px rgb(24 97 253 / 0.3)',
        icone: 'assets/imagens/icons-raridade/moon-star.svg',
        xp: 25,
        mutiplicador: 1.5 ,
    },
    epico: {
        nome:'Épico',
        cor: '#9b1bfc',
        corClara: '#aa42ff',
        shadow: '1px 10px 25px -1px rgba(155, 27, 252, 0.3), 1px 8px 10px -1px rgb(155 27 252 / 0.3)',
        iconShadow: '0 8px 15px -3px rgba(155, 27, 252, 0.3), 0 4px 6px -4px rgb(155 27 252 / 0.3)',
        icone: 'assets/imagens/icons-raridade/star.svg',
        xp: 50,
        mutiplicador: 2,
    },
    lendario: {
        nome:'Lendário',
        cor: '#F59E0B',
        corClara: '#FBBF24',
        shadow: '1px 10px 25px -1px rgba(245, 158, 11, 0.3), 1px 8px 10px -1px rgb(245 158 11 / 0.3)',
        iconShadow: '0 8px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -4px rgb(245 158 11 / 0.3)',
        icone: 'assets/imagens/icons-raridade/crown.svg',
        xp: 100,
        mutiplicador: 3,
    },
};

function getDiaSemanaAtual() {
    const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const hoje = new Date().getDay();
    return dias[hoje];
}

const diasMap = {
    'seg': 'Seg', 'ter': 'Ter', 'qua': 'Qua', 
    'qui': 'Qui', 'sex': 'Sex', 'sab': 'Sáb', 'dom': 'Dom'
};

function salvarMissao(){
    const form = document.querySelector('.form');

    const tituloInput = form.querySelector('input[name="titulo"]');
    const descricaoInput = form.querySelector('textarea[name="descricao"]');
    const tipoSelecionado = form.querySelector('input[name="tipo"]:checked');

    const titulo = tituloInput.value;
    const descricao = descricaoInput.value;
    const tipo = tipoSelecionado.value;

    const erros = [];

    if(titulo === '' || titulo === null || titulo === undefined){
        erros.push('Título é obrigatório')
    }
    if(titulo.length < 3){
        erros.push('Título precisa ter pelo menos 3 caracteres');
    }
    if(titulo.length > 30){
        erros.push('Título muito longo (máx. 30 caracteres)')
    }
    if(erros.length > 0){
        alert('Erros:\n' + erros.join('\n'));
        return;
    }

    const subQuests = [];
    const subQuestInputs = document.querySelectorAll('.subquest-input');
    subQuestInputs.forEach(input => {
        if (input.value.trim() !== '') {
            subQuests.push({
                titulo: input.value.trim(),
                concluida: false
            });
        }
    });

    const diasSelecionados = [];
    const diasCheckboxes = document.querySelectorAll('input[name="dias"]:checked');
    diasCheckboxes.forEach(checkbox => {
        diasSelecionados.push(checkbox.value);
    });

    let modoSubquests = 'livre';
    const modoSelecionado = form.querySelector('input[name="modoSubquests"]:checked');
    if (modoSelecionado) {
        modoSubquests = modoSelecionado.value;
    }

    const novaMissao = {
        id: Date.now(),
        titulo: titulo,
        descricao: descricao,
        tipo: tipo,
        raridade: 'comum',
        concluida: false,
        subQuests: subQuests,
        diasSelecionados: diasSelecionados,
        modoSubquests: tipo === 'Principal' ? modoSubquests : 'livre'
    };

    missoes.push(novaMissao);

    form.reset();
    document.getElementById('modal-1').close();

    criarMissao(novaMissao);
}

function criarMissao(missaoData){
    const templateQuest = document.getElementById('template-quest');
    const templateContent = templateQuest.content;
    const novaMissaoElement = templateContent.cloneNode(true);

    const raridade = SISTEMA_RARIDADE[missaoData.raridade || 'comum'];

    const questItem = novaMissaoElement.querySelector('.conteiner-quest');
    questItem.style.borderColor = raridade.cor;
    questItem.style.boxShadow = raridade.shadow;

    const tituloElement = novaMissaoElement.querySelector('.title-habit');
    tituloElement.textContent = missaoData.titulo;

    const descricaoElement = novaMissaoElement.querySelector('.description-quest')
    descricaoElement.textContent = missaoData.descricao;

    const tipoElement  = novaMissaoElement.querySelector('.type-title span');
    tipoElement.textContent = missaoData.tipo;

    const diasDisplay = novaMissaoElement.querySelector('.dias-semana-display');
    if (missaoData.tipo === 'Semanal' && missaoData.diasSelecionados && missaoData.diasSelecionados.length > 0) {
        diasDisplay.style.display = 'block';
        
        const barraProgresso = novaMissaoElement.querySelector('.progresso-dias');
        const contadorDias = novaMissaoElement.querySelector('.contador-dias');
        const diasMarcados = novaMissaoElement.querySelector('.dias-marcados');
        
        const diaAtual = getDiaSemanaAtual();
        
        missaoData.diasSelecionados.forEach(dia => {
            const diaElement = document.createElement('span');
            diaElement.className = 'dia-marcado';
            diaElement.textContent = diasMap[dia];
            
            if (dia === diaAtual) {
                diaElement.classList.add('dia-ativo');
            } else {
                diaElement.classList.add('dia-inativo');
            }
            
            diasMarcados.appendChild(diaElement);
        });
        
        const diasConcluidos = 0;
        const totalDias = missaoData.diasSelecionados.length;
        const porcentagem = 0;
        
        barraProgresso.style.width = `${porcentagem}%`;
        contadorDias.textContent = `${diasConcluidos}/${totalDias} dias`;
        
        missaoData.progressoSemanal = {
            diasConcluidos: diasConcluidos,
            totalDias: totalDias,
            diasConcluidosLista: []
        };
    }

    const subquestsDisplay = novaMissaoElement.querySelector('.subquests-display');
    if (missaoData.tipo === 'Principal' && missaoData.subQuests && missaoData.subQuests.length > 0) {
        subquestsDisplay.style.display = 'block';
        
        const contadorSubquests = novaMissaoElement.querySelector('.contador-subquests');
        const barraProgresso = novaMissaoElement.querySelector('.progresso-subquests-barra');
        const contadorBarra = novaMissaoElement.querySelector('.contador-subquests-barra');
        const listaSubquests = novaMissaoElement.querySelector('.lista-subquests');
        
        const concluidas = missaoData.subQuests.filter(sq => sq.concluida).length;
        const total = missaoData.subQuests.length;
        const porcentagem = total > 0 ? (concluidas / total) * 100 : 0;
        
        contadorSubquests.textContent = `(${concluidas}/${total})`;
        contadorBarra.textContent = `${concluidas}/${total} concluídas`;
        barraProgresso.style.width = `${porcentagem}%`;
        
        listaSubquests.innerHTML = '';
        missaoData.subQuests.forEach((subquest, index) => {
            const subquestElement = document.createElement('div');
            
            let bloqueada = false;
            if (missaoData.modoSubquests === 'sequencial' && index > 0) {
                const anteriorConcluida = missaoData.subQuests[index - 1].concluida;
                if (!anteriorConcluida) {
                    bloqueada = true;
                }
            }
            
            subquestElement.className = `subquest-item-display ${subquest.concluida ? 'concluida' : ''} ${bloqueada ? 'bloqueada' : ''}`;
            
            subquestElement.innerHTML = `
                <span class="numero-subquest">${index + 1}.</span>
                <span class="texto-subquest">${subquest.titulo}</span>
                <span class="status-subquest">${subquest.concluida ? '✅' : (bloqueada ? '🔒' : '⏳')}</span>
            `;
            
            listaSubquests.appendChild(subquestElement);
        });
    }

    const raridadeElement = novaMissaoElement.querySelector('.rarity-title span');
    raridadeElement.textContent = raridade.nome;
    raridadeElement.parentElement.style.backgroundColor = raridade.cor;

    const iconElement = novaMissaoElement.querySelector('.conteiner-icon');
    iconElement.style.backgroundImage = `url(${raridade.icone})`;
    iconElement.style.backgroundColor = raridade.cor;
    iconElement.style.boxShadow = raridade.iconShadow;

    const xpElement = novaMissaoElement.querySelector('.xp-number');
    xpElement.textContent = `+ ${raridade.xp}`;

    const conteiner = document.querySelector('.current-quest')
    conteiner.appendChild(novaMissaoElement);

    questItem.setAttribute('data-id', missaoData.id);

}

// 🔴 EVENT LISTENER COMPLETAMENTE CORRIGIDO
document.addEventListener('click', function(event){
    // Concluir missão
    if(event.target.classList.contains('quest-concluida')){
        const missaoElement = event.target.closest('.conteiner-quest')
        const idMissao = missaoElement.getAttribute('data-id');
        completarMissao(parseInt(idMissao))
    }
    
    // Completar sub quest
    if (event.target.classList.contains('texto-subquest')) {
        const subquestElement = event.target.closest('.subquest-item-display');
        const missaoElement = subquestElement.closest('.conteiner-quest');
        const idMissao = missaoElement.getAttribute('data-id');
        completarSubQuest(parseInt(idMissao), event.target.textContent);
    }

    // 🔴 DETECTAR CLIQUE NO BOTÃO OPTIONS
    const btnOptions = event.target.closest('.btn-options');
    if (btnOptions) {
        event.stopPropagation();
        const missaoElement = btnOptions.closest('.conteiner-quest');
        const idMissao = missaoElement.getAttribute('data-id');
        toggleMenu(event, parseInt(idMissao));
        return;
    }
    
    // 🔴 DETECTAR CLIQUE NOS ITENS DO MENU
    if (event.target.classList.contains('btn-editar')) {
        event.stopPropagation();
        const missaoElement = event.target.closest('.conteiner-quest');
        const idMissao = missaoElement.getAttribute('data-id');
        editarMissao(parseInt(idMissao));
        return;
    }
    
    if (event.target.classList.contains('btn-deletar')) {
        event.stopPropagation();
        const missaoElement = event.target.closest('.conteiner-quest');
        const idMissao = missaoElement.getAttribute('data-id');
        deletarMissao(parseInt(idMissao));
        return;
    }
    
    // Fechar menu ao clicar fora
    if (menuAberto && !menuAberto.contains(event.target)) {
        menuAberto.style.display = 'none';
        menuAberto = null;
    }
});

function completarMissao(idMissao){
    const missao = missoes.find(m => m.id === idMissao);
    const xpMissao = SISTEMA_RARIDADE[missao.raridade].xp;
    
    if(missao){
        // VERIFICAR SE É MISSÃO PRINCIPAL COM SUB-QUESTS INCOMPLETAS
        if (missao.tipo === 'Principal' && missao.subQuests && missao.subQuests.length > 0) {
            const subQuestsCompletas = missao.subQuests.filter(sq => sq.concluida).length;
            const totalSubQuests = missao.subQuests.length;
            
            // SE NÃO ESTÃO TODAS COMPLETAS, BLOQUEIA A CONCLUSÃO
            if (subQuestsCompletas < totalSubQuests) {
                alert(' Você precisa completar todas as sub-missões antes de concluir a missão principal!');
                console.log(`🔒 Missão principal bloqueada: ${subQuestsCompletas}/${totalSubQuests} sub-quests completas`);
                return; // Impede a conclusão
            }

        }
        
        // VERIFICAR SE É MISSÃO SEMANAL
        if (missao.tipo === 'Semanal') {
            const diaAtual = getDiaSemanaAtual();
            
            // Verificar se hoje é um dos dias selecionados
            if (missao.diasSelecionados.includes(diaAtual)) {
                
                
                // Inicializar progresso se não existir
                if (!missao.progressoSemanal) {
                    missao.progressoSemanal = {
                        diasConcluidos: 0,
                        totalDias: missao.diasSelecionados.length,
                        diasConcluidosLista: []
                    };
                }

                
                // Verificar se o dia já não foi concluído
                if (!missao.progressoSemanal.diasConcluidosLista.includes(diaAtual)) {
                    ganharXP(xpMissao);
                    // AUMENTAR PROGRESSO
                    missao.progressoSemanal.diasConcluidos++;
                    missao.progressoSemanal.diasConcluidosLista.push(diaAtual);
                    
                    // Atualizar visualmente
                    const missaoElement = document.querySelector(`[data-id="${idMissao}"]`);
                    const barraProgresso = missaoElement.querySelector('.progresso-dias');
                    const contadorDias = missaoElement.querySelector('.contador-dias');
                    const diasMarcados = missaoElement.querySelectorAll('.dia-marcado');
                    
                    const porcentagem = (missao.progressoSemanal.diasConcluidos / missao.progressoSemanal.totalDias) * 100;
                    
                    barraProgresso.style.width = `${porcentagem}%`;
                    contadorDias.textContent = `${missao.progressoSemanal.diasConcluidos}/${missao.progressoSemanal.totalDias} dias`;
                    
                    // 🔴 ATUALIZAR VISUAL DOS DIAS
                    diasMarcados.forEach(diaElement => {
                        const textoDia = diaElement.textContent;
                        const diaAbreviado = Object.keys(diasMap).find(key => diasMap[key] === textoDia);
                        
                        if (missao.progressoSemanal.diasConcluidosLista.includes(diaAbreviado)) {
                            // DIA JÁ CONCLUÍDO - verde
                            diaElement.className = 'dia-marcado dia-concluido';
                        } else if (diaAbreviado === diaAtual) {
                            // DIA ATUAL E NÃO CONCLUÍDO - azul ativo
                            diaElement.className = 'dia-marcado dia-ativo';
                        } else {
                            // OUTRO DIA - cinza desabilitado
                            diaElement.className = 'dia-marcado dia-inativo';
                        }
                    });
                    
                    console.log(`✅ Progresso semanal atualizado: ${missao.progressoSemanal.diasConcluidos}/${missao.progressoSemanal.totalDias}`);
                    
                    // VERIFICAR SE COMPLETOU TODOS OS DIAS
                    if (missao.progressoSemanal.diasConcluidos >= missao.progressoSemanal.totalDias) {
                        // MISSÃO SEMANAL COMPLETA - mover para concluídas
                        missao.concluida = true;
                        missao.dataConclusao = new Date().toISOString();
                        
                        missaoElement.style.opacity = '0.4';
                        missaoElement.querySelector('.quest-concluida').disabled = true;
                        
                        const sectionMissaoMove = document.getElementById('section-missao-concluida');
                        sectionMissaoMove.appendChild(missaoElement);
                        
                        console.log('🎉 Missão semanal concluída!');
                    }
                    
                    return; // Não marcar como concluída ainda
                } else {
                    alert('📅 Este dia já foi concluído esta semana!');
                    return;
                }
            } else {
                alert('❌ Hoje não é um dia válido para esta missão semanal!');
                return;
            }
        }
        
        // SE CHEGOU ATÉ AQUI, PODE CONCLUIR A MISSÃO
        missao.concluida = true;
        missao.dataConclusao = new Date().toISOString();

        
        ganharXP(xpMissao);
        console.log(xpMissao)



        console.log('Missao foi concluida:', missao.titulo);

        const missaoElement = document.querySelector(`[data-id="${idMissao}"]`);
        if(missaoElement){
            missaoElement.style.opacity = '0.4';
            missaoElement.querySelector('.quest-concluida').disabled = true;
        }

        if(missao.concluida === true){
           const sectionMissaoMove = document.getElementById('section-missao-concluida');
           sectionMissaoMove.appendChild(missaoElement); 
           console.log('Missão movida para concluídas!');
           atualizarContadoresMissoes();
        }
    }else{
        console.log('Missao nao foi encontrada no array ID:', idMissao);
    }
}

function completarSubQuest(idMissao, tituloSubQuest) {
    const missao = missoes.find(m => m.id === idMissao);
    const xpMissao = SISTEMA_RARIDADE[missao.raridade].xp
    
    if (missao && missao.subQuests) {
        const subQuestIndex = missao.subQuests.findIndex(sq => sq.titulo === tituloSubQuest);
        const subQuest = missao.subQuests[subQuestIndex];
        
        if (subQuest) {
            if (missao.modoSubquests === 'sequencial' && subQuestIndex > 0) {
                const anteriorConcluida = missao.subQuests[subQuestIndex - 1].concluida;
                if (!anteriorConcluida) {
                    alert('🔒 Você precisa concluir a sub-missão anterior primeiro!');
                    return;
                }
            }
            
            subQuest.concluida = !subQuest.concluida;
            
            const missaoElement = document.querySelector(`[data-id="${idMissao}"]`);
            const listaSubquests = missaoElement.querySelector('.lista-subquests');
            
            listaSubquests.innerHTML = '';
            missao.subQuests.forEach((sq, index) => {
                const subquestElement = document.createElement('div');
                
                let bloqueada = false;
                if (missao.modoSubquests === 'sequencial' && index > 0) {
                    const anteriorConcluida = missao.subQuests[index - 1].concluida;
                    if (!anteriorConcluida) {
                        bloqueada = true;
                    }
                }
                
                subquestElement.className = `subquest-item-display ${sq.concluida ? 'concluida' : ''} ${bloqueada ? 'bloqueada' : ''}`;
                
                subquestElement.innerHTML = `
                    <span class="numero-subquest">${index + 1}.</span>
                    <span class="texto-subquest">${sq.titulo}</span>
                    <span class="status-subquest">${sq.concluida ? '✅' : (bloqueada ? '🔒' : '⏳')}</span>
                `;
                
                listaSubquests.appendChild(subquestElement);
            });
            
            const concluidas = missao.subQuests.filter(sq => sq.concluida).length;
            const total = missao.subQuests.length;
            const porcentagem = total > 0 ? (concluidas / total) * 100 : 0;
            
            missaoElement.querySelector('.contador-subquests').textContent = `(${concluidas}/${total})`;
            missaoElement.querySelector('.contador-subquests-barra').textContent = `${concluidas}/${total} concluídas`;
            missaoElement.querySelector('.progresso-subquests-barra').style.width = `${porcentagem}%`;
            
            if (concluidas >= total && total > 0) {
                missao.concluida = true;
                missao.dataConclusao = new Date().toISOString();
                
            }
            
        }
    }
}

function atualizarVisibilidade (){
    const tipoSelecionado = document.querySelector('input[name="tipo"]:checked').value;
    const dificuldadeGroup = document.querySelector('.dificuldade-group');
    const diaSemana = document.querySelector('.dias-semana-group');
    const subQuest = document.querySelector('.subquests-group');
    const modoSubquestsGroup = document.querySelector('.modo-subquests-group');


    if(tipoSelecionado === 'Diaria'){
        dificuldadeGroup.style.display = 'block';
    } else {
        dificuldadeGroup.style.display = 'none';
    }

    if(tipoSelecionado === 'Semanal'){
        diaSemana.style.display = 'block';
    } else {
        diaSemana.style.display = 'none';
    }

    if(tipoSelecionado === "Principal"){
        subQuest.style.display = 'block';
        if (modoSubquestsGroup) {
            modoSubquestsGroup.style.display = 'block';
        }
    } else {
        subQuest.style.display = 'none';
        if (modoSubquestsGroup) {
            modoSubquestsGroup.style.display = 'none';
        }
        const listaSubquest = document.querySelector('.subquests-list');
        listaSubquest.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const tipoRadios = document.querySelectorAll('input[name="tipo"]');

    tipoRadios.forEach(radio => {
        radio.addEventListener('change', atualizarVisibilidade);
    });

    atualizarVisibilidade();
});

const botaoAddSubquest = document.querySelector('.add-subquest');

botaoAddSubquest.addEventListener('click', function(){
    addInputSubQuest();
});

function addInputSubQuest(){
    
    const listaSubquest = document.querySelector('.subquests-list');
    const subquestsExistentes = listaSubquest.querySelectorAll('.subquest-item');
    const numeroProxima = subquestsExistentes.length + 1;
    
    const novaSubquest = document.createElement('div');
    novaSubquest.className = 'subquest-item';
    
    novaSubquest.innerHTML = ` 
        <input type="text" placeholder="Sub-missão ${numeroProxima}..." class="subquest-input">
        <button type="button" class="remover-subquest">×</button>
    `;
    
    listaSubquest.appendChild(novaSubquest);
    
    const botaoRemover = novaSubquest.querySelector('.remover-subquest');
    botaoRemover.addEventListener('click', function () {
        novaSubquest.remove();
        atualizarNumeracaoSubquests();
    });
    
}

function atualizarNumeracaoSubquests() {
    const listaSubquest = document.querySelector('.subquests-list');
    const todasSubquests = listaSubquest.querySelectorAll('.subquest-item');
    
    todasSubquests.forEach((subquest, index) => {
        const input = subquest.querySelector('.subquest-input');
        const numero = index + 1;
        input.placeholder = `Sub-missão ${numero}...`;
    });
    
}

// 🔴 FUNÇÃO toggleMenu CORRIGIDA(pedi a ia verificar depois essa parte)
function toggleMenu(event, missaoId) {
    event.stopPropagation();
    
    const questActions = event.target.closest('.quest-actions');    
    if (!questActions) {
        console.error(' Elemento .quest-actions não encontrado!');
        return;
    }
    
    const menu = questActions.querySelector('.options-menu');    
    if (!menu) {
        console.error(' Menu .options-menu não encontrado!');
        return;
    }
    
    if (menuAberto && menuAberto !== menu) {
        menuAberto.style.display = 'none';
    }
    
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
        menuAberto = null;
    } else {
        menu.style.display = 'block';
        menuAberto = menu;
    }
    
}

// Fecha meu menu ao clicar fora (JÁ ESTÁ NO EVENT LISTENER PRINCIPAL)

function editarMissao(idMissao) {
    const missao = missoes.find(m => m.id === idMissao);
    if (!missao) return;
    
    
    const modal = document.getElementById('modal-1');
    const form = modal.querySelector('.form');
    
    form.querySelector('input[name="titulo"]').value = missao.titulo;
    form.querySelector('textarea[name="descricao"]').value = missao.descricao || '';
    
    const tipoRadio = form.querySelector(`input[name="tipo"][value="${missao.tipo}"]`);
    if (tipoRadio) tipoRadio.checked = true;
    
    if (missao.tipo === 'Semanal' && missao.diasSelecionados) {
        missao.diasSelecionados.forEach(dia => {
            const checkbox = form.querySelector(`input[name="dias"][value="${dia}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    if (missao.tipo === 'Principal' && missao.subQuests) {
        const listaSubquest = form.querySelector('.subquests-list');
        listaSubquest.innerHTML = '';
        
        missao.subQuests.forEach((subquest, index) => {
            const novaSubquest = document.createElement('div');
            novaSubquest.className = 'subquest-item';
            novaSubquest.innerHTML = ` 
                <input type="text" value="${subquest.titulo}" class="subquest-input">
                <button type="button" class="remover-subquest">×</button>
            `;
            listaSubquest.appendChild(novaSubquest);
        });
    }
    
    if (missao.tipo === 'Principal') {
        const modoRadio = form.querySelector(`input[name="modoSubquests"][value="${missao.modoSubquests || 'livre'}"]`);
        if (modoRadio) modoRadio.checked = true;
    }
    
    atualizarVisibilidade();
    
    if (menuAberto) {
        menuAberto.style.display = 'none';
        menuAberto = null;
    }
    
    deletarMissao(idMissao, false);
    
    modal.showModal();
}

function deletarMissao(idMissao, confirmar = true) {
    if (confirmar) {
        const confirmacao = confirm('Tem certeza que deseja deletar esta missão?');
        if (!confirmacao) return;
    }
    
    const index = missoes.findIndex(m => m.id === idMissao);
    if (index !== -1) {
        missoes.splice(index, 1);
    }
    
    const missaoElement = document.querySelector(`[data-id="${idMissao}"]`);
    if (missaoElement) {
        missaoElement.remove();
    }
    
    
    if (menuAberto) {
        menuAberto.style.display = 'none';
        menuAberto = null;
    }
}

const openButtons = document.querySelectorAll('.open-modal');

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);

        const radioDiaria = document.querySelector('input[name="tipo"][value="Diaria"]');
        if (radioDiaria) {
            radioDiaria.checked = true;
        }
        
        const listaSubquest = document.querySelector('.subquests-list');
        if (listaSubquest) {
            listaSubquest.innerHTML = '';
        }
        
        const radioLivre = document.querySelector('input[name="modoSubquests"][value="livre"]');
        if (radioLivre) {
            radioLivre.checked = true;
        }
        
        if (typeof atualizarVisibilidade === 'function') {
            atualizarVisibilidade();
        }

        modal.showModal();
    });
});

