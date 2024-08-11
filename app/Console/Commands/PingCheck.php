<?php
namespace App\Console\Commands;
use App\Models\Host;
use App\Models\Type;
use App\Models\Status;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;
use JJG\Ping;
use App\Events\StatusUpdatedEvent;
use Illuminate\Support\Facades\Broadcast;
use Carbon\Carbon;
use App\Notifications\DeviceOfflineNotification;
use Illuminate\Support\Facades\Notification;


class PingCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ping:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $start = Carbon::now();

        $devices = Status::with(['host', 'type'])->get();
    
    foreach ($devices as $device) {

        if ($device->type->type_name === 'PC' || $device->type->type_name === 'Server') {
        $ping = shell_exec('bash '.storage_path('app/public/ping.sh').' '.$device->host->ip_address);
        echo($ping);

        // Vérifier si le ping a réussi (latence non nulle)
        $statusValue = $ping == "1" ? 1 : 0;


        // Récupérer l'opérateur de comparaison depuis le champ "rules" de la table "statuses"
        $operator = $device->rules;//DB::table('statuses')->where('host_id', $host->id)->value('rules');

        // Récupérer la "reference_value" de la table "statuses" pour l'hôte actuel
        $referenceValue = $device->reference_value;//DB::table('statuses')->where('host_id', $host->id)->value('reference_value');

        // Construire la condition en utilisant l'opérateur de comparaison et les valeurs actuelles
        $condition = "\$result = (\$referenceValue $operator \$statusValue);";
        echo($referenceValue.' '.$operator.' '.$statusValue.' /n');
        // Utiliser eval pour évaluer la condition
        eval($condition);

        // Déterminer l'état en fonction du résultat de la condition
        $state = $result ? 'En ligne' : 'Hors ligne';
        echo($state.' /n');

         // Vérifier si l'état a changé
        if ($device->state !== $state) {
            // Mettre à jour le champ "state" seulement si l'état a changé
            $device->state = $state;
            $device->last_updated_at = now(); // Mettre à jour la date uniquement si l'état a changé
            $device->save();

        //Si l'état est maintenant "Hors ligne", envoyez la notification par e-mail
                    if ($state === 'Hors ligne') {
                        $user = User::where('email', 'erickrazafintsoa@gmail.com')->first();

                        $hostname = $device->host->hostname;
                        $owner = $device->host->owner;
                Notification::send($user, new DeviceOfflineNotification($hostname, $owner));
                    }

                
            // Émettre un événement pour signaler la mise à jour
            event(new StatusUpdatedEvent($device->host->id, $state));
        }
    }
    }

    $end = Carbon::now();
    $executionTime = $end->diffInSeconds($start);
    echo "Durée d'exécution : {$executionTime} secondes";
    $this->info('Ping effectué avec succès.');
    }
}
