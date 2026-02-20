<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/authenticate.php';

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 9;
$limit = max(1, min($limit, 50));

// Check if cached data exists and is still fresh (< 24 hours)
if (file_exists($cacheFile)) {
    $cacheAge = time() - filemtime($cacheFile);
    if ($cacheAge < $cacheDuration) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        echo json_encode(array_slice($cached, 0, $limit));
        exit;
    }
}

// Cache expired or doesn't exist — fetch fresh data
$pageToken = getPageAccessToken();

if (!$pageToken) {
    // If authentication fails, serve stale cache if available
    if (file_exists($cacheFile)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        echo json_encode(array_slice($cached, 0, $limit));
        exit;
    }
    http_response_code(500);
    echo json_encode(['error' => 'Failed to authenticate with Facebook']);
    exit;
}

// Fetch posts from Facebook
$apiUrl = "https://graph.facebook.com/v19.0/{$pageId}/posts?"
    . http_build_query([
        'fields' => 'id,message,full_picture,attachments{media_type}',
        'limit' => $limit * 3,
        'access_token' => $pageToken,
    ]);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error || $httpCode !== 200) {
    // On failure, serve stale cache if available
    if (file_exists($cacheFile)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        echo json_encode(array_slice($cached, 0, $limit));
        exit;
    }
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch from Facebook API']);
    exit;
}

$data = json_decode($response, true);

if (!isset($data['data'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Unexpected response format']);
    exit;
}

// Filter posts with photos only (no videos)
$photos = [];
foreach ($data['data'] as $item) {
    $mediaType = $item['attachments']['data'][0]['media_type'] ?? '';
    if (!empty($item['full_picture']) && $mediaType !== 'video') {
        $photos[] = [
            'id' => $item['id'],
            'src' => $item['full_picture'],
            'alt' => $item['message'] ?? 'Facebook photo',
        ];
        if (count($photos) >= $limit) {
            break;
        }
    }
}

// Save response to cache
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}
file_put_contents($cacheFile, json_encode($photos));

echo json_encode(array_slice($photos, 0, $limit));
