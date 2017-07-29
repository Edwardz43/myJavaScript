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

$sql = "SELECT *, 
		TRUNCATE((career.min / career.gp), 1) as mpg, 
		TRUNCATE((career.pts / career.gp), 1) as ppg, 
		TRUNCATE((career.reb / career.gp), 1) as rpg, 
		TRUNCATE((career.ast / career.gp), 1) as apg, 
		TRUNCATE((career.blk / career.gp), 1) as bpg 
		FROM players as p, career 
		WHERE p.playerID = career.playerID
			and career.year = 2016 
			and p.playerID = $id";
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
			<img src="http://<?php echo $row["picture"] ?>" class="player-pic" width="240" onerror="myFunction(this)">
			<div class="player-details">
				<h1><?php echo $row["firstname"] . " " . $row["lastname"] ?></h1>
				<h2><?php echo "Number : #".$row["number"] ?></h2>
				<h2><?php echo "Position : ".$row["pos"] ?></h2>
			</div>

			<ul data-role="listview" data-inset="true" class="action-list">
				<li><h4>Height</h4><p><?php echo $row["height"] ?></p></li>
				<li><h4>Weight</h4><p><?php echo $row["weight"]." lbs" ?></p></li>
				<li><h4>NBA Debut</h4><p><?php echo $row["debut"] ?></p></li>
				<li><h4>From</h4><p><?php echo $row["[from]"] ?></p></li>
				<li><h4>Birth Day</h4><p><?php echo $row["born"] ?></p></li>
				<li><h4>Age</h4><p><?php echo $row["age"] ?></p></li>
				<li>
					<a href="<?php echo $row["website"] ?>" target="_blank">Website</a>
				</li>
				<li>
					<a href="https://www.youtube.com/results?search_query=<?php echo $row["firstname"] .
					 "+" . $row["lastname"] ?>" target="_blank">Vedio Link
					</a>
				</li>

				<!-- Player Data -->
				<section class="nba-player-season-career-stats"><table data-role="table" data-mode="columntoggle" class="ui-responsive ui-shadow" >
				<thead><tr><th><span>2016 - 17</span></th><th data-priority="1" scope="col"><abbr title="Minutes Per Game">MPG</abbr></th><th  data-priority="2"><abbr title="Field Goal Percentage">FG%</abbr></th><th data-priority="6"><abbr title="Three Point Percentage">3P%</abbr></th><th data-priority="7"><abbr title="Free Throw Percentage">FT%</abbr></th><th data-priority="3"><abbr title="Points Per Game">PPG</abbr></th><th data-priority="4"><abbr title="Rebounds Per Game">RPG</abbr></th><th data-priority="5"><abbr title="Assists Per Game">APG</abbr></th><th data-priority="8"><abbr title="Blocks Per Game">BPG</abbr></th></tr></thead><tbody><tr><th scope="row">
				SEASON
				</th><td>
				<?php echo $row["mpg"] ?>
				</td><td>
				<?php echo $row["fg%"] ?>
				</td><td>
				<?php echo $row["3p%"] ?>
				</td><td>
				<?php echo $row["ft%"] ?>
				</td><td>
				<?php echo $row["ppg"] ?>
				</td><td>
				<?php echo $row["rpg"] ?>
				</td><td>
				<?php echo $row["apg"] ?>
				</td><td>
				<?php echo $row["bpg"] ?>
				</td></tr>
				</tbody></table></section>

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