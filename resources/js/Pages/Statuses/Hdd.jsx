import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';
import Echo from 'laravel-echo';
import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import { Link } from '@inertiajs/inertia-react';


export default function Statuses({ auth, statuses, types }) {
    const [statusList, setStatusList] = useState(statuses);
    const [typeList, setTypeList] = useState(types); 
    const [filterState, setFilterState] = useState('Tous');
    const [selectedPrefix, setSelectedPrefix] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentTime, setCurrentTime] = useState(Moment());
    const [selectedOS, setSelectedOS] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleCheckPingStatus = () => {
        // Appeler la route pour vérifier l'état de toutes les adresses IP
        Inertia.get(route('statuses.check-ping')).catch((error) => {
            console.error("Erreur lors de la vérification de l'état :", error);
        });
    };

    useEffect(() => {
        //const channel = window.Echo.channel('statuses');
        const hostChannel = window.Echo.channel('hosts');
        const diskChannel = window.Echo.channel('diskinfo');

        diskChannel.listen('.diskinfo.updated', (data) => { 
            console.log('Informations de disque mises à jour en temps réel :', data);
            
            setStatusList((prevStatuses) => {
                return prevStatuses.map((status) => {
                    if (status.host?.id === data.hostId) {
                        return {
                            ...status,
                            state: data.state,
                            reference_value: data.total,
                            current_value: data.used,
                            last_updated_at: data.updated_at,
                        };
                    }
                    return status;
                });
            });
        });

        hostChannel.listen('.host.created', (data) => {
            // Traitez la création d'un nouvel hôte en temps réel
            setStatusList((prevStatuses) => {
              // Ajoutez le nouvel hôte à la liste des statuts
              const newHostStatus = {
                id: data.host.id,
                host: data.host,
              };
              return [...prevStatuses, newHostStatus];
            });
          });
      
          hostChannel.listen('.host.updated', (data) => {
            // Traitez la mise à jour d'un hôte en temps réel
            setStatusList((prevStatuses) => {
              return prevStatuses.map((status) => {
                if (status.host.id === data.host.id) {
                  // Mettre à jour les données de l'hôte
                  return { ...status, host: data.host };
                }
                return status;
              });
            });
          });

          hostChannel.listen('.host.deleted', (data) => {
            // Traitez la suppression d'un hôte en temps réel
            setStatusList((prevStatuses) => {
              return prevStatuses.filter((status) => status.host.id !== data.hostId);
            });
          });

          hostChannel.listen('.host.imported', (data) => {
            // Traitez l'importation d'un nouvel hôte en temps réel
            const newStatus = {
              id: data.host.id,
              type: null,
              host: {
                id: data.host.id,
                hostname: data.host.hostname,
                ip_address: data.host.ip_address,
                os: data.host.os,
                owner: data.host.owner,
              },
            };
      
            setStatusList((prevStatuses) => [...prevStatuses, newStatus]);
          });

        const interval = setInterval(() => {
            setCurrentTime(Moment()); // Met à jour l'heure en temps réel
        }, 1000); // Met à jour toutes les secondes

        return () => {
            hostChannel.stopListening('.host.created');
            hostChannel.stopListening('.host.updated');
            hostChannel.stopListening('.host.deleted');
            hostChannel.stopListening('.host.imported');
            diskChannel.stopListening('.diskinfo.updated');
            clearInterval(interval);
        };
    }, []);
    

    const sortStatuses = (statusList) => {
        return statusList.sort((a, b) => {
            if (!a.state && !b.state) {
                return 0;
            } else if (!a.state) {
                return -1;
            } else if (!b.state) {
                return 1;
            } else {
                const stateComparison = a.state.localeCompare(b.state);
                return sortOrder === 'asc' ? stateComparison : -stateComparison;
            }
        });
    };

    const filteredStatuses = sortStatuses(
        statusList.filter(status => {
            if (status.host && status.type && status.type.type_name === 'HDD') { // Filtrer par type "HDD"
                const query = searchQuery.toLowerCase();
                const hostname = status.host.hostname ? status.host.hostname.toLowerCase() : '';
                const owner = status.host.owner ? status.host.owner.toLowerCase() : '';
                const ip = status.host.ip_address ? status.host.ip_address.toLowerCase() : '';
                
                if (filterState === 'Tous') {
                    return (
                        (!selectedPrefix || status.host.hostname.startsWith(selectedPrefix)) &&
                        (!selectedOS || status.host.os === selectedOS) &&
                        (
                            !searchQuery ||
                            hostname.includes(query) || owner.includes(query) || ip.includes(query)
                        )
                    );
                } else {
                    return (
                        status.state === filterState &&
                        (!selectedPrefix || status.host.hostname.startsWith(selectedPrefix)) &&
                        (!selectedOS || status.host.os === selectedOS) &&
                        (
                            !searchQuery ||
                            hostname.includes(query) || owner.includes(query) || ip.includes(query)
                        )
                    );
                }
            }
            return false;
        })
    );
    

    const toggleSortOrder = () => {
        setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    };

    const updateOSVersion = () => {
        router.put(route("host.update.os.version"));
    }

    const handleHostAction = (e) => {
        router.put(route("host.update.disk.info.host", e.target.id));
    }


    return (
        <section>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="bg-gray-800 overflow-hidden shadow-sm">
                    <div className="text-gray-100">
                    <div className="flex items-center">
                        {filterState === 'Tous' && (
                                    <div className="flex items-center mr-4">
                                        <label className="mr-2">Filtrer par Nom :</label>
                                        <select className="border-gray-400 rounded px-1 py-1 bg-gray-900 text-white" value={selectedPrefix} onChange={(e) => setSelectedPrefix(e.target.value)}>
                                            <option value="">Tous</option>
                                            <option value="EJ">E-jery</option>
                                            <option value="R0">Relais</option>
                                        </select>
                                    </div>
                                )}
                                <label className="mr-2">OS :</label>
                                <select className="border-gray-400 rounded px-1 py-1 bg-gray-900 text-white" value={selectedOS} onChange={(e) => setSelectedOS(e.target.value)}>
                                    <option value="">Tous</option>
                                    <option value="Windows">Windows</option>
                                    <option value="Linux">Linux</option>
                                </select>
                                {filterState === 'Tous' && (
                                    <div className="flex items-center ml-2">
                                        <button
                                            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                            onClick={toggleSortOrder}
                                        >
                                            {sortOrder === 'asc' ? 'Ascendant' : 'Descendant'}
                                        </button>
                                        <input
                                            type="text"
                                            className="ml-4 border-gray-400 rounded px-1 py-1 bg-gray-900 text-white"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Rechercher"
                                        />
                                    </div>
                                )}
                                <div>
                                <Link
                                    href={route('monitoring')}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    <button className="px-1 py-0 text-white bg-blue-500 rounded-md focus:outline-none mr-4 ml-4">
                                        Liste Server
                                    </button>
                                </Link>
                                </div>
                                <div>
                                <Link
                                    href={route('pc')}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    <button className="px-1 py-0 text-white bg-blue-500 rounded-md focus:outline-none mr-4 ml-4">
                                        Liste PC
                                    </button>
                                </Link>
                                </div>
                        </div>
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="border-b dark:border-neutral-500 text-grey-400">
                                            <th scope="col" className="px-6">
                                                Nom Appareil
                                            </th>
                                            <th scope="col" className="px-6">
                                                OS
                                            </th>
                                            <th scope="col" className="px-6">
                                                Utilisateur
                                            </th>
                                            <th scope="col" className="px-6">
                                                Espace Total
                                            </th>
                                            <th scope="col" className="px-6">
                                                Espace Utilisé
                                            </th>
                                            <th scope="col" className="px-6">
                                                Etat
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {filteredStatuses.map(({ id, state,reference_value,current_value, type, host, last_updated_at }) => {
                                        

                                        return (
                                            <tr
                                                key={id}
                                                className={`border-b dark:border-neutral-500`}
                                            >
                                                <td className="whitespace-nowrap px-6">
                                                    {host && host.hostname}
                                                </td>
                                                <td className="whitespace-nowrap px-6">
                                                    {host && host.os}
                                                </td>
                                                <td className="whitespace-nowrap px-6">
                                                    {host && host.owner}
                                                </td>
                                                <td className="whitespace-nowrap px-6 text-right">
                                                    {reference_value}Go
                                                </td>
                                                <td className="whitespace-nowrap px-6 text-right">
                                                    {current_value}Go
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2">
                                                    {state === 'Ok' ? (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-green-500">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {state}
                                                        </div>
                                                    ) : state === 'Disque plein' ? (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                            </svg>
                                                            {state}
                                                        </div>
                                                    ) : (
                                                        state
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <div className="text-center text-gray-500 mr-4">
                                Nombre total des appareils : {filteredStatuses.length}
                            </div>
                            <div className="text-center text-gray-500 mr-4">
                                Ok : {filteredStatuses.filter(status => status.state === 'Ok').length}
                            </div>
                            <div className="text-center text-gray-500 mr-4">
                                Disque plein : {filteredStatuses.filter(status => status.state === 'Disque plein').length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
