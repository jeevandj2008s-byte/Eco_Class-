import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LifeBuoy,
  PlusCircle,
  Kanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  Star,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '../lib/utils.js';

export default function HelpdeskPage({ onOpenReportModal }) {
  const [tickets, setTickets] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(json => {
        if (json.success) setTickets(json.data);
      })
      .catch(() => {});
  }, []);

  const filtered = tickets.filter(t => {
    const matchesCat = filterCategory ? t.category === filterCategory : true;
    const matchesUrg = filterUrgency ? t.urgency === filterUrgency : true;
    const matchesSearch = searchTerm
      ? t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCat && matchesUrg && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-[#006bff]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#bdf7ee]">
              Campus Helpdesk & Issue Tracker
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 tracking-tight leading-[1.15]">
            Student & Faculty Incident Resolution Hub
          </h1>
          <p className="text-xs text-[#b9b8bb] mt-1 font-normal">
            Crowdsourced campus care • Direct routing from reporter to HOD to technician
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2.5 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-xs shadow-cal-btn flex items-center gap-2 transition hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>3-Tap Quick Report</span>
          </button>
          <Link
            to="/helpdesk/board"
            className="px-4 py-2.5 rounded-lg bg-[#f0f3f8] hover:bg-[#e6f0ff] text-[#0b3558] font-semibold text-xs border border-[#d4e0ed] flex items-center gap-2 transition"
          >
            <Kanban className="w-4 h-4 text-[#006bff]" />
            <span>HOD Kanban Board</span>
          </Link>
          <Link
            to="/helpdesk/my-tasks"
            className="px-4 py-2.5 rounded-lg bg-[#f0f3f8] hover:bg-[#e6f0ff] text-[#0b3558] font-semibold text-xs border border-[#d4e0ed] flex items-center gap-2 transition"
          >
            <User className="w-4 h-4 text-[#006bff]" />
            <span>Worker Mobile Tasks</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#476788]" />
          <input
            type="text"
            placeholder="Search tickets by ID, title, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-[#0b3558] placeholder-[#a6bbd1] w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Garbage and Waste">Garbage & Waste</option>
            <option value="Energy Waste">Energy Waste</option>
            <option value="Lifts and Elevators">Lifts & Elevators</option>
            <option value="Washroom and Hygiene">Washroom & Hygiene</option>
            <option value="Electrical">Electrical</option>
          </select>

          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] focus:outline-none"
          >
            <option value="">All Urgencies</option>
            <option value="emergency">🚨 Emergency</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.ticketId}
            className="p-5 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card hover:border-[#006bff]/40 hover:shadow-cal-btn transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#006bff]">{t.ticketId}</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    t.urgency === 'emergency'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                      : t.urgency === 'high'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-[#e6f0ff] text-[#006bff] border border-[#b8d5ff]'
                  }`}
                >
                  {t.urgency}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#0b3558] line-clamp-1">{t.title}</h4>
              <p className="text-xs text-[#476788] line-clamp-2">{t.description}</p>
            </div>

            <div className="pt-3 border-t border-[#d4e0ed] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#476788] text-[11px]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#a6bbd1]" />
                  {t.locationRef.buildingId}
                </span>
                <span className="capitalize font-semibold text-[#006bff]">{t.status.replace('_', ' ')}</span>
              </div>

              {t.rating && (
                <div className="flex items-center gap-1 text-amber-600 text-[11px] font-semibold">
                  <span>★ {t.rating} Stars Rating Verified</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
