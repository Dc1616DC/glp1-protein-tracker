import React, { useState, useEffect } from 'react';
import './App.css';

// GLP-1 Protein Tracker with ABW Calculations
// Uses clinically-validated Adjusted Body Weight formulas

function App() {
  // User profile state
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    weightLbs: '',
    heightFeet: '',
    heightInches: '',
    medication: '',
    disclaimerAccepted: false,
    hasKidneyDisease: null,
    profileComplete: false
  });

  // Calculated values
  const [abwData, setAbwData] = useState({
    bmi: 0,
    ibwKg: 0,
    abwKg: 0,
    adjustmentFactor: 0,
    proteinTargets: {
      minimum: 0,
      target: 0,
      higher: 0
    },
    calorieGuidance: {
      minimum: 0,
      estimated: 0
    }
  });

  // Landing page state
  const [showLanding, setShowLanding] = useState(!userProfile.profileComplete);

  // Navigation state
  const [currentView, setCurrentView] = useState('track'); // track, history, learn, why

  // Daily tracking state
  const [dailyProtein, setDailyProtein] = useState(0);
  const [proteinLog, setProteinLog] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('');
  const [statusColor, setStatusColor] = useState('gray');
  const [customAmount, setCustomAmount] = useState('');
  const [customFood, setCustomFood] = useState('');
  const [activeCategory, setActiveCategory] = useState('meat');

  // Streak and achievements
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  // Trial state
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(7);
  const [showPaywall, setShowPaywall] = useState(false);

  // Update status when protein intake changes
  useEffect(() => {
    updateProteinStatus();
  }, [dailyProtein, abwData.proteinTargets.minimum]);

  // Check trial status
  useEffect(() => {
    checkTrialStatus();
  }, []);

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedAbwData = localStorage.getItem('abwData');
    const today = new Date().toDateString();
    const savedTracking = JSON.parse(localStorage.getItem('proteinTracking') || '{}');
    const savedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
    }

    if (savedAbwData) {
      setAbwData(JSON.parse(savedAbwData));
    }

    if (savedTracking[today]) {
      setDailyProtein(savedTracking[today].total);
      setProteinLog(savedTracking[today].log);
    }

    setAchievements(savedAchievements);
    calculateStreak();
  }, []);

  // Calculate streak
  const calculateStreak = () => {
    const savedTracking = JSON.parse(localStorage.getItem('proteinTracking') || '{}');
    let streak = 0;
    let longest = 0;
    let tempStreak = 0;

    // Check last 365 days for streaks
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      if (savedTracking[dateStr] && savedTracking[dateStr].metTarget) {
        tempStreak++;
        if (i === 0) streak = tempStreak; // Current streak
      } else {
        if (tempStreak > longest) longest = tempStreak;
        tempStreak = 0;
      }
    }

    if (tempStreak > longest) longest = tempStreak;
    setCurrentStreak(streak);
    setLongestStreak(Math.max(longest, streak));
  };

  // Check and award achievements
  const checkAchievements = (streak, total) => {
    const newAchievements = [];
    const existingAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');

    const achievementsList = [
      { id: 'first_day', name: 'First Day Complete', description: 'Tracked your first day of protein', icon: '🎯', condition: () => true },
      { id: 'streak_3', name: '3-Day Streak', description: 'Hit your target 3 days in a row', icon: '🔥', condition: () => streak >= 3 },
      { id: 'streak_7', name: 'Week Warrior', description: 'Hit your target 7 days in a row', icon: '⭐', condition: () => streak >= 7 },
      { id: 'streak_30', name: '30-Day Champion', description: 'Hit your target 30 days in a row', icon: '🏆', condition: () => streak >= 30 },
      { id: 'higher_protein', name: 'High Protein Day', description: 'Hit the higher protein target (1.6 g/kg)', icon: '💪', condition: () => total >= abwData.proteinTargets.higher },
    ];

    achievementsList.forEach(achievement => {
      if (achievement.condition() && !existingAchievements.some(a => a.id === achievement.id)) {
        newAchievements.push(achievement);
        existingAchievements.push(achievement);
      }
    });

    if (newAchievements.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(existingAchievements));
      setAchievements(existingAchievements);
      setShowAchievement(newAchievements[0]);
      setTimeout(() => setShowAchievement(null), 5000);
    }
  };

  /**
   * Calculate Adjusted Body Weight and calorie guidance
   */
  const handleCalculateTargets = () => {
    const weightKg = parseFloat(userProfile.weightLbs) * 0.4536;
    const totalHeightInches = parseInt(userProfile.heightFeet) * 12 + parseInt(userProfile.heightInches);
    const heightM = totalHeightInches * 0.0254;

    // Calculate BMI
    const bmi = weightKg / (heightM * heightM);

    // Calculate IBW (Hamwi formula)
    const baseHeight = 60;
    const inchesOver5Feet = totalHeightInches - baseHeight;
    const ibwLbs = userProfile.gender === 'female'
      ? 100 + (inchesOver5Feet * 5)
      : 106 + (inchesOver5Feet * 6);
    const ibwKg = ibwLbs * 0.4536;

    // Determine adjustment factor based on BMI
    let adjustmentFactor = 0.4;
    if (bmi > 40) {
      adjustmentFactor = 0.25;
    } else if (bmi > 35) {
      adjustmentFactor = 0.3;
    } else if (bmi > 30) {
      adjustmentFactor = 0.35;
    }

    // Calculate ABW
    const abwKg = ibwKg + adjustmentFactor * (weightKg - ibwKg);

    // Calculate protein targets
    const proteinTargets = {
      minimum: Math.round(abwKg * 1.2),
      target: Math.round(abwKg * 1.4),
      higher: Math.round(abwKg * 1.6)
    };

    // Calculate calorie guidance
    const calorieGuidance = {
      minimum: userProfile.gender === 'female' ? 1200 : 1500,
      estimated: Math.round(abwKg * 25) // Rough estimate for sedentary
    };

    const calculatedData = {
      bmi: Math.round(bmi * 10) / 10,
      ibwKg: Math.round(ibwKg * 10) / 10,
      abwKg: Math.round(abwKg * 10) / 10,
      adjustmentFactor,
      proteinTargets,
      calorieGuidance
    };

    setAbwData(calculatedData);
    setUserProfile({...userProfile, profileComplete: true});

    // Save to localStorage
    localStorage.setItem('abwData', JSON.stringify(calculatedData));
    localStorage.setItem('userProfile', JSON.stringify({...userProfile, profileComplete: true}));
  };

  /**
   * Update protein intake status with color coding
   */
  const updateProteinStatus = () => {
    if (!abwData.proteinTargets.minimum) return;

    const percentage = (dailyProtein / abwData.proteinTargets.minimum) * 100;

    if (percentage < 75) {
      setCurrentStatus('CRITICAL: Severe muscle loss risk');
      setStatusColor('red');
    } else if (percentage < 100) {
      setCurrentStatus('LOW: Below minimum target');
      setStatusColor('yellow');
    } else if (percentage < 117) {
      setCurrentStatus('GOOD: Meeting minimum');
      setStatusColor('green');
    } else {
      setCurrentStatus('OPTIMAL: Excellent!');
      setStatusColor('gold');
    }
  };

  /**
   * Add protein from quick-add buttons
   */
  const quickAddProtein = (foodName, grams) => {
    const newEntry = {
      food: foodName,
      grams: grams,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newLog = [...proteinLog, newEntry];
    const newTotal = dailyProtein + grams;

    setProteinLog(newLog);
    setDailyProtein(newTotal);

    // Save to localStorage
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('proteinTracking') || '{}');
    const metTarget = newTotal >= abwData.proteinTargets.minimum;

    savedData[today] = {
      total: newTotal,
      log: newLog,
      target: abwData.proteinTargets.minimum,
      metTarget: metTarget
    };
    localStorage.setItem('proteinTracking', JSON.stringify(savedData));

    // Check achievements
    if (metTarget) {
      calculateStreak();
      const savedTracking = JSON.parse(localStorage.getItem('proteinTracking') || '{}');
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        if (savedTracking[dateStr]?.metTarget) {
          streak++;
        } else {
          break;
        }
      }
      checkAchievements(streak, newTotal);
    }
  };

  /**
   * Add custom protein
   */
  const handleAddCustom = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      const foodName = customFood.trim() || 'Custom Entry';
      quickAddProtein(foodName, amount);
      setCustomAmount('');
      setCustomFood('');
    }
  };

  /**
   * Reset daily tracking
   */
  const handleResetDay = () => {
    if (window.confirm('Reset today\'s protein tracking? This cannot be undone.')) {
      setDailyProtein(0);
      setProteinLog([]);
      const today = new Date().toDateString();
      const savedData = JSON.parse(localStorage.getItem('proteinTracking') || '{}');
      delete savedData[today];
      localStorage.setItem('proteinTracking', JSON.stringify(savedData));
      calculateStreak();
    }
  };

  /**
   * Edit profile
   */
  const handleEditProfile = () => {
    setUserProfile({...userProfile, profileComplete: false});
  };

  /**
   * Check trial status
   */
  const checkTrialStatus = () => {
    const startDate = localStorage.getItem('trialStartDate');
    if (!startDate) {
      localStorage.setItem('trialStartDate', new Date().toISOString());
    } else {
      const daysSinceStart = Math.floor(
        (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24)
      );
      const remaining = Math.max(0, 7 - daysSinceStart);
      setTrialDaysRemaining(remaining);

      if (remaining === 0 && !localStorage.getItem('isPaid')) {
        setShowPaywall(true);
      }
    }
  };

  // Get historical data for charts
  const getHistoricalData = (days = 30) => {
    const savedTracking = JSON.parse(localStorage.getItem('proteinTracking') || '{}');
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayData = savedTracking[dateStr];

      data.push({
        date: dateStr,
        shortDate: `${date.getMonth() + 1}/${date.getDate()}`,
        protein: dayData?.total || 0,
        metTarget: dayData?.metTarget || false,
        target: dayData?.target || abwData.proteinTargets.minimum
      });
    }

    return data;
  };

  // Calculate achievement rate
  const getAchievementRate = () => {
    const data = getHistoricalData(30);
    const daysWithData = data.filter(d => d.protein > 0).length;
    const daysMetTarget = data.filter(d => d.metTarget).length;
    return daysWithData > 0 ? Math.round((daysMetTarget / daysWithData) * 100) : 0;
  };

  // Organized protein food options by type
  const proteinFoods = {
    meat: [
      { name: 'Chicken Breast (4oz)', grams: 35, icon: '🍗' },
      { name: 'Turkey Breast (4oz)', grams: 32, icon: '🦃' },
      { name: 'Lean Steak (4oz)', grams: 32, icon: '🥩' },
      { name: 'Pork Tenderloin (4oz)', grams: 30, icon: '🍖' },
      { name: 'Ground Turkey (4oz)', grams: 28, icon: '🍔' },
      { name: 'Chicken Thigh (4oz)', grams: 28, icon: '🍗' },
      { name: 'Turkey Burger (4oz)', grams: 26, icon: '🍔' },
      { name: 'Turkey Sausage (2)', grams: 14, icon: '🌭' },
      { name: 'Deli Turkey (4oz)', grams: 20, icon: '🥪' },
      { name: 'Canadian Bacon (3)', grams: 15, icon: '🥓' },
      { name: 'Salmon (4oz)', grams: 28, icon: '🐠' },
      { name: 'Tuna (5oz can)', grams: 30, icon: '🐟' },
      { name: 'White Fish (5oz)', grams: 30, icon: '🐟' },
      { name: 'Shrimp (4oz)', grams: 24, icon: '🦐' },
    ],
    dairy: [
      { name: 'Greek Yogurt (6oz)', grams: 15, icon: '🥄' },
      { name: 'Cottage Cheese (1/2 cup)', grams: 14, icon: '🧀' },
      { name: 'String Cheese', grams: 7, icon: '🧀' },
      { name: 'Mozzarella (1oz)', grams: 6, icon: '🧀' },
      { name: 'Cheddar (1oz)', grams: 7, icon: '🧀' },
      { name: 'Milk (8oz)', grams: 8, icon: '🥛' },
    ],
    plantbased: [
      { name: 'Seitan (4oz)', grams: 28, icon: '🥙' },
      { name: 'Tempeh (4oz)', grams: 21, icon: '🌱' },
      { name: 'Tofu (6oz)', grams: 18, icon: '🥡' },
      { name: 'Edamame (1 cup)', grams: 18, icon: '🫛' },
      { name: 'Lentils (1 cup)', grams: 18, icon: '🍲' },
      { name: 'Black Beans (1 cup)', grams: 15, icon: '🫘' },
      { name: 'Chickpeas (1 cup)', grams: 15, icon: '🫘' },
      { name: 'Quinoa (1 cup)', grams: 8, icon: '🌾' },
    ],
    eggs: [
      { name: '3 Egg Whites', grams: 11, icon: '🍳' },
      { name: '2 Whole Eggs', grams: 12, icon: '🥚' },
      { name: '3 Whole Eggs', grams: 18, icon: '🥚' },
      { name: '4 Egg Whites', grams: 14, icon: '🍳' },
      { name: '1 Hard Boiled Egg', grams: 6, icon: '🥚' },
    ],
    supplements: [
      { name: 'Shake/Bar (15g)', grams: 15, icon: '🥤' },
      { name: 'Shake/Bar (20g)', grams: 20, icon: '🍫' },
      { name: 'Shake/Bar (25g)', grams: 25, icon: '🥛' },
      { name: 'Shake/Bar (30g)', grams: 30, icon: '💪' },
      { name: 'Shake/Bar (35g)', grams: 35, icon: '🏋️' },
      { name: 'Shake/Bar (40g)', grams: 40, icon: '💯' },
    ],
    snacks: [
      { name: 'Beef Jerky (1oz)', grams: 9, icon: '🥓' },
      { name: 'Turkey Jerky (1oz)', grams: 10, icon: '🦃' },
      { name: 'Almonds (1/4 cup)', grams: 8, icon: '🥜' },
      { name: 'Peanut Butter (2 tbsp)', grams: 8, icon: '🥜' },
      { name: 'Pumpkin Seeds (1/4 cup)', grams: 9, icon: '🌰' },
      { name: 'Roasted Chickpeas (1/2 cup)', grams: 7, icon: '🫘' },
    ]
  };

  const isProfileValid = () => {
    return userProfile.age && userProfile.gender && userProfile.weightLbs &&
           userProfile.heightFeet && userProfile.heightInches && userProfile.medication;
  };

  // Format category names for display
  const formatCategoryName = (category) => {
    const categoryNames = {
      meat: 'Meat & Poultry',
      dairy: 'Dairy',
      plantbased: 'Plant-Based',
      eggs: 'Eggs',
      supplements: 'Supplements',
      snacks: 'Snacks'
    };
    return categoryNames[category] || category;
  };

  // Education content
  const educationContent = [
    {
      id: 'why-protein',
      title: 'Why Protein Matters on GLP-1 Medications',
      icon: '💊',
      content: `GLP-1 medications are incredibly effective for weight loss, but they come with a critical challenge: they can lead to significant muscle loss alongside fat loss.

**The Problem You're Facing:**
- Studies show that 25-40% of weight lost on GLP-1 medications can be lean muscle mass
- Muscle loss leads to: slower metabolism, decreased strength, and difficulty maintaining results long-term
- **This is why 80-95% of people regain weight**—they lose muscle, not just fat, and can't sustain the changes
- Without muscle, your metabolism slows, making it nearly impossible to keep weight off after stopping medication

**The Solution (Evidence-Based):**
- Adequate protein intake is your primary defense against muscle loss during rapid weight loss
- Protein provides the building blocks (amino acids) your body needs to preserve muscle while fat is burned
- When combined with strength training, proper protein intake can preserve 95%+ of lean mass during weight loss
- **This is how you break the yo-yo cycle**: Build sustainable habits now while your appetite is suppressed

**Why This App?**
Your GLP-1 medication helps with appetite, but it doesn't teach healthy behaviors. This app helps you build tracking habits and protein awareness that will serve you for life—not just while you're on medication.`
    },
    {
      id: 'energy-balance',
      title: 'Energy Balance & Muscle Preservation',
      icon: '⚖️',
      content: `Getting enough protein is only part of the equation. You also need adequate total calories (energy) to preserve muscle.

**Why Energy Matters:**
When you don't eat enough total calories, your body enters a catabolic state where it breaks down muscle for energy—even if you're eating enough protein. Your dietary protein gets burned for fuel instead of being used to maintain muscle.

**Minimum Calorie Guidelines:**
- Women: At least 1,200 calories/day
- Men: At least 1,500 calories/day
- Most people need MORE based on height, activity level, and muscle mass

**The Reality:**
Many GLP-1 users struggle with extreme appetite suppression and unintentionally eat far below their needs. This accelerates muscle loss, slows metabolism, and can lead to nutrient deficiencies.

**Bottom Line:**
Meeting your protein target while severely undereating won't protect your muscles. You need both adequate protein AND adequate total energy.`
    },
    {
      id: 'strength-training',
      title: 'Strength Training: The Missing Piece',
      icon: '🏋️',
      content: `Protein intake alone isn't enough—you need to give your body a reason to keep that muscle.

**Why Strength Training Works:**
- Sends a powerful signal to your body: "We need this muscle!"
- Helps maintain or even build muscle during weight loss
- Increases metabolism and bone density
- Improves insulin sensitivity

**What You Need:**
- 2-3 sessions per week
- Focus on compound movements (squats, pushes, pulls)
- Progressive overload (gradually increase weight/difficulty)
- You don't need a gym—bodyweight exercises work too

**The Evidence:**
Research shows that combining adequate protein with resistance training can preserve 95%+ of lean mass during weight loss, compared to losing 25-40% without it.

**Start Simple:**
- Bodyweight squats, push-ups, rows
- Resistance bands
- Light dumbbells
- Work with a trainer if possible`
    },
    {
      id: 'undereating-signs',
      title: 'Warning Signs You\'re Undereating',
      icon: '⚠️',
      content: `GLP-1 medications can suppress appetite so much that you may not realize you're not eating enough. Watch for these red flags:

**Physical Signs:**
☐ Extreme fatigue or weakness
☐ Hair thinning or loss
☐ Brittle nails
☐ Feeling cold all the time
☐ Dizziness or lightheadedness
☐ Difficulty concentrating ("brain fog")

**Metabolic Signs:**
☐ Weight loss has completely stalled
☐ Loss of menstrual period (women)
☐ Decreased exercise performance
☐ Very low energy despite adequate sleep

**Behavioral Signs:**
☐ Obsessive thoughts about food
☐ Binge eating episodes
☐ Extreme irritability or mood swings

**What To Do:**
If you're experiencing several of these symptoms:
1. Track your food for 3-5 days (honestly)
2. Calculate your actual calorie intake
3. Gradually increase calories if below minimum
4. Consult your healthcare provider
5. Consider working with a registered dietitian

**Remember:** The goal is sustainable, healthy weight loss—not the fastest weight loss at any cost.`
    },
    {
      id: 'managing-side-effects',
      title: 'Managing GLP-1 Side Effects with Smart Protein Choices',
      icon: '🤢',
      content: `Many GLP-1 users experience nausea, bloating, or GI discomfort—especially in the first weeks. The right protein choices can help you meet your targets while minimizing discomfort.

**If You're Experiencing Nausea:**
✓ Choose bland, easily digestible proteins: Greek yogurt, eggs, protein shakes, cottage cheese
✓ Eat smaller, more frequent protein portions throughout the day
✓ Avoid greasy, fried, or heavily spiced proteins
✓ Try cold proteins (turkey slices, hard-boiled eggs) which may be more tolerable
✓ Sip protein shakes slowly over 15-20 minutes

**If You Have No Appetite:**
✓ Prioritize protein-dense foods first when you DO eat
✓ Use protein shakes or bars as convenient options
✓ Focus on quality over quantity—Greek yogurt, cottage cheese pack a lot of protein in small volumes
✓ Don't force large meals; spread protein across the day

**If You're Constipated:**
✓ Balance protein with fiber-rich plant-based options (lentils, beans, edamame)
✓ Stay hydrated—aim for 8+ glasses of water daily
✓ Include prunes, chia seeds, or psyllium husk
✓ Don't skip vegetables even when appetite is low

**General Tips:**
- Eat slowly and mindfully—GLP-1s slow gastric emptying, so rushing meals can cause discomfort
- Keep protein portions moderate at each meal (20-40g) rather than one huge serving
- Listen to your body's fullness cues, but track to ensure you're meeting minimums
- Side effects usually improve after 4-6 weeks as your body adjusts

**When to Call Your Doctor:**
- Severe, persistent nausea or vomiting that prevents eating
- Inability to meet minimum calorie needs for several days
- Severe abdominal pain or persistent GI symptoms`
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-scale-in">
          <div className="achievement-card max-w-sm">
            <div className="text-center">
              <div className="text-6xl mb-3 animate-bounce">{showAchievement.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-neutral-900">Achievement Unlocked!</h3>
              <p className="font-semibold text-primary-600 mb-1">{showAchievement.name}</p>
              <p className="text-sm text-neutral-500">{showAchievement.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Medical Disclaimer Banner */}
      {!userProfile.disclaimerAccepted && (
        <div className="bg-gradient-to-r from-warning-50 to-accent-coral/20 border-b-4 border-warning-400 shadow-medium animate-slide-down">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start gap-4">
              <div className="text-6xl animate-pulse-slow">⚠️</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-neutral-900">Welcome! Quick Medical Disclaimer</h3>
                <p className="text-base mb-4 text-neutral-700 leading-relaxed">
                  This app provides <strong>educational guidance and behavioral support</strong> for adults on GLP-1 medications. It is <strong>NOT medical advice</strong> and <strong>NOT safe for individuals with kidney disease</strong>. Always consult your healthcare provider before making significant dietary changes.
                </p>
                <p className="text-sm mb-6 text-neutral-600">
                  <strong>Created by a Registered Dietitian</strong> to help you build sustainable habits, preserve muscle mass, and feel confident about nutrition while using GLP-1 medications.
                </p>
                <button
                  onClick={() => setUserProfile({...userProfile, disclaimerAccepted: true})}
                  className="btn bg-gradient-energy text-white shadow-soft hover:shadow-glow-warning"
                >
                  I Understand & Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kidney Disease Screening */}
      {userProfile.disclaimerAccepted && userProfile.hasKidneyDisease === null && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="card shadow-hard p-10 max-w-lg w-full border-t-4 border-error-500 animate-scale-in">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4 animate-pulse-slow">🏥</div>
              <h2 className="text-4xl font-bold mb-3 text-neutral-900">Health Screening Required</h2>
              <p className="text-lg text-neutral-500">We need to ensure this tool is safe for you</p>
            </div>

            <div className="alert-error mb-8">
              <p className="font-semibold mb-3 text-neutral-900 text-lg">
                Do you have kidney disease or any condition affecting kidney function?
              </p>
              <p className="text-sm text-neutral-600">
                High protein intake can be dangerous for individuals with kidney disease. This tool should not be used if you have any kidney-related conditions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  alert('This tool is not safe for use with kidney disease. Please consult your healthcare provider for personalized nutrition guidance.');
                  window.location.href = 'https://kidney.org';
                }}
                className="btn py-5 bg-error-600 text-white shadow-soft hover:bg-error-700 hover:shadow-medium"
              >
                Yes, I have kidney disease
              </button>
              <button
                onClick={() => setUserProfile({...userProfile, hasKidneyDisease: false})}
                className="btn py-5 bg-success-600 text-white shadow-soft hover:bg-success-700 hover:shadow-medium"
              >
                No, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Content */}
      {userProfile.disclaimerAccepted && userProfile.hasKidneyDisease === false && (
        <>
          {/* Header */}
          <header className="chase-gradient chase-shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="animate-fade-in">
                  <div className="text-white text-sm font-semibold mb-3 uppercase tracking-wider opacity-90">
                    Chase Wellness
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    💪 GLP-1 Protein Tracker
                  </h1>
                  <p className="text-white text-lg mb-2 font-medium" style={{ opacity: 0.95 }}>
                    Mindful nourishment for your GLP-1 journey.
                  </p>
                  <p className="text-white text-base" style={{ opacity: 0.85 }}>
                    Build sustainable habits • Preserve muscle • Break the yo-yo cycle
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {currentStreak > 0 && userProfile.profileComplete && (
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '14px 20px', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.2)' }}>
                      <div className="text-xs font-bold uppercase text-white tracking-wider" style={{ opacity: 0.9 }}>Streak</div>
                      <div className="text-2xl font-bold text-white flex items-center gap-2">
                        🔥 {currentStreak} days
                      </div>
                    </div>
                  )}
                  {trialDaysRemaining > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '16px 24px', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.2)' }}>
                      <div className="text-xs font-bold uppercase text-white tracking-wider" style={{ opacity: 0.9 }}>Free Trial</div>
                      <div className="text-2xl font-bold text-white">{trialDaysRemaining} days left</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          {userProfile.profileComplete && (
            <div style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 40 }} className="chase-shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentView('track')}
                    className={`chase-nav-tab ${currentView === 'track' ? 'chase-nav-tab-active' : ''}`}
                  >
                    📊 Track
                  </button>
                  <button
                    onClick={() => setCurrentView('history')}
                    className={`chase-nav-tab ${currentView === 'history' ? 'chase-nav-tab-active' : ''}`}
                  >
                    📈 History
                  </button>
                  <button
                    onClick={() => setCurrentView('learn')}
                    className={`chase-nav-tab ${currentView === 'learn' ? 'chase-nav-tab-active' : ''}`}
                  >
                    📚 Learn
                  </button>
                  <button
                    onClick={() => setCurrentView('why')}
                    className={`chase-nav-tab ${currentView === 'why' ? 'chase-nav-tab-active' : ''}`}
                  >
                    💡 Why This App
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Setup */}
          {!userProfile.profileComplete && (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="card shadow-hard p-8 md:p-12 border-t-4 border-primary-600 animate-scale-in">
                <div className="text-center mb-12">
                  <div className="text-7xl mb-4 animate-float">💪</div>
                  <h2 className="text-5xl font-bold mb-4 text-neutral-900">Finally, Support Beyond Just Medication</h2>
                  <p className="text-xl mb-6 text-neutral-600">
                    Studies show 25-40% of weight lost on GLP-1s is muscle mass. Let's change that.
                  </p>
                  <div className="alert-info text-left mb-8">
                    <p className="font-bold text-lg mb-3 text-neutral-900">You're not looking for another diet...</p>
                    <p className="text-base text-neutral-700 mb-4 leading-relaxed">
                      You're tired of the yo-yo cycle. Your GLP-1 medication is helping with appetite, but you need to build sustainable habits that last—proper protein, healthy behaviors, and a saner relationship with food.
                    </p>
                    <div className="space-y-2 text-sm font-semibold text-primary-700">
                      <p>✓ Science-backed by Registered Dietitian</p>
                      <p>✓ Build habits to maintain your results</p>
                      <p>✓ Preserve muscle while you lose weight</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-neutral-900">Let's calculate your personalized protein targets</p>
                </div>

                <div className="space-y-8">
                  {/* Age & Gender Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-3 text-neutral-900">
                        Age <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={userProfile.age}
                        onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                        className="input py-4 text-lg"
                        placeholder="e.g., 45"
                        min="18"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-3 text-neutral-900">
                        Gender <span className="text-error-500">*</span>
                      </label>
                      <select
                        value={userProfile.gender}
                        onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                        className="input py-4 text-lg"
                      >
                        <option value="">Select...</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-bold mb-3 text-neutral-900">
                      Height <span className="text-error-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        value={userProfile.heightFeet}
                        onChange={(e) => setUserProfile({...userProfile, heightFeet: e.target.value})}
                        className="input py-4 text-lg"
                        placeholder="Feet"
                        min="4"
                        max="7"
                      />
                      <input
                        type="number"
                        value={userProfile.heightInches}
                        onChange={(e) => setUserProfile({...userProfile, heightInches: e.target.value})}
                        className="input py-4 text-lg"
                        placeholder="Inches"
                        min="0"
                        max="11"
                      />
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-bold mb-3 text-neutral-900">
                      Current Weight (lbs) <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={userProfile.weightLbs}
                      onChange={(e) => setUserProfile({...userProfile, weightLbs: e.target.value})}
                      className="input py-4 text-lg"
                      placeholder="e.g., 200"
                      min="50"
                      max="800"
                    />
                  </div>

                  {/* Medication */}
                  <div>
                    <label className="block text-sm font-bold mb-3 text-neutral-900">
                      GLP-1 Medication <span className="text-error-500">*</span>
                    </label>
                    <select
                      value={userProfile.medication}
                      onChange={(e) => setUserProfile({...userProfile, medication: e.target.value})}
                      className="input py-4 text-lg"
                    >
                      <option value="">Select your medication...</option>
                      <option value="Ozempic">💉 Ozempic (semaglutide)</option>
                      <option value="Wegovy">💉 Wegovy (semaglutide)</option>
                      <option value="Mounjaro">💉 Mounjaro (tirzepatide)</option>
                      <option value="Zepbound">💉 Zepbound (tirzepatide)</option>
                      <option value="Rybelsus">💊 Rybelsus (oral semaglutide)</option>
                      <option value="Trulicity">💉 Trulicity (dulaglutide)</option>
                      <option value="Victoza">💉 Victoza/Saxenda (liraglutide)</option>
                      <option value="Compounded">🧪 Compounded GLP-1</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleCalculateTargets}
                    disabled={!isProfileValid()}
                    className={`btn w-full py-6 text-xl font-bold shadow-medium ${
                      isProfileValid()
                        ? 'bg-gradient-primary text-white hover:shadow-glow-primary hover:scale-105'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    🎯 Calculate My Protein Targets
                  </button>
                </div>

                {/* Calorie Guidance After Calculation */}
                {abwData.calorieGuidance.minimum > 0 && (
                  <div className="mt-8 alert-warning animate-slide-up">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neutral-900">
                      ⚠️ Important: Energy Requirements
                    </h3>
                    <p className="mb-4 text-neutral-700 leading-relaxed">
                      Your protein targets have been calculated! But remember: <strong>protein alone won't protect your muscles if you're not eating enough total calories.</strong>
                    </p>
                    <div className="bg-white p-5 rounded-xl mb-4 border-2 border-warning-200 shadow-soft">
                      <p className="font-semibold mb-2 text-neutral-900">Your Minimum Calorie Needs:</p>
                      <p className="text-3xl font-bold text-gradient-primary">
                        At least {abwData.calorieGuidance.minimum} calories/day
                      </p>
                      <p className="text-sm mt-2 text-neutral-500">
                        Estimated needs: ~{abwData.calorieGuidance.estimated} calories/day (varies with activity)
                      </p>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      When you undereat, your body burns protein for energy instead of using it to maintain muscle. Learn more in the <strong>Education</strong> section.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TRACK VIEW */}
          {currentView === 'track' && userProfile.profileComplete && abwData.proteinTargets.minimum > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {/* Calorie Reminder */}
              <div className="alert-info animate-slide-down">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💡</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-neutral-900 mb-1">
                      Daily Reminder: Don't forget your minimum calories!
                    </p>
                    <p className="text-sm text-neutral-600">
                      {userProfile.gender === 'female' ? 'Women' : 'Men'}: At least {abwData.calorieGuidance.minimum} calories/day. Undereating causes muscle loss even with adequate protein.
                    </p>
                  </div>
                </div>
              </div>

              {/* Protein Targets Card */}
              <div className="card shadow-hard p-8 border-t-4 border-success-600 animate-slide-up">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="section-header">Your Daily Protein Targets</h2>
                    <p className="text-neutral-600">
                      Based on Adjusted Body Weight (ABW): <strong className="text-primary-600">{abwData.abwKg} kg</strong> | BMI: <strong className="text-primary-600">{abwData.bmi}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="btn-outline px-5 py-3 text-sm"
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
                <div className="alert-info mb-8">
                  <p className="text-base font-semibold text-neutral-900">
                    💡 Build Habits That Last: These targets help you preserve muscle while your medication helps with appetite. Track daily to build sustainable patterns you can maintain long-term.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card-hover text-center p-6 bg-error-50 border-2 border-error-200">
                    <div className="text-5xl mb-3">🎯</div>
                    <div className="text-sm font-bold mb-2 text-error-600 uppercase tracking-wider">Minimum</div>
                    <div className="text-6xl font-bold mb-2 text-error-600">{abwData.proteinTargets.minimum}g</div>
                    <div className="text-xs mb-2 font-semibold text-error-500">1.2 g/kg ABW</div>
                    <div className="text-sm text-neutral-600">Baseline for protecting muscle mass</div>
                  </div>

                  <div className="card-hover text-center p-6 bg-warning-50 border-2 border-warning-200">
                    <div className="text-5xl mb-3">⭐</div>
                    <div className="text-sm font-bold mb-2 text-warning-600 uppercase tracking-wider">Target</div>
                    <div className="text-6xl font-bold mb-2 text-warning-600">{abwData.proteinTargets.target}g</div>
                    <div className="text-xs mb-2 font-semibold text-warning-500">1.4 g/kg ABW</div>
                    <div className="text-sm text-neutral-600">Strong protection, aim for this daily</div>
                  </div>

                  <div className="card-hover text-center p-6 bg-success-50 border-2 border-success-200">
                    <div className="text-5xl mb-3">🏆</div>
                    <div className="text-sm font-bold mb-2 text-success-600 uppercase tracking-wider">Higher Protein</div>
                    <div className="text-6xl font-bold mb-2 text-success-600">{abwData.proteinTargets.higher}g</div>
                    <div className="text-xs mb-2 font-semibold text-success-500">1.6 g/kg ABW</div>
                    <div className="text-sm text-neutral-600">Maximum muscle preservation</div>
                  </div>
                </div>
              </div>

              {/* Daily Progress Card */}
              <div className="card shadow-hard p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                  <h2 className="section-header">Today's Progress</h2>
                  <button
                    onClick={handleResetDay}
                    className="btn bg-error-50 text-error-700 hover:bg-error-100 border-2 border-error-200 px-4 py-2 text-sm"
                  >
                    🔄 Reset Day
                  </button>
                </div>

                {/* Status Display */}
                <div className={`p-10 rounded-3xl mb-8 border-2 transition-all duration-300 ${
                  statusColor === 'red' ? 'status-critical' :
                  statusColor === 'yellow' ? 'status-warning' :
                  statusColor === 'green' ? 'status-success' :
                  statusColor === 'gold' ? 'status-optimal' : 'bg-neutral-100 border-neutral-200'
                }`}>
                  <div className="text-center">
                    <div className={`text-8xl font-bold mb-4 ${
                      statusColor === 'red' ? 'text-error-600' :
                      statusColor === 'yellow' ? 'text-warning-600' :
                      statusColor === 'green' ? 'text-success-600' :
                      statusColor === 'gold' ? 'text-gradient-energy' : 'text-neutral-500'
                    }`}>{dailyProtein}g</div>
                    <div className="text-2xl font-bold mb-6 text-neutral-900">{currentStatus}</div>
                    <div className="progress-container h-6">
                      <div
                        className={`progress-bar ${
                          statusColor === 'red' ? 'from-error-500 to-error-600' :
                          statusColor === 'yellow' ? 'from-warning-500 to-warning-600' :
                          statusColor === 'green' ? 'from-success-500 to-success-600' :
                          statusColor === 'gold' ? 'from-warning-500 to-success-600' :
                          'from-neutral-400 to-neutral-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (dailyProtein / abwData.proteinTargets.higher) * 100)}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-4 text-neutral-600 font-semibold">
                      <span>0g</span>
                      <span className="text-base">{Math.round((dailyProtein / abwData.proteinTargets.minimum) * 100)}% of minimum</span>
                      <span>{abwData.proteinTargets.higher}g</span>
                    </div>
                  </div>
                </div>

                {/* Quick Tip Box */}
                <div className="bg-gradient-to-r from-purple-50 to-primary-50 rounded-xl p-5 mb-8 border-l-4 border-purple-500 shadow-soft">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">💡</div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-neutral-900 mb-2">Feeling nauseous or low appetite?</p>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        Try easily digestible options like Greek yogurt, eggs, or protein shakes. Spread protein across smaller portions throughout the day. Check the <strong>Learn tab</strong> for detailed tips on managing GLP-1 side effects.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-custom">
                  {Object.keys(proteinFoods).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-8 py-4 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${
                        activeCategory === category
                          ? 'bg-primary-600 text-white shadow-glow-primary'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {formatCategoryName(category)}
                    </button>
                  ))}
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  {proteinFoods[activeCategory].map((food) => (
                    <button
                      key={food.name}
                      onClick={() => quickAddProtein(food.name, food.grams)}
                      className="food-btn"
                    >
                      <div className="text-5xl mb-2">{food.icon}</div>
                      <div className="text-xs font-bold mb-2 text-neutral-900 leading-tight">{food.name}</div>
                      <div className="text-2xl font-bold text-primary-600">+{food.grams}g</div>
                    </button>
                  ))}
                </div>

                {/* Custom Add */}
                <div className="p-8 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50">
                  <h3 className="font-bold text-lg mb-6 text-neutral-900">Add Custom Entry</h3>
                  <div className="flex gap-4 flex-wrap">
                    <input
                      type="text"
                      value={customFood}
                      onChange={(e) => setCustomFood(e.target.value)}
                      placeholder="Food name (optional)"
                      className="input flex-1 min-w-[200px]"
                    />
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Protein (g)"
                      className="input w-40"
                    />
                    <button
                      onClick={handleAddCustom}
                      disabled={!customAmount || parseInt(customAmount) <= 0}
                      className={`btn px-8 ${
                        customAmount && parseInt(customAmount) > 0
                          ? 'btn-primary'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Today's Log */}
                {proteinLog.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-bold mb-4 text-lg" style={{ color: '#12263f' }}>
                      Today's Log <span className="text-sm font-normal" style={{ color: '#6e84a3' }}>({proteinLog.length} entries)</span>
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {proteinLog.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center px-4 py-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md" style={{ backgroundColor: '#f9fbfd', borderColor: '#d2ddec' }}>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-xs px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#2c7be5' }}>#{index + 1}</span>
                            <span className="font-semibold" style={{ color: '#12263f' }}>{entry.food}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-xl mr-2" style={{ color: '#2c7be5' }}>{entry.grams}g</span>
                            <span className="text-xs" style={{ color: '#6e84a3' }}>{entry.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Insights Card */}
              <div className="rounded-2xl shadow-xl p-8 border-2" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderColor: '#93c5fd' }}>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{ color: '#12263f' }}>
                  💡 Muscle Preservation Analysis
                </h2>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-xl border-2" style={{ borderColor: '#d2ddec' }}>
                    <p style={{ color: '#3e4b5b' }}>
                      <strong style={{ color: '#12263f' }}>Current Adequacy:</strong> {Math.round((dailyProtein / abwData.proteinTargets.minimum) * 100)}% of minimum target
                    </p>
                  </div>

                  {dailyProtein < abwData.proteinTargets.minimum && (
                    <div className="bg-red-50 p-5 rounded-xl" style={{ borderLeft: '4px solid #e63757' }}>
                      <p className="font-bold mb-2" style={{ color: '#e63757', fontSize: '1.1rem' }}>⚠️ Action Required</p>
                      <p style={{ color: '#3e4b5b' }}>
                        You need <strong style={{ color: '#e63757' }}>{abwData.proteinTargets.minimum - dailyProtein}g more protein</strong> today to meet your minimum target and protect muscle mass.
                      </p>
                    </div>
                  )}

                  {dailyProtein >= abwData.proteinTargets.minimum && dailyProtein < abwData.proteinTargets.higher && (
                    <div className="bg-green-50 p-5 rounded-xl" style={{ borderLeft: '4px solid #059669' }}>
                      <p className="font-bold mb-2" style={{ color: '#059669', fontSize: '1.1rem' }}>✅ Good Progress!</p>
                      <p style={{ color: '#3e4b5b' }}>
                        You're meeting your minimum. Add <strong style={{ color: '#059669' }}>{abwData.proteinTargets.higher - dailyProtein}g more</strong> to reach higher protein target.
                      </p>
                    </div>
                  )}

                  {dailyProtein >= abwData.proteinTargets.higher && (
                    <div className="bg-amber-50 p-5 rounded-xl" style={{ borderLeft: '4px solid #f6c343' }}>
                      <p className="font-bold mb-2" style={{ color: '#f6c343', fontSize: '1.1rem' }}>🏆 Excellent Work!</p>
                      <p style={{ color: '#3e4b5b' }}>
                        You've reached your higher protein target. Your muscles are well-protected during weight loss!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HISTORY VIEW */}
          {currentView === 'history' && userProfile.profileComplete && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-2">🔥</div>
                  <div className="text-3xl font-bold" style={{ color: '#2c7be5' }}>{currentStreak}</div>
                  <div className="text-sm" style={{ color: '#6e84a3' }}>Current Streak</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-3xl font-bold" style={{ color: '#f6c343' }}>{longestStreak}</div>
                  <div className="text-sm" style={{ color: '#6e84a3' }}>Longest Streak</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-3xl font-bold" style={{ color: '#059669' }}>{getAchievementRate()}%</div>
                  <div className="text-sm" style={{ color: '#6e84a3' }}>Success Rate (30 days)</div>
                </div>
              </div>

              {/* Achievement Badges */}
              {achievements.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: '#12263f' }}>🏅 Your Achievements</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {achievements.map(achievement => (
                      <div key={achievement.id} className="text-center p-4 rounded-xl border-2" style={{ backgroundColor: '#f9fbfd', borderColor: '#d2ddec' }}>
                        <div className="text-5xl mb-2">{achievement.icon}</div>
                        <div className="font-bold text-sm" style={{ color: '#12263f' }}>{achievement.name}</div>
                        <div className="text-xs" style={{ color: '#6e84a3' }}>{achievement.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Line Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#12263f' }}>📈 30-Day Protein Intake</h2>
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 800 250">
                    {/* Grid lines */}
                    <line x1="50" y1="10" x2="50" y2="210" stroke="#d2ddec" strokeWidth="2"/>
                    <line x1="50" y1="210" x2="780" y2="210" stroke="#d2ddec" strokeWidth="2"/>

                    {/* Target line */}
                    <line
                      x1="50"
                      y1={210 - ((abwData.proteinTargets.minimum / (abwData.proteinTargets.higher + 20)) * 200)}
                      x2="780"
                      y2={210 - ((abwData.proteinTargets.minimum / (abwData.proteinTargets.higher + 20)) * 200)}
                      stroke="#e63757"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />

                    {/* Data line */}
                    <polyline
                      fill="none"
                      stroke="#2c7be5"
                      strokeWidth="3"
                      points={getHistoricalData(30).map((d, i) => {
                        const x = 50 + (i * (730 / 30));
                        const y = 210 - ((d.protein / (abwData.proteinTargets.higher + 20)) * 200);
                        return `${x},${y}`;
                      }).join(' ')}
                    />

                    {/* Data points */}
                    {getHistoricalData(30).map((d, i) => {
                      const x = 50 + (i * (730 / 30));
                      const y = 210 - ((d.protein / (abwData.proteinTargets.higher + 20)) * 200);
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill={d.metTarget ? '#059669' : '#e63757'}
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#059669' }}></div>
                    <span className="text-sm" style={{ color: '#6e84a3' }}>Met Target</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#e63757' }}></div>
                    <span className="text-sm" style={{ color: '#6e84a3' }}>Below Target</span>
                  </div>
                </div>
              </div>

              {/* Calendar View */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#12263f' }}>📅 30-Day Calendar</h2>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-sm py-2" style={{ color: '#6e84a3' }}>
                      {day}
                    </div>
                  ))}
                  {(() => {
                    const data = getHistoricalData(30);
                    const firstDate = new Date(data[0].date);
                    const firstDay = firstDate.getDay();
                    const cells = [];

                    // Empty cells for days before first date
                    for (let i = 0; i < firstDay; i++) {
                      cells.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                    }

                    // Calendar cells
                    data.forEach((d, i) => {
                      const date = new Date(d.date);
                      cells.push(
                        <div
                          key={i}
                          className="aspect-square p-2 rounded-lg text-center border-2"
                          style={{
                            backgroundColor: d.protein === 0 ? '#f9fbfd' :
                                          d.metTarget ? '#f0fdf4' : '#fff5f5',
                            borderColor: d.protein === 0 ? '#d2ddec' :
                                       d.metTarget ? '#86efac' : '#feb2b2'
                          }}
                        >
                          <div className="text-xs font-bold" style={{ color: '#12263f' }}>
                            {date.getDate()}
                          </div>
                          {d.protein > 0 && (
                            <div className="text-xs font-semibold" style={{
                              color: d.metTarget ? '#059669' : '#e63757'
                            }}>
                              {d.protein}g
                            </div>
                          )}
                        </div>
                      );
                    });

                    return cells;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* LEARN VIEW */}
          {currentView === 'learn' && userProfile.profileComplete && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3" style={{ color: '#12263f' }}>📚 Education Center</h2>
                <p className="text-lg" style={{ color: '#6e84a3' }}>
                  Evidence-based information to help you preserve muscle during GLP-1 weight loss
                </p>
              </div>

              {educationContent.map((section, index) => (
                <details key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden" open={index === 0}>
                  <summary className="px-8 py-6 cursor-pointer hover:bg-gray-50 transition-all duration-200 flex items-center gap-4">
                    <div className="text-4xl">{section.icon}</div>
                    <h3 className="text-2xl font-bold flex-1" style={{ color: '#12263f' }}>{section.title}</h3>
                    <div className="text-2xl" style={{ color: '#6e84a3' }}>▼</div>
                  </summary>
                  <div className="px-8 py-6 border-t-2" style={{ borderColor: '#edf2f9' }}>
                    <div className="prose max-w-none" style={{ color: '#3e4b5b' }}>
                      {section.content.split('\n\n').map((paragraph, i) => {
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return <h4 key={i} className="font-bold text-lg mt-4 mb-2" style={{ color: '#12263f' }}>{paragraph.replace(/\*\*/g, '')}</h4>;
                        }
                        if (paragraph.startsWith('☐')) {
                          return (
                            <div key={i} className="flex items-start gap-2 mb-2">
                              <input type="checkbox" className="mt-1" />
                              <span>{paragraph.substring(2)}</span>
                            </div>
                          );
                        }
                        return <p key={i} className="mb-4 whitespace-pre-line">{paragraph}</p>;
                      })}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* WHY THIS APP VIEW */}
          {currentView === 'why' && userProfile.profileComplete && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
              {/* Hero Section */}
              <div className="text-center mb-16">
                <h1 className="chase-section-header text-4xl mb-4">Why This App Exists</h1>
                <p className="chase-section-subheader text-xl max-w-2xl mx-auto">
                  Because you deserve more than another diet. You deserve compassionate, evidence-based support for lasting change.
                </p>
              </div>

              {/* The Problem Section */}
              <div className="chase-card mb-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark-text)' }}>The Problem We're Solving</h2>
                <div className="space-y-4 text-base" style={{ color: 'var(--neutral-gray)', lineHeight: 1.7 }}>
                  <p>
                    <strong style={{ color: 'var(--dark-text)' }}>GLP-1 medications like Ozempic and Wegovy are powerful tools</strong>—but they don't come with instructions for how to eat, what to prioritize, or how to build habits that last beyond the medication.
                  </p>
                  <p>
                    The result? <strong style={{ color: 'var(--dark-text)' }}>25-40% of weight lost is muscle mass.</strong> Without adequate protein and mindful nutrition, people lose strength, slow their metabolism, and struggle to maintain their results. This is why <strong style={{ color: 'var(--dark-text)' }}>80-95% of people regain the weight</strong>—the yo-yo cycle continues.
                  </p>
                  <p>
                    And beyond the physical toll, there's confusion, fear, and overwhelm. What should I eat when I'm not hungry? Is this nausea normal? Am I getting enough nutrients? These questions deserve compassionate, clear answers.
                  </p>
                </div>
              </div>

              {/* The Solution Section */}
              <div className="chase-card mb-8" style={{ borderLeft: '4px solid var(--brand-blue)' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-blue)' }}>Our Approach: Evidence-Based Compassion</h2>
                <div className="space-y-4 text-base" style={{ color: 'var(--neutral-gray)', lineHeight: 1.7 }}>
                  <p>
                    <strong style={{ color: 'var(--dark-text)' }}>This app was created by a Registered Dietitian</strong> who understands both the science of nutrition and the human experience of change. We don't believe in willpower or restriction—we believe in understanding, curiosity, and building sustainable patterns.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 my-6">
                    <div className="chase-alert-info">
                      <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>💪 Preserve Your Muscle</h3>
                      <p className="text-sm">ABW-based protein targets designed specifically for adults on GLP-1s to protect lean mass during rapid weight loss.</p>
                    </div>
                    <div className="chase-alert-info">
                      <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>🧠 Build Habits That Last</h3>
                      <p className="text-sm">Daily tracking and education help you develop patterns you can maintain for life—not just while on medication.</p>
                    </div>
                    <div className="chase-alert-info">
                      <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>📚 Understand Your Body</h3>
                      <p className="text-sm">Learn to manage side effects, recognize hunger cues, and make informed choices with confidence.</p>
                    </div>
                    <div className="chase-alert-info">
                      <h3 className="font-bold mb-2" style={{ color: 'var(--dark-text)' }}>❤️ Compassionate Guidance</h3>
                      <p className="text-sm">No judgment, no shame—just gentle, professional support for your unique journey.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chase Wellness Values */}
              <div className="chase-card mb-8" style={{ background: 'var(--light-background)' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark-text)' }}>Our Core Values</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2" style={{ color: 'var(--brand-blue)' }}>
                      ❤️ Compassion
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--neutral-gray)' }}>
                      Your journey is unique and worthy of kindness. We meet you where you are, without judgment.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2" style={{ color: 'var(--brand-blue)' }}>
                      🔬 Evidence-Based Wisdom
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--neutral-gray)' }}>
                      Every recommendation is backed by nutrition science and clinical research—no fads, just facts.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2" style={{ color: 'var(--brand-blue)' }}>
                      🧘 Body Awareness
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--neutral-gray)' }}>
                      Learn to listen to your body's signals and honor its needs, even when they change.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2" style={{ color: 'var(--brand-blue)' }}>
                      🌱 Understanding Over Willpower
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--neutral-gray)' }}>
                      Lasting change comes from insight, not force. We help you understand the "why" behind the "what."
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <p className="text-lg mb-6" style={{ color: 'var(--neutral-gray)' }}>
                  Ready to build sustainable habits and preserve your hard-earned muscle?
                </p>
                <button
                  onClick={() => setCurrentView('track')}
                  className="chase-button chase-button-primary text-lg"
                >
                  Start Tracking Today →
                </button>
              </div>
            </div>
          )}

          {/* Paywall Modal */}
          {showPaywall && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-neutral-900/80 backdrop-blur-lg">
              <div className="card shadow-hard p-12 max-w-md border-t-4 border-primary-600 animate-scale-in">
                <div className="text-center mb-10">
                  <div className="text-8xl mb-6 animate-float">💪</div>
                  <h2 className="text-5xl font-bold mb-4 text-neutral-900">Continue Your Journey</h2>
                  <p className="text-xl text-neutral-600 leading-relaxed">Your 7-day trial has ended. Subscribe to keep protecting your muscle mass!</p>
                </div>
                <div className="space-y-5">
                  <button
                    onClick={() => window.location.href = 'https://buy.stripe.com/your-link'}
                    className="btn btn-success w-full py-6 text-xl font-bold shadow-medium hover:shadow-glow-success"
                  >
                    Monthly Plan - $17/mo
                  </button>
                  <button
                    onClick={() => window.location.href = 'https://buy.stripe.com/your-lifetime-link'}
                    className="btn w-full py-6 text-xl font-bold text-white bg-gradient-premium shadow-medium hover:shadow-glow-primary"
                  >
                    Lifetime Access - $97
                    <span className="block text-base font-medium opacity-90 mt-1">Save 76% • Best Value!</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-20 py-12 bg-neutral-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-base mb-4 text-neutral-300 leading-relaxed">
                ⚠️ This tool is not medical advice. Not for use with kidney disease.
                Consult your healthcare provider before making dietary changes.
              </p>
              <p className="text-sm text-neutral-500">
                © 2024 GLP-1 Muscle Rescue Protocol | Created by Dan, RD
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
