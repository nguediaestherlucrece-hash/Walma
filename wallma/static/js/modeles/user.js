
import { IDB } from "../IDB/IDB_consummer";
import { USER_TB_NAME } from "../constantes";
import { MyException } from "../Exception";
import { Profil } from "./profil";

export class User {

    constructor(nom, id, photoProfil = null) {
        this.nom = nom;
        this.photoProfil = photoProfil;


        this.id = id;
    }

    static fromObject(obj) {
        return new User(obj.nom, obj.id, obj.photoProfil);
    }

    static async creer_compte(nom, email, password) {

        try {
            console.log("on creation user");
            let user = { nom: nom, email: email, password: password, photoProfil: null };
            let newObjUser = await IDB.addElement(user, USER_TB_NAME);
            let newUser = this.fromObject(newObjUser);
            await Profil.create_profil(newUser.id);

        } catch (e) {
            switch (e.name) {
                case "ConstraintError":
                    throw new MyException("Un utilisateur existe deja avec ces informations.", "userAlreadyExistsException");
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
                    throw new MyException("Autre erreur IDB :" + e, "unknownException");
            }
        }

    }

    static supprimer_compte_courant() {

    }

    static async se_connecter(email, mots_de_passe) {

        try {
            console.log("on login");
            let info = { email: email, password: mots_de_passe };
            let listUser = await IDB.getElement(info, USER_TB_NAME, ["nom", "id"]);
            if (listUser.length !== 0) {
                var user = Array.from(listUser)[0];
                localStorage.setItem("currentUser", JSON.stringify(user));
            } else {
                console.log("invalide");
                throw new MyException("L'adresse email ou le mot de passe est invalide", "userNotFoundException");
            }

        } catch (e) {
            switch (e.name) {
                case "userNotFoundException":
                    throw e;
                    break;
                default:
                    throw new MyException("other error" + e.message, "otherEXception");
                    break;
            }


        }

    }
    static async updatePhotoProfil(key,file){
        try {
            console.log("on update photo");
            let result=await IDB.updateElement(key,{photoProfil:file},USER_TB_NAME);
            console.log("mise a jour reussie.");
        } catch (e) {
            switch (e.name) {
                case "userNotFoundException":
                    throw e;
                    break;
                default:
                    throw new MyException("other error" + e.message, "otherEXception");
                    break;
            }
        }
    }

    static async getPhotoProfil(id){
         try {
            console.log("on upload photo");
            let result=await IDB.getElement({id:id},USER_TB_NAME,["photoProfil"]);
            console.log("Recuperation reussie.");
            return result[0].photoProfil;
            
        } catch (e) {
            switch (e.name) {
                case "userNotFoundException":
                    throw e;
                    break;
                default:
                    throw new MyException("other error" + e.message, "otherEXception");
                    break;
            }
        }
    }

     static async getUser(id){
         try {
            console.log("on upload user");
            let result=await IDB.getElement({id:id},USER_TB_NAME);
            console.log("Recuperation reussie.");
            return result[0];
            
        } catch (e) {
            switch (e.name) {
                case "userNotFoundException":
                    throw e;
                    break;
                default:
                    throw new MyException("other error" + e.message, "otherEXception");
                    break;
            }
        }
    }

    static async updateUser(id,nouvelle){
         try {
            console.log("on update user");
            let result=await IDB.updateElement(id,nouvelle,USER_TB_NAME);
            console.log("update reussie.");
        } catch (e) {
            switch (e.name) {
                case "userNotFoundException":
                    throw e;
                    break;
                default:
                    throw new MyException("other error" + e.message, "otherEXception");
                    break;
            }
        }
    }
}