<?php
// +---------------------------------------------------------------------------
// +  Datei: proxy.php      UTF-8
// +  AutorIn:  Lukas Bisdorf
// +  Beschreibung: Wraps the nodes.json to work around the CORS problem+
// +  with ajax requests.
// +  KorrektorIn: Tom Herbers
// +  Status:
// +  Revision: 2019-11-30
// +---------------------------------------------------------------------------

function get_url_contents($url) {
    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, 1); 
    curl_setopt($crl, CURLOPT_CONNECTTIMEOUT, 5);   // seconds before timeout
    $ret = curl_exec($crl);
    curl_close($crl);
    return $ret;
}
$file = get_url_contents("https://map.ffrn.de/data/meshviewer.json");
header('Content-Type: application/json');
echo $file;

?>