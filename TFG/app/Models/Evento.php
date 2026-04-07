<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $table = 'evento';
    protected $primaryKey = 'id';
    protected $fillable = [
        'nombre',
        'ciudad',
        'fechaInicio',
        'tipoEvento',
        'idFestival',
        'url_img'
    ];

    public $timestamps = false;
}
