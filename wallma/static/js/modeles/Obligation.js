
import { IDB } from "../IDB/IDB_consummer";
import { OBLIGATION_TB_NAME } from "../constantes";

import { MyException } from "../Exception";

export class Obligation {
    constructor(id, montant, date_echeance, description, destinataire, status, visibilite = true,montantRam=0,date_dette) {
        this.id = id;
        this.montant = montant;
        this.montantRam = montantRam;
        this.date_echeance = date_echeance;
        this.date_dette = date_dette;
        this.description = description;
        this.destinataire = destinataire;
        this.status = status;
        this.visibilite = visibilite;
    }

    static fromObject(obj) {
        return new Obligation(obj.id, obj.montant, obj.date_echeance, obj.description, obj.destinataire, obj.status, obj.visibilite, obj.montantRam,obj.date_dette);
    }
    static async AjouterObligation(montant, date_echeance, description, destinataire, status, visibilite ,montantRam,date_dette) {
        try {
            console.log("on ajout obligation");
            let obligation = { montant: montant, date_echeance: date_echeance, description: description, destinataire: destinataire, status: status, visibilite: visibilite,montantRam:montantRam ,date_dette:date_dette};


            let newObjObligation = await IDB.addElement(obligation, OBLIGATION_TB_NAME);
            console.log("add")
           let  newObligation = this.fromObject(newObjObligation);
            console.log(newObligation);

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
    static async ModifierObligation(key,modification) {
    try {
                        
        // Mise à jour avec les nouvelles valeurs
        await IDB.updateElement(key,modification, OBLIGATION_TB_NAME);
    } catch (e) {
        switch (e.name) {
        }
    }
}

 static async mise_a_jour_obligation(identifiant,object){
                 try {
                        
                        let tableau_obligation = await IDB.updateElement(identifiant,object,OBLIGATION_TB_NAME); // met a jour dans la bd
                        console.log("mise a jour de obligation");
                        console.log(tableau_obligation);
                        
            
                    }
                     catch (e) {
                        switch (e.name) {
                            case "InvalidStateError":
                                throw new MyException("Operation echoue.","transactionException");
                                break;
                        }
                    }
                }

  static async  getAllObligations() {
    try {
        // Récupérer toutes les obligations
        return await IDB.getAllElement(OBLIGATION_TB_NAME); 

    } catch (e) {
        console.error("Erreur lors de la récupération des obligations :", e);
    }
}



}