# Based on https://howto.wared.fr/ubuntu-mise-a-jour-images-docker-compose/

# Se placer tout d’abord dans le répertoire contenant le fichier docker-compose.yml
# et mettre à jour l’image associée en exécutant la commande suivante :
docker-compose pull

# Relancer les containers :
docker-compose up -d --remove-orphans

# Supprimez les images obsolètes :
docker image prune -f
