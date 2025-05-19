// Gamification system for SmartClass

// Types
export interface UserProgress {
  userId: string
  xp: number
  level: number
  streak: number
  lastActivity: string
  completedLessons: string[]
  completedQuizzes: string[]
  badges: Badge[]
  achievements: Achievement[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  dateEarned: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  xpReward: number
  progress: number
  total: number
  completed: boolean
  dateCompleted?: string
}

// Default badges
export const BADGES = {
  FIRST_LESSON: {
    id: "first_lesson",
    name: "First Step",
    description: "Completed your first lesson",
    icon: "award",
  },
  FIRST_QUIZ: {
    id: "first_quiz",
    name: "Quiz Taker",
    description: "Completed your first quiz",
    icon: "brain",
  },
  PERFECT_QUIZ: {
    id: "perfect_quiz",
    name: "Perfect Score",
    description: "Achieved 100% on a quiz",
    icon: "trophy",
  },
  STREAK_7: {
    id: "streak_7",
    name: "Weekly Warrior",
    description: "Maintained a 7-day learning streak",
    icon: "flame",
  },
  SUBJECT_MASTER: {
    id: "subject_master",
    name: "Subject Master",
    description: "Completed all topics in a subject",
    icon: "medal",
  },
}

// Default achievements
export const ACHIEVEMENTS = [
  {
    id: "complete_5_lessons",
    name: "Learning Enthusiast",
    description: "Complete 5 lessons",
    xpReward: 50,
    total: 5,
  },
  {
    id: "complete_10_quizzes",
    name: "Quiz Champion",
    description: "Complete 10 quizzes",
    xpReward: 100,
    total: 10,
  },
  {
    id: "streak_30",
    name: "Monthly Dedication",
    description: "Maintain a 30-day learning streak",
    xpReward: 200,
    total: 30,
  },
  {
    id: "perfect_5_quizzes",
    name: "Quiz Perfectionist",
    description: "Get a perfect score on 5 quizzes",
    xpReward: 150,
    total: 5,
  },
  {
    id: "complete_all_math",
    name: "Math Wizard",
    description: "Complete all mathematics topics",
    xpReward: 300,
    total: 1,
  },
]

// XP required for each level
export const LEVEL_XP = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  450, // Level 4
  700, // Level 5
  1000, // Level 6
  1350, // Level 7
  1750, // Level 8
  2200, // Level 9
  2700, // Level 10
]

// Helper functions
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP[i]) {
      return i + 1
    }
  }
  return 1
}

export function calculateXpForNextLevel(currentXp: number): { current: number; next: number; progress: number } {
  const currentLevel = calculateLevel(currentXp)
  const currentLevelXp = LEVEL_XP[currentLevel - 1] || 0
  const nextLevelXp = LEVEL_XP[currentLevel] || currentLevelXp + 100

  const xpInCurrentLevel = currentXp - currentLevelXp
  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp
  const progress = (xpInCurrentLevel / xpRequiredForNextLevel) * 100

  return {
    current: xpInCurrentLevel,
    next: xpRequiredForNextLevel,
    progress,
  }
}

// Mock user progress (in a real app, this would come from a database)
let mockUserProgress: UserProgress = {
  userId: "user1",
  xp: 0,
  level: 1,
  streak: 0,
  lastActivity: new Date().toISOString(),
  completedLessons: [],
  completedQuizzes: [],
  badges: [],
  achievements: ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    progress: 0,
    completed: false,
  })),
}

// Initialize user progress from localStorage if available
export function initUserProgress(): UserProgress {
  if (typeof window !== "undefined") {
    const savedProgress = localStorage.getItem("userProgress")
    if (savedProgress) {
      try {
        mockUserProgress = JSON.parse(savedProgress)
      } catch (e) {
        console.error("Failed to parse user progress from localStorage", e)
      }
    }
  }
  return mockUserProgress
}

// Save user progress to localStorage
export function saveUserProgress(progress: UserProgress): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userProgress", JSON.stringify(progress))
  }
  mockUserProgress = progress
}

