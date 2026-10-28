<?php
$path = $_GET['pathName'] ?? '';
$resolved = dirname(__DIR__) . '/' . $path;
var_dump($path);
echo "<br>";
var_dump($resolved);
echo "<br>";
var_dump(file_exists($resolved));
echo "<br>";
var_dump(is_file($resolved));
