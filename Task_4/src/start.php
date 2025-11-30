<?php
    spl_autoload_register(function($class) {
        include str_replace('\\', '/', $class) . '.php';
    });
    session_start();
    define('CHAT_SERVER_URL', 'https://online-lectures-cs.thi.de/chat/');
    define('CHAT_SERVER_ID', 'b8ef54a4-a8c3-4495-a86b-cf4b518e21e6'); # Ihre Collection ID
?>
