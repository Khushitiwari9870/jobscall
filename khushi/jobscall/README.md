# JobScall - Comprehensive Job Portal Platform

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview
JobScall is a comprehensive job portal platform that connects job seekers with employers. It provides a robust set of features for job searching, application management, and recruitment processes.

## Features

### 1. Authentication & User Management (authx)
- Custom user model with email-based authentication
- User roles: Candidate, Employer, and Admin
- JWT-based authentication
- Password reset functionality
- User profiles with detailed information
- Social authentication (if implemented)

### 2. Job Management (jobs, job_posting)
- Create, read, update, and delete job postings
- Job categories and types
- Job search and filtering
- Job application tracking
- Job recommendations based on skills

### 3. Company Profiles (companies)
- Company registration and profiles
- Company reviews and ratings
- Job listings by company
- Company search functionality

### 4. Candidate Management (candidate_search, profiles)
- Candidate profiles with work history
- Resume/CV upload and parsing
- Skill tagging and verification
- Candidate search and filtering
- Profile completeness tracking

### 5. Application Management (applications)
- Job application submission
- Application status tracking
- Application history
- Application notes and feedback

### 6. Resume Tools (resumes, resume_checker, resume_enhancer, resume_highlighter, resume_scorer)
- Resume parsing and analysis
- Resume scoring based on job requirements
- Resume enhancement suggestions
- Keyword optimization
- ATS (Applicant Tracking System) compatibility checking

### 7. Communication (notifications, alerts, emails)
- Email notifications for job matches
- Application status updates
- Interview scheduling
- Custom email templates
- In-app notifications

### 8. Matching & Search (matching, search, saved_searches, recent_searches)
- Advanced job search
- Candidate-job matching algorithm
- Saved searches
- Search history
- Email alerts for new matching jobs

### 9. Blog & Content Management (blog, cms)
- Blog posts and articles
- Categories and tags
- Comments and engagement
- FAQ management
- Static pages

### 10. Analytics & Reporting (analytics)
- User activity tracking
- Job application analytics
- Company dashboard
- Admin reports
- Data export

### 11. Payments & Subscriptions (payments, subscriptions)
- Subscription plans
- Payment processing
- Billing history
- Credit system
- Invoice generation

### 12. Admin Panel (adminpanel)
- User management
- Content moderation
- System configuration
- Reports and analytics
- System health monitoring

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL/MySQL (or SQLite for development)
- Redis (for caching and background tasks)
- Node.js & npm (for frontend assets)

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jobscall
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

## API Documentation

API documentation is available at `/api/docs/` when running the development server. The API follows RESTful principles and uses JWT for authentication.

### Authentication
```http
POST /api/v1/auth/jwt/token/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

## Testing

Run the test suite with:
```bash
python manage.py test
```

## Deployment

For production deployment, please refer to the deployment guide in `docs/deployment.md`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
