<?php
require_once __DIR__ . '/config.php';

/**
 * Returns an App Access Token using client credentials.
 * This token never expires and can be used to fetch public page posts.
 */
function getAccessToken(): ?string {
    global $appId, $appSecret;

    $url = "https://graph.facebook.com/oauth/access_token?"
        . http_build_query([
            'client_id' => $appId,
            'client_secret' => $appSecret,
            'grant_type' => 'client_credentials',
        ]);

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        return null;
    }

    $data = json_decode($response, true);
    return $data['access_token'] ?? null;
}
