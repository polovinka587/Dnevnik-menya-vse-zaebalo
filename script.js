// Конфигурация приложения - легко настраивается
const CONFIG = {
    // Эмоции по умолчанию
    emotions: [
        { id: 'tired', label: 'Усталость', emoji: '😴', color: '#4A90E2' },
        { id: 'anger', label: 'Злость', emoji: '😠', color: '#FF6B6B' },
        { id: 'emptiness', label: 'Пустота', emoji: '😶', color: '#95A5A6' },
        { id: 'anxiety', label: 'Тревога', emoji: '😰', color: '#FFA726' },
        { id: 'joy', label: 'Радость', emoji: '😊', color: '#4CAF50' },
        { id: 'inspiration', label: 'Вдохновение', emoji: '✨', color: '#9C27B0' },
        { id: 'apathy', label: 'Апатия', emoji: '😐', color: '#607D8B' },
        { id: 'stress', label: 'Стресс', emoji: '😫', color: '#E74C3C' },
        { id: 'satisfaction', label: 'Удовлетворение', emoji: '😌', color: '#2ECC71' }
    ],
    
    // Триггеры по умолчанию
    triggers: [
        'работа', 'люди', 'усталость', 'домашние дела',
        'учёба', 'отношения', 'здоровье', 'другое'
    ],
    
    // Подсказки для эмоций
    hints: {
        tired: ['Помедитируй 5 минут', 'Сделай дыхательные упражнения', 'Выпей травяной чай', 'Вздремни 20 минут'],
        anger: ['Сделай физические упражнения', 'Напиши письмо и разорви его', 'Сходи на короткую прогулку', 'Подыши глубоко 10 раз'],
        emptiness: ['Сделай что-то маленькое и приятное', 'Позвони другу', 'Запиши 3 вещи за которые ты благодарен', 'Создай что-нибудь'],
        anxiety: ['Выпей стакан воды', 'Сделай дыхательную технику 4-7-8', 'Запиши все тревожные мысли', 'Сосредоточься на настоящем моменте'],
        joy: ['Отпразднуй этот момент', 'Зафиксируй благодарность в дневнике', 'Поделись радостью с другим', 'Насладись моментом полностью'],
        inspiration: ['Запиши все идеи', 'Начни реализовывать самую маленькую', 'Поделись вдохновением', 'Создай что-то прямо сейчас'],
        apathy: ['Сделай одно маленькое действие', 'Выйди на 10-минутную прогулку', 'Поставь таймер на 5 минут и начни', 'Позволь себе ничего не делать'],
        stress: ['Сделай перерыв', 'Прими теплый душ', 'Сделай растяжку', 'Выпей воды и глубоко подыши'],
        satisfaction: ['Похвали себя', 'Отметь достижение', 'Поделись успехом', 'Поблагодари себя за усилия']
    },
    
    // Настройки цвета
    colors: {
        primary: '#6C63FF',
        secondary: '#FF6584',
        accent: '#36D1DC',
        success: '#4CAF50',
        warning: '#FF9800',
        danger: '#F44336'
    },
    
    // Настройки приложения
    settings: {
        autoBackup: true,
        backupInterval: 60000, // 1 минута
        enableReminders: true,
        reminderTime: '20:00',
        theme: 'light'
    }
};

// Глобальные переменные
let entries = [];
let currentEditId = null;
let charts = {};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Инициализация даты
    updateDate();
    
    // Загрузка данных
    loadData();
    
    // Инициализация UI
    initUI();
    
    // Инициализация событий
    initEvents();
    
    // Запуск автоматического резервного копирования
    if (CONFIG.settings.autoBackup) {
        setInterval(autoBackup, CONFIG.settings.backupInterval);
    }
    
    // Проверка напоминаний
    checkReminders();
}

function initUI() {
    // Заполнение эмоций
    renderEmotions();
    
    // Заполнение триггеров
    renderTriggers();
    
    // Инициализация слайдеров
    initSliders();
    
    // Инициализация звезд важности
    initStars();
    
    // Загрузка фильтров
    updateFilters();
    
    // Применение темы
    applyTheme();
    
    // Обновление счетчика записей
    updateEntryCount();
}

