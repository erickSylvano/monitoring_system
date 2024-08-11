<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'types';
    public $timestamps = true;
    protected $fillable = [
        'type_name',
    ];

    use HasFactory;
}
