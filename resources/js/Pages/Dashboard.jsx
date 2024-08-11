import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Title, Tooltip, CategoryScale } from 'chart.js';

Chart.register(ArcElement, Title, Tooltip, CategoryScale);

const circleStatisticsStyle = {
  maxHeight: '175px',
};

const CircleStatistics = ({ label, data, total }) => {
  const percentageOnline = ((data.online / total) * 100).toFixed(2); // Arrondir le pourcentage à 2 décimales
  const percentageOffline = ((data.offline / total) * 100).toFixed(2);
  const percentageOk = ((data.ok / total) * 100).toFixed(2); // Arrondir le pourcentage à 2 décimales
  const percentageFull = ((data.full / total) * 100).toFixed(2);

  const chartData = {
    labels: ['En Ligne', 'Hors Ligne' , 'Ok', 'Disque plein'],
    datasets: [
      {
        data: [percentageOnline, percentageOffline,percentageOk,percentageFull],
        backgroundColor: ['#4CAF50', '#ed3e3e','#4CAF50', '#ed3e3e'],
      },
    ],
  };

  // Configuration des tooltips
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    plugins: {
      legend: false, // Désactiver la légende
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            return `${context.label}: ${chartData.datasets[0].data[dataIndex]}%`;
          },
        },
      },
      datalabels: { // Ajouter les pourcentages à l'intérieur des cercles
        color: '#fff',
        anchor: 'center',
        align: 'center',
        formatter: (value) => `${value}%`,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="text-center" style={circleStatisticsStyle}>
      <h3 className="text-lg font-semibold">{label}</h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default function Dashboard({ auth }) {
  const [dashboardData, setDashboardData] = useState({
    totalPCStatus: 0,
    onlinePCStatus: 0,
    offlinePCStatus: 0,
    totalServerStatus: 0,
    onlineServerStatus: 0,
    offlineServerStatus: 0,
    totalHddStatus: 0,
    okHddStatus: 0,
    fullHddStatus: 0,
  });

  const [circleData, setCircleData] = useState({
    pcData: 0,
    serverData: 0,
    hddData: 0,
  });

  const fetchDashboardData = () => {
    fetch('/dashboard/data')
      .then((response) => response.json())
      .then((data) => {
        setDashboardData(data);

        // Mettez à jour les données des cercles
        setCircleData({
          pcData: data.totalPCStatus,
          serverData: data.totalServerStatus,
          hddData: data.totalHddStatus,
        });
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données du tableau de bord :', error);
      });
  };

  useEffect(() => {

    fetchDashboardData();

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Tableau de bord</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="p-2 max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className=" grid grid-cols-6 gap-6 text-gray-800">
                            <div className="rounded-lg p-2 bg-blue-300">
                                <h3 className="text-lg font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 inline-block align-middle text-gray-800">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                                </svg>
                                <span className="ml-2">PC Total</span>
                                </h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.totalPCStatus}</p>
                            </div>
                                
                            <div className="rounded-lg p-2 bg-green-300">
                                <h3 className="text-lg font-semibold">PC En ligne</h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.onlinePCStatus}</p>
                            </div>
                            <div className="rounded-lg p-2 bg-red-300">
                                <h3 className="text-lg font-semibold">PC Hors ligne</h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.offlinePCStatus}</p>
                            </div>
                            <div className="rounded-lg p-2 bg-blue-300">
                                <h3 className="text-lg font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block align-middle text-gray-800">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
                                </svg>
                                <span className="ml-2">Server Total</span>
                                </h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.totalServerStatus}</p>
                            </div>
                            <div className="rounded-lg p-2 bg-green-300">
                                <h3 className="text-lg font-semibold">Server En ligne</h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.onlineServerStatus}</p>
                            </div>
                            <div className="rounded-lg p-2 bg-red-300">
                                <h3 className="text-lg font-semibold">Server Hors ligne</h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.offlineServerStatus}</p>
                            </div>
                            <div className="rounded-lg p-2 bg-blue-300">
                                <h3 className="text-lg font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline-block align-middle text-gray-800">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
                                  </svg>
                                  <span className="ml-2">HDD Total</span>
                                </h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.totalHddStatus}</p>
                            </div>
                            <div className="rounded-lg p-2 bg-green-300">
                                <h3 className="text-lg font-semibold">HDD Ok</h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.okHddStatus}</p>
                            </div>
                            <div className="rounded-lg p-2 bg-red-300">
                                <h3 className="text-lg font-semibold">Disque Plein</h3>
                                <p className="text-3xl font-semibold text-right">{dashboardData.fullHddStatus}</p>
                            </div>
                            </div>
                            <div className="p-6 grid grid-cols-3 gap-3 text-gray-400">
                                <div className="rounded-lg">
                                <CircleStatistics label="PC" data={{ online: dashboardData.onlinePCStatus, offline: dashboardData.offlinePCStatus }} total={dashboardData.totalPCStatus} />

                                </div>
                                <div className="rounded-lg">
                                    <CircleStatistics label="Server" data={{ online: dashboardData.onlineServerStatus, offline: dashboardData.offlineServerStatus }} total={dashboardData.totalServerStatus} />
                                </div>
                                <div className="rounded-lg">
                                    <CircleStatistics label="HDD" data={{ ok: dashboardData.okHddStatus, full: dashboardData.fullHddStatus }} total={dashboardData.totalHddStatus} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}
