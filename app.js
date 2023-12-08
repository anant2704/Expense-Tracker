document.addEventListener('DOMContentLoaded', function () {
  loadExistingExpenses();
});

function loadExistingExpenses() {
  var existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
  var expenseList = document.getElementById('expenseList');
  var deleteEntryDropdown = document.getElementById('deleteEntry');

  expenseList.innerHTML = '';
  deleteEntryDropdown.innerHTML = '<option value="" selected disabled>Select Entry</option>';

  existingExpenses.forEach(function (expense, index) {
    addExpenseToTable(expense);
    addOptionToDeleteDropdown(deleteEntryDropdown, index, expense);
  });

  // Update total monthly expenditure
  updateTotalMonthlyExpenditure(existingExpenses);
}

function addOptionToDeleteDropdown(deleteEntryDropdown, index, expense) {
  var option = document.createElement('option');
  option.value = index;
  option.text = `${expense.category} - ${expense.amount} ₹ - ${expense.dateTime}`;
  deleteEntryDropdown.add(option);
}

function addExpense() {
  var amountInput = document.getElementById('amount');
  var categoryInput = document.getElementById('category');

  var amount = amountInput.value;
  var category = categoryInput.value;

  if (amount && category) {
    var currentDate = new Date();
    var dateTimeString = currentDate.toLocaleString();

    var newExpense = {
      category: category,
      amount: amount,
      dateTime: dateTimeString,
    };

    var existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    existingExpenses.push(newExpense);

    localStorage.setItem('expenses', JSON.stringify(existingExpenses));

    addExpenseToTable(newExpense);

    amountInput.value = '';
    categoryInput.value = '';

    updateTotalMonthlyExpenditure(existingExpenses);
  } else {
    alert('Please enter both amount and category.');
  }
}

function addExpenseToTable(expense) {
  var newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${expense.category}</td>
    <td>${expense.amount} ₹</td>
    <td>${expense.dateTime}</td>
  `;

  var expenseList = document.getElementById('expenseList');
  expenseList.appendChild(newRow);
}

function updateTotalMonthlyExpenditure(existingExpenses) {
  var currentDate = new Date();
  var currentMonth = currentDate.getMonth() + 1;
  var currentYear = currentDate.getFullYear();

  var totalMonthlyExpenditureElement = document.getElementById('totalMonthlyExpenditure');

  var currentMonthTotal = existingExpenses
    .filter(expense => {
      var expenseDate = new Date(expense.dateTime);
      return expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .map(expense => parseFloat(expense.amount))
    .reduce((sum, amount) => sum + amount, 0);

  totalMonthlyExpenditureElement.innerText = currentMonthTotal.toFixed(2);
}

function deleteSelectedExpense() {
  var selectedEntryIndex = document.getElementById('deleteEntry').value;

  if (selectedEntryIndex) {
    var existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    var selectedExpense = existingExpenses[selectedEntryIndex];

    var confirmMessage = `Are you sure you want to delete the following entry?\n\nCategory: ${selectedExpense.category}\nAmount: ${selectedExpense.amount} ₹\nDate: ${selectedExpense.dateTime}`;

    if (confirm(confirmMessage)) {
      existingExpenses.splice(selectedEntryIndex, 1);
      localStorage.setItem('expenses', JSON.stringify(existingExpenses));
      location.reload();
    }
  } else {
    alert('Please select an entry to delete.');
  }
}
