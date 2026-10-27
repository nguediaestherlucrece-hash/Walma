import { controllers } from 'chart.js';
import { Objectif } from '../modeles/objectif';
import { marked } from 'marked';
import $ from "jquery";
import { Controller } from './controller';
// Récupérer l'élément canvas
import Chart from 'chart.js/auto';
import { Bilan } from '../modeles/bilan';
import { Transaction } from '../modeles/transaction';
import { main } from '@popperjs/core';
import { getDeepResponse } from '../deep';
import { OBJECTIF_TB_NAME, SYSTEM_ROLE_CONSEIL_JOURNALIER } from '../constantes';
import { IDB } from '../IDB/IDB_consummer';
import { formatDate, formatDevise } from '../share';
import { User } from '../modeles/user';
import { deepseekConseilJournalier } from '../utilities';

const welcome=$("#z-welcome")
const cardObjectif = $("#card-objectif");
const intitule = $("#z-intitule-obj");
const dateEcheance = $("#z-date-echeance-obj");
const epargneActuelle = $("#z-epargne-actuelle-obj");
const progressBar = $("#progress-obj");
const pourcentage = $("#z-pourcentage-obj");
const objectifEpargne = $("#z-a-epargner-obj");

const cardEpargne = $("#solde-epargne");
const labelEpargne = $("#z-label-epargne");
const valeurEpargne = $("#z-valeur-epargne");
const evolutionEpargne = $("#z-evolution-epargne");

const cardSolde = $("#solde-card");
const labelSolde = $("#z-label-solde");
const valeurSolde = $("#z-valeur-solde");
const evolutionSolde = $("#z-evolution-solde");

const valeurRevenu = $("#z-valeur-revenu");
const evolutionRevenu = $("#z-evolution-revenu");


const valeurDepense = $("#z-valeur-depense");
const evolutionDepense = $("#z-evolution-depense");

const btnSwitchChart = $("#btn-switch-chart");

const zoneConseilJour = $("#z-conseil-jour");

const mainChartArea = $("#myChart1");
const secondChartArea = $("#myChart2");

const cardRecentEvent = $("#card-recent-events");



let mainChart;
let secondChart;
let bilans;

export  async function insertLastObjectif() {
    const list = await getLastObjectif();
    console.log("salut");
    console.log(list);
    let obj=list[0];

    if (obj) {
        console.log(obj);
        intitule.text(obj.intitule);
        dateEcheance.text("prevu pour le " +obj.dateEcheance );
        epargneActuelle.text(formatDevise(obj.economie));
        progressBar.css("width", parseInt((obj.economie/obj.montant)*100) + "%");
        pourcentage.text(`${parseInt((obj.economie/obj.montant)*100)}%`);
        objectifEpargne.text(formatDevise(obj.montant));
    } else {
        let dynamicContent =
            `<div class="col d-flex flex-column gap-3 justify-content-center align-items-center" style="min-height:165px;" >
                <h5 class="text-center">Commencez par vous fixer un objectif</h5>
                <a href="objectif.html" class="btn btn-outline-primary" style="max-width:400px;width:100%">Commencez</a>
            </div>

        `;
        cardObjectif.empty();
        cardObjectif.append(dynamicContent)
    }
}



async function getLastObjectif() {
    let result= await IDB.getLastElements(1,OBJECTIF_TB_NAME);
    return result;
}

/**
* 
* @param {Number} montant 
* @param {Number} pourcentageEvolution 
*/




/**
* 
* @param {Number} montant 
* @param {Number} pourcentageEvolution 
*/



export async function insertProfilInfo() {

    let percent = 0;
    let profil = JSON.parse(localStorage.getItem("profil"));
    let user= await User.getUser(profil.owner);

    let n=welcome.text();
    
    welcome.text(n+" "+user.nom);

    valeurSolde.text(formatDevise( profil.situation.solde));
    evolutionSolde.text(`+${percent}%`);

    valeurEpargne.text(formatDevise( profil.situation.tEmprunt-profil.situation.tDette));
    evolutionEpargne.text(`+${percent}%`);

    valeurRevenu.text(formatDevise( profil.situation.tRevenu));
    evolutionRevenu.text(`+${percent}%`);

    valeurDepense.text(formatDevise( profil.situation.tDepense));
    evolutionDepense.text(`+${percent}%`);

}

