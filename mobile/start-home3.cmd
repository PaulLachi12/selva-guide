@echo off
setlocal
cd /d C:\Users\Leo\SelvaGuide\mobile || exit /b 1
set CI=1
call npx expo start --lan --clear > C:\Users\Leo\AppData\Local\Temp\opencode\metro-home3.log 2>&1
