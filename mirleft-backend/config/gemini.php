<?php

return [

    'api_key' => env('GEMINI_API_KEY'),

    'model' => env('GEMINI_MODEL', 'gemini-2.5-flash'),

    'timeout' => (int) env('GEMINI_TIMEOUT', 30),

    'context_limit' => (int) env('GEMINI_CONTEXT_LIMIT', 10),

];
