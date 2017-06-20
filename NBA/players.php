<?php
if (! isset ( $_GET ["teamID"] ))
	die ( "Parameter id not found." );
$id = $_GET ["teamID"];
if (! is_numeric ( $id ))
	die ( "id not a number." );


require ("config.php");
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM players where teamID = $id";
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
<title><?php  ?></title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<script src="scripts/jquery-1.9.1.min.js"></script>
<script src="scripts/jquery.mobile-1.3.2.min.js"></script>
<link rel="stylesheet" href="scripts/jquery.mobile-1.3.2.min.css" />
<link rel="stylesheet" href="styles.css" />
</head>
<body>
<div data-role="page" data-add-back-btn="true" data-theme="c">
	<div data-role="header">
		<h1>Players</h1>
	</div>
	<div data-role="content">
		<ul data-role="listview" data-filter="true">
	    <?php while ($row = $result->fetch_assoc()) : ?>
			<li>
			<a href="./playerDetails.php?id=<?php echo $row["playerID"]?>"> 
				<img src="images/<?php echo $row["picture"]?>">
				<h2><?php echo $row["firstname"] . " " . $row["lastname"] ?></h2>
				<h4><?php echo "#".$row["number"]." , ".$row["pos"] ?> </h4>
			</a>
			</li>
	    <?php endwhile ?>
		</ul>
	</div>
</div>
<?php
mysql_free_result ( $result );
mysql_close ( $link );
?>
</body>
</html>