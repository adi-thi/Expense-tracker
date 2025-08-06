document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const clearExpensesBtn = document.getElementById('clear-expenses');
    const summary = document.getElementById('summary');
    
    // Load existing expenses
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    // Handle form submission
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        
        // Create new expense object
        const expense = {
            title,
            amount: parseFloat(amount),
            category,
            date
        };
        
        // Add to expenses array
        expenses.push(expense);
        
        // Save to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        // Reset form
        expenseForm.reset();
        
        // Update summary
        updateSummary();
        
        // Show success message
        alert('Expense added successfully!');
    });
    
    // Handle clear all expenses
    clearExpensesBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all expenses?')) {
            expenses = [];
            localStorage.setItem('expenses', JSON.stringify(expenses));
            updateSummary();
            alert('All expenses have been cleared!');
        }
    });

    // Update summary function
    function updateSummary() {
        if (expenses.length === 0) {
            summary.innerHTML = '<p class="text-muted">No expenses added yet.</p>';
            return;
        }
        
        let total = 0;
        const categoryTotals = {};
        
        expenses.forEach(expense => {
            total += expense.amount;
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
        
        // Update summary
        let summaryHTML = `
            <div class="mb-3">
                <h5 class="text-white">Total Spent: ₹${total.toFixed(2)}</h5>
            </div>
            <div class="category-summary">
                <h6 class="text-white mb-2">Category-wise Breakdown:</h6>
                <ul class="list-unstyled">
        `;
        
        for (let category in categoryTotals) {
            const percentage = ((categoryTotals[category] / total) * 100).toFixed(1);
            summaryHTML += `
                <li class="mb-2">
                    <span class="text-white">${category}:</span>
                    <span class="text-white">₹${categoryTotals[category].toFixed(2)}</span>
                    <span class="text-muted">(${percentage}%)</span>
                </li>
            `;
        }
        
        summaryHTML += `
                </ul>
            </div>
        `;
        
        summary.innerHTML = summaryHTML;
    }
    
    // Load summary when page loads
    updateSummary();
});
  