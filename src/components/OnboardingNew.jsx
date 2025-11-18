import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function OnboardingNew({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'female',
    weightLbs: '',
    heightFeet: '',
    heightInches: '',
    medication: '',
    activityLevel: 'Sedentary',
    disclaimerAccepted: false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
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
      return formData.activityLevel;
    }
    if (step === 4) {
      return formData.disclaimerAccepted;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Clean Header - No colored banner */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to MuscleGuard</h1>
          <p className="text-slate-600 text-sm">Let's tailor your plan for GLP-1 success.</p>
        </div>

        {/* Step 1: About You */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">About You</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">GLP-1 Medication</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
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
            </div>
          </div>
        )}

        {/* Step 2: Body Metrics */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Body Metrics</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Weight (lbs)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., 180"
                  value={formData.weightLbs}
                  onChange={(e) => handleChange('weightLbs', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Height</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="5"
                      value={formData.heightFeet}
                      onChange={(e) => handleChange('heightFeet', e.target.value)}
                    />
                    <div className="text-center text-xs text-slate-500 mt-1">feet</div>
                  </div>
                  <div>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="8"
                      value={formData.heightInches}
                      onChange={(e) => handleChange('heightInches', e.target.value)}
                    />
                    <div className="text-center text-xs text-slate-500 mt-1">inches</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Activity Level */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Lifestyle</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={formData.activityLevel}
                  onChange={(e) => handleChange('activityLevel', e.target.value)}
                >
                  <option value="Sedentary">Sedentary (office job)</option>
                  <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                  <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                  <option value="Very Active">Very Active (6-7 days/week)</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  We factor this into your protein needs to support muscle maintenance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Disclaimer */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Important</h2>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-900 text-sm mb-2">⚠️ Medical Disclaimer</h3>
                <div className="text-xs text-red-800 space-y-2 leading-relaxed">
                  <p>This tool is for <strong>educational purposes only</strong>.</p>
                  <p><strong>Not safe for:</strong> Individuals with kidney disease.</p>
                  <p>Always consult your healthcare provider before making dietary changes.</p>
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
                  I understand this is educational only and will consult my healthcare provider.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              canProceed()
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {step === 4 ? 'Start Journey' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= i ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
