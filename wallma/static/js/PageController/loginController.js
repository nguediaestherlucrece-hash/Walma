import $ from 'jquery';
import { User } from "./../modeles/user";
import { getSideBar } from '../share';
import { loadLang } from '../share';
import { initPage } from '../utilities';

initPage("login.html");
$(document).ready(
    
    function () {
        loadLang("en");
        $("#loginForm").on("submit", async function (event) {
            try {
                event.preventDefault();
                let email = $("#email").val();
                let motDePasse = $("#password").val();
                await User.se_connecter(email, motDePasse);
                location.href = "../views/dashboard.html";
            } catch (e) {
                $("#otherError").text(e.message).addClass("d-block text-center");
            }
        });
        $("#password").on("invalid", function (event) {
            this.setCustomValidity("Le mot de passe doit contenir au moins 8 caracteres.")
        })
    }
)

