@echo off
echo Starting Django Backend Server...
echo.

cd /d "c:\Users\admin\Music\khushijobscall\khushi\jobscall"

REM Activate virtual environment
call venv\Scripts\activate

REM Check if migrations need to be run
echo Checking database migrations...
python manage.py showmigrations

REM Run migrations if needed
python manage.py migrate

REM Start the server
echo Starting server on port 8000...
python manage.py runserver 0.0.0.0:8000

pause
