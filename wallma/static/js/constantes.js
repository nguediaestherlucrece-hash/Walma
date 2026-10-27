


//Information application
export const app_name="Wallma";


export const DATA_BASE_VERSION=1;
export const DATABASE_NAME="wallma_db";
// Nom des tables dans la base de donnee
export const USER_TB_NAME="user";
export const REVENU_TB_NAME="revenu";
export const DEPENSE_TB_NAME="depense";
export const OBLIGATION_TB_NAME="obligation";
export const OBJECTIF_TB_NAME="objectif";
export const MESSAGE_TB_NAME="message";
export const PROFIL_TB_NAME="profil";
export const NOTIFICATION_TB_NAME="notification";
export const BILAN_TB_NAME="bilan";
export const CONVERSATION_TB_NAME="conversation";



export const SYSTEM_ROLE_CONSEIL_JOURNALIER={
    role:"system",
    content:`Vous êtes DeepSeek, un assistant financier personnel.
        Votre réponse DOIT respecter STRICTEMENT les règles suivantes, sans aucune exception :
        - Produire exactement une seule phrase
        - Aucun retour à la ligne, aucune phrase multiple, aucune ponctuation séparatrice
        - La phrase doit contenir AU MAXIMUM 40 mots et au MINIMUM 25 mots
        - Si la phrase dépasse 40 mots ou possede moins de 25 mots, elle est considérée comme incorrecte et doit être reformulée
        - Les emojis sont autorisés
        - Aucun titre, aucune liste, aucun tiret, aucun format spécial
        La phrase doit donner un conseil financier concret, applicable immédiatement, basé sur les dépenses ou habitudes de l’utilisateur.
    `
}

export const SYSTEM_ROLE_APPRECIATION_DEPENSE={
    role:"system",
    content:`Vous êtes un assistant financier spécialisé dans l’analyse des dépenses.
        Pour chaque catégorie :
        - Si les dépenses dépassent la moyenne historique, générez entre 1 et 5 recommandations concrètes pour réduire la dépense.
        - Si les dépenses sont maîtrisées, générez 1 appréciation positive.
        - Chaque recommandation ou appréciation doit être **une seule phrase**, concise (max 20 mots), avec un emoji.
        - La sortie doit être un objet JSON strictement formaté :
        {
            "categorie": "Alimentation",
            "montantDepasse": 15000,        // 0 si pas d'excès
            "recommandations": [
            "Réduisez les sorties repas cette semaine 🍽️",
            "Préparez vos repas maison 3 fois 🍳"
            ],
            "appreciation": "Super ! Vos dépenses sont sous contrôle 🎉"
        }`
}








export const DEEPSEEK_BASE_URL="https://api.deepseek.com";
//A ne jamais modifier.
export const DEEPSEEK_MODEL="deepseek-chat";

