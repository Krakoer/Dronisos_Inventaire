<?php

include("connect.php");

$id = $_POST["id"];
$type = $_POST["entry"];
$inputs = $_POST["data"];

$conn = createCon($type);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql_needle = "";

foreach($inputs as $field => $value){
    $sql_needle.=$field."=\"".$value."\", ";
}
$sql_needle = substr($sql_needle, 0, strlen($sql_needle) - 2);

$sql = "UPDATE t_produits SET " . $sql_needle ." WHERE ID =\"" . $id . "\"";

if ($conn->query($sql) === TRUE) {
    echo "Actif édité avec succès";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}