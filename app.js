// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ =====
const STORAGE_KEY = 'personal_planner_data';
const VERSION = '1.0.0';

// Предустановленные данные
const DEFAULT_DATA = {
    version: VERSION,
    tasks: [],
    reminders: [],
    questions: [
        // Утренние вопросы
        {
            id: 'q1',
            text: 'Как я хочу чувствовать себя сегодня?',
            type: 'morning',
            category: 'reflection',
            answers: [],
            isCustom: false
        },
        {
            id: 'q2',
            text: 'Что я могу сделать сегодня для своего счастья?',
            type: 'morning',
            category: 'happiness',
            answers: [],
            isCustom: false
        },
        {
            id: 'q3',
            text: 'Какое одно главное дело сделает день успешным?',
            type: 'morning',
            category: 'productivity',
            answers: [],
            isCustom: false
        },
        // Вечерние вопросы
        {
            id: 'q4',
            text: 'За что я благодарна сегодня?',
            type: 'evening',
            category: 'gratitude',
            answers: [],
            isCustom: false
        },
        {
            id: 'q5',
            text: 'Что сегодня наполнило меня энергией?',
            type: 'evening',
            category: 'energy',
            answers: [],
            isCustom: false
        },
        {
            id: 'q6',
            text: 'Что я узнала нового о себе сегодня?',
            type: 'evening',
            category: 'self_discovery',
            answers: [],
            isCustom: false
        },
        {
            id: 'q7',
            text: 'Что я могу отпустить перед сном?',
            type: 'evening',
            category: 'release',
            answers: [],
            isCustom: false
        },
        // Недельные вопросы
        {
            id: 'q8',
            text: 'Какие маленькие радости я планирую на неделю?',
            type: 'weekly',
            category: 'joy',
            answers: [],
            isCustom: false
        },
        {
            id: 'q9',
            text: 'Что я хочу попробовать нового на этой неделе?',
            type: 'weekly',
            category: 'growth',
            answers: [],
            isCustom: false
        }
    ],
    templates: [
        {
            id: 'morning_ritual',
            title: '🌅 Утренний ритуал',
            description: 'Начни день с заботы о себе',
            tasks: [
                'Стакан теплой воды с лимоном',
                '5 минут благодарности',
                'Растяжка/йога 10 минут',
                'Завтрак без телефона',
                'Определить 3 главные задачи дня'
            ],
            category: 'personal',
            color: '#FFD6E0',
            icon: 'sun',
            isCustom: false
        },
        {
            id: 'evening_ritual',
            title: '🌙 Вечерний ритуал',
            description: 'Заверши день спокойно и осознанно',
            tasks: [
                'Выключить экраны за час до сна',
                'Записать 5 хороших моментов дня',
                'Подготовить одежду на завтра',
                'Чтение 20 минут',
                'Медитация/дыхание 5 минут'
            ],
            category: 'personal',
            color: '#E6D6FF',
            icon: 'moon',
            isCustom: false
        },
        {
            id: 'weekly_planning',
            title: '📅 Планирование недели',
            description: 'Организуй предстоящую неделю',
            tasks: [
                'Обзор целей недели',
                'Запланировать время для себя',
                'Записаться на тренировки',
                'Спланировать встречи с друзьями',
                'Составить список покупок'
            ],
            category: 'work',
            color: '#D6F0FF',
            icon: 'calendar',
            isCustom: false
        }
    ],
    settings: {
        theme: 'auto',
        notifications: true,
        morningTime: '08:00',
        eveningTime: '21:00',
        vibration: true,
        sound: true
    },
    stats: {
        completedToday: 0,
        streak: 0,
        lastActive: null,
        totalTasks: 0,
        totalQuestionsAnswered: 0
    }
};

// Мотивационные сообщения
const MOTIVATION_MESSAGES = [
    "Ты молодец! 🌟",
    "Еще одна задача позади! 💪",
    "Ты становишься лучше с каждым днем! 🌸",
    "Так держать! У тебя получается! ✨",
    "Ты заслуживаешь похвалы! 🎉",
    "Маленькие шаги приводят к большим результатам! 🌈",
    "Ты справляешься прекрасно! 💖",
    "Твоя организованность вдохновляет! 💫",
    "Сегодня ты была продуктивной! 🌼",
    "Гордись своими достижениями! 🎊"
];

// Категории с цветами и иконками
const CATEGORIES = {
    personal: {
        name: 'Личное',
        color: '#FFD6E0',
        icon: 'heart',
        textColor: '#8B5A5A'
    },
    work: {
        name: 'Работа',
        color: '#D6F0FF',
        icon: 'briefcase',
        textColor: '#5A738B'
    },
    health: {
        name: 'Здоровье',
        color: '#D6FFDD',
        icon: 'apple-alt',
        textColor: '#5A8B5A'
    },
    ideas: {
        name: 'Идеи',
        color: '#F0D6FF',
        icon: 'lightbulb',
        textColor: '#7A5A8B'
    },
    family: {
        name: 'Семья',
        color: '#FFF5D6',
        icon: 'users',
        textColor: '#8B7D5A'
    },
    learning: {
        name: 'Обучение',
        color: '#E6D6FF',
        icon: 'graduation-cap',
        textColor: '#6A5A8B'
    }
};

// ===== ГЛОБАЛЬНЫЕ СОСТОЯНИЯ =====
let appData = { ...DEFAULT_DATA };
let currentFilter = 'all';
let currentQuestionType = 'today';
let notificationPermission = 'default';

