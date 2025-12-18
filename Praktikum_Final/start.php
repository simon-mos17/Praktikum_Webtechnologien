<?php
spl_autoload_register(function ($class) {
    include str_replace('\\', '/', $class) . '.php';
});
session_start();
define('CHAT_SERVER_URL', 'https://online-lectures-cs.thi.de/chat/');
define('CHAT_SERVER_ID', '48547192-8625-4ffd-81af-9b853508594a'); # Ihre Collection ID

$service = new Utils\BackendService(CHAT_SERVER_URL, CHAT_SERVER_ID);
