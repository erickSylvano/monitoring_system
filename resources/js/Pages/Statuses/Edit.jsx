import { Inertia } from '@inertiajs/inertia';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function Edit({ statuses, hosts , types }) {
  const { data, setData, processing, recentlySuccessful } = useForm({
    hostname: statuses.host.hostname,
    ip_address: statuses.host.ip_address,
    type_name: statuses.type.type_name,
    reference_value: statuses.reference_value,
    current_value: statuses.current_value,
    state: statuses.state,
    message: statuses.message,
    rules: statuses.rules,
  });

  const submit = (e) => {
    e.preventDefault();

    // Utilisez statuses.id ou tout autre nom approprié pour l'ID du statut
    Inertia.put(route('status.update', { status_id: statuses.status_id }), data);
  };

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Status</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Update your Status informations</p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
      <div>
          <InputLabel htmlFor="hostname" value="Host name" />
          <TextInput
            id="hostname"
            className="mt-1 block w-full"
            value={data.hostname}
            onChange={(e) => setData('hostname', e.target.value)}
            required
            isFocused
            autoComplete="hostname"
          />
        </div>
        <div>
          <InputLabel htmlFor="ip_address" value="Ip Address" />
          <TextInput
            id="rules"
            className="mt-1 block w-full"
            value={data.ip_address}
            onChange={(e) => setData('ip_address', e.target.value)}
            required
            isFocused
            autoComplete="ip_address"
          />
        </div>
        <div>
          <InputLabel htmlFor="reference_value" value="Reference Value" />
          <TextInput
            id="reference_value"
            className="mt-1 block w-full"
            value={data.reference_value}
            onChange={(e) => setData('reference_value', e.target.value)}
            required
            isFocused
            autoComplete="reference_value"
          />
        </div>
        <div>
          <InputLabel htmlFor="current_value" value="Current Value" />
          <TextInput
            id="current_value"
            className="mt-1 block w-full"
            value={data.current_value}
            onChange={(e) => setData('current_value', e.target.value)}
            required
            isFocused
            autoComplete="current_value"
          />
        </div>
        <div>
        <InputLabel htmlFor="state" value="State" />
          <select
            id="state"
            className="mt-1 block w-full"
            value={data.state}
            onChange={(e) => setData('state', e.target.value)}
            required
          >
            <option value="en ligne">En ligne</option>
            <option value="hors ligne">Hors ligne</option>
          </select>
        </div>
        <div>
          <InputLabel htmlFor="message" value="Message" />
          <TextInput
            id="message"
            className="mt-1 block w-full"
            value={data.message}
            onChange={(e) => setData('message', e.target.value)}
            required
            isFocused
            autoComplete="message"
          />
        </div>
        <div>
          <InputLabel htmlFor="rules" value="Rules" />
          <TextInput
            id="rules"
            className="mt-1 block w-full"
            value={data.rules}
            onChange={(e) => setData('rules', e.target.value)}
            required
            isFocused
            autoComplete="rules"
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
