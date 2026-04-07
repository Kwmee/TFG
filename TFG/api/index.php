<?php

// Vercel executes PHP from /api. Hand off to Laravel's public front controller.
require __DIR__ . '/../public/index.php';
