<?php
require ("config.php");

$link = mysql_connect ( $dbhost, $dbuser, $dbpass ) or die ( mysql_error () );
$result = mysql_query ( "set names utf8", $link );
mysql_selectdb ( $dbname, $link );
$commandText = <<<SqlQuery
select teamID, name, win, lose, website, picture
   from Teams t
SqlQuery;

$result = mysql_query ( $commandText, $link );
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
    <?php while ($row = mysql_fetch_assoc($result)) : ?>
		<li>
		<a href="players.php?teamID=<?php echo $row["teamID"]?>"> 
			<img src="images/<?php echo $row["picture"]?>">
			<h3><?php echo $row["name"] ?></h3>
            <h4><?php echo $row["win"]." wins ".$row["lose"]." loses" ?> </h4>
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