import $ from "jquery";
import { formatDate } from "../share";
import { Objectif } from "../modeles/objectif";
import { formatDevise } from "../share";
// Variable globale pour stocker l'objectif en cours
let currentObjectif = null;



export async function AjoutObjectifClick(TabObjectif) {
  try {
    console.log("on ajout nouvel objectif");
    //event.preventDefault();
    let intitule = $("#intitule1").val();
    let description = $("#exampleFormControlTextarea").val();
    let montant = parseInt($("#economie1").val());
    //let economie= 0;
    let date = $("#jour1").val();
    await Objectif.AjoutObjectif(intitule, description, montant, date, "En cours",);
    if (new Date(dateNaissance).getTime() < dateEcheance.getTime()) {
      alert("La date de naisssance ne peut pas être antérieure à la date d'e création'.");
      return;
    } // Formatage de la date de création si besoin 
    let Date = dateEcheance.toISOString().split("T")[0]; // AAAA-MM-JJ 
    await Objectif.AjoutObjectif(
      intitule, description, dateEcheance, visibilite,);

    console.log("Succès : Objectif ajoutée");
    location.href = "../views/Objectif.html";

  } catch (e) {
    $("#montantError").text(e.message).addClass("d-block text-center");
  }
}

// export function AffichagerObjectif(TabObj) {
//   let i = TabObj.length - 1;
//      TabObj.forEach(Obj =>{
//   while (i >= 0) {
//     if (TabObj[i].visibilite === true) {

//       let html = `
//         <p>${TabObj[i].intitule}</p>
//         <small class="text-muted">${TabObj[i].description}</small>

//         <div class="progress m-2 bg-secondary w-100" style="height:6px; max-width:800px">
//           <div class="progress-bar bg-primary" style="width:${TabObj[i].economie}%"></div>
//         </div>

//         <small class="text-muted">${TabObj[i].economie}%</small>
//         <p class="border-bottom mb-3" style="width:800px"></p>
//       `;

//       $("#contenuObjectifs").append(html);
//     }
//     i--;
//   }
// }



function RecuperationChampSaisie(Obj) {
  let intitule = $("#intitule").val();
  let description = $("#exampleFormControlTextarea1").val();
  mont = parseInt(mont);
  let montant = $("#economie").val();
  montant = Number(montant);
  let dateNaissance = $("#jour").val();
  console.log("on a tout recu");
  let Obje = new Objectif(
    Obj.id,
    intitule,
    description,
    montant,
    dateNaissance
  );
  return Obje;
}



export function AffichageModif(Obj) {
  if (!Obj) return;
  console.log("on affichage modif");
  $("#intitule").val(Obj.intitule ?? "");
  $("#economie").val(Obj.montant ?? "");
  // Préremplir la date d'échéance : si l'objet fournit une date, l'utiliser,
  // sinon mettre la date d'aujourd'hui (Date.now()) sans changer la logique.
  const jour = $("#jour");
  jour.val(Obj.dateEcheance);

  // désactiver le champ
  jour.prop('disabled', true);

  // réactiver à la fermeture de la modale
  $("#modification").one('hidden.bs.modal', function () {
    jour.prop('disabled', false);
  });

  $("#exampleFormControlTextarea1").val(Obj.description ?? "");

  // MODALE (DOM NATIF)
  // const modalEl = document.getElementById("modification");
  // const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  //modal.show();
}

