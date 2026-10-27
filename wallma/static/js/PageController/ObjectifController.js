import $, { error } from "jquery";
import { Objectif } from "../modeles/objectif";
import { OBJECTIF_TB_NAME } from "../constantes";
import {
  AffichagerObjectif,
  AjoutObjectifClick,
  updateObjectif,
  MasquerObjectif,
  VoirDetailObjectif,
  AffichageModif,
  ModificationObjectif,
  AffichageCathegorie,
  searchById,
   search,
  Abandon,
  FiltrageObjectif,
} from "../controllerUtilitie/ObjectifUtilities";
import { modifierinfo } from "../controllerUtilities/revenuUtilities";

import { initPage } from "../utilities";


initPage("objectif.html");

$(document).ready(async function () {

  let TabObjectif = await Objectif.RecuperationObjectif();
  AffichagerObjectif(TabObjectif);

  $(document).on("listObjectif:new",async function(e){
    TabObjectif=await Objectif.RecuperationObjectif();
    AffichagerObjectif(TabObjectif);
  });

  let profilstr = localStorage.getItem("profil");
  let profil = JSON.parse(profilstr);
  let SoldeCourant = profil.situation.solde;
  console.log("SSSSSSSSSSS" + SoldeCourant);


 $('.filtreCathegories').on('click', function () {
    var valeurs = $(this).data("id");
    console.log("filtre");
    console.log(valeurs);
    // var indexe = searchById(tab_cathegorie, identifiant);
    AffichageCathegorie(TabObjectif, valeurs);

  })

$('#search-icon').on('click', function () {
  console.log("ppp");
  const recherche = document.getElementById('searchInput').value;
 const resultats = search(TabObjectif, recherche);

console.log(resultats);
 AffichagerObjectif(resultats);
}
 );


// $('#searchInput').on('input', function () {
   
//     const recherche = $(this).val();

//     const resultatsFiltrés = search(TabObjectif, recherche);

//     $("#Liste").empty();
//     AffichagerObjectif(resultatsFiltrés);
// });
  //  voirDetailModalObectif(obj);
  //Initialiser le bouton "Modifier" du modal
  // setupModifyButton();

  // Délégation : quand on clique sur une barre de progression, appeler la fonction de détail
  // $(document).off('click', '#Liste .objectif-item');
  // $(document).on('click', '#Liste .objectif-item', function () {
  //     const id = $(this).closest('.objectif-card').data('obj-id');
  //     const obj = TabObjectif && TabObjectif.find(o => String(o.id) === String(id));
  //     if (obj) {
  //         //try { voirDetailModalObectif(obj); } catch (e) { console.error(e);
  //     }
  // });



  $(".objectif-item").on("click", function () {
    console.log("click on item");
    var identifiant = $(this).data("id");
    console.log(identifiant);
    var indexe = searchById(TabObjectif, identifiant);
    VoirDetailObjectif(TabObjectif[indexe]);
    $("#modif").on("click", function () {
      AffichageModif(TabObjectif[indexe]);

      $("#Enregistrement").on("click", function () {
        console.log("iddddddddd" + identifiant);
        ModificationObjectif(TabObjectif[indexe]);
        console.log("modificatioon succes");
      });
    });
  });

  console.log("entrer dans supprimer");
  $(".plusOption").on("click", function () {
    console.log("supprimer");
    var identifiants = $(this).data("id");
    console.log(identifiants);
    var indexes = searchById(TabObjectif, identifiants);
    console.log(indexes);
    console.log(TabObjectif[indexes]);
    // VoirDetailObjectif(TabObjectif[indexes]);
    $(".SupprimerObjectif").on("click", function () {
      console.log("entrer dasn supprimer");
      console.log(TabObjectif);
      TabObjectif = MasquerObjectif(TabObjectif[indexes]);



    });
    $(".modifplusOption").on("click", function () {
      console.log("on economiser");
       var identifiants = $(this).data("id");
           var indexes = searchById(TabObjectif, identifiants);

      $("#btnEnregistrerEconomie").on("click", function () {
        console.log("on update ojectif");
        
        const montantSaisi = updateObjectif(TabObjectif[indexes], SoldeCourant);
        profil.situation.solde = SoldeCourant - montantSaisi;
        console.log(montantSaisi);
        if (montantSaisi !== null && !isNaN(montantSaisi)) {
          console.log("Succès : Vous avez saisi " + montantSaisi + " FCFA");
        }
      });



    });

    $(".AbandonnerObjectif").on("click", function () {
      console.log("entrer dasn economie");
      profil.situation.solde = SoldeCourant + Abandon(TabObjectif[indexes]);
      console.log(profil.situation.solde);



    });



  });



  $("#ajouterobj").on("click", async function () {
    await AjoutObjectifClick();

    TabObjectif = await Objectif.RecuperationObjectif();
    AffichagerObjectif(TabObjectif);
  });
});


// --- INITIALISATION DU MODAL ---
// S'exécute dès que l'utilisateur clique sur "Nouvel objectif"
$('#modifier').on('show.bs.modal', function () {
    // 1. Générer la date d'aujourd'hui au format AAAA-MM-JJ
    const aujourdhui = new Date().toISOString().split('T')[0];
    
    // 2. Affecter la date au champ et le verrouiller
    $("#jour1")
        .val(aujourdhui)
        .prop("readonly", true) // Empêche la modification
        .css("background-color", "#e9ecef"); // Optionnel : donne un aspect grisé
});





// let TabObjectif = await Objectif.RecuperationObjectif();
// const Res = FiltrageObjectif(TabObjectif,true);
// AffichagerObjectif(Res);

// const URL = ModificationObjectif(TabObjectif);
// ModificationObjectif(URL);
// const resultat = SupprimerObjectif(TabObjectif);
// SupprimerObjectif(resultat);
