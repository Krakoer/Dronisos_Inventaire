<?php

header('content-type: text/html; charset=UTF-8');
include("connect.php");

/*
Script fetch-ops.php 
Créer la <table> html des opérations à l'aide de GROUPE BY et de COUNT
*/

function createOpsTab()
{
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
    $ops = [];

    $i = 0;
    foreach ($conns as $conn) {
        $sql = "SELECT Ref3, COUNT(ID) AS countID FROM t_produits GROUP BY Ref3"; // Hardcode de Ref3 qui contient l'Opération d'un actif
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $ops[$row["Ref3"]][$i] = $row["countID"];
            }
        }
        $i += 1;
    }

    echo "<table class=\"table table-striped\" id=\"table-data\">";
    echo "<thead><tr>";
    echo "<th>Operation</th>";
    echo "<th># Drones</th>";
    echo "<th># Equipements</th>";
    echo "<th>Total</th>";
    echo "</tr></thead><tbody>";
    foreach ($ops as $key => $val) {
        echo "<tr>";
        echo "<td>" . $key . "</td>";
        $nbDrones = 0;
        $nbEquip = 0;
        if ($val[0] != null) {
            $nbDrones = $val[0];
        }
        echo "<td> " . $nbDrones . " </td>";
        if ($val[1] != null) {
            $nbEquip = $val[1];
        }
        echo "<td>" . $nbEquip . "</td>";
        $tot = $nbEquip + $nbDrones;
        echo "<td> " . $tot . " </td>";
        echo "</tr>";
    }
    echo "</tbody></table>";
    foreach ($conns as $conn) {
        $conn->close();
    }
}
