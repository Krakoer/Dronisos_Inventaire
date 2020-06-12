<?php

include("connect.php");

/*
Script export.php 
Inputs : 
    - 'ids' une liste de numéro de série à exporter
    - 'type' un type d'actif (drone ou equipement)
Renvoie un json qui contient les infos à exporter
*/

$type = $_POST["type"];
$ids = $_POST["ids"]; 
$export = []; // Array final à exporter
$names = []; // Nom à exporter

if ($type >= 0) { // On selectionne le bon type d'actif
    $conn = createCon("drones");
    $corr = $GLOBALS["corres_drones"];
} else {
    $conn = createCon("equip");
    $corr = $GLOBALS["corres_equip"];
}

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$serialCols = searchCol("N° Série", "name", $corr)[0]; // Colonne qui stock les N° de série
$cols = searchCol(true, "export", $corr); // Colonnes à exporter
$cols_sql = ""; // Morceau de la requete sql

foreach ($cols as $c) {
    $cols_sql .= $c . ", "; // Contruiction du morceau de la requête
    array_push($names, $corr[$c]["name"]); // On ajoute la ligne d'entête qui contient les noms 
}

$cols_sql = substr($cols_sql, 0, strlen($cols_sql) - 2);

array_push($export, $names);


foreach ($ids as $id) { // Pour chaque N° Série
    $sql = "SELECT " . $cols_sql . " FROM t_produits WHERE " . $serialCols . "=\"" . $id . "\""; // On fetch les colonnes à exporter
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data = []; // On crééer la ligne correspondante à l'actif
            foreach ($cols as $colmun) { // EN y ajoutant les données
                array_push($data, $row[$colmun]);
            }
            array_push($export, $data);
        }
    }
}

$conn->close();


echo json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
