<?php
// This is a simple notification handler
// In a real application, you would use a proper database

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Get action
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';
$timestamp = $_GET['timestamp'] ?? time();

// Write to notification file
$data = [
    'action' => $action,
    'id' => $id,
    'timestamp' => $timestamp,
    'ip' => $_SERVER['REMOTE_ADDR']
];

// Just write to a file for debugging
file_put_contents('notifications.txt', json_encode($data) . "\n", FILE_APPEND);

// Return success
echo json_encode(['status' => 'success']);
?> 