export function AffichagerObjectif(TabObj) {
  const container = $("#Liste");
  container.empty();
  if (!Array.isArray(TabObj)) return;
  TabObj.forEach((Obj) => {
    const vis = Obj.hasOwnProperty("visibilite") ? Obj.visibilite : true;
    if (!vis) return;
    let otherIcon = "";
    if (Obj.statut === "En cours") {
      otherIcon = ` <li class="modifplusOption" data-id="${Obj.id}">
      <a class="dropdown-item text-center " data-bs-toggle ="modal" data-bs-target ="#Montanteconomiser" href="#">
        <i class="bi bi-piggy-bank me-2 fs-5"></i> Economiser
        
      </a>
    </li>
   
     <li class="AbandonnerObjectif">
      <a class="dropdown-item text-center" href="#">
        <i class="bi bi-x-circle me-2 fs-5"></i> Abandonner
      </a>
    </li> 
    <li><hr class="dropdown-divider"></li>`;
    }

    let statusIcon = "";
    if (Obj.statut === "Abandonne") {
      statusIcon = `<i class="bi bi-x-circle  ms-2 fs-6 text-danger" ></i>`;
    } else if (Obj.statut === "Archeve") {
      statusIcon = `<i class="bi bi-check-all  text-primary fs-6"></i>`;
    }

    const montant = Number(Obj.montant) || 0;
    const economie = Number(Obj.economie) || 0;
    const pourcent =
      montant > 0
        ? Math.min(100, Math.max(0, Math.round((economie / montant) * 100)))
        : 0;
    const restant = Math.max(0, montant - economie);
    const date = Obj.dateEcheance;

    const html = `
    <div class="col-12 col-sm-6 p-2 mb-1 objectif-card" data-id=${Obj.id}>
  <div class="card rounded-3 p-0 m-0 p-3">
    <div class="d-flex justify-content-between align-items-start mb-2">
      <div>
        <h6 class="mb-0 fw-semibold">${Obj.intitule || ""} ${statusIcon}</h6>
        <small class="text-muted">
          <i class="bi bi-calendar me-1"></i> ${date}
        </small>
      </div>
      <div class="dropdown">
        <button class="btn btn-sm border-0 plusOption" data-bs-toggle="dropdown" aria-expanded="false" data-id=${Obj.id}>
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          ${otherIcon}
          <li>
            <a class="dropdown-item text-danger SupprimerObjectif" href="#">
              <i class="bi bi-trash3 me-2"></i> Supprimer
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="mb-2">
      <span class="fw-semibold fs-6">${formatDevise(economie)}</span>
      <span class="text-muted"> / ${formatDevise(montant)}</span>
      <small class="text-muted ms-2">(${pourcent}%)</small>
    </div>

    <div
      class="progress objectif-item"
      style="height:6px"
      data-id="${Obj.id}"
      data-bs-toggle="modal"
      data-bs-target="#modalAfficherObj"
      role="button"
      aria-label="Voir détails"
    >
      <div
        class="progress-bar bg-primary"
        role="progressbar"
        style="width:${pourcent}%"
      ></div>
    </div>

  </div>
</div>

      `;

    container.append(html);

    // click on progress opens detail modal
    // const selector = `.objectif-card[data-obj-id="${Obj.id || ''}"] .objectif-item`;
    // container.find(selector).off('click').on('click', function () {
    // //   try {
    //     voirDetailModalObectif([Obj]);
    //   } catch (err) {
    //     console.error('Erreur ouverture detail objectif', err);
    //   }
  });
  //console.log('fin affichage');
  //});
}






export function VoirDetailObjectif(Obj) {
  if (!Obj) return;
  const pourcentage =
    Obj.montant && Obj.economie
      ? Math.round((Obj.economie / Obj.montant) * 100) + "%"
      : "0%";

  $("#Intitule2").text(Obj.intitule ?? "");
  $("#veuteconomiser").text(Obj.economie ?? "");
  $("#Economie2").text(Obj.montant ? Obj.montant + " FCFA" : "");
  $("#pourcent").text(pourcentage);
  $("#Jour2").text(Obj.dateEcheance ?? "");
  $("#statut").text(Obj.statut ?? "");
  $("#textarea").val(Obj.description ?? "");
}

export async function ModificationObjectif(Obj) {
  let NewObj = RecuperationObjectif(Obj);
  console.log("wded");
  let Afficher = false;

  let O = {};
  if (Obj.intitule != NewObj.intitule) {
    O["intitule"] = NewObj.intitule;
    Afficher = true;
  }
  if (Obj.description != NewObj.description) {
    O["description"] = NewObj.description;
    Afficher = true;
  }
  if (Obj.montant != NewObj.montant) {
    O["montant"] = NewObj.montant;
    if (NewObj.montant > Obj.economie) {
      Obj.statut = "En cours";
    } else if (NewObj.montant = Obj.economie) {
      Obj.statut = "Archeve";
    }
    Afficher = true;
  }
  if (Obj.date != NewObj.date) {
    O["date"] = NewObj.date;
    Afficher = true;
  }
  console.log("3e");
  await Objectif.MiseAJour(Obj.id, O);
  console.log("f");
  location.href = "../views/Objectif.html";
}

