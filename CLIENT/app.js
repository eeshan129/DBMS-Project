const API_URL = 'http://localhost:5000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadBooks();
    loadUsers();
    loadBorrowingRecords();
});

// ============= DASHBOARD =============
async function loadDashboard() {
    try {
        const [booksRes, usersRes, borrowingRes, finesRes] = await Promise.all([
            fetch(`${API_URL}/books`),
            fetch(`${API_URL}/users`),
            fetch(`${API_URL}/borrowing-records`),
            fetch(`${API_URL}/fines`)
        ]);

        const books = await booksRes.json();
        const users = await usersRes.json();
        const borrowing = await borrowingRes.json();
        const fines = await finesRes.json();

        document.getElementById('totalBooks').textContent = books.length || 0;
        document.getElementById('totalUsers').textContent = users.length || 0;

        const activeBorrowings = borrowing.filter(b => !b.return_date).length;
        document.getElementById('activeBorrowings').textContent = activeBorrowings || 0;

        document.getElementById('pendingFines').textContent = fines.length || 0;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Error loading dashboard', 'danger');
    }
}

// ============= BOOKS =============
async function loadBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        const books = await response.json();

        const tbody = document.getElementById('booksTableBody');
        tbody.innerHTML = '';

        if (books.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No books found</td></tr>';
            return;
        }

        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.book_id || 'N/A'}</td>
                <td><strong>${book.title || 'N/A'}</strong></td>
                <td>${book.category_id || 'N/A'}</td>
                <td>${book.publisher_id || 'N/A'}</td>
                <td><span class="badge bg-primary">${book.total_copies || 0}</span></td>
                <td><span class="badge bg-success">${book.available_copies || 0}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editBook(${book.book_id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.book_id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('booksTableBody').innerHTML =
            '<tr><td colspan="7" class="text-center text-danger">Error loading books</td></tr>';
    }
}

async function addBook() {
    const title = document.getElementById('bookTitle').value;
    const categoryId = document.getElementById('bookCategory').value;
    const publisherId = document.getElementById('bookPublisher').value;
    const isbn = document.getElementById('bookISBN').value;
    const pubDate = document.getElementById('bookPubDate').value;

    if (!title || !categoryId || !publisherId || !isbn || !pubDate) {
        showAlert('Please fill all fields', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                category_id: parseInt(categoryId),
                publisher_id: parseInt(publisherId),
                isbn,
                publication_date: pubDate
            })
        });

        if (response.ok) {
            showAlert('Book added successfully', 'success');
            document.getElementById('addBookForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide();
            loadBooks();
        } else {
            showAlert('Error adding book', 'danger');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        showAlert('Error adding book', 'danger');
    }
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Book deleted successfully', 'success');
            loadBooks();
        } else {
            showAlert('Error deleting book', 'danger');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        showAlert('Error deleting book', 'danger');
    }
}

function editBook(bookId) {
    showAlert('Edit functionality will open a form for book ID: ' + bookId, 'info');
}

// ============= USERS =============
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();

        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No users found</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.user_id || 'N/A'}</td>
                <td><strong>${user.name || 'N/A'}</strong></td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${user.address || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editUser(${user.user_id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.user_id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTableBody').innerHTML =
            '<tr><td colspan="6" class="text-center text-danger">Error loading users</td></tr>';
    }
}

async function addUser() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    const address = document.getElementById('userAddress').value;

    if (!name || !email || !phone || !address) {
        showAlert('Please fill all fields', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                phone,
                address
            })
        });

        if (response.ok) {
            showAlert('User added successfully', 'success');
            document.getElementById('addUserForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
            loadUsers();
            loadDashboard();
        } else {
            showAlert('Error adding user', 'danger');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showAlert('Error adding user', 'danger');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('User deleted successfully', 'success');
            loadUsers();
            loadDashboard();
        } else {
            showAlert('Error deleting user', 'danger');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showAlert('Error deleting user', 'danger');
    }
}

function editUser(userId) {
    showAlert('Edit functionality will open a form for user ID: ' + userId, 'info');
}

