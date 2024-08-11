<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Type;
use App\Http\Requests\TypeUpdateRequest;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $types = Type::all();
        return Inertia::render('Types/Index', ['types' => $types]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $types = Type::find($id);

        if (!$types) {
            // (afficher une page d'erreur, rediriger, etc.)
        }
        return Inertia::render('Types/Edit', ['types' => $types, 'auth' => auth()->user()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TypeUpdateRequest $request, string $id)
    {
        $type = Type::find($id);

        if (!$type) {
            // (afficher une page d'erreur, rediriger, etc.)
        }
        $type->fill($request->validated());
        $type->save();
        return redirect()->route('type.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
