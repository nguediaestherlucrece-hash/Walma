import Chart from 'chart.js/auto';

// Récupérer l'élément canvas
const ctx = document.getElementById('myChart1');

// Données du graphique
const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const yValues = [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478];

// Création du graphique
const chart1 = new Chart(ctx, {
  type: 'line',
  data: {
    labels: xValues,
    datasets: [{
      data: yValues,
      borderColor: 'red',
      fill: false
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false // tu peux le mettre à true si tu veux afficher la légende
      }
    }
  }
});
