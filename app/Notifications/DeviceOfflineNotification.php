<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeviceOfflineNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $hostname; // Propriété pour stocker le nom d'hôte
    public $owner;

    public function __construct($hostname, $owner)
    {
        $this->hostname = $hostname;
        $this->owner = $owner;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->error()
            ->subject("Deconnection d'un objet")
            ->greeting("Bonjour, L'objet ". $this->hostname . ' de '. $this->owner .' est hors ligne!')
            ->line('Cliquez ci dessous pour verifier les status des objets.')
            ->action('Vérifier les statuts', url('/monitoring/pc'))
            ->line("Merci d'utiliser notre application!");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
