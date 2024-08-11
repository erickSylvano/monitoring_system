<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHostRequest extends FormRequest
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
            'hostname' => 'required|string',
            'username' => 'nullable|string|max:255',
            'password' => 'nullable|string|max:255',
            'os' => 'nullable|string|max:255',
            'domain' => 'string|max:255',
            'host_ecdsa_key' => 'text',
            'type_connexion' => 'string|max:255',
            'port' => 'integer',
            'owner' => 'string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'hostname.required' => 'Le champ Nom d\'hôte est requis.',
            'hostname.unique' => 'Ce Nom d\'hôte existe déjà.',
            'ip_address.required' => 'Le champ Adresse IP est requis.',
            'ip_address.unique' => 'Cette Adresse IP existe déjà.',
            // Ajoutez d'autres messages d'erreur personnalisés ici si nécessaire
        ];
    }

    protected function prepareForValidation()
    {
        $password = $this->input('password');
        if ($password != null || $password != null){
            $iv = 'XVCFYyEN0NvwMKSa';
            $key = "votre_clé_de_chiffrement";
            $password = openssl_encrypt($password,'aes-256-cbc',$key,0,$iv);
            $this->merge([
                'password' => $password,
            ]);
        }
    }
}
