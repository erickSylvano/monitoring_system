<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StatusStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Mettez-le à 'true' si vous autorisez la création de statut par ce formulaire
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'host_id' => 'required|exists:hosts,id', // L'ID doit exister dans la table 'hosts'
            'type_id' => 'required|exists:types,id', // L'ID doit exister dans la table 'types'
            'parent_id' => 'required|exists:statuses,id', // L'ID doit exister dans la table 'statuses'
            'reference_value' => 'nullable|numeric',
            'current_value' => 'nullable|numeric',
            'rules' => 'nullable|string',
            'state' => 'nullable|string',
            'message' => 'nullable|string',
            //'last_updated_at' => 'nullable',
        ];
    }
}
