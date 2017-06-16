<?php
if (! isset ( $_GET ["teamID"] ))
	die ( "Parameter id not found." );
$id = $_GET ["teamID"];
if (! is_numeric ( $id ))
	die ( "id not a number." );

require ("config.php");
$link = mysql_connect ( $dbhost, $dbuser, $dbpass ) or die ( mysql_error () );
$result = mysql_query ( "set names utf8", $link );
mysql_selectdb ( $dbname, $link );
$commandText = <<<SqlQuery
select playerID, number, pos, firstName, lastName, height, weight, born, debut, picture, website,`[from]`,teamID
  from Players
  where teamID = $id
SqlQuery;

$result = mysql_query ( $commandText, $link );
$row = mysql_fetch_assoc ( $result );
// var_dump($row);
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Players</title>
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
	    <?php while ($row = mysql_fetch_assoc($result)) : ?>
			<li>
			<a href="playerDetails.php?id=<?php echo $row["playerID"]?>"> 
				<img src="images/<?php echo $row["picture"]?>">
				<h4><?php echo $row["firstName"] . " " . $row["lastName"] ?></h4>
				<p><?php echo "#".$row["number"]." , ".$row["pos"] ?> </p>
	            <p><?php echo $row["height"]."cm,".$row["weight"]."kg" ?> </p>
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