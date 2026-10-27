import Tesseract from 'tesseract.js';
import Chart from 'chart.js/auto';
import $ from 'jquery';
import { Modal, Dropdown } from 'bootstrap';
import { Depense } from '../modeles/depense.js';
import { DEPENSE_TB_NAME } from '../constantes';
import { loadLang } from '../share';
import { IDB } from '../IDB/IDB_consummer';
import { initPage } from '../utilities.js';

import {affichageModif,recupererChampSaisie,modifierinfo,clickDepenseModif,masquerDepense,affichage_depense,ajoutDepenseClick,rafraichirListeDepenses,tirerTextTesseract,attachEvenementDonnees, rechercheDescription, infoDepenseProfil, changeCategorie, afficheSelectCategorieDepense, afficherParCategorieDepense,afficheSelectCategorieModifDepense} from '../controllerUtilitie/depenseUtilities.js';

initPage("depense.html");
$(document).ready(async function () {
    loadLang("en");
    let tableau_depense = await Depense.recuperation_depenses();
    let tab_cathegorie = infoDepenseProfil(tableau_depense);
    
    // Afficher les catégories au chargement initial
    afficheSelectCategorieDepense(tab_cathegorie);
    // Remplir le select du modal de modification
    afficheSelectCategorieModifDepense(tab_cathegorie);

    $(document).on("listDepense:updated",function(e,newValeur){
        tableau_depense=newValeur;
        $('#listeDepenses').empty();
        affichage_depense(tableau_depense);
        attachEvenementDonnees(tableau_depense);
        let tab_cath = infoDepenseProfil(tableau_depense);
        afficheSelectCategorieDepense(tab_cath);
        // Mettre à jour le select du modal de modification
        afficheSelectCategorieModifDepense(tab_cath);
        console.log("Modification dans le tableau")
    })
    $(document).trigger("listDepense:updated", [tableau_depense]);

    // Gérer le changement de catégorie vers "autre" ou "other"
    changeCategorie();

    $('#monformulaireajout').on("submit", async function (event) {
        event.preventDefault();
        ajoutDepenseClick();
    });
    
    // Initialiser Tesseract pour la sélection d'image
    tirerTextTesseract();
    $("#search-icon").on("click", function () {
        rechercheDescription(tableau_depense);
    });
    $("#searchInput").on("keypress", function (e) {
        if (e.which === 13) { 
            rechercheDescription(tableau_depense);
        }
    });

    // Gérer le clic sur les boutons de catégories pour filtrer
    $(document).on('click', '.filtreCategoriesDepense', function () {
        var categorie = $(this).data("id");
        console.log("Filtre par catégorie:", categorie);
        afficherParCategorieDepense(tableau_depense, categorie);
        
        // Mettre à jour l'état actif des boutons
        $('.filtreCategoriesDepense').removeClass('active');
        $(this).addClass('active');
    });

});


