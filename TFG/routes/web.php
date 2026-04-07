<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventoController;
use Illuminate\Support\Facades\Route;



Route::get('/filtro', [EventoController::class, 'all']);
Route::get('/usuario', [AuthController::class, 'usuario']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::view('/{any}', 'app')->where('any', '.*');
