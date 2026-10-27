import $ from 'jquery';
import Tesseract from 'tesseract.js';
import { Depense } from '../modeles/depense';
import { Modal, Dropdown } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { formatDate, formatDevise } from '../share';

/**
 * envoyer les informations de la dépense au profil pour qu'il puisse être accessible partout
 * @param {Array} tab_dep tableau de dépenses
 */
export function infoDepenseProfil(tab_dep) {
    let total = 0;
    let max = tab_dep.length > 0 ? tab_dep[0].montant : 0;
    let existe = false;
    //let tab_cath = ["facture", "achat", "transport", "sante"];
    let tab_cath = [];
    for (let i in tab_dep) {
        // Vérifier la visibilité
        let isVisible = tab_dep[i].visibilite !== false;
        if (tab_dep[i].visibilite === undefined) {
            isVisible = true;
        }
        
        if (isVisible) {
            total += tab_dep[i].montant;
            if (max < tab_dep[i].montant) {
                max = tab_dep[i].montant;
            }
            let categorie = tab_dep[i].categorie || "";
            // Ignorer les catégories vides
            if (categorie === "") {
                continue;
            }
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

    let moy = tab_dep.length > 0 ? total / tab_dep.length : 0;

    $("#totalDepenses").text(formatDevise(total));
    let profilstr = localStorage.getItem("profil");
    if (!profilstr) {
        return tab_cath;
    }
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

function searchById(rev, identifiant) {
    console.log("Dans searchById");
    console.log(` Recherche d'un element dans le tableau des depenses: affichage tableau`);
    console.log(`identifiant ${identifiant}`)
    for (let i in rev) {
        if (rev[i].id === identifiant) {
            return parseInt(i);
        }
    }
}
/**
 * affiche les informations de la dépense à modifier dans les inputs
 * @param {object} dep la dépense à modifier
 */
export function affichageModif(dep) {
    console.log("Dans affichageModification");
    console.log("Affichage modification pour dépense:", dep);
    let categorie = dep.categorie || "";
    let montant = dep.montant || "";
    let description = dep.description || "";
    // Toujours afficher le champ input pour la catégorie (comme dans revenu)
    $(".autreCategorieBloc").removeClass('d-none'); // ouvrir le input
    $(".selectCategorie").addClass('d-none'); // masquer le select
    $(".autreCategorieModif").val(categorie);
    
    $("#montantmodif").val(montant);
    $("#descriptionmodif").val(description);
    console.log("Formulaire rempli - catégorie:", categorie, "montant:", montant);
}
/**
 * fonction qui donne les toutes informations de la dépense pour afficher dans le modal de détail
 * @param {object} dep est la dépense dont on veut voir les détails
 */
function voirDetailModal(dep) {
    console.log("voirDetailModal");
    console.log(dep);
    $("#voirmontant").text(formatDevise(dep.montant));
    $("#voircategorie").text(dep.categorie);
    $("#voirdate").text(dep.date);
    $("#voirdescription").text(dep.description);
}

/**
 * @param {*} dep la dépense à modifier
 * @returns une nouvelle dépense avec les valeurs récupérées dans le formulaire de modification
 */
export function recupererChampSaisie(dep) {
    // Récupérer la catégorie depuis le champ input (comme dans revenu)
    let cat = $(".autreCategorieModif").val().trim();
    let mont = $("#montantmodif").val();
    mont = mont.toString().replace(/[^0-9]/g, '');
    mont = parseInt(mont) || 0;
    let dat = Date.now();
    dat = formatDate(dat);
    let desc = $("#descriptionmodif").val();
    console.log("Valeurs récupérées - catégorie:", cat, "montant:", mont, "date:", dat, "description:", desc);
    return {
        id: dep.id,
        montant: mont,
        date: dat,
        classe: cat,
        description: desc
    };
}

/**
 * cette fonction compare les valeurs de l'ancienne dépense avec celle du nouveau
 * afin de récupérer celles qui doivent être mises à jour dans la base de données
 * @param {object} dep la dépense à modifier
 */
export async function modifierinfo(dep) {
    console.log("Début de la modification pour dépense:", dep);
    let newDep = recupererChampSaisie(dep);
    console.log("Nouvelles valeurs:", newDep);
    let obj = {};
    let hasChanges = false;
    let oldMontant = parseInt(dep.montant) || 0;
    let newMontant = parseInt(newDep.montant) || 0;
    if (oldMontant != newMontant) {
        obj["montant"] = newMontant;
        hasChanges = true;
        console.log("Montant changé:", oldMontant, "->", newMontant);
    }

    let oldDate = dep.date || "";
    let newDate = newDep.date || "";
    if (oldDate != newDate) {
        obj["date"] = newDate;
        hasChanges = true;
        console.log("Date changée:", oldDate, "->", newDate);
    }

    let oldClasse = dep.categorie || "";
    let newClasse = newDep.classe || "";
    if (oldClasse != newClasse) {
        obj["categorie"] = newClasse;
        hasChanges = true;
        console.log("Classe changée:", oldClasse, "->", newClasse);
    }

    let oldDesc = dep.description || "";
    let newDesc = newDep.description || "";
    if (oldDesc != newDesc) {
        obj["description"] = newDesc;
        hasChanges = true;
        console.log("Description changée");
    }

    if (hasChanges) {
        console.log("Mise à jour avec:", obj);

        await Depense.mise_a_jour_depense(dep.id, obj);
        console.log("Mise à jour réussie");
         await rafraichirListeDepenses();
        if (oldMontant !== newMontant) {
            let profil = JSON.parse(localStorage.getItem("profil"));
            if (profil && profil.situation) {
                profil.situation.tDepense = (profil.situation.tDepense || 0) - oldMontant + newMontant;
                localStorage.setItem("profil", JSON.stringify(profil));
                console.log("Profil tDepense mis à jour:", profil.situation.tDepense);
            }
        }
    } else {
        console.log("Aucun changement détecté");
    }
   
   
}

/**
 * fonction qui s'exécute lorsqu'on veut enregistrer les modifications
 * @param {Array} tab_dep tableau dépense contenu dans la BD
 * @param {*} id l'id de la dépense sur laquelle on vient de cliquer (de la dépense à modifier)
 */
export async function clickDepenseModif(tab_dep, id) {
    console.log('on click depense modif: tableau');
    console.log(tab_dep);
    let index = searchById(tab_dep, id);
    if (index !== undefined && tab_dep[index]) {
        await modifierinfo(tab_dep[index]);
    }
}

/**
 * fonction pour supprimer ou masquer la dépense
 * @param {Array} tab_dep tableau de dépense de la BD
 * @returns return le tableau avec les informations de visibilité modifiées
 */
export async function masquerDepense(index,tab_dep) {

           
            if (tab_dep[index]) {
                tab_dep[index].visible = false;
                await Depense.mise_a_jour_depense(tab_dep[index].id, { visibilite: false });
                console.log("dépense masquée");
                await rafraichirListeDepenses(tab_dep);
            }
        
  
}

/**
 * créer pour chaque dépense un bouton (div) qui contient les info relatives aux dépenses
 * @param {Array} tab_depense tableau de dépense de la BD
 */
export function affichage_depense(tab_depense) {
    let i = tab_depense.length - 1; //pour afficher en commençant par la dépense la plus récente
    while (i >= 0) {
        if (tab_depense[i].visibilite == true) {
            //création du bouton qui va afficher la dépense
            let button = ` 
            <div class="row">
             <div class=" col container-fluid m-0  pt-2 pb-2 c-depense" data-bs-toggle="modal" data-bs-target="#voirdepense" data-id=${tab_depense[i].id} >       
                <div class="row g-0 ">
                  <div class="col g-0 ">
                    <div class="container-fluid d-flex flex-row p-0 align-items-center">

                      <i class="bi bi-graph-down-arrow fs-6 me-2 card p-2 rounded-circle "></i>

                      <div class="col">
                        <div class="row g-0 m-0">
                          <div class="fw-bold ">${tab_depense[i].categorie || 'Dépense'}</div>
                        </div>
                        <div class="row g-0 m-0 ">
                          <div class="text-body-tertiary" style="font-size: 0.9rem;">
                            ${tab_depense[i].description ? (tab_depense[i].description.substring(0, 20) + (tab_depense[i].description.length > 20 ? '...' : '')) : ''}</div>
                        </div>
                        <div class="row g-0 m-0 mt-1">
                          <div class="card w-auto rounded-4  ps-3 pe-3">${tab_depense[i].categorie || ''}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="row">
                      <div class="fw-bold fs-5 text-center"> ${formatDevise(tab_depense[i].montant)}</div>
                    </div>
                    <div class="row ">
                      <div class="text-body-tertiary text-center" style="font-size: 0.8rem;">
                        ${tab_depense[i].date || ''}
                      </div>
                    </div>
                  </div>
                 
                </div>
              </div>
              <div class="dropdown col-auto d-flex align-items-center" >
                  <button class="btn btn  border-0 plusOption" data-id=${tab_depense[i].id} type="button" data-bs-toggle="dropdown" aria-expanded="true">
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
            $('#listeDepenses').append(button);
            let ligne = `<hr class="border border-1 m-0">`
            $('#listeDepenses').append(ligne);
        }
        i--;
    }
}

export function attachEvenementDonnees(tab_depense){
     $('.c-depense').on("click", function () {
        var identifiant = $(this).data("id");
        var indexe = searchById(tab_depense, identifiant);
          console.log(`click sur un cadre depense position: ${indexe}`);
        

        voirDetailModal(tab_depense[indexe]);
    });

    $('.plusOption').on("click", function () {
        var identifiants = $(this).data("id");
         console.log(`click sur le bouton plus option id depense ${identifiants}`);
        var indexes = searchById(tab_depense, identifiants);
        
       
        $(this).find(".modifplusoption").on("click", function () {
            changeCategorie(); // Initialiser le changement de catégorie (comme dans revenu)
            affichageModif(tab_depense[indexes]);
            console.log(`click sur le bouton modifier une depense id ${identifiants}`);
            //si on veut enregistrer les modifs
            $('#Enregistrermodif').on("click", function () {
                modifierinfo(tab_depense[indexes]);
               
                console.log("modificatioon succes");
            })
        })
        $(".supprimerRevenu").on("click",async function () {
           await masquerDepense(indexes,tab_depense);

        })

    })
}

export async function ajoutDepenseClick() {
    try {
        let cat;
        let choix = $("#categorie").val();
        if (choix === "autre" || choix === "other") {
            cat = $("#autreCategorie").val().trim(); 
            if (!cat) {
                alert("Veuillez saisir une catégorie.");
                return;
            }
        } else {
            cat = choix; 
            if (!cat) {
                alert("Veuillez sélectionner une catégorie.");
                return;
            }
        }
        let mont = $("#montant").val().trim();
        // Utiliser la date du jour automatiquement
        let dat = Date.now();
        dat = formatDate(dat);
        let desc = $("#description").val().trim();

        if (!mont || isNaN(mont) || parseInt(mont) <= 0) {
            alert("Veuillez saisir un montant valide (supérieur à 0).");
            return;
        }
        mont = parseInt(mont);

        // Vérifier le solde disponible avant d'enregistrer la dépense
        let profil = JSON.parse(localStorage.getItem("profil"));
        let soldeDisponible = profil?.situation?.solde || 0;
        if (mont > soldeDisponible) {
            alert("Le montant de la dépense dépasse le solde disponible.");
            return;
        }

        console.log("Ajout de la dépense...");
        let depense = {
            montant: mont,
            date: dat,
            classe: cat,
            description: desc,
            visible: true
        };
        await Depense.ajout_depense(mont, dat, cat, desc, true);
        profil = JSON.parse(localStorage.getItem("profil"));
        if (profil && profil.situation) {
            profil.situation.solde = (profil.situation.solde || 0) - mont;
            localStorage.setItem("profil", JSON.stringify(profil));
        }

        $("#categorie").val('');
        $("#autreCategorie").val('');
        $("#autreCategorieBloc").addClass('d-none');
        $("#categorie").removeClass('d-none');
        $("#montant").val('');
        $("#dateAjout").val('');
        $("#description").val('');
        await rafraichirListeDepenses();
        console.log("Dépense ajoutée avec succès");
    } catch (e) {
        console.error("Erreur lors de l'ajout:", e);
        alert("Erreur lors de l'ajout de la dépense: " + e.message);
    }
}

/**
 * Rafraîchir la liste des dépenses sans rechargement de page
 */
export async function rafraichirListeDepenses() {
    try {
        console.log("on rafraichissement depense");
        let tableau_depense = await Depense.recuperation_depenses();
        $(document).trigger("listDepense:updated", [tableau_depense]);
        console.log("Liste des dépenses rafraîchie");
    } catch (error) {
        console.error("Erreur lors du rafraîchissement:", error);
    }
}

/**
 * changer le select de type de catégorie en un input pour entrer une nouvelle type de catégorie
 */
export function changeCategorie() {
    console.log("on est entre sur changer categorie");
    // Pour le modal d'ajout
    $("#categorie").on("change", function () {
        let choix = $(this).val();
        if (choix === "autre" || choix === "other") {
            console.log("on est sur autre/other");
            $("#autreCategorieBloc").removeClass('d-none');
            $("#categorie").addClass('d-none');
        } else {
            $("#autreCategorieBloc").addClass("d-none");
            $("#categorie").removeClass('d-none');
        }
    });
    
    // Pour le modal de modification ( utilise les classes communes)
    $(".selectCategorie").on("change", function () {
        let choix = $(this).val();
        if (choix === "autre" || choix === "other") {
            console.log("on est sur autre/other dans modification");
            $(".autreCategorieBloc").removeClass('d-none');
            $(".selectCategorie").addClass('d-none');
        } else {
            $(".autreCategorieBloc").addClass("d-none");
            $(".selectCategorie").removeClass('d-none');
        }
    });
}

/**
 * fonction de recherche par description dans les dépenses
 * @param {Array} tab_dep tableau de dépenses
 */
export function rechercheDescription(tab_dep) {
    let mot = $("#searchInput").val();
    var newTabDepense = [];
    var j = 0;
    
    // Si le champ de recherche est vide, afficher toutes les dépenses visibles
    if (!mot || mot.trim() === "") {
        for (let i in tab_dep) {
            if (tab_dep[i].visibilite) {
                newTabDepense[j] = tab_dep[i];
                j++;
            }
        }
    } else {
        // Sinon, filtrer par description
        for (let i in tab_dep) {
            // Vérifier la visibilité et si la description contient le mot recherché
            if (tab_dep[i].visibilite && tab_dep[i].description && tab_dep[i].description.includes(mot)) {
                newTabDepense[j] = tab_dep[i];
                j++;
            }
        }
    }
    
    console.log("tab rechercher");
    console.log(newTabDepense);
    $("#listeDepenses").empty();
    affichage_depense(newTabDepense);
    attachEvenementDonnees(newTabDepense);
}

/**
 * utilise tesseract pour extraire le texte d'une image et extraire les informations dont on aura besoin
 */
export function tirerTextTesseract() {
    $('#fichier').on('click', function (e) {
        e.preventDefault(); 
        $('#inputImage').click();
    });
    $('#inputImage').on('change', function (e) {
        const fichier = e.target.files[0]; 
        if (!fichier) {
            console.log("Aucun fichier choisi");
            return;
        }
        if (!fichier.type.match('image.*')) {
            alert("Veuillez sélectionner uniquement un fichier image (PNG, JPG, etc.)");
            $(this).val(''); 
            return;
        }
        if (fichier.size > 5 * 1024 * 1024) {
            alert("L'image est trop lourde (max 5 Mo).");
            return;
        }
        
        let Textimage = document.getElementById("modaltexttesseract");
        Textimage.textContent = "Analyse en cours... veuillez patienter...";
        // Ouvrir le modal Tesseract avant de commencer l'analyse
        const modalTesseractElement = document.getElementById('texteTesseract');
        let modalTesseract = bootstrap.Modal.getInstance(modalTesseractElement);
        if (!modalTesseract) {
            modalTesseract = new bootstrap.Modal(modalTesseractElement);
        }
        modalTesseract.show();
        Tesseract.recognize(
            fichier,
            'fra',
        ).then(result => {
            const text = result.data.text;
            console.log("Texte extrait de l'image:", text);
            Textimage.textContent = text;
            $('#ajouterParImage').off('click');
            $('#ajouterParImage').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                analyseImage(text);
                modalTesseract.hide();
                $(modalTesseractElement).one('hidden.bs.modal', function () {
                    setTimeout(() => {
                        const modalAjoutElement = document.getElementById('ajoutmodal');
                        let modalAjout = bootstrap.Modal.getInstance(modalAjoutElement);
                        if (!modalAjout) {
                            modalAjout = new bootstrap.Modal(modalAjoutElement);
                        }
                        modalAjout.show();
                    }, 150);
                });
            });
        })
            .catch((err) => {
                console.error("Erreur Tesseract:", err);
                Textimage.textContent = "Erreur lors de l'analyse de l'image. Veuillez réessayer.";
            })
    });
}

/**
 * @param {string} text le texte où on doit trouver le montant
 * @returns le montant le plus élevé dans le texte (priorité au total de la facture)
 */
function montantPlusEleve(text) {
    // 1. Chercher d'abord le montant total (TOTAL, TOTAL TTC, SOUS-TOTAL, etc.)
    // Pattern amélioré pour capturer le montant après les mots-clés de total
    let totalPatterns = [
        /(?:TOTAL|SOUS-TOTAL|TOTAL\s+TTC|TOTAL\s+HT|MONTANT\s+TOTAL|TOTAL\s+À\s+PAYER|TOTAL\s+PAYER)[\s:]*(\d{1,100}(?:[\s.,]\d{3})*)/gi,
        /(?:TOTAL|SOUS-TOTAL|TOTAL\s+TTC|TOTAL\s+HT|MONTANT\s+TOTAL|TOTAL\s+À\s+PAYER|TOTAL\s+PAYER)[\s:]*(\d{1,100}(?:[\s.,]\d{3})*)\s*(?:FCFA|fcfa|XAF|xaf)/gi
    ];
    
    let totalMontant = null;
    for (let pattern of totalPatterns) {
        let matches = [...text.matchAll(pattern)];
        if (matches && matches.length > 0) {
            // Prendre le dernier match (généralement le total final)
            let lastMatch = matches[matches.length - 1];
            if (lastMatch && lastMatch[1]) {
                let montantStr = lastMatch[1].replace(/[^\d]/g, '');
                if (montantStr.length > 0) {
                    totalMontant = parseInt(montantStr);
                    console.log("Montant total trouvé:", totalMontant);
                    return totalMontant;
                }
            }
        }
    }
    
    // 2. Si pas de total trouvé, chercher tous les montants avec FCFA/XAF
    let montantTrouver = text.match(/(\d{1,100}(?:[\s.,]\d{3})*)\s*(?:FCFA|fcfa|XAF|xaf|F\s*C\s*F\s*A)/gi);
    if (!montantTrouver || montantTrouver.length === 0) {
        // 3. Chercher tous les nombres de 4 chiffres ou plus (probablement des montants)
        montantTrouver = text.match(/\d{4,}/g);
    }
    
    if (!montantTrouver || montantTrouver.length === 0) {
        return null;
    }
    
    // Parcourt tous les montants et les transforme en nombre
    let nombre = montantTrouver.map(a => {
        let cleaned = a.replace(/[^\d]/g, '');
        return cleaned.length >= 3 ? parseInt(cleaned) : 0; // Au moins 3 chiffres pour être un montant valide
    }).filter(n => n > 0 && n >= 100); // Filtrer les montants trop petits (au moins 100)
    
    if (nombre.length === 0) {
        return null;
    }
    
    // Retourne le montant le plus élevé (probablement le total)
    let maxi = Math.max(...nombre);
    console.log("Montant le plus élevé trouvé:", maxi);
    return maxi;
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
    if (text.includes("facture") || text.includes("FACTURE") || text.includes("invoice")) {
        imagecath = "facture";
    } else if (text.includes("transport") || text.includes("TRANSPORT")) {
        imagecath = "transport";
    } else if (text.includes("santé") || text.includes("SANTE") || text.includes("médical") || text.includes("health")) {
        imagecath = "sante";
    } else if (text.includes("achat") || text.includes("ACHAT") || text.includes("purchase")) {
        imagecath = "achat";
    } else {
        imagecath = "autre";
    }
    
    console.log(imagemontant);
    
    // Si la catégorie est "autre", afficher le champ input pour saisir une nouvelle catégorie
    if (imagecath === "autre" || imagecath === "other") {
        $("#autreCategorieBloc").removeClass('d-none');
        $("#categorie").addClass('d-none');
        $("#autreCategorie").val("");
    } else {
        $("#autreCategorieBloc").addClass('d-none');
        $("#categorie").removeClass('d-none');
        $("#categorie").val(imagecath);
    }
    
    $("#montant").val(imagemontant);
    $("#dateAjout").val(imagedate);
    $("#description").val(imagedesc);
}

/**
 * Affiche les catégories dans le select du modal de modification
 * @param {Array} tab_cath tableau de catégories
 */
export function afficheSelectCategorieModifDepense(tab_cath) {
    // Vider le select existant
    $(".selectaffichecategorie").empty();
    
    if (!tab_cath || tab_cath.length === 0) {
        return;
    }
    
    let i = tab_cath.length - 1;
    for (i; i >= 0; i--) {
        let options = `<option value="${tab_cath[i]}">${tab_cath[i]}</option>`;
        $(".selectaffichecategorie").append(options);
    }
}

/**
 * Affiche les catégories de dépenses comme boutons de filtre à côté de "Tous"
 * @param {Array} tab_cath tableau de catégories
 */
export function afficheSelectCategorieDepense(tab_cath) {
    // Vider les catégories existantes (sauf "Tous")
    $("#choixCategorieDepense li:not(:first-child)").remove();
    
    if (!tab_cath || tab_cath.length === 0) {
        return;
    }
    
    let i = tab_cath.length - 1;
    for (i; i >= 0; i--) {
        let choixC = `<li class="nav-item" role="presentation">
            <div class="nav-link rounded-4 px-3 py-1 filtreCategoriesDepense" data-id="${tab_cath[i]}" data-bs-toggle="tab" data-bs-target="#profil-pane"
              type="button" role="tab" aria-controls="profil-pane" aria-selected="true">${tab_cath[i]}</div>
          </li>`;
        $("#choixCategorieDepense").append(choixC);
    }
}

/**
 * Filtre les dépenses par catégorie et les affiche
 * @param {Array} tab_dep tableau de dépenses
 * @param {string} cath catégorie à filtrer ("tout" pour toutes les dépenses)
 */
export function afficherParCategorieDepense(tab_dep, cath) {
    if (cath == "tout") {
        $("#listeDepenses").empty();
        affichage_depense(tab_dep);
        attachEvenementDonnees(tab_dep);
    } else {
        var newTabDepense = [];
        var j = 0;
        for (let i in tab_dep) {
            // Vérifier la visibilité et la catégorie
            let isVisible = tab_dep[i].visibilite !== false;
            if (tab_dep[i].visibilite === undefined) {
                isVisible = true;
            }
            if (isVisible && tab_dep[i].categorie == cath) {
                newTabDepense[j] = tab_dep[i];
                j++;
            }
        }
        console.log("tab pour filtre catégorie:", cath);
        console.log(newTabDepense);
        $("#listeDepenses").empty();
        affichage_depense(newTabDepense);
        attachEvenementDonnees(newTabDepense);
    }
}



