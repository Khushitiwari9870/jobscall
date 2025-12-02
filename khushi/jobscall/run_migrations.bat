@echo off
set PYTHONPATH=%~dp0
python -m django makemigrations saved_searches
python -m django migrate saved_searches
