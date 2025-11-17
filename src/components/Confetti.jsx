import Lottie from "react-lottie-player";
import confetti from "../assets/confetti.json";

export default function Confetti({ play }) {
  if (!play) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Lottie
        loop={false}
        animationData={confetti}
        play={play}
        speed={1.5}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
