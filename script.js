/**
 * PulseLine Dashboard - Pure Vanilla JavaScript logic 
 * Handles local state synchronization, dynamic UI renders, and event orchestration.
 * Fully compatible with Vite's module bundling rules.
 */

// ==========================================
// SEED DEFAULT VALUES (REASONABLE SAMPLE DATA)
// ==========================================
const DEFAULT_STATE = {
  xp: 350,
  streak: 5,
  workouts: [
    { name: "Leg Quads Hypertrophy", category: "strength", duration: 45, calories: 360, day: "Monday", date: "2026-05-25" },
    { name: "Cardiorespiratory Jogging", category: "cardio", duration: 30, calories: 330, day: "Tuesday", date: "2026-05-26" }
  ],
  water: [
    { amount: 250, time: "08:30" },
    { amount: 350, time: "11:15" },
    { amount: 500, time: "14:10" }
  ],
  waterGoal: 2500,
  dietVeg: true,
  mealsCompleted: [false, false, false, false], // [Breakfast, Lunch, Snack, Dinner]
  customMeals: [],
  activeBook: {
    title: "Atomic Habits",
    author: "James Clear",
    totalPages: 320,
    currentPage: 145,
    streak: 8,
    category: "Productivity"
  },
  booksCompleted: [
    { title: "Deep Work", author: "Cal Newport", pages: 304, date: "2026-04-12" },
    { title: "Think and Grow Rich", author: "Napoleon Hill", pages: 238, date: "2026-05-01" }
  ],
  habits: [
    { id: "habit-1", name: "Wake up early (6:00 AM)", priority: "high", checked: true, streak: 12 },
    { id: "habit-2", name: "10-Min Vagus Zen Meditation", priority: "high", checked: false, streak: 4 },
    { id: "habit-3", name: "Posture Stretching & Mobility", priority: "low", checked: true, streak: 5 },
    { id: "habit-4", name: "Write Daily Journal Review", priority: "medium", checked: false, streak: 2 },
    { id: "habit-5", name: "No Refined Sugar Intake Day", priority: "high", checked: true, streak: 8 },
    { id: "habit-6", name: "Disconnect Screens by 10:30 PM", priority: "medium", checked: false, streak: 1 }
  ],
  sleepLogs: [
    { date: "2026-05-25", hours: 7.5, quality: "Good", bedtime: "23:00" },
    { date: "2026-05-24", hours: 8.0, quality: "Deep", bedtime: "22:30" }
  ],
  moodLogs: [
    { date: "2026-05-22", mood: "good" },
    { date: "2026-05-23", mood: "neutral" },
    { date: "2026-05-24", mood: "superb" },
    { date: "2026-05-25", mood: "tired" }
  ],
  mindfulness: {
    sessions: 4,
    streak: 3
  },
  pomoTasks: [
    { name: "Clean up system compiler states", date: "2026-05-26" }
  ],
  pinnedTask: "Refined javascript logic bindings"
};

const LEARNINGS_POOL = [
  { category: "FITNESS FACT", title: "Neuromuscular static stretching target structures", description: "Static positions targeting muscles post-workout relieves continuous tension state signaling lower stress chemical release." },
  { category: "PRODUCTIVITY TRICK", title: "The 2-Minute Rule beats structural inertia", description: "If a specific habit takes less than two minutes, do it right now to prevent long-term cognitive load." },
  { category: "FINANCE WISDOM", title: "Ditching emotional compounding gains yield curves", description: "Consistently investing core dividends grows holdings logarithmically over time without emotional interference." },
  { category: "CODING CONCEPT", title: "Reflow render constraints during dynamic DOM calls", description: "Updating dynamic items values in a detached fragment tree saves processor cycles before full injection." },
  { category: "HEALTH METRICS", title: "Baseline liquid levels affects vascular performance", description: "Dehydrating only 2% reduces physical output and cognitive endurance levels by roughly 12%." }
];

const SUGGESTED_BOOKS_POOL = [
  { title: "Atomic Habits", author: "James Clear", category: "Self-Improvement", pages: 320, coverCode: "ATOM" },
  { title: "The Intelligent Investor", author: "Benjamin Graham", category: "Finance", pages: 640, coverCode: "INVEST" },
  { title: "Deep Work", author: "Cal Newport", category: "Productivity", pages: 304, coverCode: "DEEP" },
  { title: "Dune Science Odyssey", author: "Frank Herbert", category: "Fiction", pages: 600, coverCode: "DUNE" },
  { title: "The Sleep Solution", author: "W. Chris Winter", category: "Health", pages: 270, coverCode: "SLEEP" }
];

const VEGETARIAN_MEALS = [
  { slot: "Breakfast", name: "Avocado Sourdough & Scrambled Egg whites", calories: 380, protein: 18, carbs: 32 },
  { slot: "Lunch", name: "Warm Quinoa Salad with Baked Tofu Cuts", calories: 550, protein: 24, carbs: 60 },
  { slot: "Snack", name: "Natural Pistachios & Antioxidant Matcha", calories: 140, protein: 5, carbs: 10 },
  { slot: "Dinner", name: "Slow Simmered Lentil Soup, Wild rice mix", calories: 480, protein: 20, carbs: 55 }
];

const NON_VEGETARIAN_MEALS = [
  { slot: "Breakfast", name: "Smoked Salmon, Dill Cream cheese bagel", calories: 450, protein: 26, carbs: 38 },
  { slot: "Lunch", name: "Seared Lemon Herb Chicken breast, asparagus", calories: 520, protein: 42, carbs: 20 },
  { slot: "Snack", name: "Beef jerky strips & cold pressed green juice", calories: 150, protein: 14, carbs: 8 },
  { slot: "Dinner", name: "Grilled sirloin cuts, sweet potato mash", calories: 590, protein: 38, carbs: 45 }
];

const HEALTH_TIPS = [
  "🔋 Complex carbohydrates limit glycemic fatigue triggers.",
  "🍳 Ensure 1.6g of lean protein per kg of active weights.",
  "🥑 Seed lipids fuel essential nervous communication pathways.",
  "💧 Warm liquids assist gut motility and digestion cycles.",
  "🥬 Green microphylls carry magnesium supporting sleep neural receptors."
];

// Active State Instance
let state = null;

// ==========================================
// STATE MANAGEMENT CONTEXT
// ==========================================
function loadState() {
  const local = localStorage.getItem('pulseline_state');
  if (local) {
    try {
      state = JSON.parse(local);
    } catch (e) {
      console.warn("Corruption found in state log. Re-seeding data parameters.");
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
  }
}

function saveState() {
  localStorage.setItem('pulseline_state', JSON.stringify(state));
}

// ==========================================
// NOTIFICATIONS / TOAST ALERTS SYSTEM
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'info' ? 'toast-info' : ''}`;
  
  // Choose beautiful Lucide icon names according to state
  let iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-triangle';
  if (type === 'info') iconName = 'info';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span class="font-xs font-bold">${message}</span>
  `;
  container.appendChild(toast);
  
  // Re-run Lucide evaluation for new node element
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // CSS Animation triggers
  setTimeout(() => toast.classList.add('show'), 50);
  
  // Remove element timeout
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

// ==========================================
// XP & REWARD SYSTEM
// ==========================================
function addXP(amount) {
  state.xp += amount;
  showToast(`Earned +${amount} Wellness experience points!`, 'info');
  
  // Level threshold math
  const currentThreshold = 500;
  if (state.xp >= currentThreshold) {
    state.xp -= currentThreshold;
    showToast("Level Up! You attained LVL 5 Habit Expert!", 'success');
  }
  
  saveState();
  updateXPDisplay();
}

function updateXPDisplay() {
  const xpFill = document.getElementById('xp-fill');
  const xpText = document.getElementById('xp-text');
  if (xpFill && xpText) {
    const percentage = Math.min((state.xp / 500) * 100, 100);
    xpFill.style.width = `${percentage}%`;
    xpText.textContent = `${state.xp} / 500`;
  }
}

