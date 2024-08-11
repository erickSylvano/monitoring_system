<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DiskInfoUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $hostId;
    public $state;
    public $total;
    public $used;

    public function __construct($hostId, $state, $total, $used)
    {
        $this->hostId = $hostId;
        $this->state = $state;
        $this->total = $total;
        $this->used = $used;
    }

    public function broadcastOn()
    {
        return new Channel('diskinfo');
    }

    public function broadcastAs()
    {
        return 'diskinfo.updated';
    }
}
