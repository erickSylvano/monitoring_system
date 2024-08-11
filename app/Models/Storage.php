<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'path',
    ];

    public function tasks()
    {
        return $this->hasMany(\App\Models\Task::class);
    }
}
