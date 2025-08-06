// Expense Management Class
class ExpenseManager {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.initializeEventListeners();
        this.renderExpenses();
    }

    initializeEventListeners() {
        // Clear All Button
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all expenses?')) {
                this.clearAllExpenses();
            }
        });

        // Export Button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportExpenses();
        });
    }

    renderExpenses() {
        const tbody = document.getElementById('expenses-body');
        tbody.innerHTML = '';

        if (this.expenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No expenses recorded yet</td>
                </tr>
            `;
            return;
        }

        this.expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatDate(expense.date)}</td>
                <td>${expense.title}</td>
                <td>
                    <span class="badge bg-primary">
                        <i class="fas ${this.getCategoryIcon(expense.category)}"></i>
                        ${expense.category}
                    </span>
                </td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td>
                    <button class="action-btn delete" onclick="expenseManager.deleteExpense(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    deleteExpense(index) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses.splice(index, 1);
            this.saveExpenses();
            this.renderExpenses();
        }
    }

    clearAllExpenses() {
        this.expenses = [];
        this.saveExpenses();
        this.renderExpenses();
    }

    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    getCategoryIcon(category) {
        const icons = {
            'Food': 'fa-utensils',
            'Transportation': 'fa-car',
            'Entertainment': 'fa-gamepad',
            'Bills': 'fa-file-invoice',
            'Shopping': 'fa-shopping-bag',
            'Other': 'fa-tag'
        };
        return icons[category] || 'fa-tag';
    }

    exportExpenses() {
        if (this.expenses.length === 0) {
            alert('No expenses to export');
            return;
        }

        const csvContent = [
            ['Date', 'Title', 'Category', 'Amount'],
            ...this.expenses.map(expense => [
                this.formatDate(expense.date),
                expense.title,
                expense.category,
                `₹${expense.amount.toFixed(2)}`
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize Expense Manager
const expenseManager = new ExpenseManager(); 