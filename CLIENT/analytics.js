const API_URL = 'https://dbms-library-api.onrender.com/api';
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
});

async function loadAnalytics() {
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

        // Update summary statistics
        document.getElementById('totalBooks').textContent = books.length || 0;
        document.getElementById('totalUsers').textContent = users.length || 0;

        const activeBorrowings = borrowing.filter(b => !b.return_date).length;
        document.getElementById('activeBorrowings').textContent = activeBorrowings || 0;

        const pendingFines = fines.filter(f => f.status === 'pending').length;
        document.getElementById('pendingFines').textContent = pendingFines || 0;

        renderBooksDistribution(books);
        renderBorrowingStatus(borrowing);
        renderFinesAnalysis(fines);
        renderUserActivity(users, borrowing);
        renderGenreDistribution(books);
        renderFinesByStatus(fines);
    } catch (error) {
        console.error('Error loading analytics:', error);
        showAlert('Error loading analytics data', 'danger');
    }
}

function renderBooksDistribution(books) {
    const ctx = document.getElementById('booksDistributionChart')?.getContext('2d');
    if (!ctx) return;

    const categories = {};
    books.forEach(book => {
        const category = book.category || 'Uncategorized';
        categories[category] = (categories[category] || 0) + 1;
    });

    if (charts.booksDistribution) charts.booksDistribution.destroy();
    charts.booksDistribution = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, font: { size: 12 } }
                },
                title: {
                    display: true,
                    text: 'Books Distribution by Category',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
}

function renderBorrowingStatus(borrowing) {
    const ctx = document.getElementById('borrowingStatusChart')?.getContext('2d');
    if (!ctx) return;

    const active = borrowing.filter(b => !b.return_date).length;
    const returned = borrowing.filter(b => b.return_date).length;

    if (charts.borrowingStatus) charts.borrowingStatus.destroy();
    charts.borrowingStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Active Borrowings', 'Returned Books'],
            datasets: [{
                data: [active, returned],
                backgroundColor: ['#FFA500', '#4CAF50'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, font: { size: 12 } }
                },
                title: {
                    display: true,
                    text: 'Borrowing Status Overview',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
}

function renderFinesAnalysis(fines) {
    const ctx = document.getElementById('finesAnalysisChart')?.getContext('2d');
    if (!ctx) return;

    const paid = fines.filter(f => f.status === 'paid').length;
    const pending = fines.filter(f => f.status === 'pending').length;

    if (charts.finesAnalysis) charts.finesAnalysis.destroy();
    charts.finesAnalysis = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Paid Fines', 'Pending Fines'],
            datasets: [{
                data: [paid, pending],
                backgroundColor: ['#4CAF50', '#F44336'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, font: { size: 12 } }
                },
                title: {
                    display: true,
                    text: 'Fines Status Distribution',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
}

function renderUserActivity(users, borrowing) {
    const ctx = document.getElementById('userActivityChart')?.getContext('2d');
    if (!ctx) return;

    const activeUsers = new Set(borrowing.map(b => b.user_id)).size;
    const inactiveUsers = users.length - activeUsers;

    if (charts.userActivity) charts.userActivity.destroy();
    charts.userActivity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Active Users', 'Inactive Users'],
            datasets: [{
                label: 'User Count',
                data: [activeUsers, inactiveUsers],
                backgroundColor: ['#2196F3', '#BDBDBD'],
                borderColor: ['#1976D2', '#9E9E9E'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'User Activity Overview',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderGenreDistribution(books) {
    const ctx = document.getElementById('genreDistributionChart')?.getContext('2d');
    if (!ctx) return;

    const genres = {};
    books.forEach(book => {
        const genre = book.genre || 'Unknown';
        genres[genre] = (genres[genre] || 0) + 1;
    });

    const sortedGenres = Object.entries(genres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    if (charts.genreDistribution) charts.genreDistribution.destroy();
    charts.genreDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedGenres.map(g => g[0]),
            datasets: [{
                label: 'Number of Books',
                data: sortedGenres.map(g => g[1]),
                backgroundColor: '#36A2EB',
                borderColor: '#1976D2',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Top 10 Genres',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderFinesByStatus(fines) {
    const ctx = document.getElementById('finesByStatusChart')?.getContext('2d');
    if (!ctx) return;

    const fineRanges = {
        '0-100': 0,
        '100-500': 0,
        '500-1000': 0,
        '1000+': 0
    };

    fines.forEach(fine => {
        const amount = fine.amount || 0;
        if (amount <= 100) fineRanges['0-100']++;
        else if (amount <= 500) fineRanges['100-500']++;
        else if (amount <= 1000) fineRanges['500-1000']++;
        else fineRanges['1000+']++;
    });

    if (charts.finesByStatus) charts.finesByStatus.destroy();
    charts.finesByStatus = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(fineRanges),
            datasets: [{
                label: 'Number of Fines',
                data: Object.values(fineRanges),
                backgroundColor: '#FF6384',
                borderColor: '#D32F2F',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Fines Distribution by Amount Range',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.insertBefore(alertDiv, document.body.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
}
