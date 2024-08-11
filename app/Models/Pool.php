<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pool extends Model
{
    use HasFactory;
    protected $fillable = [
        'date',
        'state',
        'progression',
        'job_id'
    ];

    public function task()
    {
        return $this->belongsTo(\App\Models\Task::class);
    }
}
