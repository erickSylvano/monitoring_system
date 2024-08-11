
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import PrimaryButton from '@/Components/PrimaryButton';
import Editable from '@/Components/Editable';
import React, { useState, useEffect } from 'react';

export default function Hosts({ auth, hosts, success }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreateHost = () => {
        // Appeler la route pour afficher le formulaire de création d'un nouvel hôte
        Inertia.visit(route('host.create'));
      };

      
    // IMPORTER
    const handleImport = (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
  
        Inertia.post(route('host.import'), formData);
      };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Liste des Objets</h2>}
        >
            <Head title="Hosts" />
            {success && (
                <div className="bg-green-200 text-green-800 p-4 my-4 rounded">
                    {success}
                </div>
            )}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Importer
                          </label>
                          <input type="file" onChange={handleImport} />
                        </div>
                        <div className="mb-4 flex items-center">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            </label>
                            <input
                                type="text"
                                className="flex-1 border border-gray-400 rounded px-3 py-2 bg-gray-900 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher"
                            />
                        </div>
                        <div className="overflow-x-auto">
                        <PrimaryButton onClick={handleCreateHost} className="primary text-indigo-600 hover:text-indigo-800">
                          Creer un hôte
                        </PrimaryButton>
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="border-b dark:border-neutral-500 text-grey-400">
                                        <th scope="col" className="px-4 py-2">hostname</th>
                                        <th scope="col" className="px-4 py-2">ip_address</th>
                                        <th scope="col" className="px-4 py-2">os</th>
                                        <th scope="col" className="px-4 py-2">Login</th>
                                        <th scope="col" className="px-4 py-2">Utilisateur</th>
                                        <th scope="col" className="px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                  <tbody className='text-center'>
                                  {hosts
                                    .filter((host) => {
                                        const searchTermLower = searchTerm.toLowerCase();
                                        return (
                                            (host.hostname && host.hostname.toLowerCase().includes(searchTermLower)) ||
                                            (host.ip_address && host.ip_address.toLowerCase().includes(searchTermLower)) ||
                                            (host.os && host.os.toLowerCase().includes(searchTermLower)) ||
                                            (host.username && host.username.toLowerCase().includes(searchTermLower)) ||
                                            (host.owner && host.owner.toLowerCase().includes(searchTermLower))
                                        );
                                    }).slice().reverse().map(({ id , hostname , ip_address , os, username,  owner}) => (
                                        <tr key={id } className="border-b dark:border-neutral-500 text-grey-400">
                                            <td className="whitespace-nowrap px-4 py-2">{hostname}</td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                            <Editable
                                                valeur={ip_address}
                                                id={id}
                                                c="ip_address"
                                                onBlur={(editedValue) => {
                                                    console.log("Editable onBlur:", editedValue);
                                                }}
                                            />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2">{os}</td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                                <Editable valeur={username}
                                                    id={id}
                                                    c="username"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                                <Editable valeur={owner}
                                                    id={id}
                                                    c="owner"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                            <div className="flex items-center">
                                                <Link
                                                    href={route('hosts.edit', { id: id })}
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <button className="px-1 py-0 text-white bg-blue-500 rounded-md focus:outline-none mr-4 ml-4">
                                                        Modifier
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm("Voulez-vous supprimer cet hôte ?")) {
                                                            Inertia.delete(route('host.destroy', id));
                                                        }
                                                    }}
                                                    className="px-1 py-0 text-white bg-red-500 rounded-md focus:outline-none"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
