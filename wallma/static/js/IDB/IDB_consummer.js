import { event } from "jquery";
import { initDB} from "/static/js/IDB/IDB_initializer";
import { Depense } from "../modeles/depense";


export class IDB {

    
    /**
     * Cette methode permet d'ajouter un element a la base de donnees Indexed database
     * 
     * @param {Object} element represente l'objet a ajouter dans IDB , il ne doit pas comporter le champ id
     * @param {String} tbName represente le nom de la table dans laquelle ajouter l'objet dans IDB
     * @returns {Promise<Object>} representant la meme instance du parametre d'entree (element) au quel on ajoute le champ id
     * @throws {Error} Erreur sur IDB, consulter la liste des erreurs possible 
     */
    static addElement(element, tbName) {
       
        return new Promise(async (resolve, reject) => {
            try {
                let db= await initDB();
                 if (!db) {
                    reject(new Error("DB non initialisée"));
                return;
            }
                const transaction = db.transaction(tbName, "readwrite");
                if (!transaction) return reject(new Error(`Transaction non disponible pour ${tbName}`));

                const store = transaction.objectStore(tbName);
                const request = store.add(element);

                request.onsuccess = function (event) {
                    if (event?.target?.result === undefined) {
                        reject(new Error("IDB: échec de récupération de l'ID"));
                        return;
                    }
                    element.id = event.target.result;
                    resolve(element);
                };

                request.onerror = function (event) {
                    reject(event?.target?.error || new Error("Erreur inconnue dans addElement"));
                };
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Cette fonction permet de recuperer tous les elements dans IDB respectant certains criteres
     * @param {Object} critere represente les criteres de recherche de l'element, ils doivent etre conforme au modele de stockage dans IDB
     * @param {String} tbName  represente le nom de la table dans laquelle ajouter l'objet dans IDB
     * @param {Array} champ represente les champs que vous souhaitez recuperer dans la table, ils doivent etre conforme au modele de stockage dans IDB. par default, on retourne tout l'objet
     * @returns {Promise<Array<Object>> } representant la liste de tous les elements respectant vos criteres mais uniquement les champs que vous avez demande
     * si aucune correspondance n'a ete trouve
     * @throws {Error} Erreur sur IDB, consulter la liste des erreurs possible 
     */
    static  getElement(critere, tbName, champ = null) {
        
        return new Promise(async (resolve, reject) => {
            try {
                let db= await initDB();
                if (!db) {
                    reject(new Error("DB non initialisée"));
                return;
            }
                const transaction = db.transaction(tbName, "readonly");
                if (!transaction) return reject(new Error(`Transaction non disponible pour ${tbName}`));

                const store = transaction.objectStore(tbName);
                const request = store.openCursor();
                let result = [];

                request.onsuccess = function (event) {
                    const cursor = event?.target?.result;
                    if (cursor) {
                        const elt = cursor.value;
                        if (!elt) {
                            cursor.continue();
                            return;
                        }
                        let find = true;
                        for (let property of Object.getOwnPropertyNames(critere)) {
                            if (elt[property] !== critere[property]) {
                                find = false;
                                break;
                            }
                        }
                        if (find) {
                            if (champ) {
                                const retour = {};
                                for (let property of champ) {
                                    retour[property] = elt[property];
                                }
                                result.push(retour);
                            } else {
                                result.push(elt);
                            }
                        }
                        cursor.continue();
                    } else {
                        resolve(result);
                    }
                };

                request.onerror = function (event) {
                    reject(event?.target?.error || new Error("Erreur inconnue dans getElement"));
                };
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Cette fonction supprime tous les elements verifiant une certaine condition dans une table de la base de donnees
     * @param {*} critere represente les criteres de recherche de l'element a supprimer, ils doivent etre conforme au modele de stockage dans IDB
     * @param {*} tbName represente le nom de la table dans laquelle ajouter l'objet dans IDB
     * @returns {Promise<Boolean>}  retourne vrai si tous les elements avec les criteres fourni ont ete supprime d'IDB
     * @throws {Error} Erreur sur IDB, consulter la liste des erreurs possible 
     */
    static  deleteElement(critere, tbName) {
         
        return new Promise(async (resolve, reject) => {
            try {
                let db= await initDB();
                if (!db) {
                    reject(new Error("DB non initialisée"));
                return;
            }
                const transaction = db.transaction(tbName, "readwrite");
                if (!transaction) return reject(new Error(`Transaction non disponible pour ${tbName}`));

                const store = transaction.objectStore(tbName);
                const request = store.openCursor();

                request.onsuccess = function (event) {
                    const cursor = event?.target?.result;
                    if (cursor) {
                        const elt = cursor.value;
                        if (!elt) {
                            cursor.continue();
                            return;
                        }
                        let find = true;
                        for (let property of Object.getOwnPropertyNames(critere)) {
                            if (elt[property] !== critere[property]) {
                                find = false;
                                break;
                            }
                        }
                        if (find && elt.id !== undefined) {
                            store.delete(elt.id);
                        }
                        cursor.continue();
                    } else {
                        resolve(true);
                    }
                };

                request.onerror = function (event) {
                    reject(event?.target?.error || new Error("Erreur inconnue dans deleteElement"));
                };
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Cette methode permet de mettre a jour un element dans IDB
     * @param {Number} key  represente l'identifiant de l'element a mettre a jour
     * @param {Object} newValue  un object dont les cles sont les champs a mettre a jour et les valeurs les nouvelles informations
     * @param {String} tbName represente le nom de la table dans laquelle ajouter l'objet dans IDB
     * @returns {Promise<Boolean>} retourne vrai si l'operation s'est effectue sans probleme
     * @throws {Error} Erreur sur IDB, consulter la liste des erreurs possible 
     */
    static  updateElement(key, newValue, tbName) {
         
        return new Promise(async (resolve, reject) => {
            try {
                let db= await initDB();
                if (!db) {
                    reject(new Error("DB non initialisée"));
                return;
            }
                const transaction = db.transaction(tbName, "readwrite");
                if (!transaction) return reject(new Error(`Transaction non disponible pour ${tbName}`));

                const store = transaction.objectStore(tbName);
                const request = store.get(key);

                request.onsuccess = function (event) {
                    const elt = event?.target?.result;
                    if (!elt) {
                        reject(new Error(`Element avec key=${key} introuvable`));
                        return;
                    }
                    for (let champ of Object.getOwnPropertyNames(newValue)) {
                        elt[champ] = newValue[champ];
                    }
                    const req = store.put(elt);
                    req.onsuccess = function () {
                        resolve(true);
                    };
                    req.onerror = function (event) {
                        reject(event?.target?.error || new Error("Erreur inconnue dans updateElement"));
                    };
                };

                request.onerror = function (event) {
                    reject(event?.target?.error || new Error("Erreur inconnue dans updateElement get"));
                };
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Cette methode permet de recuperer tous les elements d'une table de la base de donnees.
     * @param {String} tbName represente le nom de la table dans laquelle ajouter l'objet dans IDB.
     * @returns {Error} Erreur sur IDB, consulter la liste des erreurs possible.
     */
    static getAllElement(tbName) {
        
        return new Promise(async (resolve, reject) => {
            try {
                let db= await initDB();
                if (!db) {
                    reject(new Error("DB non initialisée"));
                return;
            }
                const transaction = db.transaction(tbName, "readonly");
                if (!transaction) return reject(new Error(`Transaction non disponible pour ${tbName}`));

                const store = transaction.objectStore(tbName);
                const request = store.getAll();

                request.onsuccess = function (event) {
                    const all = event?.target?.result || [];
                    resolve(all);
                };

                request.onerror = function (event) {
                    reject(event?.target?.error || new Error("Erreur inconnue dans getAllElement"));
                };
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Cette methode permet de recuperer des elements dans une table a partir de l'indexe de fin
     * @param {Number} nbreElement Il s'agit du nombre d'element que vous souhaitez recuperer a partir du dernier indice de votre table
     * @param {*} tbName Represente le nom de la table dans laquelle vous souhaitez recuperer les derniers elements
     * @returns {List<Object>} Represente la liste de tous les elements que vous recuperer, elle peut etre vide.
     * @returns {Error} Erreur sur IDB, consulter la liste des erreurs possible.
     */
    static  getLastElements(nbreElement, tbName) {
      
        return new Promise(async (resolve, reject) => {
            try {
                let db= await initDB();
                if (!db) {
                    reject(new Error("DB non initialisée"));
                return;
            }
                const transaction = db.transaction(tbName, "readonly");
                if (!transaction) return reject(new Error(`Transaction non disponible pour ${tbName}`));

                const store = transaction.objectStore(tbName);
                const request = store.openCursor(null, "prev");
                let result = [];
                let i = nbreElement;

                request.onsuccess = function (event) {
                    const cursor = event?.target?.result;
                    if (cursor && i > 0) {
                        const elt = cursor.value;
                        if (elt) {
                            console.log("bd");
                            console.log(elt);
                            result.push(elt);
                            i--;
                        }
                        cursor.continue();
                    } else {
                        resolve(result);
                    }
                };

                request.onerror = function (event) {
                    reject(event?.target?.error || new Error("Erreur inconnue dans getLastElements"));
                };
            } catch (e) {
                reject(e);
            }
        });
    }
    static async recupDepenseParMois(){
        let newtab=[];
        const moisCourant = new Date().getMonth();
        let tableauDepense = await Depense.recuperation_depenses();
        for(let i in tableauDepense){
            let dateObjet = new Date(tableauDepense[i].date);
            if(dateObjet.getMonth()==moisCourant){
                newtab.push(tableauDepense[i]);
                
            }
        }
        console.log("recuppppppppppp" );
        console.log(newtab);
        return newtab;
    }
    
}


