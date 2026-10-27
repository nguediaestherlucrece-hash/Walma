import $ from 'jquery';
import { initPage } from '../utilities';
import {  insertProfilInfo , initialize_evolution_chart, insertLatestTransaction, insertLastObjectif, optionGraphAddListener, initialize_repartition_chart, getConseilJournalier} from '../controllerUtilitie/dashboardModel';
import { Bilan } from '../modeles/bilan';

initPage("dashboard.html");

 $(document).ready(
            function () {
                $("#btnObjectif").on("click",()=>location.href="objectif.html");
                insertProfilInfo();
                insertLastObjectif();
                getConseilJournalier();
                initialize_evolution_chart();
                initialize_repartition_chart();
                insertLatestTransaction();
                optionGraphAddListener();
                console.log("merde");
                
                
                // loadTheme();
                // changeTheme();
                let currentUser = JSON.parse(localStorage.getItem("currentUser"));
                if (currentUser) {
                    let userName = currentUser.nom;
                    $("#welcome h1").text("Bon retour, " + userName);
                }
            }
        )

async function mockBilan(){
    for(let i=0;i<5;i++){
        await Bilan.creer_bilan(new Date(2026,4,23).toDateString(),new Date(2026,4,23).toDateString(),6000+i*6500,5400+i*4200,600+i*8975,1);
    }
}


