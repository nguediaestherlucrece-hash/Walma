import { MESSAGE_TB_NAME } from "../constantes";
import { IDB } from "../IDB/IDB_consummer";
import { MyException } from "../Exception";

export class Message {
    constructor(id, contenu, dateCreation, role, idConversation) {
        this.id = id;
        this.contenu = contenu;
        this.dateCreation = dateCreation;
        this.role = role;
        this.idConversation = idConversation;
    }

    static fromObject(obj) {
        return new Message(obj.id, obj.contenu, obj.dateCreation, obj.role, obj.idConversation);
    }

    static async add_message(contenu,dateCreation,role,idConversation) {
        try {

            let message = { contenu:contenu,dateCreation:dateCreation,role:role,idConversation:idConversation };
            console.log(" on ajout message");
            let newObjRevenu = await IDB.addElement(message,MESSAGE_TB_NAME); //  ajoute l'objet a la  table
            //let newRevenu = this.fromObject(newObjRevenu);


        } catch (e) {
            switch (e.name) {
                case "InvalidStateError":
                    throw new MyException("Operation echoue.", "transactionException");
                    break;

                case "TransactionInactiveError":
                    throw new MyException("Transaction déjà terminée", "transactionInactiveException");
                    break;

                case "QuotaExceededError":
                    throw new MyException("Stockage local plein", "storageException");
                    break;

                default:
                    throw new MyException("Autre erreur IDB :" + e, "unknownException");
            }
        }
    }

    static async get_message_by_conversation_id(id){
        try{
            console.log("chargement des messages d'une conversation");
            let result=[];
            result= await IDB.getElement({idConversation:id},MESSAGE_TB_NAME);
            return result;
        }catch (e) {
            switch (e.name) {
                case "InvalidStateError":
                    throw new MyException("Operation echoue.", "transactionException");
                    break;

                case "TransactionInactiveError":
                    throw new MyException("Transaction déjà terminée", "transactionInactiveException");
                    break;

                case "QuotaExceededError":
                    throw new MyException("Stockage local plein", "storageException");
                    break;

                default:
                    throw new MyException("Autre erreur IDB :" + e, "unknownException");
            }
        }

    }
}