export function optionGraphAddListener() {
    $(".option-graph").on("click", function () {
        let text = $(this).text();
        switch_chart(text);
        btnSwitchChart.text(text);
        mainChart.data.datasets[0].label = text;
        mainChart.update();
    })
}

export async function initialize_repartition_chart() {
    secondChart = new Chart(secondChartArea, await setSecondChartConfig());
}

export async function initialize_evolution_chart() {

    bilans = await Bilan.get_latest_bilan(5);
    console.log("gonna");
    let label = []
    let data = []
    console.log("hey i'm here.");
    for (let i = 0; i < bilans.length; i++) {
        label.push(bilans[i].dateDebut);
        data.push(bilans[i].totalRevenu);
    }
    console.log(data);
    const existingChart = Chart.getChart(mainChartArea);


    if (existingChart) {
        existingChart.destroy();
    }
    mainChart = new Chart(mainChartArea, setMainChartConfig(label, data));
    adaptMainChart();

}

function adaptMainChart() {
    window.addEventListener("resize", function () {
        if (window.innerWidth < 768) {
            console.log("resize");
            mainChart.options.scales.x.ticks.display = false;
            mainChart.update();

        } else {
            mainChart.options.scales.x.ticks.display = true;
            mainChart.update();
        }
    })
}

export async function switch_chart(graphName) {
    let newData = [];
    let cibleData;
    let min;

    if (graphName === "depense")
        cibleData = "totalDepense";
    else if (graphName === "revenu")
        cibleData = "totalRevenu";
    else if (graphName === "epargne")
        cibleData = "totalEpargne"


    for (let i = 0; i < bilans.length; i++) {

        newData.push(bilans[i][cibleData]);
    }
    min = parseInt(newData.reduce((a, b) => Math.min(a, b)) / 2);
    mainChart.data.datasets[0].data = newData;
    mainChart.options.scales.y.min = min;
    mainChart.update();
}



export async function getConseilJournalier() {
    try {
        let conseil = await getDeepResponse(deepseekConseilJournalier("je veux le message du jour"));

        // Vérifier si une erreur s'est produite
        if (conseil.error) {
            console.error("Erreur lors de la récupération du conseil:", conseil.error);
            zoneConseilJour.append(conseil.reply || "Désolé, une erreur est survenue lors de la récupération du conseil.");
            return;
        }

        let contenu = conseil.reply || "Aucun conseil disponible pour le moment.";
        console.log(conseil);

        zoneConseilJour.append(contenu);
    } catch (error) {
        console.error("Erreur dans getConseilJournalier:", error);
        zoneConseilJour.append("Désolé, une erreur est survenue lors de la récupération du conseil.");
    }
}









function setMainChartConfig(label, data,) {

    let smallWindow = window.innerWidth < 768;
    return {
        type: "bar",
        data: {
            labels: label,
            datasets: [
                {
                    label: "Revenu",
                    data: data,
                    borderWidth: 1,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    align: "end"
                }
            },
            scales: {
                x: {
                    ticks: {
                        display: smallWindow ? false : true,
                    }
                },
                y: {}
            }
        }
    };
}

function sommeParCathegorie(cath, tab) {
    //recupere les depense du mois courant

    let total = 0;
    for (let i in tab) {
        if (tab[i].categorie == cath) {
            total += parseInt(tab[i].montant);
        }
    }
    return total;
}

function genererCouleurs(nombre) {
    let couleurs = [];
    for (let i = 0; i < nombre; i++) {
        // On divise 360 par le nombre de catégories pour bien répartir les couleurs
        const h = i * (360 / nombre);
        couleurs.push(`hsl(${teinte}, 95%, 50%)`); // 70% saturation, 60% luminosité
    }
    return couleurs;
}

