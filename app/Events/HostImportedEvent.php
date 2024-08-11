<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class HostImportedEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $host;

    public function __construct($host)
    {
        $this->host = $host;
    }

    public function broadcastOn()
    {
        return new Channel('hosts');
    }

    public function broadcastAs()
    {
        return 'host.imported';
    }

    public function broadcastWith()
    {
        return [
            'host' => $this->host,
        ];
    }
}