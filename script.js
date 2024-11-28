document.addEventListener("DOMContentLoaded", () => {
  // Import DOM elements
  const incomeDisplay = document.getElementById("income");
  const expenseDisplay = document.getElementById("Expense");
  const netBalanceDisplay = document.getElementById("Net");
  const inputType = document.getElementById("type");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const addButton = document.getElementById("add-btn");
  const filterInputs = document.querySelectorAll('input[name="filter"]');

  // Initialize entries array
  let entries = [];

  // Update income, expense, and net balance
  function updateAmt() {
    let totalIncome = entries.reduce((total, entry) => {
      return entry.type === "income" ? total + entry.amount : total;
    }, 0);

    let totalExpense = entries.reduce((total, entry) => {
      return entry.type === "expense" ? total + entry.amount : total;
    }, 0);

    incomeDisplay.innerText = totalIncome;
    expenseDisplay.innerText = totalExpense;
    netBalanceDisplay.innerText = totalIncome - totalExpense;
  }

  // Add a new entry
  function addItem() {
    // Validate inputs
    if (
      descriptionInput.value.trim() === "" ||
      Number(amountInput.value) <= 0
    ) {
      return alert("Please provide valid inputs!");
    }

    // Push new entry to the array
    entries.push({
      type: inputType.value,
      description: descriptionInput.value.trim(),
      amount: Number(amountInput.value),
    });

    // Clear input fields and update the table and totals
    descriptionInput.value = "";
    amountInput.value = "";
    updateTable();
    updateAmt();
  }

  // Load individual entries into the table
  function loadItems(entry, index) {
    const table = document.getElementById("table");
    const row = table.insertRow(index + 1);

    // Helper to create and populate table cells
    const createCell = (content, className = "") => {
      const cell = row.insertCell();
      cell.innerHTML = content;
      if (className) cell.classList.add(className);
      return cell;
    };

    createCell(index + 1); // Entry index
    createCell(entry.description); // Description
    createCell(entry.amount); // Amount
    createCell(
      entry.type === "income" ? "income" : "expense",
      entry.type === "income" ? "green" : "red"
    );

    // Add edit and delete buttons
    const deleteCell = createCell("&#9746;", "btn");
    deleteCell.addEventListener("click", () => deleteItem(entry));

    const editCell = createCell("&#9998;", "btn");
    editCell.addEventListener("click", () => editItem(entry));

    // Style row based on type
    row.style.backgroundColor =
      entry.type === "income" ? "lightgreen" : "lightcoral";
  }

  // Delete an entry
  function deleteItem(entry) {
    entries = entries.filter((e) => e !== entry);
    updateTable();
    updateAmt();
  }

  // Edit an entry
  function editItem(entry) {
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    inputType.value = entry.type;

    // Delete the entry so it can be re-added after editing
    deleteItem(entry);
  }

  // Filter entries based on selected filter
  function applyFilter(entries) {
    const selectedFilter = document.querySelector(
      'input[name="filter"]:checked'
    ).value;

    if (selectedFilter === "income") {
      return entries.filter((entry) => entry.type === "income");
    } else if (selectedFilter === "expense") {
      return entries.filter((entry) => entry.type === "expense");
    } else {
      return entries; // Return all entries for "all" filter
    }
  }

  // Update the table with filtered entries
  function updateTable() {
    // Clear the table (except header row)
    const table = document.getElementById("table");
    while (table.rows.length > 1) table.deleteRow(1);

    // Load filtered entries into the table
    const filteredEntries = applyFilter(entries);
    filteredEntries.forEach((entry, index) => loadItems(entry, index));
  }

  // Event listeners
  addButton.addEventListener("click", addItem);
  filterInputs.forEach((filter) => {
    filter.addEventListener("change", () => {
      updateTable();
    });
  });

  // Initial load
  updateTable();
  updateAmt();
});
