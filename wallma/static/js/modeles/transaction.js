import { DEPENSE_TB_NAME, OBLIGATION_TB_NAME, REVENU_TB_NAME } from "../constantes";
import { IDB } from "../IDB/IDB_consummer";
import { Depense } from "./depense";


export class Transaction {

    constructor(date, type, montant, autreInfo) {
        this.date = date;
        this.type = type;
        this.autreInfo = autreInfo;
        this.montant = montant;
    }

    static fromDepense(obj) {
        return new Transaction(obj.date, "Depense", obj.montant,obj.description );
    }

    static fromRevenu(obj) {
        return new Transaction(obj.date, "Revenu", obj.montant,obj.description );
    }

    static fromObligation(obj) {
        return new Transaction(obj.date_echeance, "Dette", obj.montant, obj.destinataire);
    }

    static async getLast() {
        try {
            let result = [];
            let list_depense = await IDB.getLastElements(10, DEPENSE_TB_NAME);
            if(Array.isArray(list_depense)){
                list_depense.forEach(function(e){
                    result.push(Transaction.fromDepense(e))
                })
            }

            let list_revenu = await IDB.getLastElements(10, REVENU_TB_NAME);
             if(Array.isArray(list_revenu)){
                list_revenu.forEach(function(e){
                    result.push(Transaction.fromRevenu(e))
                })
            }
          
            let list_obligation = await IDB.getLastElements(10, OBLIGATION_TB_NAME);
             if(Array.isArray(list_obligation)){
                list_obligation.forEach(function(e){
                    result.push(Transaction.fromObligation(e))
                })
            }
           
            console.log(result);
            return result;

        } catch (e) {
            console.error(e);
        }



    }

}