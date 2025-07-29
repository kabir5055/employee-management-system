#!/bin/bash

echo "🚀 Employee Management System - GitHub Repository Setup"
echo "======================================================="
echo ""

# Repository configuration
REPO_NAME="employee-management-system"
REPO_DESCRIPTION="A comprehensive Employee Management System built with Laravel 11, React (Inertia.js), and Tailwind CSS"

echo "📋 Setting up repository: $REPO_NAME"
echo "📝 Description: $REPO_DESCRIPTION"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Initializing..."
    git init
    echo "✅ Git repository initialized"
fi

# Check if user has configured git
echo "🔧 Checking Git configuration..."
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    echo "⚠️  Git user not configured. Please set your Git credentials:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
    echo ""
fi

# Add all files to staging
echo "📦 Adding files to staging area..."
git add .
echo "✅ Files added to staging"

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: Complete Employee Management System with role-based permissions

- Implemented comprehensive role-based access control with 5 roles
- Created permission-based sidebar navigation with 90+ permissions
- Built modern responsive UI with Tailwind CSS and React
- Added employee management with CRUD operations
- Integrated Spatie Laravel Permission for security
- Created super admin with full system access
- Implemented modern design with animations and gradients
- Added comprehensive seeder system for roles and permissions
- Built dynamic navigation based on user permissions
- Included mobile-responsive layout with professional design"

echo "✅ Changes committed"

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "🎯 GitHub CLI detected. Creating repository..."
    
    # Create repository using GitHub CLI
    gh repo create $REPO_NAME --public --description "$REPO_DESCRIPTION" --source=. --remote=origin --push
    
    echo "✅ Repository created and pushed to GitHub!"
    echo "🌐 Repository URL: https://github.com/$(gh api user --jq '.login')/$REPO_NAME"
    
else
    echo "⚠️  GitHub CLI not found. Manual setup required:"
    echo ""
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: $REPO_DESCRIPTION"
    echo "4. Set as Public repository"
    echo "5. DO NOT initialize with README, .gitignore, or license (we already have them)"
    echo "6. Click 'Create repository'"
    echo ""
    echo "7. Then run these commands:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "Replace YOUR_USERNAME with your actual GitHub username"
fi

echo ""
echo "📋 Repository Information:"
echo "========================"
echo "Name: $REPO_NAME"
echo "Description: $REPO_DESCRIPTION"
echo "Branch: main"
echo "Files committed: $(git ls-files | wc -l)"
echo ""

echo "🎯 Key Features Included:"
echo "========================"
echo "✅ Role-based access control (5 roles)"
echo "✅ Permission-based sidebar navigation (90+ permissions)"
echo "✅ Modern responsive UI with Tailwind CSS"
echo "✅ Employee management system"
echo "✅ Super admin with full access"
echo "✅ Mobile-responsive design"
echo "✅ Comprehensive seeders"
echo "✅ Laravel 11 + React + Inertia.js"
echo ""

echo "📖 Getting Started:"
echo "=================="
echo "1. Clone: git clone https://github.com/YOUR_USERNAME/$REPO_NAME.git"
echo "2. Install: composer install && npm install"
echo "3. Setup: cp .env.example .env && php artisan key:generate"
echo "4. Database: php artisan migrate && php artisan db:seed"
echo "5. Build: npm run build"
echo "6. Serve: php artisan serve"
echo ""
echo "🔐 Super Admin Login:"
echo "Email: superadmin@company.com"
echo "Password: SuperAdmin@123"
echo ""

echo "🎉 Setup complete! Your Employee Management System is ready for GitHub!"
