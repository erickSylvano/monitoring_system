import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';
import Echo from 'laravel-echo';
import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Statuses({ auth, statuses, types }) {
    const [statusList, setStatusList] = useState(statuses);
    const [filterState, setFilterState] = useState('Tous');
    const [selectedPrefix, setSelectedPrefix] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentTime, setCurrentTime] = useState(Moment());
    const [selectedOS, setSelectedOS] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [hddExistsMap, setHddExistsMap] = useState({});

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

        const hddExistsMapUpdated = {};
        statusList.forEach((status) => {
            if (status.type.type_name === 'HDD') {
                hddExistsMapUpdated[status.host.id] = true;
            }
        });
        setHddExistsMap(hddExistsMapUpdated);

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

    const handleHostAction = async (e) => {
        try {
            await router.put(route('host.update.os.version.host', e.target.id));
            toast.success("Version de l'OS chargée avec succès.", {
                position: 'top-right',
                autoClose: 10000, // Ajustez selon vos besoins
            });
        } catch (error) {
            console.error('Erreur lors de l\'action sur l\'hôte :', error);
        }
    };

    const handleCreateHDDState = async (e) => {
        const hostId = e.target.id;
    
        try {
            await Inertia.post('/status/create/hdd', { host_id: hostId });
            toast.success('État HDD créé avec succès.', {
                position: 'top-right',
                autoClose: 5000, // Ajustez selon vos besoins
            });
        } catch (error) {
            console.error('Erreur lors de la création de l\'état HDD :', error);
        }
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Liste des Serveurs</h2>}
        >
            <Head title="Server" />
            <ToastContainer position="top-right" autoClose={3000} />
        <section>
            <div className="max-w-7xl mx-auto sm:px-0 lg:px-0">
                <div className="bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-2 text-gray-100">
                    <div className="mt-4 flex items-center">
                    {filterState === 'Tous' && (
                                    <div className="flex items-center mr-4">
                                        <label className="mr-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                        </svg>
                                        </label>
                                        <select className="border-gray-400 rounded px-1 py-1 bg-gray-900 text-white" value={selectedPrefix} onChange={(e) => setSelectedPrefix(e.target.value)}>
                                            <option value="">Tous</option>
                                            <option value="EJ">E-jery</option>
                                            <option value="R0">Relais</option>
                                            <option value="Portable">Portable</option>
                                            <option value="IMP">Imprimante</option>
                                        </select>
                                    </div>
                                )}
                                <label className="mr-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                                </svg>
                                </label>
                                <select className="border-gray-400 rounded px-1 py-1 bg-gray-900 text-white" value={selectedOS} onChange={(e) => setSelectedOS(e.target.value)}>
                                    <option value="">Tous</option>
                                    <option value="Windows">Windows</option>
                                    <option value="Linux">Linux</option>
                                </select>
                                {filterState === 'Tous' && (
                                    <div className="flex items-center ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-4 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                        </svg>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                            onClick={toggleSortOrder}
                                        >
                                            {sortOrder === 'asc' ? 'Ascendant' : 'Descendant'}
                                        </button>

                                        {/* <button 
                                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={updateOSVersion}
                                        >
                                            MAJ OS Version
                                        </button> */}

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-4 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                        </svg>
                                        <input
                                            type="text"
                                            className="border-gray-400 rounded px-1 py-1 bg-gray-900 text-white"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Rechercher"
                                        />
                                    </div>
                                )}
                        </div>
                            <div className="overflow-x-auto mt-4">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="border-b dark:border-neutral-500 text-grey-400">
                                            <th scope="col" className="px-4 py-2">
                                                Nom Appareil
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Adresse IP
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                OS
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                OS Version
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Utilisateur
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                État
                                            </th>
                                            <th scope="col" className="px-4 py-2">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                    {filteredStatuses.map(({ id, state, type, host, last_updated_at }) => {
                                        const lastUpdate = Moment(last_updated_at);
                                        const now = Moment();
                                        const isOfflineOver7Days = state === 'Hors ligne' && now.diff(lastUpdate, 'days') >= 7;

                                        return (
                                            <tr
                                                key={id}
                                                className={`border-b dark:border-neutral-500`}
                                            >
                                                <td className="whitespace-nowrap px-4 py-2">
                                                    {host && host.hostname}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2">
                                                    {host && host.ip_address}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2">
                                                    {host && host.os}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2">
                                                    {host && host.os_version}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2">
                                                    {host && host.owner}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-2">
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
                                                <td className="whitespace-nowrap px-4 py-2">
                                                    <button 
                                                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                        id={host.id}
                                                        onClick={handleHostAction}
                                                        >
                                                            Charge OV
                                                    </button>
                                                    {/* Conditionnez le rendu du bouton sur l'existence de l'état HDD */}
                                                    {hddExistsMap[host.id] ? (
                                                            <span></span>
                                                        ) : (
                                                            <button
                                                                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                                id={host.id}
                                                                onClick={handleCreateHDDState}
                                                            >
                                                                Créer état HDD
                                                            </button>
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
        </AuthenticatedLayout>
    );
}
