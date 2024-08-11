import { Inertia } from '@inertiajs/inertia';
import React, { useState } from 'react'; // Importez useState pour gérer l'état du champ de sélection
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';

export default function Create({ auth, types }) { // Passez les types disponibles en tant que prop
    const { data, setData, errors, processing, recentlySuccessful, post } = useForm({
      hostname: '',
      ip_address: '',
      os: '',
      owner: '',
      username: '',
      type_name: '', // Ajoutez le champ de sélection pour type_name
    });

    function handleSubmit(e) {
      e.preventDefault();
      post(route("host.store"));
    }

    return (
      <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Création de hôte</h2>}
      >
        <Head title="Create Host" />

        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <section className="max-w-xl">
                <header>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Informations sur l'hôte</h2>
                </header>

                <form onSubmit={handleSubmit} className="mt-12 space-y-6">

                <div className="mb-4">
                    <InputLabel htmlFor="type_name" value="Type d'hôte" />
                    <select
                      id="type_name"
                      name="type_name"
                      value={data.type_name}
                      onChange={(e) => setData('type_name', e.target.value)}
                      required
                      className="w-full border border-gray-400 rounded px-3 py-2 bg-gray-900 text-white"
                    >
                      <option value="">Sélectionner un type</option>
                      {types.map((type) => (
                        // Vérifiez si le type_name est différent de "HDD" avant de l'afficher
                        type.type_name !== "HDD" && (
                          <option key={type.id} value={type.type_name}>
                            {type.type_name}
                          </option>
                        )
                      ))}
                    </select>
                    {errors.type_name && <InputError className="mt-2" message={errors.type_name} />}
                  </div>
                  <div>
                    <InputLabel htmlFor="hostname" value="Nom d'hôte" />

                    <TextInput
                      id="hostname"
                      name="hostname"
                      className="mt-1 block w-full"
                      value={data.hostname}
                      onChange={(e) => setData('hostname', e.target.value)}
                      required
                      isFocused
                      autoComplete="Nom de l'hôte"
                    />

                    {errors.hostname && <InputError className="mt-2" message={errors.hostname} />}
                  </div>
                  <div>
                    <InputLabel htmlFor="ip_address" value="Adresse IP" />

                    <TextInput
                      id="ip_address"
                      name="ip_address"
                      className="mt-1 block w-full"
                      value={data.ip_address}
                      onChange={(e) => setData('ip_address', e.target.value)}
                      required
                      isFocused
                      autoComplete="xxx.xxx.xxx.xxx"
                    />

                    {errors.ip_address && <InputError className="mt-2" message={errors.ip_address} />}
                  </div>
                  <div className="mb-4">
                    <InputLabel htmlFor="os" value="OS" />
                    <select
                      name="os"
                      value={data.os}
                      onChange={(e) => setData('os', e.target.value)}
                      required
                      className="w-full border border-gray-400 rounded px-3 py-2 bg-gray-900 text-white"
                    >
                      <option value="">Sélectionnez le type</option>
                      <option value="Windows">Windows</option>
                      <option value="Linux">Linux</option>
                    </select>
                  </div>
                  <div>
                    <InputLabel htmlFor="owner" value="Utilisateur" />

                    <TextInput
                      id="owner"
                      name="owner"
                      className="mt-1 block w-full"
                      value={data.owner}
                      onChange={(e) => setData('owner', e.target.value)}
                      isFocused
                      autoComplete="Utilisateur"
                    />

                    {errors.owner && <InputError className="mt-2" message={errors.owner} />}
                  </div>
                  <div>
                    <InputLabel htmlFor="username" value="Login" />
                    <TextInput
                      id="username"
                      className="mt-1 block w-full"
                      value={data.username}
                      onChange={(e) => setData('username', e.target.value)}
                      isFocused
                      autoComplete="Login"
                    />
                  </div>
                  <div>
                    <InputLabel htmlFor="password" value="Mots de passe" />

                    <TextInput
                      id="password"
                      type="password"
                      name="password"
                      className="mt-1 block w-full"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      isFocused
                      autoComplete="Password"
                    />

                    {errors.owner && <InputError className="mt-2" message={errors.owner} />}
                  </div>
                  <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>
                    <Transition
                      show={recentlySuccessful}
                      enterFrom="opacity-0"
                      leaveTo="opacity-0"
                      className="transition ease-in-out"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enregistré.</p>
                    </Transition>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }
