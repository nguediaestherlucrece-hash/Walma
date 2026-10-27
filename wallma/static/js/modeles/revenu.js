import { IDB } from "../IDB/IDB_consummer";
import { OBLIGATION_TB_NAME, REVENU_TB_NAME } from "../constantes";
import { MyException } from "../Exception";
export class Revenu {

    constructor(id, montant, date, emplacement, cathegorie, description, visibilite = true) {
        this.id = id;
        this.montant = montant;
        this.date = date;
        this.emplacement = emplacement;
        this.cathegorie = cathegorie;
        this.description = description;
        this.visibilite = visibilite;

    }
    static fromObject(obj) {
        return new Revenu(obj.id, obj.montant, obj.date, obj.emplacement, obj.cathegorie, obj.description, obj.visibilite);
    }
    static async ajout_revenu(montant, date, emplacement, cathegorie, description, visibilite) {

        try {

            let revenu = { montant: montant, date: date, emplacement: emplacement, cathegorie: cathegorie, description: description, visibilite: visibilite };
            let newObjRevenu = await IDB.addElement(revenu, REVENU_TB_NAME); //  ajoute l'objet a la  table
            //let newRevenu = this.fromObject(newObjRevenu);


        } catch (e) {
            switch (e.name) {
                // case "ConstraintError":
                //     throw new MyException("Un utilisateur existe deja avec ces informations.", "userAlreadyExistsException");
                //     break;
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
    static async recuperation_revenu() {
        try {

            let tableau_revenu = IDB.getAllElement(REVENU_TB_NAME); //  ajoute l'objet a la  table
            console.log("recuperation de revenu");
            console.log(tableau_revenu);
            return tableau_revenu;
            //let newRevenu = this.fromObject(newObjRevenu);


        } catch (e) {
            switch (e.name) {
                // case "ConstraintError":
                //     throw new MyException("Un utilisateur existe deja avec ces informations.", "userAlreadyExistsException");
                //     break;
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

    static async mise_a_jour_revenu(identifiant, object) {
        try {

            let tableau_revenu = await IDB.updateElement(identifiant, object, REVENU_TB_NAME); // met a jour dans la bd
            console.log("mise a jour de revenu");
            console.log(tableau_revenu);
            //let newRevenu = this.fromObject(newObjRevenu);


        } catch (e) {
            switch (e.name) {
                // case "ConstraintError":
                //     throw new MyException("Un utilisateur existe deja avec ces informations.", "userAlreadyExistsException");
                //     break;
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

    static async recupTotalRevenu4(identifiant, object) {
        try {
            let tableau_revenu = IDB.getAllElement(REVENU_TB_NAME);
            //let tableau_revenu = await IDB.updateElement(identifiant,object,REVENU_TB_NAME); // met a jour dans la bd
            let tab_revenu_4 = [];
            let total;
            let moisCourant;
            let moisTab;
            for (let i = 0; i < 3; i++) { // pour les 4 dernier mois
                moisCourant = new Date();
                // 2. Diminuer d'un mois
                moisCourant.setMonth(moisCourant.getMonth() - i);
                // 3. Récupérer le nouvel index du mois
                const moisPrecedent = date.getMonth();
                total=0;
                for (let j in tableau_revenu){
                     moisTab = new Date(tableau_revenu[i].date);
                     if(moisTab.getMonth()==moisPrecedent){
                        total += tableau_revenu[i].montant;
                     }

                }
                tab_revenu_4.push(total);

            }
            return tab_revenu_4;// tableau du total des revenu pour les 4 dernier mois 0 l'indixe 0 pour le mois ou nous somme


        } catch (e) {
            switch (e.name) {
                // case "ConstraintError":
                //     throw new MyException("Un utilisateur existe deja avec ces informations.", "userAlreadyExistsException");
                //     break;
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