// ===== СИСТЕМА ХРАНЕНИЯ ДАННЫХ =====
class StorageManager {
    static save() {
        try {
            // Обновляем статистику
            this.updateStats();
            
            // Сохраняем в localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
            
            // Обновляем информацию о хранилище
            this.updateStorageInfo();
            
            console.log('Данные сохранены');
            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            this.showNotification('Ошибка сохранения данных', 'error');
            return false;
        }
    }
    
    static load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                
                // Проверяем версию и мигрируем данные при необходимости
                if (parsed.version !== VERSION) {
                    console.log('Миграция данных с версии', parsed.version, 'на', VERSION);
                    parsed.version = VERSION;
                }
                
                // Объединяем с дефолтными значениями (для новых полей)
                appData = {
                    ...DEFAULT_DATA,
                    ...parsed,
                    tasks: parsed.tasks || [],
                    reminders: parsed.reminders || [],
                    questions: parsed.questions || DEFAULT_DATA.questions,
                    templates: parsed.templates || DEFAULT_DATA.templates,
                    settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
                    stats: { ...DEFAULT_DATA.stats, ...parsed.stats }
                };
                
                console.log('Данные загружены:', appData);
            } else {
                // Первый запуск - используем дефолтные данные
                appData = { ...DEFAULT_DATA };
                this.save();
                console.log('Первая загрузка - созданы дефолтные данные');
            }
            
            return true;
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            appData = { ...DEFAULT_DATA };
            return false;
        }
    }
    
    static updateStats() {
        const today = new Date().toDateString();
        const todayTasks = appData.tasks.filter(task => {
            if (!task.date) return false;
            return new Date(task.date).toDateString() === today;
        });
        
        appData.stats.completedToday = todayTasks.filter(t => t.completed).length;
        appData.stats.totalTasks = appData.tasks.length;
        
        // Обновляем streak
        const lastActive = appData.stats.lastActive;
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (!lastActive) {
            appData.stats.streak = 1;
        } else {
            const lastDate = new Date(lastActive);
            if (lastDate.toDateString() === yesterday.toDateString()) {
                appData.stats.streak++;
            } else if (lastDate.toDateString() !== today) {
                appData.stats.streak = 1;
            }
        }
        
        appData.stats.lastActive = now.toISOString();
    }
    
    static updateStorageInfo() {
        const dataStr = JSON.stringify(appData);
        const usedKB = Math.round((dataStr.length * 2) / 1024);
        const totalKB = 5120; // 5MB примерный лимит localStorage
        
        const percentage = Math.min((usedKB / totalKB) * 100, 100);
        
        const storageInfo = document.getElementById('storage-info');
        const progressFill = document.getElementById('storage-progress');
        
        if (storageInfo && progressFill) {
            storageInfo.textContent = `Использовано: ${usedKB} KB / ~5 MB`;
            progressFill.style.width = `${percentage}%`;
            
            if (percentage > 80) {
                progressFill.style.background = 'var(--danger-color)';
            } else if (percentage > 60) {
                progressFill.style.background = 'var(--warning-color)';
            }
        }
    }
    
    static exportData() {
        const dataStr = JSON.stringify(appData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `planner_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Данные экспортированы', 'success');
    }
    
    static importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    
                    // Базовая валидация
                    if (!imported.tasks || !imported.questions) {
                        throw new Error('Некорректный формат файла');
                    }
                    
                    // Сохраняем настройки и статистику
                    const currentSettings = appData.settings;
                    const currentStats = appData.stats;
                    
                    appData = {
                        ...imported,
                        settings: { ...currentSettings, ...imported.settings },
                        stats: { ...currentStats, ...imported.stats },
                        version: VERSION
                    };
                    
                    this.save();
                    this.showNotification('Данные успешно импортированы', 'success');
                    resolve(true);
                } catch (error) {
                    console.error('Ошибка импорта:', error);
                    this.showNotification('Ошибка импорта данных', 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                this.showNotification('Ошибка чтения файла', 'error');
                reject(new Error('Ошибка чтения файла'));
            };
            
            reader.readAsText(file);
        });
    }
    
    static clearData() {
        if (confirm('Вы уверены? Все данные будут удалены без возможности восстановления.')) {
            localStorage.removeItem(STORAGE_KEY);
            appData = { ...DEFAULT_DATA };
            this.save();
            this.showNotification('Все данные очищены', 'success');
            location.reload();
        }
    }
    
    static showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            
            // Устанавливаем иконку в зависимости от типа
            const icon = notification.querySelector('i');
            if (icon) {
                switch (type) {
                    case 'success':
                        icon.className = 'fas fa-check-circle';
                        notification.style.background = 'var(--success-color)';
                        break;
                    case 'error':
                        icon.className = 'fas fa-exclamation-circle';
                        notification.style.background = 'var(--danger-color)';
                        break;
                    default:
                        icon.className = 'fas fa-info-circle';
                        notification.style.background = 'var(--primary-color)';
                }
            }
            
            notification.classList.add('active');
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }
}

// ===== СИСТЕМА ЗАДАЧ =====
class TaskManager {
    static createTask(taskData) {
        const task = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: taskData.title.trim(),
            description: taskData.description || '',
            category: taskData.category || 'personal',
            priority: taskData.priority || 'medium',
            date: taskData.date || new Date().toISOString().split('T')[0],
            time: taskData.time || '',
            reminder: taskData.reminder || false,
            reminderTime: taskData.reminderTime || null,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        appData.tasks.unshift(task); // Добавляем в начало
        StorageManager.save();
        
        // Создаем напоминание если нужно
        if (task.reminder && task.reminderTime) {
            ReminderManager.createReminder({
                taskId: task.id,
                text: task.title,
                datetime: `${task.date}T${task.reminderTime}`,
                type: 'task'
            });
        }
        
        // Показываем мотивационное сообщение при добавлении
        if (Math.random() > 0.7) { // 30% chance
            this.showMotivation('add');
        }
        
        return task;
    }
    
    static updateTask(taskId, updates) {
        const taskIndex = appData.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return null;
        
        appData.tasks[taskIndex] = {
            ...appData.tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        StorageManager.save();
        return appData.tasks[taskIndex];
    }
    
    static deleteTask(taskId) {
        const taskIndex = appData.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return false;
        
        appData.tasks.splice(taskIndex, 1);
        StorageManager.save();
        
        // Удаляем связанные напоминания
        ReminderManager.deleteRemindersByTaskId(taskId);
        
        return true;
    }
    
    static toggleComplete(taskId) {
        const task = appData.tasks.find(t => t.id === taskId);
        if (!task) return null;
        
        const completed = !task.completed;
        const updatedTask = this.updateTask(taskId, { completed });
        
        // Показываем мотивационное сообщение при выполнении
        if (completed) {
            this.showMotivation('complete');
        }
        
        return updatedTask;
    }
    
    static getTodayTasks() {
        const today = new Date().toISOString().split('T')[0];
        return appData.tasks.filter(task => {
            if (!task.date) return false;
            return task.date === today;
        });
    }
    
    static getFilteredTasks(filter) {
        const today = new Date().toISOString().split('T')[0];
        
        switch (filter) {
            case 'today':
                return this.getTodayTasks();
            case 'pending':
                return appData.tasks.filter(task => !task.completed);
            case 'completed':
                return appData.tasks.filter(task => task.completed);
            case 'work':
                return appData.tasks.filter(task => task.category === 'work');
            case 'personal':
                return appData.tasks.filter(task => task.category === 'personal');
            case 'health':
                return appData.tasks.filter(task => task.category === 'health');
            case 'ideas':
                return appData.tasks.filter(task => task.category === 'ideas');
            case 'family':
                return appData.tasks.filter(task => task.category === 'family');
            default:
                return appData.tasks;
        }
    }
    
    static searchTasks(query) {
        if (!query.trim()) return appData.tasks;
        
        const searchTerm = query.toLowerCase();
        return appData.tasks.filter(task => {
            return task.title.toLowerCase().includes(searchTerm) ||
                   task.description.toLowerCase().includes(searchTerm);
        });
    }
    
    static showMotivation(type) {
        const messages = MOTIVATION_MESSAGES;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const banner = document.getElementById('motivation-banner');
        if (banner) {
            const text = banner.querySelector('span');
            if (text) {
                text.textContent = randomMessage;
                banner.classList.add('pulse');
                
                setTimeout(() => {
                    banner.classList.remove('pulse');
                }, 2000);
            }
        }
        
        // Также показываем в уведомлении для выполнения задач
        if (type === 'complete') {
            StorageManager.showNotification(randomMessage, 'success');
        }
    }
}

// ===== СИСТЕМА НАПОМИНАНИЙ =====
class ReminderManager {
    static createReminder(reminderData) {
        const reminder = {
            id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text: reminderData.text.trim(),
            datetime: reminderData.datetime,
            repeat: reminderData.repeat || 'none',
            taskId: reminderData.taskId || null,
            type: reminderData.type || 'general',
            active: true,
            notified: false,
            createdAt: new Date().toISOString()
        };
        
        appData.reminders.push(reminder);
        StorageManager.save();
        
        // Запускаем проверку напоминаний если разрешены уведомления
        if (appData.settings.notifications && notificationPermission === 'granted') {
            this.scheduleReminder(reminder);
        }
        
        return reminder;
    }
    
    static scheduleReminder(reminder) {
        const reminderTime = new Date(reminder.datetime).getTime();
        const now = new Date().getTime();
        const timeUntilReminder = reminderTime - now;
        
        if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
            setTimeout(() => {
                this.showBrowserNotification(reminder);
            }, timeUntilReminder);
        }
    }
    
    static showBrowserNotification(reminder) {
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        
        const notification = new Notification('🌸 Напоминание', {
            body: reminder.text,
            icon: 'icons/icon-192.png',
            badge: 'icons/icon-72.png',
            tag: reminder.id,
            requireInteraction: true,
            vibrate: appData.settings.vibration ? [200, 100, 200] : undefined
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
            
            // Показываем связанную задачу если есть
            if (reminder.taskId) {
                // Можно добавить логику для показа задачи
            }
        };
        
        // Обновляем статус напоминания
        const reminderIndex = appData.reminders.findIndex(r => r.id === reminder.id);
        if (reminderIndex !== -1) {
            appData.reminders[reminderIndex].notified = true;
            StorageManager.save();
        }
    }
    
    static deleteReminder(reminderId) {
        const reminderIndex = appData.reminders.findIndex(r => r.id === reminderId);
        if (reminderIndex === -1) return false;
        
        appData.reminders.splice(reminderIndex, 1);
        StorageManager.save();
        return true;
    }
    
    static deleteRemindersByTaskId(taskId) {
        appData.reminders = appData.reminders.filter(r => r.taskId !== taskId);
        StorageManager.save();
    }
    
    static async requestNotificationPermission() {
        if (!('Notification' in window)) {
            StorageManager.showNotification('Браузер не поддерживает уведомления', 'error');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            notificationPermission = 'granted';
            appData.settings.notifications = true;
            StorageManager.save();
            StorageManager.showNotification('Уведомления уже разрешены', 'success');
            return true;
        }
        
        if (Notification.permission === 'denied') {
            StorageManager.showNotification('Уведомления заблокированы. Разрешите в настройках браузера.', 'error');
            return false;
        }
        
        const permission = await Notification.requestPermission();
        notificationPermission = permission;
        
        if (permission === 'granted') {
            appData.settings.notifications = true;
            StorageManager.save();
            StorageManager.showNotification('Уведомления разрешены!', 'success');
            return true;
        } else {
            appData.settings.notifications = false;
            StorageManager.save();
            StorageManager.showNotification('Уведомления не разрешены', 'error');
            return false;
        }
    }
}

// ===== СИСТЕМА ВОПРОСОВ =====
class QuestionManager {
    static getQuestionsByType(type) {
        if (type === 'today') {
            const hour = new Date().getHours();
            if (hour < 12) {
                return appData.questions.filter(q => q.type === 'morning');
            } else {
                return appData.questions.filter(q => q.type === 'evening');
            }
        }
        return appData.questions.filter(q => q.type === type);
    }
    
    static addAnswer(questionId, answer) {
        const question = appData.questions.find(q => q.id === questionId);
        if (!question) return null;
        
        const today = new Date().toISOString().split('T')[0];
        
        // Удаляем старый ответ за сегодня если есть
        question.answers = question.answers.filter(a => a.date !== today);
        
        // Добавляем новый ответ
        question.answers.unshift({
            date: today,
            answer: answer.trim(),
            timestamp: new Date().toISOString()
        });
        
        // Обновляем статистику
        appData.stats.totalQuestionsAnswered++;
        
        StorageManager.save();
        return question;
    }
    
    static addCustomQuestion(text, type = 'custom') {
        const question = {
            id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text: text.trim(),
            type: type,
            category: 'custom',
            answers: [],
            isCustom: true,
            createdAt: new Date().toISOString()
        };
        
        appData.questions.push(question);
        StorageManager.save();
        return question;
    }
    
    static deleteQuestion(questionId) {
        const questionIndex = appData.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return false;
        
        // Не удаляем предустановленные вопросы
        if (!appData.questions[questionIndex].isCustom) {
            StorageManager.showNotification('Нельзя удалить предустановленный вопрос', 'error');
            return false;
        }
        
        appData.questions.splice(questionIndex, 1);
        StorageManager.save();
        return true;
    }
    
    static getRecentAnswers(limit = 10) {
        const allAnswers = [];
        
        appData.questions.forEach(question => {
            question.answers.forEach(answer => {
                allAnswers.push({
                    question: question.text,
                    ...answer
                });
            });
        });
        
        // Сортируем по дате (новые сверху)
        return allAnswers.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        }).slice(0, limit);
    }
}

// ===== СИСТЕМА ШАБЛОНОВ =====
class TemplateManager {
    static useTemplate(templateId) {
        const template = appData.templates.find(t => t.id === templateId);
        if (!template) return null;
        
        const createdTasks = [];
        const today = new Date().toISOString().split('T')[0];
        
        template.tasks.forEach((taskTitle, index) => {
            const task = TaskManager.createTask({
                title: taskTitle,
                category: template.category,
                date: today,
                priority: 'medium'
            });
            createdTasks.push(task);
        });
        
        StorageManager.showNotification(`Шаблон "${template.title}" применен`, 'success');
        return createdTasks;
    }
    
    static addCustomTemplate(templateData) {
        const template = {
            id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: templateData.title.trim(),
            description: templateData.description || '',
            tasks: templateData.tasks || [],
            category: templateData.category || 'personal',
            color: templateData.color || CATEGORIES[templateData.category]?.color || '#E6D6FF',
            icon: templateData.icon || 'list',
            isCustom: true,
            createdAt: new Date().toISOString()
        };
        
        appData.templates.push(template);
        StorageManager.save();
        return template;
    }
}

// ===== РЕНДЕРИНГ ИНТЕРФЕЙСА =====
class UIManager {
    static init() {
        // Загружаем данные
        StorageManager.load();
        
        // Инициализируем компоненты
        this.initWelcomeScreen();
        this.initNavigation();
        this.initTaskModal();
        this.initSidebar();
        this.initTheme();
        this.initDate();
        
        // Рендерим начальное состояние
        this.renderTodayTasks();
        this.updateStatsDisplay();
        this.renderQuestions();
        this.renderRecentAnswers();
        
        // Запрашиваем разрешение на уведомления
        if (appData.settings.notifications) {
            ReminderManager.requestNotificationPermission();
        }
        
        // Обновляем информацию о хранилище
        StorageManager.updateStorageInfo();
        
        // Запускаем проверку напоминаний
        this.startReminderCheck();
        
        console.log('Приложение инициализировано');
    }
    
    static initWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const startBtn = document.getElementById('start-btn');
        const appContainer = document.getElementById('app');
        
        if (welcomeScreen && startBtn && appContainer) {
            // Проверяем, был ли уже показан welcome screen
            const hasSeenWelcome = localStorage.getItem('has_seen_welcome');
            
            if (hasSeenWelcome) {
                welcomeScreen.classList.remove('active');
                appContainer.classList.add('active');
            } else {
                startBtn.addEventListener('click', () => {
                    welcomeScreen.classList.remove('active');
                    setTimeout(() => {
                        appContainer.classList.add('active');
                    }, 300);
                    
                    localStorage.setItem('has_seen_welcome', 'true');
                });
            }
        }
    }
    
    static initNavigation() {
        // Переключение табов
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Обновляем активные кнопки
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Показываем соответствующий контент
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Обновляем контент в зависимости от таба
                switch (tabId) {
                    case 'today':
                        this.renderTodayTasks();
                        break;
                    case 'tasks':
                        this.renderAllTasks();
                        break;
                    case 'reminders':
                        this.renderReminders();
                        break;
                    case 'questions':
                        this.renderQuestions();
                        break;
                }
            });
        });
        
        // Фильтры задач
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentFilter = btn.dataset.filter;
                this.renderTodayTasks();
            });
        });
        
        // Фильтры вопросов
        document.querySelectorAll('[data-question-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-question-type]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentQuestionType = btn.dataset.questionType;
                this.renderQuestions();
            });
        });
    }
    
    static initTaskModal() {
        const modal = document.getElementById('task-modal');
        const overlay = document.getElementById('overlay');
        const showModalBtn = document.getElementById('show-advanced');
        const addTaskFloat = document.getElementById('add-task-float');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        const saveTaskBtn = document.getElementById('save-task-btn');
        const quickAddBtn = document.getElementById('quick-add-btn');
        const quickTaskInput = document.getElementById('quick-task-input');
        
        // Показ модального окна
        const showModal = () => {
            modal.classList.add('active');
            overlay.classList.add('active');
            document.getElementById('task-title').focus();
            
            // Устанавливаем сегодняшнюю дату по умолчанию
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('task-date').value = today;
            
            // Сбрасываем форму
            document.getElementById('task-description').value = '';
            document.getElementById('task-time').value = '';
            document.getElementById('set-reminder').checked = false;
            
            // Сбрасываем выбор категории
            document.querySelectorAll('.category-option').forEach(opt => {
                opt.classList.remove('active');
            });
            document.querySelector('.category-option[data-category="personal"]').classList.add('active');
            
            // Сбрасываем выбор приоритета
            document.querySelectorAll('.priority-option').forEach(opt => {
                opt.classList.remove('active');
            });
            document.querySelector('.priority-option[data-priority="medium"]').classList.add('active');
        };
        
        // Скрытие модального окна
        const hideModal = () => {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        };
        
        // Обработчики показа
        if (showModalBtn) showModalBtn.addEventListener('click', showModal);
        if (addTaskFloat) addTaskFloat.addEventListener('click', showModal);
        
        // Обработчики скрытия
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', hideModal);
        });
        if (overlay) overlay.addEventListener('click', hideModal);
        
        // Быстрое добавление задачи
        if (quickAddBtn && quickTaskInput) {
            const quickAddHandler = () => {
                const title = quickTaskInput.value.trim();
                if (title) {
                    TaskManager.createTask({
                        title: title,
                        category: 'personal',
                        priority: 'medium'
                    });
                    
                    quickTaskInput.value = '';
                    this.renderTodayTasks();
                    this.updateStatsDisplay();
                }
            };
            
            quickAddBtn.addEventListener('click', quickAddHandler);
            quickTaskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    quickAddHandler();
                }
            });
        }
        
        // Сохранение задачи из модального окна
        if (saveTaskBtn) {
            saveTaskBtn.addEventListener('click', () => {
                const title = document.getElementById('task-title').value.trim();
                if (!title) {
                    StorageManager.showNotification('Введите название задачи', 'error');
                    return;
                }
                
                const category = document.querySelector('.category-option.active').dataset.category;
                const priority = document.querySelector('.priority-option.active').dataset.priority;
                const date = document.getElementById('task-date').value;
                const time = document.getElementById('task-time').value;
                const description = document.getElementById('task-description').value;
                const setReminder = document.getElementById('set-reminder').checked;
                
                const taskData = {
                    title: title,
                    description: description,
                    category: category,
                    priority: priority,
                    date: date,
                    time: time,
                    reminder: setReminder
                };
                
                if (setReminder && time) {
                    taskData.reminderTime = time;
                }
                
                TaskManager.createTask(taskData);
                hideModal();
                this.renderTodayTasks();
                this.updateStatsDisplay();
            });
        }
    }
    
    static initSidebar() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const closeSidebar = document.getElementById('close-sidebar');
        const overlay = document.getElementById('overlay');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            });
        }
        
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        // Обработчики пунктов меню
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                
                // Обновляем активный пункт
                document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Закрываем sidebar
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                
                // Обрабатываем выбор раздела
                this.handleSidebarSelection(section);
            });
        });
        
        // Экспорт данных
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                StorageManager.exportData();
            });
        }
        
        // Импорт данных
        const importBtn = document.getElementById('import-data');
        const importFile = document.getElementById('import-file');
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => {
                importFile.click();
            });
            
            importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    StorageManager.importData(file)
                        .then(() => {
                            location.reload();
                        })
                        .catch(() => {
                            importFile.value = '';
                        });
                }
            });
        }
        
        // Поделиться приложением
        const shareBtn = document.getElementById('share-app');
        if (shareBtn && navigator.share) {
            shareBtn.addEventListener('click', () => {
                navigator.share({
                    title: 'Мой Планировщик',
                    text: 'Попробуй мой персональный планировщик!',
                    url: window.location.href
                });
            });
        }
    }
    
    static handleSidebarSelection(section) {
        switch (section) {
            case 'templates':
                this.showTemplates();
                break;
            case 'settings':
                this.showSettings();
                break;
            case 'statistics':
                this.showStatistics();
                break;
            // Добавь обработку других разделов
        }
    }
    
    static initTheme() {
        const theme = appData.settings.theme;
        
        if (theme === 'auto') {
            const hour = new Date().getHours();
            if (hour >= 20 || hour <= 6) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
            }
        } else {
            document.body.setAttribute('data-theme', theme);
        }
    }
    
    static initDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('ru-RU', options);
        }
    }
    
    static updateStatsDisplay() {
        const todayTasks = TaskManager.getTodayTasks();
        const total = todayTasks.length;
        const done = todayTasks.filter(t => t.completed).length;
        const remaining = total - done;
        
        document.getElementById('today-total').textContent = total;
        document.getElementById('today-done').textContent = done;
        document.getElementById('today-remaining').textContent = remaining;
    }
    
    static renderTodayTasks() {
        const container = document.getElementById('today-tasks-container');
        if (!container) return;
        
        const tasks = TaskManager.getFilteredTasks(currentFilter);
        
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-clipboard-list"></i>
                    </div>
                    <h3>${currentFilter === 'all' ? 'Пока нет задач на сегодня' : 'Нет задач по этому фильтру'}</h3>
                    <p>Добавь первую задачу или выбери шаблон</p>
                    <button class="btn-secondary" id="use-template-btn">
                        <i class="fas fa-magic"></i> Использовать шаблон
                    </button>
                </div>
            `;
            
            // Добавляем обработчик для кнопки шаблона
            const templateBtn = container.querySelector('#use-template-btn');
            if (templateBtn) {
                templateBtn.addEventListener('click', () => {
                    this.showTemplates();
                });
            }
        } else {
            container.innerHTML = tasks.map(task => this.createTaskHTML(task)).join('');
            
            // Добавляем обработчики событий для задач
            container.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    const taskId = e.currentTarget.dataset.taskId;
                    TaskManager.toggleComplete(taskId);
                    this.renderTodayTasks();
                    this.updateStatsDisplay();
                });
            });
            
            container.querySelectorAll('.task-action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const taskId = e.currentTarget.closest('.task-card').dataset.taskId;
                    const action = e.currentTarget.dataset.action;
                    
                    if (action === 'edit') {
                        this.editTask(taskId);
                    } else if (action === 'delete') {
                        if (confirm('Удалить задачу?')) {
                            TaskManager.deleteTask(taskId);
                            this.renderTodayTasks();
                            this.updateStatsDisplay();
                        }
                    }
                });
            });
        }
    }
    
    static createTaskHTML(task) {
        const category = CATEGORIES[task.category] || CATEGORIES.personal;
        const time = task.time ? `<div class="task-time">${task.time}</div>` : '';
        
        return `
            <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                         data-task-id="${task.id}"></div>
                </div>
                ${task.description ? `
                <div class="task-body">
                    <div class="task-description">${task.description}</div>
                    ${time}
                </div>
                ` : ''}
                <div class="task-footer">
                    <div class="task-category" style="background: ${category.color}; color: ${category.textColor};">
                        <i class="fas fa-${category.icon}"></i>
                        ${category.name}
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn" data-action="edit" title="Редактировать">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn" data-action="delete" title="Удалить">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    static renderAllTasks() {
        const container = document.getElementById('all-tasks-container');
        if (!container) return;
        
        const tasks = appData.tasks;
        
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <h3>Нет задач</h3>
                    <p>Создайте свою первую задачу</p>
                </div>
            `;
        } else {
            // Группируем задачи по дате
            const grouped = tasks.reduce((groups, task) => {
                const date = task.date || 'Без даты';
                if (!groups[date]) groups[date] = [];
                groups[date].push(task);
                return groups;
            }, {});
            
            // Сортируем даты
            const sortedDates = Object.keys(grouped).sort((a, b) => {
                if (a === 'Без даты') return 1;
                if (b === 'Без даты') return -1;
                return new Date(a) - new Date(b);
            });
            
            container.innerHTML = sortedDates.map(date => {
                const dateTasks = grouped[date];
                const dateObj = date === 'Без даты' ? null : new Date(date);
                const dateString = date === 'Без даты' ? 'Без даты' : 
                    dateObj.toLocaleDateString('ru-RU', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                    });
                
                return `
                    <div class="date-group">
                        <h3 class="date-header">${dateString}</h3>
                        ${dateTasks.map(task => this.createTaskHTML(task)).join('')}
                    </div>
                `;
            }).join('');
            
            // Добавляем обработчики событий
            this.addTaskEventListeners(container);
        }
    }
    
    static renderReminders() {
        const container = document.getElementById('reminders-list');
        if (!container) return;
        
        const reminders = appData.reminders.filter(r => r.active);
        
        if (reminders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-bell-slash"></i>
                    </div>
                    <h3>Нет напоминаний</h3>
                    <p>Добавьте первое напоминание</p>
                </div>
            `;
        } else {
            container.innerHTML = reminders.map(reminder => {
                const date = new Date(reminder.datetime);
                const timeString = date.toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                return `
                    <div class="reminder-card card">
                        <div class="reminder-header">
                            <div class="reminder-text">${reminder.text}</div>
                            <button class="icon-btn delete-reminder" data-id="${reminder.id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="reminder-footer">
                            <div class="reminder-time">
                                <i class="far fa-clock"></i>
                                ${timeString}
                            </div>
                            ${reminder.repeat !== 'none' ? `
                            <div class="reminder-repeat">
                                <i class="fas fa-redo"></i>
                                ${this.getRepeatText(reminder.repeat)}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            // Добавляем обработчики удаления
            container.querySelectorAll('.delete-reminder').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const reminderId = e.currentTarget.dataset.id;
                    if (confirm('Удалить напоминание?')) {
                        ReminderManager.deleteReminder(reminderId);
                        this.renderReminders();
                    }
                });
            });
        }
        
        // Обработчик для кнопки включения уведомлений
        const enableBtn = document.getElementById('enable-notifications-btn');
        if (enableBtn) {
            enableBtn.addEventListener('click', () => {
                ReminderManager.requestNotificationPermission();
            });
        }
        
        // Обработчик для добавления напоминания
        const addReminderBtn = document.getElementById('add-reminder-btn');
        if (addReminderBtn) {
            addReminderBtn.addEventListener('click', () => {
                const text = document.getElementById('reminder-text').value.trim();
                const date = document.getElementById('reminder-date').value;
                const time = document.getElementById('reminder-time').value;
                const repeat = document.querySelector('.repeat-option.active')?.dataset.repeat || 'none';
                
                if (!text) {
                    StorageManager.showNotification('Введите текст напоминания', 'error');
                    return;
                }
                
                if (!date || !time) {
                    StorageManager.showNotification('Укажите дату и время', 'error');
                    return;
                }
                
                const datetime = `${date}T${time}`;
                
                ReminderManager.createReminder({
                    text: text,
                    datetime: datetime,
                    repeat: repeat,
                    type: 'general'
                });
                
                // Очищаем форму
                document.getElementById('reminder-text').value = '';
                document.getElementById('reminder-date').value = '';
                document.getElementById('reminder-time').value = '';
                
                this.renderReminders();
                StorageManager.showNotification('Напоминание добавлено', 'success');
            });
        }
        
        // Обработчики для кнопок повтора
        document.querySelectorAll('.repeat-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.repeat-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    static getRepeatText(repeat) {
        const texts = {
            none: 'Никогда',
            daily: 'Ежедневно',
            weekly: 'Еженедельно',
            monthly: 'Ежемесячно'
        };
        return texts[repeat] || repeat;
    }
    
    static renderQuestions() {
        const container = document.getElementById('questions-container');
        if (!container) return;
        
        const questions = QuestionManager.getQuestionsByType(currentQuestionType);
        
        if (questions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <h3>Нет вопросов</h3>
                    <p>Добавьте свои вопросы для саморефлексии</p>
                </div>
            `;
        } else {
            container.innerHTML = questions.map(question => {
                const today = new Date().toISOString().split('T')[0];
                const todayAnswer = question.answers.find(a => a.date === today);
                
                return `
                    <div class="question-card card" data-question-id="${question.id}">
                        <div class="question-text">${question.text}</div>
                        ${todayAnswer ? `
                        <div class="answer-display">
                            <div class="answer-label">Ваш ответ:</div>
                            <div class="answer-text">${todayAnswer.answer}</div>
                        </div>
                        ` : `
                        <div class="answer-input">
                            <textarea placeholder="Ваш ответ..." rows="2"></textarea>
                            <button class="btn-small save-answer">Сохранить</button>
                        </div>
                        `}
                    </div>
                `;
            }).join('');
            
            // Добавляем обработчики для сохранения ответов
            container.querySelectorAll('.save-answer').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const questionCard = e.currentTarget.closest('.question-card');
                    const questionId = questionCard.dataset.questionId;
                    const textarea = questionCard.querySelector('textarea');
                    const answer = textarea.value.trim();
                    
                    if (answer) {
                        QuestionManager.addAnswer(questionId, answer);
                        this.renderQuestions();
                        this.renderRecentAnswers();
                        StorageManager.showNotification('Ответ сохранен', 'success');
                    }
                });
            });
        }
    }
    
    static renderRecentAnswers() {
        const container = document.getElementById('answers-history');
        if (!container) return;
        
        const recentAnswers = QuestionManager.getRecentAnswers(5);
        
        if (recentAnswers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Пока нет сохраненных ответов</p>
                </div>
            `;
        } else {
            container.innerHTML = recentAnswers.map(answer => {
                const date = new Date(answer.timestamp);
                const dateString = date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short'
                });
                
                return `
                    <div class="history-item">
                        <div class="history-date">${dateString}</div>
                        <div class="history-question">${answer.question}</div>
                        <div class="history-answer">${answer.answer}</div>
                    </div>
                `;
            }).join('');
        }
    }
    
    static addTaskEventListeners(container) {
        // Обработчики чекбоксов
        container.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const taskId = e.currentTarget.dataset.taskId;
                TaskManager.toggleComplete(taskId);
                this.renderAllTasks();
                this.updateStatsDisplay();
            });
        });
        
        // Обработчики кнопок действий
        container.querySelectorAll('.task-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskCard = e.currentTarget.closest('.task-card');
                const taskId = taskCard.dataset.taskId;
                const action = e.currentTarget.dataset.action;
                
                if (action === 'edit') {
                    this.editTask(taskId);
                } else if (action === 'delete') {
                    if (confirm('Удалить задачу?')) {
                        TaskManager.deleteTask(taskId);
                        this.renderAllTasks();
                        this.updateStatsDisplay();
                    }
                }
            });
        });
    }
    
    static editTask(taskId) {
        const task = appData.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Заполняем модальное окно данными задачи
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-date').value = task.date;
        document.getElementById('task-time').value = task.time;
        document.getElementById('set-reminder').checked = task.reminder;
        
        // Устанавливаем категорию
        document.querySelectorAll('.category-option').forEach(opt => {
            opt.classList.remove('active');
            if (opt.dataset.category === task.category) {
                opt.classList.add('active');
            }
        });
        
        // Устанавливаем приоритет
        document.querySelectorAll('.priority-option').forEach(opt => {
            opt.classList.remove('active');
            if (opt.dataset.priority === task.priority) {
                opt.classList.add('active');
            }
        });
        
        // Показываем модальное окно
        const modal = document.getElementById('task-modal');
        const overlay = document.getElementById('overlay');
        modal.classList.add('active');
        overlay.classList.add('active');
        
        // Меняем поведение кнопки сохранения
        const saveBtn = document.getElementById('save-task-btn');
        const originalClick = saveBtn.onclick;
        
        saveBtn.onclick = () => {
            const updates = {
                title: document.getElementById('task-title').value.trim(),
                description: document.getElementById('task-description').value,
                category: document.querySelector('.category-option.active').dataset.category,
                priority: document.querySelector('.priority-option.active').dataset.priority,
                date: document.getElementById('task-date').value,
                time: document.getElementById('task-time').value,
                reminder: document.getElementById('set-reminder').checked
            };
            
            if (!updates.title) {
                StorageManager.showNotification('Введите название задачи', 'error');
                return;
            }
            
            TaskManager.updateTask(taskId, updates);
            
            // Восстанавливаем оригинальное поведение кнопки
            saveBtn.onclick = originalClick;
            
            modal.classList.remove('active');
            overlay.classList.remove('active');
            
            this.renderTodayTasks();
            this.renderAllTasks();
            this.updateStatsDisplay();
        };
    }
    
    static showTemplates() {
        // Можно реализовать модальное окно с шаблонами
        alert('Выберите шаблон для быстрого добавления задач');
        // Здесь можно показать список шаблонов
    }
    
    static showSettings() {
        // Можно реализовать модальное окно с настройками
        alert('Настройки приложения');
        // Здесь можно показать настройки темы, уведомлений и т.д.
    }
    
    static showStatistics() {
        // Можно реализовать экран со статистикой
        alert(`Статистика:
        Всего задач: ${appData.stats.totalTasks}
        Выполнено сегодня: ${appData.stats.completedToday}
        Серия дней: ${appData.stats.streak}
        Ответов на вопросы: ${appData.stats.totalQuestionsAnswered}`);
    }
    
    static startReminderCheck() {
        // Проверяем напоминания каждую минуту
        setInterval(() => {
            const now = new Date();
            const nowISO = now.toISOString();
            
            appData.reminders.forEach(reminder => {
                if (reminder.active && !reminder.notified && reminder.datetime <= nowISO) {
                    // Показываем напоминание
                    if (appData.settings.notifications && notificationPermission === 'granted') {
                        ReminderManager.showBrowserNotification(reminder);
                    }
                    
                    // Обновляем статус
                    reminder.notified = true;
                    
                    // Если повторение, создаем следующее напоминание
                    if (reminder.repeat !== 'none') {
                        this.scheduleNextReminder(reminder);
                    }
                }
            });
            
            // Сохраняем изменения
            StorageManager.save();
        }, 60000); // Каждую минуту
    }
    
    static scheduleNextReminder(reminder) {
        const currentDate = new Date(reminder.datetime);
        let nextDate;
        
        switch (reminder.repeat) {
            case 'daily':
                nextDate = new Date(currentDate);
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'weekly':
                nextDate = new Date(currentDate);
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'monthly':
                nextDate = new Date(currentDate);
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            default:
                return;
        }
        
        // Создаем новое напоминание
        const newReminder = {
            ...reminder,
            id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            datetime: nextDate.toISOString(),
            notified: false,
            createdAt: new Date().toISOString()
        };
        
        appData.reminders.push(newReminder);
        StorageManager.save();
        
        // Запланировать новое напоминание
        ReminderManager.scheduleReminder(newReminder);
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем UI
    UIManager.init();
    
    // Проверяем, установлено ли приложение как PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Приложение запущено как PWA');
        document.body.classList.add('pwa-mode');
    }
    
    // Обработчик для добавления на домашний экран
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        console.log('Приложение можно установить на домашний экран');
        
        // Можно показать кнопку для установки
        // const installBtn = document.createElement('button');
        // installBtn.textContent = 'Установить приложение';
        // installBtn.addEventListener('click', () => e.prompt());
        // document.body.appendChild(installBtn);
    });
    
    // Проверяем версию Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            console.log('Service Worker готов');
        });
    }
});

// Экспортируем менеджеры для отладки
window.PlannerApp = {
    StorageManager,
    TaskManager,
    ReminderManager,
    QuestionManager,
    TemplateManager,
    UIManager,
    appData
};
