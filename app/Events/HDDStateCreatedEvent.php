<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class HDDStateCreatedEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $hostId;
    public $state;
    public $message;

    public function __construct($hostId, $state, $message)
    {
        $this->hostId = $hostId;
        $this->state = $state;
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel('hdd_states');
    }

    public function broadcastAs()
    {
        return 'hdd_state.created';
    }

    public function broadcastWith()
    {
        return [
            'hostId' => $this->hostId,
            'state' => $this->state,
            'message' => $this->message,
            'created_at' => now(),
        ];
    }
}