// Fonction simple pour récupérer les valeurs du formulaire
function RecuperationObjectif(Obj) {
  return {
    intitule: $("#intitule").val(),
    description: $("#exampleFormControlTextarea1").val(),
    montant: parseInt($("#economie").val()),
    date: $("#jour").val(),
  };
}

export function MasquerObjectif(Obj) {
  console.log("1");

  Obj.visibilite = false;
  Objectif.MiseAJour(Obj.id, { visibilite: false });
  console.log("Objectif masquer");
  $(document).trigger("listObjectif:new", []);

  return Obj;
}

// Fonction simple pour initialiser le bouton "Modifier" du modal de modification
// export function setupModifyButton() {
//   // Attacher l'événement au bouton "Modifier" du modal
//   const modifyBtn = document.querySelector('#modification .btn-primary');
//   if (modifyBtn) {
//     modifyBtn.addEventListener('click', async function(e) {
//       e.preventDefault();
//       if (currentObjectif) {
//         await ModificationObjectif(currentObjectif);
//       }
//     });
//   }
// }

export function searchById(Obj, identifiant) {
  for (let i in Obj) {
    if (Obj[i].id == identifiant) {
      return i;
    }
  }
}

// export function FiltrageObjectif(TabObj, option = {}){
//    // return Obj.visibilite === true;
//     Result = [TabObj];
//    if (!Array.isArray(TabObj)) return;
//    Result =Result.filter(Obj => Obj.visibilite === true);

//     const vis = Obj.hasOwnProperty('visibilite')? Obj.visibilite:true;

// //    if (option.statut){
// //     if (Obj.statut === option.statut && vis === true){
// //         return Obj;

// //    }
// // }
// //    if
// //    (option.visibilite){
// //     if (vis === option.visibilite){
// //         return Obj;
// //     }
// //}
//     if (option.visiblesOnly){
//        Result = Result.filter(Obj => Obj.visibilite === true);
//     }
//     if (option.search){
//         const O = option.search.toLowerCase();
//         if (Obj.intitule.toLowerCase().includes(O) || Obj.decription.toLowerCase().includes(O));
//             return Result;
//     }

//     if (option.statut){
//         Result = Result.filter(Obj => {
//             if (option.statut === 'en cours')
//                 return Obj.economir <Obj.montant;
//             if (option.statut === 'atteint')
//                 return Obj.economie<= Obj.montant;
//             return true;
//         });
//     }
//      return Result;
//    }

export function AfficherObjectifsEnCours(TabObj) {
  const conteneur = document.getElementById("votre-conteneur-id");

  //  Filtrer les objectifs "en cours"
  const listeEnCours = TabObj.filter((obj) => obj.statut === "n cours");

  //  Générer le HTML
  conteneur.innerHTML = listeEnCours
    .map((obj) => {

      // Calcul du pourcentage de progression
      const pourcentage = Math.min(
        Math.round((obj.economie / obj.montant) * 100),
        100
      );

      return `
        <div class="card mb-3 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-title mb-0"><strong>${obj.intitule}</strong></h6>
                    
                    <div class="dropdown">
                        <button class="btn border-0" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#"><i class="bi bi-cash-coin me-2"></i>Économiser</a></li>
                            <li><a class = "dropdown-item" href="#"><i class="bi bi-x-circle me-2" ></i>Abandonner</a></li>
                            <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Supprimer</a></li>
                           
                        </ul>
                    </div>
                </div>

                <div class="progress" style="height: 10px;">
                    <div class="progress-bar bg-success" role="progressbar" 
                         style="width: ${pourcentage}%" 
                         aria-valuenow="${pourcentage}" aria-valuemin="0" aria-valuemax="100">
                    </div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                    <small class="text-muted">${obj.economie} € / ${obj.montant} €</small>
                    <small class="fw-bold">${pourcentage}%</small>
                </div>
            </div>
        </div>`;
    })
    .join("");

  const dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
  dropdowns.forEach((el) => new bootstrap.Dropdown(el));
}

