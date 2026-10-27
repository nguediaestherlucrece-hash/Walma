

import { IDB } from "../IDB/IDB_consummer";
import { PROFIL_TB_NAME } from "../constantes";
import { MyException } from "../Exception";

export class Profil {
    /**
     * 
     * @param {Object} preference Il s'agit d'un objet contenant la langue et le theme
     * @param {Object} situation cet objet possede les champs suivants: solde,tRevenu(total revenu du mois),tDepense( tota depense du mois),tDette(total des 
     * dettes du mois), tEmprunt(le total des emprunts du mois)
     * @param {Object} statistiques Il s'agit des statistiques generale de l'utilisateur: maxRevenu,maxEconomie,moyRevenu,moyDepense, moyEconomie
     * @param {Object} aboutMe  Ici on retrouvera le reste des informations: catRevenu, catDepense
     */

    constructor(id, owner, preference, statistiques, situation, aboutMe,cache) {
        this.id = id;
        this.owner = owner;
        this.statistiques = statistiques;
        this.preference = preference;
        this.situation = situation;
        this.aboutMe = aboutMe;
        this.cache=cache;
    }

    static fromObject(obj){
          return new Profil(obj.id, obj.owner,obj.preference,obj.statistiques,obj.situation,obj.aboutMe,obj.cache);
    

    }

    static async updateProfil(id,profil){
         try {
                    console.log("on update profil");
                    let result=await IDB.updateElement(id,profil,PROFIL_TB_NAME);
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

    static async create_profil(owner0) {
        try {
            console.log("on creation profil");
            let preference0 = {
                langue: "en",
                theme: "auto"
            };
            let statistiques0 = {
                maxRevenu: 0,
                maxEconomie: 0,
                moyRevenu: 0,
                moyEconomie: 0,
                moyDepense: 0
            };
            let situation0 = {
                solde: 0,
                tRevenu: 0,
                tDepense: 0,
                tEmprunt: 0,
                tDette: 0
            };
            let aboutMe0 = {
                catRevenu: ["Tout"],
                catDepense: [],
                photoProfil:null,
                tel:null,
                sexe:"Homme"

            };
            let cache0={
                idConversation:null,
                date:Intl.DateTimeFormat("fr-FR").format(Date.now()) ,
            }
            let profil={owner:owner0,statistiques:statistiques0,preference:preference0,situation:situation0,aboutMe:aboutMe0,cache:cache0}
            let newObjProfil = await IDB.addElement(profil, PROFIL_TB_NAME);
            let newProfil = this.fromObject(newObjProfil);
            console.log(newProfil)
            console.log(JSON.stringify(newProfil))
            localStorage.setItem("profil", JSON.stringify(newProfil));
            console.log(JSON.parse(localStorage.getItem("profil")))
            console.log("salut")

        } catch (e) {
            switch (e.name) {
                case "ConstraintError":
                    throw new MyException("Un profil existe deja avec ces informations.", "profilAlreadyExistsException");
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
}

// le profil est constitue des statactuelle, des infoPersonnelle, parametres
// ;es infopersonnelle sont constitue des donneeUser(nom,email,id,password),
// les infoPersonnelle(telephone, sexe)
// les stats sont constitue  statActu(solde, total revenu, total depense, total dettes, total des emprunts)
// les stats ont aussi resumeStat( moyenne de revenu, depense moyenne, nombre de transactions en moyenne, les plus hautes stats) 
// pour l'instant les parametres ont juste la frequence
