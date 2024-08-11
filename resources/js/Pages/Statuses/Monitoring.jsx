import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';
import Echo from 'laravel-echo';
import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';


export default function Statuses({ auth, statuses, types }) {
    const [statusList, setStatusList] = useState(statuses);
    const [filterState, setFilterState] = useState('Tous');
    const [selectedPrefix, setSelectedPrefix] = useState('');
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
        const channel = window.Echo.channel('statuses');
        const hostChannel = window.Echo.channel('hosts');


        channel.listen('.status.updated', (data) => {
            // Mettez à jour l'état des éléments de la liste des statuts en conséquence
            console.log('État mis à jour en temps réel :', data);

            setStatusList((prevStatuses) => {
                return prevStatuses.map((status) => {
                    if (status.host?.id === data.hostId) {
                        return { ...status, state: data.state, last_updated_at: data.updated_at }; // Met à jour l'heure en temps réel
                    }
                    return status;
                });
            });
        });

        hostChannel.listen('.host.created', (data) => {
            // Traitez la création d'un nouvel hôte en temps réel
            const newHostStatus = {
                id: data.host.id,
                type: { type_name: 'Server' }, // Ajoutez un type pour identifier cet événement
                host: data.host,
            };

            setStatusList(prevStatuses => [...prevStatuses, newHostStatus]);
        });

        hostChannel.listen('.host.imported', (data) => {
            // Traitez l'importation d'un nouvel hôte en temps réel
            console.log('Imported :', data);
            const newStatus = {
                id: data.host.id,
                type: { type_name: 'Imported' }, // Créer un type de statut factice pour les hôtes importés
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


        const interval = setInterval(() => {
            setCurrentTime(Moment()); // Met à jour l'heure en temps réel
        }, 1000); // Met à jour toutes les secondes

        return () => {
            channel.stopListening('.status.updated');
            channel.stopListening('.host.created');
            channel.stopListening('.host.updated');
            channel.stopListening('.host.deleted');
            channel.stopListening('.host.imported');
            clearInterval(interval);
        };
    }, []);

    const renderTimeSinceLastUpdate = (updatedAt) => {
        const lastUpdate = Moment(updatedAt);
        const duration = Moment.duration(currentTime.diff(lastUpdate));

        const days = Math.floor(duration.asDays());
        const hours = Math.floor(duration.asHours()) - days * 24;
        const minutes = Math.floor(duration.asMinutes()) - days * 24 * 60 - hours * 60;

        if (days > 0) {
            return `${days} jour${days !== 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} heure${hours !== 1 ? 's' : ''}`;
        } else {
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
    };
    

    const sortStatuses = (statusList) => {
        return statusList.sort((a, b) => {
            if (!a.state && !b.state) {
                return 0;
            } else if (!a.state) {
                return -1;
            } else if (!b.state) {
                return 1;
            } else {
                const stateComparison = b.state.localeCompare(a.state);
                return sortOrder === 'asc' ? stateComparison : -stateComparison;
            }
        });
    };
    

    const filteredStatuses = sortStatuses(
        statusList.filter(status => {
            if (
                (status.host && status.type && status.type.type_name === 'Server') ||
                (status.type && status.type.type_name === 'Imported') // Ajoutez cette condition pour les hôtes importés
            ) {
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
        router.put(route("host.update.os.version.host", e.target.id));
    }

    const handleCreateHDDState = (e) => {
        const hostId = e.target.id;
    
        Inertia.post('/status/create/hdd', { host_id: hostId });
            // .then(response => {
            //     console.log(response.data.message);
            //     // Effectuez le traitement après la création réussie de l'état HDD
            // })
            // .catch(error => {
            //     console.error('Erreur lors de la création de l\'état HDD :', error);
            // });
    };   
    
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
                                            <option value="Portable">Portable</option>
                                            <option value="IMP">Imprimante</option>
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
                                    href={route('pc')}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    <button className="px-1 py-0 text-white bg-blue-500 rounded-md focus:outline-none mr-4 ml-4">
                                        Liste PC
                                    </button>
                                </Link>
                                </div>
                                <div>
                                <Link
                                    href={route('hdd')}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    <button className="px-1 py-0 text-white bg-blue-500 rounded-md focus:outline-none mr-4 ml-4">
                                        Etat HDD
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
                                                Adresse IP
                                            </th>
                                            <th scope="col" className="px-6">
                                                Utilisateur
                                            </th>
                                            <th scope="col" className="px-6">
                                                État
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                    {filteredStatuses.map(({ id, state, type, host, last_updated_at }) => {
                                        const lastUpdate = Moment(last_updated_at);
                                        const now = Moment();
                                        const isOfflineOver7Days = state === 'Hors ligne' && now.diff(lastUpdate, 'days') >= 7;

                                        return (
                                            <tr
                                                key={id}
                                                className={`border-b dark:border-neutral-500`}
                                            >
                                                <td className="whitespace-nowrap px-6">
                                                    {host && host.hostname}
                                                </td>
                                                <td className="whitespace-nowrap px-6">
                                                    {host && host.ip_address}
                                                </td>
                                                <td className="whitespace-nowrap px-6">
                                                    {host && host.owner}
                                                </td>
                                                <td className="whitespace-nowrap px-4">
                                                    <div className="flex items-center">
                                                        {state === 'En ligne' && (
                                                            <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-1"></span>
                                                        )}
                                                        {state === 'Hors ligne' && (
                                                            <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-1"></span>
                                                        )}
                                                        <span>{state}</span>
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            {renderTimeSinceLastUpdate(last_updated_at)}
                                                        </span>
                                                    </div>
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
                                En ligne : {filteredStatuses.filter(status => status.state === 'En ligne').length}
                            </div>
                            <div className="text-center text-gray-500 mr-4">
                                Hors ligne : {filteredStatuses.filter(status => status.state === 'Hors ligne').length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
