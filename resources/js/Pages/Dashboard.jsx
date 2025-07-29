import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const Dashboard = () => {
    const [data, setData] = useState({
        totalPasswords: 0,
        weakPasswords: 0,
        strongPasswords: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard-data');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setData({
                totalPasswords: 25,
                weakPasswords: 3,
                strongPasswords: 22
            });
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Full Height */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <Header />
                
                {/* Background terang abu-abu biru */}
                <main className="flex-1 p-6 bg-gradient-to-br from-slate-100 via-blue-100 to-gray-100 relative">
                    {/* Decorative elements untuk background terang */}
                    <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-blue-100/40 to-slate-200/40 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-l from-slate-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
                    
                    <div className="space-y-6 max-w-7xl relative z-10">
                        {/* Page Header - Background putih dengan shadow lebih halus */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                                    <p className="text-slate-600 mt-2 text-sm font-medium">
                                        Selamat datang kembali di Password Manager! Berikut adalah ringkasan keamanan password Anda.
                                    </p>
                                </div>
                                {/* Button Add Password dengan tema black-gold */}
                                <button className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-black px-4 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 font-semibold text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Tambah Password</span>
                                </button>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                title="Total Password"
                                value={data.totalPasswords}
                                color="blue"
                                icon="lock"
                            />
                            <StatCard 
                                title="Password Lemah"
                                value={data.weakPasswords}
                                color="red"
                                icon="warning"
                            />
                            <StatCard 
                                title="Password Kuat"
                                value={data.strongPasswords}
                                color="green"
                                icon="check"
                            />
                        </div>

                        {/* Recent Activity */}
                        <RecentActivity />
                        
                        {/* Add padding bottom untuk footer */}
                        <div className="pb-16"></div>
                    </div>
                    
                    {/* Floating Footer */}
                    <Footer />
                </main>
            </div>
        </div>
    );
};

// Component untuk kartu statistik - diperbarui dengan tema terang
const StatCard = ({ title, value, color, icon }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50/80',
            icon: 'bg-blue-100 text-blue-600',
            text: 'text-blue-600',
            border: 'border-blue-100'
        },
        red: {
            bg: 'bg-red-50/80',
            icon: 'bg-red-100 text-red-600',
            text: 'text-red-600',
            border: 'border-red-100'
        },
        green: {
            bg: 'bg-green-50/80',
            icon: 'bg-green-100 text-green-600',
            text: 'text-green-600',
            border: 'border-green-100'
        }
    };

    const iconPaths = {
        lock: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
        warning: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
        check: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
    };

    return (
        <div className={`bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border ${colorClasses[color].border} hover:scale-105 group`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${colorClasses[color].icon} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d={iconPaths[icon]} clipRule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-semibold text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className={`text-3xl font-bold ${colorClasses[color].text} group-hover:scale-105 transition-transform duration-300`}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Component untuk recent activity - diperbarui dengan tema terang
const RecentActivity = () => {
    const activities = [
        { text: "Password Gmail diperbarui", time: "2 jam yang lalu", color: "green" },
        { text: "Password baru ditambahkan untuk Facebook", time: "1 hari yang lalu", color: "blue" },
        { text: "Password lemah terdeteksi untuk Instagram", time: "3 hari yang lalu", color: "yellow" }
    ];

    const activityColors = {
        green: 'bg-green-400',
        blue: 'bg-blue-400',
        yellow: 'bg-yellow-400'
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50">
            <div className="p-6 border-b border-slate-200/50">
                <h2 className="text-xl font-bold text-slate-800">Aktivitas Terbaru</h2>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-300 group">
                            <div className={`w-3 h-3 ${activityColors[activity.color]} rounded-full shadow-sm animate-pulse`}></div>
                            <span className="text-sm text-slate-700 group-hover:text-slate-800 transition-colors duration-300 flex-1 font-medium">
                                {activity.text}
                            </span>
                            <span className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-300 font-medium">
                                {activity.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;