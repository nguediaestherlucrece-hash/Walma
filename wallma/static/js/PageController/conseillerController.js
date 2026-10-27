import $ from 'jquery';
import { initPage } from '../utilities';
import { getSideBar } from '../share';
import { getDeepResponse } from "../deep";
import { marked } from 'marked';
import { adaptationInputMessage, afficherConversation, gestionUserMessage, LoadMessage } from '../controllerUtilitie/conseilletUtilities';

// db est garanti prêt ici

// db est garanti prêt ici




initPage("conseiller.html");
$(document).ready(
    async function () {
        let listeMessage = [];

        $(document).on("listMessage:new", function (e, newListe) {
             listeMessage = newListe.map(msg => ({
                role: msg.role,       
                content: msg.contenu 
            }));
        })

        $(document).on("listMessage:add",function(e,newMessage){
            listeMessage.push({role:newMessage.role,content:newMessage.content});
        })
        console.log("un");

        await LoadMessage();
        let first = false;

        adaptationInputMessage();
        afficherConversation();

        $("#message").on("focus", function () {
            if ($(this).val() === "") {
                console.log("un");
                $("#btn-send").css("display", "none");
            }

        });
        gestionUserMessage(listeMessage);

    }
)




