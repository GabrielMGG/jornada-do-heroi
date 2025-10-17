const missoes = [];

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
        xp: '10',
        mutiplicador: '1' ,
    },
    raro: {
        nome:'Raro',
        cor: '#1861fd',
        corClara: '#287bff',
        shadow: '1px 10px 25px -1px rgba(24, 97, 253, 0.3), 1px 8px 10px -1px rgb(24 97 253 / 0.3)',
        iconShadow: '0 8px 15px -3px rgba(24, 97, 253, 0.3), 0 4px 6px -4px rgb(24 97 253 / 0.3)',
        icone: 'assets/imagens/icons-raridade/moon-star.svg',
        xp: '25',
        mutiplicador: '1.5' ,
    },
    epico: {
        nome:'Épico',
        cor: '#9b1bfc',
        corClara: '#aa42ff',
        shadow: '1px 10px 25px -1px rgba(155, 27, 252, 0.3), 1px 8px 10px -1px rgb(155 27 252 / 0.3)',
        iconShadow: '0 8px 15px -3px rgba(155, 27, 252, 0.3), 0 4px 6px -4px rgb(155 27 252 / 0.3)',
        icone: 'assets/imagens/icons-raridade/star.svg',
        xp: '50',
        mutiplicador: '2' ,
    },
    lendario: {
        nome:'Lendário',
        cor: '#F59E0B',
        corClara: '#FBBF24',
        shadow: '1px 10px 25px -1px rgba(245, 158, 11, 0.3), 1px 8px 10px -1px rgb(245 158 11 / 0.3)',
        iconShadow: '0 8px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -4px rgb(245 158 11 / 0.3)',
        icone: 'assets/imagens/icons-raridade/crown.svg',
        xp: '100',
        mutiplicador: '3' ,
    },
};

function salvarMissao(){
    const form = document.querySelector('.form');

    // Pegar valores COM VERIFICAÇÃO
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

    // PEGAR SUB QUESTS
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

    // PEGAR DIAS DA SEMANA
    const diasSelecionados = [];
    const diasCheckboxes = document.querySelectorAll('input[name="dias"]:checked');
    diasCheckboxes.forEach(checkbox => {
        diasSelecionados.push(checkbox.value);
    });

    const novaMissao = {
        id: Date.now(),
        titulo: titulo,
        descricao: descricao,
        tipo: tipo,
        raridade: 'comum',
        concluida: false,
        // ADICIONAR SUB QUESTS E DIAS
        subQuests: subQuests,
        diasSelecionados: diasSelecionados
    };

    missoes.push(novaMissao);

    // RESETA O FORM E FECHA O MODAL
    form.reset();
    document.getElementById('modal-1').close();

    criarMissao(novaMissao);
}

