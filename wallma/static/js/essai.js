
// Récupérer l'élément canvas
import Chart from 'chart.js/auto';

const ctx = document.getElementById("myChart1");



const configMainChart={
  type: "bar",
  data: {
    labels: [
      "Semaine 1",
      "Semaine 2",
      "Semaine 3",
      "Semaine 4"
    ],
    datasets: [
      {
        label: "Économies (FCFA)",
        data: [5000, 8000, 6500, 10000],
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,

    plugins: {
      title: {
        display: true,
        text: "Évolution economies",
        align: "start", // 👈 titre à gauche
        font: {
          size: 16,
          weight: "bold"
        },
        padding: {
          bottom: 20
        }
      },

      legend: {
       
      }
    },

    scales: {
     
      y: {
        
        beginAtZero: false,
        min:2000,
      }
    }
  }
};
const economyChart = new Chart(ctx, configMainChart);













const DATA_COUNT = 5;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

const labels = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 90, 12, 60, 43],
      backgroundColor: [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
      ]
    }
  ]
};
const data2 = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};

const config = {
  type: 'doughnut',
  data: data2,
};

const chart2 = new Chart("myChart2", config);





// 2. Définissez la media query que vous souhaitez suivre (par exemple, pour les mobiles)
const mediaQueryMobile = window.matchMedia('(max-width: 1400px)');

// 3. Créez une fonction qui met à jour la position de la légende
function updateLegendPosition(mql) {
  if (mql.matches) {
    // Si l'écran est petit (< 768px), mettez la légende en bas
    chart2.options.plugins.legend.position = 'left';
    chart2.options.plugins.legend.display = true;
  } else {
    // Si l'écran est grand (>= 768px), mettez la légende à droite
    chart2.options.plugins.legend.position = 'bottom';
    chart2.options.plugins.legend.display = false;

  }

  // Très important : Mettez à jour le graphique pour appliquer le changement
  chart2.update();
}

// 4. Écoutez les changements d'état de la media query
mediaQueryMobile.addListener(updateLegendPosition);

// 5. Appelez la fonction une première fois au chargement de la page pour définir la position initiale
updateLegendPosition(mediaQueryMobile);




const para = {
  type: "bar",
  data: {
    labels: ["jan", "fev", "mar"],
    datasets: [
      {
        data: [800, 200, 550],
        borderColor: "rgba(199, 199, 199, 1)",
        backgroundColor: ["rgba(200, 200, 200, 0.2)", "rgba(200, 200, 200, 0.2)", "blue"],
       borderRadius: 12,
        borderSkipped: false,

        // 📏 Largeur des barres
        barPercentage: 0.8,
        categoryPercentage: 0.8
      }],
  },
  options: {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        
        display: true,
        grid: {
          display: false
        },
        
      },
      y: {
        display: false,
        beginAtZero: true,
        max: 800,
        grid: {
          display: false
        }
      },
      
    },
    responsive: true,
    legend: { display: false }
  },

};
new Chart("myChart3", para);
new Chart("myChart4", para);
