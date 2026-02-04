const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");

let expenses = [];

const THRESHOLD = 1000;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value;

    if (amount <= 0 || date === "") {
        alert("Enter valid amount and date!");
        return;
    }

    const expense = {
        amount,
        category,
        date,
        note
    };

    expenses.push(expense);

    displayExpenses();
    updateSummary();

    form.reset();
});

function displayExpenses() {

    list.innerHTML = "";

    expenses.map((exp, index) => {

        const row = document.createElement("tr");

        if (exp.amount > THRESHOLD) {
            row.classList.add("large-expense");
        }

        row.innerHTML = `
            <td>${exp.amount}</td>
            <td>${exp.category}</td>
            <td>${exp.date}</td>
            <td>${exp.note}</td>
            <td><button onclick="deleteExpense(${index})">X</button></td>
        `;

        list.appendChild(row);
    });
}

function deleteExpense(i) {

    expenses = expenses.filter((_, index) => index !== i);

    displayExpenses();
    updateSummary();
}

function updateSummary() {

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    document.getElementById("total").innerText = total;

    const food = expenses
        .filter(e => e.category === "Food")
        .reduce((s, e) => s + e.amount, 0);

    const travel = expenses
        .filter(e => e.category === "Travel")
        .reduce((s, e) => s + e.amount, 0);

    const bills = expenses
        .filter(e => e.category === "Bills")
        .reduce((s, e) => s + e.amount, 0);

    const others = expenses
        .filter(e => e.category === "Others")
        .reduce((s, e) => s + e.amount, 0);

    document.getElementById("foodTotal").innerText = food;
    document.getElementById("travelTotal").innerText = travel;
    document.getElementById("billsTotal").innerText = bills;
    document.getElementById("othersTotal").innerText = others;
}