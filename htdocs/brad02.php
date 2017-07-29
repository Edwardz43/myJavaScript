<?php
    if (isset($_FILES['upload'])){
        $upload = $_FILES['upload'];
        echo $upload['error'];
        if ($upload['error'] == 0){
            copy($upload['tmp_name'], "upload/{$upload['name']}");
        }
    }
?>