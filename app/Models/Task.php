<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'active',
        'source_id',
        'storage_id',
        'host_id',
        'schedule_type',
        'schedule_time',
        'schedule_date',
        'priority',
        'state',
        'compression',
        'priority',
        'full_backup_date',
        'source_path',
    ];

    public function host()
    {
        return $this->belongsTo(\App\Models\Host::class);
    }

    public function storage()
    {
        return $this->belongsTo(\App\Models\Storage::class);
    }

    public function pools()
    {
        return $this->hasMany(\App\Models\Pool::class);
    }
}
