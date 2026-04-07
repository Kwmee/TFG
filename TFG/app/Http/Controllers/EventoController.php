<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EventoController extends Controller
{
    // Devuelve el primer nombre de columna existente entre varias opciones.
    private function obtenerColumnaEvento(array $columnas): ?string
    {
        foreach ($columnas as $columna) {
            if (Schema::hasColumn('evento', $columna)) {
                return $columna;
            }
        }

        return null;
    }

    // Normaliza la salida para que el frontend reciba siempre las mismas claves.
    private function normalizarEvento(Evento $evento): array
    {
        $idColumna = $this->obtenerColumnaEvento(['id', 'idEvento', 'id_evento']);
        $fechaColumna = $this->obtenerColumnaEvento(['fechaInicio', 'fecha_inicio']);
        $tipoColumna = $this->obtenerColumnaEvento(['tipoEvento', 'tipo']);
        $festivalColumna = $this->obtenerColumnaEvento(['idFestival', 'festival_id']);
        $imagenColumna = $this->obtenerColumnaEvento(['url_img', 'url_image']);

        return [
            'id' => $idColumna ? $evento->getAttribute($idColumna) : null,
            'nombre' => $evento->nombre,
            'ciudad' => $evento->ciudad,
            'fechaInicio' => $fechaColumna ? $evento->getAttribute($fechaColumna) : null,
            'tipoEvento' => $tipoColumna ? $evento->getAttribute($tipoColumna) : null,
            'idFestival' => $festivalColumna ? $evento->getAttribute($festivalColumna) : null,
            'url_img' => $imagenColumna ? $evento->getAttribute($imagenColumna) : null,
        ];
    }

    public function all(Request $request)
    {
        $columnaFecha = $this->obtenerColumnaEvento(['fechaInicio', 'fecha_inicio']);

        return Evento::when($request->ciudad, fn($q) =>
            $q->where('ciudad', $request->ciudad))
            ->when($request->nombre, fn($q) =>
                $q->where('nombre', 'like', "%{$request->nombre}%"))
            ->when($request->fechaInicio && $columnaFecha, fn($q) =>
                $q->whereDate($columnaFecha, $request->fechaInicio))
            ->get()
            ->map(fn ($evento) => $this->normalizarEvento($evento));

    }

    // Comprueba si el usuario que hace la accion es administrador.
    private function esAdmin(?int $idAdmin): bool
    {
        if (!$idAdmin) {
            return false;
        }

        return DB::connection('mysql_usuarios')
            ->table('usuario')
            ->where('id', $idAdmin)
            ->where('rol', 'ADMIN')
            ->exists();
    }

    public function adminListar(Request $request): JsonResponse
    {
        if (!$this->esAdmin((int) $request->query('idAdmin'))) {
            return response()->json([
                'message' => 'No tienes permisos de administrador.',
            ], 403);
        }

        $columnaFecha = $this->obtenerColumnaEvento(['fechaInicio', 'fecha_inicio']);

        $consulta = Evento::query();

        if ($columnaFecha) {
            $consulta->orderBy($columnaFecha);
        }

        return response()->json(
            $consulta->get()->map(fn ($evento) => $this->normalizarEvento($evento))
        );
    }

    public function adminCrear(Request $request): JsonResponse
    {
        if (!$this->esAdmin((int) $request->input('idAdmin'))) {
            return response()->json([
                'message' => 'No tienes permisos de administrador.',
            ], 403);
        }

        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
            'fechaInicio' => 'required|date',
            'tipoEvento' => 'nullable|string|max:255',
            'idFestival' => 'nullable|integer',
            'url_img' => 'required|string|max:1000',
        ]);

        $evento = new Evento();
        $evento->nombre = $datosValidados['nombre'];
        $evento->ciudad = $datosValidados['ciudad'];

        $columnaFecha = $this->obtenerColumnaEvento(['fechaInicio', 'fecha_inicio']);
        $columnaTipo = $this->obtenerColumnaEvento(['tipoEvento', 'tipo']);
        $columnaFestival = $this->obtenerColumnaEvento(['idFestival', 'festival_id']);
        $columnaImagen = $this->obtenerColumnaEvento(['url_img', 'url_image']);

        if ($columnaFecha) {
            $evento->setAttribute($columnaFecha, $datosValidados['fechaInicio']);
        }

        if ($columnaTipo && !empty($datosValidados['tipoEvento'])) {
            $evento->setAttribute($columnaTipo, $datosValidados['tipoEvento']);
        }

        if ($columnaFestival && array_key_exists('idFestival', $datosValidados) && $datosValidados['idFestival'] !== null) {
            $evento->setAttribute($columnaFestival, $datosValidados['idFestival']);
        }

        if ($columnaImagen) {
            $evento->setAttribute($columnaImagen, $datosValidados['url_img']);
        }

        $evento->save();

        return response()->json($this->normalizarEvento($evento), 201);
    }

    public function adminEliminar(Request $request, string $id): JsonResponse
    {
        if (!$this->esAdmin((int) $request->query('idAdmin'))) {
            return response()->json([
                'message' => 'No tienes permisos de administrador.',
            ], 403);
        }

        if (!ctype_digit($id)) {
            return response()->json([
                'message' => 'El id del concierto no es valido.',
            ], 400);
        }

        $idColumna = $this->obtenerColumnaEvento(['id', 'idEvento', 'id_evento']);

        if (!$idColumna) {
            return response()->json([
                'message' => 'No se ha encontrado la clave del concierto.',
            ], 500);
        }

        $filasEliminadas = DB::table('evento')
            ->where($idColumna, (int) $id)
            ->delete();

        if ($filasEliminadas === 0) {
            return response()->json([
                'message' => 'No se ha encontrado el concierto.',
            ], 404);
        }

        return response()->json([
            'message' => 'Concierto eliminado correctamente.',
        ]);
    }


}
