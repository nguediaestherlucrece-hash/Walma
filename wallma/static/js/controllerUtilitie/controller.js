import { getSideBar, loadLang } from "../share"
import $ from "jquery";
import { changeTheme, loadTheme } from "../utilities";
import { Profil } from "../modeles/profil";


export class Controller {
    constructor(page, isMainPage = true) {
        this.page = page
        this.isMainPage = isMainPage
        this.initPage();

    }

    initPage() {
           loadTheme();
        if (this.isMainPage) {
            $("header").append(getSideBar(this.page));
        }
        loadLang("fr");
        let profil = localStorage.getItem("profil");
        console.log(`${profil}`)
        console.log(" init page");
        if (!profil) {
            location.href = "login.html";

        }
    }
}