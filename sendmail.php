<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require './phpmailer/src/Exception.php';
require './phpmailer/src/PHPMailer.php';
require './phpmailer/src/SMTP.php';

//Load Composer's autoloader
// require 'vendor/autoload.php';

if (strcasecmp(trim($_POST['form-code']), 'custom') == 0) {
  try {
    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);
    //Server settings
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.timeweb.ru';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'noreply@ts-2022.ru';                     //SMTP username
    $mail->Password   = 'Z71vhe5B';                               //SMTP password
    $mail->SMTPSecure = 'ssl';            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    $mail->CharSet = 'UTF-8';
    //Recipients
    $mail->setFrom('noreply@ts-2022.ru', 'TS 2022');
    $mail->addAddress('suxscribe@gmail.com');     //Add a recipient
    $mail->addAddress('design@t-s.ru');     //Add a recipient
    $mail->addAddress('o.bochkina@t-s.ru');     //Add a recipient
    $mail->addAddress('kekis007@yandex.ru');     //Add a recipient

    //Attachments
    //$mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Конструктор Tosol-Sintez 2022. Заявка на календарь';

    $body = '<p>Телефон: ' . $_POST['form-phone'] . '</p>';
    $body .= '<p>Имя: ' . $_POST['form-name'] . '</p>';
    $body .= '<p>Компания: ' . $_POST['form-company'] . '</p>';
    $body .= '<p>Email: ' . $_POST['form-email'] . '</p>';
    $body .= '<p>Код: ' . $_POST['form-code'] . '</p>';
    $body .= '<p>Скриншот: ' . $_POST['form-screenshot'] . '</p>';
    //$mail->addAttachment($_POST['form-file']);
    $mail->Body    = $body;
    //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();

    // Email to client
    $mailClient = new PHPMailer(true);
    $mailClient->isSMTP();
    $mailClient->Host       = 'smtp.timeweb.ru';
    $mailClient->SMTPAuth   = true;
    $mailClient->Username   = 'noreply@ts-2022.ru';
    $mailClient->Password   = 'Z71vhe5B';
    $mailClient->SMTPSecure = 'ssl';
    $mailClient->Port       = 465;
    $mailClient->CharSet = 'UTF-8';
    //Recipients
    $mailClient->setFrom('noreply@ts-2022.ru', 'TS 2022');
    $clientEmail = trim($_POST['form-email']);
    $mailClient->addAddress($clientEmail);     //$_POST['form-email']

    $body = '<p>Добрый день, ' . $_POST['form-name'] . '!</p>';
    $body .= '<p>Календарь уже у нас! В ближайшее время мы свяжемся с Вами для уточнения деталей и вышлем печатную версию календаря.</p>';
    $body .= '<p>С наилучшими пожеланиями, команда «Тосол-Синтез»</p>';

    $mailClient->Body    = $body;
    $mailClient->send();

    // response message
    $message = 'Message sent';
  } catch (Exception $e) {
    $message = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
  }
} else {
  $message = "Message could not be sent. Code doesn't match";
}

$response = ['message' => $message];
header('Content-type: application/json');
echo json_encode($response);
