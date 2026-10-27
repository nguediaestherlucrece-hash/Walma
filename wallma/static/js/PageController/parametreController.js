import $ from 'jquery'
import { getSideBar, loadLang } from '../share';
import { Profil } from '../modeles/profil';
import { initPage, loadTheme } from '../utilities';

initPage("parametre.html");
$(document).ready(function(){
    setCurrentLang();
    loadTheme()
    setCurrentTheme()
    changeTheme()
    
    changeLang();

})

function changeLang(){
      const opt=$("#selectLang")
      opt.on("change",function(event){
        let profil=JSON.parse(localStorage.getItem("profil"));
        profil.preference.langue=opt.val();
        localStorage.setItem("profil",JSON.stringify(profil))
        console.log(profil);
        loadLang(opt.val());
        console.log("saltu")

      })
    
}

function setCurrentTheme(){
     let profil=JSON.parse(localStorage.getItem("profil"))
    $("[data-bs-theme-value]").filter(
        function(){
            return $(this).attr("data-bs-theme-value")===profil.preference.theme;
        }
    ).prop("checked",true);

}




 function changeTheme() {
    const html = document.documentElement;
    const items = document.querySelectorAll("[data-bs-theme-value]");
    console.log(items)
    console.log("in")
    items.forEach(item => {
        item.addEventListener("click", e => {
            const theme = item.getAttribute("data-bs-theme-value");
            html.setAttribute("data-bs-theme", theme);
            let profil=JSON.parse(localStorage.getItem("profil"))
            console.log(profil)
            console.log(profil.preference.theme);
            profil.preference.theme=theme;
            localStorage.setItem("profil", JSON.stringify(profil));
            console.log("click")
            
        });
    });
}

function setCurrentLang(){
    const opt=$("#selectLang")
    let profil=JSON.parse(localStorage.getItem("profil"));
    opt.val(profil.preference.langue);
    loadLang(profil.preference.langue)
}


