<?php

$data = "x123y456z789";

$test = preg_match("/\w\d{2}/", $data, $matches);
echo gettype($test), "<br>";
echo $matches[0], "<br>";
// var_dump($matches);

echo "<hr>";

$data = "x123y456z789";

$test = preg_match_all("/\w\d{2}/", $data, $matches);
var_dump($matches);

?>