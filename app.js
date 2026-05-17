// 1. Mock Data / Local Storage Mock Database
let items = JSON.parse(localStorage.getItem('porto_db')) || [
    { owner: "أحمد محمد عبد الله", bld: "مبنى A1", area: "120 م²", down: "50,000", inst_val: "15,000", inst_num: 10 }
];

const tableBody = document.getElementById('databaseTableBody');
const searchInput = document.getElementById('searchInput');

// 2. Function to calculate values and render rows
function renderTable(filterText = "") {
    tableBody.innerHTML = ""; // Clear existing rows

    items.forEach((item, index) => {
        // Filter logic for search bar
        if (filterText && !item.owner.includes(filterText) && !item.bld.includes(filterText)) {
            return; 
        }

        // Clean values and run calculations (replaces your Jinja2 math blocks)
        const downPrice = parseFloat(item.down.replace(/,/g, '')) || 0;
        const installmentValue = parseFloat(item.inst_val.replace(/,/g, '')) || 0;
        const installmentNumber = parseFloat(item.inst_num) || 0;

        const totalInstallments = installmentValue * installmentNumber;
        const grandTotal = downPrice + totalInstallments;

        // Build HTML table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color: #2ecc71; font-weight: bold;">${grandTotal.toLocaleString()}</td>
            <td style="color: #e74c3c;">${totalInstallments.toLocaleString()}</td>
            <td style="color: #3498db;">${downPrice.toLocaleString()}</td>
            <td>${item.area}</td>
            <td>${item.bld}</td>
            <td><strong>${item.owner}</strong></td>
            <td>
                <button onclick="deleteItem(${index})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 3. Delete functionality
window.deleteItem = function(index) {
    items.splice(index, 1);
    localStorage.setItem('porto_db', JSON.stringify(items));
    renderTable(searchInput.value);
};

// 4. Search Filter Event Listener
searchInput.addEventListener('input', (e) => {
    renderTable(e.target.value);
});

// Initial load of the data
renderTable();
