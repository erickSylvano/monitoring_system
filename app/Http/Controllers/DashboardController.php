<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\Host;
use App\Models\Type;
use App\Models\Status;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPCStatus = Status::where('type_id', Type::where('type_name', 'PC')->first()->id)->count();
        $onlinePCStatus = Status::where('type_id', Type::where('type_name', 'PC')->first()->id)->where('state', 'En ligne')->count();
        $offlinePCStatus = Status::where('type_id', Type::where('type_name', 'PC')->first()->id)->where('state', 'Hors ligne')->count();
    
        $totalServerStatus = Status::where('type_id', Type::where('type_name', 'Server')->first()->id)->count();
        $onlineServerStatus = Status::where('type_id', Type::where('type_name', 'Server')->first()->id)->where('state', 'En ligne')->count();
        $offlineServerStatus = Status::where('type_id', Type::where('type_name', 'Server')->first()->id)->where('state', 'Hors ligne')->count();

        $totalHddStatus = Status::where('type_id', Type::where('type_name', 'HDD')->first()->id)->count();
        $okHddStatus = Status::where('type_id', Type::where('type_name', 'HDD')->first()->id)->where('state', 'Ok')->count();
        $fullHddStatus = Status::where('type_id', Type::where('type_name', 'HDD')->first()->id)->where('state', 'Disque plein')->count();

        return Inertia::render('Dashboard', [
            'totalPCStatus' => $totalPCStatus,
            'onlinePCStatus' => $onlinePCStatus,
            'offlinePCStatus' => $offlinePCStatus,
            'totalServerStatus' => $totalServerStatus,
            'onlineServerStatus' => $onlineServerStatus,
            'offlineServerStatus' => $offlineServerStatus,
            'totalHddStatus' => $totalHddStatus,
            'okHddStatus' => $okHddStatus,
            'fullHddStatus' => $fullHddStatus,
        ]);
    }

    public function dashboardData()
{
    $totalPCStatus = Status::where('type_id', Type::where('type_name', 'PC')->first()->id)->count();
    $onlinePCStatus = Status::where('type_id', Type::where('type_name', 'PC')->first()->id)->where('state', 'En ligne')->count();
    $offlinePCStatus = Status::where('type_id', Type::where('type_name', 'PC')->first()->id)->where('state', 'Hors ligne')->count();

    $totalServerStatus = Status::where('type_id', Type::where('type_name', 'Server')->first()->id)->count();
    $onlineServerStatus = Status::where('type_id', Type::where('type_name', 'Server')->first()->id)->where('state', 'En ligne')->count();
    $offlineServerStatus = Status::where('type_id', Type::where('type_name', 'Server')->first()->id)->where('state', 'Hors ligne')->count();

    $totalHddStatus = Status::where('type_id', Type::where('type_name', 'HDD')->first()->id)->count();
    $okHddStatus = Status::where('type_id', Type::where('type_name', 'HDD')->first()->id)->where('state', 'Ok')->count();
    $fullHddStatus = Status::where('type_id', Type::where('type_name', 'HDD')->first()->id)->where('state', 'Disque plein')->count();

    $data = [
        'totalPCStatus' => $totalPCStatus,
        'onlinePCStatus' => $onlinePCStatus,
        'offlinePCStatus' => $offlinePCStatus,
        'totalServerStatus' => $totalServerStatus,
        'onlineServerStatus' => $onlineServerStatus,
        'offlineServerStatus' => $offlineServerStatus,
        'totalHddStatus' => $totalHddStatus,
        'okHddStatus' => $okHddStatus,
        'fullHddStatus' => $fullHddStatus,
    ];

    return Response::json($data);
}

}
