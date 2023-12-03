document.addEventListener("DOMContentLoaded", function () {
    const employeeTableBody = document.getElementById("employeeTableBody");
    const itemsPerPage = 10;
    let currentPage = 1;
    const selectedRows = new Set();
    let employees = []; 
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        .then(response => response.json())
        .then(data => {
            employees = data; 
            displayEmployees(employees, currentPage);
            createPaginationButtons(employees);
        })
        .catch(error => console.error('Error fetching employees:', error));

    function createEmployeeRow(employee) {
        const row = document.createElement("tr");

        const selectCell = document.createElement("td");
        const selectCheckbox = document.createElement("input");
        selectCheckbox.type = "checkbox";
        selectCheckbox.addEventListener("change", function () {
            if (selectCheckbox.checked) {
                selectedRows.add(employee.id);
            } else {
                selectedRows.delete(employee.id);
            }
        });
        selectCell.appendChild(selectCheckbox);

        const nameCell = document.createElement("td");
        nameCell.textContent = employee.name;

        const emailCell = document.createElement("td");
        emailCell.textContent = employee.email;

        const roleCell = document.createElement("td");
        roleCell.textContent = employee.role;

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteRow(employee.id);
        });

        actionCell.appendChild(deleteButton);

        row.appendChild(selectCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(roleCell);
        row.appendChild(actionCell);

        return row;
    }

    function deleteRow(employeeId) {
        console.log(`Deleting employee with ID: ${employeeId}`);
        
        employees = employees.filter(employee => employee.id !== employeeId);

        const row = document.getElementById(`row_${employeeId}`);
        if (row) {
            row.remove();
        }

        selectedRows.delete(employeeId);
    }

    function showEmployeeDetails(employee) {
        alert(`Employee Details:\nName: ${employee.name}\nEmail: ${employee.email}\nRole: ${employee.role}`);
    }

    function deleteSelectedRows() {
        selectedRows.forEach(employeeId => {
            console.log(`Deleting employee with ID: ${employeeId}`);

            employees = employees.filter(employee => employee.id !== employeeId);

            const row = document.getElementById(`row_${employeeId}`);
            if (row) {
                row.remove();
            }
        });

        selectedRows.clear();
    }

    function displayEmployees(employees, page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const employeesToDisplay = employees.slice(startIndex, endIndex);

        employeeTableBody.innerHTML = "";

        employeesToDisplay.forEach(employee => {
            const row = createEmployeeRow(employee);
            row.id = `row_${employee.id}`;
            employeeTableBody.appendChild(row);
        });
    }

    function createPaginationButtons(employees) {
        const totalPages = Math.ceil(employees.length / itemsPerPage);
        const paginationContainer = document.getElementById("pagination");

        const firstButton = document.createElement("button");
        firstButton.textContent = "First";
        firstButton.addEventListener("click", function () {
            currentPage = 1;
            displayEmployees(employees, currentPage);
        });
        paginationContainer.appendChild(firstButton);

        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                displayEmployees(employees, currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.addEventListener("click", function () {
            if (currentPage < totalPages) {
                currentPage++;
                displayEmployees(employees, currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);

        const lastButton = document.createElement("button");
        lastButton.textContent = "Last";
        lastButton.addEventListener("click", function () {
            currentPage = totalPages;
            displayEmployees(employees, currentPage);
        });
        paginationContainer.appendChild(lastButton);

        const deleteSelectedButton = document.createElement("button");
        deleteSelectedButton.textContent = "Delete Selected";
        deleteSelectedButton.addEventListener("click", function () {
            deleteSelectedRows();
        });
        paginationContainer.appendChild(deleteSelectedButton);
    }
});
