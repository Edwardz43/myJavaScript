<?php

require ("config.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM team";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    // while($row = $result->fetch_assoc()) {

} else {
    echo "0 results";
}

?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NBA</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<script src="scripts/jquery-1.9.1.min.js"></script>
<script src="scripts/jquery.mobile-1.3.2.min.js"></script>
<link rel="stylesheet" href="scripts/jquery.mobile-1.3.2.min.css" />
<link rel="stylesheet" href="styles.css" />
</head>
<body>
<div data-role="page" data-theme="c">

<div data-role="header">
	<h1>Teams</h1>
</div>

<div data-role="content">
	<ul data-role="listview" data-filter="true">
   	<?php while ($row = $result->fetch_assoc()) : ?>
		<li>
		<a href="players.php?teamID=<?php echo $row["teamID"]?>"> 
			<img src="http://<?php echo $row["logo"]?>">
			<h2><?php echo $row["name"] ?></h2>
            <h4><?php echo $row["win"]." win ".$row["loss"]." loss" ?> </h4>
		</a>
		</li>
	<?php endwhile ?>	
	</ul>
</div>
<?php $conn->close(); ?>
</div>
</body>
</html>