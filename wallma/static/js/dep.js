import './IDB/IDB_initializer.js';
import { Depense } from './modeles/depense.js';
import { IDB } from './IDB/IDB_consummer.js';
import { DEPENSE_TB_NAME } from './constantes.js';

const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
        if (chart.config.type === 'doughnut') {
            const { ctx, chartArea } = chart;

            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            ctx.save();

            ctx.font = "20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const text = "20000";
            ctx.fillText(text, centerX, centerY);

            ctx.restore();
        }
    }
};

Chart.register(centerTextPlugin);

let depenses = [];
let editingId = null;

async function loadDepenses() {
    try {
        depenses = await IDB.getAllElement(DEPENSE_TB_NAME);
        displayDepenses();
        updateCharts();
    } catch (e) {
        console.error(e);
    }
}

function displayDepenses() {
    const container = document.querySelector('.list-expenses');
    container.innerHTML = '';
    depenses.forEach(dep => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between border-bottom py-3 expense-item';
        div.setAttribute('data-id', dep.id);
        div.setAttribute('data-category', dep.classe);
        div.setAttribute('data-montant', dep.montant);
        div.setAttribute('data-date', dep.date_realisation);
        div.setAttribute('data-desc', dep.description || '');
        div.innerHTML = `
            <div>
                <strong>${dep.montant} FCFA</strong><br>
                <small class="text-muted">dépensé le ${new Date(dep.date_realisation).toLocaleDateString('fr-FR')}</small>
            </div>
            <div class="text-end">
                <div>${dep.classe}</div>
                <button class="btn btn-sm btn-link text-primary p-0 mt-1 btn-view">Modifier</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateCharts() {
    // Pour l'instant, garder hardcodé
}

function initLineChart() {
    const el = document.getElementById('expenseChart');
    if (!el) {
        console.warn('Canvas `expenseChart` introuvable.');
        return;
    }
    const ctx = el.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'novembre', 'décembre'],
            datasets: [{
                data: [26000, 18000, 14000, 13000, 12000, 11000, 10000, 9500, 9000, 8500, 8300, 8000],
                borderWidth: 3,
                tension: .4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: false } }
        }
    });
}

function initDonutChart() {
    const el = document.getElementById('donutChart');
    if (!el) {
        console.warn('Canvas `donutChart` introuvable.');
        return;
    }
    const ctx = el.getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['factures', 'achats', 'autres'],
            datasets: [{
                data: [40, 40, 20],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { position: 'right' } }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js non chargé — vérifiez l\'inclusion de la librairie Chart.js.');
        return;
    }

    await loadDepenses();

    initLineChart();
    initDonutChart();

    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));

    document.getElementById('searchInput').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll('.expense-item');

        rows.forEach(row => {
            const montant = row.querySelector('strong').textContent.toLowerCase();
            const type = row.querySelector('.text-end div:first-child').textContent.toLowerCase();
            const desc = row.getAttribute('data-desc') ? row.getAttribute('data-desc').toLowerCase() : '';

            const matches = montant.includes(searchTerm) ||
                            type.includes(searchTerm) ||
                            desc.includes(searchTerm);

            row.style.display = matches ? '' : 'none';
        });
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-view')) {
            const row = e.target.closest('.expense-item');
            editingId = row.getAttribute('data-id');
            const dep = depenses.find(d => d.id == editingId);
            if (dep) {
                document.getElementById('editCategory').value = dep.classe;
                document.getElementById('editMontant').value = dep.montant;
                document.getElementById('editDate').value = new Date(dep.date_realisation).toISOString().split('T')[0];
                document.getElementById('editDescription').value = dep.description || '';
                editModal.show();
            }
        }
    });

    document.getElementById('submitAdd').addEventListener('click', async () => {
        const category = document.getElementById('addCategory').value;
        const montant = parseFloat(document.getElementById('addMontant').value);
        const date = document.getElementById('addDate').value;
        const desc = document.getElementById('addDescription').value;

        if (!category || isNaN(montant) || !date) {
            alert('Veuillez remplir tous les champs correctement.');
            return;
        }

        const dep = new Depense(Date.now().toString(), montant, new Date(date), desc, category);
        try {
            await IDB.addElement(dep.toObject(), DEPENSE_TB_NAME);
            addModal.hide();
            document.getElementById('addCategory').value = '';
            document.getElementById('addMontant').value = '';
            document.getElementById('addDate').value = '';
            document.getElementById('addDescription').value = '';
            await loadDepenses();
        } catch (e) {
            console.error(e);
            alert('Erreur lors de l\'ajout.');
        }
    });

    document.getElementById('saveEdit').addEventListener('click', async () => {
        const category = document.getElementById('editCategory').value;
        const montant = parseFloat(document.getElementById('editMontant').value);
        const date = document.getElementById('editDate').value;
        const desc = document.getElementById('editDescription').value;

        if (!category || isNaN(montant) || !date) {
            alert('Veuillez remplir tous les champs correctement.');
            return;
        }

        const updateObj = {
            classe: category,
            montant: montant,
            date_realisation: new Date(date).toISOString(),
            description: desc
        };

        try {
            await IDB.updateElement(parseInt(editingId), updateObj, DEPENSE_TB_NAME);
            editModal.hide();
            await loadDepenses();
        } catch (e) {
            console.error(e);
            alert('Erreur lors de la modification.');
        }
    });
});