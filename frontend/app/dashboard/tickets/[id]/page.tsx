"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Ticket as TicketIcon, User, Calendar, MessageSquare, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function TicketDetailsPage() {
    const params = useParams();
    const [ticket, setTicket] = useState<any>(null);

    useEffect(() => {
        if (!params?.id) return;
        
        apiFetch(`/admin/tickets/${params.id}`)
            .then(res => res.json())
            .then(data => setTicket(data));
    }, [params?.id]);

    if (!ticket) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-medium animate-pulse">Loading ticket details...</p>
            </div>
        </div>
    );

    const isResolved = ticket.status === 'resolved';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Navigation */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm group">
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center text-white shadow-lg border border-slate-600 dark:border-slate-700">
                                <TicketIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">Escalation details and resolution tracking</p>
                            </div>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
                
                {/* Main Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Column - Details */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                <h2 className="text-xl font-bold">{ticket.subject}</h2>
                            </div>
                            <div className="p-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" /> Description
                                </h3>
                                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{ticket.description}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Right Column - Metadata */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 space-y-6">
                            
                            {/* Status Badge */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Current Status</h3>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border ${
                                    isResolved 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                }`}>
                                    {isResolved ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    {ticket.status}
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-800" />
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        <User className="h-3.5 w-3.5" /> Customer
                                    </div>
                                    <p className="font-medium">{ticket.customer_name}</p>
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        <TicketIcon className="h-3.5 w-3.5" /> Conversation ID
                                    </div>
                                    <Link href={`/dashboard`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                        #{ticket.conversation_id}
                                    </Link>
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        <Calendar className="h-3.5 w-3.5" /> Created On
                                    </div>
                                    <p className="font-medium flex items-center gap-2">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                        <span className="text-slate-400 font-normal text-sm flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
