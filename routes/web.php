
<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\HostController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/host', [HostController::class, 'index'])->name('host.index')->middleware('auth', 'verified');
Route::get('/hosts/{id}/edit', [HostController::class, 'edit'])->name('hosts.edit')->middleware('auth', 'verified');
Route::put('/host/{id}', [HostController::class, 'update'])->name('host.update')->middleware('auth', 'verified');
Route::get('/host/create', [HostController::class, 'create'])->name('host.create')->middleware('auth', 'verified');
Route::post('/hosts', [HostController::class, 'store'])->name('host.store')->middleware('auth', 'verified');
Route::post('/host/import', [HostController::class, 'import'])->name('host.import')->middleware('auth', 'verified');
Route::delete('/host/{host}', [HostController::class, 'destroy'])->name('host.destroy')->middleware('auth', 'verified');
Route::put('/host/update/os-version', [HostController::class, 'update_os_version'])->name('host.update.os.version')->middleware('auth', 'verified');
Route::put('/host/update/os-version/{id}', [HostController::class, 'update_os_version'])->name('host.update.os.version.host')->middleware('auth', 'verified');
Route::put('/host/update/disk-info/{id}', [HostController::class, 'update_disk_info'])->name('host.update.disk.info.host')->middleware('auth', 'verified');


Route::get('/status/index', [StatusController::class, 'index'])->name('status.index')->middleware('auth', 'verified');
Route::get('/status/{id}/edit', [StatusController::class, 'edit'])->name('status.edit')->middleware('auth', 'verified');
Route::put('/status/{id}', [StatusController::class, 'update'])->name('status.update')->middleware('auth', 'verified');
Route::get('/statuses/check-ping', [StatusController::class, 'checkPingStatus'])->name('statuses.check-ping')->middleware('auth', 'verified');
Route::get('/monitoring/pc', [StatusController::class, 'monitoring_pc'])->name('status.monitoring.pc')->middleware('auth', 'verified');
Route::get('/monitoring/server', [StatusController::class, 'monitoring_server'])->name('status.monitoring.server')->middleware('auth', 'verified');
Route::get('/monitoring/hdd', [StatusController::class, 'monitoring_hdd'])->name('status.monitoring.hdd')->middleware('auth', 'verified');
Route::post('/status/create/hdd', [StatusController::class, 'create_hdd_state'])->name('status.create.hdd')->middleware('auth', 'verified');
Route::get('/monitoring', [StatusController::class, 'monitoring'])->name('monitoring')->middleware('auth', 'verified');
Route::get('/pc', [StatusController::class, 'pc'])->name('pc')->middleware('auth', 'verified');
Route::get('/hdd', [StatusController::class, 'hdd'])->name('hdd')->middleware('auth', 'verified');
Route::delete('/status/delete/{id}', [StatusController::class, 'destroy'])->name('status.destroy')->middleware('auth', 'verified');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('auth', 'verified');
Route::get('/dashboard/data', [DashboardController::class, 'dashboardData'])->name('dashboard.data');

Route::get('/type', [TypeController::class, 'index'])->name('type.index')->middleware('auth', 'verified');
Route::get('/type/edit/{id}', [TypeController::class, 'edit'])->name('type.edit')->middleware('auth', 'verified');
Route::put('/type/update/{id}', [TypeController::class, 'update'])->name('type.update')->middleware('auth', 'verified');

require __DIR__.'/auth.php';
