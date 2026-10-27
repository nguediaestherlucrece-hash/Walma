import $ from "jquery";
import { getMobileSideBar, getSideBar ,loadLang} from "./share";
import { SYSTEM_ROLE_CONSEIL_JOURNALIER } from "./constantes";

export function changeTheme() {
    const html = document.documentElement;
    const items = document.querySelectorAll("[data-bs-theme-value]");
    const icon = document.getElementById("themeIcon");

    items.forEach(item => {
        item.addEventListener("click", e => {
            e.preventDefault();
            const theme = item.getAttribute("data-bs-theme-value");

            html.setAttribute("data-bs-theme", theme);
            localStorage.setItem("theme", theme);

            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            let newtheme = theme === "dark" ? "bi bi-moon-stars fs-5" :
                theme === "light" ? "bi bi-sun-fill fs-5" :
                    "bi bi-circle-half fs-5";
            icon.className = newtheme;
        });
    });
}


export function loadTheme() {
    let profil = JSON.parse(localStorage.getItem("profil"));
    if(profil)
        document.documentElement.setAttribute("data-bs-theme", profil.preference.theme);
}



export function initPage(name_page) {
    let profil = localStorage.getItem("profil");
    console.log(" init page");
     loadTheme();
  
    loadLang();
    if(name_page!=="login.html" && name_page!=="signIn.html"){
         if (!profil) {
        location.href = "login.html";
    }
      $("header").append(getSideBar(name_page));
      $("nav").append(getMobileSideBar(name_page));
    }
}

function getSystemRoleChat(donnees){
     return {
    role: "system", 
    content: `Vous êtes un assistant financier et un conseiller utile et concis sur la base de mes donnees
    Donnees:${donnees} NB: Respecte la langue qui se trouve dans le profil.`
}
}


export function deepseekChatMessage(newMsge,historiqueMsge,donnees){
    let result=[];
    result.push(getSystemRoleChat(donnees));
    if(Array.isArray(historiqueMsge)){
        historiqueMsge.forEach((elt)=>{
            result.push(elt);
        })
    }
    result.push({role:"user",content:newMsge});
    return result;
}

export function deepseekConseilJournalier(newMsge){
     let result=[];
    result.push(SYSTEM_ROLE_CONSEIL_JOURNALIER);
    result.push({role:"user",content:newMsge});
    console.log(result);
    return result;

}