function initEvents() {
    // Форма записи
    const form = document.getElementById('entry-form');
    form.addEventListener('submit', saveEntry);
    
    // Кнопки
    document.getElementById('clear-btn').addEventListener('click', clearForm);
    document.getElementById('new-day-btn').addEventListener('click', showNewDayMotivation);
    document.getElementById('add-emotion-btn').addEventListener('click', addCustomEmotion);
    document.getElementById('add-trigger-btn').addEventListener('click', addCustomTrigger);
    
    // Слайдеры
    document.getElementById('physical-state').addEventListener('input', updateEnergyBalance);
    document.getElementById('energy').addEventListener('input', updateEnergyBalance);
    
    // Эмоции (для подсказок)
    document.querySelectorAll('.emotion-checkbox input').forEach(cb => {
        cb.addEventListener('change', updateHints);
    });
    
    // Вкладки
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });
    
    // Фильтры
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // Экспорт
    document.getElementById('export-json').addEventListener('click', exportToJSON);
    document.getElementById('export-text').addEventListener('click', exportToText);
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    
    // Настройки
    document.getElementById('theme-select').addEventListener('change', changeTheme);
    document.getElementById('save-hints').addEventListener('click', saveHints);
    document.getElementById('clear-data').addEventListener('click', clearAllData);
    
    // Модальное окно
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('save-edit-btn').addEventListener('click', saveEdit);
    document.getElementById('delete-entry-btn').addEventListener('click', deleteEntry);
    
    // Закрытие модального окна при клике вне его
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-modal') {
            closeModal();
        }
    });
}

// === УТИЛИТЫ ===
function updateDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('current-date').textContent = 
        now.toLocaleDateString('ru-RU', options);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// === РЕНДЕРИНГ ЭЛЕМЕНТОВ ===
function renderEmotions() {
    const container = document.getElementById('emotions-container');
    container.innerHTML = '';
    
    CONFIG.emotions.forEach(emotion => {
        const div = document.createElement('div');
        div.className = 'emotion-checkbox';
        div.innerHTML = `
            <input type="checkbox" id="emotion-${emotion.id}" value="${emotion.id}">
            <label for="emotion-${emotion.id}">
                <span>${emotion.emoji} ${emotion.label}</span>
            </label>
        `;
        container.appendChild(div);
    });
}

function renderTriggers() {
    const select = document.getElementById('trigger');
    const filter = document.getElementById('trigger-filter');
    
    select.innerHTML = '<option value="">Выберите триггер...</option>';
    filter.innerHTML = '<option value="all">Все</option>';
    
    CONFIG.triggers.forEach(trigger => {
        select.innerHTML += `<option value="${trigger}">${trigger}</option>`;
        filter.innerHTML += `<option value="${trigger}">${trigger}</option>`;
    });
}

function initSliders() {
    const physicalSlider = document.getElementById('physical-state');
    const energySlider = document.getElementById('energy');
    const physicalValue = document.getElementById('physical-value');
    const energyValue = document.getElementById('energy-value');
    
    physicalSlider.addEventListener('input', () => {
        physicalValue.textContent = physicalSlider.value;
    });
    
    energySlider.addEventListener('input', () => {
        energyValue.textContent = energySlider.value;
    });
}

function initStars() {
    const stars = document.querySelectorAll('.star');
    const importanceInput = document.getElementById('importance');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            importanceInput.value = value;
            
            stars.forEach(s => {
                if (parseInt(s.dataset.value) <= value) {
                    s.classList.add('active');
                    s.textContent = '★';
                } else {
                    s.classList.remove('active');
                    s.textContent = '☆';
                }
            });
        });
        
        star.addEventListener('mouseover', () => {
            const value = parseInt(star.dataset.value);
            stars.forEach(s => {
                if (parseInt(s.dataset.value) <= value) {
                    s.style.color = '#FFD700';
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            stars.forEach(s => {
                if (!s.classList.contains('active')) {
                    s.style.color = '';
                }
            });
        });
    });
}

