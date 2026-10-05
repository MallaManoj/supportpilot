"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Ticket as TicketIcon, CheckCircle2, MessageSquare, Users, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

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

    const statCards = [
        { label: "Open Tickets", value: stats?.open_tickets, icon: TicketIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Resolved", value: stats?.resolved_tickets, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Conversations", value: stats?.total_conversations, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Users", value: stats?.total_users, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                    Agent Dashboard
                                </h1>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">Manage and resolve customer escalations</p>
                            </div>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group"
                        >
                            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${stat.bg.replace('/10', '')}`} />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-1">
                                        {stats ? stat.value : (
                                            <span className="flex h-6 w-12 mt-1 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                        )}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                {/* Tickets Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                        <div className="flex items-center gap-2">
                            <TicketIcon className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-bold">Recent Escalations</h2>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4">Ticket</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Sparkles className="h-8 w-8 mb-3 text-slate-300 dark:text-slate-700" />
                                                <p>No tickets found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <Link href={`/dashboard/tickets/${t.id}`} className="inline-flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline">
                                                    #{t.id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{t.customer_name}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{t.subject}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    t.status === 'open' 
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' 
                                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
