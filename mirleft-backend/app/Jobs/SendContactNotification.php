<?php

namespace App\Jobs;

use App\Models\Contact;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendContactNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Contact $contact) {}

    public function handle(): void
    {
        Log::info('Contact message received', [
            'id' => $this->contact->id,
            'email' => $this->contact->email,
            'subject' => $this->contact->subject,
        ]);
    }
}
