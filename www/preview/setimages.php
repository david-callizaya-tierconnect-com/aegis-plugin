<?php

session_start();
$_SESSION['cr24_images']=$_REQUEST['data'];
var_dump($_SESSION['cr24_images'], $_REQUEST);

//window.open("http://10.100.0.207:8081/cr24/preview/index.html", "_blank");
?>

