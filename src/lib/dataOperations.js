import { db } from './instantdb';
import { id } from '@instantdb/react';

/**
 * Save user profile to InstantDB
 */
export async function saveProfile(userId, profileData) {
  const profileId = `profile-${userId}`;

  await db.transact([
    db.tx.profiles[profileId].update({
      userId,
      age: parseInt(profileData.age),
      gender: profileData.gender,
      weightLbs: parseFloat(profileData.weightLbs),
      heightFeet: parseInt(profileData.heightFeet),
      heightInches: parseInt(profileData.heightInches),
      medication: profileData.medication,
      disclaimerAccepted: profileData.disclaimerAccepted,
      profileComplete: profileData.profileComplete,
      // ABW calculations
      bmi: profileData.bmi || 0,
      ibwKg: profileData.ibwKg || 0,
      abwKg: profileData.abwKg || 0,
      proteinMinimum: profileData.proteinMinimum || 0,
      proteinTarget: profileData.proteinTarget || 0,
      proteinHigher: profileData.proteinHigher || 0,
      calorieMinimum: profileData.calorieMinimum || 0,
      calorieEstimated: profileData.calorieEstimated || 0,
      updatedAt: new Date().toISOString(),
    }),
  ]);
}

/**
 * Log protein entry to InstantDB
 */
export async function logProtein(userId, date, foodEntry) {
  const logId = id(); // Generate unique ID

  await db.transact([
    db.tx.proteinLogs[logId].update({
      userId,
      date, // YYYY-MM-DD format
      food: foodEntry.food,
      grams: parseFloat(foodEntry.grams),
      time: foodEntry.time,
      createdAt: new Date().toISOString(),
    }),
  ]);
}

/**
 * Update streak data
 */
export async function updateStreak(userId, currentStreak, longestStreak, lastLogDate) {
  const streakId = `streak-${userId}`;

  await db.transact([
    db.tx.streaks[streakId].update({
      userId,
      currentStreak,
      longestStreak,
      lastLogDate,
      updatedAt: new Date().toISOString(),
    }),
  ]);
}

/**
 * Save achievement
 */
export async function saveAchievement(userId, achievement) {
  const achievementId = id();

  await db.transact([
    db.tx.achievements[achievementId].update({
      userId,
      achievementId: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      unlockedAt: new Date().toISOString(),
    }),
  ]);
}

/**
 * Delete protein log entry
 */
export async function deleteProteinLog(logId) {
  await db.transact([
    db.tx.proteinLogs[logId].delete(),
  ]);
}

/**
 * Migrate localStorage data to InstantDB (one-time operation)
 */
export async function migrateLocalStorageData(userId) {
  try {
    // Migrate user profile
    const storedProfile = localStorage.getItem('userProfile');
    const storedAbw = localStorage.getItem('abwData');

    if (storedProfile && storedAbw) {
      const profile = JSON.parse(storedProfile);
      const abw = JSON.parse(storedAbw);

      await saveProfile(userId, {
        ...profile,
        bmi: abw.bmi,
        ibwKg: abw.ibwKg,
        abwKg: abw.abwKg,
        proteinMinimum: abw.proteinTargets?.minimum || 0,
        proteinTarget: abw.proteinTargets?.target || 0,
        proteinHigher: abw.proteinTargets?.higher || 0,
        calorieMinimum: abw.calorieGuidance?.minimum || 0,
        calorieEstimated: abw.calorieGuidance?.estimated || 0,
      });
    }

    // Migrate protein logs
    const storedLogs = localStorage.getItem('proteinTracking');
    if (storedLogs) {
      const logs = JSON.parse(storedLogs);
      for (const [date, dayData] of Object.entries(logs)) {
        if (dayData.log && Array.isArray(dayData.log)) {
          for (const entry of dayData.log) {
            await logProtein(userId, date, entry);
          }
        }
      }
    }

    // Migrate streaks
    const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
    const longestStreak = parseInt(localStorage.getItem('longestStreak') || '0');
    const lastLogDate = localStorage.getItem('lastLogDate') || '';

    if (currentStreak > 0 || longestStreak > 0) {
      await updateStreak(userId, currentStreak, longestStreak, lastLogDate);
    }

    // Migrate achievements
    const storedAchievements = localStorage.getItem('achievements');
    if (storedAchievements) {
      const achievements = JSON.parse(storedAchievements);
      for (const achievement of achievements) {
        await saveAchievement(userId, achievement);
      }
    }

    console.log('✅ Successfully migrated localStorage data to InstantDB');

    // Mark migration as complete
    localStorage.setItem('instantdb-migrated', 'true');

    return true;
  } catch (error) {
    console.error('❌ Error migrating data:', error);
    return false;
  }
}
