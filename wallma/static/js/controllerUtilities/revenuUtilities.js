import Tesseract from 'tesseract.js';
// Récupérer l'élément canvas
import { formatDate,formatDevise } from '../share';
import $ from 'jquery';
import { Profil } from '../modeles/profil';
import { Modal } from 'bootstrap';
import { Revenu } from '../modeles/revenu';
import { REVENU_TB_NAME } from '../constantes';
import { getSideBar, loadLang } from '../share';




/**
 * envoyer les information du revenu au profil pour qu'il puisse etre accessible partout
 */
export function infoRevenuProfil(tab_rev) {

  let total = 0;
  let max = tab_rev[0]
  let existe = false
  let tab_cath = []
  for (let i in tab_rev) {
    //le total derevenu
    total += tab_rev[i].montant
    //trouve le revenu maximal 
    if (max < tab_rev[i].montant) {
      max = tab_rev[i].montant
    }
    //ajoute une categorie dans le tableau si elle n'existe pas
    for (let j = 0; j < tab_cath.length; j++) {
      existe = false;
      if (tab_rev[i].cathegorie == tab_cath[j]) {
        existe = true;
        break
      }
    }
    if (existe == false) {
      tab_cath.push(tab_rev[i].cathegorie);
    }
  }

  let moy = total / tab_rev.length;

  //$("#totalRevenu").text(`${total}.00$`)
  $("#totalRevenu").text(formatDevise(total))

  //recuperation du profil depuis le localstorage en string
  let profilstr = localStorage.getItem("profil")
  // si i n'y a pas de profil on passse
  if (!profilstr) {
    return;
  }
  //convertir en object pour manipuler
  let profil = JSON.parse(profilstr);


  profil.situation.tRevenu = total

  profil.situation.solde = total

  profil.statistiques.moyRevenu = moy

  profil.statistiques.maxRevenu = max

  profil.aboutMe.catRevenu = tab_cath

  localStorage.setItem("profil", JSON.stringify(profil));

  console.log("le profil");
  console.log(tab_cath);

  return tab_cath;
}


/**
 * fonction qui donne les toutes informations du revenu pour afficher dans le modal de detail
 * @param {object} rev  est le revenu donc on veut voir les details
 */
export function voirDetailModal(rev) {
  $("#voirmontant").text(formatDevise(rev.montant));
  $("#voircathegorie").text(rev.cathegorie);
  $("#voirdate").text(rev.date);
  $("#voiremplacement").text(rev.emplacement);
  $("#voirdescription").text(rev.description);
  $("#labelmontant").text(formatDevise(rev.montant));
  $("#labelcathegorie").text(rev.cathegorie);
}





/**
 * affiche les information du revenu a modifier dans un input (voir html)
 * @param {object} rev le revenu a modifier
 * 
 */
export function affichageModif(rev) {
   $(".autreCategorieBloc").removeClass('d-none');//ouvrir le input
   $(".selectCategorie").addClass('d-none');//masquer le select
  $(".autreCategorieModif").val(rev.cathegorie);
  $("#montantmodif").val(rev.montant);
  $("#emplacementmodif").val(rev.emplacement);
  $("#datemodif").val(rev.date);
  $("#descriptionmodif").val(rev.description);
}



/**
* 
* @param {*} rev le revenu a modifier
* @returns  un nouveau revenu avec les valeurs renvoyer par chaque champ de saisi
*/
function recupererChampSaisie(rev) {
  let cath;
  cath =$(".autreCategorieModif").val().trim();
  console.log(cath);
  let mont = $("#montantmodif").val();
  mont = parseInt(mont);
  let empl = $("#emplacementmodif").val();
  let dat = Date.now();
  dat= formatDate(dat);
  let desc = $("#descriptionmodif").val();
  console.log("on a tout recu");
  let reve = new Revenu(rev.id, mont, dat, empl, cath, desc);
  return reve;

}



