// Complete Database Records embedded for GitHub Pages
let items = JSON.parse(localStorage.getItem('porto_db')) || [
    { id: 1, owner: "1kahraba8", bld: "12360 وااك", area: "نص تشطيب", view: "اكوا 1", inst_val: "1,700,000", down: "3,036,000", inst_num: 1 },
    { id: 2, owner: "2kahraba3", bld: "22230", area: "نيو", view: "مفروش قبلي", inst_val: "0", down: "0", inst_num: 0 },
    { id: 3, owner: "3kahraba", bld: "ارضي بجاردن", area: "227", view: "60 نيو مفروش قبلي", inst_val: "2,100,000", down: "3,178,000", inst_num: 1 },
    { id: 4, owner: "4kahraba6", bld: "138", area: "60 مشايا ج وديعه", view: "قبلي", inst_val: "1,000,000", down: "2,896,000", inst_num: 1 },
    { id: 5, owner: "5kahraba4", bld: "138", area: "60 مشايا ج وديعه", view: "بحري", inst_val: "1,380,000", down: "2,990,000", inst_num: 1 },
    { id: 6, owner: "6kahraba7", bld: "130", area: "60 VIP وديعه", view: "قبلي جولف", inst_val: "2,200,000", down: "2,550,000", inst_num: 1 },
    { id: 7, owner: "7kahraba6", bld: "ATB اطلنتس", area: "45 كروز وديعه", view: "كروز", inst_val: "749,984", down: "2,343,700", inst_num: 1 },
    { id: 8, owner: "8kahraba9", bld: "228", area: "60 نيو وديعه", view: "قبلي", inst_val: "1,750,000", down: "1,885,000", inst_num: 1 },
    { id: 9, owner: "9kahraba8", bld: "227", area: "60 نيو الترا لوكس مفروش", view: "قبلي", inst_val: "2,350,000", down: "2,350,000", inst_num: 1 },
    { id: 10, owner: "10kahraba", bld: "25", area: "80 مشايا مفروش", view: "قبلي", inst_val: "3,050,000", down: "3,050,000", inst_num: 1 },
    { id: 11, owner: "11kahraba", bld: "71", area: "80 VIP مفروش", view: "بحري الجولف", inst_val: "2,750,000", down: "2,750,000", inst_num: 1 },
    { id: 12, owner: "12zoz7", bld: "31", area: "80 VIP اجهزه كهربيا فقط", view: "فيو الجولف", inst_val: "2,600,000", down: "2,600,000", inst_num: 1 },
    { id: 13, owner: "13kahraba3", bld: "241", area: "60 ريفر استلام السنه الجايه", view: "فيو ريفر", inst_val: "865,000", down: "2,650,000", inst_num: 1 },
    { id: 14, owner: "14geame2", bld: "138", area: "60 مشايا استلام شهر 12", view: "بحري", inst_val: "887,250", down: "2,730,000", inst_num: 1 },
    { id: 15, owner: "15kahraba", bld: "ارضي بجاردن", area: "124", view: "60+27 اكواا استلام اخر السنه قبلي اكواا", inst_val: "1,620,000", down: "3,632,596", inst_num: 1 },
    { id: 16, owner: "16kahraba5", bld: "ATB اطلنتس", area: "45 كروز وديعه", view: "كروز", inst_val: "1,100,000", down: "3,456,920", inst_num: 1 },
    { id: 17, owner: "17kahraba6", bld: "136", area: "60 مشايا وديعه", view: "قبلي", inst_val: "0", down: "0", inst_num: 0 },
    { id: 18, owner: "18Kahraba", bld: "ATB اطلنتس", area: "45 كروز وديعه", view: "كروز", inst_val: "1,100,000", down: "3,456,920", inst_num: 1 },
    { id: 19, owner: "19Kahraba", bld: "227", area: "60 نيو مفروش قبلي", view: "قبلي", inst_val: "2,500,000", down: "2,500,000", inst_num: 1 },
    { id: 20, owner: "20Kahraba", bld: "ارضي بجاردن", area: "19", view: "80 VIP مفروش قبلي", inst_val: "3,500,000", down: "3,500,000", inst_num: 1 }
];

const tableBody = document.getElementById('databaseTableBody');
const searchInput = document.getElementById('searchInput');

// Render Function
function renderTable(filterText = "") {
    tableBody.innerHTML = ""; 

    items.forEach((item, index) => {
        // Search Filter Configuration
        if (filterText && !item.owner.toLowerCase().includes(filterText.toLowerCase()) && !item.bld.toLowerCase().includes(filterText.toLowerCase())) {
            return; 
        }

        // Clean values and run safe calculations (Replaces Jinja2 broken calculations)
        const downPrice = parseFloat(item.down.replace(/,/g, '')) || 0;
        const installmentValue = parseFloat(item.inst_val.replace(/,/g, '')) || 0;
        const installmentNumber = parseFloat(item.inst_num) || 0;

        const totalInstallments = installmentValue * installmentNumber;
        const grandTotal = downPrice + totalInstallments;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color: #2ecc71; font-weight: bold;">${grandTotal === 0 ? '-' : grandTotal.toLocaleString()}</td>
            <td style="color: #e74c3c;">${totalInstallments === 0 ? '-' : totalInstallments.toLocaleString()}</td>
            <td style="color: #3498db;">${downPrice === 0 ? '-' : downPrice.toLocaleString()}</td>
            <td>${item.view}</td>
            <td>${item.area}</td>
            <td>${item.bld}</td>
            <td><strong>${item.owner}</strong></td>
            <td>
                <a href="#" class="edit-btn" onclick="openEditModal(${index})">⚙️</a>
                <a href="#" class="delete-btn" onclick="deleteItem(${index})">🗑️</a>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Global UI interactions
window.deleteItem = function(index) {
    if(confirm("هل أنت متأكد من حذف هذا السجل؟")) {
        items.splice(index, 1);
        localStorage.setItem('porto_db', JSON.stringify(items));
        renderTable(searchInput.value);
    }
};

searchInput.addEventListener('input', (e) => {
    renderTable(e.target.value);
});

// Initial Database Execution
renderTable();