// === ФОРМА И СОХРАНЕНИЕ ===
function saveEntry(e) {
    e.preventDefault();
    
    const entry = {
        id: generateId(),
        date: new Date().toISOString(),
        whatBothers: document.getElementById('what-bothers').value,
        emotions: Array.from(document.querySelectorAll('.emotion-checkbox input:checked'))
            .map(cb => cb.value),
        trigger: document.getElementById('trigger').value,
        physicalState: parseInt(document.getElementById('physical-state').value),
        energy: parseInt(document.getElementById('energy').value),
        importance: parseInt(document.getElementById('importance').value),
        victory: document.getElementById('victory').value,
        helpActions: document.getElementById('help-actions').value,
        morningMood: document.getElementById('morning-mood').value,
        eveningMood: document.getElementById('evening-mood').value,
        tag: document.getElementById('tag').value,
        inspiration: document.getElementById('inspiration').value
    };
    
    entries.push(entry);
    saveToLocalStorage();
    renderEntries();
    updateAnalytics();
    clearForm();
    
    // Показать уведомление
    showNotification('Запись сохранена успешно!', 'success');
}

function clearForm() {
    document.getElementById('entry-form').reset();
    document.getElementById('physical-value').textContent = '5';
    document.getElementById('energy-value').textContent = '5';
    document.querySelectorAll('.emotion-checkbox input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
        star.textContent = '☆';
    });
    document.getElementById('importance').value = '3';
    updateEnergyBalance();
    updateHints();
}

function updateEnergyBalance() {
    const physical = parseInt(document.getElementById('physical-state').value);
    const energy = parseInt(document.getElementById('energy').value);
    const balance = (physical + energy) / 2;
    const fill = document.getElementById('balance-fill');
    const text = document.getElementById('balance-text');
    
    let balancePercent = ((balance - 1) / 9) * 100;
    fill.style.width = `${balancePercent}%`;
    
    if (balance <= 3) {
        text.textContent = 'Низкий уровень энергии';
        text.className = 'balance-text low-energy';
        fill.style.background = 'linear-gradient(90deg, #F44336, #FF9800)';
    } else if (balance <= 7) {
        text.textContent = 'Средний уровень энергии';
        text.className = 'balance-text medium-energy';
        fill.style.background = 'linear-gradient(90deg, #FF9800, #FFEB3B)';
    } else {
        text.textContent = 'Высокий уровень энергии';
        text.className = 'balance-text high-energy';
        fill.style.background = 'linear-gradient(90deg, #FFEB3B, #4CAF50)';
    }
}

function updateHints() {
    const selectedEmotions = Array.from(document.querySelectorAll('.emotion-checkbox input:checked'))
        .map(cb => cb.value);
    const hintContent = document.getElementById('hint-content');
    
    if (selectedEmotions.length === 0) {
        hintContent.innerHTML = '<p>Выберите эмоции для получения персональных подсказок</p>';
        return;
    }
    
    let hints = [];
    selectedEmotions.forEach(emotion => {
        if (CONFIG.hints[emotion]) {
            const randomHint = CONFIG.hints[emotion][Math.floor(Math.random() * CONFIG.hints[emotion].length)];
            hints.push(`<strong>${CONFIG.emotions.find(e => e.id === emotion)?.label}:</strong> ${randomHint}`);
        }
    });
    
    hintContent.innerHTML = hints.map(hint => `<p>${hint}</p>`).join('');
}

function addCustomEmotion() {
    const input = document.getElementById('custom-emotion-input');
    const emotion = input.value.trim();
    
    if (emotion) {
        const emotionId = emotion.toLowerCase().replace(/\s+/g, '-');
        if (!CONFIG.emotions.find(e => e.id === emotionId)) {
            CONFIG.emotions.push({
                id: emotionId,
                label: emotion,
                emoji: '❤️',
                color: '#6C63FF'
            });
            
            renderEmotions();
            updateFilters();
            input.value = '';
            
            // Повторная инициализация событий для новых чекбоксов
            document.querySelectorAll('.emotion-checkbox input').forEach(cb => {
                cb.addEventListener('change', updateHints);
            });
            
            showNotification('Эмоция добавлена!', 'success');
        }
    }
}

