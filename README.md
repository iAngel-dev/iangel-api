# iAngel API

Moteur d'API backend de l'application iAngel.  
Propulsée par Flask, pensée pour l'assistance humaine, l'apprentissage local, et la bienveillance numérique.

## Endpoints disponibles
- `/` : Bienvenue
- `/teach` : Obtenir des conseils contextuels
- `/scan-phone` : Évaluer un numéro suspect
- `/analyze-anxiety` : Évaluer un risque vocal
- `/voice` : Voix par défaut active

## Déploiement Render
1. Connecte ce repo à Render
2. Utilise les commandes :
   - Build: `pip install -r requirements.txt`
   - Start: `python iangel_backend_full.py`