<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "nba";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM `teams`";
$result = $conn->query($sql);
echo "<!DOCTYPE html>
<html class=\"ui-mobile\">
<head>
<meta charset=\"UTF-8\">
<title>NBA</title>
<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />
<script src=\"scripts/jquery-1.9.1.min.js\"></script>
<script src=\"scripts/jquery.mobile-1.3.2.min.js\"></script>
<link rel=\"stylesheet\" href=\"scripts/jquery.mobile-1.3.2.min.css\" />
<link rel=\"stylesheet\" href=\"styles.css\" />
</head>
<body>
<div data-role=\"page\" data-theme=\"c\">

<div data-role=\"header\">
    <h1>Teams</h1>
</div>
<div data-role=\"content\">
    <ul data-role=\"listview\" data-filter=\"true\">
    // output data of each row";

    while($row = $result->fetch_assoc()) {
        echo "<li><a href=\"players.php?teamID=\"";
        echo $row[\"teamID\"]?>\">";

        echo "<img src=\"images/<?php"; 
        echo $row["picture"]?>\">
            <h3>"<?php echo $row["name"] ?></h3>
            <h4><?php echo $row["win"]." wins ".$row["lose"]." loses" ?> </h4>
        </a>
        </li>";
    }
echo "</ul></div></div>";

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "name: " . $row["Name"]. " Win - Lose: " . $row["win"]. "-" . $row["lose"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();
?>