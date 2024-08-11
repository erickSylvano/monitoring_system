<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StatusUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'type_id' => 'required|exists:types,id',
            'host_id' => 'required|exists:hosts,id',
            'reference_value' => 'nullable|string|max:255',
            'current_value' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:255',
            'rules' => 'nullable|string|max:255',
        ];
    }
}
