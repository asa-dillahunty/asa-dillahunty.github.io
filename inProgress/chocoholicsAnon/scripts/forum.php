<html>
<body>

Welcome <?php echo $_POST["username"]; ?><br/>
Subject Line was: <?php echo $_POST["subjectLine"]; ?><br/>
And text was: <?php echo $_POST["qText"]; ?><br/>

<?php
    $filename = 'like.txt';
    file_put_contents($filename, $_POST["qText"]);
?>

</body>
</html>