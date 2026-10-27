import $, { error } from 'jquery';
import { initPage } from '../utilities';
import { Obligation } from '../modeles/Obligation';
import { getSideBar } from '../share';
import {
  afficharge_obligation,
  ajoutObligationClick,
  voirDetailModal,
  search,
  remplirFormulaireModification,
  recupererModification,
  remplirFormulaireRem,
  recupererRem,
  infoObligationProfil
} from '../controllerUtilitie/obligationUtilities';
initPage("Obligation_financiere.html");



$(document).ready(async function () {

  let tableau_obligation = [];
  let obligationSelectionnee = null;


  // 🔹 Charger les obligations
  try {
    tableau_obligation = await Obligation.getAllObligations();
    infoObligationProfil(tableau_obligation)
  } catch (e) {
    console.error(e);
  }

  afficharge_obligation(tableau_obligation);

  // 🔹 Ajouter une obligation
  $('#Ajouter').on("click", async function (event) {
    event.preventDefault();
    await ajoutObligationClick();
  });

  $(document).on('click', '.obligation_item', function () {
  console.log("Obligation cliquée");
  const id = $(this).data("id");
  console.log(id)

  obligationSelectionnee = tableau_obligation.find(o => o.id === id);
    console.log("Obligation sélectionnée :", obligationSelectionnee);
  voirDetailModal(obligationSelectionnee);
});
// Gérer l'affichage du texte du filtre sélectionné
$('.dropdown-item').on('click', function() {
    // On récupère le texte de l'élément cliqué
    const texteSelectionne = $(this).text();
    
    // On l'affiche dans le span
    $('#selected-filter-label').text(texteSelectionne);
    
    // Optionnel : On retire la classe 'active' de tous les items et on l'ajoute au cliqué
    $('.dropdown-item').removeClass('active');
    $(this).addClass('active');
});

// Initialisation au chargement pour afficher un état par défaut si besoin
$(document).ready(function() {
    // Si tu veux afficher "En cours" par défaut par exemple :
    // $('#selected-filter-label').text("En cours");
});
  // 🔹 Bouton "Modifier" dans le modal
  $('#mod').on('click', function () {
    if (!obligationSelectionnee) return;
    remplirFormulaireModification(obligationSelectionnee);
  });

  $(document).on('click', '.rem', function (e) {
    console.log(this);
    e.stopPropagation(); // Empêche d'ouvrir le modal de détail
    let id = $(this).closest('.obligation_item').data('id');
    id=parseInt(id);
    obligationSelectionnee = tableau_obligation.find(o => o.id === id);

    if (!obligationSelectionnee) return;

    remplirFormulaireRem(obligationSelectionnee);
      $('#validerRemboursement').on('click', async function () {
  
    obligationSelectionnee = tableau_obligation.find(o => o.id === id);
    console.log("Obligation sélectionnée :", obligationSelectionnee);
    if (!obligationSelectionnee) return;

    const montantSaisi = recupererRem();

    if (isNaN(montantSaisi) || montantSaisi <= 0) {
      alert("Veuillez saisir un montant valide");
      return;
    }

    const nouveauMontantRam = obligationSelectionnee.montantRam + montantSaisi;

    if (nouveauMontantRam > obligationSelectionnee.montant) {
      alert("Le remboursement dépasse le montant total de la dette");
      return;
    }

    // Mise à jour BD
    await Obligation.ModifierObligation(obligationSelectionnee.id, { montantRam: nouveauMontantRam });
    if (obligationSelectionnee.status === "Emprunt") {
      let profil = JSON.parse(localStorage.getItem("profil"));
      
      profil.situation.tEmprunt += montantSaisi;
      profil.situation.solde -= montantSaisi;
    }
    if (obligationSelectionnee.status === "Dette") {
      let profil = JSON.parse(localStorage.getItem("profil"));
      // Vérifier si le profil et le solde existent pour éviter les erreurs JS
      // Vérifier si le profil et le solde existent pour éviter les erreurs JS
      let soldeDisponible = profil?.situation?.solde || 0;
      localStorage.setItem("profil", JSON.stringify(profil));
      if (soldeDisponible < montantSaisi) {
        alert("Le montant  dépasse le solde disponible.");
        return; // On arrête tout ici
        
      }
      profil.situation.tDette -= montantSaisi;
      profil.situation.solde += montantSaisi;
      localStorage.setItem("profil", JSON.stringify(profil));
    }

    // Mise à jour Interface
    obligationSelectionnee.montantRam = nouveauMontantRam;
    afficharge_obligation(tableau_obligation);
location.href = "../views/Obligation_financiere.html";
    
  });
  });

  // 🔹 VALIDATION DU REMBOURSEMENT


  // 🔹 Enregistrer modification
  $('#modify').on('click', async function () {
    if (!obligationSelectionnee) return;

    const nouvellesValeurs = recupererModification();
    await Obligation.ModifierObligation(obligationSelectionnee.id, nouvellesValeurs);

    location.href = "../views/Obligation_financiere.html";
  });
 // Bouton "Masquer"
// Bouton "Masquer" (anciennement Supprimer)
$('#supprimer').on('click', async function () {
    if (!obligationSelectionnee) return;

    // Met à jour la visibilité dans la BD
    await Obligation.mise_a_jour_obligation(obligationSelectionnee.id, { visibilite: false });

    // Met à jour la liste côté front
    obligationSelectionnee.visibilite = false;
    afficharge_obligation(tableau_obligation);
location.href = "../views/Obligation_financiere.html";
});
$('#search-icon').on('click', function () {
  const recherche = document.getElementById('searchInput').value;
 const resultats = search(tableau_obligation, recherche);

  afficharge_obligation(resultats);
}
 );
  $('#preter').on('click', function () {
 const resultats = search(tableau_obligation, "Dette");

  afficharge_obligation(resultats);

}
 );         
  $('#emprunter').on('click', function () {
 const resultats = search(tableau_obligation, "Emprunt");

  afficharge_obligation(resultats);

}
 );
 $('#en_cours').on('click', function () {
  const resultats = tableau_obligation.filter(o =>
    o.montantRam < o.montant
  );

  afficharge_obligation(resultats);
   
});
 $('#Tout').on('click', function () {
  const resultats = tableau_obligation;
  afficharge_obligation(resultats);
   
});

 $('#acheve').on('click', function () {
  const resultats = tableau_obligation.filter(o =>
    o.montantRam === o.montant
  );

  afficharge_obligation(resultats);
   
});


});

