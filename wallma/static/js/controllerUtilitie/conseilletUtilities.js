import $ from 'jquery';
import { Message } from '../modeles/message';
import { Conversation } from '../modeles/conversation';
import { getDeepResponse } from '../deep';
import { marked } from 'marked';
import { deepseekChatMessage } from '../utilities';
import { Depense } from '../modeles/depense';
import { Revenu } from '../modeles/revenu';
import { Obligation } from '../modeles/Obligation';
import { Objectif } from '../modeles/objectif';

const btnSend = $("#btn-send");
const zoneMessage = $("#message");
const cadreAffichage = $("#affichage");
const btnConversation = $("#btn-conversation");
const zoneRecentConversation = $("#z-recent-conversation");




export function adaptationInputMessage() {
    zoneMessage.on("input", function () {
        console.log("hello");
        $(this).css("height", "auto");
        const newHeight = this.scrollHeight - 30;
        $(this).css(
            "height",
            Math.min(newHeight, 100) + "px"
        );
        if ($(this).val().trim() !== "") {
            btnSend.removeClass("d-none");
        } else {
            btnSend.addClass("d-none");
        }
    })
}



export async function afficherConversation() {
    let result = await Conversation.getRecentConversation(10);
    console.log(result);
    if (Array.isArray(result)) {
        result.forEach(function (elt) {
            zoneRecentConversation.append(`
                <li  class="dropdown-item  conversation text-reset" data-id="${elt.id}">
                    <div class="container overflow-hidden">
                        <div class="row text-truncate">${elt.titre}</div>
                    </div>
                </li>
                `
            )
        });
        conversationListener();
    }
}






function conversationListener() {
    $(".conversation").on("click", async function () {
        viderEcran();
        let id = $(this).data("id");
        let listMessage = await Message.get_message_by_conversation_id(id);
        $(document).trigger("listMessage:new", [listMessage]);
        if (Array.isArray(listMessage)) {
            listMessage.forEach(function (elt) {
                if (elt.role === "assistant") {
                    cadreAffichage.append(marked.parse(elt.contenu));
                } else {
                    cadreAffichage.append('<div class="card p-2 rounded-start-4 rounded-top-4 mb-4 ms-auto" style="width:fit-content;right:0px;max-width:90%;">' + elt.contenu + '</div>');
                }
            })
        }
    })
}

export async function LoadMessage() {
    let id = $(this).data("id");
    let profil = JSON.parse(localStorage.getItem("profil"));
    if (profil.cache.idConversation) {
        viderEcran();
        let listMessage = await Message.get_message_by_conversation_id(profil.cache.idConversation);
        $(document).trigger("listMessage:new", [listMessage]);
        if (Array.isArray(listMessage)) {
            listMessage.forEach(function (elt) {
                if (elt.role === "assistant") {
                    cadreAffichage.append(marked.parse(elt.contenu));
                } else {
                    cadreAffichage.append('<div class="card p-2 rounded-start-4 rounded-top-4 mb-4 ms-auto" style="width:fit-content;right:0px;max-width:90%;">' + elt.contenu + '</div>');
                }
            })
        }
    }
}


function viderEcran() {
    $("#affichage").children().remove()
    cadreAffichage.removeClass("justify-content-center");
    cadreAffichage.addClass("align-items-start");
}





function dateEqual(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDay() === date2.getDay();
}


export function gestionUserMessage(listeMessage) {
    btnSend.on("click", async function () {
        let message = zoneMessage.val().trim();
        zoneMessage.val("");

        let profil = JSON.parse(localStorage.getItem("profil"));
        console.log(profil);
        let lastConversations = await Conversation.getRecentConversation(1);
        console.log(lastConversations);
        let lastConversation = lastConversations.at(0);

        try {
            let now = new Date(Date.now());
            console.log(lastConversation);
            console.log(now);
            console.log(new Date(lastConversation.date));
            if (lastConversation && dateEqual(now, new Date(lastConversation.date))) {
                await Message.add_message(message, Date.now(), "user", profil.cache.idConversation);
            } else {
                viderEcran();
                let conversation = await Conversation.newConversation(Date.now(), message);
                console.log(conversation);
                profil.cache.idConversation = conversation.id;
                await Message.add_message(message, Date.now(), "user", profil.cache.idConversation);
                localStorage.setItem("profil", JSON.stringify(profil));
            }
            $(document).trigger("listMessage:add", [{ role: "user", content: message }]);
        } catch (e) {
            console.log(e);
        }
        cadreAffichage.append('<div class="card p-2 rounded-start-4 rounded-top-4 mb-4 ms-auto" style="width:fit-content;right:0px;max-width:90%;">' + message + '</div>');
        $("main").animate({ scrollTop: $("main")[0].scrollHeight }, 300);
        let donnees=await getRecentTransaction();
        let rep = await getDeepResponse(deepseekChatMessage(message, listeMessage,donnees));
        try {
            Message.add_message(rep.reply, Date.now(), "assistant", profil.cache.idConversation);
            $(document).trigger("listMessage:add", [{ role: "assistant", content: rep.reply }]);
        } catch (e) {
            console.log(e);
        }
        let reponse = marked.parse(rep.reply);
        cadreAffichage.append('<p>' + reponse + '</p>');
        $("main").animate({ scrollTop: $("main")[0].scrollHeight }, 300);
    })
}

async function getRecentTransaction(){
    let profil=localStorage.getItem("profil");
   let depense =await Depense.recuperation_depenses();
   let revenu= await Revenu.recuperation_revenu();
   let obligation= await Obligation.getAllObligations();
   let objectif= await Objectif.RecuperationObjectif();
   return {profil:profil,depense:depense,revenu:revenu,obligation:obligation,objectif:objectif};
}

