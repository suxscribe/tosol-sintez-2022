<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        img {
            border: 1px solid gray;
        }
    </style>
</head>
<body>

<?php
if ($is_exists) {
?>
    <img src="<?= $filename ?>">
<?php } else { ?>

    <h1>Файл не существует</h1>

<?php } ?>

</body>
</html>