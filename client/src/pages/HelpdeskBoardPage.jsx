import React, { useState, useEffect } from 'react';
import {
  Kanban,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../lib/utils.js';

export default function HelpdeskBoardPage() {
  const [tickets, setTickets] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(json => { if (json.success) setTickets(json.data); })
      .catch(() => {});

    fetch('/api/users/workers')
      .then(res => res.json())
      .then(json => { if (json.success) setWorkers(json.data); })
      .catch(() => {});
  }, []);

  const columns = [
    { id: 'new', title: 'New Incidents', color: 'border-t-4 border-t-[#006bff]' },
    { id: 'assigned', title: 'Assigned to Tech', color: 'border-t-4 border-t-[#0099ff]' },
    { id: 'in_progress', title: 'In Progress', color: 'border-t-4 border-t-amber-500' },
    { id: 'resolved', title: 'Resolved (Proof Attached)', color: 'border-t-4 border-t-emerald-500' },
    { id: 'closed', title: 'Closed & Verified', color: 'border-t-4 border-t-[#476788]' }
  ];

  const handleSmartAssign = async (ticket) => {
    try {
      const res = await fetch(`/api/tickets/${ticket.ticketId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: 'Smart-routed based on skill and proximity' })
      });
      const data = await res.json();
      if (data.success) {
        sounds.playChime('success');
        // Update local state
        setTickets(prev => prev.map(t => t.ticketId === ticket.ticketId ? data.data : t));
      }
    } catch {}
  };

  const handleAdvanceStatus = async (ticket, nextStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticket.ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        sounds.playChime('bubble');
        setTickets(prev => prev.map(t => t.ticketId === ticket.ticketId ? data.data : t));
      }
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="w-4 h-4 text-[#006bff]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#006bff]">
              HOD Management Console
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0b3558] mt-1 tracking-tight">
            Department Incident Dispatch & SLA Kanban
          </h1>
          <p className="text-xs text-[#476788] mt-1">
            AIML Department • Auto-routing with skills matrix & live worker workloads
          </p>
        </div>

        <div className="text-xs text-[#476788] font-mono">
          Available Technicians: <span className="text-[#006bff] font-bold">{workers.filter(w => w.availability === 'available').length} of {workers.length}</span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTickets = tickets.filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`p-4 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card ${col.color} min-w-[240px] flex flex-col space-y-3`}
            >
              <div className="flex items-center justify-between border-b border-[#d4e0ed] pb-2">
                <span className="text-xs font-bold text-[#0b3558]">{col.title}</span>
                <span className="text-xs font-mono font-bold text-[#006bff] bg-[#e6f0ff] px-2 py-0.5 rounded-full border border-[#b8d5ff]">
                  {colTickets.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {colTickets.map((t) => (
                  <div
                    key={t.ticketId}
                    className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed] hover:border-[#006bff]/40 hover:shadow-cal-sm transition space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#006bff] font-bold">{t.ticketId}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        t.urgency === 'emergency'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-[#e6f0ff] text-[#006bff] border border-[#b8d5ff]'
                      }`}>
                        {t.urgency}
                      </span>
                    </div>

                    <h5 className="font-bold text-[#0b3558] line-clamp-1">{t.title}</h5>
                    <p className="text-[11px] text-[#476788] line-clamp-2">{t.description}</p>

                    <div className="flex items-center justify-between text-[10px] text-[#476788] pt-1 border-t border-[#d4e0ed]">
                      <span>{t.locationRef?.buildingId}</span>
                      {col.id === 'new' && (
                        <button
                          onClick={() => handleSmartAssign(t)}
                          className="px-2 py-0.5 rounded-lg bg-[#e6f0ff] hover:bg-[#d8e8ff] text-[#006bff] font-bold flex items-center gap-1 border border-[#b8d5ff] transition"
                          title="Smart Assign to best available technician"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Smart Assign</span>
                        </button>
                      )}
                      {col.id === 'assigned' && (
                        <button
                          onClick={() => handleAdvanceStatus(t, 'in_progress')}
                          className="px-2.5 py-0.5 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-bold transition"
                        >
                          Start →
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colTickets.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-[#a6bbd1]">
                    No tickets in this state.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
