{"url":"http://www.google.com"}<?php


  $STDERR = fopen('/home/david/entradaJob.js', 'w');
  fwrite($STDERR, ":O".var_export($_POST, true));
  fclose($STDERR);