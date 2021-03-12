<?php

    header("Content-type: text/html; charset=utf-8");
    // $connection = mysqli_connect('localhost', 'khanhdo', 'Q8LnaQRS2EUff7F4PyAr', 'khanhdo');
    $connection = mysqli_connect('localhost', 'root', '', 'testgame');
    mysqli_set_charset($connection, 'UTF8');

    if(!$connection){
        echo 'Connection error: ' . mysqli_connect_error();
    }

    if($_SERVER["REQUEST_METHOD"]=="POST"){

        if(isset($_POST["userName"]) && isset($_POST["userAva"]) && isset($_POST["userScore"]) && isset($_POST["userBest"])){

            $user_name = $_POST["userName"];
            $user_ava = $_POST["userAva"];
            $user_score = $_POST["userScore"];
            $user_best = $_POST["userBest"];
    
            $sql = "INSERT INTO player_info (name,avatar,curr_score,best_score) VALUES ('$user_name','$user_ava','$user_score','$user_best')";
    
            $query_run = mysqli_query($connection,$sql);

        }

    }

    

?>