function criarMissao(missaoData){
    // Encontrar a ID do TEMPLATE
    const templateQuest = document.getElementById('template-quest');
    
    // pegar o conteudo do template
    const templateContent = templateQuest.content;

    // criar uma nova missao(clonando o template)
    const novaMissaoElement = templateContent.cloneNode(true);

    // aqui vai pegar a config da raridade
    const raridade = SISTEMA_RARIDADE[missaoData.raridade || 'comum'];

    // Aplicar o sistema de cores e raridade
    const questItem = novaMissaoElement.querySelector('.conteiner-quest');
    questItem.style.borderColor = raridade.cor;
    questItem.style.boxShadow = raridade.shadow;

    const tituloElement = novaMissaoElement.querySelector('.title-habit');
    tituloElement.textContent = missaoData.titulo;

    const descricaoElement = novaMissaoElement.querySelector('.description-quest')
    descricaoElement.textContent = missaoData.descricao;

    const tipoElement  = novaMissaoElement.querySelector('.type-title span');
    tipoElement.textContent = missaoData.tipo;

    // MOSTRAR DIAS DA SEMANA PARA MISSÕES SEMANAIS
    const diasDisplay = novaMissaoElement.querySelector('.dias-semana-display');
    if (missaoData.tipo === 'Semanal' && missaoData.diasSelecionados && missaoData.diasSelecionados.length > 0) {
        diasDisplay.style.display = 'block';
        
        const diasMarcados = novaMissaoElement.querySelector('.dias-marcados');
        const diasMap = {
            'seg': 'Seg', 'ter': 'Ter', 'qua': 'Qua', 
            'qui': 'Qui', 'sex': 'Sex', 'sab': 'Sáb', 'dom': 'Dom'
        };
        
        missaoData.diasSelecionados.forEach(dia => {
            const diaElement = document.createElement('span');
            diaElement.className = 'dia-marcado';
            diaElement.textContent = diasMap[dia];
            diasMarcados.appendChild(diaElement);
        });
    }

    // MOSTRAR SUB QUESTS PARA MISSÕES PRINCIPAIS
    const subquestsDisplay = novaMissaoElement.querySelector('.subquests-display');
    if (missaoData.tipo === 'Principal' && missaoData.subQuests && missaoData.subQuests.length > 0) {
        subquestsDisplay.style.display = 'block';
        
        const contadorSubquests = novaMissaoElement.querySelector('.contador-subquests');
        const listaSubquests = novaMissaoElement.querySelector('.lista-subquests');
        
        const concluidas = missaoData.subQuests.filter(sq => sq.concluida).length;
        const total = missaoData.subQuests.length;
        
        contadorSubquests.textContent = `(${concluidas}/${total})`;
        
        listaSubquests.innerHTML = '';
        missaoData.subQuests.forEach((subquest, index) => {
            const subquestElement = document.createElement('div');
            subquestElement.className = `subquest-item-display ${subquest.concluida ? 'concluida' : ''}`;
            subquestElement.innerHTML = `
                <span class="numero-subquest">${index + 1}.</span>
                <span class="texto-subquest">${subquest.titulo}</span>
                <span class="status-subquest">${subquest.concluida ? '✅' : '⏳'}</span>
            `;
            listaSubquests.appendChild(subquestElement);
        });
    }

    // Atualizar a div do texto raridade
    const raridadeElement = novaMissaoElement.querySelector('.rarity-title span');
    raridadeElement.textContent = raridade.nome;
    raridadeElement.parentElement.style.backgroundColor = raridade.cor;

    // Atualizar o icone da missao
    const iconElement = novaMissaoElement.querySelector('.conteiner-icon');
    iconElement.style.backgroundImage = `url(${raridade.icone})`;
    iconElement.style.backgroundColor = raridade.cor;
    iconElement.style.boxShadow = raridade.iconShadow;

    // xp atualizado baseado na raridade
    const xpElement = novaMissaoElement.querySelector('.xp-number');
    xpElement.textContent = `+ ${raridade.xp}`;

    // encontrar onde colocar a missao
    const conteiner = document.querySelector('.current-quest')

    // vai add a quest ao conteiner
    conteiner.appendChild(novaMissaoElement);

    //ADICIONA DATA-ID NO ELEMENTO HTML
    questItem.setAttribute('data-id', missaoData.id);

    console.log('Template clonado e adicionado!');
}

document.addEventListener('click', function(event){
    //Verificar se o clique foi em um botão de concluir missão
    if(event.target.classList.contains('quest-concluida')){
        // Encontrar a missão pai do botão clicado
        const missaoElement = event.target.closest('.conteiner-quest')

        //PEGAR O ID ÚNICO DA MISSAO
        const idMissao = missaoElement.getAttribute('data-id');
        console.log(' Clicou em completar missão ID:', idMissao);

        // Chamar função para processar conclusão
        completarMissao(parseInt(idMissao))
    }
    
    // COMPLETAR SUB QUEST (clique no texto da sub quest)
    if (event.target.classList.contains('texto-subquest')) {
        const subquestElement = event.target.closest('.subquest-item-display');
        const missaoElement = subquestElement.closest('.conteiner-quest');
        const idMissao = missaoElement.getAttribute('data-id');
        
        completarSubQuest(parseInt(idMissao), event.target.textContent);
    }
});

