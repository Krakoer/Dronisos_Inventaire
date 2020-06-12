<?php
header('content-type: text/html; charset=UTF-8');
include("connect.php");

/*
Fichier add-entry.php
Trigger par la fonction addEntryButton() dans script.js
Inputs via POST : 
    - 'entry' qui décrit le type d'entrée (drone ou équipement)
    - 'data' est un tableau associatif qui décrit chaque colonne est sa valeur
*/

$data = $_POST["data"];

if ($_POST["entry"] == "drone") {
    $type = "drones";
    $corr = $GLOBALS["corres_drones"];
} elseif ($_POST["entry"] == "equipement") {
    $type = "equip";
    $corr = $GLOBALS["corres_equip"];
} else {
    die("Wrong Entry Type");
}


// Create connection
$conn = createCon($type);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//Check s'il exist un actif avec le même numéro de série :
$exists = $conn->query("SELECT COUNT(1) FROM t_produits WHERE Reference = \"".$_POST["Reference"]."\"");
$num = $exists->fetch_all()[0][0];
if($num == 1){
    die("Le numéro de série est déja inscrit dans la base");
}

$sql = "INSERT INTO t_produits ";
$cols = "(".searchCol("Opération", "name", $corr)[0].", ";
$vals = "('STOCK', ";

foreach ($data as $col => $value) { // Pour chaque colonne
    if ($col != NULL && $col != "undefined" && $value != "") { // SI c'est bien défini
        $cols .= $col . ", "; // On récupère le nom de la colone qui correspond
        $vals .= "\"" . $value . "\", "; // On ajoute sa valeur
    }
}
$cols = substr($cols, 0, strlen($cols) - 2); // Enlève le dernier ', '
$vals = substr($vals, 0, strlen($vals) - 2);

$cols .= ")";
$vals .= ")";

$sql .= $cols . " VALUES " . $vals;

if ($conn->query($sql) === TRUE) {
    echo "Entrée ajoutée avec succès !";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