// ==========================================
// NAVIGATION CONTROLLER (TAB TOOGLE)
// ==========================================
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const sidebar = document.getElementById('sidebar');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedTab = item.getAttribute('data-tab');
      if (!selectedTab) return;

      // Swap active state on items
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Swap view visible classes
      tabPanels.forEach(panel => {
        const id = panel.getAttribute('id');
        if (id === `tab-${selectedTab}`) {
          panel.classList.remove('hidden');
          panel.classList.add('active');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('active');
        }
      });

      // Swipe sidebar back out if on mobile layout
      if (sidebar && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
      }

      // Re-trigger layout sizing widgets if needed
      if (selectedTab === 'analytics') {
        renderFullBadgeCase();
      }
    });
  });

  // Mobile drawer controls
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const closeBtn = document.getElementById('sidebar-close-btn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('show');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('show');
    });
  }
}

// ==========================================
// TODAY DATE & TIME WELCOME HEADER
// ==========================================
function initHeaderClock() {
  const dateLabel = document.getElementById('current-date');
  if (dateLabel) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateLabel.textContent = today.toLocaleDateString('en-US', options);
  }

  const welcomeNode = document.getElementById('welcome-message');
  if (welcomeNode) {
    const hour = new Date().getHours();
    let greet = "Hello, Wellness Hero!";
    if (hour < 12) greet = "Good Morning, John!";
    else if (hour < 18) greet = "Good Afternoon, John!";
    else greet = "Good Evening, John!";
    welcomeNode.textContent = greet;
  }

  // Set Global Streak badge status
  const streakCountNode = document.getElementById('global-streak-count');
  if (streakCountNode) {
    streakCountNode.textContent = state.streak;
  }
}

// ==========================================
// MOTIVATION QUOTES SECTION
// ==========================================
const MOTIVATION_QUOTES = [
  { quote: "The only bad workout is the one that didn't happen.", author: "Theresa McCrossan" },
  { quote: "Success is the sum of small habits, repeated day-in and day-out.", author: "James Clear" },
  { quote: "Your self-discipline determines your destiny trajectory.", author: "Napoleon Hill" },
  { quote: "An investment in hydration is an investment in your cell survival.", author: "Unknown" },
  { quote: "Deep focus beats standard multi-tasking clutter every single time.", author: "Cal Newport" }
];

function initMotivationalQuotes() {
  const nextBtn = document.getElementById('btn-next-quote');
  const quoteText = document.getElementById('daily-quote');
  const quoteAuthor = document.getElementById('daily-quote-author');

  if (nextBtn && quoteText && quoteAuthor) {
    nextBtn.addEventListener('click', () => {
      const random = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
      quoteText.textContent = `"${random.quote}"`;
      quoteAuthor.textContent = `— ${random.author}`;
    });
  }

  const quickMedBtn = document.getElementById('btn-quick-meditate');
  if (quickMedBtn) {
    quickMedBtn.addEventListener('click', () => {
      // Switch focus to Zen meditation tab
      const medItem = document.querySelector('[data-tab="mindfulness"]');
      if (medItem) medItem.click();
    });
  }
}

// ==========================================
// LEARN CHALLENGE SECTION
// ==========================================
let activeLearnIndex = 2; // Default starting facts

function initLearningWidget() {
  const boxNode = document.getElementById('learning-box');
  const completeBtn = document.getElementById('btn-complete-learning');
  const nextBtn = document.getElementById('btn-next-learning');
  const streakLabel = document.getElementById('learning-streak');

  const catNode = document.getElementById('learn-category');
  const titleNode = document.getElementById('learn-title');
  const descNode = document.getElementById('learn-description');

  function renderLearning() {
    if (!catNode || !titleNode || !descNode) return;
    const item = LEARNINGS_POOL[activeLearnIndex];
    catNode.textContent = item.category;
    titleNode.textContent = item.title;
    descNode.textContent = item.description;

    // Evaluate learning checklist count
    const learnedCount = state.mindfulness.sessions; 
    if (streakLabel) {
      streakLabel.textContent = `Learned: ${learnedCount} Concepts`;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeLearnIndex = (activeLearnIndex + 1) % LEARNINGS_POOL.length;
      renderLearning();
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      state.mindfulness.sessions += 1;
      addXP(50);
      showToast("Learned challenge task registered. Keep learning!", 'success');
      saveState();
      renderLearning();
    });
  }

  renderLearning();
}

// ==========================================
// INTERACTIVE WATER FLOATING CONDUIT
// ==========================================
function initWaterTracker() {
  // Goal setting
  const setGoalBtn = document.getElementById('btn-set-water-goal');
  const goalInput = document.getElementById('hydration-custom-goal');

  if (setGoalBtn && goalInput) {
    goalInput.value = state.waterGoal;
    setGoalBtn.addEventListener('click', () => {
      const val = parseInt(goalInput.value);
      if (val && val >= 500 && val <= 8000) {
        state.waterGoal = val;
        saveState();
        showToast(`Your hydration baseline metric adjusted to ${val}ml`, 'success');
        updateWaterUI();
      } else {
        showToast(`Target must fall between 500ml and 8L.`, 'error');
      }
    });
  }

  // Quick inputs
  const addingButtons = document.querySelectorAll('.btn-water-add');
  addingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.getAttribute('data-amount'));
      if (amount) addWater(amount);
    });
  });

  // Manual inputs
  const manualAddBtn = document.getElementById('btn-add-custom-water');
  const manualInput = document.getElementById('water-custom-add');
  if (manualAddBtn && manualInput) {
    manualAddBtn.addEventListener('click', () => {
      const amount = parseInt(manualInput.value);
      if (amount && amount > 0 && amount <= 3000) {
        addWater(amount);
        manualInput.value = 250; // reset defaults
      } else {
        showToast("Enter a valid metric between 0 and 1.5L.", 'error');
      }
    });
  }

  // Clear logs
  const clearBtn = document.getElementById('btn-clear-water');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.water = [];
      saveState();
      showToast("Water metrics logs have been reset.", 'info');
      updateWaterUI();
    });
  }

  updateWaterUI();
}

function addWater(amount) {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  state.water.push({ amount, time: timeStr });
  addXP(15);
  showToast(`Added +${amount}ml water intake consumption log!`, 'success');
  saveState();
  updateWaterUI();
}

