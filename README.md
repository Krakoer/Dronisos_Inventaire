# Dronisos_Inventaire
Outil d'inventaire/gestion de stock pour Dronisos

Descriptif des rôles des fichiers : 
  - add-entry.php : Effectue la requête pour ajouter un actif dans la BDD -> Hardcodage de la colonne 'Reference' qui stock le N° série ligne 34 et du nom "Opération" ligne 41
  - add-entry-form.php : Créer les formulaire d'ajout d'un actif en html 
  - add-ops : Effectue la requête pour affecter des actifs à une opération dans la BDD -> Hardcodage des noms de colonnes à partir de la ligne 15
  - autocomplete.php : Effectue la recherche dans la BDD pour la suggestion des champs -> Hardcodage de la colonne Ref3 qui stock l'Opération ligne 23
  - connect.php : fonction createCon qui renvoie un objet mysqli connecté à la bdd qui correspond au type (drone ou equipement)
     - Fonctionnement des correspondance des colonnes : deux tables de correspondances corres_drones et corres_equip qui stockent les noms des colonnes en clés, et le nom à afficher, s'il faut l'afficher, si elle est éditable, si elle est optionnelle et s'il faut l'exporter en valeur pour un colonne.
     - Fonction searchCol : renvoie un tableau de nom de colonnes qui correspondent aux critères (searchCol("# incidents", "name", $GLOBALS["corres_drones"])[0]; return the column name of # incidents for the drones db)
  - del-entries.php : Effectue la requête pour supprimer des actifs via leur N° de série dans la bdd -> Hardcodage de la colonne Reference ligne 29
  - edit-entry.php : Effectue la requête pour editer un actif dans la bdd -> Hardcodage de la clé primaire ID ligne 22
  - edit-entry-form.php : Construit les formulaires d'éditions d'actifs préremplis avce les valeurs dans la BDD
  
