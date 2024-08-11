//import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/inertia-react';


export default function Types({ auth, types }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Types</h2>}
        >
            <Head title="Types" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="border-b dark:border-neutral-500 text-grey-400">
                                        <th scope="col" className="px-4 py-2">id</th>
                                        <th scope="col" className="px-4 py-2">type_name</th>
                                        <th scope="col" className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {types.map(({ id , type_name}) => (
                                        <tr key={id } className="border-b dark:border-neutral-500 text-grey-400">
                                            <td className="whitespace-nowrap px-4 py-2">{id}</td>
                                            <td className="whitespace-nowrap px-4 py-2">{type_name}</td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                            <Link
                                                href={route('type.edit', { id: id })}
                                                className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                Modifier
                                            </Link>
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