const express = require('express');
const cors    = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/roles',             require('./routes/roles'));
app.use('/api/users',             require('./routes/users'));
app.use('/api/user-roles',        require('./routes/userRoles'));
app.use('/api/memberships',       require('./routes/memberships'));
app.use('/api/member-cards',      require('./routes/memberCards'));
app.use('/api/fines',             require('./routes/fines'));
app.use('/api/publishers',        require('./routes/publishers'));
app.use('/api/categories',        require('./routes/categories'));
app.use('/api/shelves',           require('./routes/shelves'));
app.use('/api/authors',           require('./routes/authors'));
app.use('/api/books',             require('./routes/books'));
app.use('/api/book-authors',      require('./routes/bookAuthors'));
app.use('/api/book-copies',       require('./routes/bookCopies'));
app.use('/api/borrowing-records', require('./routes/borrowingRecords'));
app.use('/api/reservations',      require('./routes/reservations'));
app.use('/api/notifications',     require('./routes/notifications'));
app.use('/api/reviews',           require('./routes/reviews'));
app.use('/api/audit-log',         require('./routes/auditLog'));

app.get('/', (req, res) => {
  res.json({ message: 'Library Management System API is running.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));