function updateWaterUI() {
  const total = state.water.reduce((acc, curr) => acc + curr.amount, 0);
  const percentage = Math.min(Math.round((total / state.waterGoal) * 100), 100);

  // Update bento widgets status
  const badge = document.getElementById('water-badge');
  if (badge) badge.textContent = `${percentage}%`;

  const dashStatus = document.getElementById('dash-water-status');
  if (dashStatus) {
    dashStatus.textContent = `${total} ml / ${state.waterGoal} ml`;
  }

  // Update dynamic wave container heights
  const bottleWave = document.getElementById('dash-water-wave');
  if (bottleWave) bottleWave.style.height = `${percentage}%`;

  const bottlePercent = document.getElementById('dash-water-percentage');
  if (bottlePercent) bottlePercent.textContent = `${percentage}%`;

  const flaskWave = document.getElementById('flask-hydra-wave');
  if (flaskWave) flaskWave.style.height = `${percentage}%`;

  const flaskVol = document.getElementById('flask-absolute-vol');
  if (flaskVol) flaskVol.textContent = `${total} ml`;

  const flaskPercentLabel = document.getElementById('flask-percent-label');
  if (flaskPercentLabel) {
    flaskPercentLabel.textContent = `/ ${state.waterGoal} ml (${percentage}%)`;
  }

  // Render log elements lists
  const logsList = document.getElementById('water-logs-list');
  if (logsList) {
    if (state.water.length === 0) {
      logsList.innerHTML = `<p class="font-xs text-muted text-center p-sm">No hydration events recorded for dry cycles.</p>`;
    } else {
      logsList.innerHTML = state.water.slice().reverse().map((log, idx) => `
        <div class="history-item-row">
          <div class="flex align-center gap-xs text-blue">
            <i data-lucide="droplet" style="width:14px;height:14px;"></i>
            <strong class="text-dark font-sm">+${log.amount} ml</strong>
          </div>
          <span class="font-mono text-muted">${log.time}</span>
        </div>
      `).join('');
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

// ==========================================
// WORKOUTS CONTROLLER
// ==========================================
function initWorkouts() {
  const form = document.getElementById('workout-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('workout-name').value;
      const category = document.getElementById('workout-category').value;
      const duration = parseInt(document.getElementById('workout-duration').value);
      const inputCal = document.getElementById('workout-calories').value;
      const day = document.getElementById('workout-day').value;
      
      // Calculate automated calories based on multiplier ranges if left empty
      let calories = parseInt(inputCal);
      if (isNaN(calories) || !calories) {
        if (category === 'strength') calories = duration * 8;
        else if (category === 'cardio') calories = duration * 11;
        else if (category === 'flexibility') calories = duration * 4;
        else calories = duration * 2;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      state.workouts.push({ name, category, duration, calories, day, date: todayStr });
      addXP(75);
      showToast(`Logged custom workout session for ${day}!`, 'success');
      saveState();

      // Reset forms
      form.reset();
      updateWorkoutsUI();
    });
  }

  // Routine templates quick adder
  const templates = document.querySelectorAll('.routine-template-card');
  templates.forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('workout-name').value = card.getAttribute('data-routine-name');
      document.getElementById('workout-category').value = card.getAttribute('data-category');
      document.getElementById('workout-duration').value = card.getAttribute('data-duration');
      document.getElementById('workout-calories').value = card.getAttribute('data-calories');
      
      // Flash animation indicating selection
      showToast("Template stats loaded! Click add below to append.", 'info');
    });
  });

  // Clear logs button
  const clearBtn = document.getElementById('btn-clear-workouts');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.workouts = [];
      saveState();
      showToast("Workouts history logs have been reset.", 'info');
      updateWorkoutsUI();
    });
  }

  updateWorkoutsUI();
}

function updateWorkoutsUI() {
  const streakBadge = document.getElementById('workout-streak-badge');
  if (streakBadge) {
    streakBadge.textContent = `${state.workouts.length} Routines`;
  }

  const dashStatus = document.getElementById('dash-workout-status');
  if (dashStatus) {
    if (state.workouts.length === 0) {
      dashStatus.textContent = "Not Logged";
    } else {
      const last = state.workouts[state.workouts.length - 1];
      dashStatus.textContent = `${last.category.toUpperCase()}: ${last.duration}m`;
    }
  }

  // Total metrics card summary
  const totalDuration = state.workouts.reduce((acc, curr) => acc + curr.duration, 0);
  const totalCal = state.workouts.reduce((acc, curr) => acc + curr.calories, 0);

  const countNode = document.getElementById('workout-total-count');
  const caloriesNode = document.getElementById('workout-total-calories');

  if (countNode) countNode.textContent = state.workouts.length;
  if (caloriesNode) caloriesNode.textContent = `${totalCal} kcal`;

  // Render previous history lists
  const historyList = document.getElementById('workout-history-list');
  if (historyList) {
    if (state.workouts.length === 0) {
      historyList.innerHTML = `<p class="font-xs text-muted text-center p-sm">No workout achievements tracked for the current cycle.</p>`;
    } else {
      historyList.innerHTML = state.workouts.slice().reverse().map((act, id) => `
        <div class="history-item-row" style="border-left: 3px solid ${
          act.category === 'strength' ? 'var(--color-orange)' : 
          act.category === 'cardio' ? 'var(--color-emerald)' : 'var(--color-blue)'
        }">
          <div class="flex-column">
            <strong class="text-dark m-bottom-xxs">${act.name}</strong>
            <span class="font-xs text-muted">Estimated output: ${act.calories}kcal (${act.duration} m)</span>
          </div>
          <span class="badge badge-${
            act.category === 'strength' ? 'primary' : 
            act.category === 'cardio' ? 'emerald' : 'blue'
          }">${act.day}</span>
        </div>
      `).join('');
    }
  }

  // Draw calorie chart elements
  const weekdayCalTotals = {
    Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
  };
  state.workouts.forEach(item => {
    if (weekdayCalTotals[item.day] !== undefined) {
      weekdayCalTotals[item.day] += item.calories;
    }
  });

  const maxCal = Math.max(...Object.values(weekdayCalTotals), 400); // calibrate threshold percentage max height
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  days.forEach(dayName => {
    const barId = `bar-${dayName.toLowerCase()}`;
    const bar = document.getElementById(barId);
    if (bar) {
      const kcalEarned = weekdayCalTotals[dayName];
      const hPercent = maxCal > 0 ? (kcalEarned / maxCal) * 100 : 0;
      bar.style.height = `${Math.min(Math.max(hPercent, 5), 100)}%`;
      bar.setAttribute('title', `${dayName}: ${kcalEarned} kcal logged`);
    }
  });
}

// ==========================================
// FOOD & DIET NUTRITION TIMELINE
// ==========================================
function initDietTracker() {
  const vegBtn = document.getElementById('diet-veg');
  const nonvegBtn = document.getElementById('diet-nonveg');

  if (vegBtn && nonvegBtn) {
    vegBtn.addEventListener('click', () => {
      state.dietVeg = true;
      vegBtn.classList.add('active');
      nonvegBtn.classList.remove('active');
      saveState();
      renderTodayMeals();
    });

    nonvegBtn.addEventListener('click', () => {
      state.dietVeg = false;
      nonvegBtn.classList.add('active');
      vegBtn.classList.remove('active');
      saveState();
      renderTodayMeals();
    });

    // Match initial active class state
    if (state.dietVeg) {
      vegBtn.classList.add('active');
      nonvegBtn.classList.remove('active');
    } else {
      nonvegBtn.classList.add('active');
      vegBtn.classList.remove('active');
    }
  }

  // Custom meal input forms
  const mealForm = document.getElementById('diet-entry-form');
  if (mealForm) {
    mealForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const slot = document.getElementById('diet-meal-type').value;
      const name = document.getElementById('diet-meal-name').value;
      const calories = parseInt(document.getElementById('diet-input-kcal').value);
      const protein = parseInt(document.getElementById('diet-input-protein').value);
      const carbs = parseInt(document.getElementById('diet-input-carbs').value);

      state.customMeals.push({ slot, name, calories, protein, carbs });
      addXP(40);
      showToast(`Custom meal tracked: ${name}!`, 'success');
      saveState();

      mealForm.reset();
      renderMealsStats();
    });
  }

  renderTodayMeals();
  renderMealTips();
}

function renderTodayMeals() {
  const headerLabel = document.getElementById('macro-diet-header-label');
  if (headerLabel) {
    headerLabel.textContent = state.dietVeg ? "Vegetarian Prescription" : "Lean Protein Non-Veg Diet";
  }

  const listNode = document.getElementById('diet-meal-schedule-list');
  if (!listNode) return;

  const activePreset = state.dietVeg ? VEGETARIAN_MEALS : NON_VEGETARIAN_MEALS;

  listNode.innerHTML = activePreset.map((meal, index) => {
    const isCompleted = state.mealsCompleted[index];
    return `
      <div class="meal-row-grid">
        <div>
          <button class="meal-completed-tick ${isCompleted ? 'checked' : ''}" data-idx="${index}">
            ${isCompleted ? '✓' : ''}
          </button>
        </div>
        <div class="flex-column">
          <strong class="text-dark font-sm">${meal.slot} : ${meal.name}</strong>
          <span class="font-xs text-muted">Macros: P: ${meal.protein}g | C: ${meal.carbs}g | Fat: ~12g</span>
        </div>
        <span class="font-mono text-emerald font-bold text-right">${meal.calories} kcal</span>
      </div>
    `;
  }).join('');

  // Attach toggling checkbox events listeners
  const checks = listNode.querySelectorAll('.meal-completed-tick');
  checks.forEach(chk => {
    chk.addEventListener('click', () => {
      const idx = parseInt(chk.getAttribute('data-idx'));
      state.mealsCompleted[idx] = !state.mealsCompleted[idx];
      saveState();
      renderTodayMeals();
      renderMealsStats();
      addXP(10);
    });
  });

  renderMealsStats();
}