function addCustomTrigger() {
    const input = document.getElementById('custom-trigger-input');
    const trigger = input.value.trim();
    
    if (trigger && !CONFIG.triggers.includes(trigger)) {
        CONFIG.triggers.push(trigger);
        renderTriggers();
        input.value = '';
        showNotification('Триггер добавлен!', 'success');
    }
}

// === ЛОКАЛЬНОЕ ХРАНИЛИЩЕ ===
function saveToLocalStorage() {
    const data = {
        entries: entries,
        config: CONFIG,
        lastBackup: new Date().toISOString()
    };
    
    localStorage.setItem('emotionalDiary', JSON.stringify(data));
    updateEntryCount();
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('emotionalDiary'));
    
    if (data) {
        entries = data.entries || [];
        
        // Обновляем конфиг из сохраненных данных
        if (data.config) {
            Object.assign(CONFIG, data.config);
        }
        
        // Обновляем дату последнего бэкапа
        if (data.lastBackup) {
            document.getElementById('last-backup').textContent = 
                new Date(data.lastBackup).toLocaleString('ru-RU');
        }
        
        document.getElementById('total-entries').textContent = entries.length;
        renderEntries();
        updateAnalytics();
    }
}

function autoBackup() {
    saveToLocalStorage();
    console.log('Автоматическое резервное копирование выполнено');
}

// === РЕНДЕРИНГ И ФИЛЬТРАЦИЯ ===
function renderEntries(filteredEntries = null) {
    const entriesToShow = filteredEntries || entries;
    const container = document.getElementById('entries-list');
    
    if (entriesToShow.length === 0) {
        container.innerHTML = '<p class="no-entries">Записей пока нет. Начните вести дневник!</p>';
        return;
    }
    
    // Сортируем по дате (новые сверху)
    const sortedEntries = [...entriesToShow].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    container.innerHTML = sortedEntries.map(entry => `
        <div class="entry-item ${getEntryClass(entry)}" data-id="${entry.id}">
            <div class="entry-header">
                <div class="entry-date">
                    ${new Date(entry.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                <div class="entry-actions">
                    <button class="action-btn edit-btn" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn copy-btn" title="Копировать">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn delete-btn" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="entry-content">
                <div>
                    ${entry.whatBothers ? `<p><strong>Что заебало:</strong> ${entry.whatBothers}</p>` : ''}
                    ${entry.victory ? `<div class="victory-badge"><strong>Победа:</strong> ${entry.victory}</div>` : ''}
                    ${entry.helpActions ? `<p><strong>Что помогло:</strong> ${entry.helpActions}</p>` : ''}
                    ${entry.inspiration ? `<p><strong>Вдохновение:</strong> ${entry.inspiration}</p>` : ''}
                </div>
                <div class="entry-stats">
                    ${entry.emotions.map(emotion => {
                        const emotionData = CONFIG.emotions.find(e => e.id === emotion);
                        return emotionData ? 
                            `<span class="stat-badge">${emotionData.emoji} ${emotionData.label}</span>` : '';
                    }).join('')}
                    <span class="stat-badge">⚡ ${entry.energy}/10</span>
                    <span class="stat-badge">🏃 ${entry.physicalState}/10</span>
                    ${entry.trigger ? `<span class="stat-badge">🎯 ${entry.trigger}</span>` : ''}
                    ${entry.tag ? `<span class="stat-badge">🏷️ ${entry.tag}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики событий для кнопок
    container.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const entryId = e.target.closest('.entry-item').dataset.id;
            openEditModal(entryId);
        });
    });
    
    container.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const entryId = e.target.closest('.entry-item').dataset.id;
            copyEntry(entryId);
        });
    });
    
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const entryId = e.target.closest('.entry-item').dataset.id;
            if (confirm('Удалить эту запись?')) {
                deleteEntryById(entryId);
            }
        });
    });
}

