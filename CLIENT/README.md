# Library Management System - Frontend

A modern, responsive Bootstrap 5 frontend for the Library Management System.

## Features

✨ **Bootstrap 5 Components**
- Responsive navbar with navigation
- Card-based dashboard with stats
- Professional data tables with striped and hover effects
- Modal dialogs for form inputs
- Alert notifications with auto-dismiss

📊 **Dashboard**
- Total Books Count
- Active Users Count
- Active Borrowing Records
- Pending Fines Count

📚 **Books Management**
- View all books in a table format
- Add new books
- Edit book information
- Delete books
- See available vs total copies

👥 **Users Management**
- View all users
- Add new users
- Edit user information
- Delete users
- Display user contact details

📤 **Borrowing Records**
- View all borrowing records with status
- Add new borrowing records
- Return books with one click
- Delete borrowing records
- Color-coded status badges

## Getting Started

### Prerequisites
- Backend API running on `http://localhost:5000`
- Modern web browser

### Usage

1. **Start the Backend**
   ```bash
   cd API
   npm install
   npm start
   ```

2. **Open Frontend**
   - Simply open `index.html` in your browser
   - Or use a local development server (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```
   - Navigate to `http://localhost:8000`

## File Structure

```
CLIENT/
├── index.html      # Main HTML structure with Bootstrap 5
├── styles.css      # Custom styling and gradients
├── app.js          # JavaScript for API calls and interactions
└── README.md       # This file
```

## Features Breakdown

### Navigation
- Sticky navbar with smooth navigation links
- Responsive mobile menu

### Dashboard
- 4 key metric cards with gradient backgrounds
- Real-time data from backend
- Auto-refresh every 30 seconds

### Tables
- Striped rows for better readability
- Hover effects for interactive feel
- Action buttons (Edit, Delete)
- Responsive design

### Modals
- Add Book Modal
- Add User Modal
- Add Borrowing Modal
- Clean form inputs with validation

### Alerts
- Success alerts (green)
- Error alerts (red)
- Warning alerts (yellow)
- Info alerts (blue)
- Auto-dismiss after 4 seconds

## API Endpoints Used

The frontend communicates with these backend endpoints:

- `GET /api/books` - Fetch all books
- `POST /api/books` - Add new book
- `DELETE /api/books/:id` - Delete book
- `GET /api/users` - Fetch all users
- `POST /api/users` - Add new user
- `DELETE /api/users/:id` - Delete user
- `GET /api/borrowing-records` - Fetch all borrowing records
- `POST /api/borrowing-records` - Add new borrowing record
- `PUT /api/borrowing-records/:id` - Update borrowing record
- `DELETE /api/borrowing-records/:id` - Delete borrowing record
- `GET /api/fines` - Fetch all fines

## Styling

The application uses:
- **Bootstrap 5** for responsive grid and components
- **Font Awesome 6** for icons
- **Custom CSS** with:
  - Gradient backgrounds for cards
  - Smooth transitions and hover effects
  - Professional color scheme
  - Mobile-responsive design

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #0d6efd;
    --secondary-color: #6c757d;
    --success-color: #198754;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #0dcaf0;
}
```

### API URL
Change the API base URL in `app.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Auto-refresh data every 30 seconds
- Responsive images and icons
- Optimized CSS and JavaScript
- No external dependencies except Bootstrap and Font Awesome

## Future Enhancements

- [ ] Advanced search and filtering
- [ ] User authentication
- [ ] Export to PDF/Excel
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode toggle

## License

MIT License
