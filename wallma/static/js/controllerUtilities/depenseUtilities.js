import Tesseract from 'tesseract.js';
import Chart from 'chart.js/auto';
import $ from 'jquery';
import { Profil } from '../modeles/profil';
import { Modal } from 'bootstrap';
import { Depense } from '../modeles/depense.js';
import { DEPENSE_TB_NAME } from '../constantes';
import { getSideBar, loadLang } from '../share';

/**
 * envoyer les information de la dépense au profil pour qu'il puisse être accessible partout
 */
export function infoDepenseProfil(tab_dep) {
    let total = 0;
    let max = tab_dep[0];
    let existe = false;
    let tab_cath = [];
    
    for (let i in tab_dep) {
        // Vérifier la visibilité
        let isVisible = tab_dep[i].visible !== false && tab_dep[i].visibilite !== false;
        if (tab_dep[i].visible === undefined && tab_dep[i].visibilite === undefined) {
            isVisible = true;
        }
        
        if (isVisible) {
            // le total de dépense
            total += tab_dep[i].montant;
            // trouve la dépense maximale 
            if (max < tab_dep[i].montant) {
                max = tab_dep[i].montant;
            }
            // ajoute une catégorie dans le tableau si elle n'existe pas
            let categorie = tab_dep[i].classe || tab_dep[i].categorie || "";
            existe = false;
            for (let j = 0; j < tab_cath.length; j++) {
                if (categorie == tab_cath[j]) {
                    existe = true;
                    break;
                }
            }
            if (existe == false) {
                tab_cath.push(categorie);
            }
        }
    }

    let moy = total / tab_dep.length;

    $("#totalDepenses").text(`${total.toLocaleString('fr-FR')} FCFA`);
    
    // récupération du profil depuis le localStorage en string
    let profilstr = localStorage.getItem("profil");
    // si il n'y a pas de profil on passe
    if (!profilstr) {
        return tab_cath;
    }

    // convertir en object pour manipuler
    let profil = JSON.parse(profilstr);

    if (!profil.situation) profil.situation = {};
    if (!profil.statistiques) profil.statistiques = {};
    if (!profil.aboutMe) profil.aboutMe = {};

    profil.situation.tDepense = total;
    profil.statistiques.moyDepense = moy;
    profil.statistiques.maxDepense = max;
    profil.aboutMe.catDepense = tab_cath;

    localStorage.setItem("profil", JSON.stringify(profil));

    console.log("le profil dépenses");
    console.log(tab_cath);

    return tab_cath;
}

/**
 * fonction qui donne toutes les informations de la dépense pour afficher dans le modal de détail
 * @param {object} dep est la dépense dont on veut voir les détails
 */
export function voirDetailModal(dep) {
    console.log("voirDetailModal appelée avec:", dep);
    
    if (!dep) {
        console.error("Aucune dépense passée à voirDetailModal");
        return;
    }
    
    // Récupérer les valeurs avec fallback pour les deux noms de propriétés possibles
    let montant = dep.montant || "";
    let categorie = dep.classe || dep.categorie || "";
    let date = dep.date_realisation || dep.date || "";
    let description = dep.description || "";
    
    console.log("Valeurs récupérées - montant:", montant, "categorie:", categorie, "date:", date, "description:", description);
    
    // Afficher dans le modal
    $("#voirmontant").text(montant + " FCFA");
    $("#voircategorie").text(categorie);
    $("#voirdate").text(date);
    $("#voirdescription").text(description);
    
    // Afficher dans le header du modal
    $("#labelmontant").text(montant + " FCFA");
    $("#labelcategorie").text(categorie);
    
    console.log("Modal rempli avec les valeurs");
}

/**
 * affiche les informations de la dépense à modifier dans les inputs
 * @param {object} dep la dépense à modifier
 */
export function affichageModif(dep) {
    // Récupérer les valeurs avec fallback pour les deux noms de propriétés possibles
    let categorie = dep.classe || dep.categorie || "";
    let montant = dep.montant || "";
    let date = dep.date_realisation || dep.date || "";
    let description = dep.description || "";
    
    $("#categoriemodif").val(categorie);
    $("#montantmodif").val(montant);
    $("#datemodif").val(date);
    $("#descriptionmodif").val(description);
}

