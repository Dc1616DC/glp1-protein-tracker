# 💪 GLP-1 Protein Tracker

A mobile-first web app designed specifically for adults using GLP-1 medications (Ozempic, Wegovy, Mounjaro, Zepbound) to preserve muscle mass during weight loss through evidence-based protein tracking.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://glp1-protein-tracker-cp3o33h4v-dans-projects-9331cd36.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Created by a Registered Dietitian** to address the critical gap in GLP-1 weight loss support: muscle preservation through proper protein intake.

## 📸 Screenshots

*[Screenshots coming soon - add images to `/public/screenshots/`]*

**Track View** | **History View** | **Education**
:---:|:---:|:---:
Daily protein tracking | 30-day trends & streaks | Evidence-based guidance

## 🎯 The Problem

GLP-1 medications are incredibly effective for weight loss, but they come with a serious challenge:

- **25-40% of weight lost can be muscle mass** (not just fat)
- **80-95% of people regain weight** after stopping medication
- Muscle loss slows metabolism, making long-term success difficult
- Most calorie trackers aren't designed for GLP-1 users' specific needs

## ✨ The Solution

This app provides **science-backed protein targets** using Adjusted Body Weight (ABW) calculations specifically validated for adults with obesity on GLP-1 medications:

- **Personalized Targets**: Based on your BMI and body composition
- **Daily Tracking**: 390+ food database with quick-add buttons
- **Progress Monitoring**: Streaks, achievements, and 30-day trends
- **Education**: Evidence-based articles on muscle preservation
- **Mobile-First**: Clean, simple UI optimized for daily use

## 🚀 Features

### Core Tracking
- ✅ **ABW-Based Calculations** - Clinically validated protein targets (1.2-1.6 g/kg ABW)
- ✅ **Quick-Add Food Database** - 390+ common protein sources organized by category
- ✅ **Daily Progress Tracking** - Visual progress bars and status badges
- ✅ **Custom Entries** - Add any food with custom protein amounts
- ✅ **Today's Log** - Review all entries with timestamps

### History & Analytics
- 📈 **30-Day Charts** - SVG line charts showing protein intake trends
- 📅 **Calendar View** - Heatmap visualization of daily success
- 🔥 **Streak Tracking** - Current and longest streaks for motivation
- 🏆 **Achievements** - Unlock badges for milestones
- 📊 **Success Rate** - Percentage of days hitting targets

### Education
- 📚 **5 Evidence-Based Articles**:
  - Why protein matters on GLP-1 medications
  - Energy balance & muscle preservation
  - Strength training guidance
  - Warning signs of undereating
  - Managing GLP-1 side effects with smart protein choices

### Mobile Optimization
- 📱 **Bottom Tab Navigation** - Easy thumb access
- 🎨 **Clean, Minimal Design** - Focus on functionality
- 👆 **Large Touch Targets** - Minimum 48px for easy tapping
- 💾 **Offline Support** - localStorage persistence
- 🔒 **Privacy First** - No data collection, no accounts required

## 🧮 The Science Behind ABW

### What is Adjusted Body Weight (ABW)?

ABW is a clinically validated formula that accounts for excess body weight when calculating nutritional needs for individuals with obesity:

```
ABW = IBW + (Adjustment Factor × (Current Weight - IBW))
```

Where:
- **IBW** (Ideal Body Weight) = Hamwi formula based on height and gender
- **Adjustment Factor** = 0.25-0.4 depending on BMI
  - BMI > 40: 0.25
  - BMI 35-40: 0.30
  - BMI 30-35: 0.35
  - BMI < 30: 0.40

### Protein Targets

Based on ABW, the app calculates three targets:

| Target | Calculation | Purpose |
|--------|-------------|---------|
| **Minimum** | 1.2 g/kg ABW | Baseline muscle protection |
| **Target** | 1.4 g/kg ABW | Strong protection (daily goal) |
| **Higher** | 1.6 g/kg ABW | Maximum preservation |

### Why These Numbers?

Research shows that adequate protein intake during GLP-1 weight loss:
- Preserves up to **95% of lean muscle mass** (vs. 60-75% without)
- Maintains **metabolic rate** during weight loss
- Reduces **weight regain risk** after stopping medication
- Supports **long-term habit formation**

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 + Custom CSS Variables
- **Storage**: localStorage (no backend required)
- **Deployment**: Vercel
- **Charts**: Native SVG (no dependencies)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/Dc1616DC/glp1-protein-tracker.git
cd glp1-protein-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🎮 Usage

### First Time Setup

1. Accept the medical disclaimer
2. Complete kidney disease screening (high protein not safe for kidney disease)
3. Enter your profile:
   - Age and gender
   - Height and current weight
   - GLP-1 medication type
4. Review your personalized protein targets

### Daily Tracking

1. **Track Tab** (📊):
   - Select food category (Meat, Dairy, Plant-Based, etc.)
   - Tap foods to add protein
   - Add custom entries if needed
   - Monitor progress bar and status

2. **History Tab** (📈):
   - View 30-day trends
   - Check current and longest streaks
   - See achievement badges
   - Review calendar heatmap

3. **Learn Tab** (📚):
   - Read evidence-based articles
   - Understand the science
   - Get practical tips

4. **Why Tab** (💡):
   - Learn about the app's mission
   - Understand the problem we're solving

## 📊 Data Export

*[Feature coming soon]* - Export your tracking data as CSV or JSON.

## 🔐 Privacy & Data

- **No Account Required** - Start tracking immediately
- **Local Storage Only** - Data stays on your device
- **No Analytics** - We don't track you
- **No Ads** - Clean, distraction-free experience
- **Open Source** - Transparent, auditable code

## ⚠️ Medical Disclaimer

This app is for **educational purposes only** and is **NOT medical advice**. It should:
- ✅ Be used alongside guidance from your healthcare provider
- ✅ Help you build awareness and track intake
- ✅ Provide evidence-based education

It should **NOT**:
- ❌ Be used by individuals with kidney disease
- ❌ Replace professional medical advice
- ❌ Be used without consulting your doctor about dietary changes

**Always consult your healthcare provider before making significant dietary changes.**

## 🤝 Contributing

Contributions are welcome! This app is designed to help the GLP-1 community.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- Additional food items in the database
- Translations for international users
- UI/UX improvements
- Bug fixes
- Documentation improvements
- Educational content updates

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Created by Dan, RD (Registered Dietitian)
- Built with insights from GLP-1 user communities
- Informed by clinical research on protein needs during weight loss
- Inspired by the need for better support tools in the GLP-1 space

## 📮 Contact & Feedback

- **Issues**: [GitHub Issues](https://github.com/Dc1616DC/glp1-protein-tracker/issues)
- **Live Demo**: [glp1-protein-tracker.vercel.app](https://glp1-protein-tracker-cp3o33h4v-dans-projects-9331cd36.vercel.app)

## 🗺️ Roadmap

### Completed ✅
- [x] ABW-based protein calculations
- [x] Daily tracking with food database
- [x] History charts and calendar
- [x] Achievement system
- [x] Educational content
- [x] Mobile-first responsive design

### In Progress 🚧
- [ ] Data export (CSV/JSON)
- [ ] Error boundaries
- [ ] PWA manifest
- [ ] Food search/filter
- [ ] First-time user onboarding

### Planned 📋
- [ ] Barcode scanning
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Nutritional API integration
- [ ] Cross-device sync (optional backend)

---

**Made with ❤️ for the GLP-1 community**

*Help preserve muscle, build habits, and break the yo-yo cycle.*
