<?php

include("connect.php");

/*
Scipt autocomplete.php
Trigger par JQuery UI et son module autocomplete (cf loadpage() dans script.php)
Fait le requêtes pour l'autocompletion : 
Inpus via POST :
    - 'term' : String qui contient le terme de recherche
    - 'id' : String qui contient l'id du champs de recherche : soit de la forme "Nomdelacolonne-input-type ou Nomdelacolonne-edit-type, ou operationName et dans ce cas c'est une Opération
Output :
    - un json qui est en fait un tableau contenant les résultats de la recherche
*/

$term = $_POST['term'];
$id = $_POST['id'];

if (strchr($id, "-")) {
    $colName = strtok($id, "-");
}
else {
    $colName = "Ref3";
}


// Create connections
$conns = [createCon("drones"), createCon("equip")];

// Check connections
foreach ($conns as $conn) {
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
}

// Fetching columns name
$sql = "";
$ops = array();

foreach ($conns as $conn) {
    $sql = "SELECT " . $colName . " FROM t_produits WHERE " . $colName . " LIKE '%" . $term . "%' GROUP BY " . $colName . " LIMIT 3";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            if (!in_array($row[$colName], $ops) && !is_null($row[$colName]))
                array_push($ops, $row[$colName]);
        }
    }
}

foreach ($conns as $con) {
    $conn->close();
}

echo json_encode($ops);