/**
 * cette fonction compare les les valeurs de l'ancien revenu avec celle du nouveau
 * afin de recuperer celle qui doivent etre update dans la base de donne
 * @param {object} rev le revenu a modifier
 */
export async function modifierinfo(rev) {
  let newRev = recupererChampSaisie(rev);//recupere les valeurs contenu dans les cahamps de saisie meme si il  n'y apas eu de changement
  console.log("pre,iere")
  let reaffichage = false;

  let obj = {};
  if (rev.montant != newRev.montant) {
    obj["montant"] = newRev.montant
    reaffichage = true;
  }
  if (rev.date != newRev.date) {
    obj["date"] = newRev.date;
    reaffichage = true;
  }
  if (rev.emplacement != newRev.emplacement) {
    obj["emplacement"] = newRev.emplacement;
    reaffichage = true;
  }
  if (rev.cathegorie != newRev.cathegorie) {
    obj["cathegorie"] = newRev.cathegorie;
    reaffichage = true;
  }
  if (rev.description != newRev.description) {
    obj["description"] = newRev.description;
  }
  await Revenu.mise_a_jour_revenu(rev.id, obj);
  location.href = "../views/revenu.html";

}


/**:
 * @param rev tableau de revenu
 * @param identifiant identifiant du revenu chercher 
 * retoune la index du revenu ayant cette id dans rev
 */
export function searchById(rev, identifiant) {
  for (let i in rev) {
    if (rev[i].id == identifiant) {
      return i;
    }
  }
}




/**
 * fonction qui s'execute lorqu'on veut enregistrer les modifications
 * @param {Array} tab_rev tableau revenu contenu dans la BD
 * @param {*} ide  l'id du revenu sur lequel on vient de clique ( du revenu amodifier)
 */
export function clickRevenuModif(tab_rev, ide) {
  let index;
  index = searchById(tab_rev, ide);
  modifierinfo(tab_rev[index]);
}



/**
 * fonction pour supprimer ou masquer le revenu
 * @param {Array} tab_rev tableau de revenu de la BD
 * @returns  return le tableau avec les information de visibiliter modifier
 */
export function masquerRevenu(rev) {

  //let identifiant = $(this).data("id");//recupere l'id du revenu ou on veut masquer la visibiliter 
  // console.log("monid monid " + identifiant);
  // let index;
  // index = searchById(tab_rev, identifiant);
  rev.visibilite = false;
  Revenu.mise_a_jour_revenu(rev.id, { visibilite: false });
  console.log("revenu masquer");
  location.href = "../views/revenu.html";

  //return tab_rev;
}




/**
 * creer pour chaque revenu un bouton (div) qui contient les info relatif aaux revenu
 * @param {Array} tab_revenu tableau de revenu de la BD
 */
export function afficharge_revenu(tab_revenu) {

  let i = tab_revenu.length - 1; //pour afficher en commancant par le revenu le plus recent
  while (i >= 0) {
    if (tab_revenu[i].visibilite == true) {
      //creation du bouton qui va afficher le revenu
      let button = ` 
      <div class= "row">
       <div class=" col container-fluid m-0  pt-2 pb-2 c-revenu" data-bs-toggle="modal" data-bs-target="#voirrevenu" data-id=${tab_revenu[i].id} >       
          <div class="row g-0 ">
            <div class="col g-0 ">
              <div class="container-fluid d-flex flex-row p-0 align-items-center">

                <i class="bi bi-graph-up-arrow fs-6 me-2 card p-2 rounded-circle "></i>

                <div class="col">
                  <div class="row g-0 m-0">
                    <div class="fw-bold "> ${tab_revenu[i].cathegorie}</div>
                  </div>
                  <div class="row g-0 m-0 ">
                    <div class="text-body-tertiary" style="font-size: 0.9rem;">
                      ${(tab_revenu[i].description).substring(0, 20)}</div>
                  </div>
                  <div class="row g-0 m-0 mt-1">
                    <div class="card w-auto rounded-4  ps-3 pe-3">${tab_revenu[i].emplacement}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-auto">
              <div class="row">
                <div class="fw-bold fs-5 text-center"> ${formatDevise(tab_revenu[i].montant) }</div>
              </div>
              <div class="row ">
                <div class="text-body-tertiary text-center" style="font-size: 0.8rem;">
                  ${tab_revenu[i].date}
                </div>
              </div>
            </div>
           
          </div>
        </div>
        <div class="dropdown col-auto d-flex align-items-center" >
            <button class="btn btn  border-0 plusOption" data-id=${tab_revenu[i].id} type="button" data-bs-toggle="dropdown" aria-expanded="true">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="plusOption">
              <li class="modifplusoption"   data-bs-toggle="modal" data-bs-target="#modifiermodal" >
                <a class="dropdown-item" href="#">
                  <i class="bi bi-pencil me-2"></i>
                  Modifier
                </a>
              </li  >
              <li class="supprimerRevenu">
                <a class="dropdown-item text-danger" href="#">
                  <i class="bi bi-trash me-2"></i>
                  Supprimer
                </a>
              </li>
            </ul>
          </div>
      </div>`
      $('#listeRevenus').append(button);
      let ligne = `<hr class="border border-1 m-0">`
      $('#listeRevenus').append(ligne);
    }
    i--;
  }
}

