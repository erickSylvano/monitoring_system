import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, InertiaForm } from '@inertiajs/inertia-react';

export default function Create() {
  return (
    <AuthenticatedLayout>
      <Head title="Créer un nouveau type" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">Créer un nouveau type</div>

            {/* Le formulaire de création */}
            <InertiaForm method="post" action={route('types.store')} className="p-6">
              <div className="mb-4">
                <label htmlFor="type_name" className="block text-sm font-medium text-gray-700">
                  Type Name
                </label>
                <input type="text" name="type_name" id="type_name" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                {/* Ajoutez d'autres champs ici */}
              </div>

              <div className="flex items-center justify-end mt-4">
                <button type="submit" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Créer
                </button>
              </div>
            </InertiaForm>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
