import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Beef,
  Trash2,
  Activity,
  Download,
  Plus,
  Lightbulb
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';

const DashboardView = ({
  user,
  dailyProtein,
  proteinTargets,
  calorieGuidance,
  proteinLog,
  currentStreak,
  longestStreak,
  weeklyTrendData,
  caloriePieData,
  onAddProtein,
  onDeleteLog,
  onExportData,
  onEditProfile,
  onResetDay
}) => {
  const PIE_COLORS = ['#6366f1', '#e2e8f0']; // Indigo, Slate

  const [customFood, setCustomFood] = React.useState('');
  const [customAmount, setCustomAmount] = React.useState('');

  const remainingProtein = Math.max(0, proteinTargets.minimum - dailyProtein);
  const proteinProgress = Math.min(100, (dailyProtein / proteinTargets.minimum) * 100);

  const handleAddCustom = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      const foodName = customFood.trim() || 'Custom Entry';
      onAddProtein(foodName, amount);
      setCustomAmount('');
      setCustomFood('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4">
      {/* Header */}
      <header className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Hi{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="text-slate-500 text-sm">
              Muscle Preservation Mode: <span className="text-indigo-600 font-semibold">Active</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEditProfile}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title="Edit Profile"
            >
              <Activity className="w-5 h-5" />
            </button>
            <button
              onClick={onExportData}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title="Export Data"
            >
              <Download className="w-5 h-5" />
            </button>
            <div className="bg-indigo-50 p-2 rounded-xl">
              <Trophy className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Protein Focus Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200 flex flex-col justify-between min-h-[180px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mt-10 -mr-10"></div>

            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-2 opacity-90">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Beef className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide">Protein Goal</span>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75">Target</div>
                <div className="font-bold">{proteinTargets.minimum}g</div>
              </div>
            </div>

            <div className="mt-4 z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">{dailyProtein.toFixed(0)}</span>
                <span className="text-lg opacity-75">g</span>
              </div>
              <p className="text-sm text-indigo-100 mt-1">
                {remainingProtein > 0
                  ? `${remainingProtein.toFixed(0)}g more to reach your daily target`
                  : "Great job! You hit your protein target."}
              </p>
            </div>

            <div className="mt-4 h-2 bg-indigo-900/30 rounded-full overflow-hidden z-10">
              <motion.div
                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${proteinProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              ></motion.div>
            </div>
          </div>

          {/* Calories Ring Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-sm min-h-[180px]">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wide absolute top-4 left-4 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Calories
            </h3>

            <div className="w-full h-32 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caloriePieData}
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {caloriePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center -mt-2">
              <div className="text-xl font-bold text-slate-800">{(dailyProtein * 4).toFixed(0)}</div>
              <div className="text-xs text-slate-400">of {calorieGuidance.minimum} kcal</div>
            </div>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="mt-6 bg-white rounded-xl border border-slate-100 p-4 h-64 shadow-sm">
          <h3 className="text-slate-700 font-semibold text-sm mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" /> Weekly Consistency
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <ReferenceLine y={proteinTargets.minimum} stroke="#6366f1" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Bar dataKey="protein" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </header>

      <div className="space-y-6">
        {/* Quick Add Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-500" /> Log Protein
          </h3>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                placeholder="Food name (optional)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Protein grams"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
              />
              <button
                onClick={handleAddCustom}
                disabled={!customAmount || parseInt(customAmount) <= 0}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  customAmount && parseInt(customAmount) > 0
                    ? 'bg-indigo-600 text-white shadow-md hover:scale-105 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-5 h-5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Food List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Today's Logs</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400">{proteinLog.length} items</span>
              {proteinLog.length > 0 && (
                <button
                  onClick={onResetDay}
                  className="text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {proteinLog.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Beef className="w-6 h-6 text-slate-300" />
              </div>
              <p>No protein logged yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {proteinLog.map((item, index) => (
                <motion.li
                  key={item.id || index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-slate-800 capitalize">{item.food}</p>
                    <div className="flex gap-3 text-xs mt-1">
                      <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                        {item.grams}g protein
                      </span>
                      <span className="text-slate-400">{item.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteLog(item.id || index)}
                    className="text-slate-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl p-4 flex gap-3 items-start">
          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-900 font-semibold text-sm">Why Protein Matters for GLP-1?</h4>
            <p className="text-blue-700/80 text-xs mt-1 leading-relaxed">
              Rapid weight loss can cause muscle loss. Keeping protein high (aiming for {proteinTargets.minimum}g) signals your body to hold onto lean mass while burning fat. Don't forget to eat at least {calorieGuidance.minimum} calories/day!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
