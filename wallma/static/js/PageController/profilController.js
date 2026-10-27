import { getSideBar } from '../share';
import $ from 'jquery';
import { changeProfil,chargerPhotoProfil,initInfoProfil,saveInfoProfil,toggleForm } from '../controllerUtilitie/profilModel';
import { initPage } from '../utilities';

initPage("profil.html");
$(document).ready(

            function () {
                chargerPhotoProfil();
                changeProfil();
                initInfoProfil();
                $("#submit").on("click",()=>{
                    saveInfoProfil();
                })


                let disabled = true;
                $("#toggleActiveBtn").on("click", () => {
                    console.log("click");
                    toggleForm(disabled);
                    disabled = !disabled;
                })
            }
        )






