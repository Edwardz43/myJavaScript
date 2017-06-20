<?php
if (! isset ( $_GET ["id"] ))
	die ( "Parameter id not found." );

$id = $_GET ["id"];
if (! is_numeric ( $id ))
	die ( "id not a number." );

require ("config.php");
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM players where playerID = $id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    // while($row = $result->fetch_assoc()) {

} else {
    echo "0 results";
}

$row = $result->fetch_assoc();
// var_dump($row);
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><?php echo $row["firstName"] . " " . $row["lastName"] ?></title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<script src="scripts/jquery-1.9.1.min.js"></script>
<script src="scripts/jquery.mobile-1.3.2.min.js"></script>
<link rel="stylesheet" href="scripts/jquery.mobile-1.3.2.min.css" />
<link rel="stylesheet" href="styles.css" />
</head>
<body>
    <div class="action-list"></div>
	<div data-role="page" data-add-back-btn="true" data-theme="c">
		<div data-role="header">
			<h1>Player Details</h1>
		</div>
		<div data-role="content">
			<img src="images/<?php echo $row["picture"] ?>" class="player-pic" width="240" />
			<div class="player-details">
				<h1><?php echo $row["firstname"] . " " . $row["lastname"] ?></h1>
				<h2><?php echo "Number : #".$row["number"] ?></h2>
				<h2><?php echo "Position : ".$row["pos"] ?></h2>
			</div>

			<ul data-role="listview" data-inset="true" class="action-list">
				<li><h4>Height</h4><p><?php echo $row["height"] ?></p></li>
				<li><h4>Weight</h4><p><?php echo $row["weight"]."lbs" ?></p></li>
				<li><h4>NBA Draft</h4><p><?php echo $row["debut"] ?></p></li>
				<li><h4>From</h4><p><?php echo $row["[from]"] ?></p></li>
				<li><h4>Birth Day</h4><p><?php echo $row["born"] ?></p></li>
				<li><h4>Age</h4><p><?php echo $row["age"] ?></p></li>
				<li>
					<a href="https://www.youtube.com/results?search_query=<?php echo $row["firstname"] .
					 "+" . $row["lastname"] ?>" target="_blank">Link
					</a>
				</li>
			</ul>
		</div>
	</div>
</body>
</html>