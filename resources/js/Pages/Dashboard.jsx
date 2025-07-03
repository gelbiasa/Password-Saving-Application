import React from 'react';
import Layout from '../Components/Layouts/Layout';

const Dashboard = () => {
    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Total Passwords</h3>
                        <p className="text-3xl font-bold text-blue-600">25</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Weak Passwords</h3>
                        <p className="text-3xl font-bold text-red-600">3</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Strong Passwords</h3>
                        <p className="text-3xl font-bold text-green-600">22</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;