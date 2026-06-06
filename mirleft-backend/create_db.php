<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1', 'root', '5/5/2005');
    $pdo->exec('CREATE DATABASE IF NOT EXISTS mirleft_travel');
    echo 'Database created successfully';
} catch (PDOException $e) {
    echo 'Error: ' . $e->getMessage();
}
