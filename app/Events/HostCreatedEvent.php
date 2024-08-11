<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class HostCreatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $host;

    public function __construct($host)
    {
        $this->host = $host;
    Log::info('HostCreatedEvent created with host:', [$host]);
    }

    public function broadcastOn()
    {
        return new Channel('hosts'); 
    }

    public function broadcastAs()
    {
        return 'host.created';
    }

    public function broadcastWith()
    {
        return [
            'host' => $this->host,
        ];
    }
}
