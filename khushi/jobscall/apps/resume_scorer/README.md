# Resume Scorer

A Django application for scoring and analyzing resumes, providing detailed feedback and improvement suggestions.

## Features

- Upload and score resumes
- Get detailed analysis of resume content
- Receive specific improvement suggestions
- Track improvements over time
- Admin interface for managing settings and viewing all scores
- RESTful API for integration with frontend applications

## Models

### ResumeScore
Stores information about each resume scoring request.

### ScoreImprovement
Stores specific improvement suggestions for a resume.

### ResumeScoreSettings
Stores configuration settings for the resume scoring system.

## API Endpoints

### Resume Scores
- `GET /api/resume-scores/` - List all resume scores for the authenticated user
- `POST /api/resume-scores/` - Upload a new resume for scoring
- `GET /api/resume-scores/{id}/` - Get details of a specific resume score
- `POST /api/resume-scores/{id}/apply_improvement/` - Apply a specific improvement to a resume

### Score Improvements
- `GET /api/score-improvements/` - List all score improvements
- `GET /api/score-improvements/{id}/` - Get details of a specific improvement

### Settings (Admin only)
- `GET /api/settings/` - List all settings
- `POST /api/settings/` - Create a new setting (admin only)
- `GET /api/settings/{id}/` - Get a specific setting
- `PUT /api/settings/{id}/` - Update a setting (admin only)
- `DELETE /api/settings/{id}/` - Delete a setting (admin only)

## Installation

1. Add 'apps.resume_scorer' to your INSTALLED_APPS setting:
   ```python
   INSTALLED_APPS = [
       # ...
       'apps.resume_scorer',
   ]
   ```

2. Include the URL configuration in your project's urls.py:
   ```python
   path('api/resume-scorer/', include('apps.resume_scorer.urls')),
   ```

3. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

## Configuration

You can configure the resume scorer by adding settings through the admin interface or by creating them programmatically.

## Testing

Run the test suite with:
```bash
python manage.py test apps.resume_scorer.tests
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
