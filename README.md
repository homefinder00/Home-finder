# Uganda Housing - Property Rental Platform

A modern property rental platform for Uganda, built with Laravel (backend) and React (frontend).

## 🏠 About This Project

Uganda Housing is a comprehensive property rental platform that connects landlords with potential tenants across Uganda. The platform features:

- **Property Listings**: Browse and search rental properties
- **Authentication**: Secure user registration and login with Laravel Sanctum
- **Responsive Design**: Mobile-first design with desktop support
- **Real-time Features**: Property contact and booking system
- **Offline Support**: PWA capabilities for offline browsing
- **Map Integration**: Location-based property search

## 🚀 Quick Start

**For detailed setup instructions, see [SETUP.md](SETUP.md)**

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- Git

### Get Started in 3 Steps

1. **Clone and setup backend**
   ```bash
   git clone https://github.com/homefinder00/Home-finder.git
   cd Home-finder
   composer install
   cp .env.example .env
   php artisan key:generate
   touch database/database.sqlite
   php artisan migrate --seed
   php artisan serve
   ```

2. **Setup frontend**
   ```bash
   cd uganda_housing_app/uganda_housing_app
   npm install
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 🛠 Tech Stack

### Backend (Laravel 11)
- **Framework**: Laravel 11
- **Database**: SQLite (development) / MySQL (production)
- **Authentication**: Laravel Sanctum
- **API**: RESTful API design

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Phosphor Icons
- **State Management**: React hooks + Context API

## 📋 Features

### For Tenants
- Browse property listings
- Advanced search and filtering
- Save favorite properties
- Contact landlords directly
- View property details and images
- Map-based property search

### For Landlords  
- List properties for rent
- Manage property listings
- Receive tenant inquiries
- Property analytics (coming soon)

### Technical Features
- Responsive mobile-first design
- Offline-first PWA capabilities
- Real-time property updates
- Secure authentication
- CORS-enabled API
- SQLite for easy development

## 🤝 Team Collaboration

### Environment Setup
- Copy `.env.example` to `.env`
- Never commit your `.env` file
- Use SQLite for development (no database server needed)

### Development Workflow
1. Pull latest changes: `git pull`
2. Update dependencies: `composer install && npm install`
3. Run migrations: `php artisan migrate`
4. Start both servers (Laravel + React)

## 📁 Project Structure

```
├── app/                    # Laravel application
│   ├── Http/Controllers/   # API controllers  
│   └── Models/            # Eloquent models
├── database/              # Migrations & seeders
├── routes/api.php         # API routes
├── uganda_housing_app/    # React frontend
└── .env.example          # Environment template
```

## 🔗 API Endpoints

- `GET /api/properties` - List all properties
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/user` - Get authenticated user

## 🚧 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📞 Support

- Check [SETUP.md](SETUP.md) for detailed setup instructions
- Review logs: `storage/logs/laravel.log`
- Frontend errors: Browser DevTools Console

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
