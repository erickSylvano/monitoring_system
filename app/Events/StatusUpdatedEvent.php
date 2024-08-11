<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StatusUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $hostId;
    public $state;

    public function __construct($hostId, $state)
    {
        $this->hostId = $hostId;
        $this->state = $state;
    }

    public function broadcastOn()
    {
        return new Channel('statuses');
    }

    public function broadcastAs()
    {
        return 'status.updated';
    }

    public function broadcastWith()
{
    return [
        'hostId' => $this->hostId,
        'state' => $this->state,
        'updated_at' => now(),
    ];
}
}

