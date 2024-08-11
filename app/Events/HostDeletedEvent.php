<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class HostDeletedEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $hostId;

    public function __construct($hostId)
    {
        $this->hostId = $hostId;
    }

    public function broadcastOn()
    {
        return new Channel('hosts');
    }

    public function broadcastAs()
    {
        return 'host.deleted';
    }

    public function broadcastWith()
    {
        return [
            'hostId' => $this->hostId,
        ];
    }
}