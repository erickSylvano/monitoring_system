<?php

namespace App\Http\Controllers;

use App\Models\Host;
use App\Models\Type;
use App\Models\Status;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\HostUpdateRequest;
use App\Http\Requests\StoreHostRequest;
use App\Events\HostCreatedEvent;
use App\Events\HostUpdatedEvent;
use App\Events\HostDeletedEvent;
use App\Events\HostImportedEvent;
use App\Events\DiskInfoUpdatedEvent;
use App\Notifications\DiskFullNotification;
use Illuminate\Support\Facades\Notification;

class HostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hosts = Host::all();
        return Inertia::render('Hosts/Index', ['hosts' => $hosts]);
    }

    protected function preparePasswordForValidation(Request $request)
    {
        $password = $request->input('password');
        if ($password != null || $password != null) {
            $iv = 'XVCFYyEN0NvwMKSa';
            $key = "votre_clé_de_chiffrement";
            $password = openssl_encrypt($password, 'aes-256-cbc', $key, 0, $iv);
            $request->merge([
                'password' => $password,
            ]);
        }
    }

    public function create()
    {
        $types = Type::all();
        return Inertia::render('Hosts/Create', ['types' => $types]); 
    }
    
    public function store(Request $request)
    {
        $this->preparePasswordForValidation($request);

        $data = $request->validate([
            'hostname' => 'required|unique:hosts',
            'ip_address' => 'required|unique:hosts',
            'os' => 'nullable',
            'owner' => 'nullable|string',
            'username' => 'nullable|string',
            'password' => 'nullable|string',
            'type_name' => 'nullable|exists:types,type_name',
        ], [
            'hostname.required' => 'Le champ Nom d\'hôte est requis.',
            'hostname.unique' => 'Ce Nom d\'hôte existe déjà.',
            'ip_address.required' => 'Le champ Adresse IP est requis.',
            'ip_address.unique' => 'Cette Adresse IP existe déjà.',
            'type_name.exists' => 'Le champ Type sélectionné n\'existe pas.',
        ]);

        
        $type = Type::where('type_name', $data['type_name'])->firstOrFail();

        $host = Host::create($data);
        
        $statuses = new Status([
            'host_id' => $host->id,
            'type_id' => $type->id,
            'reference_value' => 1,
            'current_value' => 0,
            'rules' => '==',
        ]);
        $statuses->save();

        event(new HostCreatedEvent($host));

        // Rediriger vers la page d'index des hôtes après la création réussie
        return redirect()->route('host.index')->with('success', 'Hôte créé avec succès.');
    }


    public function edit($id)
    {
        $host = Host::find($id);

        return Inertia::render('Hosts/Edit', ['hosts' => $host, 'auth' => auth()->user()]);
    }


    public function update(HostUpdateRequest $request, $id)
    {
        $host = Host::find($id);
        
        $host->fill($request->validated());
        $host->save();

        event(new HostUpdatedEvent($host));

        return redirect()->route
        ('host.index');
    }


    public function destroy(Host $host)
    {
        $host = Host::findOrFail($host->id);
        $host->delete();

        // Diffusez l'événement de suppression
        event(new HostDeletedEvent($host->id));

        return redirect()->route('host.index')->with('success', 'Hôte supprimé avec succès.');
    }


    public function import(Request $request)
    {
        $this->preparePasswordForValidation($request);
        $file = $request->file('file');

        if ($file) {
            $data = array_map('str_getcsv', file($file->path()));
            $header = array_shift($data);

            foreach ($data as $row) {
                $hostname = $row[0];
                $ip_address = $row[1];
                $os = $row[2];
                $owner = $row[3];
                $username = $row[4];
                $password = $row[5];

                // Vérification doublon
                $existingHost = Host::where('hostname', $hostname)
                    ->where('ip_address', $ip_address)
                    ->first();

                // Créer si hostname et ip_address n'existent pas encore
                if (!$existingHost) {
                    $newHost = Host::create([
                        'hostname' => $hostname,
                        'ip_address' => $ip_address,
                        'os' => $os,
                        'owner' => $owner,
                        'username' => $username,
                        'password' => $password,
                    ]);

                    // Vérifier s'il y a déjà un statut pour l'hôte
                    $existingStatus = Status::where('id', $newHost->id)->first();

                    // Créer le statut avec 'reference_value' = 1 si aucun statut n'existe
                    if (!$existingStatus) {
                        $connectionType = Type::where('type_name', 'PC')->first();

                        if ($connectionType) {
                            Status::create([
                                'host_id' => $newHost->id,
                                'type_id' => $connectionType->id,
                                'reference_value' => 1,
                                'current_value' => 0,
                                'rules' => '==',
                            ]);
                        }
                    }

                    // Diffusez l'événement d'importation en transmettant les données de l'hôte
                    event(new HostImportedEvent($newHost));
                }
            }

            return redirect()->route('host.index')->with('success', 'Importation réussie.');
        }

        return redirect()->route('host.index')->with('error', 'Erreur lors de l\'importation des données.');
    }


    public function update_os_version($id = null)
    {
        //$res = shell_exec('bash '.storage_path('app/public/os_version.sh'));
        $iv = 'XVCFYyEN0NvwMKSa';
        $key = "votre_clé_de_chiffrement"; 
        
        if ($id == null) 
        {
            $res = null;
        }
        else 
        {
            $host = Host::findOrfail($id);
            $pass = openssl_decrypt($host->password, 'aes-256-cbc', $key, 0, $iv);

            if ($host)
            {   
                $cmd = 'bash '.storage_path('app/public/os_version.sh').' '.$host->username.' '.escapeshellarg($pass).' '.$host->ip_address;
                $res = shell_exec($cmd); //.' '.$pass.' '.$host->ip_address);
                if ($res != ""){
                    $version = explode("\t", $res)[1];
                    $host->os_version = $version;
                    $host->save();
                    event(new HostUpdatedEvent($host));
                }
            }
        }
        //$output = null;
        //exec('bash '.storage_path('app/public/os_version.sh 196.168.1.103'), $output);
        return redirect()->back();
    }

    public function update_disk_info($id = null)
{
    $iv = 'XVCFYyEN0NvwMKSa';
    $key = "votre_clé_de_chiffrement"; 
    
    if ($id == null) 
    {
        $res = null;
    }
    else 
    {
        $host = Host::findOrfail($id);
        $pass = openssl_decrypt($host->password, 'aes-256-cbc', $key, 0, $iv);
        
        if ($host)
        {   
            $cmd = 'bash '.storage_path('app/public/disk_info.sh').' '.$host->username.' '.escapeshellarg($pass).' '.$host->ip_address;
            $res = shell_exec($cmd);
            
            if ($res != ""){
                $info = explode(":", $res);
                $total = intval($info[0]); // Convertir en entier
                $used = intval($info[1]);  // Convertir en entier
                
                $state = Status::where('host_id',$host->id)->where('type_id',2)->first();
                if ($state){

                    $usagePercentage = ($used / $total) * 100;
                    $state->state = $usagePercentage > 80 ? "Disque plein" : "Ok";
                    $state->reference_value = $total;
                    $state->current_value = $used;
                    $state->save();

                    if ($state->state === "Disque plein") {
                        // Renvoyer la notification par e-mail
                        $hostname = $host->hostname;
                        $user = User::where('email', 'erickrazafintsoa@gmail.com')->first();
                        Notification::send($user, new DiskFullNotification($hostname, $state->state));
                    }

                    event(new DiskInfoUpdatedEvent($host->id, $state->state, $total, $used)); // Utiliser DiskInfoUpdatedEvent ici

                }else{

                    $state = new Status();
                    $state->host_id = $host->id;
                    $state->type_id = 2;
                    
                    $usagePercentage = ($used / $total) * 100;
                    $state->state = $usagePercentage > 80 ? "Disque plein" : "Ok";
                    $state->reference_value = $total;
                    $state->current_value = $used;
                    $state->save();

                    

                    event(new DiskInfoUpdatedEvent($host->id, $state->state, $total, $used)); // Utiliser DiskInfoUpdatedEvent ici

                }
            }else{
                dd("Une erreur s'est produite. La commande a échoué.");
            }
        }
    }
    return redirect()->back();
}


}
