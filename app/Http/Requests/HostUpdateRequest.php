<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HostUpdateRequest extends FormRequest
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
            'ip_address' => 'required|string',
            'os' => 'nullable|string|max:255',
            'hostname' => 'required|string|max:255',
            'username' => 'string|max:255',
            'password' => 'string|max:255',
            'domain' => 'string|max:255',
            'host_ecdsa_key' => 'text',
            'type_connexion' => 'string|max:255',
            'port' => 'integer',
            'owner' => 'string|max:255',
        ];
    }

    protected function prepareForValidation()
{
    $password = $this->input('password');
    
    // Vérifiez si le champ 'password' a été soumis et s'il est différent de null
    if ($password !== null && $password !== $this->get('original_password')) {
        $iv = 'XVCFYyEN0NvwMKSa';
        $key = "votre_clé_de_chiffrement";
        $password = openssl_encrypt($password, 'aes-256-cbc', $key, 0, $iv);
        
        $this->merge([
            'password' => $password,
        ]);
    } else {
        // Si le champ n'a pas été modifié, restaurez la valeur originale
        $this->merge([
            'password' => $this->get('original_password'),
        ]);
    }
}

}
