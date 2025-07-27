# Employee Management System

A comprehensive Employee Management System built with Laravel 11, React (Inertia.js), and Tailwind CSS.

## Features

### 🔐 Role-Based Access Control
- **5 User Roles**: Super Admin, Admin, Manager, HR, Employee
- **90+ Permissions**: Granular control over system features
- **Dynamic Sidebar**: Permission-based navigation

### 👥 Employee Management
- Complete employee CRUD operations
- Department and position management
- Employee profiles with photos
- Import/Export functionality

### 📊 Business Operations
- Product management and inventory
- Delivery tracking system
- Collection management
- Expense tracking and approvals

### 💰 Payroll & Finance
- Salary structure management
- Payroll processing
- Balance sheet management
- Financial reporting

### 📈 Reports & Analytics
- Comprehensive reporting system
- Data export capabilities
- Performance analytics
- Attendance reports

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Professional sidebar with animations
- Mobile-friendly interface
- Dark mode support

## Technology Stack

- **Backend**: Laravel 11, PHP 8.2+
- **Frontend**: React.js with Inertia.js
- **Styling**: Tailwind CSS
- **Database**: MySQL/SQLite
- **Authentication**: Laravel Breeze
- **Permissions**: Spatie Laravel Permission
- **Build Tools**: Vite

## Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js and npm
- MySQL or SQLite

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/employee-management-system.git
   cd employee-management-system
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   - Create a database named `employee_management`
   - Update `.env` file with your database credentials

6. **Run migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed --class=RoleAndPermissionSeeder
   php artisan db:seed --class=SuperAdminSeeder
   ```

7. **Build frontend assets**
   ```bash
   npm run build
   ```

8. **Start the development server**
   ```bash
   php artisan serve
   ```

## Default Login Credentials

**Super Administrator**
- Email: `superadmin@company.com`
- Password: `SuperAdmin@123`

## User Roles & Permissions

### Super Admin
- Complete system access
- Can override all restrictions
- User and role management
- System configuration

### Admin
- Most system features
- User management
- Business operations
- Reporting access

### Manager
- Business operations
- Employee management
- Approval workflows
- Performance reports

### HR
- Employee management
- Payroll operations
- Leave management
- HR reports

### Employee
- Personal profile
- Attendance marking
- Leave requests
- Basic operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For support, create an issue in this repository.

---

Built with ❤️ using Laravel and React

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
