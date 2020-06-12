<?php

header('content-type: text/html; charset=UTF-8');
include("connect.php");

/*
Script add-ops.php
Trigger par addOpsButton() dans script.js
Inputs via POST : 
    - 'operation' : String qui décrit le nom de l'opération
    - 'serials' : tableau qui contient les id des actifs à ajouter à l'opération
*/

// Create connections
$conns = [createCon("drones"), createCon("equip")];
$corrs = [$GLOBALS["corres_drones"], $GLOBALS["corres_equip"]];
$serialCols = [searchCol("N° Série", "name", $corrs[0])[0], searchCol("N° Série", "name", $corrs[1])[0]];
$operationCols = [searchCol("Opération", "name", $corrs[0])[0], searchCol("Opération", "name", $corrs[1])[0]];
$incidentsCols = [searchCol("# incidents", "name", $corrs[0])[0], searchCol("# incidents", "name", $corrs[1])[0]];

// Check connections
foreach ($conns as $conn) {
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
}

$operation = $_POST["operation"];
$serials = $_POST["serials"];
$sql = "";
$success = 0;

foreach ($serials as $serNb) {
    $i = 0;
    foreach ($conns as $conn) {
        $sql = "UPDATE t_produits SET " . $operationCols[$i] . "=\"" . $operation . "\" WHERE " . $serialCols[$i] . " =\"" . $serNb . "\"";
        //$sql = "UPDATE t_produits SET ".$operationCols[$i]." =\"ARABIE SAOUDITE\" WHERE  Reference=\"PS726003AH7I136646\"";
        if ($conn->query($sql) == true) {
            $success += $conn->affected_rows;

            if ($conn->affected_rows > 0 && $operation == "MAINTENANCE") {
                //$sql = "UPDATE t_produits SET " . $incidentsCols[$i] . "=" . $incidentsCols[$i] . "+1 WHERE " . $serialCols[$i] . "=\"" . $serNb . "\"";
                $sql = "UPDATE t_produits SET " . $incidentsCols[$i] . "=" . $incidentsCols[$i] . "+1 WHERE " . $serialCols[$i] . "=\"" . $serNb . "\"";
                mysqli_query($conn, $sql);
            }
        }
        $i+=1;
    }
}

echo $success." opération(s) éditée(s).";

foreach ($conns as $conn) {
    $conn->close();
}
