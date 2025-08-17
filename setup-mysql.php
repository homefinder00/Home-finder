<?php
/**
 * MySQL Database Setup Script
 * This script creates the uganda_housing database if it doesn't exist
 */

$host = '127.0.0.1';
$port = '3306';
$username = 'root';
$password = ''; // Update this with your MySQL root password

echo "Setting up MySQL database for Uganda Housing App...\n";

try {
    // Connect to MySQL server (without specifying database)
    $dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "✓ Connected to MySQL server\n";
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS uganda_housing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✓ Database 'uganda_housing' created or already exists\n";
    
    // Check if we can connect to the new database
    $dsn = "mysql:host={$host};port={$port};dbname=uganda_housing;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "✓ Successfully connected to uganda_housing database\n";
    echo "\nDatabase setup complete!\n";
    echo "You can now run: php artisan migrate\n";
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "\nPossible solutions:\n";
    echo "1. Make sure MySQL is running\n";
    echo "2. Check your MySQL credentials in this script\n";
    echo "3. Ensure MySQL is installed on your system\n";
    echo "4. Update the password in this script if needed\n";
    exit(1);
}