/**
 * crrer un tableau dans lequel il ya tous les revenus d'une cathegorie bien precise 
 * puis appele la fonction affichage_revenu pour l'afficher
 * @param {Array} tab_revenu tableau de revenu de la BD
 */
export function afficherParCathegorie(tab_rev, cath) {
  if (cath == "tout") {
    $("#listeRevenus").empty();
    afficharge_revenu(tab_rev);
  } else {
    var newTabRevenu = [];
    var j = 0;
    for (let i in tab_rev) {
      if (tab_rev[i].cathegorie == cath) {
        newTabRevenu[j] = tab_rev[i];
        j++;
      }
    }
    console.log("tab pour filtre");
    console.log(newTabRevenu);
    $("#listeRevenus").empty();
    afficharge_revenu(newTabRevenu);
  }

}

/**
 * changer le select de type de categorie en un input pour entrer une nouvelle type de categorie
 * 
 */
export function changeCathegorie() {
  console.log("on est entre sur changer");
  $(".selectCategorie").on("change", function () {
    let choix = $(this).val();
    if (choix == "autre") {
      console.log("on est sur autre");
      $(".autreCategorieBloc").removeClass('d-none');
      $(".selectCategorie").addClass('d-none');
    } else {
      $(".autreCategorieBloc").addClass("d-none");
    }
  })
}


/**
 * affiche le liste des differente categorie sur le modal d' ajout
 * 
 */
export function afficheSelectCathegorie(tab_cath) {
  // var profilstr = localStorage.getItem("profil")
  // var profils = JSON.parse(profilstr)
  // var tab_cath = profils.aboutMe.catRevenu

  let i = tab_cath.length - 1;
  for (i; i >= 0; i--) {
    let options;
    let choixC;
    options = `<option value=${tab_cath[i]} selected>  ${tab_cath[i]}</option>`;
    choixC = ` <li class="nav-item" role="presentation">
            <div class="nav-link rounded-4 px-3 py-1 filtreCathegories" data-id=${tab_cath[i]} data-bs-toggle="tab" data-bs-target="#profil-pane"
              type="button" role="tab" aria-controls="profil-pane" aria-selected="true" >${tab_cath[i]}</div>
          </li>`
    $(".selectaffichecategorie").append(options);
    $("#choixCategorie").append(choixC);
    console.log(options);
  }

}



/**
 * affiche le liste des differente categorie sur la page
 * 
 */
export function choixCathegorie(tab_cath) {

  let i = tab_cath.length - 1;
  for (i; i >= 0; i--) {
    let options;
    options = `<option value=${tab_cath[i]} selected>  ${tab_cath[i]}</option>`;
    $(".selectaffichecategorie").append(options);
    console.log(options);
  }

}


