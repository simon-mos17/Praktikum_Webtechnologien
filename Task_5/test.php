<?php
require("start.php");
$service = new Utils\BackendService(CHAT_SERVER_URL, CHAT_SERVER_ID);

var_dump($service->register("UserTestX", "Passwort123"));
var_dump($service->login("UserTestX", "Passwort123"));
var_dump($service->loadUser("UserTestX"));
var_dump($service->loadUsers());
var_dump($service->loadFriends());
var_dump($service->loadMessages("UserTestX"));
var_dump($service->sendMessage((object)["msg" => "Hallo", "to" => "UserTestX"]));
var_dump($service->getUnread());
?>