export function FiltrageObjectif(TabObj, Stat) {
  let Result = [];
  //  Result = TabObj.filter(Obj => Obj.statut === Stat && Obj.visibilite === true);
  TabObj.forEach((Obj) => {
    if (Obj.statut === Stat && Obj.visibilite === true) {
      Result.push(Obj);
    }
  });
  AffichagerObjectif(Result);
}


export async function updateObjectif(Obj, S) {
  console.log("On recuperation montant a ecnomiser");

  let Eco = parseFloat($("#veuteconomiser").val());
  if (Eco > S) {
    alert("votre solde est insuffiant pour cette economie");
    retun;
  }
  else {
    if (Eco > Obj.montant - Obj.economie) {
      alert("le montant depasse votre objectif");
      return;
    }
    console.log("regarder economie");
    Obj.economie = Obj.economie + Eco;
    if ((Obj.economie == Obj.montant)) {
      console.log("objectif atteint");
      Obj.statut = "Archever";
    }
  }
  await Objectif.MiseAJour(Obj.id, Obj);
  $(document).trigger("listObjectif:new", []);
  return Eco;
}



export async function Abandon(Obj) {
  Obj.statut = "Abandonne";

  await Objectif.MiseAJour(Obj.id, Obj);
  location.href = "../views/Objectif.html";
  return Obj.economie;
}


export function AffichageCathegorie(TabObj, cath) {
  // Ciblez "Liste" au lieu de "listeObjectifs"
  const $container = $("#Liste");

  if (cath == "Tout") {
    $container.empty(); // On vide seulement la zone de liste
    AffichagerObjectif(TabObj);
  } else {
    var NewTabObjectif = [];
    for (let i in TabObj) {
      if (TabObj[i].statut == cath) {
        NewTabObjectif.push(TabObj[i]); // Plus propre que NewTabObjectif[j]
      }
    }
    // if (cath == "En cours"){
    //   NewTabObjectif = NewTabObjectif.filter(Obj => Obj.statut === "En cours");

    // }
    console.log("tab pour filtre", NewTabObjectif);

    $container.empty(); // On vide seulement la zone de liste
    AffichagerObjectif(NewTabObjectif);
  }
}

export function search(Objectif, recherche) {
  // Sécurité : si la recherche est vide ou nulle
  if (!recherche) return Objectif;

  recherche = recherche.toLowerCase();

  return Objectif.filter(Obj => {
    // On convertit chaque propriété en String avant le toLowerCase()
    const intitule = String(Obj.intitule ?? '').toLowerCase();
    const economie = String(Obj.economie ?? '').toLowerCase();
    const montant = String(Obj.montant ?? '').toLowerCase();
    const pourcentage = String(Obj.pourcentage ?? '').toLowerCase();
    const dateNaissance = String(Obj.dateNaissance ?? '').toLowerCase();
    const statut = String(Obj.statut ?? '').toLowerCase();
    const description = String(Obj.description ?? '').toLowerCase();

    return intitule.includes(recherche) ||
      economie.includes(recherche) ||
      montant.includes(recherche) ||
      dateNaissance.includes(recherche) ||
      statut.includes(recherche) ||
      description.includes(recherche);
  });
}

// Minime : définir la date d'aujourd'hui sur tous les inputs de type date,
// y compris dans la modale de modification.
// Utilise Date.now() comme demandé et n'altère pas la logique existante.
(function setTodayOnDateInputs() {
  try {
    const today = new Date(Date.now()).toISOString().split("T")[0];
    const setIfEmpty = (el) => { if (el && !el.value) el.value = today; };

    // appliquer immédiatement aux inputs existants
    document.querySelectorAll('input[type="date"]').forEach(setIfEmpty);

    // couvrir les IDs de date communs utilisés dans les modales (modification, ajout...)
    ['#jour', '#jour1', '#jour2'].forEach(id => setIfEmpty(document.querySelector(id)));

    // appliquer aussi au chargement DOM si nécessaire
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('input[type="date"]').forEach(setIfEmpty);
      });
    }

    // s'assurer lors de l'ouverture des modales Bootstrap
    ['show.bs.modal', 'shown.bs.modal'].forEach(evt => {
      document.addEventListener(evt, function () {
        document.querySelectorAll('input[type="date"]').forEach(setIfEmpty);
      });
    });
  } catch (e) {
    // ne rien faire pour ne pas casser le module
  }
})();