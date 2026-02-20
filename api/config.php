<?php
// Long-lived User Access Token (3-month token from Facebook)
// This is used to fetch a fresh Page Access Token via /me/accounts
$userAccessToken = 'EAASTZAQwZBERMBQZCetcdAZCXo5t42UKCmE5LwKGX1NtsEazsYlAuHYIqPcZCf0DmnVSVpZBRBCucMWXGY11aZAkZCTIDsLosKw6r7vZCsbi6gxZCl4paKnPDXdrL7dV3GF05lnqY12uxztLrY7DN4VaSV5WPmrdUf5S59MqfWDxHkdbhWNXdnZAqSKefBkjFnUets9JhwKFs1IVQi6Itk4Ekzr1XoBaulz1ttLaQZDZD';
$pageId = '256150811106152';

// Cache settings
$cacheDir = __DIR__ . '/cache';
$cacheFile = $cacheDir . '/photos.json';
$cacheDuration = 86400; // 24 hours in seconds
