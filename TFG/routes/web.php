<?php

use App\Http\Controllers\EventoController;
use Illuminate\Support\Facades\Route;



Route::get('/filtro', [EventoController::class, 'all']);

Route::view('/{any}', 'app')->where('any', '.*');
