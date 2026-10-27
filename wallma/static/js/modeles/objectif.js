

import { IDB } from "../IDB/IDB_consummer";
import { OBJECTIF_TB_NAME } from "../constantes";
import { USER_TB_NAME } from "../constantes";
import { MyException } from "../Exception";

export class Objectif {

    constructor(intitule, id, description, montant, economie, dateNaissance, dateEcheance, statut, idUser,visibilite) {
        this.intitule = intitule;
        this.id = id;
        this.description = description;
        this.montant = montant;
        this.economie = economie;
        this.dateNaissance = dateNaissance;
        this.dateEcheance = dateEcheance;
        this.visibilite = visibilite;
        this.statut = statut;
        this.idUser = idUser;
        
    }

    static fromObject(obj) {
        return new Objectif(obj.id, obj.intitule, obj.description, obj.montant, obj.economie, obj.dateNaissance, obj.dateEcheance, obj.statut, obj.idUser, obj.visibilite);
    }

  static async AjoutObjectif (intitule, description, montant, dateEcheance,statut){

    try{
        let objecif = {intitule: intitule, description:description, montant:montant, economie:0, date:Date.now(), dateEcheance:dateEcheance, visibilite:true, statut:statut};
        console.log("yes");
        console.log("oo");
        let newObjObjectif = await IDB.addElement(objecif, OBJECTIF_TB_NAME);
        console.log("iii");
    }catch(e){
        switch(e.name){
             case "InvalidStateError":
                                throw new MyException("Operation echoue.","transactionException");
                                break;
            
                            case "TransactionInactiveError":
                                throw new MyException("Transaction déjà terminée","transactionInactiveException");
                                break;
            
                            case "QuotaExceededError":
                                throw new MyException("Stockage local plein","storageException");
                                break;
            
                            default:
                                throw new MyException("Autre erreur IDB :"+e,"unknownException");
        }
    }
  }

  static async RecuperationObjectif(){
    try{
        let TabObjectif = await IDB.getAllElement (OBJECTIF_TB_NAME);
         console.log("Noo");
        console.log("oerr");
        return TabObjectif;
    }catch(e){
        switch(e.name){
               case "InvalidStateError":
                                throw new MyException("Operation echoue.","transactionException");
                                break;
            
                            case "TransactionInactiveError":
                                throw new MyException("Transaction déjà terminée","transactionInactiveException");
                                break;
            
                            case "QuotaExceededError":
                                throw new MyException("Stockage local plein","storageException");
                                break;
            
                            default:
                                throw new MyException("Autre erreur IDB :"+e,"unknownException");
        }
    }
  }

static async MiseAJour (identifiant, objet){
    try{
        let TabObjectif = await IDB.updateElement(identifiant,objet,OBJECTIF_TB_NAME);
        console.log("rrr");
         console.log("ree");
    }catch(e){
        switch(e.name){
             case "InvalidStateError":
                                throw new MyException("Operation echoue.","transactionException");
                                break;
            
                            case "TransactionInactiveError":
                                throw new MyException("Transaction déjà terminée","transactionInactiveException");
                                break;
            
                            case "QuotaExceededError":
                                throw new MyException("Stockage local plein","storageException");
                                break;
            
                            default:
                                throw new MyException("Autre erreur IDB :"+e,"unknownException");
        }
    }
}

}
