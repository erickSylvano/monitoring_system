<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DiskFullNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $hostname;

    public function __construct($hostname)
    {
        $this->hostname = $hostname;
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
            ->subject("Disque plein")
            ->line('Le disque de l\'hôte ' . $this->hostname . ' est presque plein ')
            ->line("Cliquez ci dessous pour verifier l'etat du disque.")
            ->action('Vérifier les statuts', url('/monitoring/hdd'))
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
