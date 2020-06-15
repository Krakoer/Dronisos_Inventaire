# Dronisos_Inventaire
Outil d'inventaire/gestion de stock pour Dronisos

# Descriptif des rôles des fichiers : 

## Fichiers PHP :

  - add-entry.php : Effectue la requête pour ajouter un actif dans la BDD -> Hardcodage de la colonne 'Reference' qui stock le N° série ligne 34 et du nom "Opération" ligne 41
  - add-entry-form.php : Créer les formulaire d'ajout d'un actif en html 
  - add-ops : Effectue la requête pour affecter des actifs à une opération dans la BDD -> Hardcodage des noms de colonnes à partir de la ligne 15
  - autocomplete.php : Effectue la recherche dans la BDD pour la suggestion des champs -> Hardcodage de la colonne Ref3 qui stock l'Opération ligne 23
  - connect.php : fonction createCon qui renvoie un objet mysqli connecté à la bdd qui correspond au type (drone ou equipement)
     - Fonctionnement des correspondance des colonnes : deux tables de correspondances corres_drones et corres_equip qui stockent les noms des colonnes en clés, et le nom à afficher, s'il faut l'afficher, si elle est éditable, si elle est optionnelle et s'il faut l'exporter en valeur pour un colonne.
     - Fonction searchCol : renvoie un tableau de nom de colonnes qui correspondent aux critères (searchCol("# incidents", "name", $GLOBALS["corres_drones"])[0]; return the column name of # incidents for the drones db)
  - del-entries.php : Effectue la requête pour supprimer des actifs via leur N° de série dans la bdd -> Hardcodage de la colonne Reference ligne 29
  - edit-entry.php : Effectue la requête pour editer un actif dans la bdd -> Hardcodage de la clé primaire ID ligne 22
  - export.php : Récupère les données à exporter dans la bdd via les N° de série -> Hardcodage du nom N° Série ligne 32
  - fetch-actifs.php : Effectue la requête pour construire les tables html des drones et equipements.
  - fetch-edit.php : Créer les formulaires d'éditions d'actifs avec les champs préremplis -> Hardcodage de la clé primaire ID ligne 38
  - fetch-ops.php : Effectue la requête pour contruire la table html des opérations -> Hardcodage de la colonne Ref3 qui stock l'opération ligne 29 et 33
  - index.php : Fichier principal qui affiche l'outil, principalement en html  

## Fichiers Javascript :

  - printer.js : Fonctions qui sont utilisées pour l'impression des étiquettes avec l'imprimantes zebra
  - main.js : Gère le chargement de ala page et les comportements généraux (events, page de chargement, ...)
  - filters.js : Gère les filtres 
  - export.js : Gère l'export en XLS et CSV
  - forms.js : Gère la validation et soumission des formulaires
  - modals.js : Gère le fonctionnement des modals, notamement le comportement de l'ajout de N° de série   

  
# Ressources utiles :

  - Pour designer les étiquettes en ZPL : https://zpldesigner.com/ et https://en.wikipedia.org/wiki/Zebra_Programming_Language
  - Pour imprimer sur une imprimante Zebra : https://www.zebra.com/us/en/forms/browser-print-request-javascript.html
  - Pour l'auto-completion : https://jqueryui.com/autocomplete/
