<?php

header('content-type: text/html; charset=UTF-8');

/*
Script fetch-actifs.php
Créé les tables html des actifs et des équipements en fetchant la bdd
prend un type (drone ou equipememnt) et renvoie un <table> html
*/


function createTab($type)
{
    // Create connection
    $conn = createCon($type);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Fetching columns name
    if ($type == "drones") {
        $corr = $GLOBALS["corres_drones"];
    } else {
        $corr = $GLOBALS["corres_equip"];
    }

    $cols = searchCol(true, "aff", $corr); // Fetch cols to print

    $sql = "SELECT * FROM t_produits";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output table header
        echo "<table class=\"table table-striped overflow-auto customfont\" id=\"table-data\"><thead><tr>";

        //Echo the edit th
        echo "<th> Edit </th>";

        foreach ($cols as $col) {
            echo "<th>" . $corr[$col]["name"] . "</th>";
        }
        echo "</tr></thead><tbody>";
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";

            //echo the edit button
            echo "<td><button type=\"button\" style=\"padding: 0px; height:15px; width: 15px;\" class=\"btn\" data-toggle=\"modal\" data-target=\"#editEntryModal\" data-id=\"" . $row['ID'] . "\" data-type=\"" . $type . "\"><i class=\"fa fa-edit fa-fw\"></i></button></td>";

            foreach ($cols as $col) {
                echo "<td>" . $row[$col] . "</td>";
            }
            echo "</tr>";
        }
        echo "</tbody></table>";
    } else {
        echo "No results";
    }
    $conn->close();
}
