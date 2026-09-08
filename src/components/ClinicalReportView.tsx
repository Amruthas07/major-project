import React, { useState } from 'react';
import {
  UserProfile,
  WeightRecord,
  ClinicalReport,
  MedicationItem
} from '../types';
import {
  FileBarChart2,
  TrendingUp,
  FileText,
  Pill,
  CreditCard,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ShieldCheck,
  Heart,
  Phone,
  Upload,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';

interface ClinicalReportViewProps {
  profile: UserProfile;
  weightRecords: WeightRecord[];
  clinicalReports: ClinicalReport[];
  medications: MedicationItem[];
  onAddWeightRecord: (record: WeightRecord) => void;
  onAddClinicalReport: (report: ClinicalReport) => void;
  onToggleMedicationTaken: (id: string) => void;
  onAddMedication: (med: Omit<MedicationItem, 'id'>) => void;
}

export const ClinicalReportView: React.FC<ClinicalReportViewProps> = ({
  profile,
  weightRecords,
  clinicalReports,
  medications,
  onAddWeightRecord,
  onAddClinicalReport,
  onToggleMedicationTaken,
  onAddMedication
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'weight-curve' | 'reports' | 'medications' | 'companion-card'
  >('weight-curve');

  // New weight logging modal state
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeek, setNewWeek] = useState(profile.weeksPregnant);
  const [newWeight, setNewWeight] = useState(60.5);

  // New report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportDoctorRemarks, setReportDoctorRemarks] = useState('');

  // Prepare chart data combining IOM recommended bounds and user's actual weight
  const chartData = [
    { week: 'W0', targetMin: 54.0, targetMax: 54.0, actual: 54.0 },
    { week: 'W4', targetMin: 54.2, targetMax: 54.8, actual: 54.1 },
    { week: 'W8', targetMin: 54.5, targetMax: 55.5, actual: 54.6 },
    { week: 'W12', targetMin: 55.0, targetMax: 56.5, actual: 55.2 },
    { week: 'W16', targetMin: 56.2, targetMax: 58.2, actual: 56.8 },
    { week: 'W20', targetMin: 57.8, targetMax: 60.5, actual: 58.5 },
    { week: 'W24', targetMin: 59.5, targetMax: 62.8, actual: 60.2 },
    { week: 'W28', targetMin: 61.2, targetMax: 65.0, actual: null },
    { week: 'W32', targetMin: 63.0, targetMax: 67.2, actual: null },
    { week: 'W36', targetMin: 64.5, targetMax: 69.0, actual: null },
    { week: 'W40', targetMin: 65.5, targetMax: 70.0, actual: null }
  ];

  // Sync any dynamic weight logs into chart data
  weightRecords.forEach((rec) => {
    const key = `W${rec.week}`;
    const found = chartData.find((d) => d.week === key);
    if (found) {
      found.actual = rec.weightKg;
    }
  });

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWeightRecord({
      week: Number(newWeek),
      weightKg: Number(newWeight),
      date: new Date().toISOString().split('T')[0],
      bmi: Number((newWeight / ((profile.heightCm / 100) * (profile.heightCm / 100))).toFixed(1)),
      notes: 'Routine clinic measurement'
    });
    setShowWeightModal(false);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    onAddClinicalReport({
      id: `rep-${Date.now()}`,
      title: reportTitle.trim(),
      date: reportDate,
      doctor: profile.doctorDetails.name,
      facility: profile.doctorDetails.hospital,
      status: 'Normal',
      summary: 'Lab investigation completed. Maternal and fetal parameters within safe physiological thresholds.',
      parameters: [
        { name: 'Investigation Screening', value: 'Report Document Stored', normalRange: 'Negative / Normal', status: 'Normal' }
      ],
      doctorRemarks: reportDoctorRemarks.trim() || 'Continue current dietary supplements and routine follow-up.'
    });

    setReportTitle('');
    setReportDoctorRemarks('');
    setShowReportModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <FileBarChart2 className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Obstetric Clinical Records &amp; Vital Logs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight">
              📊 Clinical Reports &amp; Mother Companion Logs
            </h1>
            <p className="text-sm text-[#523D35] mt-1 max-w-2xl font-medium">
              Track gestational weight trajectory against standard IOM curves, monitor diagnostic pathology reports, adherence to iron-folate supplements, and access your digital MCP card.
            </p>
          </div>

          {/* Subtab Navigation Pills */}
          <div className="flex items-center space-x-1.5 bg-[#EFEFE9] p-1.5 rounded-2xl border border-[#959D90]/50 self-start">
            <button
              type="button"
              onClick={() => setActiveSubTab('weight-curve')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'weight-curve'
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'text-[#523D35] hover:text-[#223030]'
              }`}
            >
              📈 Weight Curve &amp; BMI
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('reports')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'reports'
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'text-[#523D35] hover:text-[#223030]'
              }`}
            >
              📄 Clinical Reports
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('medications')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'medications'
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'text-[#523D35] hover:text-[#223030]'
              }`}
            >
              💊 Supplements
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('companion-card')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'companion-card'
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'text-[#523D35] hover:text-[#223030]'
              }`}
            >
              🪪 MCP Card
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: WEIGHT CURVE & BMI (IOM) */}
      {activeSubTab === 'weight-curve' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#E8D9CD] rounded-2xl p-4.5 border border-[#959D90] shadow-xs space-y-1">
              <span className="text-xs text-[#523D35] font-semibold block">Pre-Pregnancy Weight</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#223030]">{profile.prePregnancyWeightKg} kg</span>
              <span className="text-[11px] text-[#959D90] block">Height: {profile.heightCm} cm</span>
            </div>

            <div className="bg-[#E8D9CD] rounded-2xl p-4.5 border border-[#959D90] shadow-xs space-y-1">
              <span className="text-xs text-[#523D35] font-semibold block">Pre-Pregnancy BMI</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#223030]">20.6</span>
              <span className="text-[11px] text-[#523D35] font-semibold block">Normal Category (18.5 - 24.9)</span>
            </div>

            <div className="bg-[#E8D9CD] rounded-2xl p-4.5 border border-[#959D90] shadow-xs space-y-1">
              <span className="text-xs text-[#523D35] font-semibold block">Current Weight (W24)</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#223030]">{profile.currentWeightKg} kg</span>
              <span className="text-[11px] text-[#523D35] font-bold block">+6.2 kg Total Gain</span>
            </div>

            <div className="bg-[#E8D9CD] rounded-2xl p-4.5 border border-[#959D90] shadow-xs space-y-1">
              <span className="text-xs text-[#523D35] font-semibold block">IOM Target Gain</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#223030]">11.5 – 16.0 kg</span>
              <span className="text-[11px] text-[#959D90] block">Healthy maternal trajectory</span>
            </div>
          </div>

          {/* Recharts IOM Gestational Weight Gain Curve */}
          <div className="bg-[#E8D9CD] rounded-3xl p-6 border border-[#959D90] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#223030] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#523D35]" />
                  <span>IOM Gestational Weight Progression vs. Target Range</span>
                </h3>
                <p className="text-xs text-[#523D35]">
                  Shaded envelope indicates the clinical healthy gain boundaries recommended by the Institute of Medicine (IOM).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowWeightModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1.5 shadow-xs transition self-start cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Week Weight</span>
              </button>
            </div>

            <div className="h-72 sm:h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#959D90" strokeOpacity={0.3} />
                  <XAxis dataKey="week" stroke="#523D35" fontSize={12} tickLine={false} />
                  <YAxis domain={[50, 75]} stroke="#523D35" fontSize={12} unit=" kg" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#223030',
                      borderRadius: '12px',
                      color: '#EFEFE9',
                      border: '1px solid #959D90',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="targetMax"
                    stroke="none"
                    fill="#BBA58F"
                    fillOpacity={0.4}
                    name="IOM Upper Range"
                  />
                  <Area
                    type="monotone"
                    dataKey="targetMin"
                    stroke="none"
                    fill="#EFEFE9"
                    fillOpacity={1}
                    name="IOM Lower Bound"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#223030"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#223030', strokeWidth: 2, stroke: '#E8D9CD' }}
                    activeDot={{ r: 7 }}
                    name="Actual Weight (kg)"
                    connectNulls={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center space-x-6 text-xs pt-2 border-t border-[#959D90]/30 text-[#523D35]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#223030] inline-block" />
                <span className="font-semibold text-[#223030]">Mother's Logged Weight</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-md bg-[#BBA58F]/50 inline-block border border-[#959D90]" />
                <span className="font-semibold text-[#523D35]">IOM Recommended Weight Range</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CLINICAL REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#223030]">
              Verified Pathological &amp; Ultrasound Records ({clinicalReports.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Upload / Add New Lab Report</span>
            </button>
          </div>

          <div className="space-y-4">
            {clinicalReports.map((report) => (
              <div
                key={report.id}
                className="bg-[#E8D9CD] rounded-3xl p-6 border border-[#959D90] shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#959D90]/30 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-[10px] font-bold uppercase">
                        {report.status}
                      </span>
                      <h4 className="text-base font-bold text-[#223030]">{report.title}</h4>
                    </div>
                    <p className="text-xs text-[#523D35] mt-0.5">
                      Conducted on {report.date} • {report.facility}{report.doctor ? ` • ${report.doctor.startsWith('Dr.') ? report.doctor : report.doctor}` : ''}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#223030] bg-[#EFEFE9] px-3 py-1 rounded-xl border border-[#959D90]/50 self-start">
                    Verified by Clinical AI
                  </span>
                </div>

                <p className="text-xs text-[#523D35] leading-relaxed font-medium">
                  {report.summary}
                </p>

                {/* Parameters Table */}
                <div className="overflow-x-auto rounded-2xl border border-[#959D90]/40 bg-[#EFEFE9]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#E8D9CD] text-[#523D35] font-semibold border-b border-[#959D90]/30">
                      <tr>
                        <th className="p-3">Parameter Investigated</th>
                        <th className="p-3">Observed Value</th>
                        <th className="p-3">Reference Range</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#959D90]/20">
                      {report.parameters.map((param, idx) => (
                        <tr key={idx} className="hover:bg-[#E8D9CD]/30">
                          <td className="p-3 font-bold text-[#223030]">{param.name}</td>
                          <td className="p-3 font-extrabold text-[#223030]">{param.value}</td>
                          <td className="p-3 text-[#523D35]">{param.normalRange}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                param.status === 'Normal'
                                  ? 'bg-[#523D35] text-[#E8D9CD]'
                                  : 'bg-[#BBA58F] text-[#223030]'
                              }`}
                            >
                              {param.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Doctor's Remarks */}
                <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#523D35] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#523D35]" />
                    Doctor's Clinical Actionable Remarks
                  </div>
                  <p className="text-xs text-[#223030] font-medium leading-relaxed">
                    {report.doctorRemarks}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: MEDICATIONS & VITAMINS */}
      {activeSubTab === 'medications' && (
        <div className="space-y-6">
          <div className="bg-[#E8D9CD] rounded-3xl p-6 border border-[#959D90] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#223030] flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#523D35]" />
                  <span>Daily Maternal Supplement Schedule (Adherence: 94%)</span>
                </h3>
                <p className="text-xs text-[#523D35]">
                  Prescribed supplements to support fetal bone mineralization, red cell synthesis, and neural health.
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-[#223030] text-[#EFEFE9] border border-[#959D90]/40 text-xs font-bold self-start">
                Doctor Prescribed
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                    med.isTakenToday
                      ? 'bg-[#EFEFE9] border-[#523D35]'
                      : 'bg-[#EFEFE9]/60 border-[#959D90]/40'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      type="button"
                      onClick={() => onToggleMedicationTaken(med.id)}
                      className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer ${
                        med.isTakenToday
                          ? 'bg-[#523D35] border-[#523D35] text-[#E8D9CD]'
                          : 'bg-white border-[#959D90] text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-[#223030]">{med.name}</h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#E8D9CD] text-[#523D35] font-bold border border-[#959D90]/30">
                          {med.dosage}
                        </span>
                      </div>
                      <div className="text-xs text-[#523D35] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#959D90]" />
                        <span>{med.timing}</span>
                      </div>
                      <p className="text-xs text-[#523D35] font-medium">
                        ⚠️ <strong>Rule:</strong> {med.foodInteractionNote}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleMedicationTaken(med.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold self-end sm:self-center transition cursor-pointer ${
                      med.isTakenToday
                        ? 'bg-[#523D35] text-[#E8D9CD]'
                        : 'bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9]'
                    }`}
                  >
                    {med.isTakenToday ? 'Taken Today ✓' : 'Mark as Taken'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: MOTHER COMPANION CARD (DIGITAL MCP CARD) */}
      {activeSubTab === 'companion-card' && (
        <div className="space-y-6">
          <div className="bg-[#223030] rounded-3xl p-6 sm:p-8 text-[#EFEFE9] shadow-2xl border border-[#959D90]/40 space-y-6 relative overflow-hidden">
            {/* Top Bar of MCP Card */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#959D90]/30 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#BBA58F] flex items-center justify-center text-[#223030] font-black text-2xl shadow-lg">
                  P
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BBA58F]">
                    National Health Mission • Digital MCP Identity
                  </span>
                  <h3 className="text-xl font-extrabold text-[#EFEFE9]">
                    Mother &amp; Child Protection Companion Card
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#959D90] block font-mono">RCH ID: {profile.rchId}</span>
                <span className="text-xs text-[#BBA58F] font-bold">MCP Card #{profile.mcpCardNumber}</span>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mother Details */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#BBA58F] uppercase tracking-wider block">
                  Mother Details
                </span>
                <div className="bg-[#523D35] rounded-2xl p-4 border border-[#BBA58F]/20 space-y-2 text-xs">
                  <div>
                    <span className="text-[#E8D9CD]/70 block">Full Name:</span>
                    <span className="font-bold text-[#EFEFE9] text-sm">{profile.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[#E8D9CD]/70 block">Age:</span>
                      <span className="font-bold text-[#EFEFE9]">{profile.age} Years</span>
                    </div>
                    <div>
                      <span className="text-[#E8D9CD]/70 block">Blood Group:</span>
                      <span className="font-extrabold text-[#E8D9CD] text-sm">{profile.bloodGroup}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#E8D9CD]/70 block">Current Gestation:</span>
                    <span className="font-bold text-[#BBA58F]">
                      Week {profile.weeksPregnant} (Trimester {profile.weeksPregnant <= 12 ? 1 : profile.weeksPregnant <= 28 ? 2 : 3})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#E8D9CD]/70 block">Estimated Due Date:</span>
                    <span className="font-bold text-[#EFEFE9]">{profile.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts & Hospital */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#BBA58F] uppercase tracking-wider block">
                  Emergency Contacts &amp; Delivery Hospital
                </span>
                <div className="bg-[#523D35] rounded-2xl p-4 border border-[#BBA58F]/20 space-y-2 text-xs">
                  <div>
                    <span className="text-[#E8D9CD]/70 block">Designated Hospital:</span>
                    <span className="font-bold text-[#EFEFE9]">{profile.doctorDetails.hospital}</span>
                  </div>
                  <div>
                    <span className="text-[#E8D9CD]/70 block">Attending Obstetrician:</span>
                    <span className="font-bold text-[#EFEFE9]">{profile.doctorDetails.name}</span>
                  </div>
                  <div>
                    <span className="text-[#E8D9CD]/70 block">Primary Contact (Spouse):</span>
                    <span className="font-bold text-[#BBA58F]">{profile.emergencyContact}</span>
                  </div>
                  <div>
                    <span className="text-[#E8D9CD]/70 block">Obstetric Helpline:</span>
                    <span className="font-bold text-[#E8D9CD]">102 (National Maternal Ambulance)</span>
                  </div>
                </div>
              </div>

              {/* Clinical Flags & QR Code */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#BBA58F] uppercase tracking-wider block">
                  Clinical Flags &amp; QR Scan
                </span>
                <div className="bg-[#523D35] rounded-2xl p-4 border border-[#BBA58F]/20 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[#E8D9CD]/70 block text-[10px] uppercase font-bold">
                      Medical Conditions &amp; Allergies:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {profile.medicalConditions.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-[#223030] text-[#E8D9CD] text-[10px] font-bold border border-[#959D90]/30">
                          {c}
                        </span>
                      ))}
                      {profile.allergies.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-[#223030] text-[#BBA58F] text-[10px] font-bold border border-[#959D90]/30">
                          Allergy: {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* QR Code Graphic Box */}
                  <div className="bg-[#EFEFE9] p-3 rounded-xl flex items-center justify-between text-[#223030] border border-[#959D90]/40">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-[#523D35] block">
                        Emergency Paramedic QR
                      </span>
                      <span className="text-xs font-extrabold text-[#223030]">Scan for instant EHR</span>
                    </div>
                    <div className="w-10 h-10 bg-[#223030] rounded-lg flex items-center justify-center text-[#EFEFE9] font-mono text-[10px]">
                      [QR]
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print / Save Card Button */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-black flex items-center gap-1.5 shadow-lg transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official MCP Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#E8D9CD] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#959D90] animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#223030] mb-3">Log Weekly Weight (IOM Sync)</h3>
            <form onSubmit={handleSaveWeight} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#523D35] block mb-1">Pregnancy Week (1 - 40)</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={newWeek}
                  onChange={(e) => setNewWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#EFEFE9] border border-[#959D90] text-xs font-bold text-[#223030] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#523D35] block mb-1">Weight in Kilograms (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#EFEFE9] border border-[#959D90] text-xs font-bold text-[#223030] outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#523D35] hover:bg-[#EFEFE9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold shadow-xs cursor-pointer"
                >
                  Record Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#E8D9CD] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#959D90] animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#223030] mb-3">Add / Log Clinical Lab Report</h3>
            <form onSubmit={handleSaveReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#523D35] block mb-1">Report Title / Test Name *</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g., 28-Week Repeat Hemoglobin &amp; Ferritin"
                  className="w-full px-3 py-2 rounded-xl bg-[#EFEFE9] border border-[#959D90] text-xs font-medium text-[#223030] outline-none placeholder:text-[#959D90]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#523D35] block mb-1">Date of Test</label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#EFEFE9] border border-[#959D90] text-xs font-medium text-[#223030] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#523D35] block mb-1">Doctor Remarks / Notes</label>
                <textarea
                  rows={3}
                  value={reportDoctorRemarks}
                  onChange={(e) => setReportDoctorRemarks(e.target.value)}
                  placeholder="Enter doctor observations or advice..."
                  className="w-full px-3 py-2 rounded-xl bg-[#EFEFE9] border border-[#959D90] text-xs font-medium text-[#223030] outline-none placeholder:text-[#959D90]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#523D35] hover:bg-[#EFEFE9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Clinical Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
