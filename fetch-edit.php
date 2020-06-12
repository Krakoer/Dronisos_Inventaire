<?php

include("connect.php");

/*
Script fetch-edit.php 
Trigger par l'event onshow du modal d'édition d'actifs
Le script renvoie le formulaire d'étition prérempli pour l'actif voulu
Inputs :
    - 'id': id de l'actif à éditer
    - 'type' : type de l'actif (drone ou equipement)
*/

$id = $_GET["id"];
$type = $_GET['type'];

if ($type == "drones") {
    $corr = $GLOBALS["corres_drones"];
} else {
    $corr = $GLOBALS["corres_equip"];
}

$conn = createCon($type);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$cols = searchCol(true, "edit", $corr); // Colonnes éditables
$col_sql = "";

//Création de la string pour la requete sql
foreach ($cols as $c) {
    $col_sql .= $c . ", ";
}
$col_sql = substr($col_sql, 0, strlen($col_sql) - 2);

$sql = "SELECT " . $col_sql . " FROM t_produits WHERE ID=\"" . $id . "\"";
$result = $conn->query($sql);

$values = []; // On récupère le valeurs des champs à préremplir
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        foreach ($cols as $column) {
            $values[$column] = $row[$column];
        }
    }
}

foreach ($cols as $col) {
    echo "<label for=\"" . $col . "-edit\">" . $corr[$col]["name"] . "</label>";
    echo "<input id=\"" . $col . "-edit\" class=\"form-control autocomplete-edit\" type=\"text\" name=\"" . $col . "\" value=\"".$values[$col]."\"";
    if ($corr[$col]["opt"] == false) {
        echo " required onblur=\"checkIfEmpty(this)\"";
    }
    echo "></input>";
    echo "<br>";
}

echo "<input type=\"hidden\" name=\"id\" value=\"".$id."\">";
echo "<input type=\"hidden\" name=\"type\" value=\"".$type."\">";