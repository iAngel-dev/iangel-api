# iAngel Setup Script - C:\iAngel
Write-Host "🚀 Lancement de l'installation d'iAngel..." -ForegroundColor Cyan

cd "C:\iAngel"

pip install flask gtts numpy > $null

Start-Process powershell -ArgumentList "python .\iangel_engine_fusioned_with_api.py"

Write-Host "✅ iAngel est en ligne ! Ouvre ton navigateur : http://localhost:5000" -ForegroundColor Green