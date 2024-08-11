import { Inertia } from '@inertiajs/inertia';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function Edit({ auth, types }) {
  const { data, setData, processing, recentlySuccessful } = useForm({
    type_name: types.type_name,
  });

  const submit = (e) => {
    e.preventDefault();

    Inertia.put(route('type.update', { id: types.id }), data);
  };

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">types</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Update your type_name</p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="name" value="Name" />
          <TextInput
            type_name="type_name"
            className="mt-1 block w-full"
            value={data.type_name}
            onChange={(e) => setData('type_name', e.target.value)}
            required
            isFocused
            autoComplete="type_name"
          />
        </div>
        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Save</PrimaryButton>
          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
