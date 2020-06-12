<?php

/*
Script connect.php
Fichier qui créé les connexions aux BDD
*/

//Prend un type (drone ou equipement)
//Renvoie un objet mysqli
function createCon($base)
{
    if (strpos($base, "equip") !== false) {
        $servername = "hwinventaire-db-test.mysql.database.azure.com";
        $username = "dronisos@hwinventaire-db-test";
        $password = "BTqrew42dK3x3uMr";
        $dbname = "gsm02";
    }
    else if (strpos($base, "drone") !== false){
        $servername = "inventaire-db-test2.mysql.database.azure.com";
        $username = "dronisos@inventaire-db-test2";
        $password = "BTqrew42dK3x3uMr";
        $dbname = "gsm02";
    }

    $conn = mysqli_init();
    mysqli_ssl_set($conn, NULL, NULL, "BaltimoreCyberTrustRoot.crt.pem", NULL, NULL);
    mysqli_real_connect($conn, $servername, $username, $password, $dbname, 3306, MYSQLI_CLIENT_SSL);
    if (mysqli_connect_errno($conn)) {
        die('Failed to connect to MySQL: ' . mysqli_connect_error());
    }

    return $conn;
}


//Variable qui fait les correspondances entre colonnes dans la bdd et : le nom à afficher ("name"), si la colonne est modifiable ("edit") (si oui si elle est optionnelle ("opt")), affichable ("aff") et exportable ("export")
//On y accède via $GLOBALS 
$corres_equip = [
    "ID" => ["aff" => false, "name" => "ID", "edit" => false, "opt" => true, 'export' => false],
    "Famille" => ["aff" => true, "name" => "Objet", "edit" => true, "opt" => false, 'export' => true],
    "Reference" => ["aff" => true, "name" => "N° Série", "edit" => true, "opt" => false, 'export' => true],
    "Ref2" => ["aff" => true, "name" => "ID Dronisos", "edit" => true, "opt" => false, 'export' => true],
    "Ref3" => ["aff" => true, "name" => "Opération", "edit" => false, "opt" => false, 'export' => false],
    "Ref4" => ["aff" => true, "name" => "Modèle", "edit" => true, "opt" => false, 'export' => true],
    "Ref5" => ["aff" => false, "name" => "Date de mise en service", "edit" => true, "opt" => false, 'export' => true],
    "Ref6" => ["aff" => false, "name" => "Poids (g)", "edit" => true, "opt" => true, 'export' => true],
    "Designation" => ["aff" => false, "name" => "Pays d'origine", "edit" => true, "opt" => false, 'export' => true],
    "Fournisseur" => ["aff" => true, "name" => "# incidents", "edit" => false, "opt" => true, 'export' => true],
    "PUA" => ["aff" => false, "name" => "Valeur (€)", "edit" => true, "opt" => false, 'export' => true],
    "Emplacement" => ["aff" => false, "name" => "Emplacement", "edit" => true, "opt" => true, 'export' => true],
    "Propriete" => ["aff" => false, "name" => "Commentaire", "edit" => true, "opt" => true, 'export' => true],
];

$corres_drones = [
    "ID" => ["aff" => false, "name" => "ID", "edit" => false, "opt" => true, 'export' => false],
    "Famille" => ["aff" => true, "name" => "Modèle", "edit" => true, "opt" => false, 'export' => true],
    "Reference" => ["aff" => true, "name" => "N° Série", "edit" => true, "opt" => false, 'export' => true],
    "Ref2" => ["aff" => true, "name" => "Hardware", "edit" => true, "opt" => false, 'export' => true],
    "Ref3" => ["aff" => true, "name" => "Opération", "edit" => false, "opt" => false, 'export' => false],
    "Ref4" => ["aff" => false, "name" => "Date de mise en service", "edit" => true, "opt" => false, 'export' => true],
    "Ref5" => ["aff" => true, "name" => "# vols", "edit" => true, "opt" => true, 'export' => true],
    "Ref6" => ["aff" => true, "name" => "# incidents", "edit" => false, "opt" => true, 'export' => true],
    "Designation" => ["aff" => false, "name" => "Poids (g)", "edit" => true, "opt" => true, 'export' => true],
    "Fournisseur" => ["aff" => false, "name" => "Pays d'origine", "edit" => true, "opt" => false, 'export' => true],
    "PUA" => ["aff" => false, "name" => "Valeur (€)", "edit" => true, "opt" => false, 'export' => true],
    "Propriete" => ["aff" => false, "name" => "Commentaire", "edit" => true, "opt" => true, 'export' => true],
];

// return the array of all primary keys (i.e. column name when using with corres vars) where col[Primarykey][key] == needle
// ex : echo searchCol("# incidents", "name", $GLOBALS["corres_drones"])[0]; return the column name of # incidents for the drones db
function searchCol($needle, $key, $arr){
    $cols = [];
    foreach($arr as $col => $table){
        if($table[$key] == $needle){
            array_push($cols, $col);
        }
    }
    return $cols;
}