// FUNÇÃO COMPLETAR MISSÃO
function completarMissao(idMissao){
    // Encontrar a missão no array pelo ID
    const missao = missoes.find(m => m.id === idMissao);

    // Encontra a origen e o destino das missoes quando esta ativa e concluida
    const sectionMissaoOrigen = document.getElementById('section-missao-ativa');
    const sectionMissaoMove = document.getElementById('section-missao-concluida');

    if(missao){
        // Marcar a missao como concluida 
        missao.concluida = true;
        missao.dataConclusao = new Date().toISOString();

        console.log(' Missao foi concluida:', missao.titulo);

        //atualizar visualmente
        const missaoElement = document.querySelector(`[data-id="${idMissao}"]`);
        if(missaoElement){
            missaoElement.style.opacity = '0.4';
            missaoElement.querySelector('.quest-concluida').disabled = true;
        }

        if(missao.concluida === true){
           sectionMissaoMove.appendChild(missaoElement); 
           console.log('Missão movida para concluídas!');
        }

        console.log('agora pode adicionar xp');
    }else{
        console.log('Missao nao foi encontrada no array ID:', idMissao);
    }
}

// FUNÇÃO COMPLETAR SUB QUEST
function completarSubQuest(idMissao, tituloSubQuest) {
    const missao = missoes.find(m => m.id === idMissao);
    
    if (missao && missao.subQuests) {
        const subQuest = missao.subQuests.find(sq => sq.titulo === tituloSubQuest);
        
        if (subQuest) {
            subQuest.concluida = !subQuest.concluida;
            
            // Atualizar visualmente
            const missaoElement = document.querySelector(`[data-id="${idMissao}"]`);
            const subQuestElements = missaoElement.querySelectorAll('.texto-subquest');
            
            subQuestElements.forEach(element => {
                if (element.textContent === tituloSubQuest) {
                    const subQuestElement = element.closest('.subquest-item-display');
                    
                    if (subQuest.concluida) {
                        subQuestElement.classList.add('concluida');
                        subQuestElement.querySelector('.status-subquest').textContent = '✅';
                    } else {
                        subQuestElement.classList.remove('concluida');
                        subQuestElement.querySelector('.status-subquest').textContent = '⏳';
                    }
                    
                    // Atualizar contador
                    const concluidas = missao.subQuests.filter(sq => sq.concluida).length;
                    const total = missao.subQuests.length;
                    missaoElement.querySelector('.contador-subquests').textContent = `(${concluidas}/${total})`;
                    
                    console.log(`Sub quest "${tituloSubQuest}" ${subQuest.concluida ? 'concluída' : 'reaberta'}`);
                }
            });
        }
    }
}

// FUNÇÃO GLOBAL PARA ATUALIZAR VISIBILIDADE
function atualizarVisibilidade (){
    const tipoSelecionado = document.querySelector('input[name="tipo"]:checked').value;
    const dificuldadeGroup = document.querySelector('.dificuldade-group');
    const diaSemana = document.querySelector('.dias-semana-group');
    const subQuest = document.querySelector('.subquests-group');

    console.log('Tipo selecionado:', tipoSelecionado);

    if(tipoSelecionado === 'Diaria'){
        dificuldadeGroup.style.display = 'block';
    } else {
        dificuldadeGroup.style.display = 'none';
    }

    // DIAS DA SEMANA, Mostrar só para "Semanal"
    if(tipoSelecionado === 'Semanal'){
        diaSemana.style.display = 'block';
    } else {
        diaSemana.style.display = 'none';
    }

    // SUB QUESTS, Mostrar só para "Principal" 
    if(tipoSelecionado === "Principal"){
        subQuest.style.display = 'block';
    } else {
        subQuest.style.display = 'none';
        // LIMPAR SUB QUESTS QUANDO MUDAR DE "PRINCIPAL"
        const listaSubquest = document.querySelector('.subquests-list');
        listaSubquest.innerHTML = '';
        console.log('Sub quests limpas');
    }
}