// Get user progress
export function getUserProgress(): UserProgress {
  return mockUserProgress
}

// Award XP to user
export function awardXP(amount: number): UserProgress {
  const progress = getUserProgress()
  const oldLevel = progress.level

  progress.xp += amount
  progress.level = calculateLevel(progress.xp)

  // Check if user leveled up
  if (progress.level > oldLevel) {
    // Could trigger level-up notification here
  }

  progress.lastActivity = new Date().toISOString()
  updateStreak(progress)

  saveUserProgress(progress)
  return progress
}

// Mark a lesson as completed
export function completeLesson(lessonId: string): UserProgress {
  const progress = getUserProgress()

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId)

    // Award XP for completing a lesson
    progress.xp += 20
    progress.level = calculateLevel(progress.xp)

    // Check for first lesson badge
    if (progress.completedLessons.length === 1) {
      awardBadge(BADGES.FIRST_LESSON)
    }

    // Update achievements
    updateAchievements(progress)
  }

  progress.lastActivity = new Date().toISOString()
  updateStreak(progress)

  saveUserProgress(progress)
  return progress
}

// Mark a quiz as completed
export function completeQuiz(quizId: string, score: number): UserProgress {
  const progress = getUserProgress()

  if (!progress.completedQuizzes.includes(quizId)) {
    progress.completedQuizzes.push(quizId)

    // Award XP based on score (0-100%)
    const xpAwarded = Math.round(30 * (score / 100))
    progress.xp += xpAwarded
    progress.level = calculateLevel(progress.xp)

    // Check for first quiz badge
    if (progress.completedQuizzes.length === 1) {
      awardBadge(BADGES.FIRST_QUIZ)
    }

    // Check for perfect score badge
    if (score === 100) {
      awardBadge(BADGES.PERFECT_QUIZ)
    }

    // Update achievements
    updateAchievements(progress)
  }

  progress.lastActivity = new Date().toISOString()
  updateStreak(progress)

  saveUserProgress(progress)
  return progress
}

// Award a badge to the user
export function awardBadge(badge: Omit<Badge, "dateEarned">): UserProgress {
  const progress = getUserProgress()

  // Check if user already has this badge
  if (!progress.badges.some((b) => b.id === badge.id)) {
    progress.badges.push({
      ...badge,
      dateEarned: new Date().toISOString(),
    })

    // Award XP for earning a badge
    progress.xp += 25
    progress.level = calculateLevel(progress.xp)
  }

  saveUserProgress(progress)
  return progress
}

// Update user's streak
function updateStreak(progress: UserProgress): void {
  const lastActivity = new Date(progress.lastActivity)
  const today = new Date()

  // Reset date times to compare just the dates
  lastActivity.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = Math.abs(today.getTime() - lastActivity.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    // User was active yesterday, increment streak
    progress.streak += 1

    // Check for streak badges
    if (progress.streak === 7) {
      awardBadge(BADGES.STREAK_7)
    }
  } else if (diffDays > 1) {
    // User missed a day, reset streak
    progress.streak = 1
  }
  // If diffDays is 0, user was already active today, don't change streak
}

// Update achievements based on user progress
function updateAchievements(progress: UserProgress): void {
  progress.achievements.forEach((achievement) => {
    if (achievement.completed) return

    switch (achievement.id) {
      case "complete_5_lessons":
        achievement.progress = progress.completedLessons.length
        break
      case "complete_10_quizzes":
        achievement.progress = progress.completedQuizzes.length
        break
      case "streak_30":
        achievement.progress = progress.streak
        break
      case "perfect_5_quizzes":
        achievement.progress = progress.badges.filter((b) => b.id === BADGES.PERFECT_QUIZ.id).length
        break
      // For subject-specific achievements, we would need more data
    }

    // Check if achievement is completed
    if (achievement.progress >= achievement.total) {
      achievement.completed = true
      achievement.dateCompleted = new Date().toISOString()

      // Award XP for completing achievement
      progress.xp += achievement.xpReward
      progress.level = calculateLevel(progress.xp)
    }
  })
}

// Initialize user progress when module is imported
initUserProgress()