function getEntryClass(entry) {
    const energy = entry.energy;
    if (energy >= 7) return 'positive-entry';
    if (energy <= 3) return 'negative-entry';
    return 'neutral-entry';
}

function updateFilters() {
    const emotionFilter = document.getElementById('emotion-filter');
    emotionFilter.innerHTML = '<option value="all">Все</option>';
    
    CONFIG.emotions.forEach(emotion => {
        emotionFilter.innerHTML += `<option value="${emotion.id}">${emotion.label}</option>`;
    });
}

function applyFilters() {
    const period = document.getElementById('period-filter').value;
    const emotion = document.getElementById('emotion-filter').value;
    const trigger = document.getElementById('trigger-filter').value;
    
    let filtered = [...entries];
    
    // Фильтр по периоду
    const now = new Date();
    if (period === 'day') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = filtered.filter(entry => new Date(entry.date) >= today);
    } else if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(entry => new Date(entry.date) >= weekAgo);
    } else if (period === 'month') {
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filtered = filtered.filter(entry => new Date(entry.date) >= monthAgo);
    }
    
    // Фильтр по эмоции
    if (emotion !== 'all') {
        filtered = filtered.filter(entry => entry.emotions.includes(emotion));
    }
    
    // Фильтр по триггеру
    if (trigger !== 'all') {
        filtered = filtered.filter(entry => entry.trigger === trigger);
    }
    
    renderEntries(filtered);
}

function resetFilters() {
    document.getElementById('period-filter').value = 'day';
    document.getElementById('emotion-filter').value = 'all';
    document.getElementById('trigger-filter').value = 'all';
    renderEntries();
}

// === АНАЛИТИКА И ГРАФИКИ ===
function updateAnalytics() {
    if (entries.length === 0) return;
    
    // Средние значения
    const avgEnergy = entries.reduce((sum, entry) => sum + entry.energy, 0) / entries.length;
    const avgPhysical = entries.reduce((sum, entry) => sum + entry.physicalState, 0) / entries.length;
    
    document.getElementById('avg-energy').textContent = avgEnergy.toFixed(1);
    document.getElementById('avg-physical').textContent = avgPhysical.toFixed(1);
    
    // Тренды
    const recentEntries = entries.slice(-7);
    const olderEntries = entries.slice(-14, -7);
    
    if (olderEntries.length > 0) {
        const recentAvgEnergy = recentEntries.reduce((s, e) => s + e.energy, 0) / recentEntries.length;
        const olderAvgEnergy = olderEntries.reduce((s, e) => s + e.energy, 0) / olderEntries.length;
        
        const trend = recentAvgEnergy - olderAvgEnergy;
        const trendElement = document.getElementById('energy-trend');
        trendElement.textContent = trend >= 0 ? `↑ ${trend.toFixed(1)}` : `↓ ${Math.abs(trend).toFixed(1)}`;
        trendElement.style.color = trend >= 0 ? '#4CAF50' : '#F44336';
    }
    
    // Топ триггер
    const triggerCounts = {};
    entries.forEach(entry => {
        if (entry.trigger) {
            triggerCounts[entry.trigger] = (triggerCounts[entry.trigger] || 0) + 1;
        }
    });
    
    const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('top-trigger').textContent = topTrigger ? `${topTrigger[0]} (${topTrigger[1]})` : '-';
    
    // Количество побед
    const victories = entries.filter(entry => entry.victory && entry.victory.trim() !== '').length;
    document.getElementById('victories-count').textContent = victories;
    
    // Инсайты
    updateInsights();
    
    // Обновляем графики
    updateCharts();
}

