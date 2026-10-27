import { BILAN_TB_NAME, CONVERSATION_TB_NAME, DATA_BASE_VERSION, DATABASE_NAME, DEPENSE_TB_NAME, MESSAGE_TB_NAME, NOTIFICATION_TB_NAME, OBJECTIF_TB_NAME, OBLIGATION_TB_NAME, PROFIL_TB_NAME, REVENU_TB_NAME, USER_TB_NAME } from "../constantes";


let db=null;
console.log("IDB initializer exécuté");

// db.js

export const initDB = () => {
  // Si la base est déjà ouverte, on la retourne immédiatement
  if (db) return Promise.resolve(db);

  return new Promise((resolve, reject) => {
     const request = indexedDB.open(DATABASE_NAME, DATA_BASE_VERSION);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        console.log("Mise à niveau de la base…");
        const userStore = db.createObjectStore(USER_TB_NAME, { keyPath: "id", autoIncrement: true });
        userStore.createIndex("email", "email", { unique: true });
        const depenseStore = db.createObjectStore(DEPENSE_TB_NAME, { keyPath: "id", autoIncrement: true });
        const objectifStore = db.createObjectStore(OBJECTIF_TB_NAME, { keyPath: "id", autoIncrement: true });
        const obligationStore = db.createObjectStore(OBLIGATION_TB_NAME, { keyPath: "id", autoIncrement: true });
        const notificationStore = db.createObjectStore(NOTIFICATION_TB_NAME, { keyPath: "id", autoIncrement: true });
        const messageStore = db.createObjectStore(MESSAGE_TB_NAME, { keyPath: "id", autoIncrement: true });
        const revenuStore = db.createObjectStore(REVENU_TB_NAME, { keyPath: "id", autoIncrement: true });
        const profiStore = db.createObjectStore(PROFIL_TB_NAME, { keyPath: "id", autoIncrement: true });
        const bilanStore = db.createObjectStore(BILAN_TB_NAME, { keyPath: "id", autoIncrement: true });
        const conversationStore = db.createObjectStore(CONVERSATION_TB_NAME, { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
      console.log("Base prête !");
    };

    request.onerror = function (event) {
        console.error("Erreur d'ouverture :", event.target.error);
    };
  });
};

// Promise that resolves when the database is ready
export const dbReady = new Promise((resolve, reject) => {
    if (db) return resolve(db);
    request.addEventListener('success', function (e) {
        db = e.target.result;
        resolve(db);
    });
    request.addEventListener('error', function (e) {
        reject(e.target.error);
    });
});



























