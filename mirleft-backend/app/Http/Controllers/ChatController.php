<?php

namespace App\Http\Controllers;

use App\Services\GeminiChatService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct(
        private readonly GeminiChatService $geminiChat
    ) {}

    public function chat(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array',
            'history.*.role' => 'nullable|string|in:user,assistant,system',
            'history.*.content' => 'nullable|string|max:2000',
            'lang' => 'nullable|string|max:10',
        ]);

        $message = $validated['message'];
        $history = $validated['history'] ?? [];
        $lang = $validated['lang'] ?? null;

        $result = $this->geminiChat->reply($message, $history, $lang);

        return response()->json([
            'reply' => $result['reply'],
            'mode' => $result['mode'],
        ]);
    }
}
