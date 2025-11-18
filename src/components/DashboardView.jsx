import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Beef,
  Trash2,
  Activity,
  Download,
  Lightbulb
} from 'lucide-react';
import CircularProgress from './CircularProgress';

const DashboardView = ({
  user,
  dailyProtein,
  proteinTargets,
  calorieGuidance,
  proteinLog,
  currentStreak,
  longestStreak,
  proteinFoods,
  activeCategory,
  setActiveCategory,
  onAddProtein,
  onDeleteLog,
  onExportData,
  onEditProfile,
  onResetDay
}) => {
  const [customFood, setCustomFood] = React.useState('');
  const [customAmount, setCustomAmount] = React.useState('');

  const remainingProtein = Math.max(0, proteinTargets.minimum - dailyProtein);
  const proteinProgress = Math.min(100, (dailyProtein / proteinTargets.minimum) * 100);

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

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

        {/* Circular Progress - Hero Element */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center my-6"
        >
          <CircularProgress
            value={dailyProtein}
            goal={proteinTargets.minimum}
            streak={currentStreak}
            size={280}
          />
        </motion.div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Current Streak</span>
            </div>
            <div className="text-2xl font-bold text-indigo-900">{currentStreak} days</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Calories</span>
            </div>
            <div className="text-2xl font-bold text-amber-900">{(dailyProtein * 4).toFixed(0)}</div>
            <div className="text-xs text-amber-700">of {calorieGuidance.minimum} kcal</div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* Quick Add Protein Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Beef className="w-5 h-5 text-indigo-500" /> Quick Add Protein
          </h3>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {Object.keys(proteinFoods).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {formatCategoryName(category)}
              </button>
            ))}
          </div>

          {/* Food Button Grid */}
          <div className="grid grid-cols-3 gap-3">
            {proteinFoods[activeCategory]?.map((food) => (
              <motion.button
                key={food.name}
                onClick={() => onAddProtein(food.name, food.grams)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl mb-2">{food.icon}</div>
                <div className="text-xs font-semibold text-slate-700">{food.name}</div>
                <div className="text-lg font-bold text-indigo-600">+{food.grams}g</div>
              </motion.button>
            ))}
          </div>

          {/* Custom Input Below */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
              <span className="font-semibold">Can't find your food?</span> Add custom entry:
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                placeholder="Food name (optional)"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Protein grams"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 text-sm"
                />
                <button
                  onClick={handleAddCustom}
                  disabled={!customAmount || parseInt(customAmount) <= 0}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm ${
                    customAmount && parseInt(customAmount) > 0
                      ? 'bg-indigo-600 text-white shadow-md hover:scale-105 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Beef className="w-4 h-4" /> Add
                </button>
              </div>
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