function renderMealsStats() {
  const activePreset = state.dietVeg ? VEGETARIAN_MEALS : NON_VEGETARIAN_MEALS;
  
  // Base calculated metrics starting balances
  let cCal = 0, cProt = 0, cCarb = 0;
  
  activePreset.forEach((meal, id) => {
    if (state.mealsCompleted[id]) {
      cCal += meal.calories;
      cProt += meal.protein;
      cCarb += meal.carbs;
    }
  });

  // Include manual snack/custom items
  state.customMeals.forEach(meal => {
    cCal += meal.calories;
    cProt += meal.protein;
    cCarb += meal.carbs;
  });

  // Render values to stats bars
  const kcalValLabel = document.getElementById('diet-consumed-calories');
  if (kcalValLabel) {
    kcalValLabel.textContent = `${cCal.toLocaleString()}`;
  }

  const carbsLabel = document.getElementById('diet-metrics-carbs');
  const carbsFill = document.getElementById('diet-fill-carbs');
  if (carbsLabel && carbsFill) {
    carbsLabel.textContent = `${cCarb}g / 240g`;
    carbsFill.style.width = `${Math.min((cCarb / 240) * 100, 100)}%`;
  }

  const protLabel = document.getElementById('diet-metrics-protein');
  const protFill = document.getElementById('diet-fill-protein');
  if (protLabel && protFill) {
    protLabel.textContent = `${cProt}g / 130g`;
    protFill.style.width = `${Math.min((cProt / 130) * 100, 100)}%`;
  }

  const fatLabel = document.getElementById('diet-metrics-fats');
  const fatFill = document.getElementById('diet-fill-fats');
  if (fatLabel && fatFill) {
    const calculatedFat = Math.round(cCal * 0.28 / 9); // estimated Lipids
    fatLabel.textContent = `${calculatedFat}g / 70g`;
    fatFill.style.width = `${Math.min((calculatedFat / 70) * 100, 100)}%`;
  }

  // Draw dynamic color ring
  const circleNode = document.getElementById('macro-ratio-pie');
  if (circleNode) {
    const totalThreshold = 2200;
    const ratioDeg = Math.min((cCal / totalThreshold) * 360, 360);
    circleNode.style.setProperty('--ratio', `${ratioDeg}deg`);
  }
}

function renderMealTips() {
  const container = document.getElementById('diet-tips-container');
  if (container) {
    container.innerHTML = HEALTH_TIPS.map(tip => `
      <div class="nutrition-tip-card">
        <p class="nutrition-text">${tip}</p>
      </div>
    `).join('');
  }
}

// ==========================================
// ACTIVE BOOK READING MODULE
// ==========================================
let activeBookCategoryFilter = "Self-Improvement";

function initReadingTracker() {
  // Goals logic testing triggers
  const alertBtn = document.getElementById('btn-trigger-reading-alert');
  if (alertBtn) {
    alertBtn.addEventListener('click', () => {
      showToast("📚 PulseLine Reminder: Your target daily reading goal of 20 pages is currently unfulfilled. Open active screen details to catch up today!", 'info');
    });
  }

  const form = document.getElementById('reading-log-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('reading-current-title').value;
      const author = document.getElementById('reading-current-author').value;
      const pagesTarget = parseInt(document.getElementById('reading-total-pages').value);
      const currPage = parseInt(document.getElementById('reading-pages-logged').value);

      if (currPage > pagesTarget) {
        showToast("Logged pages count exceeded target limits bounds.", 'error');
        return;
      }

      state.activeBook.title = title;
      state.activeBook.author = author;
      state.activeBook.totalPages = pagesTarget;
      state.activeBook.currentPage = currPage;

      addXP(50);
      showToast("Reading history indices synchronized properly!", 'success');

      // Check if book complete
      if (currPage === pagesTarget) {
        state.booksCompleted.push({
          title, author, pages: pagesTarget, date: new Date().toISOString().split('T')[0]
        });
        state.booksCompletedCount += 1;
        showToast(`🎉 Achievement unlocked! You finished reading: ${title}!`, 'success');
        addXP(150);

        // Reset inputs
        state.activeBook.currentPage = 0;
        state.activeBook.title = "Select Another Wellness Book";
        state.activeBook.author = "Unknown";
      }

      saveState();
      updateReadingUI();
    });
  }

  // Suggest logs filters buttons
  const filterButtons = document.querySelectorAll('.filter-book-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBookCategoryFilter = btn.getAttribute('data-category');
      renderBookSuggestions();
    });
  });

  const clearBtn = document.getElementById('btn-clear-books');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.booksCompleted = [];
      state.booksCompletedCount = 0;
      saveState();
      showToast("Completed book archive logs has been reset.", 'info');
      updateReadingUI();
    });
  }

  updateReadingUI();
}

function updateReadingUI() {
  const titleText = document.getElementById('active-book-title');
  const authorText = document.getElementById('active-book-author');
  const catText = document.getElementById('active-book-category');
  const barNode = document.getElementById('active-book-progress-bar');
  const progressText = document.getElementById('active-book-pages-text');
  const coverMock = document.getElementById('active-book-cover');

  if (titleText) titleText.textContent = state.activeBook.title;
  if (authorText) authorText.textContent = `by ${state.activeBook.author}`;
  if (catText) catText.textContent = state.activeBook.category.toUpperCase();

  if (coverMock) {
    coverMock.textContent = state.activeBook.title.substring(0, 4).toUpperCase();
  }

  // Math percentages
  const pct = Math.min((state.activeBook.currentPage / state.activeBook.totalPages) * 100, 100);
  if (barNode) barNode.style.width = `${pct}%`;
  if (progressText) {
    progressText.textContent = `${state.activeBook.currentPage} / ${state.activeBook.totalPages} pages (${Math.round(pct)}%)`;
  }

  const dashStatus = document.getElementById('dash-reading-status');
  if (dashStatus) {
    dashStatus.textContent = `${state.activeBook.currentPage} pages / ${state.activeBook.totalPages} (${Math.round(pct)}%)`;
  }

  // Update total totals counts
  const readingStreakBadge = document.getElementById('reading-streak-badge');
  if (readingStreakBadge) {
    readingStreakBadge.textContent = `${state.activeBook.streak} Day Streak`;
  }

  const compCountLabel = document.getElementById('reading-books-completed');
  if (compCountLabel) {
    compCountLabel.textContent = state.booksCompleted.length;
  }

  const totalPagesSum = state.booksCompleted.reduce((acc, curr) => acc + curr.pages, 0) + state.activeBook.currentPage;
  const pagesCountLabel = document.getElementById('reading-total-pages-count');
  if (pagesCountLabel) {
    pagesCountLabel.textContent = totalPagesSum;
  }

  // Render book suggestions
  renderBookSuggestions();

  // Render completed book lists
  const archiveList = document.getElementById('book-history-list');
  if (archiveList) {
    if (state.booksCompleted.length === 0) {
      archiveList.innerHTML = `<p class="font-xs text-muted text-center p-sm">No finished books logged in library cabinets yet.</p>`;
    } else {
      archiveList.innerHTML = state.booksCompleted.map(bk => `
        <div class="history-item-row" style="border-left: 3px solid var(--color-amber)">
          <div class="flex-column">
            <strong class="text-dark m-bottom-xxs">${bk.title}</strong>
            <span class="font-xs text-muted">Pages: ${bk.pages} | Completed on: ${bk.date}</span>
          </div>
          <span class="badge badge-amber">Completed</span>
        </div>
      `).join('');
    }
  }
}

