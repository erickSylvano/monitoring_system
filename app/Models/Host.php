<?php

namespace App\Models;
use App\Models\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Host extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'hosts';
    public $timestamps = true;
    protected $fillable = [
        'hostname', 'ip_address', 'os', 'username', 'password', 'domain', 'host_ecdsa_key', 'type_connexion', 'port', 'owner', 'connexion_id',
    ];

    protected static function boot()
{
    parent::boot();

    // Événement de suppression de l'hôte
    static::deleting(function ($hosts) {
        // Supprimer tous les statuts liés à cet hôte
        $hosts->statuses()->delete();
    });
}

    // Une relation de l'hôte vers les statuts
    public function statuses()
    {
        return $this->hasMany(Status::class, 'host_id', 'id');
    }

    public function connexion()
    {
        return $this->belongsTo(\App\Models\Connexion::class);
    }

    public function tasks()
    {
        return $this->hasMany(\App\Models\Task::class);
    }
    
    use HasFactory;
}