/**
 * ajouter un revenu dans la BD avec les valeur contenu dans les input d'ajout de revenu
 */

export async function ajoutRevenuClick(tab_rev) {
  try {
    // event.preventDefault();
    let mont = $("#montant").val();
    mont = parseInt(mont);
    let empl = $("#emplacement").val();
    let dat = Date.now();
    dat= formatDate(dat);
    let desc = $("#description").val();
    let cath;
    let choix = $(".selectCategorie").val();
    if (choix === "autre") {
      cath = $(".autreCategorie").val().trim(); // récupère l'input
      //tab_cath.push(cath);
    } else {
      cath = choix; // valeur du select
    }
    let R = await Revenu.ajout_revenu(mont, dat, empl, cath, desc, true);
    console.log("L11111111111111");
    infoRevenuProfil(tab_rev);
    console.log("22222222222");
    location.href = "../views/revenu.html";
    console.log("succes");
    console.log("YAbcath    kik");
    // console.log(tab_cath);
    // console.log(tab_cath);
    // return tab_cath;
  } catch (e) {

    $("#montantError").text(e.message).addClass("d-block text-center");
  }

}


export function rechercheDescription(tab_rev) {


  let mot = $("#rechercherDescription").val();
  var newTabRevenu = [];
  var j = 0;
  for (let i in tab_rev) {
    if (tab_rev[i].description.includes(mot)) {
      newTabRevenu[j] = tab_rev[i];
      j++;
    }
  }
  console.log("tab rechecher");
  console.log(newTabRevenu);
  $("#listeRevenus").empty();
  afficharge_revenu(newTabRevenu);

}



/**
 * utilise tesseract pour extraire le texte d'une image et extraire les information dont on aura besion
 */
export function tirerTextTesseract() {
  // 1. Déclenchement de la fenêtre de sélection au clic sur l'icône
  $('#fichier').on('click', function (e) {
    e.preventDefault(); // Empêche le lien de remonter en haut de page
    $('#inputImage').click();
  });

  // 2. Quand l'utilisateur a choisi une image
  $('#inputImage').on('change', function (e) {
    const fichier = e.target.files[0]; // On récupère le fichier

    // Vérifier si un fichier a bien été sélectionné
    if (!fichier) {
      console.log("Aucun fichier choisi");
      return;
    }

    // Vérifier si c'est bien une image
    if (!fichier.type.match('image.*')) {
      alert("Veuillez sélectionner uniquement un fichier image (PNG, JPG, etc.)");
      $(this).val(''); // Réinitialise l'input
      return;
    }

    // Vérifier la taille (optionnel, ici max 5 Mo)
    if (fichier.size > 5 * 1024 * 1024) {
      alert("L'image est trop lourde (max 5 Mo).");
      return;
    }
    let Textimage = document.getElementById("modaltexttesseract");
    Textimage.textContent = "Analyse en cours... veuillez patienter...";
    // Si tout est OK
    Tesseract.recognize(
      //'/assets/images/CaptureTes1.png',
      //'/assets/images/montant.png',
      //'/assets/images/OM.png',
      fichier,
      'fra',
      //{ logger: m => console.log(m) }
    ).then(result => {
      const text = result.data.text;
      console.log("image presque charger");
      Textimage.textContent = text;
      console.log("image charger");
      //si click sur annalyser l'image on ouvre le modal pour ajouter
      $('#ajouterParImage').on('click', function () {
        annalyseImage(text);

      })

    })
      .catch((err) => {
        console.log(err.messsage);
      })
  });



}

/**
 * 
 * @param {string} text le texte ou on doit trouver le montant
 * @returns  le montant le plus elever dans le texte
 */
