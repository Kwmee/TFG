<?php

use App\Http\Controllers\EventoController;
use Illuminate\Support\Facades\Route;



Route::get('/filtro', [EventoController::class, 'all']);
Route::get('/admin/conciertos', [EventoController::class, 'adminListar']);
Route::post('/admin/conciertos', [EventoController::class, 'adminCrear']);
Route::delete('/admin/conciertos/{id}', [EventoController::class, 'adminEliminar']);

Route::view('/{any}', 'app')->where('any', '.*');
