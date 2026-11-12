// Переключение темы
const themeBtn = document.getElementById('themeBtn');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️ Светлая';
} else {
    themeBtn.textContent = '🌙 Тёмная';
}
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeBtn.textContent = isDark ? '☀️ Светлая' : '🌙 Тёмная';
});

// Работа с сообщениями
const STORAGE_KEY = 'lunarMessages';
function loadMessages() {
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
}
function saveMessages(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
function renderMessages() {
    const container = document.getElementById('messagesList');
    if (!container) return;
    const messages = loadMessages();
    if (messages.length === 0) {
        container.innerHTML = '<div class="empty-msg">Пока нет отзывов. Напишите первый!</div>';
        return;
    }
    const sorted = [...messages].reverse();
    container.innerHTML = '';
    sorted.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message-item';
        div.innerHTML = `
            <div class="message-header">
                <span class="message-name">${escapeHtml(msg.name)}</span>
                <span class="message-topic">${escapeHtml(msg.topic)}</span>
            </div>
            <div class="message-text">${escapeHtml(msg.message)}</div>
            <div class="message-date">${escapeHtml(msg.date)}</div>
        `;
        container.appendChild(div);
    });
}
function addMessage(name, topic, message) {
    const messages = loadMessages();
    messages.push({
        id: Date.now(),
        name: name.trim(),
        topic: topic,
        message: message.trim(),
        date: new Date().toLocaleString('ru-RU')
    });
    saveMessages(messages);
    renderMessages();
}
function clearAllMessages() {
    if (confirm('Удалить все сохранённые отзывы?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderMessages();
    }
}

const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = form.querySelector('[name="name"]').value;
        const topic = form.querySelector('[name="topic"]').value;
        const message = form.querySelector('[name="message"]').value;
        if (!name || !topic || !message) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }
        addMessage(name, topic, message);
        form.reset();
        alert('Сообщение сохранено!');
    });
}
const clearBtn = document.getElementById('clearMessagesBtn');
if (clearBtn) clearBtn.addEventListener('click', clearAllMessages);
renderMessages();

const cards = document.querySelectorAll('.card');
const modal = document.getElementById('workModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('p');

        modalImg.src = img.src;
        modalTitle.textContent = title.textContent;

        modal.classList.add('show');
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', e => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// профиль
const nameInput = document.getElementById('profileName');
const aboutInput = document.getElementById('profileAbout');
const contactsInput = document.getElementById('profileContacts');
const saveBtn = document.getElementById('saveProfile');

// загрузка профиля
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('artpinProfile'));

    if (!profile) return;

    nameInput.value = profile.name || '';
    aboutInput.value = profile.about || '';
    contactsInput.value = profile.contacts || '';
}

// сохранение профиля
if (saveBtn) {
    saveBtn.addEventListener('click', () => {

        const profile = {
            name: nameInput.value,
            about: aboutInput.value,
            contacts: contactsInput.value
        };

        localStorage.setItem('artpinProfile', JSON.stringify(profile));

        alert('Профиль сохранён');
    });
}

loadProfile();