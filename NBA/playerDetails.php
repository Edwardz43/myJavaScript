<?php
if (! isset ( $_GET ["id"] ))
	die ( "Parameter id not found." );

$id = $_GET ["id"];
if (! is_numeric ( $id ))
	die ( "id not a number." );

require ("config.php");
$link = mysql_connect ( $dbhost, $dbuser, $dbpass ) or die ( mysql_error () );
$result = mysql_query ( "set names utf8", $link );
mysql_selectdb ( $dbname, $link );
$commandText = <<<SqlQuery
select playerID, number, pos, firstName, lastName, height, weight, born, debut, picture, website,`[from]`,teamID
  from Players
  where playerID = $id
SqlQuery;

$result = mysql_query ( $commandText, $link );
$row = mysql_fetch_assoc ( $result );
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
			<img src="images/<?php echo $row["picture"] ?>" class="employee-pic" width="100" />
			<div class="employee-details">
				<h3><?php echo $row["firstName"] . " " . $row["lastName"] ?></h3>
				<p><?php echo "#".$row["number"] ?></p>
				<p><?php echo $row["pos"] ?></p>
			</div>

			<ul data-role="listview" data-inset="true" class="action-list">
				<li><h4>NBA Draft</h4><p><?php echo $row["debut"] ?></p></li>
				<li><h4>Birth Day</h4><p><?php echo $row["born"] ?></p></li>
				<li><h4>From</h4><p><?php echo $row["[from]"] ?></p></li>
				<li><h4>Website</h4>
					<a href="<?php echo $row["website"] ?>" target="_blank">Click</a>
				</li>
			</ul>
		</div>
	</div>
</body>
</html>