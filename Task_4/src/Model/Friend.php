<?php
namespace Model;
use JsonSerializable;
class Friend implements JsonSerializable {
    private $username;
    private $status;

    public function __construct($username = null, $status = null){
        $this->username = $username;
        $this->status = $status;
    }

    static public function fromJson($data){
        $friend = new Friend();
        foreach ($data as $key => $value) {
            $friend->{$key} = $value;
        }
        return $friend;
    }

    public function getUsername(){
        return $this->username;
    }

    public function getStatus(){
        return $this->status;
    }

    public function setStatus($status){
        $this->status = $status;
    }

    public function jsonSerialize(): mixed {
    return get_object_vars($this);
    }

    public function accept(){
        $this->status = "accept";
    }

    public function dismiss(){
        $this->status = "dismiss";
    }
}
?>