function renderBookSuggestions() {
  const recomNode = document.getElementById('book-recoms-container');
  if (!recomNode) return;

  const currentSelection = SUGGESTED_BOOKS_POOL.filter(item => item.category === activeBookCategoryFilter);

  recomNode.innerHTML = currentSelection.map(book => `
    <div class="book-recom-card" data-title="${book.title}" data-author="${book.author}" data-cat="${book.category}" data-pages="${book.pages}">
      <div class="recom-book-cover font-mono">${book.coverCode}</div>
      <div class="flex-column justify-between" style="flex:1;">
        <div>
          <span class="font-xs text-amber block font-bold">${book.category}</span>
          <strong class="font-sm block text-dark">${book.title}</strong>
          <span class="font-xs text-muted block">by ${book.author}</span>
        </div>
        <button class="text-btn font-xs text-left link-btn p-top-xs select-recom-book-action">Select reading target</button>
      </div>
    </div>
  `).join('');

  // Add click responses to template recommendations
  const actionBtns = recomNode.querySelectorAll('.select-recom-book-action');
  actionBtns.forEach((btn, id) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.book-recom-card');
      const title = parent.getAttribute('data-title');
      const author = parent.getAttribute('data-author');
      const cat = parent.getAttribute('data-cat');
      const pages = parseInt(parent.getAttribute('data-pages'));

      state.activeBook.title = title;
      state.activeBook.author = author;
      state.activeBook.category = cat;
      state.activeBook.totalPages = pages;
      state.activeBook.currentPage = 0;

      // Swap inputs values
      document.getElementById('reading-current-title').value = title;
      document.getElementById('reading-current-author').value = author;
      document.getElementById('reading-total-pages').value = pages;
      document.getElementById('reading-pages-logged').value = 0;

      saveState();
      updateReadingUI();
      showToast(`Selected "${title}" as your active target book. Let's read!`, 'success');
    });
  });
}

// ==========================================
// CHANNELS CHEKBOX HABITS SNAPS
// ==========================================
function initHabitsChecklist() {
  const form = document.getElementById('habit-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('habit-name-input').value;
      const priority = document.getElementById('habit-importance').value;
      const uniqId = 'habit-' + Date.now();

      state.habits.push({ id: uniqId, name, priority, checked: false, streak: 0 });
      addXP(50);
      showToast(`Created new essential daily habit: "${name}"!`, 'success');
      saveState();

      form.reset();
      renderHabits();
    });
  }

  const resetBtn = document.getElementById('btn-reset-habits-state');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.habits.forEach(h => h.checked = false);
      saveState();
      showToast("Habits checklists marks cleared.", 'info');
      renderHabits();
    });
  }

  renderHabits();
}

function renderHabits() {
  const mainChecklist = document.getElementById('habits-master-checklist');
  const dashboardChecklist = document.getElementById('dashboard-habits-list');

  const scoreNode = document.getElementById('habit-consistency-score');
  const dashStatusBadge = document.getElementById('dash-habit-status');

  const checkedCount = state.habits.filter(h => h.checked).length;
  const totalCount = state.habits.length;
  const percentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (scoreNode) scoreNode.textContent = `${percentage}%`;
  if (dashStatusBadge) dashStatusBadge.textContent = `${percentage}% Checked`;

  // Render Full habits tab checklists
  if (mainChecklist) {
    if (state.habits.length === 0) {
      mainChecklist.innerHTML = `<p class="font-xs text-muted text-center p-sm">No daily loops logged. Insert targets above.</p>`;
    } else {
      mainChecklist.innerHTML = state.habits.map((hb, id) => `
        <div class="habit-checked-row ${hb.checked ? 'completed-strike' : ''}">
          <label class="habit-checkbox-label" for="cb-${hb.id}">
            <div id="cb-${hb.id}" class="custom-checkbox-box align-center justify-center">
              ${hb.checked ? '✓' : ''}
            </div>
            <div class="flex-column">
              <span class="habit-title-text font-bold text-dark font-sm">${hb.name}</span>
              <span class="font-xs text-muted">Priority: ${hb.priority.toUpperCase()} | Streak: <strong>${hb.streak} Days</strong></span>
            </div>
          </label>
          <button class="btn btn-outline btn-xs delete-habit-action" data-hid="${hb.id}">
            <i data-lucide="trash" style="width:12px;height:12px;"></i>
          </button>
        </div>
      `).join('');

      // Render interactions
      const labelNodes = mainChecklist.querySelectorAll('.habit-checkbox-label');
      labelNodes.forEach(lbl => {
        lbl.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = lbl.getAttribute('for').replace('cb-', '');
          const habitItem = state.habits.find(h => h.id === targetId);
          if (habitItem) {
            habitItem.checked = !habitItem.checked;
            if (habitItem.checked) {
              habitItem.streak += 1;
              addXP(25);
              showToast(`Streak advanced on "${habitItem.name}"`, 'success');
            } else {
              habitItem.streak = Math.max(habitItem.streak - 1, 0);
            }
            saveState();
            renderHabits();
          }
        });
      });

      // Actions deleting
      const deleteBtns = mainChecklist.querySelectorAll('.delete-habit-action');
      deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const hid = btn.getAttribute('data-hid');
          state.habits = state.habits.filter(h => h.id !== hid);
          saveState();
          renderHabits();
          showToast("Daily habit entry permanently removed from logs.", 'info');
        });
      });
    }
  }

  // Render Dashboard overview checklist snaps (Max 4 for brevity)
  if (dashboardChecklist) {
    const subset = state.habits.slice(0, 4);
    if (subset.length === 0) {
      dashboardChecklist.innerHTML = `<p class="font-xs text-muted text-center p-sm">No daily loops configured yet.</p>`;
    } else {
      dashboardChecklist.innerHTML = subset.map((hb, id) => `
        <div class="habit-checked-row ${hb.checked ? 'completed-strike' : ''} p-sm">
          <label class="habit-checkbox-label" for="dash-cb-${hb.id}">
            <div id="dash-cb-${hb.id}" class="custom-checkbox-box align-center justify-center">
              ${hb.checked ? '✓' : ''}
            </div>
            <span class="habit-title-text font-bold text-dark font-xs">${hb.name}</span>
          </label>
        </div>
      `).join('');

      // Bind check triggers on dashboard checkboxes
      const dashLabelNodes = dashboardChecklist.querySelectorAll('.habit-checkbox-label');
      dashLabelNodes.forEach(lbl => {
        lbl.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = lbl.getAttribute('for').replace('dash-cb-', '');
          const habitItem = state.habits.find(h => h.id === targetId);
          if (habitItem) {
            habitItem.checked = !habitItem.checked;
            if (habitItem.checked) {
              habitItem.streak += 1;
              addXP(25);
            } else {
              habitItem.streak = Math.max(habitItem.streak - 1, 0);
            }
            saveState();
            renderHabits();
          }
        });
      });
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// SLEEP RATINGS & EMOTIONS TIMELINES
// ==========================================
function initSleepAndMood() {
  const form = document.getElementById('sleep-log-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const hours = parseFloat(document.getElementById('sleep-hours').value);
      const quality = document.getElementById('sleep-quality').value;
      const bedtime = document.getElementById('sleep-bedtime').value;
      const todayStr = new Date().toISOString().split('T')[0];

      state.sleepLogs.push({ date: todayStr, hours, quality, bedtime });
      addXP(50);
      showToast(`Logged sleep durations metrics: ${hours} Hours!`, 'success');
      saveState();

      form.reset();
      updateSleepUI();
    });
  }

  const clearBtn = document.getElementById('btn-clear-sleep');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.sleepLogs = [];
      saveState();
      showToast("Sleep history logbooks wiped out.", 'info');
      updateSleepUI();
    });
  }

  // Mood buttons (dashboard snappy mood logging)
  const dashboardMoodBtns = document.querySelectorAll('.mood-btn');
  dashboardMoodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const moodId = btn.getAttribute('data-mood');
      logMood(moodId);
    });
  });

  // Mood buttons (advanced tracker tab)
  const advancedMoodBtns = document.querySelectorAll('.mood-btn-large');
  advancedMoodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const moodId = btn.getAttribute('data-mood');
      logMood(moodId);
    });
  });

  updateSleepUI();
}

