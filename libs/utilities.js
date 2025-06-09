function jsonToTable(jsonData, options = {}) {
    const { generateHeaders = true, firstRowHeader = false, headerGroups = null } = options;

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    if (headerGroups) {
        const groupRow = document.createElement('tr');
        headerGroups.forEach(group => {
            const th = document.createElement('th');
            th.colSpan = group.span;
            th.textContent = group.label;
            groupRow.appendChild(th);
        });
        thead.appendChild(groupRow);
    }

    if (generateHeaders && jsonData.length > 0) {
        const headers = firstRowHeader ? jsonData[0] : Object.keys(jsonData[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = firstRowHeader ? header : header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
    }

    jsonData.forEach((rowData, index) => {
        if (firstRowHeader && index === 0) return;

        const row = document.createElement('tr');
        Object.values(rowData).forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

module.exports = jsonToTable;