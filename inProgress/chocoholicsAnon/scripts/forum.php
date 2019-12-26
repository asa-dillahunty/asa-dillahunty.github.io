<html>
<body>

Welcome <?php echo $_POST["username"]; ?><br/>
Subject Line was: <?php echo $_POST["subjectLine"]; ?><br/>
And text was: <?php echo $_POST["qText"]; ?><br/>

<?php
	$filename='../forum.html';

	//I'm not sure if I need the first three replace
	//but I'll just be safe
	$username = str_replace('\\','\\\\',$_POST['username']);
	$username = str_replace('\"','\\\"',$username);
	$username = str_replace('\'','\\\'',$username);
	$username = str_replace('<','&lt',$username);
	$username = str_replace('>','&gt',$username);

	$subjectLine = str_replace('\\','\\\\',$_POST['subjectLine']);
	$subjectLine = str_replace('\"','\\\"',$subjectLine);
	$subjectLine = str_replace('\'','\\\'',$subjectLine);
	$subjectLine = str_replace('<','&lt',$subjectLine);
	$subjectLine = str_replace('>','&gt',$subjectLine);

	$qText = str_replace('\\','\\\\',$_POST['qText']);
	$qText = str_replace('\"','\\\"',$qText);
	$qText = str_replace('\'','\\\'',$qText);
	$qText = str_replace('<','&lt',$qText);
	$qText = str_replace('>','&gt',$qText);

	echo 'new username: ';
	echo $username;
	// a is for append, write is to overwrite
	$myfile = fopen($filename,"r") or die("unable to read file\n");

	$fullbody = '';
	while (!feof($myfile)) {
		$fullbody = $fullbody . fgets($myfile);
	}	
	fclose($myfile);

	$looking = "<div id='insertNewPostsHere' style='display:hidden;'></div>";
	$replayce = '<h3 class="username">' . $username . '</h3>\n';
	$replayce = $replayce . '<h3 class="subjectLine">' . $subjectLine . '</h3>\n';
	$replayce = $replayce . '<p class="qText">' . $qText . '</p>\n\n';
	$replayce = $replayce . $looking;

	$fullbody = str_replace($looking,$replayce,$fullbody);

	$myfile = fopen($filename,'w') or die("unable to write to file\n");
	fwrite($myfile,$fullbody);
	fclose($myfile);
?>

</body>
</html>
