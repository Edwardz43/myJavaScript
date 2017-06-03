<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Lab</title>
<?php require("script_css.php") ?>
</head>
<body>
	<div id="labPage" data-role="page" data-theme="d">
		<?php include("header.php"); ?>
		<div data-role="content">
			<h3>Hello! <?php echo $_COOKIE["userName"]; ?> </h3>
			<ol data-role="listview" data-inset="true">
				<li data-role="list-divider">Lab說明（安裝與設定詳情請參照 _LabSteps_setup.txt 的說明）</li>
				<li>請留意是否已修改二號workspace的badPage.php，圖片網址指向主要Workspace</li>
				<li>點按 Login登入系統</li>
				<li>請確認二號Workspace的Apache正常執行</li>
				<li>執行「間接」轉帳程序<br>https://lab2-ed43.c9users.io/Security/CSRF/badPage.php<br>
				網址請改成「你的二號workspace-帳號」
				</li>
				<li>檢視 CSRF 資料夾 tranferLog.txt 轉帳記錄</li>
			</ol>
		</div>

	</div>
	<!-- page -->

</body>
</html>
