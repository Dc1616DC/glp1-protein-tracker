import { motion } from "framer-motion";

export default function CircularProgress({ value, goal = 120, streak = 0, size = 280 }) {
  const percentage = Math.min(value / goal, 1);
  const circumference = 2 * Math.PI * 120;

  const gradients = {
    teal: { from: "#00d4b3", to: "#00b894" },
    purple: { from: "#a78bfa", to: "#818cf8" },
    gold: { from: "#fbbf24", to: "#f59e0b" }
  };

  const theme = streak >= 30 ? "gold" : streak >= 7 ? "purple" : "teal";
  const colors = gradients[theme];

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size/2}
          cy={size/2}
          r="120"
          stroke="#e6e6e6"
          strokeWidth="24"
          fill="none"
        />
        <motion.circle
          cx={size/2}
          cy={size/2}
          r="120"
          stroke={`url(#gradient-${theme})`}
          strokeWidth="24"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={`gradient-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute text-center">
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-bold"
          style={{ color: value >= goal ? "#00ffc0" : "#1a1a1a" }}
        >
          {value}
        </motion.div>
        <div className="text-xl text-gray-500">of {goal}g</div>
        {value >= goal && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl mt-2 font-bold"
            style={{ color: "#00ffc0" }}
          >
            Goal crushed!
          </motion.div>
        )}
      </div>
    </div>
  );
}