// SISTEMA DE MOSTRAR/OCULTAR SEÇÕES DO MODAL
document.addEventListener('DOMContentLoaded', function(){
    const tipoRadios = document.querySelectorAll('input[name="tipo"]');

    // ADICIONAR EVENTO A TODOS OS RADIOS
    tipoRadios.forEach(radio => {
        radio.addEventListener('change', atualizarVisibilidade);
    });

    // EXECUTAR UMA VEZ AO CARREGAR
    atualizarVisibilidade();
});

// SISTEMA DE SUB-QUESTS
const botaoAddSubquest = document.querySelector('.add-subquest');

// Add evento de clique
botaoAddSubquest.addEventListener('click', function(){
    addInputSubQuest();
});

// Criar função para adicionar input
function addInputSubQuest(){
    console.log(' Clicou para adicionar sub-quest!');
    
    // encontrar onde colocar as sub-quests
    const listaSubquest = document.querySelector('.subquests-list');
    
    //  CONTAR QUANTAS SUB-QUESTS JÁ EXISTEM
    const subquestsExistentes = listaSubquest.querySelectorAll('.subquest-item');
    const numeroProxima = subquestsExistentes.length + 1;
    
    // Criar um novo elemento div
    const novaSubquest = document.createElement('div');
    
    // Adicionar classe pro css
    novaSubquest.className = 'subquest-item';
    
    //  PLACEHOLDER NUMERADO AUTOMATICAMENTE
    novaSubquest.innerHTML = ` 
        <input type="text" placeholder="Sub-missão ${numeroProxima}..." class="subquest-input">
        <button type="button" class="remover-subquest">×</button>
    `;
    
    // Adicionar lista
    listaSubquest.appendChild(novaSubquest);
    
    // Adicionar evento ao botão de remover
    const botaoRemover = novaSubquest.querySelector('.remover-subquest');
    botaoRemover.addEventListener('click', function () {
        console.log(' Clicou para remover sub-quest!');
        novaSubquest.remove();
        
        //  ATUALIZAR NUMERAÇÃO DEPOIS DE REMOVER
        atualizarNumeracaoSubquests();
    });
    
    console.log(`✅ Sub-quest ${numeroProxima} adicionada!`);
}

//  FUNÇÃO PARA ATUALIZAR NUMERAÇÃO
function atualizarNumeracaoSubquests() {
    const listaSubquest = document.querySelector('.subquests-list');
    const todasSubquests = listaSubquest.querySelectorAll('.subquest-item');
    
    //  RENUMERAR TODAS AS SUB-QUESTS
    todasSubquests.forEach((subquest, index) => {
        const input = subquest.querySelector('.subquest-input');
        const numero = index + 1;
        input.placeholder = `Sub-missão ${numero}...`;
    });
    
    console.log(' Numeração atualizada!');
}

// ABRIR MODAL
const openButtons = document.querySelectorAll('.open-modal');

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);

         //  FORÇAR SELECIONAR "DIÁRIA" AO ABRIR MODAL
         const radioDiaria = document.querySelector('input[name="tipo"][value="Diaria"]');
        if (radioDiaria) {
            radioDiaria.checked = true;
            console.log('✅ Diária selecionada ao abrir modal!');
        }
        
        // LIMPAR SUB-QUESTS
        const listaSubquest = document.querySelector('.subquests-list');
        if (listaSubquest) {
            listaSubquest.innerHTML = '';
            console.log('🧹 Sub-quests limpas ao abrir modal!');
        }
        
        // ATUALIZAR VISIBILIDADE
        if (typeof atualizarVisibilidade === 'function') {
            atualizarVisibilidade();
        }

        modal.showModal();
    });
});