# Uganda Housing Project Setup Instructions

Welcome to the Uganda Housing project! Follow these steps to get the project running on your local machine.

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- Git

## Backend Setup (Laravel API)

1. **Clone the repository**
   ```bash
   git clone https://github.com/homefinder00/Home-finder.git
   cd Home-finder
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Set up environment file**
   ```bash
   cp .env.example .env
   ```

4. **Generate application key**
   ```bash
   php artisan key:generate
   ```

5. **Create SQLite database file**
   ```bash
   touch database/database.sqlite
   ```

6. **Run database migrations**
   ```bash
   php artisan migrate
   ```

7. **Seed the database with sample data**
   ```bash
   php artisan db:seed
   ```

8. **Start the Laravel server**
   ```bash
   php artisan serve
   ```
   The backend will be available at `http://localhost:8000`

## Frontend Setup (React + TypeScript)

1. **Navigate to frontend directory**
   ```bash
   cd uganda_housing_app/uganda_housing_app
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Configuration Notes

### Database
- **SQLite** is configured by default for easy setup
- Database file: `database/database.sqlite`
- No additional database server installation required

### Authentication
- Laravel Sanctum is configured for API authentication
- CORS is set up to allow frontend-backend communication

### API Endpoints
- Base URL: `http://localhost:8000/api`
- Properties: `GET /api/properties`
- Authentication: `POST /api/auth/login`, `POST /api/auth/register`

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure SANCTUM_STATEFUL_DOMAINS in .env includes your frontend URL
   - Check that both servers are running

2. **Database Connection Issues**
   - Verify `database/database.sqlite` file exists
   - Run `php artisan migrate` if tables are missing

3. **Authentication Issues**
   - Clear browser cookies/localStorage
   - Restart both servers

4. **Port Conflicts**
   - Backend: Change port with `php artisan serve --port=8001`
   - Frontend: Vite will automatically use next available port

## Development Workflow

1. **Backend Changes**: Restart Laravel server (`Ctrl+C` then `php artisan serve`)
2. **Frontend Changes**: Hot reload is enabled automatically
3. **Database Changes**: Run `php artisan migrate` after pulling updates

## Team Collaboration

- Always pull latest changes before starting work
- Run `composer install` and `npm install` after pulling
- If migrations are added, run `php artisan migrate`
- Keep your `.env` file local (never commit it)

## Need Help?

- Check the Laravel logs: `storage/logs/laravel.log`
- Frontend console errors in browser DevTools
- API testing: Use Postman or curl commands

## Project Structure

```
├── app/                    # Laravel application code
├── database/              # Migrations, seeders, SQLite file
├── routes/api.php         # API routes
├── config/                # Laravel configuration
├── uganda_housing_app/    # React frontend
│   └── uganda_housing_app/
│       ├── src/           # React components
│       └── package.json   # Frontend dependencies
└── .env.example          # Environment template
```

Happy coding! 🏠✨
