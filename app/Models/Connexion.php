<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Connexion extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $dateFormat = 'U';
    protected $fillable = [
        'name',
    ];

    public function hosts()
    {
        return $this->hasMany(\App\Models\Host::class);
    }
}