/**
 * @param {*} dep la dépense à modifier
 * @returns une nouvelle dépense avec les valeurs récupérées dans le formulaire de modification
 */
function recupererChampSaisie(dep) {
    let cat = $("#categoriemodif").val();
    let mont = $("#montantmodif").val();
    mont = parseInt(mont);
    let dat = $("#datemodif").val();
    let desc = $("#descriptionmodif").val();
    console.log("on a tout récupéré");
    let depense = new Depense(dep.id, mont, new Date(dat), desc, cat);
    return depense;
}

/**
 * cette fonction compare les valeurs de l'ancienne dépense avec celle du nouveau
 * afin de récupérer celles qui doivent être mises à jour dans la base de données
 * @param {object} dep la dépense à modifier
 */
export async function modifierinfo(dep) {
    let newDep = recupererChampSaisie(dep);
    console.log("première");
    let reaffichage = false;

    let obj = {};
    if (dep.montant != newDep.montant) {
        obj["montant"] = newDep.montant;
        reaffichage = true;
    }
    if (dep.date_realisation != newDep.date_realisation) {
        obj["date_realisation"] = newDep.date_realisation.toISOString().split('T')[0];
        reaffichage = true;
    }
    if (dep.classe != newDep.classe) {
        obj["classe"] = newDep.classe;
        reaffichage = true;
    }
    if (dep.description != newDep.description) {
        obj["description"] = newDep.description;
    }
    
    await Depense.mise_a_jour_depense(dep.id, obj);
    location.href = "../views/depense.html";
}

/**
 * @param dep tableau de dépense
 * @param identifiant identifiant de la dépense recherchée
 * retourne l'index de la dépense ayant cet id dans dep
 */
export function searchById(dep, identifiant) {
    for (let i in dep) {
        if (dep[i] && dep[i].id == identifiant) {
            return parseInt(i); // Retourner un nombre au lieu d'une chaîne
        }
    }
    return -1; // Retourner -1 si non trouvé
}

/**
 * fonction qui s'exécute lorsqu'on veut enregistrer les modifications
 * @param {Array} tab_dep tableau dépense contenu dans la BD
 * @param {*} ide l'id de la dépense sur laquelle on vient de cliquer (de la dépense à modifier)
 */
export function clickDepenseModif(tab_dep, ide) {
    let index;
    index = searchById(tab_dep, ide);
    modifierinfo(tab_dep[index]);
}

/**
 * fonction pour supprimer ou masquer la dépense
 * @param {Array} tab_dep tableau de dépense de la BD
 * @returns return le tableau avec les informations de visibilité modifiées
 */
export function masquerDepense(tab_dep) {
    $('.masqueD').off('click').on("click", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
            let identifiant = $(this).data("id");
            console.log("monid " + identifiant);
            let index;
            index = searchById(tab_dep, identifiant);
            tab_dep[index].visible = false;
            await Depense.mise_a_jour_depense(tab_dep[index].id, { visible: false });
            console.log("dépense masquée");
            location.href = "../views/depense.html";
        }
    });
    return tab_dep;
}

/**
 * créer pour chaque dépense un bouton (div) qui contient les info relatives aux dépenses
 * @param {Array} tab_depense tableau de dépense de la BD
 */
