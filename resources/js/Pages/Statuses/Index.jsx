import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';
import Echo from 'laravel-echo';
import React, { useState, useEffect } from 'react';
import Moment from 'moment';


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
        const channel = window.Echo.channel('statuses');
        const hostChannel = window.Echo.channel('hosts');
        const diskChannel = window.Echo.channel('diskinfo');
        const hddChannel = window.Echo.channel('hdd_states');
        console.log('Connected to channel:', hddChannel);

        hddChannel.listen('.hdd_state.created', (data) => {
            // Mettez à jour votre interface en conséquence avec les données reçues
            console.log('État HDD créé en temps réel :', data);
        
            // Par exemple, vous pourriez mettre à jour une liste d'états HDD comme ceci :
            setStatusList((prevStatuses) => {
                const updatedStatuses = prevStatuses.map((status) => {
                    if (status.host?.id === data.hostId) {
                        return {
                            ...status,
                            state: data.state,
                            message: data.message,
                            // Autres propriétés mises à jour
                        };
                    }
                    return status;
                });
                return updatedStatuses;
            });
        });

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
            setStatusList((prevStatuses) => {
              // Ajoutez le nouvel hôte à la liste des statuts
              const newHostStatus = {
                id: data.host.id, // Utilisez les données reçues pour construire l'objet du statut
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
                // ... Autres champs que vous avez transmis ...
              },
            };
      
            setStatusList((prevStatuses) => [...prevStatuses, newStatus]);
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
            channel.stopListening('.status.created');
            diskChannel.stopListening('.diskinfo.updated');
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
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === 'state') {
                if (a.state === 'Hors ligne' && b.state === 'En ligne') {
                    comparison = -1;
                } else if (a.state === 'En ligne' && b.state === 'Hors ligne') {
                    comparison = 1;
                } else if (a.state && b.state) {
                    comparison = a.state.localeCompare(b.state);
                }
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    };

    const filteredStatuses = sortStatuses(
        statusList.filter(status => {
            if (status.host) {
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
            // Return false or any desired default value if status.host is undefined
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
    
        Inertia.post('/status/create/hdd', { host_id: hostId })
            // .then(response => {
            //     console.log(response.data.message);
            //     // Effectuez le traitement après la création réussie de l'état HDD
            // })
            // .catch(error => {
            //     console.error('Erreur lors de la création de l\'état HDD :', error);
            // });
    }; 
    
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Liste des Objets connectés</h2>}
        >
            <Head title="Statuses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="mt-4 flex items-center">
                        {filterState === 'Tous' && (
                                    <div className="flex items-center mr-4">
                                        <label className="mr-2">Filtrer par Nom :</label>
                                        <select className="border rounded py-1 px-2 text-gray-900" value={selectedPrefix} onChange={(e) => setSelectedPrefix(e.target.value)}>
                                            <option value="">Tous</option>
                                            <option value="EJ">E-jery</option>
                                            <option value="R0">Relais</option>
                                        </select>
                                    </div>
                                )}
                                <label className="mr-2">OS :</label>
                                <select className="border rounded py-1 px-2" value={selectedOS} onChange={(e) => setSelectedOS(e.target.value)}>
                                    <option value="">Tous</option>
                                    <option value="Windows">Windows</option>
                                    <option value="Linux">Linux</option>
                                </select>
                                {/* <label className="mr-2">Filtrer :</label>
                                <select className="border rounded py-1 px-2" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
                                    <option value="Tous">Tous</option>
                                    <option value="En ligne">En ligne</option>
                                    <option value="Hors ligne">Hors ligne</option>
                                </select> */}
                                {filterState === 'Tous' && (
                                    <div className="flex items-center ml-2">
                                        <label className="mr-2">Trier par :</label>
                                        <select className="border rounded py-1 px-2 " value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                            <option value="state">État</option>
                                            <option value="date">Date</option>
                                        </select>
                                        <button
                                            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                            onClick={toggleSortOrder}
                                        >
                                            {sortOrder === 'asc' ? 'Ascendant' : 'Descendant'}
                                        </button>
                                        <button 
                                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={updateOSVersion}
                                        >
                                            MAJ OS Version
                                        </button>
                                        <input
                                            type="text"
                                            className="ml-2 border rounded py-1 px-2 text-gray-900"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Rechercher"
                                        />
                                    </div>
                                )}
                        </div>
                            {/* <button
                                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleCheckPingStatus}
                            >
                                Ping
                            </button> */}
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
                                            </th><th scope="col" className="px-4 py-2">
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
                                                            <span
                                                                className={`w-3 h-3 rounded-full inline-block mr-1 ${isOfflineOver7Days ? 'bg-gray-500' : 'bg-red-500'}`}
                                                            ></span>
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
                                                    <button
                                                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                        id={host.id}
                                                        onClick={handleCreateHDDState}
                                                    >
                                                        Créer état HDD
                                                    </button>

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
            </div>
        </AuthenticatedLayout>
    );
}
