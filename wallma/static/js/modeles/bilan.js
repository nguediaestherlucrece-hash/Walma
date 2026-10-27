
import { IDB } from "../IDB/IDB_consummer";
import { BILAN_TB_NAME } from "../constantes";
import { MyException } from "../Exception";
import { Profil } from "./profil";

export class Bilan {

    constructor(dateDebut, dateFin, totalRevenu, totalDepense, totalEpargne, idUser, id) {
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.totalRevenu = totalRevenu;
        this.totalDepense = totalDepense;
        this.totalEpargne = totalEpargne;
        this.idUser = idUser;
        this.id = id;
    }

    static fromObject(obj) {
        return new Bilan(obj.dateDebut, obj.dateFin, obj.totalRevenu, obj.totalDepense, obj.totalEpargne, obj.idUser, obj.id);
    }

    static async creer_bilan(dateDebut, dateFin, totalRevenu, totalDepense, totalEpargne, idUser) {

        try {
            console.log("on creation bilan");
            let bilan = { dateDebut: dateDebut, dateFin: dateFin, totalRevenu: totalRevenu, totalDepense: totalDepense, totalEpargne: totalEpargne, idUser: idUser };
            let newObjBilan = await IDB.addElement(bilan, BILAN_TB_NAME);
            console.log("on creation bilan");
            let newBilan = this.fromObject(newObjBilan);

        } catch (e) {
            switch (e.name) {
                case "ConstraintError":
                    throw new MyException("Ce bilan existe deja", "userAlreadyExistsException");
                    break;
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
                    console.log(e);
                    throw new MyException("Autre erreur IDB :", "unknownException");

                    break;
            }
        }

    }



    static async get_latest_bilan(nbre_bilan) {

        try {
            console.log("on  getBilan");
            let result = await IDB.getLastElements(nbre_bilan, BILAN_TB_NAME);
            console.log("get bilan ok")
            return result;
        } catch (e) {
            console.log(e);
            switch (e.name) {

                default:
                    throw new MyException("other error" + e.message, "otherEXception");
                    break;
            }


        }

    }

}