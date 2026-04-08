const ctx1 = document.getElementById("meuRadar");

//VAI PEGAR OS ATRIBUTOS DO JOGADOR//

const graficoForca = jogador.atributos.forca
const graficoInt = jogador.atributos.inteligencia
const graficoAgi = jogador.atributos.agilidade
const graficoVit = jogador.atributos.vitalidade
const graficoSab = jogador.atributos.sabedoria
const graficoCar = jogador.atributos.carisma

new Chart(ctx1, {
  type: "radar",
  data: {
    labels: ["FOR", "INT", "AGI", "VIT", "SAB", "CAR"],
    datasets: [{
      label: "Atributos",
      data: [graficoForca, graficoInt, graficoAgi, graficoVit, graficoSab, graficoCar],
      borderColor: "rgba(0, 255, 255, 0.9)", /* CIANO */
      backgroundColor: "rgba(0, 255, 255, 0.25)", 
      borderWidth: 2,
      pointRadius: 0,
    }]
  },
  options: {
    scales: {
      r: {
        grid: { color: "rgba(255,255,255,0.15)" },
        angleLines: { color: "rgba(255,255,255,0.15)" },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
        pointLabels: {
          color: "#fff",
          font: { size: 14 }
        }
      }
    },
    plugins: { legend: { display: false } }
  }
});