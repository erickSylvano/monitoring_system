<?php

namespace App\Http\Controllers;

use App\Models\Host;
use App\Models\Status;
use App\Models\Type;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StatusUpdateRequest;
use App\Http\Requests\StatusStoreRequest; 
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Broadcast;
use App\Events\HDDStateCreatedEvent;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $statuses = Status::with('host', 'type')->get();

        return Inertia::render('Statuses/Index', ['statuses' => $statuses]);
    }

    public function monitoring_pc()
    {
        $statuses = Status::with('host', 'type')->get();

        return Inertia::render('Statuses/MonitoringPc', ['statuses' => $statuses]);
    }

    public function monitoring_server()
    {
        $statuses = Status::with('host', 'type')->get();

        return Inertia::render('Statuses/MonitoringServer', ['statuses' => $statuses]);
    }

    public function monitoring_hdd()
    {
        $statuses = Status::with('host', 'type')->get();

        return Inertia::render('Statuses/MonitoringHdd', ['statuses' => $statuses]);
    }

    public function monitoring()
    {
        $statuses = Status::with('host', 'type')->get();

        return Inertia::render('Statuses/Monitoring', ['statuses' => $statuses]);
    }

    public function pc()
    {
        $statuses = Status::with('host', 'type')->get();

        return Inertia::render('Statuses/Pc', ['statuses' => $statuses]);
    }

    public function hdd()
    {
        $statuses = Status::with('host', 'type')->get();

        return Inertia::render('Statuses/Hdd', ['statuses' => $statuses]);
    }


    public function create_hdd_state(Request $request)
    {
        $hostId = $request->input('host_id');
        $hddType = Type::where('type_name', 'HDD')->first();

        if ($hostId && $hddType) {
            // Vérification s'il existe déjà un état HDD pour l'hôte
            $existingHDDState = Status::where('host_id', $hostId)
                ->where('type_id', $hddType->id)
                ->exists();

            if (!$existingHDDState) {
                $parentStatus = Status::where('host_id', $hostId)->first();

                if ($parentStatus) {
                    $data = [
                        'host_id' => $hostId,
                        'type_id' => $hddType->id,
                        'parent_id' => $parentStatus->id,
                    ];

                    Status::create($data);

                    // Émission de l'événement lorsque l'état HDD est créé avec succès
                    event(new HDDStateCreatedEvent($hostId, 'HDD', 'Some message'));
                    
                    //return response()->json(['message' => 'État HDD créé avec succès.']);
                }
            } else {
                //return response()->json(['message' => 'Un état HDD existe déjà pour cet hôte.'], 400);
            }
        }

        //return response()->json(['message' => 'Erreur lors de la création de l\'état HDD.'], 500);
    }

    public function destroy($id)
    {
        try {

            $status = Status::findOrFail($id);

            $status->delete();

            //return response()->json(['message' => 'Status deleted successfully.']);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Error deleting status.'], 500);
        }
    }
}
