// import Utils, { Legend } from '../../node_modules/chart.js/auto'
// import Chart from '../../node_modules/chart.js/auto';
import Tesseract from 'tesseract.js';
// Récupérer l'élément canvas
import Chart from 'chart.js/auto';
import $ from 'jquery';
import { Modal } from 'bootstrap';
import { Revenu } from '../modeles/revenu';
import { REVENU_TB_NAME } from '../constantes';
import { getSideBar, loadLang } from '../share';
import { rechercheDescription, afficherParCathegorie, infoRevenuProfil, changeCathegorie, afficheSelectCathegorie, voirDetailModal, affichageModif, searchById, clickRevenuModif, masquerRevenu, afficharge_revenu, ajoutRevenuClick, tirerTextTesseract } from '../controllerUtilities/revenuUtilities';
import { initPage } from '../utilities';


//$("header").append(getSideBar("revenu.html"));
initPage("revenu.html");

$(document).ready(async function () { //attend que toute la page soit charger
  loadLang("en");
  let tableau_revenu = await Revenu.recuperation_revenu();
  let tab_cathegorie = infoRevenuProfil(tableau_revenu);

  //  let profil = JSON.parse(localStorage.getItem("profil"));
  //  let tab_cathegorie = profil.aboutMe.catRevenu;
  afficheSelectCathegorie(tab_cathegorie);
  console.log("regarder le tableau");
  console.log(tableau_revenu);
  //si on appuis sur le bouton d'ajout
  $("#boutonAjoutR").on("click", function () {
    if (!tableau_revenu || tableau_revenu.length === 0) {//verifie si le tableau est vide pour demander d'entrer obligatoirementue categorie au lieu du select
      $(".autreCategorieBloc").removeClass('d-none');//ouvrir le input
      $(".selectCategorie").addClass('d-none');//masquer le select
    } else {
      changeCathegorie();
    }

  })

  //afficher tous les revenus
  afficharge_revenu(tableau_revenu);
  $("#search-icon").on("click", function () {
    rechercheDescription(tableau_revenu);
  });
  $("#rechercherDescription").on("keypress", function (e) {
    if (e.which === 13) { // 13 est le code de la touche Entrée
      rechercheDescription(tableau_revenu);
    }
  });
  
  //si on clique sur un revenu(pour voir les details)
  $('.c-revenu').on("click", function () {
    var identifiant = $(this).data("id");
    var indexe = searchById(tableau_revenu, identifiant);
    voirDetailModal(tableau_revenu[indexe]);
    console.log("here");
    //si on appuis sur bouton modifier
    $('#modifiersurvoir').on("click", function () {
      affichageModif(tableau_revenu[indexe]);
      console.log("iddddddddd" + identifiant);
      //si on veut enregistrer les modifs
      $('#Enregistrermodif').on("click", function () {
        console.log("iddddddddd" + identifiant)
        clickRevenuModif(tableau_revenu, identifiant);
        console.log("modificatioon succes");
      })

    })
  }
)

  $('.plusOption').on("click", function () {
     var identifiants = $(this).data("id");
      var indexes = searchById(tableau_revenu, identifiants);
      console.log(identifiants);
       console.log("plussssususus")
    $(".modifplusoption").on("click", function () {
      changeCathegorie();
      affichageModif(tableau_revenu[indexes]);
      console.log("iddddddddd" + identifiants);
      //si on veut enregistrer les modifs
      $('#Enregistrermodif').on("click", function () {
        console.log("iddddddddd" + identifiants)
        clickRevenuModif(tableau_revenu, identifiants);
        console.log("modificatioon succes");
      })
    })
    $(".supprimerRevenu").on("click",function(){
      tableau_revenu = masquerRevenu(tableau_revenu[indexes]);

    })

  })

  $('.filtreCathegories').on('click', function () {
    var valeurs = $(this).data("id");
    // var indexe = searchById(tab_cathegorie, identifiant);
    afficherParCathegorie(tableau_revenu, valeurs);

  })



  
  //ajout d'un revenu
  $('#monformulaireajout').on("submit", async function (event) {
    ajoutRevenuClick(tableau_revenu, tab_cathegorie);
  });

  //tirer le texte de l'image

  tirerTextTesseract();




})