function logMood(mood) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Clean if already recorded today
  state.moodLogs = state.moodLogs.filter(item => item.date !== todayStr);
  state.moodLogs.push({ date: todayStr, mood });
  
  addXP(30);
  showToast(`Logged emotional frequency baseline: ${mood.toUpperCase()}`, 'success');
  saveState();
  
  updateSleepUI();
}

const MOOD_EMOJIS_DICT = {
  superb: "🤩",
  good: "🙂",
  neutral: "😐",
  tired: "🥱",
  stressed: "🤯"
};

function updateSleepUI() {
  // Update Sleep Logs
  const sleepList = document.getElementById('sleep-history-list');
  if (sleepList) {
    if (state.sleepLogs.length === 0) {
      sleepList.innerHTML = `<p class="font-xs text-muted text-center p-sm">No night sleep logs logged in records bookcases.</p>`;
    } else {
      sleepList.innerHTML = state.sleepLogs.slice().reverse().map(log => `
        <div class="history-item-row" style="border-left: 3px solid var(--color-indigo)">
          <div class="flex-column">
            <strong class="text-dark m-bottom-xxs">${log.hours} Hours of sleeplogged</strong>
            <span class="font-xs text-muted">Quality index: ${log.quality} | Bedtime: ${log.bedtime}</span>
          </div>
          <span class="badge badge-primary font-mono">${log.date}</span>
        </div>
      `).join('');
    }
  }

  // Draw Moods analytic timeline
  const todayStr = new Date().toISOString().split('T')[0];
  const loggedToday = state.moodLogs.find(m => m.date === todayStr);

  const dashboardMoodIndicators = document.getElementById('mood-today-indicator');
  const dashboardMoodVal = document.getElementById('mood-today-value');

  if (loggedToday) {
    if (dashboardMoodIndicators && dashboardMoodVal) {
      dashboardMoodIndicators.classList.remove('hidden');
      dashboardMoodVal.textContent = `${MOOD_EMOJIS_DICT[loggedToday.mood]} ${loggedToday.mood.toUpperCase()}`;
    }

    // Highlighting selected buttons
    const selectSelectors = [...document.querySelectorAll('.mood-btn'), ...document.querySelectorAll('.mood-btn-large')];
    selectSelectors.forEach(btn => {
      if (btn.getAttribute('data-mood') === loggedToday.mood) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Redraw Mood Timeline dots bar graphs
  const timelineNode = document.getElementById('mood-history-timeline-bar');
  if (timelineNode) {
    if (state.moodLogs.length === 0) {
      timelineNode.innerHTML = `<span class="font-xs text-muted p-xs">Select metrics above to establish trends.</span>`;
    } else {
      timelineNode.innerHTML = state.moodLogs.slice(-7).map(item => `
        <div class="flex-column align-center text-center gap-xxs" style="width:40px;">
          <span class="mood-circle-spot" title="${item.date}: ${item.mood.toUpperCase()}">${MOOD_EMOJIS_DICT[item.mood] || '😐'}</span>
          <span class="font-xs block text-muted font-mono" style="font-size:8px;">${item.date.replace('2026-', '')}</span>
        </div>
      `).join('');
    }
  }
}

// ==========================================
// ZEN RESONANT BREATHING MACHINE
// ==========================================
let breathingInterval = null;
let breathStageId = 0; // 0: inhale, 1: hold, 2: exhale, 3: hold-empty
let breathTickCount = 0;

function initBreathingZen() {
  const startBtn = document.getElementById('btn-start-breathing');
  const resetBtn = document.getElementById('btn-reset-breathing');
  
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (breathingInterval) {
        pauseBreathingTimer();
      } else {
        startBreathingTimer();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetBreathingTimer();
    });
  }
}

function startBreathingTimer() {
  const startBtn = document.getElementById('btn-start-breathing');
  const outerCircle = document.getElementById('breathing-circle-node');
  const textMsg = document.getElementById('breathing-text');
  const instructionNode = document.getElementById('breathing-instructions');

  if (startBtn) {
    startBtn.innerHTML = `<i data-lucide="pause" class="btn-icon"></i> Pause Session`;
    if (window.lucide) window.lucide.createIcons();
  }

  showToast("Deep resonant breathing cycle began. Ground yourself.", "info");

  breathingInterval = setInterval(() => {
    breathTickCount += 1;
    let stageTotalSecs = 4; // default box breathing parameter

    // Determine instructions values
    if (breathStageId === 0) {
      textMsg.textContent = "Breathe In Deeply";
      instructionNode.textContent = `${breathTickCount} / 4`;
      outerCircle.classList.add('inhale');
      outerCircle.classList.remove('hold', 'exhale');
    } else if (breathStageId === 1) {
      textMsg.textContent = "Hold Breath Gently";
      instructionNode.textContent = `${breathTickCount} / 4`;
      outerCircle.classList.add('hold');
      outerCircle.classList.remove('inhale', 'exhale');
    } else if (breathStageId === 2) {
      textMsg.textContent = "Release and Exhale";
      instructionNode.textContent = `${breathTickCount} / 4`;
      outerCircle.classList.add('exhale');
      outerCircle.classList.remove('inhale', 'hold');
    } else if (breathStageId === 3) {
      textMsg.textContent = "Hold empty stillness";
      instructionNode.textContent = `${breathTickCount} / 4`;
      outerCircle.classList.remove('inhale', 'hold', 'exhale');
    }

    // Stage changes triggers
    if (breathTickCount >= stageTotalSecs) {
      breathTickCount = 0;
      breathStageId = (breathStageId + 1) % 4;

      if (breathStageId === 0) {
        // Full loop finished successfully
        state.mindfulness.sessions += 1;
        state.mindfulness.streak += 1;
        
        const countBadge = document.getElementById('zen-completed-sessions');
        const streakBadge = document.getElementById('zen-streak-days');
        if (countBadge) countBadge.textContent = state.mindfulness.sessions;
        if (streakBadge) streakBadge.textContent = `${state.mindfulness.streak} Days`;

        addXP(20);
        saveState();
      }
    }
  }, 1000);
}

function pauseBreathingTimer() {
  const startBtn = document.getElementById('btn-start-breathing');
  clearInterval(breathingInterval);
  breathingInterval = null;

  if (startBtn) {
    startBtn.innerHTML = `<i data-lucide="play" class="btn-icon"></i> Resume Zen`;
    if (window.lucide) window.lucide.createIcons();
  }
}

function resetBreathingTimer() {
  pauseBreathingTimer();
  breathStageId = 0;
  breathTickCount = 0;

  const textMsg = document.getElementById('breathing-text');
  const instructionNode = document.getElementById('breathing-instructions');
  const outerCircle = document.getElementById('breathing-circle-node');

  if (textMsg) textMsg.textContent = "Ready to Begin";
  if (instructionNode) instructionNode.textContent = "READY";
  if (outerCircle) {
    outerCircle.className = "breathing-circle-outer";
  }

  const startBtn = document.getElementById('btn-start-breathing');
  if (startBtn) {
    startBtn.innerHTML = `<i data-lucide="play" class="btn-icon"></i> Start Session`;
    if (window.lucide) window.lucide.createIcons();
  }
}

// ==========================================
// POMODORO TIMER WORK SPAN
// ==========================================
let pomoInterval = null;
let pomoTimeRemaining = 25 * 60; // 25 Minutes starting metrics
let pomoOriginalTotal = 25 * 60;
let pomoIsRunning = false;
let pomoCurrentMode = "work"; // 'work' or 'break'

function initPomodoro() {
  const clockToggleBtn = document.getElementById('btn-toggle-pomo-clock');
  const clockResetBtn = document.getElementById('btn-reset-pomo-clock');
  const pomoChoices = document.querySelectorAll('.pomo-duration-choice');

  if (clockToggleBtn) {
    clockToggleBtn.addEventListener('click', () => {
      if (pomoIsRunning) {
        stopPomoClock();
      } else {
        startPomoClock();
      }
    });
  }

  if (clockResetBtn) {
    clockResetBtn.addEventListener('click', () => {
      resetPomoClock();
    });
  }

  pomoChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      pomoChoices.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-type');
      const minutes = parseInt(btn.getAttribute('data-time'));
      
      pomoCurrentMode = category;
      pomoTimeRemaining = minutes * 60;
      pomoOriginalTotal = minutes * 60;
      
      stopPomoClock();
      updatePomoDigitalTimerUI();
    });
  });

  // Task logging forms
  const taskForm = document.getElementById('pomo-task-form');
  if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const taskVal = document.getElementById('pomo-task-name').value;
      state.pinnedTask = taskVal;
      saveState();

      document.getElementById('pomo-task-name').value = '';
      updatePomoUI();
    });
  }

  // Finished task triggers done
  const doneBtn = document.getElementById('pomo-task-done-btn');
  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      const taskName = state.pinnedTask;
      state.pomoTasks.push({ name: taskName, date: new Date().toISOString().split('T')[0] });
      state.pinnedTask = "No active task focus pinned.";
      
      addXP(100);
      showToast("Pinned task completed successfully! Great focus work!", 'success');
      saveState();

      updatePomoUI();
    });
  }

  updatePomoUI();
}

