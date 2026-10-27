import { CONVERSATION_TB_NAME } from "../constantes";
import { IDB } from "../IDB/IDB_consummer";
import { MyException } from "../Exception";

export class Conversation {
    constructor(id, date,titre) {
        this.id = id;
        this.date=date;
        this.titre=titre;
    }

    static fromObject(obj) {
        return new Conversation(obj.id, obj.date, obj.titre);
    }

    static async newConversation(date, titre) {
        try {

            let convers = { date:date,titre:titre};
            console.log(" on ajout conversation");
            let newConvers = await IDB.addElement(convers,CONVERSATION_TB_NAME); //  ajoute l'objet a la  table
            let newConversation=this.fromObject(newConvers);
            return newConversation;
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

   
    static async getRecentConversation(nombre=10){
         try {

            
            console.log(" on get conversation");
            let list = await IDB.getLastElements(nombre,CONVERSATION_TB_NAME); //  ajoute l'objet a la  table
             console.log(list);
            return list;
           
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

}