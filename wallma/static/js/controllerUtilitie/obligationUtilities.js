
// Récupérer l'élément canvas
//import Chart from 'chart.js/auto';
import $ from 'jquery';
import { IDB } from "../IDB/IDB_consummer";
import { Modal } from 'bootstrap';
import { Obligation } from '../modeles/Obligation';
import { OBLIGATION_TB_NAME } from '../constantes';
import { getSideBar, loadLang, formatDate, formatDateToNumber } from '../share';

export function infoObligationProfil() {



  //recuperation du profil depuis le localstorage en string
  // si i n'y a pas de profil on passse

  let profilstr = JSON.parse(localStorage.getItem("profil"));
  // Vérifier si le profil et le solde existent pour éviter les erreurs JS
  let totalD = profilstr?.situation?.tDette || 0;
  $("#totalObligationD").text(`${totalD}.FCFA`)
  let totalE = profilstr?.situation?.tEmprunt || 0;
  $("#totalObligationE").text(`${totalE}.FCFA`)
}



/**
 * fonction qui donne les toutes informations du revenu pour afficher dans le modal de detail
 * @param {object} rev  est le revenu donc on veut voir les details
 */


export function voirDetailModal(obligation) {
  if (!obligation) return;

  $("#stat").text(obligation.status);
  $("#montant-modal").text(obligation.montant);
  $("#dateL").text(obligation.date_echeance);
  $("#DateDt").text(obligation.date_dette);
  $("#dd").text(obligation.description);
  $("#pro").text(obligation.description);
}

export function afficharge_obligation(obligations) {
  $('#nouveau').empty();

  for (let i = obligations.length - 1; i >= 0; i--) {
    const o = obligations[i];
    if (!o.visibilite) continue;

    const reste = o.montant - o.montantRam;
    const pourcentage = parseInt((o.montantRam / o.montant) * 100);

    // Extraction des 2 premières lettres du destinataire
    const initiales = o.destinataire ? o.destinataire.substring(0, 2).toUpperCase() : "??";

    let rembourserBtn = "";
    let iconOk=""
    if (reste != 0) {
      rembourserBtn = `
        <li>
          <a class="dropdown-item rem text-success" href="#" data-bs-toggle="modal" data-bs-target="#montantRam3" data-i18n="obligation.Rembourser" data-id=${o.id}>
            <i class="bi bi-cash-coin me-2"></i>Rembourser
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>`;
        
    }else{
      iconOk=`<i class="bi bi-check-all fs-4 text-primary d-sm-none"></i>`;
    }
    let st = "";
    if (o.status === "Dette") {
      st = `<div class="rounded-circle  d-flex align-items-center justify-content-center m-1 ms-0 me-2 " 
           style="width: 45px; height: 45px; min-width: 45px; font-size: 14px; background-color: #FF6655;" >
        ${initiales}
      </div>`;
    } else {
      st = `<div class="rounded-circle  d-flex align-items-center justify-content-center m-1 ms-0 me-2" 
        style="width: 45px; height: 45px; min-width: 45px; font-size: 14px; background-color: #90EE90;" >
     ${initiales}
   </div>`;
    }

    let button = `
      <div class="row  w-100 g-0 obligation_item"  data-id=${o.id}>
      <div class="col d-flex "  data-bs-toggle="modal" data-bs-target="#decrit">
       <div class="col col-sm-auto  m-0 p-0   pb-1 " >
          <div class="row  align-items-center g-0">
            <div class="col-auto  d-flex align-items-center"  >${st}</div>
            <div class="col">
              <div class="">${o.status} à ${o.destinataire}<span class="ms-2">${iconOk}<span></div>
              <div class="text-body-secondary" style="font-size:14px">${o.montantRam} FCFA rembourse</div>
            </div>
           
          </div>
        </div>
        <div class=" d-none d-sm-block  col-sm ">
          <div class="container px-0 px-sm-4 " style="max-width:300px">
            <div class="progress m-2 bg-body" role="progressbar" aria-label="Basic example" aria-valuenow="56"
                aria-valuemin="0" aria-valuemax="100" style="height: 7px;">
                  <div id="progress-obj" class="progress-bar" style="width: ${pourcentage}%;"></div>
            </div>
            <span class="">${pourcentage}%</span>
            
          </div>
          
        </div>
        <div class="col-auto d-flex align-items-center">
          <div class="text-end me-3">
            <div class="">${o.montant} XFA</div>
            <div class="text-body-secondary" style="font-size:12px">Avant le ${o.date_echeance}</div>
          </div>
         
        </div>

      </div>
      <div class="col-auto">
       <div class="dropdown">
            <button class="btn btn-link  p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots-vertical fs-5"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              ${rembourserBtn}
              <li>
                <a class="dropdown-item text-danger" href="#" id="supprimer" data-i18n="obligation.Supprimer">
                  <i class="bi bi-trash me-2"></i>Supprimer
                </a>
              </li>
            </ul>
          </div>
      </div>
       
        
     
  </div>
  <hr class="my-3">`;
    $('#nouveau').append(button);
  }
}

