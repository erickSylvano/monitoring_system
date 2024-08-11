<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StatusCreatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $status;

    public function __construct($data)
    {
        $this->status = $data['status'];
    }

    public function broadcastOn()
    {
        return new Channel('statuses');
    }

    public function broadcastAs()
    {
        return 'status.created';
    }

    public function broadcastWith()
    {
        return ['status' => $this->status]; // Include any necessary data here
    }
}
