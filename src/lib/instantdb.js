import { init } from '@instantdb/react';

// Initialize InstantDB with your app ID
export const db = init({
  appId: '9f67ea31-9a47-4207-a52c-5c5c1a45fbd3',
});

// Data schema definition
export const schema = {
  // User profiles
  profiles: {
    fields: {
      userId: 'string',
      age: 'number',
      gender: 'string',
      weightLbs: 'number',
      heightFeet: 'number',
      heightInches: 'number',
      medication: 'string',
      disclaimerAccepted: 'boolean',
      profileComplete: 'boolean',
      // Calculated ABW data
      bmi: 'number',
      ibwKg: 'number',
      abwKg: 'number',
      proteinMinimum: 'number',
      proteinTarget: 'number',
      proteinHigher: 'number',
      calorieMinimum: 'number',
      calorieEstimated: 'number',
    },
  },

  // Daily protein logs
  proteinLogs: {
    fields: {
      userId: 'string',
      date: 'string', // YYYY-MM-DD format
      food: 'string',
      grams: 'number',
      time: 'string',
    },
  },

  // Achievements
  achievements: {
    fields: {
      userId: 'string',
      achievementId: 'string',
      name: 'string',
      description: 'string',
      icon: 'string',
      unlockedAt: 'string',
    },
  },

  // Streak data
  streaks: {
    fields: {
      userId: 'string',
      currentStreak: 'number',
      longestStreak: 'number',
      lastLogDate: 'string',
    },
  },
};

// Helper functions for querying
export const queries = {
  // Get current user's profile
  getUserProfile: () => ({
    profiles: {},
  }),

  // Get protein logs for a specific date
  getProteinLogsForDate: (date) => ({
    proteinLogs: {
      $: {
        where: {
          date,
        },
      },
    },
  }),

  // Get all protein logs (for history)
  getAllProteinLogs: () => ({
    proteinLogs: {},
  }),

  // Get achievements
  getAchievements: () => ({
    achievements: {},
  }),

  // Get streak data
  getStreaks: () => ({
    streaks: {},
  }),
};