function startPomoClock() {
  const toggleBtn = document.getElementById('btn-toggle-pomo-clock');
  pomoIsRunning = true;

  if (toggleBtn) {
    toggleBtn.innerHTML = `<i data-lucide="pause" class="btn-icon"></i> Pause Block`;
    if (window.lucide) window.lucide.createIcons();
  }

  pomoInterval = setInterval(() => {
    pomoTimeRemaining -= 1;
    
    if (pomoTimeRemaining <= 0) {
      clearInterval(pomoInterval);
      pomoInterval = null;
      pomoIsRunning = false;
      
      // Ring complete notify
      showToast("⏱️ Focus block period finished! Take a break properly.", 'success');
      addXP(120);

      // Play quick synthesized high chime audio if browser permissions unlocked
      try {
        const synth = window.speechSynthesis;
        if (synth) {
          const utterance = new SpeechSynthesisUtterance("Focus session completed!");
          synth.speak(utterance);
        }
      } catch (e) { }

      resetPomoClock();
    }

    updatePomoDigitalTimerUI();
  }, 1000);
}

function stopPomoClock() {
  const toggleBtn = document.getElementById('btn-toggle-pomo-clock');
  pomoIsRunning = false;
  clearInterval(pomoInterval);
  pomoInterval = null;

  if (toggleBtn) {
    toggleBtn.innerHTML = `<i data-lucide="play" class="btn-icon"></i> Resume Session`;
    if (window.lucide) window.lucide.createIcons();
  }
}

function resetPomoClock() {
  stopPomoClock();
  pomoTimeRemaining = pomoCurrentMode === 'work' ? 25 * 60 : 5 * 60;
  pomoOriginalTotal = pomoCurrentMode === 'work' ? 25 * 60 : 5 * 60;
  updatePomoDigitalTimerUI();
}

function updatePomoDigitalTimerUI() {
  const minsVal = Math.floor(pomoTimeRemaining / 60);
  const secsVal = pomoTimeRemaining % 60;
  
  const digitalTimeStr = `${String(minsVal).padStart(2, '0')}:${String(secsVal).padStart(2, '0')}`;
  
  const label = document.getElementById('pomo-digital-time');
  if (label) label.textContent = digitalTimeStr;

  // Render stroke circular dynamic offsets
  const progressCircle = document.getElementById('pomo-ring-progress');
  if (progressCircle) {
    const totalCircumference = 534; // predefined ring SVG scale values
    const pctRemaining = pomoTimeRemaining / pomoOriginalTotal;
    const dashOffset = totalCircumference - (totalCircumference * pctRemaining);
    progressCircle.style.strokeDashoffset = dashOffset;
  }
}

function updatePomoUI() {
  updatePomoDigitalTimerUI();

  // Update pinned label widgets
  const pinnedLabel = document.getElementById('pomo-active-task-label');
  const doneBtn = document.getElementById('pomo-task-done-btn');

  if (pinnedLabel && doneBtn) {
    pinnedLabel.textContent = state.pinnedTask;
    if (state.pinnedTask && state.pinnedTask !== "No active task focus pinned." && state.pinnedTask !== "No task pinned yet of current focus cycle") {
      doneBtn.classList.remove('hidden');
    } else {
      doneBtn.classList.add('hidden');
    }
  }

  // Update finished list
  const countBadge = document.getElementById('pomo-completed-count-badge');
  if (countBadge) {
    countBadge.textContent = `${state.pomoTasks.length} Completed`;
  }

  const listNode = document.getElementById('pomo-history-list');
  if (listNode) {
    if (state.pomoTasks.length === 0) {
      listNode.innerHTML = `<p class="font-xs text-muted text-center p-sm">No finished pomodoros recorded in storage lockers yet.</p>`;
    } else {
      listNode.innerHTML = state.pomoTasks.map(tsk => `
        <div class="history-item-row" style="border-left:3px solid var(--color-rose);">
          <div class="flex-column">
            <strong class="text-dark m-bottom-xxs">${tsk.name}</strong>
            <span class="font-xs text-muted">Completed focus interval blocks</span>
          </div>
          <span class="badge badge-rose">${tsk.date}</span>
        </div>
      `).join('');
    }
  }
}

// ==========================================
// GOALS & DUAL VIEW MILESTONES
// ==========================================
function initAnalyticsAndWipes() {
  // Goals editings handlers
  const editWeightBtn = document.getElementById('btn-edit-weight-goal');
  if (editWeightBtn) {
    editWeightBtn.addEventListener('click', () => {
      const user = prompt("Configure your target weight goal metric (kg):", "72");
      if (user && parseFloat(user)) {
        document.getElementById('goal-weight-text').textContent = `Current: 75 kg | Target: ${user} kg`;
        showToast("Weight target goal adjustments accepted!", 'success');
      }
    });
  }

  const editReadBtn = document.getElementById('btn-edit-reading-goal');
  if (editReadBtn) {
    editReadBtn.addEventListener('click', () => {
      const user = prompt("Configure your annualized book complete targets:", "12");
      if (user && parseInt(user)) {
        document.getElementById('goal-reading-text').textContent = `Current: ${state.booksCompleted.length} / ${user} books finished`;
        const percentage = Math.min((state.booksCompleted.length / parseInt(user)) * 100, 100);
        document.getElementById('goal-reading-fill').style.width = `${percentage}%`;
        showToast("Reading goal target updated!", 'success');
      }
    });
  }

  const editWaterGoalBtn = document.getElementById('btn-edit-water-goal');
  if (editWaterGoalBtn) {
    editWaterGoalBtn.addEventListener('click', () => {
      const user = prompt("Set minimum hydration standard baseline (ml):", "2500");
      if (user && parseInt(user)) {
        state.waterGoal = parseInt(user);
        saveState();
        updateWaterUI();
        showToast("Hydration limit parameters synced!", "success");
      }
    });
  }

  // Backup and Export triggers
  const exportBtn = document.getElementById('btn-export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportPulseCSV();
    });
  }

  const resetAllBtn = document.getElementById('btn-reset-everything-config');
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      const confirmWipe = confirm("⚠️ CRITICAL: This will destroy your local wellness, habit records, reading metrics and reset storage configurations. Are you sure?");
      if (confirmWipe) {
        localStorage.removeItem('pulseline_state');
        showToast("Database state structures initialized. Re-loading apps environment.", "error");
        setTimeout(() => {
          location.reload();
        }, 1200);
      }
    });
  }

  renderFullBadgeCase();
}

