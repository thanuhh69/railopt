import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layers, Play, CheckCircle2, Sparkles, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import BeforeAfterVisualizer from '../../components/BeforeAfterVisualizer';
import DetailModal from '../../components/DetailModal';

const DEFAULT_BLOCKS = [
  {
    blockId: 'BLK-2026-001',
    date: '2026-09-15',
    corridorId: 'VJA-GNT',
    startTime: '11:30',
    endTime: '13:00',
    totalDuration: 90,
    departments: ['Engineering', 'Signal & Telecommunication', 'Traction Distribution'],
    tasks: ['ENG-1042', 'ST-3021', 'TR-5012'],
    priorityLevel: 'Critical',
    status: 'Proposed',
    trainConflictsCount: 0,
    corridorConflictsCount: 0,
    deadlineConflictsCount: 0,
    beforeOccupationHours: 3.0,
    afterOccupationHours: 1.5
  }
];

export default function BlockPlanning() {
  const location = useLocation();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [demoBanner, setDemoBanner] = useState(location.state?.demoSuccess || false);

  const steps = [
    'Loading maintenance data from TMS, SMMS, TDMS',
    'Checking section corridor availability windows',
    'Cross-referencing COA passenger & freight train timetables',
    'Calculating Grok AI & Fallback task priority scores',
    'Detecting train, corridor, and deadline conflicts',
    'Executing constraint solver & multi-department block bundler',
    'Generating final weekly & monthly coordinated maintenance block plan'
  ];

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/planning/blocks');
      if (res.data?.success && res.data.blocks?.length > 0) {
        setBlocks(res.data.blocks);
      } else {
        setBlocks(DEFAULT_BLOCKS);
      }
    } catch (err) {
      console.error('API Error, using fallback blocks dataset:', err);
      setBlocks(DEFAULT_BLOCKS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleGeneratePlan = async () => {
    setGenerating(true);
    setCurrentStep(0);
    setDemoBanner(false);

    // Animate progress steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      const res = await api.post('/planning/generate');
      if (res.data?.success) {
        setBlocks(res.data.blocks);
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateStatus = async (blockId, status) => {
    try {
      await api.patch(`/planning/blocks/${blockId}/status`, { status });
      fetchBlocks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#002B49] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-400" />
            Central Maintenance Block Optimizer Engine
          </h2>
          <p className="text-xs text-[#E6F0FA] mt-1 max-w-2xl font-medium">
            Multi-department constraint solver. Minimizes total corridor blockade duration by bundling Engineering, S&T, and Traction tasks into free windows between train movements.
          </p>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-5 h-5 fill-slate-950" />
          {generating ? 'OPTIMIZING BLOCK PLAN...' : 'GENERATE OPTIMIZED BLOCK PLAN'}
        </button>
      </div>

      {demoBanner && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>DEMO SCENARIO EXECUTED: Corridor VJA-GNT on 15 Sep 2026 train conflict resolved & coordinated block BLK-2026-DEMO generated (11:30–13:00)!</span>
          </div>
          <span className="text-[11px] font-mono uppercase bg-amber-200/80 px-2 py-0.5 rounded">Prototype Demo</span>
        </div>
      )}

      {/* 7-Step Animated Processing Overlay Modal */}
      {generating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full border border-slate-200 shadow-2xl text-slate-900">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold mb-3 border border-blue-200 animate-spin">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black tracking-tight">RAILOPT Engine Running</h3>
              <p className="text-xs text-slate-500 mt-0.5">Optimizing maintenance blocks across all railway divisions...</p>
            </div>

            <div className="space-y-3 text-xs">
              {steps.map((stepText, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-semibold'
                        : isCurrent
                        ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      ) : isCurrent ? (
                        <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></span>
                      ) : (
                        <span className="text-[10px] font-mono">{idx + 1}</span>
                      )}
                    </div>
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Summary Metrics Banner */}
      {metrics && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PLAN GENERATED METRICS SUMMARY
            </h3>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Prototype Simulation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Tasks Scheduled</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">{metrics.tasksScheduled}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Blocks Created</div>
              <div className="text-lg font-black text-blue-700 mt-0.5">{metrics.blocksCreated}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Conflicts Resolved</div>
              <div className="text-lg font-black text-emerald-700 mt-0.5">{metrics.conflictsResolved}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Multi-Dept Blocks</div>
              <div className="text-lg font-black text-purple-700 mt-0.5">{metrics.multiDeptBlocks}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Block Utilization</div>
              <div className="text-lg font-black text-amber-700 mt-0.5">{metrics.estimatedBlockUtilization}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Asset Availability</div>
              <div className="text-lg font-black text-emerald-700 mt-0.5">{metrics.estimatedAssetAvailability}</div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Before vs After Visualizer */}
      <BeforeAfterVisualizer />

      {/* Generated Optimized Blocks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Optimized Coordinated Maintenance Blocks ({blocks.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Block ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4">Scheduled Window</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Participating Departments</th>
                <th className="py-3 px-4">Tasks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">Loading optimized block plan...</td>
                </tr>
              ) : blocks.length > 0 ? (
                blocks.map((block) => (
                  <tr key={block.blockId} className="hover:bg-slate-50">
                    <td
                      onClick={() => setSelectedBlock(block)}
                      className="py-3 px-4 font-mono font-bold text-blue-700 hover:underline cursor-pointer"
                    >
                      {block.blockId}
                    </td>
                    <td className="py-3 px-4 font-mono">{block.date}</td>
                    <td className="py-3 px-4 font-mono font-bold">{block.corridorId}</td>
                    <td className="py-3 px-4 font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block my-2">
                      {block.startTime} – {block.endTime}
                    </td>
                    <td className="py-3 px-4 font-semibold">{block.totalDuration} mins</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {block.departments?.map((d, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded text-[10px] font-bold border border-blue-200">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{block.tasks?.join(', ')}</td>
                    <td className="py-3 px-4 font-bold">{block.status}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleUpdateStatus(block.blockId, 'Approved')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 text-[10px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(block.blockId, 'Rejected')}
                          className="px-2.5 py-1 bg-red-100 text-red-800 rounded font-bold hover:bg-red-200 text-[10px]"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">
                    No block plan generated yet. Click "GENERATE OPTIMIZED BLOCK PLAN" to run optimization engine.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailModal
        isOpen={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        title="Coordinated Maintenance Block Inspection"
        data={selectedBlock}
        type="block"
      />
    </div>
  );
}
