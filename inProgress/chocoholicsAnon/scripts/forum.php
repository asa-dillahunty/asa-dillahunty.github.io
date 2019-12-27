<html>
<body>

Welcome <?php echo $_POST['username']; ?><br/>
Subject Line was: <?php echo $_POST['subjectLine']; ?><br/>
And text was: <?php echo $_POST['qText']; ?><br/>

<?php
	$filename='../forum.html';

	// I'm not sure if I need the first three replace
    // but I'll just be safe
    // Should I look for {$} ??
    // potentially they could inclue {$_POST['subjectLine']} or something??
    // would that do anything??
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

    // give each post a unique, random id number
    // users have the potential to steal all numbers, but because I 
    // included '<' I should be covered, right?
    $genID = rand(1, 100000);
    $genIDstr = '<div id="{$genID}"';
    while (strpos($fullbody, $genIDstr) !== false) {
        $genID = rand(1, 100000);
        $genIDstr = '<div id="{$genID}"';
    }

    $looking = '<div id="insertNewPostsHere" style="display:hidden;"></div>';
    $replayce = '<div id="' . $genID . '" class="postContainer">\n';
    
    //Should I include the tabs?
	$replayce = $replayce . '<h3 class="username">' . $username . '</h3>\n';
	$replayce = $replayce . '<h3 class="subjectLine">' . $subjectLine . '</h3>\n';
    $replayce = $replayce . '<p class="qText">' . $qText . '</p>\n\n';
    $replayce = $replayce . '<form action="scripts/deleteForumPost.php" method="POST">\n';
    $replayce = $replayce . '<input type="number" value="' . $genID . '" name="forumQID" style="display:hidden;"/>\n';
    $replayce = $replayce . '<input type="submit"/>\n';
    $replayce = $replayce . '</form>\n';
    $replayce = $replayce . '</div>\n\n';

	$replayce = $replayce . $looking;

	$fullbody = str_replace($looking,$replayce,$fullbody);

	$myfile = fopen($filename,'w') or die("unable to write to file\n");
	fwrite($myfile,$fullbody);
	fclose($myfile);
?>

<a href='../forum.html'>Go Back</a>

</body>
</html>
