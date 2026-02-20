<?php
require_once __DIR__ . '/config.php';

/**
 * Fetches a fresh Page Access Token using the long-lived User Access Token.
 * The Page Access Token obtained via /me/accounts with a long-lived user token
 * is itself a long-lived (never-expiring) page token.
 */
function getPageAccessToken(): ?string {
    global $userAccessToken, $pageId;

    $url = "https://graph.facebook.com/v19.0/me/accounts?"
        . http_build_query([
            'access_token' => $userAccessToken,
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

    if (!isset($data['data'])) {
        return null;
    }

    // Find the matching page and return its access token
    foreach ($data['data'] as $page) {
        if ($page['id'] === $pageId) {
            return $page['access_token'];
        }
    }

    return null;
}
