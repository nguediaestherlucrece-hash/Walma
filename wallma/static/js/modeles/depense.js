import { IDB } from "../IDB/IDB_consummer";
import { DEPENSE_TB_NAME} from "../constantes";
import { MyException } from "../Exception";

export class Depense {

    constructor (id,montant,date,categorie,description,visibilite=true){
        this.id= id;
        this.montant= montant;
        this.date = date;
        this.categorie = categorie;
        this.description= description;
        this.visibilite =  visibilite;
        
        
    }
    static fromObject(obj) {
        return new Depense(obj.id,obj.montant,obj.date,obj.categorie,obj.description,obj.visibilite);
    }
    static async ajout_depense(montant, date, categorie, description, visibilite) {
    
        try {
            let depense = { montant: montant, date: date, categorie: categorie, description: description, visibilite: visibilite };
            console.log("ajout de depense OOOO");
            console.log(depense);
            let newObjDepense = await IDB.addElement(depense, DEPENSE_TB_NAME); //  ajoute l'objet a la  table
            let profil=JSON.parse(localStorage.getItem("profil"));
            profil.situation.tDepense+=montant;
            if(Array.isArray(profil.aboutMe.catDepense)){
                if(!profil.aboutMe.catDepense.includes(categorie)){
                    profil.aboutMe.catDepense.push(categorie);
                };
               

            }
            localStorage.setItem("profil",JSON.stringify(profil));
            console.log("ajout de depense");
            
            

        } catch (e) {
            switch (e.name) {
                
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

    static async recuperation_depenses(){
         try {
                
                let tableau_depenses = await IDB.getAllElement(DEPENSE_TB_NAME); //  ajoute l'objet a la  table
                console.log("recuperation de depenses");
                console.log(tableau_depenses);
                return tableau_depenses;
                
                
        
            } catch (e) {
                switch (e.name) {
                    
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

    static async mise_a_jour_depense(identifiant,object){
        try {
                
                let tableau_depenses = await IDB.updateElement(identifiant,object,DEPENSE_TB_NAME); // met a jour dans la bd
                console.log("mise a jour de depense");
                console.log(tableau_depenses);
                
                
        
            } catch (e) {
                switch (e.name) {
                    
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

    static async suppression_depense(identifiant) {
        try {
            await IDB.deleteElement(identifiant, DEPENSE_TB_NAME);
            console.log("suppression de dépense");
        } catch (e) {
            switch (e.name) {
                case "InvalidStateError":
                    throw new MyException("Opération échouée.", "transactionException");
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

     static async recupTotalDepense4(identifiant, object) {
            try {
                let tableau_depense = IDB.getAllElement(DEPENSE_TB_NAME);
                //let tableau_revenu = await IDB.updateElement(identifiant,object,REVENU_TB_NAME); // met a jour dans la bd
                let tab_depense_4 = [];
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
                    for (let j in tableau_depense){
                         moisTab = new Date(tableau_depense[i].date);
                         if(moisTab.getMonth()==moisPrecedent){
                            total += tableau_depense[i].montant;
                         }
    
                    }
                    tab_depense_4.push(total);
    
                }
                return tab_depense_4;// tableau du total des revenu pour les 4 dernier mois 0 l'indixe 0 pour le mois ou nous somme
    
    
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