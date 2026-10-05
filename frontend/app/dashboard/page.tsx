"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        apiFetch("/admin/dashboard")
            .then(res => res.json())
            .then(data => setStats(data));
            
        apiFetch("/admin/tickets")
            .then(res => res.json())
            .then(data => setTickets(data.tickets || []));
    }, []);

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
            
            {stats && (
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-gray-500">Open Tickets</p>
                        <p className="text-2xl font-bold">{stats.open_tickets}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-gray-500">Resolved</p>
                        <p className="text-2xl font-bold">{stats.resolved_tickets}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-gray-500">Conversations</p>
                        <p className="text-2xl font-bold">{stats.total_conversations}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold">{stats.total_users}</p>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded shadow p-4">
                <h2 className="text-xl font-bold mb-4">Tickets</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Ticket #</th>
                            <th>Customer</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t.id} className="border-b">
                                <td className="py-2">
                                    <Link href={`/dashboard/tickets/${t.id}`} className="text-blue-600 hover:underline">
                                        #{t.id}
                                    </Link>
                                </td>
                                <td>{t.customer_name}</td>
                                <td>{t.subject}</td>
                                <td>{t.status}</td>
                                <td>{new Date(t.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
