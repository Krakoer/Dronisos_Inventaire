<?php

/*
Fichier add-entry-form.php
Trigger par index, dans me modal "add-entry"
Le scipt prend un type : drones ou equipement
Il fetch les colonnes modifiables et créé un formulaire html vide pour créer une nouvelle entrée
renvoie du html
*/

header('content-type: text/html; charset=UTF-8');

function createEntryForm($type)
{
    if ($type == "drones") {
        $corr = $GLOBALS["corres_drones"];
    } else {
        $corr = $GLOBALS["corres_equip"];
    }
    $cols = searchCol(true, "edit", $corr);

    echo "<label for=\"EntryLabelTypeSelector\">Type d'étiquette : </label>
    <select class=\"form-control\" id=\"EntryLabelTypeSelector\">
        <option value=\"zephyr\">Drone Zephyr</option>
        <option value=\"helios\">Drone Helios</option>
        <option value=\"materiel\">Materiel</option>
        <option value=\"bureautique\">Bureautique</option>
    </select><br>"; // For the Ajouter et imprimer button

    foreach ($cols as $col) {
        echo "<label for=\"" . $col . "-input\">" . $corr[$col]["name"] . "</label>";
        echo "<input id=\"" . $col . "-input-".$type."\" class=\"form-control autocomplete\" type=\"text\" name=\"" . $col . "\"";
        if($corr[$col]["opt"] == false){ // Si l'actif n'est pas optionnel
            echo " required onblur=\"checkIfEmpty(this)\"";
        }
        echo "></input>";
        echo "<br>";
    }
}