/**
 * ajouter un revenu dans la BD avec les valeur contenu dans les input d'ajout de revenu
 */

export async function ajoutObligationClick() {
  try {
    let destinataire = $("#nom_proprio").val();
    let status = $("#type_obligation").val();
    let montant = parseFloat($("#montant").val());
    let dateEcheance = $("#dateEcheance").val();
    let description = $("#description").val();
    let date_dette = new Date();
    let visibilite = true;
    let montantRam = 0;

    // Validation de base
    if (!destinataire || isNaN(montant) || !dateEcheance) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (status === "Emprunt") {
      let profil = JSON.parse(localStorage.getItem("profil"));
      // Vérifier si le profil et le solde existent pour éviter les erreurs JS
      let soldeDisponible = profil?.situation?.solde || 0;
      
      localStorage.setItem("profil", JSON.stringify(profil));
      if (soldeDisponible < montant) {
        alert("Le montant de l'emprunt dépasse le solde disponible.");
        return; // On arrête tout 
        
      }
      profil.situation.tEmprunt += montant;
      profil.situation.solde -= montant;
    }
    if (status === "Dette") {
      let profil = JSON.parse(localStorage.getItem("profil"));
      // Vérifier si le profil et le solde existent pour éviter les erreurs JS
      profil.situation.tDette += montant;
      profil.situation.solde += montant;
      localStorage.setItem("profil", JSON.stringify(profil));
    }
    // Vérification cohérence des dates 
    if (new Date(dateEcheance).getTime() < date_dette.getTime()) {
      alert("La date d'échéance ne peut pas être antérieure à la date de création.");
      return;
    } // Formatage de la date de création si besoin 
    let date_dette_formatee = date_dette.toISOString().split("T")[0]; // AAAA-MM-JJ 
    await Obligation.AjouterObligation(
      montant, dateEcheance, description, destinataire, status, visibilite, montantRam, date_dette_formatee);

    console.log("Succès : Obligation ajoutée");
    location.href = "../views/Obligation_financiere.html";

  } catch (e) {
    console.error("Erreur lors de l'ajout :", e);
    $("#montantError").text(e.message).addClass("d-block text-center");
  }
}

export function search(obligations, recherche) {
  // Sécurité : si la recherche est vide ou nulle
  if (!recherche) return obligations;

  recherche = recherche.toLowerCase();

  return obligations.filter(o => {
    // On convertit chaque propriété en String avant le toLowerCase()
    const destinataire = String(o.destinataire ?? '').toLowerCase();
    const status = String(o.status ?? '').toLowerCase();
    const description = String(o.description ?? '').toLowerCase();
    const date_echeance = String(o.date_echeance ?? '').toLowerCase();
    const date_dette = String(o.date_dette ?? '').toLowerCase();
    const montant = String(o.montant ?? '').toLowerCase();

    return destinataire.includes(recherche) ||
      status.includes(recherche) ||
      description.includes(recherche) ||
      date_echeance.includes(recherche) ||
      date_dette.includes(recherche) ||
      montant.includes(recherche);
  });
}

export function recupererModification() {
  const destinataire = $("#nom_proprio1").val();
  const status = $("#type_obligation1").val();
  const montant = parseFloat($("#montant1").val());
  const date_echeance = $("#dateEcheance1").val();
  const description = $("#description1").val();
  const date_dette = new Date();

  // Vérification cohérence des dates 
  if (new Date(date_echeance).getTime() < date_dette.getTime()) {
    alert("La date d'échéance ne peut pas être antérieure à la date de création.");
    return;
  } // Formatage de la date de création si besoin 
  let date_dette_formatee = date_dette.toISOString().split("T")[0]; // AAAA-MM-JJ 


  return {
    destinataire,
    status,
    montant,
    date_echeance,
    description,
    date_dette_formatee
  };
}



export function recupererRem() {
  return parseFloat($("#mon").val());
  
}




export function remplirFormulaireModification(o) {
  if (!o) return;

  $("#nom_proprio1").val(o.destinataire);
  $("#type_obligation1").val(o.status);
  $("#montant1").val(o.montant);
  $("#dateEcheance1").val(o.date_echeance);
  $("#description1").val(o.description);
  $("#dateDette1").val(o.date_dette);
}

export function remplirFormulaireRem(o) {
  if (!o) return;

  // $("#nom_proprio1").val(o.destinataire);
  // $("#type_obligation1").val(o.status);
  // $("#montant1").val(o.montant);
  // $("#dateEcheance1").val(o.date_echeance);
  // $("#description1").val(o.description);
  // $("#dateDette1").val(o.date_dette);
  $("#r").val(o.montantRam);
}



