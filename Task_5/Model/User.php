<?php
namespace Model;
use JsonSerializable;
class User implements JsonSerializable {
    private $username;
    private $firstName;
    private $lastName;
    private $coffee_tea;
    private $bio;
    private $layout;
    private $history = [];

    //Konstruktor
    public function __construct($username = null){
        $this->username = $username;
    }

    static public function fromJson($data){
        $user = new User();
        foreach ($data as $key => $value) {
            $user->{$key} = $value;
        }
        return $user;
    }

    //Getter_Setter
    public function getUsername(){
        return $this->username;
    }

    // firstName
    public function getFirstName()
    {
        return $this->firstName;
    }

    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    }

    // lastName
    public function getLastName()
    {
        return $this->lastName;
    }

    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    }

    // coffee_tea
    public function getCoffeeTea()
    {
        return $this->coffee_tea;
    }

    public function setCoffeeTea($coffeeTea)
    {
        $this->coffee_tea = $coffeeTea;
    }

    // bio
    public function getBio()
    {
        return $this->bio;
    }

    public function setBio($bio)
    {
        $this->bio = $bio;
    }

    // layout
    public function getLayout()
    {
        return $this->layout;
    }

    public function setLayout($layout){
        $this->layout = $layout;
    }

    // history
    public function getHistory(): array {
        return $this->history ?? [];
    }
    public function setHistory(array $history): void {
        $this->history = $history;
    }
    public function addHistoryEntry(string $timestamp): void {
        $this->history[] = $timestamp;
    }

    public function jsonSerialize(): mixed {
    return get_object_vars($this);
}
}
?>