export function afficharge_depense(tab_depense) {
    console.log("Affichage des dépenses:", tab_depense);
    
    let i = tab_depense.length - 1; // pour afficher en commençant par la dépense la plus récente
    while (i >= 0) {
        // Vérifier la visibilité avec les deux noms possibles
        let isVisible = tab_depense[i].visible !== false && tab_depense[i].visibilite !== false;
        // Si visible n'est pas défini, considérer comme visible par défaut
        if (tab_depense[i].visible === undefined && tab_depense[i].visibilite === undefined) {
            isVisible = true;
        }
        
        if (isVisible) {
            console.log("Affichage dépense:", tab_depense[i]);
            
            // Récupérer les valeurs avec fallback
            let montant = tab_depense[i].montant || 0;
            let categorie = tab_depense[i].classe || tab_depense[i].categorie || "";
            let date = tab_depense[i].date_realisation || tab_depense[i].date || "";
            let description = tab_depense[i].description || "";
            
            // Création du bouton qui va afficher la dépense
            let button = `<div class="container-fluid m-0 pt-2 pb-2 c-depense" data-bs-toggle="modal" data-bs-target="#voirdepense" data-id=${tab_depense[i].id}>       
                <div class="row g-0">
                    <div class="col g-0">
                        <div class="container-fluid d-flex flex-row p-0 align-items-center">
                            <i class="bi bi-graph-down-arrow fs-6 me-2 card p-2 rounded-circle"></i>
                            <div class="col">
                                <div class="row g-0 m-0">
                                    <div class="fw-bold">${montant} FCFA</div>
                                </div>
                                <div class="row g-0 m-0">
                                    <div class="text-body-tertiary" style="font-size: 0.9rem;">
                                        Type: ${categorie}</div>
                                </div>
                                <div class="row g-0 m-0 mt-1">
                                    <div class="card w-auto rounded-4 ps-3 pe-3">${date}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="row">
                            <div class="fw-bold fs-5 text-center text-danger">${categorie}</div>
                        </div>
                        <div class="row">
                            <div class="text-body-tertiary text-center" style="font-size: 0.8rem;">
                                ${date}
                            </div>
                        </div>
                        <div class="row">
                            <button class="btn btn-sm border-0 masqueD" data-id="${tab_depense[i].id}">
                                <i class="bi bi-eye-slash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
            $('#listeDepenses').append(button);
            let ligne = `<hr class="border border-1 m-0">`;
            $('#listeDepenses').append(ligne);
        }
        i--;
    }
}

/**
 * créer un tableau dans lequel il y a toutes les dépenses d'une catégorie bien précise 
 * puis appelle la fonction affichage_depense pour l'afficher
 * @param {Array} tab_depense tableau de dépense de la BD
 */
export function afficherParCategorie(tab_dep, cath) {
    if (cath == "tout") {
        afficharge_depense(tab_dep);
    } else {
        var newTabDepense = [];
        var j = 0;
        for (let i in tab_dep) {
            let categorie = tab_dep[i].classe || tab_dep[i].categorie || "";
            if (categorie == cath) {
                newTabDepense[j] = tab_dep[i];
                j++;
            }
        }
        console.log("tab pour filtre");
        console.log(newTabDepense);
        $("#listeDepenses").empty();
        afficharge_depense(newTabDepense);
    }
}

/**
 * changer le select de type de catégorie en un input pour entrer une nouvelle type de catégorie
 */
export function changeCategorie() {
    $(".selectCategorie").on("change", function () {
        let choix = $(this).val();
        if (choix == "autre") {
            $("#autreCategorieBloc").removeClass('d-none');
            $(".selectCategorie").addClass('d-none');
        } else {
            $("#autreCategorieBloc").addClass("d-none");
        }
    });
}

/**
 * affiche la liste des différentes catégories sur le modal d'ajout
 */
export function afficheSelectCategorie(tab_cath) {
    let i = tab_cath.length - 1;
    for (i; i >= 0; i--) {
        let options;
        let choixC;
        options = `<option value=${tab_cath[i]} selected>${tab_cath[i]}</option>`;
        choixC = `<li class="nav-item" role="presentation">
            <div class="nav-link rounded-4 px-3 py-1 filtreCategories" data-id=${tab_cath[i]} data-bs-toggle="tab" data-bs-target="#profil-pane"
              type="button" role="tab" aria-controls="profil-pane" aria-selected="true">${tab_cath[i]}</div>
          </li>`;
        $("#selectaffichecategorie").append(options);
        $("#choixCategorie").append(choixC);
        console.log(options);
    }
}

/**
 * ajouter une dépense dans la BD avec les valeurs contenues dans les inputs d'ajout de dépense
 */
export async function ajoutDepenseClick(tab_dep) {
    try {
        let mont = $("#montant").val();
        mont = parseInt(mont);
        let desc = $("#description").val();
        let cath;
        let choix = $(".selectCategorie").val();
        if (choix === "autre") {
            cath = $("#autreCategorie").val().trim(); // récupère l'input
        } else {
            cath = choix; // valeur du select
        }
        
        // Utiliser la date actuelle automatiquement
        let today = new Date();
        let dat = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        // Validation des champs
        if (!cath) {
            alert("Veuillez saisir une catégorie.");
            return;
        }
        if (!mont || isNaN(mont) || mont <= 0) {
            alert("Veuillez saisir un montant valide (supérieur à 0).");
            return;
        }

        let D = await Depense.ajout_depense(mont, dat, desc, cath, true);
        console.log("Dépense ajoutée avec la date:", dat);
        infoDepenseProfil(tab_dep);
        location.href = "../views/depense.html";
        console.log("succès");
    } catch (e) {
        $("#montantError").text(e.message).addClass("d-block text-center");
    }
}

export function rechercheDescription(tab_dep) {
    let mot = $("#rechercherDescription").val();
    var newTabDepense = [];
    var j = 0;
    for (let i in tab_dep) {
        if (tab_dep[i].description.includes(mot)) {
            newTabDepense[j] = tab_dep[i];
            j++;
        }
    }
    console.log("tab rechercher");
    console.log(newTabDepense);
    $("#listeDepenses").empty();
    afficharge_depense(newTabDepense);
}

/**
 * utilise tesseract pour extraire le texte d'une image et extraire les informations dont on aura besoin
 */
export function tirerTextTesseract() {
    // 1. Déclenchement de la fenêtre de sélection au clic sur l'icône
    $('#ouvrirtesseract').on("click", function (e) {
        // Empêche le lien <a> de remonter en haut de page
        e.preventDefault(); 
        
        // Simule le clic sur l'input caché
        $("#trouverFichier").click();
    });

    // 2. Récupération de l'image une fois sélectionnée
    $("#trouverFichier").on("change", function (e) {
        // e.target.files[0] contient le fichier choisi par l'utilisateur
        let fichier = e.target.files[0];

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
            fichier,
            'fra'
        ).then(result => {
            const text = result.data.text;
            Textimage.textContent = text;
            
            // si click sur analyser l'image on ouvre le modal pour ajouter
            $('#ajouterParImage').on('click', function () {
                analyseImage(text);
            });
        })
        .catch((err) => {
            console.log(err.message);
        });
    });
}

/**
 * @param {string} text le texte où on doit trouver le montant
 * @returns le montant le plus élevé dans le texte
 */
function montantPlusEleve(text) {
    // recherche tous les caractères ressemblant à un montant
    let montantTrouver = text.match(/\d{1,100}(?:[\s.,]\d{3})*(?=\s*fcfa)/gi);
    // si on ne trouve aucun montant
    if (!montantTrouver) {
        return null;
    }
    // parcourt tous les montants et les transforme en nombre
    let nombre = montantTrouver.map(a =>
        parseInt(a.replace(/[\s\u00A0.,]/g, ''))
    );
    let maxi = Math.max(...nombre);
    console.log("max max");
    console.log(Math.max(...nombre));
    return maxi; // retourne le max dans le tableau de nombre
}

/**
 * @param {string} text texte où on trouve la date
 * @returns la date dans le reçu ou chèque
 */
function trouverDate(text) {
    // reconnaît l'expression de chaque format de date
    let expressiondate = /(Date|le|émis le|issued on)[^\d]{0,10}(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i;
    // retrouve les dates dans le texte
    let datetrouver = text.match(expressiondate);
    let bonFormatDate;
    console.log("date date");
    console.log(datetrouver);
    if (datetrouver) {
        // split coupe la chaîne au niveau des tirets et met dans un tableau puis inverse et rejoint avec des -
        bonFormatDate = datetrouver[2].split("-").reverse().join("-");
        return bonFormatDate;
    } else {
        return "";
    }
}

/**
 * @param {string} text texte à analyser
 * récupère toutes les informations utiles dans l'image après les met dans les inputs d'ajout
 */
function analyseImage(text) {
    let imagemontant = "";
    let imagecath = "";
    let imagedate = "";
    let imagedesc = "";
    
    imagedate = trouverDate(text);
    imagemontant = montantPlusEleve(text);
    
    // Déterminer la catégorie basée sur le contenu
    if (text.includes("facture") || text.includes("FACTURE")) {
        imagecath = "facture";
    } else if (text.includes("transport") || text.includes("TRANSPORT")) {
        imagecath = "transport";
    } else if (text.includes("santé") || text.includes("SANTE") || text.includes("médical")) {
        imagecath = "sante";
    } else {
        imagecath = "autre";
    }
    
    console.log(imagemontant);
    $("#categorie").val(imagecath);
    $("#montant").val(imagemontant);
    $("#dateAjout").val(imagedate);
    $("#description").val(imagedesc);
}