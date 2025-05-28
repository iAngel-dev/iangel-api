#!/bin/bash

echo "🧠 Initialisation du projet iAngel..."

# Créer la structure des dossiers
mkdir -p ~/iangel_project/backend/models
mkdir -p ~/iangel_project/backend/data
mkdir -p ~/iangel_project/backend/logs
mkdir -p ~/iangel_project/frontend/public/audios
mkdir -p ~/iangel_project/frontend/app

cd ~/iangel_project

# Télécharger les fichiers principaux
curl -O https://scispace-cdn.com/iangel_backend_full.py -o backend/iangel_backend_full.py
curl -O https://scispace-cdn.com/.env -o backend/.env
curl -O https://scispace-cdn.com/insf_knowledge_base.json -o backend/data/insf_knowledge_base.json

# Fichiers modèles (pkl)
curl -O https://scispace-cdn.com/scan_phone_model_v2.pkl -o backend/models/scan_phone_model_v2.pkl
curl -O https://scispace-cdn.com/dummy_anxiety_voice_model.pkl -o backend/models/dummy_anxiety_voice_model.pkl
curl -O https://scispace-cdn.com/dummy_anxiety_feature_scaler.pkl -o backend/models/dummy_anxiety_feature_scaler.pkl
curl -O https://scispace-cdn.com/iangel_model_v2.pkl -o backend/models/iangel_model_v2.pkl

# Logo et MP3s
curl -O https://scispace-cdn.com/logo_iangel.png -o frontend/public/logo_iangel.png
curl -O https://scispace-cdn.com/voice_Sol.mp3 -o frontend/public/audios/voice_Sol.mp3

# Interface
curl -O https://scispace-cdn.com/page.tsx -o frontend/app/page.tsx
curl -O https://scispace-cdn.com/package.json -o frontend/package.json

# Installer Flask
pip install flask python-dotenv

echo "✅ API prête sur http://localhost:5000"
echo "🌐 Frontend prêt à configurer avec Vite ou Next.js"

# Lancer l’API automatiquement
cd backend
python3 iangel_backend_full.py