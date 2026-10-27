import {Chart} from "chart.js/auto";
const ctx = document.getElementById("myChart1");

const economyChart = new Chart(ctx, {
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
});




const ctx2 = document.getElementById("myChart2").getContext("2d");

const expensesChart = new Chart(ctx2, {
  type: "doughnut",
  data: {
    labels: [
      "Logement",
      "Alimentation",
      "Transport",
      "Loisirs",
      "Autres"
    ],
    datasets: [
      {
        label: "Répartition des dépenses",
        data: [40000, 25000, 15000, 10000, 10000],
        backgroundColor:[  "#FF6384", // rose vif
  "#36A2EB", // bleu vif
  "#FFCE56", // jaune vif
  "#4BC0C0", // turquoise
  "#9966FF", // violet
  "#FF9F40"    ],
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    cutout: "40%", // taille du trou central

    plugins: {
      title: {
        display: true,
        
        font: {
          size: 16,
          weight: "bold"
        },
        padding: {
          bottom: 20
        }
      },

      legend: {
        position: "bottom", // légende à gauche
        labels: {
          padding: 15,
          boxWidth: 14
        }
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);

            return `${context.label} : ${value} FCFA (${percentage}%)`;
          }
        }
      }
    }
  }
});






const ctx3 = document.getElementById("myChart3").getContext("2d");

new Chart(ctx3, {
  type: "bar",
  data: {
    labels: ["Janvier", "Février", "Mars"],
    datasets: [
      {
        label: "Économies",
        data: [12000, 18000, 15000],

        // 🎨 Couleur
        backgroundColor: "#36A2EB",

        // 🟢 Bords arrondis
        borderRadius: 12,
        borderSkipped: false,

        // 📏 Largeur des barres
        barPercentage: 0.6,
        categoryPercentage: 0.5
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio:false,

    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        
        font: { size: 16, weight: "bold" }
      }
    },

    scales: {
      y: {
        display: false // ❌ axe Y masqué
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }
});
