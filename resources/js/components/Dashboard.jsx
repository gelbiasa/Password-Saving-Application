import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

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
                
                <main className="flex-1 p-4 relative">
                    <div className="space-y-4 max-w-7xl">
                        {/* Page Header */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                                    <p className="text-gray-600 mt-1 text-sm">Welcome back! Here's your password security overview.</p>
                                </div>
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Add Password</span>
                                </button>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard 
                                title="Total Passwords"
                                value={data.totalPasswords}
                                color="indigo"
                                icon="lock"
                            />
                            <StatCard 
                                title="Weak Passwords"
                                value={data.weakPasswords}
                                color="red"
                                icon="warning"
                            />
                            <StatCard 
                                title="Strong Passwords"
                                value={data.strongPasswords}
                                color="green"
                                icon="check"
                            />
                        </div>

                        {/* Recent Activity */}
                        <RecentActivity />
                        
                        {/* Add padding bottom to make space for floating footer */}
                        <div className="pb-16"></div>
                    </div>
                    
                    {/* Floating Footer */}
                    <Footer />
                </main>
            </div>
        </div>
    );
};

// Component untuk kartu statistik
const StatCard = ({ title, value, color, icon }) => {
    const colorClasses = {
        indigo: 'bg-indigo-100 text-indigo-600',
        red: 'bg-red-100 text-red-600',
        green: 'bg-green-100 text-green-600'
    };

    const iconPaths = {
        lock: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
        warning: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
        check: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d={iconPaths[icon]} clipRule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

// Component untuk recent activity
const RecentActivity = () => {
    const activities = [
        { text: "Password for Gmail updated", time: "2 hours ago", color: "green" },
        { text: "New password added for Facebook", time: "1 day ago", color: "indigo" },
        { text: "Weak password detected for Instagram", time: "3 days ago", color: "yellow" }
    ];

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-4">
                <div className="space-y-3">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className={`w-2 h-2 bg-${activity.color}-400 rounded-full`}></div>
                            <span className="text-sm text-gray-600">{activity.text}</span>
                            <span className="text-xs text-gray-400 ml-auto">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;