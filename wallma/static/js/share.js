import $ from "jquery";

const sideBar = `
<div class="container-fluid mb-3 d-flex align-items-center ">
            <img src="/assets/logo/logo_outline.png" class="img me-2" style="width: 30px;">
            <span id="appName">Wallma</span>
        </div>
        <ul class="nav nav-pills flex-column mb-auto ">
            <li class="nav-item">
                <a href="dashboard.html" class="nav-link rounded-2"
                    aria-current="page" data-i18n="sideBar.linkDashboard">
                    <i class="bi bi-house fs-6 me-3 "></i>
                </a>
            </li>
            <li class="nav-item">
                <a href="revenu.html" class="nav-link rounded-2" 
                    aria-current="page" data-i18n="sideBar.linkRevenus">
                    <i class="bi bi-graph-up-arrow fs-6 me-3"></i>
                </a>
            </li>
            <li class="nav-item">
                <a href="depense.html" class="nav-link rounded-2" 
                    aria-current="page" data-i18n="sideBar.linkDepenses">
                    <i class="bi bi-graph-down-arrow fs-6 me-3"></i>
                </a>
            </li>
            <li class="nav-item">
                <a href="Obligation_financiere.html" class="nav-link rounded-2" 
                aria-current="page" data-i18n="sideBar.linkObligationsFinancieres">
                    <i class="bi bi-list-check fs-6 me-3"></i>
                </a>
            </li>
            <li class="nav-item">
                <a href="objectif.html" class="nav-link rounded-2" 
                    aria-current="page" data-i18n="sideBar.linkEpargne">
                    <i class="bi bi-piggy-bank fs-6 me-3"></i>
                </a>
            </li>
            <li class="nav-item ">
                <a href="conseiller.html" class="nav-link rounded-2" 
                aria-current="page" data-i18n="sideBar.linkConseiller">
                    <i class="bi bi-chat-square-dots fs-6 me-3"></i>
                </a>
            </li>
        </ul>
        <div>
            <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                    <a href="profil.html" class="nav-link rounded-2" 
                    aria-current="page" data-i18n="sideBar.linkProfil">
                        <i class="bi bi-person fs-6 me-3"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="parametre.html" class="nav-link rounded-2" 
                    aria-current="page" data-i18n="sideBar.linkParametres">
                        <i class="bi bi-gear fs-6 me-3"></i>
                    </a>
                </li>
            </ul>
        </div>
`;

const mobileSideBar=`
    <i class="d-lg-none bi bi-list fs-2" data-bs-toggle="offcanvas" href="#offmenu" role="button"
                        aria-controls="offmenu">
                    </i>
                    <div class="offcanvas offcanvas-start bg-body-tertiary" tabindex="-1" id="offmenu"
                        aria-labelledby="offcanvasExampleLabel">
                        <div class="offcanvas-header">
                            <div class="container-fluid mb-3 d-flex align-items-center ">
                                <img src="../assets/logo/logo_filled.png" class="img me-2" style="width: 40px;">

                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                        </div>

                        <div class="offcanvas-body">
                            <ul class="nav nav-pills flex-column">

                                <li class="nav-item">
                                    <a href="dashboard.html" class="nav-link rounded-2"
                                        aria-current="page" data-i18n="sideBar.linkDashboard">
                                        <i class="bi bi-house fs-6 me-3 "></i>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="revenu.html" class="nav-link rounded-2" 
                                        aria-current="page" data-i18n="sideBar.linkRevenus">
                                        <i class="bi bi-graph-up-arrow fs-6 me-3"></i>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="depense.html" class="nav-link rounded-2" 
                                        aria-current="page" data-i18n="sideBar.linkDepenses">
                                        <i class="bi bi-graph-down-arrow fs-6 me-3"></i>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="Obligation_financiere.html" class="nav-link rounded-2" 
                                    aria-current="page" data-i18n="sideBar.linkObligationsFinancieres">
                                        <i class="bi bi-list-check fs-6 me-3"></i>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="objectif.html" class="nav-link rounded-2" 
                                        aria-current="page" data-i18n="sideBar.linkEpargne">
                                        <i class="bi bi-piggy-bank fs-6 me-3"></i>
                                    </a>
                                </li>
                                <li class="nav-item ">
                                    <a href="conseiller.html" class="nav-link rounded-2" 
                                    aria-current="page" data-i18n="sideBar.linkConseiller">
                                        <i class="bi bi-chat-square-dots fs-6 me-3"></i>
                                    </a>
                                </li>
                                
                            </ul>
                            <div>
                                <ul class="nav nav-pills flex-column mb-auto">
                                    <li class="nav-item">
                                        <a href="profil.html" class="nav-link rounded-2" 
                                        aria-current="page" data-i18n="sideBar.linkProfil">
                                            <i class="bi bi-person fs-6 me-3"></i>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="parametre.html" class="nav-link rounded-2" 
                                        aria-current="page" data-i18n="sideBar.linkParametres">
                                            <i class="bi bi-gear fs-6 me-3"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- Menu invisible -->
                 
`;


/**
 * 
 * @param {String} current il s'agit l'onglet actuel ou vous vous trouvez, notamment la page en question,
 * @returns {String} representant le code html de la sidebar adapte a votre page
 * @example $("header").append(getSideBar("dashboard.html")); Pour recuperer la sideBar liee au dashboard
 */
export function getSideBar(current) {
    let ind = sideBar.indexOf(`${current}" class="`) + `${current} class="`.length;
    let side = sideBar.slice(0, ind + 1) + "own-active rounded-2  bg-body card flex-row text-primary " + sideBar.slice(ind + 1);
    side = side.replace(current, "#");
    return side;
}

export function getMobileSideBar(current){
    let ind = mobileSideBar.indexOf(`${current}" class="`) + `${current} class="`.length;
    let side = mobileSideBar.slice(0, ind + 1) + "own-active rounded-2  bg-body card flex-row text-primary " + mobileSideBar.slice(ind + 1);
    side = side.replace(current, "#");
    return side;

}


/**
 * 
 * @param {String} lang represente le code de la langue dans laquelle vous souhaitez charger votre page
 * Cette fonction recherche tous les elements avec l'attribut [data-i18n] et a partir de la valeur de cet attribut,
 * recherche la correspondance de son dans un fichier de langue et ajoute le texte correspondant
 * @example loadLang("en");
 */

export function loadLang(){
    let profil = JSON.parse(localStorage.getItem("profil"));
    if(profil)
        loadDefaultLang(profil.preference.langue);
    else
        loadDefaultLang("en");
}

export function loadDefaultLang(lang) {
    $.getJSON(`/lang/${lang}.json`, (dict) => {
        $("[data-i18n]").each(function () {
            const key = $(this).data("i18n");
            if (dict[key]) {
                $(this).contents().filter(function () {
                    return this.nodeType === 3; // Type 3 correspond aux nœuds de texte
                }).remove();
                $(this).append(dict[key]);

            }

        })
    })
}


/**
 * 
 * @param {Date} date la date du jour
 *  retourne la date convertir en yyyy-mm-jj
 */
export function formatDate(date){

    const dateConverti = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
    }).format(date);
    return dateConverti;
}
export function formatDateToNumber(date) { 
    const d = (date instanceof Date) ? date : new Date(date); 
    const year = d.getFullYear(); 
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const day = String(d.getDate()).padStart(2, '0'); 
    return Number(`${year}${month}${day}`);  } 
/**
 * 
 * @param {int} devise 
 * @returns un montant bien formater
 */
export function formatDevise(devise){

    const formateur = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    });
    return formateur.format(devise) ;

}