import { useState } from 'react';
import { User, Ruler, Shield, ArrowRight } from 'lucide-react';

export default function OnboardingNew({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'female',
    weightLbs: '',
    heightFeet: '',
    heightInches: '',
    medication: '',
    disclaimerAccepted: false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Validate disclaimer is accepted
      if (formData.disclaimerAccepted) {
        onComplete(formData);
      }
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.age && formData.gender && formData.medication;
    }
    if (step === 2) {
      return formData.weightLbs && formData.heightFeet && formData.heightInches;
    }
    if (step === 3) {
      return formData.disclaimerAccepted;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">MuscleGuard</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Protein tracking for GLP-1 users
          </p>
        </div>

        <div className="p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" /> About You
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      min="18"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    GLP-1 Medication
                  </label>
                  <select
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.medication}
                    onChange={(e) => handleChange('medication', e.target.value)}
                  >
                    <option value="">Choose medication</option>
                    <option value="Ozempic">Ozempic (semaglutide)</option>
                    <option value="Wegovy">Wegovy (semaglutide)</option>
                    <option value="Mounjaro">Mounjaro (tirzepatide)</option>
                    <option value="Zepbound">Zepbound (tirzepatide)</option>
                    <option value="Rybelsus">Rybelsus (oral semaglutide)</option>
                    <option value="Trulicity">Trulicity (dulaglutide)</option>
                    <option value="Victoza">Victoza/Saxenda (liraglutide)</option>
                    <option value="Compounded">Compounded GLP-1</option>
                  </select>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800 leading-relaxed">
                  💡 We use your info to calculate personalized protein targets based on clinically-validated formulas.
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Body Metrics */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-indigo-600" /> Body Metrics
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Current Weight (lbs)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g., 180"
                    value={formData.weightLbs}
                    onChange={(e) => handleChange('weightLbs', e.target.value)}
                    min="50"
                    max="800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-3">
                    Height
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="5"
                        value={formData.heightFeet}
                        onChange={(e) => handleChange('heightFeet', e.target.value)}
                        min="4"
                        max="7"
                      />
                      <div className="text-center text-sm text-slate-500 mt-1">feet</div>
                    </div>
                    <div>
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="8"
                        value={formData.heightInches}
                        onChange={(e) => handleChange('heightInches', e.target.value)}
                        min="0"
                        max="11"
                      />
                      <div className="text-center text-sm text-slate-500 mt-1">inches</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
                  📏 We calculate your Adjusted Body Weight (ABW) to determine precise protein needs for muscle preservation.
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Disclaimer */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> Important Information
              </h2>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    ⚠️ Medical Disclaimer
                  </h3>
                  <div className="text-sm text-red-800 space-y-2 leading-relaxed">
                    <p>
                      This tool is for <strong>educational purposes only</strong> and does not replace medical advice.
                    </p>
                    <p>
                      <strong>Not safe for:</strong> Individuals with kidney disease or chronic kidney conditions.
                    </p>
                    <p>
                      Always consult your healthcare provider before making dietary changes, especially when on GLP-1 medications.
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.disclaimerAccepted}
                    onChange={(e) => handleChange('disclaimerAccepted', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    I understand this is educational only and does not replace medical advice. I will consult my healthcare provider about dietary changes.
                  </span>
                </label>

                <div className="bg-green-50 rounded-lg p-3 text-xs text-green-800 leading-relaxed">
                  ✅ Built by a Registered Dietitian using clinically-validated formulas
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                canProceed()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Start Tracking' : 'Next'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= i ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
