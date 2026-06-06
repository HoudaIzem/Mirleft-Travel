<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

trait ClearsHomeCache
{
    protected function clearHomeCache(): void
    {
        Cache::forget('home_payload');
    }
}
