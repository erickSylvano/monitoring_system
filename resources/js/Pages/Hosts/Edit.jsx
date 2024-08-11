import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/inertia-react'; 
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Edit({ auth ,hosts, connexions}) {

    const { data, setData, processing, recentlySuccessful,errors } = useForm({
        hostname: hosts.hostname,
        ip_address: hosts.ip_address,
        os: hosts.os,
        owner: hosts.owner,
        username: hosts.username,
        original_password: hosts.password,

    }); 

    const submit = (e) => {
    e.preventDefault();

    Inertia.put(route('host.update', { id: hosts.id }), data);
  };
    


    return (
        // <AuthenticatedLayout
        //     user={auth.user}
        //     header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Destination</h2>}
        // >
        //     <Head title="Host" />

            <div className="py-12">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center justify-between mb-6">
                           <Link
                            href={route('host.index')}
                            className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md"
                        >
                            Retour
                        </Link>
                    </div>
                        <div className="max-w-md mx-auto">
                            <h1 className="text-2xl font-semibold mb-4">Modifier la Hôte</h1>
                            <form onSubmit={submit} className="mt-12 space-y-6">
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
                                      autoComplete="hostname"
                                  />
                                  {errors.hostname && <div className="text-red-600">{errors.hostname}</div>}
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
                                      autoComplete="ip_address"
                                  />
                                  {errors.ip_address && <div className="text-red-600">{errors.ip_address}</div>}
                              </div>
                              <div className="mb-4">
                                    <label className="block font-medium mb-1">Type OS</label>
                                    <select
                                        name="os"
                                        value={data.os}
                                        onChange={(e) => setData('os', e.target.value)}
                                        className="w-full border border-gray-400 rounded px-3 py-2 bg-gray-900 text-white"
                                    >
                                       <option value="" >select type</option>
                                            <option value="Windows">Windows</option>
                                            <option value="Linux">Linux</option>
                                    </select>
                                </div>
                              <div>
                                <InputLabel htmlFor="owner" value="owner" />
                                <TextInput
                                  id="owner"
                                  className="mt-1 block w-full"
                                  value={data.owner}
                                  onChange={(e) => setData('owner', e.target.value)}
                                  required
                                  isFocused
                                  autoComplete="owner"
                                />
                              </div>
                              <div>
                                <InputLabel htmlFor="username" value="Login" />
                                <TextInput
                                  id="username"
                                  className="mt-1 block w-full"
                                  value={data.username}
                                  onChange={(e) => setData('username', e.target.value)}
                                  isFocused
                                  autoComplete="username"
                                />
                              </div>
                              <div>
                                <InputLabel htmlFor="password" value="Mot de passe" />
                                <TextInput
                                  id="password"
                                  type="password"
                                  name="password"
                                  className="mt-1 block w-full"
                                  value={data.password}
                                  onChange={(e) => setData('password', e.target.value)}
                                  isFocused
                                  placeholder="password"
                                />
                              </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Sauvegarder
                                    </button>
                                   
                                </div>

                            </form>
                            
                        </div>
                    </div>
                </div>
            </div>
        // </AuthenticatedLayout>
    );
};
