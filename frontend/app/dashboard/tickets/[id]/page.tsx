"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TicketDetailsPage() {
    const params = useParams();
    const [ticket, setTicket] = useState<any>(null);

    useEffect(() => {
        if (!params?.id) return;
        
        apiFetch(`/admin/tickets/${params.id}`)
            .then(res => res.json())
            .then(data => setTicket(data));
    }, [params?.id]);

    if (!ticket) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-6">
            <Link href="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
            
            <h1 className="text-3xl font-bold">Ticket #{ticket.id}</h1>
            
            <div className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-500">Customer</h3>
                    <p>{ticket.customer_name}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-500">Conversation ID</h3>
                    <p>{ticket.conversation_id}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-500">Subject</h3>
                    <p>{ticket.subject}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-500">Description</h3>
                    <p className="whitespace-pre-wrap">{ticket.description}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-500">Status</h3>
                    <p>{ticket.status}</p>
                </div>
            </div>
        </div>
    );
}
