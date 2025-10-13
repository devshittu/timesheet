#!/bin/bash

# Timesheet - Quick Deploy Script
# Usage: ./deploy.sh [staging|production] "commit message"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    print_message "$RED" "❌ Error: GitHub CLI (gh) is not installed"
    print_message "$YELLOW" "Install it: https://cli.github.com/"
    exit 1
fi

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    print_message "$RED" "❌ Error: Vercel CLI is not installed"
    print_message "$YELLOW" "Install it: npm install -g vercel"
    exit 1
fi

# Get environment (default to staging)
ENVIRONMENT=${1:-staging}
COMMIT_MESSAGE=${2:-"deploy: Update timesheet application"}

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    print_message "$RED" "❌ Error: Environment must be 'staging' or 'production'"
    echo "Usage: ./deploy.sh [staging|production] \"commit message\""
    exit 1
fi

# Set branch based on environment
if [[ "$ENVIRONMENT" == "production" ]]; then
    BRANCH="main"
else
    BRANCH="staging"
fi

print_message "$BLUE" "🚀 Starting deployment to $ENVIRONMENT..."
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_message "$YELLOW" "📝 Uncommitted changes detected"
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "$COMMIT_MESSAGE"
        print_message "$GREEN" "✅ Changes committed"
    else
        print_message "$RED" "❌ Deployment cancelled"
        exit 1
    fi
fi

# Checkout the correct branch
print_message "$BLUE" "🔄 Switching to $BRANCH branch..."
git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH"

# Pull latest changes if branch exists on remote
if git ls-remote --exit-code --heads origin "$BRANCH" &>/dev/null; then
    print_message "$BLUE" "⬇️  Pulling latest changes..."
    git pull origin "$BRANCH" --rebase || true
fi

# Run pre-deployment checks
print_message "$BLUE" "🔍 Running pre-deployment checks..."

print_message "$YELLOW" "→ Type checking..."
npm run types:check || {
    print_message "$RED" "❌ Type check failed"
    exit 1
}

print_message "$YELLOW" "→ Linting..."
npm run lint || {
    print_message "$YELLOW" "⚠️  Linting warnings detected (continuing...)"
}

print_message "$YELLOW" "→ Format check..."
npm run format:check || {
    print_message "$YELLOW" "⚠️  Format issues detected (continuing...)"
}

print_message "$YELLOW" "→ Building..."
npm run build || {
    print_message "$RED" "❌ Build failed"
    exit 1
}

print_message "$GREEN" "✅ All checks passed"
echo ""

# Push to GitHub
print_message "$BLUE" "📤 Pushing to GitHub..."
git push origin "$BRANCH"

print_message "$GREEN" "✅ Pushed to $BRANCH branch"
echo ""

# Wait a moment for GitHub Actions to start
sleep 2

# Get the latest workflow run
print_message "$BLUE" "🔄 Monitoring GitHub Actions workflow..."
gh run watch || print_message "$YELLOW" "⚠️  Could not watch workflow (check GitHub Actions manually)"

# Show deployment URL
echo ""
print_message "$GREEN" "🎉 Deployment initiated!"
print_message "$BLUE" "📊 Check status: https://github.com/devshittu/timesheet/actions"

if [[ "$ENVIRONMENT" == "production" ]]; then
    print_message "$GREEN" "🌐 Production URL: https://timesheet.vercel.app"
else
    print_message "$GREEN" "🌐 Preview URL will be available in GitHub Actions"
fi

echo ""
print_message "$BLUE" "✨ Deployment script completed!"