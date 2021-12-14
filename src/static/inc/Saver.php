<?php

class Saver
{

  private $config;

  public function __construct()
  {
    $this->config = require('config.php');
    $this->run();
  }

  function getVars()
  {
    $content = file_get_contents('php://input');
    return json_decode($content, true);
  }

  function getFilename($tm)
  {
    return $this->config['upload_dir'] . "image_{$tm}.png";
  }

  function saveImage($base64)
  {
    $data = str_replace('data:image/jpeg;base64,', '', $base64);
    $data = base64_decode($data);
    $res['tm'] = time();
    $res["name"] = $this->getFilename($res['tm']);
    file_put_contents($res["name"], $data);
    return $res;
  }

  function showImage($tm)
  {
    $tm = intval($tm);
    $filename = $this->getFilename($tm);
    $is_exists = file_exists($filename);
    include 'show.php';
  }

  function run()
  {
    $cmd = @$_REQUEST['c'];
    switch ($cmd) {
      case 'view':
        $image = @$_REQUEST['image'];
        $this->showImage($image);
        break;

      case 'save':
        $vars = $this->getVars();
        $res = $this->saveImage($vars['image']);
        echo json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        break;

      default:
        break;
    }
  }
}
