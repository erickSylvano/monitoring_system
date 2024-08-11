<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'statuses';
    public $timestamps = true;
    protected $fillable = [
        'host_id', 'type_id', 'parent_id', 'reference_value', 'current_value', 'state', 'message', 'rules','last_updated_at',
    ];

    // Une relation de l'état vers l'hôte
    public function host()
    {
        return $this->belongsTo(Host::class, 'host_id', 'id');
    }

    // Une relation de l'état vers le type
    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id', 'id');
    }

    // Une relation de l'état vers lui-même (auto-relation pour parent_id)
    public function parent()
    {
        return $this->belongsTo(Status::class, 'parent_id', 'id');
    }

    use HasFactory;
}
