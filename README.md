# Employee Management System

A comprehensive Employee Management System built with Laravel 11, React (Inertia.js), and Tailwind CSS.

## 🚀 Features

### 🔐 Role-Based Access Control
- **5 User Roles**: Super Admin, Admin, Manager, HR, Employee
- **90+ Permissions**: Granular control over system features
- **Dynamic Sidebar**: Permission-based navigation that shows/hides based on user access
- **Secure Routes**: Middleware protection for all sensitive operations

### 👥 Employee Management
- Complete employee CRUD operations
- Department and position management
- Employee profiles with photo uploads
- Advanced filtering and search
- Import/Export functionality (Excel, CSV, PDF)
- Employee history tracking

### 📊 Business Operations
- Product management and inventory tracking
- Delivery tracking system
- Collection management with verification
- Expense tracking and approval workflows
- Balance sheet management

### 💰 Payroll & Finance
- Comprehensive salary structure management
- Automated payroll processing
- Leave management with approval workflows
- Financial reporting and analytics
- Budget management

### 📈 Reports & Analytics
- Dashboard with real-time analytics
- Comprehensive reporting system
- Data export capabilities in multiple formats
- Performance analytics and insights
- Attendance and payroll reports

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Professional sidebar with smooth animations
- Mobile-friendly interface with hamburger menu
- Modern gradient designs and hover effects
- Custom scrollbars and loading states

## 🛠️ Technology Stack

- **Backend**: Laravel 11, PHP 8.2+
- **Frontend**: React.js with Inertia.js
- **Styling**: Tailwind CSS with custom components
- **Database**: MySQL/SQLite
- **Authentication**: Laravel Breeze with Inertia
- **Permissions**: Spatie Laravel Permission
- **Build Tools**: Vite
- **File Processing**: Maatwebsite Excel for imports/exports

## 📦 Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL or SQLite
- Git

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/employee-management-system.git
   cd employee-management-system
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database configuration**
   - Create a database named `employee_management`
   - Update `.env` file with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=employee_management
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Database setup**
   ```bash
   php artisan migrate
   php artisan db:seed --class=RoleAndPermissionSeeder
   php artisan db:seed --class=SuperAdminSeeder
   ```

6. **Build assets**
   ```bash
   npm run build
   # OR for development with hot reload
   npm run dev
   ```

7. **Start the application**
   ```bash
   php artisan serve
   ```

Visit `http://localhost:8000` to access the application.

## 🔑 Default Login Credentials

**Super Administrator**
- Email: `superadmin@company.com`
- Password: `SuperAdmin@123`

After logging in, you can create additional users and assign appropriate roles.

## 👤 User Roles & Permissions

### Super Admin (90+ permissions)
- Complete system access and override capabilities
- User and role management
- System configuration and maintenance
- All business operations
- Financial management and reporting

### Admin (70+ permissions)
- Most system features except super admin specific
- User management and role assignment
- Business operations and approvals
- Comprehensive reporting access
- System settings management

### Manager (40+ permissions)
- Business operations focused
- Employee management and oversight
- Approval workflows for expenses and leaves
- Performance and operational reports
- Department and team management

### HR (25+ permissions)
- People management focused
- Employee lifecycle management
- Payroll and salary operations
- Leave management and approvals
- HR specific reports and analytics

### Employee (10+ permissions)
- Personal profile management
- Attendance marking
- Leave requests and applications
- Basic operational tasks
- Personal reports and information

## 🗂️ Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/         # Application controllers
│   │   ├── Middleware/          # Custom middleware
│   │   └── Requests/           # Form request validation
│   ├── Models/                 # Eloquent models
│   ├── Policies/               # Authorization policies
│   ├── Services/               # Business logic services
│   └── Traits/                 # Reusable traits
├── database/
│   ├── migrations/             # Database migrations
│   ├── seeders/               # Database seeders
│   └── factories/             # Model factories
├── resources/
│   ├── js/
│   │   ├── Components/        # React components
│   │   ├── Layouts/          # Layout components
│   │   └── Pages/            # Page components
│   ├── css/                  # Stylesheets and Tailwind
│   └── views/                # Blade templates
├── routes/                   # Application routes
└── public/                   # Public assets
```

## 🎯 Key Features Deep Dive

### Permission-Based Sidebar Navigation
- **Dynamic Menu**: Items appear/disappear based on user permissions
- **Categorized Modules**: Organized into logical sections
- **Visual Indicators**: Active states and hover effects
- **Mobile Responsive**: Collapsible hamburger menu

### Comprehensive Permission System
- **Granular Control**: 90+ individual permissions
- **Category-Based**: Organized by functional areas
- **Role Inheritance**: Hierarchical permission structure
- **Dynamic UI**: Interface adapts to user capabilities

### Modern Design System
- **Custom CSS Variables**: Consistent theming
- **Gradient Backgrounds**: Professional visual appeal
- **Smooth Animations**: Enhanced user experience
- **Responsive Grid**: Adaptive layouts for all devices

## 🚀 Getting Started Guide

1. **First Login**: Use super admin credentials to access the system
2. **Create Users**: Add users through the User Management module
3. **Assign Roles**: Set appropriate roles for each user
4. **Setup Departments**: Configure organizational structure
5. **Add Employees**: Start adding employee records
6. **Configure Settings**: Customize system settings as needed

## 🛡️ Security Features

- **Route Protection**: Middleware-based security
- **Permission Checks**: Controller-level authorization
- **UI Security**: Dynamic interface based on permissions
- **Database Security**: Eloquent ORM with prepared statements
- **Role Hierarchy**: Proper permission inheritance

## 📱 Mobile Responsiveness

- **Responsive Sidebar**: Collapsible navigation for mobile
- **Touch-Friendly**: Optimized for touch interactions
- **Adaptive Layouts**: Content adjusts to screen size
- **Mobile Navigation**: Hamburger menu implementation

## 🔧 Development

### Running in Development Mode
```bash
# Start Laravel development server
php artisan serve

# Start Vite development server (in another terminal)
npm run dev
```

### Building for Production
```bash
npm run build
php artisan optimize
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🆘 Support & Troubleshooting

### Common Issues

**Database Connection Errors**
- Ensure your database server is running
- Verify credentials in `.env` file
- Check if database exists

**Permission Errors**
- Ensure storage and bootstrap/cache directories are writable
- Run: `chmod -R 775 storage bootstrap/cache` (Linux/Mac)

**Frontend Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `npm run build -- --force`

### Getting Help
- Create an issue in this repository
- Check the documentation in the `/docs` folder
- Review the implementation summary in `IMPLEMENTATION_SUMMARY.md`

---

**Built with ❤️ using Laravel 11, React, and Tailwind CSS**

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
