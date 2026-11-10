import React, { useState } from 'react';
import { X, Upload, FileText, Download, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';
import { parseStudentsCsv, downloadSampleCsvFile } from '../../utils/csvParser.js';

export function BulkImportModal() {
  const isImportModalOpen = useTwin3DStore((s) => s.isImportModalOpen);
  const closeImportModal = useTwin3DStore((s) => s.closeImportModal);
  const bulkAddStudents = useTwin3DStore((s) => s.bulkAddStudents);
  const students = useTwin3DStore((s) => s.students);

  const [csvText, setCsvText] = useState('');
  const [parseResult, setParseResult] = useState(null);

  if (!isImportModalOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCsvText(content);
        const result = parseStudentsCsv(content, students);
        setParseResult(result);
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text) => {
    setCsvText(text);
    if (text.trim().length > 0) {
      const result = parseStudentsCsv(text, students);
      setParseResult(result);
    } else {
      setParseResult(null);
    }
  };

  const handleImport = () => {
    if (parseResult && parseResult.students.length > 0) {
      bulkAddStudents(parseResult.students);
      setCsvText('');
      setParseResult(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#131219] border border-white/[0.14] shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-6 space-y-5 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006bff]/20 border border-[#006bff]/40 flex items-center justify-center text-[#9ff0ec]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Bulk Import Students (CSV)</h3>
              <p className="text-xs text-[#c9c3da]">Automatically map batches of students to classroom benches</p>
            </div>
          </div>
          <button
            onClick={closeImportModal}
            className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Download Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex items-center gap-2 text-xs text-[#c9c3da]">
            <FileText className="w-4 h-4 text-[#9ff0ec]" />
            <span>Need the official CSV format schema?</span>
          </div>
          <button
            onClick={() => downloadSampleCsvFile()}
            className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-[#9ff0ec] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Template</span>
          </button>
        </div>

        {/* Upload Drop Zone / Paste Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#c9c3da]">Upload CSV File or Paste Data</label>
            <label className="text-xs text-[#9ff0ec] hover:underline cursor-pointer">
              Choose file...
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <textarea
            rows={5}
            placeholder={`name,usn,department,year,section,classroomId,benchId,seatIndex\nAarav Sharma,1BI22CS091,Computer Science,3rd Year,A,MB-101,,,\nPooja Hegde,1BI22CS092,Computer Science,3rd Year,A,MB-101,,,`}
            value={csvText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#9ff0ec]/50 resize-none"
          />
        </div>

        {/* Parsing Feedback & Validation Preview */}
        {parseResult && (
          <div className="space-y-2.5">
            <div
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs ${
                parseResult.students.length > 0
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {parseResult.students.length > 0 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span className="font-semibold">{parseResult.summary}</span>
              </div>
            </div>

            {/* Preview First 3 Parsed Rows */}
            {parseResult.students.length > 0 && (
              <div className="border border-white/10 rounded-xl overflow-hidden max-h-36 overflow-y-auto custom-scrollbar">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-white/5 text-[#b9b8bb] border-b border-white/10 font-mono">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">USN</th>
                      <th className="p-2">Room</th>
                      <th className="p-2">Bench/Seat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/90">
                    {parseResult.students.slice(0, 5).map((s, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-2 font-medium">{s.name}</td>
                        <td className="p-2 font-mono text-[#9ff0ec]">{s.usn}</td>
                        <td className="p-2">{s.classroomId}</td>
                        <td className="p-2 font-mono text-[#c9c3da]">
                          R{(s.row ?? 0) + 1}:S{(s.seatIndex ?? 0) + 1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Error alerts */}
            {parseResult.errors.length > 0 && (
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 max-h-24 overflow-y-auto custom-scrollbar">
                {parseResult.errors.map((err, i) => (
                  <div key={i} className="py-0.5">• {err}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeImportModal}
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[#c9c3da] text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!parseResult || parseResult.students.length === 0}
            className="px-5 py-2 rounded-lg bg-[#006bff] hover:bg-[#1a7aff] disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import {parseResult?.students?.length || 0} Students</span>
          </button>
        </div>
      </div>
    </div>
  );
}