async function setSecondChartConfig() {
    let tab_cath;
    //recuperation du profil depuis le localstorage en string
    let profilstr = localStorage.getItem("profil")
    // si i n'y a pas de profil on passse
    if (!profilstr) {
        return;
    }
     //convertir en object pour manipuler
    let profil = JSON.parse(profilstr);
    tab_cath = profil.aboutMe.catDepense;
    let backgroundColors = [];
    let newBackGround=[];
    let somme_bon = [];
    console.log("couleurrrrrrrrrr")
    //  On boucle sur chaque élément du tableau de catégories
    for (let i in tab_cath) {
        console.log("222222222r")
        // 3. Calcul de la teinte (Hue) en degrés (de 0 à 360)
        // On divise le cercle chromatique par le nombre total de catégories
        let teinte = (i * 360) / tab_cath.length;

        // 4. Création de la chaîne de caractères au format HSL
        // On utilise une saturation de 70% et une luminosité de 65%
        let couleurFormattee = "hsl(" + teinte + ", 70%, 65%)";
        console.log(couleurFormattee);

        // 5. On ajoute la couleur au tableau
        backgroundColors.push(couleurFormattee);
    }
    let tab_cath_bon=[];
    

    let somme = [];
    let tab_dep = await IDB.recupDepenseParMois();

    console.log("tableuuuuuuuuuuuuuu");
    console.log(tab_dep);
    console.log("afficharge de somme");

    for (let i in tab_cath) {
        somme[i] = sommeParCathegorie(tab_cath[i], tab_dep)
        if(somme[i]!=0){
            tab_cath_bon.push(tab_cath[i]);
             newBackGround.push(backgroundColors[i]);
             somme_bon.push(somme[i]);
        }
        console.log(somme[i]);
    }
    console.log("dessiner graphe ")
    return {
        type: 'doughnut',
        data: {
            labels: tab_cath_bon,
            datasets: [{
                borderWidth: 1,
                label: 'My First Dataset',
                data: somme_bon,
                backgroundColor: newBackGround,
            }]
        }
    };

}

export async function insertLatestTransaction() {
    let transaction = await Transaction.getLast();
    if (Array.isArray(transaction)) {
        transaction.forEach(function (e) {
            cardRecentEvent.append(createCardTransaction(e))
        })

    }

}

function createCardTransaction(transaction) {
    let montantColorClass = "text-red";
    let iconLink = '<i class="bi bi-arrow-down-right  rounded-circle card p-1 border-red text-red" style="font-size:14px"></i>';

    if (transaction.type === "Revenu" || transaction.type === "Dette") {
        montantColorClass = "text-green";
        iconLink = '<i class="bi bi-arrow-up-right   rounded-circle card p-1 border-green text-green" style="font-size:14px"></i>';
    }

    let pageConnected;
    switch (transaction.type) {
        case "Revenu":
            pageConnected = "revenu.html";
            break;
        case "Depense":
            pageConnected = "depense.html";
            break;
        case "Dette":
            pageConnected = "Obligation_financiere.html";
            break;
        case "Emprunt":
            pageConnected = "Obligation_financiere.html";
            break;
        default:
            pageConnected = "#";
            break;
    }
    return `<a href="${pageConnected}" class="text-decoration-none text-reset ">
    <div class="container-fluid pb-2">
                            <div class="row">
                                <div class="col-auto d-flex justify-content-center align-items-center p-0">
                                ${iconLink}
                                </div>
                                <div class="col  overflow-hidden">
                                    <div>${transaction.type}</div>
                                    <div class="text-body-tertiary text-truncate">${transaction.autreInfo}</div>
                                </div>
                                <div class="col-auto text-end pe-3">
                                    <div class=" text-center fs-6  ${montantColorClass}">+${formatDevise( transaction.montant)}</div>
                                    <div class="text-body-tertiary" style="font-size: 14px;">${transaction.date}</div>
                                    </div>
                            </div>
                            
                        </div>
                    </a>
                   `;
}
