// ============= BORROWING RECORDS =============
async function loadBorrowingRecords() {
    try {
        const response = await fetch(`${API_URL}/borrowing-records`);
        const records = await response.json();

        const tbody = document.getElementById('borrowingTableBody');
        tbody.innerHTML = '';

        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No borrowing records found</td></tr>';
            return;
        }

        records.forEach(record => {
            const row = document.createElement('tr');
            const status = record.return_date ? 'Returned' : 'Active';
            const statusBadge = record.return_date ? 'badge-inactive' : 'badge-active';

            row.innerHTML = `
                <td>${record.borrowing_id || 'N/A'}</td>
                <td>${record.member_card_id || 'N/A'}</td>
                <td>${record.book_copy_id || 'N/A'}</td>
                <td>${formatDate(record.borrow_date) || 'N/A'}</td>
                <td>${formatDate(record.due_date) || 'N/A'}</td>
                <td>${record.return_date ? formatDate(record.return_date) : '-'}</td>
                <td><span class="badge ${statusBadge}">${status}</span></td>
                <td>
                    ${!record.return_date ? `
                        <button class="btn btn-sm btn-success" onclick="returnBook(${record.borrowing_id})">
                            <i class="fas fa-undo"></i> Return
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger" onclick="deleteBorrowing(${record.borrowing_id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading borrowing records:', error);
        document.getElementById('borrowingTableBody').innerHTML =
            '<tr><td colspan="8" class="text-center text-danger">Error loading borrowing records</td></tr>';
    }
}

async function addBorrowing() {
    const memberCardId = document.getElementById('borrowMemberCard').value;
    const bookCopyId = document.getElementById('borrowBookCopy').value;
    const borrowDate = document.getElementById('borrowDate').value;
    const dueDate = document.getElementById('dueDate').value;

    if (!memberCardId || !bookCopyId || !borrowDate || !dueDate) {
        showAlert('Please fill all fields', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/borrowing-records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                member_card_id: parseInt(memberCardId),
                book_copy_id: parseInt(bookCopyId),
                borrow_date: borrowDate,
                due_date: dueDate
            })
        });

        if (response.ok) {
            showAlert('Borrowing record added successfully', 'success');
            document.getElementById('addBorrowingForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addBorrowingModal')).hide();
            loadBorrowingRecords();
            loadDashboard();
        } else {
            showAlert('Error adding borrowing record', 'danger');
        }
    } catch (error) {
        console.error('Error adding borrowing record:', error);
        showAlert('Error adding borrowing record', 'danger');
    }
}

async function returnBook(borrowingId) {
    try {
        const response = await fetch(`${API_URL}/borrowing-records/${borrowingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                return_date: new Date().toISOString().split('T')[0]
            })
        });

        if (response.ok) {
            showAlert('Book returned successfully', 'success');
            loadBorrowingRecords();
            loadDashboard();
        } else {
            showAlert('Error returning book', 'danger');
        }
    } catch (error) {
        console.error('Error returning book:', error);
        showAlert('Error returning book', 'danger');
    }
}

async function deleteBorrowing(borrowingId) {
    if (!confirm('Are you sure you want to delete this borrowing record?')) return;

    try {
        const response = await fetch(`${API_URL}/borrowing-records/${borrowingId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Borrowing record deleted successfully', 'success');
            loadBorrowingRecords();
            loadDashboard();
        } else {
            showAlert('Error deleting borrowing record', 'danger');
        }
    } catch (error) {
        console.error('Error deleting borrowing record:', error);
        showAlert('Error deleting borrowing record', 'danger');
    }
}

// ============= UTILITY FUNCTIONS =============
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();

    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert" style="min-width: 300px; max-width: 500px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    alertContainer.innerHTML += alertHTML;

    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.remove();
        }
    }, 4000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Refresh data every 30 seconds
setInterval(() => {
    loadDashboard();
    loadBooks();
    loadUsers();
    loadBorrowingRecords();
}, 30000);
