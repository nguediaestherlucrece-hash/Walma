// Script de test simple pour les modals
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de test chargé');
    
    // Vérifier que Bootstrap est disponible
    console.log('Bootstrap disponible:', typeof bootstrap !== 'undefined');
    
    // Vérifier que les modals existent
    const addModal = document.getElementById('addModal');
    const editModal = document.getElementById('editModal');
    
    console.log('Modal ajout trouvé:', !!addModal);
    console.log('Modal modification trouvé:', !!editModal);
    
    // Test d'ouverture du modal de modification
    if (editModal) {
        // Écouter l'événement d'ouverture du modal
        editModal.addEventListener('show.bs.modal', function(event) {
            console.log('Modal de modification en cours d\'ouverture');
            
            // Trouver le bouton qui a déclenché l'ouverture
            const button = event.relatedTarget;
            if (button) {
                const expenseItem = button.closest('.expense-item');
                
                if (expenseItem) {
                    // Récupérer les données
                    const montant = expenseItem.getAttribute('data-montant');
                    const date = expenseItem.getAttribute('data-date');
                    const category = expenseItem.getAttribute('data-category');
                    const description = expenseItem.getAttribute('data-description');

                    console.log('Données récupérées:', { montant, date, category, description });

                    // Remplir le formulaire
                    const editMontant = document.getElementById('editMontant');
                    const editDate = document.getElementById('editDate');
                    const editCategory = document.getElementById('editCategory');
                    const editDescription = document.getElementById('editDescription');

                    if (editMontant) editMontant.value = montant || '';
                    if (editDate) editDate.value = date || '';
                    if (editCategory) editCategory.value = category || 'Achat';
                    if (editDescription) editDescription.value = description || '';

                    console.log('Formulaire rempli');
                } else {
                    console.log('Aucun élément expense-item trouvé');
                }
            } else {
                console.log('Aucun bouton déclencheur trouvé');
            }
        });
        
        console.log('Événement show.bs.modal ajouté au modal de modification');
    }
    
    // Gestion de la suppression
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-delete') || e.target.closest('.btn-delete')) {
            e.preventDefault();
            const expenseItem = e.target.closest('.expense-item');
            
            if (expenseItem && confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
                expenseItem.remove();
                console.log('Dépense supprimée');
            }
        }
    });
    
    console.log('Script de test initialisé avec succès');
});