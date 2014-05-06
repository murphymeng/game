<?php
require 'vendor/autoload.php';
require 'vendor/redbean/rb.php';
require 'common.php';
header("Content-type: text/html; charset=utf-8");
session_start();
// set up database connection
R::setup('mysql:host=localhost;dbname=game','root','');
R::freeze(true);


$app = new \Slim\Slim(array(
    'debug' => true
));


$app->get('/', function() use ($app) {
    $app->redirect('./home');
});

$app->get('/home', function () use ($app) {

    $app->contentType('text/html; charset=utf-8');
    if (isset($_SESSION['uid']) && $_SESSION['uid']) {
        $user = R::getRow("select * from users where id={$_SESSION['uid']}");
        $users = R::getAll("select * from users where id != {$_SESSION['uid']}");
        $app->render('home.html', array('users'=>$users, 'user'=>$user));
        
    } else {
        $app->redirect('./login');
    }
});

$app->get('/fight', function() use ($app) {
    $fromUid = $app->request()->params('fromUid');
    $toUid = $app->request()->params('toUid');
    $user = R::getRow("select * from users where id={$_SESSION['uid']}");

    $user2 = array();
    if ($fromUid == $user['id']) {
        $user2 = R::getRow("select * from users where id={$toUid}");
    } else if ($toUid == $user['id']) {
        $user2 = R::getRow("select * from users where id={$fromUid}");
    }
    $app->render('fight.html', array('me'=>$user,
                                     'enemy'=>$user2,
                                     'firstPlayId'=>$toUid));
});

$app->get('/set', function() use ($app) {
    $cards = R::getAll("select * from cards");
    $app->render('set.html', array('cards'=>$cards));
});

$app->get('/login', function() use ($app) {
    $app->render('login.html');
});

$app->post('/login', function() use ($app) {
    $username = $app->request()->params('username');
    $password = $app->request()->params('password');
    $user = R::findOne('users',"username='{$username}' and password='{$password}'");
    if($user) {
        $_SESSION['uid'] = $user->id; 
        $app->redirect('./home');
    } else {
        $app->render('login.html');
    }
});

$app->get('/cards', function() use ($app) {
    $uid = $app->request()->params('uid');
    if (!$uid) {
        $uid = $_SESSION['uid'];
    }
    $cards = R::getAll("select * from cards, user_card
                                where cards.id = user_card.cid
                                  and user_card.uid = {$uid}");
    echo json_encode($cards);
    // echo better_json_encode($cards);
});

$app->get('/test', function() use ($app) {
	echo 'aa';
});



$app->run();