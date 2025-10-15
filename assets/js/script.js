    const missoes = [];

    document.addEventListener('DOMContentLoaded', function(){

        const form = document.querySelector('.form');
        form.addEventListener('submit', function(evento){
        evento.preventDefault();
        salvarMissao();
        });
    });
    


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

        const novaMissao = {
            titulo: titulo,
            descricao: descricao,
            tipo: tipo
        };

        missoes.push(novaMissao);

        // RESETA O FORM E FECHA O MODAL //
        form.reset();
        document.getElementById('modal-1').close();

        criarMissao(novaMissao);

    
}

    function criarMissao(missaoData){

        //  Encontrar a ID do TEMPLATE
        const templateQuest = document.getElementById('template-quest');
         console.log(' Template encontrado:', templateQuest);

         //  pegar o conteudo do template
        const templateContent = templateQuest.content;

        //  criar uma nova missao(clonando o  template)
        const novaMissaoElement = templateContent.cloneNode(true);

        const tituloElement = novaMissaoElement.querySelector('.title-habit');
        tituloElement.textContent = missaoData.titulo;

        const descricaoElement = novaMissaoElement.querySelector('.description-quest')
        descricaoElement.textContent = missaoData.descricao;

        const tipoElement  = novaMissaoElement.querySelector('.type-title');
        tipoElement.textContent = missaoData.tipo;


        //  encontrar onde colocar a missao
        const conteiner = document.querySelector('.current-quest')

        //  vai add a quest ao conteiner
        conteiner.appendChild(novaMissaoElement);

        console.log('Template clonado e adicionado!');
        
        
    }











                   /* ABRIR MODAL*/
    const openButtons = document.querySelectorAll('.open-modal');

    openButtons.forEach(button => {
        
        button.addEventListener('click', () =>{
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId)

        modal.showModal();
    })

})