<?php
include_once "demo_namespace.php";

$obj = new mothernature\creature\Animal();
echo $obj->weight;

echo "<hr>";

$obj = new hobby\chess\Animal();
echo $obj->location;

echo "<hr>";

use hobby\chess\Animal;

$obj = new Animal();
var_dump($obj);

?>