const BADGES_LIST = [
  { title: "Metabolic Prime", req: "Log at least 2 workouts", icon: "dumbbell", unlockedId: "workout" },
  { title: "Hydration Master", req: "Complete 2.5L water cap", icon: "droplet", unlockedId: "water" },
  { title: "Brain Catalyst", req: "Finished 3 logged books", icon: "book-open", unlockedId: "book" },
  { title: "Willpower Shield", req: "Check off 10 daily habits", icon: "shield", unlockedId: "habit" }
];

function renderFullBadgeCase() {
  const container = document.getElementById('awards-badges-grid');
  const fullCase = document.getElementById('full-badges-grid');

  // Compute unlocking variables
  const isWorkoutUnlocked = state.workouts.length >= 2;
  const isWaterUnlocked = state.water.reduce((a, b) => a + b.amount, 0) >= 2500;
  const isBooksUnlocked = state.booksCompleted.length >= 2;
  const isHabitsUnlocked = state.habits.filter(h => h.checked).length >= 3;

  const evaluationMap = {
    workout: isWorkoutUnlocked,
    water: isWaterUnlocked,
    book: isBooksUnlocked,
    habit: isHabitsUnlocked
  };

  const templateStr = BADGES_LIST.map(badge => {
    const isUnlocked = evaluationMap[badge.unlockedId];
    return `
      <div class="badge-plate ${isUnlocked ? 'unlocked' : 'locked'}" title="${badge.req}">
        <i data-lucide="${isUnlocked ? 'star' : 'lock'}" style="width:14px;height:14px;"></i>
        <span>${badge.title}</span>
      </div>
    `;
  }).join('');

  if (container) {
    container.innerHTML = templateStr;
  }

  if (fullCase) {
    fullCase.innerHTML = BADGES_LIST.map(badge => {
      const isUnlocked = evaluationMap[badge.unlockedId];
      return `
        <div class="card text-center flex-column align-center justify-center border" style="background-color:${isUnlocked ? 'rgba(168,85,247,0.06)' : 'var(--bg-neutral)'}">
          <div class="glass-icon mx-auto m-bottom-sm ${isUnlocked ? 'bg-purple-light text-purple' : 'bg-neutral text-muted'}">
            <i data-lucide="${badge.icon}"></i>
          </div>
          <strong class="font-sm block text-dark">${badge.title}</strong>
          <span class="font-xs text-muted block m-top-xxs" style="font-size:11px;">Requirement: ${badge.req}</span>
          <span class="badge ${isUnlocked ? 'badge-primary' : 'badge-rose'} m-top-sm">
            ${isUnlocked ? "⭐️ UnLocked" : "🔒 Checked Locked"}
          </span>
        </div>
      `;
    }).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

function exportPulseCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Category,Parameter,Value/Count,Status\n";
  
  csvContent += `Profile,Experience Points,${state.xp} XP,Active\n`;
  csvContent += `Streaks,Global Habits Streak,${state.streak} Days,Active\n`;
  csvContent += `Workouts,Total Logged,${state.workouts.length} Routines,Active\n`;
  csvContent += `Water,Hydration Cumulative,${state.water.reduce((a,b)=>a+b.amount, 0)} ml,Active\n`;
  csvContent += `Books,Completed Library,${state.booksCompleted.length} books,Active\n`;
  csvContent += `Habits,Daily Completed Snaps,${state.habits.filter(h=>h.checked).length} items,Checked\n`;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `pulseline_wellness_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
  
  showToast("Wellness achievements compiled & CSV download executed!", "success");
}

// ==========================================
// THEME SWITCH & PRESET BOOTSTRAPPER
// ==========================================
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const darkIcon = document.getElementById('theme-icon-dark');
  const lightIcon = document.getElementById('theme-icon-light');

  // Checked saved preferences first
  const savedTheme = localStorage.getItem('pulseline_theme');
  if (savedTheme) {
    body.className = savedTheme;
  } else {
    body.className = 'light-theme';
  }

  function syncIcons() {
    if (body.classList.contains('dark-theme')) {
      if (darkIcon) darkIcon.classList.add('hidden');
      if (lightIcon) lightIcon.classList.remove('hidden');
    } else {
      if (lightIcon) lightIcon.classList.add('hidden');
      if (darkIcon) darkIcon.classList.remove('hidden');
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('pulseline_theme', 'dark-theme');
        showToast("Deep space midnight mode active.", "info");
      } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('pulseline_theme', 'light-theme');
        showToast("Standard focus light mode active.", "info");
      }
      syncIcons();
    });
  }

  syncIcons();
}

function initBellNotifications() {
  const bellBtn = document.getElementById('notification-bell');
  const notifDropdown = document.getElementById('notifications-dropdown');
  const notifList = document.getElementById('notif-list');
  const clearBtn = document.getElementById('clear-notifications');

  const staticNotifs = [
    { title: "Streak Saved!", desc: "Consistency looks beautiful on you.", time: "2 min ago" },
    { title: "Hydration Alert", desc: "You completed 40% of baseline hydration, keep pouring!", time: "1 hr ago" }
  ];

  function renderNotifs() {
    if (!notifList) return;
    if (staticNotifs.length === 0) {
      notifList.innerHTML = `<p class="font-xs text-muted text-center p-md">No unread notifications left.</p>`;
    } else {
      notifList.innerHTML = staticNotifs.map(n => `
        <div class="notif-item">
          <h5 class="notif-title">${n.title}</h5>
          <p class="text-secondary font-xs">${n.desc}</p>
          <span class="notif-time block m-top-xxs">${n.time}</span>
        </div>
      `).join('');
    }
  }

  if (bellBtn && notifDropdown) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      notifDropdown.classList.add('hidden');
    });

    notifDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      staticNotifs.length = 0;
      renderNotifs();
      const dot = document.querySelector('.notification-indicator');
      if (dot) dot.classList.add('hidden');
      showToast("Cleared alert notifications stack.", 'info');
    });
  }

  renderNotifs();
}

function initAiWellnessSuggestions() {
  const regenBtn = document.getElementById('btn-regenerate-ai');
  const aiText = document.getElementById('ai-suggestion-text');

  const suggestionsList = [
    `"Outstanding metrics John! Based on your 5-day habits sequence and high target sleep quality, today is perfect for compound Strength routines. Focus on lifting heavy during lunch hour to capitalize on hormonal circadian spikes."`,
    `"Your hydration index is lagging slightly. Aim to drink 500ml water within the next hour to flush lactic waste from yesterday's cardio routines."`,
    `"Consistent habit checks unlocked achievement flags. A perfect day to dive 15 pages deeper into James Clear's self-discipline pathways!"`,
    `"Sleep quality logged deep rest cycles. You have extra executive energy! Power through a Pomodoro focus block before taking on intensive gym routines today."`
  ];

  if (regenBtn && aiText) {
    regenBtn.addEventListener('click', () => {
      const random = suggestionsList[Math.floor(Math.random() * suggestionsList.length)];
      aiText.textContent = random;
      addXP(10);
      showToast("Refining wellness prediction scores...", "info");
    });
  }
}

// ==========================================
// BOOTSTRAP INITIALIZATION ON LOAD
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // Load State from storage
  loadState();

  // Load modules
  initThemeToggle();
  initNavigation();
  initHeaderClock();
  initMotivationalQuotes();
  initLearningWidget();
  initWaterTracker();
  initWorkouts();
  initDietTracker();
  initReadingTracker();
  initHabitsChecklist();
  initSleepAndMood();
  initBreathingZen();
  initPomodoro();
  initAnalyticsAndWipes();
  initBellNotifications();
  initAiWellnessSuggestions();

  // Run dynamic XP bar displays
  updateXPDisplay();

  // Initialize beautiful inline SVGs
  if (window.lucide) {
    window.lucide.createIcons();
  }

  showToast("PulseLine wellness ecosystem loaded offline.", "success");
});