function updateCharts() {
    const energyCtx = document.getElementById('energy-chart').getContext('2d');
    const emotionsCtx = document.getElementById('emotions-chart').getContext('2d');
    
    // Удаляем старые графики
    if (charts.energyChart) charts.energyChart.destroy();
    if (charts.emotionsChart) charts.emotionsChart.destroy();
    
    // График энергии и состояния (за последние 7 дней)
    const last7Entries = entries.slice(-7);
    const labels = last7Entries.map(entry => 
        new Date(entry.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    );
    
    charts.energyChart = new Chart(energyCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Энергия',
                    data: last7Entries.map(entry => entry.energy),
                    borderColor: CONFIG.colors.primary,
                    backgroundColor: CONFIG.colors.primary + '20',
                    tension: 0.4
                },
                {
                    label: 'Состояние',
                    data: last7Entries.map(entry => entry.physicalState),
                    borderColor: CONFIG.colors.secondary,
                    backgroundColor: CONFIG.colors.secondary + '20',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 1,
                    max: 10
                }
            }
        }
    });
    
    // Круговая диаграмма эмоций
    const emotionCounts = {};
    entries.forEach(entry => {
        entry.emotions.forEach(emotion => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
    });
    
    const emotionData = CONFIG.emotions.map(emotion => ({
        label: emotion.label,
        count: emotionCounts[emotion.id] || 0,
        color: emotion.color
    })).filter(item => item.count > 0);
    
    charts.emotionsChart = new Chart(emotionsCtx, {
        type: 'doughnut',
        data: {
            labels: emotionData.map(item => item.label),
            datasets: [{
                data: emotionData.map(item => item.count),
                backgroundColor: emotionData.map(item => item.color),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

function updateInsights() {
    const insightsContent = document.getElementById('insights-content');
    
    if (entries.length < 3) {
        insightsContent.innerHTML = '<p>Соберите больше данных для получения инсайтов</p>';
        return;
    }
    
    const lastWeekEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= weekAgo;
    });
    
    let insights = [];
    
    // Анализ триггеров
    const triggerCounts = {};
    lastWeekEntries.forEach(entry => {
        if (entry.trigger) {
            triggerCounts[entry.trigger] = (triggerCounts[entry.trigger] || 0) + 1;
        }
    });
    
    const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];
    if (topTrigger && topTrigger[1] >= 2) {
        insights.push(`<p>Чаще всего вас беспокоит: <strong>${topTrigger[0]}</strong> (${topTrigger[1]} раз за неделю)</p>`);
    }
    
    // Анализ энергии
    const avgEnergy = lastWeekEntries.reduce((sum, entry) => sum + entry.energy, 0) / lastWeekEntries.length;
    if (avgEnergy < 4) {
        insights.push('<p>Уровень энергии низкий. Возможно, стоит обратить внимание на отдых и восстановление.</p>');
    } else if (avgEnergy > 7) {
        insights.push('<p>Отличный уровень энергии! Продолжайте в том же духе.</p>');
    }
    
    // Анализ побед
    const victories = lastWeekEntries.filter(entry => entry.victory && entry.victory.trim() !== '').length;
    if (victories > 0) {
        insights.push(`<p>За неделю вы отметили <strong>${victories}</strong> маленьких побед! Это прекрасно!</p>`);
    } else {
        insights.push('<p>Попробуйте каждый день находить хотя бы одну маленькую победу.</p>');
    }
    
    insightsContent.innerHTML = insights.join('');
}

// === РЕДАКТИРОВАНИЕ И УДАЛЕНИЕ ===
function openEditModal(entryId) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;
    
    currentEditId = entryId;
    const modal = document.getElementById('edit-modal');
    const formContainer = document.getElementById('edit-form-container');
    
    // Создаем форму редактирования
    formContainer.innerHTML = `
        <div class="edit-form">
            <div class="form-section">
                <label>Что заебало:</label>
                <textarea id="edit-what-bothers">${entry.whatBothers || ''}</textarea>
            </div>
            <div class="form-section">
                <label>Эмоции:</label>
                <div class="emotions-grid">
                    ${CONFIG.emotions.map(emotion => `
                        <div class="emotion-checkbox">
                            <input type="checkbox" id="edit-emotion-${emotion.id}" 
                                   value="${emotion.id}" 
                                   ${entry.emotions.includes(emotion.id) ? 'checked' : ''}>
                            <label for="edit-emotion-${emotion.id}">
                                <span>${emotion.emoji} ${emotion.label}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-row">
                <div class="form-section">
                    <label>Энергия:</label>
                    <input type="range" id="edit-energy" min="1" max="10" value="${entry.energy}">
                    <div class="slider-value">${entry.energy}</div>
                </div>
                <div class="form-section">
                    <label>Состояние:</label>
                    <input type="range" id="edit-physical" min="1" max="10" value="${entry.physicalState}">
                    <div class="slider-value">${entry.physicalState}</div>
                </div>
            </div>
        </div>
    `;
    
    // Инициализируем слайдеры редактирования
    const energySlider = document.getElementById('edit-energy');
    const physicalSlider = document.getElementById('edit-physical');
    
    energySlider.addEventListener('input', () => {
        energySlider.nextElementSibling.textContent = energySlider.value;
    });
    
    physicalSlider.addEventListener('input', () => {
        physicalSlider.nextElementSibling.textContent = physicalSlider.value;
    });
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('edit-modal').classList.remove('active');
    currentEditId = null;
}

function saveEdit() {
    if (!currentEditId) return;
    
    const entry = entries.find(e => e.id === currentEditId);
    if (!entry) return;
    
    // Обновляем данные
    entry.whatBothers = document.getElementById('edit-what-bothers').value;
    entry.emotions = Array.from(document.querySelectorAll('.edit-form .emotion-checkbox input:checked'))
        .map(cb => cb.value);
    entry.energy = parseInt(document.getElementById('edit-energy').value);
    entry.physicalState = parseInt(document.getElementById('edit-physical').value);
    
    saveToLocalStorage();
    renderEntries();
    updateAnalytics();
    closeModal();
    
    showNotification('Запись обновлена', 'success');
}

function deleteEntry() {
    if (!currentEditId) return;
    
    if (confirm('Удалить эту запись?')) {
        deleteEntryById(currentEditId);
        closeModal();
    }
}

function deleteEntryById(entryId) {
    entries = entries.filter(entry => entry.id !== entryId);
    saveToLocalStorage();
    renderEntries();
    updateAnalytics();
    showNotification('Запись удалена', 'warning');
}

function copyEntry(entryId) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;
    
    const text = `
Запись от: ${new Date(entry.date).toLocaleString('ru-RU')}
Что беспокоило: ${entry.whatBothers || 'не указано'}
Эмоции: ${entry.emotions.map(e => CONFIG.emotions.find(em => em.id === e)?.label).join(', ')}
Триггер: ${entry.trigger || 'не указан'}
Энергия: ${entry.energy}/10
Состояние: ${entry.physicalState}/10
Важность: ${entry.importance}/5
Маленькая победа: ${entry.victory || 'не указана'}
Что помогло: ${entry.helpActions || 'не указано'}
Вдохновение: ${entry.inspiration || 'не указано'}
    `.trim();
    
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Запись скопирована в буфер обмена', 'success'))
        .catch(() => showNotification('Не удалось скопировать запись', 'error'));
}

// === ЭКСПОРТ ===
function exportToJSON() {
    const data = {
        entries: entries,
        config: CONFIG,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `эмоциональный-дневник-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToText() {
    if (entries.length === 0) {
        showNotification('Нет данных для экспорта', 'warning');
        return;
    }
    
    const text = entries.map(entry => `
=== Запись от ${new Date(entry.date).toLocaleString('ru-RU')} ===
Что заебало: ${entry.whatBothers || 'не указано'}
Эмоции: ${entry.emotions.map(e => CONFIG.emotions.find(em => em.id === e)?.label).join(', ')}
Триггер: ${entry.trigger || 'не указан'}
Физическое состояние: ${entry.physicalState}/10
Энергия: ${entry.energy}/10
Важность: ${entry.importance}/5
Настроение утром: ${entry.morningMood}
Настроение вечером: ${entry.eveningMood}
Маленькая победа: ${entry.victory || 'не указана'}
Что помогло: ${entry.helpActions || 'не указано'}
Тег: ${entry.tag || 'не указан'}
Вдохновение: ${entry.inspiration || 'не указано'}
==================================
    `).join('\n');
    
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Все записи скопированы в буфер обмена', 'success'))
        .catch(() => showNotification('Не удалось скопировать записи', 'error'));
}

function exportToPDF() {
    showNotification('Для экспорта в PDF используйте функцию печати браузера (Ctrl+P)', 'info');
    
    // В реальном приложении здесь бы использовалась библиотека типа jsPDF
    // window.print(); // Альтернатива: открыть диалог печати
}

// === НАСТРОЙКИ ===
function switchTab(e) {
    const tabId = e.target.dataset.tab;
    
    // Обновляем активные кнопки
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Показываем активный контент
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Если открыли аналитику - обновляем
    if (tabId === 'analytics') {
        updateAnalytics();
    }
}

function changeTheme() {
    const theme = document.getElementById('theme-select').value;
    CONFIG.settings.theme = theme;
    document.body.setAttribute('data-theme', theme);
    saveToLocalStorage();
}

function applyTheme() {
    document.body.setAttribute('data-theme', CONFIG.settings.theme);
    document.getElementById('theme-select').value = CONFIG.settings.theme;
}

function saveHints() {
    // В реальном приложении здесь бы была форма редактирования подсказок
    showNotification('Функция редактирования подсказок в разработке', 'info');
}

function clearAllData() {
    if (confirm('Вы уверены? Все данные будут удалены безвозвратно.')) {
        localStorage.removeItem('emotionalDiary');
        entries = [];
        renderEntries();
        updateAnalytics();
        updateEntryCount();
        showNotification('Все данные удалены', 'warning');
    }
}

// === УВЕДОМЛЕНИЯ И МОТИВАЦИЯ ===
function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 
                              type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : 
                     type === 'warning' ? '#FF9800' : 
                     type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showNewDayMotivation() {
    const motivations = [
        "Каждый день — это новая страница твоей истории. Пиши её с улыбкой! 😊",
        "Ты сильнее, чем думаешь. Каждый день доказывает это! 💪",
        "Маленькие шаги приводят к большим изменениям. Продолжай двигаться! 🚶‍♂️",
        "Сегодня — отличный день, чтобы стать немного лучше, чем вчера! 🌟",
        "Твои эмоции — это твоя сила, а не слабость. Используй их мудро! 🧠",
        "Каждая запись в дневнике — это шаг к самопознанию и гармонии. 📖",
        "Ты справляешься! Даже в трудные дни ты находишь силы продолжать. 🌈",
        "Сегодняшние маленькие победы — завтрашние большие достижения! 🏆"
    ];
    
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    document.getElementById('motivation-text').textContent = randomMotivation;
    
    // Анимация
    const motivationElement = document.getElementById('motivation-text');
    motivationElement.style.animation = 'none';
    setTimeout(() => {
        motivationElement.style.animation = 'pulse 1s';
    }, 10);
}

function updateEntryCount() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
    });
    
    document.getElementById('entry-count').textContent = `Записей сегодня: ${todayEntries.length}`;
}

function checkReminders() {
    if (!CONFIG.settings.enableReminders) return;
    
    const now = new Date();
    const reminderTime = CONFIG.settings.reminderTime.split(':');
    const reminderDate = new Date();
    reminderDate.setHours(reminderTime[0], reminderTime[1], 0, 0);
    
    // Если сейчас время напоминания и мы еще не показывали его сегодня
    if (now.getHours() === reminderDate.getHours() && 
        now.getMinutes() === reminderDate.getMinutes()) {
        
        const lastReminder = localStorage.getItem('lastReminder');
        const today = new Date().toDateString();
        
        if (lastReminder !== today) {
            if (confirm('Пора записать сегодняшние мысли в дневник! Открыть форму записи?')) {
                document.getElementById('what-bothers').focus();
            }
            localStorage.setItem('lastReminder', today);
        }
    }
}

// Анимации для CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

// Инициализация Chart.js (если не загружен)
if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
        console.log('Chart.js loaded');
        if (entries.length > 0) {
            updateCharts();
        }
    };
    document.head.appendChild(script);
}
