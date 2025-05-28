#!/bin/bash

echo "🚀 Lancement de l’interface iAngel..."

cd ~/iangel_project/frontend

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des modules..."
  npm install
fi

# Démarrer le serveur de développement
echo "🌐 Serveur en cours de démarrage sur http://localhost:3000 ..."
npm run dev