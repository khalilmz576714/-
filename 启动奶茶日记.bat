@echo off
cd /d "%~dp0"
echo 🧋 奶茶日记启动中...
start msedge http://localhost:5173
npx vite --host