function montantPlusEleve(text) {
  //recherche tout les caracteres ressemblant a un montant
  //montant trouver est un tableau de montant
  //g Trouve tous les montants dans le texte, pas seulement le premier et i Ignore la différence entre majuscules et minuscules.
  let montantTrouver = text.match(/\d{1,100}(?:[\s.,]\d{3})*(?=\s*fcfa)/gi);//reconnais les montants separer par les points virgule ou espace
  //si on ne touve aucun montant
  if (!montantTrouver) {
    return null
  }
  //parcour tous les montants(avec map) et les transforme en une bonne forme en remplacant les , . et espace par puis le parsinyt pour transformer le sting en nombre
  let nombre = montantTrouver.map(a =>
    parseInt(a.replace(/[\s\u00A0.,]/g, ''))
  );
  let maxi = Math.max(...nombre);
  console.log("max max");
  console.log(Math.max(...nombre))
  return maxi;//retoune le max dans le tableau de nombre
}



/**
 * 
 * @param {string} text le texte ou on doit trouver le montant
 * @param {string} type le type de tansaction entre OM ET MOMO
 * @returns  le montant envoyer dans OM ou MOMO
 */
function transactionOmMomo(text, type) {
  let expreMontant;
  //l'expression qui reconnait le montant en fonction du type de recu
  if (type == "MOMO") {
    expreMontant = /Vous avez recu\s*([\d\s,.]+)\s*XAF/i;
  } else {
    expreMontant = /Montant Net:\s*([\d\s,.]+)\s*FCFA/i;
  }
  //trouve les montant qui ont cette expression là
  console.log("ooooo ");
  console.log(expreMontant);
  let montTrouver = text.match(expreMontant);
  console.log(montTrouver);
  console.log("ooooo " + montTrouver[1]);
  if (montTrouver) {
    return parseInt(montTrouver[1]);
  } else
    return "";
}

/**
 * 
 * @param {string} text texte ou on trouve la date
 * @returns la date dans le recu ou cheque
 */
function trouverDate(text) {
  //reconnait l'expression de chaque formate de date et si il est preceder de "date, le ,emis le "
  let expressiondate = /(Date|le|émis le|issued on)[^\d]{0,10}(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i;
  // retrouve les date dans le texte
  let datetrouver = text.match(expressiondate);
  let bonFormatDate;
  console.log("date date");
  console.log(datetrouver);
  if (datetrouver) {
    //split coupe la cahine au niveau des tiret et met dans un tableau puis inverse et rejoin le jout avec de -
    bonFormatDate = datetrouver[2].split("-").reverse().join("-");
    return bonFormatDate;
  } else {
    return "";
  }
}


/**
 * 
 * @param {string} text texte a annalyser
 * recupere toute les information utile dans l'image apres les met dans les input d'ajout
 */
function annalyseImage(text) {

  let imagemontant = "";
  let imagecath = "";
  let imageempl = "";
  let imagedate = "";
  let imagedesc = "";
  imagedate = trouverDate(text);
  //trouve l'emplacement et le montant
  if (text.includes("MOMO") || text.includes("mobile money")) {
    imagemontant = transactionOmMomo(text, "MOMO");
    console.log("AAAAAAAAA" + imagemontant);
    imageempl = "MOMO";
  } else {
    if (text.includes("Orange Money") || text.includes("OM")|| text.includes("Montant Net")) {
      imagemontant = transactionOmMomo(text, "OM");
      console.log(imagemontant);
      imageempl = "OM";
    } else {
      imagemontant = montantPlusEleve(text);
      if (text.includes("banque") || text.includes("BANK") || text.includes("Banque") || text.includes("BANQUE") || text.includes("Bank")) {
        imageempl = 'banque';
      }else{
        imagemontant = montantPlusEleve(text);
      }
    }
  }
  
  console.log(imagemontant);
  if(imagecath!=""){
    $(".autreCategorieBloc").removeClass('d-none');//ouvrir le input
    $(".selectCategorie").addClass('d-none');
    $(".autreCategorie").val(imagecath);
  }
   
  // $("#cathegorie").val(imagecath);
  $("#montant").val(imagemontant);
  $("#emplacement").val(imageempl);
  $("#dateAjout").val(imagedate);
  $("#description").val(imagedesc);
}



