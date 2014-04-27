<?php

function pr($val) {
	echo "<pre>";
	print_r($val);
	echo "</pre>";
}

function JSON($array) {

	foreach ($array as $key => $value) {
		if(is_array($value)) {
			$array = JSON($value);
		} else {
			$array[$key] = urlencode($value);
		}
	}
	return $array;
}

function better_json_encode($array) {
	return urldecode(json_encode(JSON($array)));
}