import { motion } from "framer-motion";

export default function QuickAddFAB({ onClick }) {
  const handleClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-20 right-6 w-16 h-16 bg-gradient-to-br from-teal-400 to-green-500 rounded-full shadow-2xl flex items-center justify-center z-40"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <span className="text-4xl text-white font-light">+</span>
    </motion.button>
  );
}
