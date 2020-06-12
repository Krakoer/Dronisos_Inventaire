<?php

header('content-type: text/html; charset=UTF-8');
include("connect.php");

/*
Script del-entries.php
Trigger par delEntries() dans script.js
Inputs via POST :
    - serials qui est une liste de numéro de série à supprimer
*/

// Create connections
$conns = [createCon("drones"), createCon("equip")];

// Check connections
foreach ($conns as $conn) {
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
}

$serials = $_POST["serials"];
$sql = "";
$success = 0;

foreach ($serials as $serNb) {
    foreach ($conns as $conn) {
        $sql = "DELETE FROM t_produits WHERE Reference =\"" . $serNb . "\""; // Hardcodage de la colonne Reference qui contient les numéros de série
        if ($conn->query($sql) == TRUE) {
            $success += $conn->affected_rows;
        }
    }
}

echo $success." actifs supprimés.";

$conn->close();
