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

$sql = "SELECT playerID, firstname, lastname, number, pos, picture, name
		FROM player as p JOIN team as t on p.teamID = t.teamID
		where p.teamID = $id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    // while($row = $result->fetch_assoc()) {

} else {
    echo "0 results";
}
$row = $result->fetch_assoc();
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
		<h1><?php echo $row["name"] ?></h1>
	</div>
	<div data-role="content">
		<ul data-role="listview" data-filter="true">
	    <?php $result = $conn->query($sql); while ($row = $result->fetch_assoc()) : ?>
			<li>
			<a href="./playerDetails.php?id=<?php echo $row["playerID"]?>" > 
				<img src="http://<?php echo $row["picture"]?>" onerror="myFunction(this)">
				<h2><?php echo $row["firstname"] . " " . $row["lastname"] ?></h2>
				<h4><?php echo "#".$row["number"]." , ".$row["pos"] ?> </h4>
			</a>
			</li>
	    <?php endwhile ?>
		</ul>
	</div>
	<div data-role="footer" data-position="fixed" style="text-align:center;">
	    <a href="index.php" data-icon="home">Home</a>
    </div>
</div>
<?php
mysql_free_result ( $result );
mysql_close ( $link );
?>
<script>
	var myFunction = function (e) {
		this.onerror=null;
		e.src = "http://i.cdn.turner.com/nba/nba/.element/img/2.0/sect/statscube/players/large/default_nba_headshot_v2.png";
	}
</script>
</body>
</html>