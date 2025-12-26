// Интеграция с Telegram WebApp API
export class TelegramIntegration {
    constructor() {
        // Проверяем, запущено ли приложение в Telegram
        this.isTelegramApp = window.Telegram && window.Telegram.WebApp;

        if (this.isTelegramApp) {
            // Инициализация Telegram WebApp
            this.telegram = window.Telegram.WebApp;
            this.telegram.ready();

            // Настройка внешнего вида
            this.telegram.expand();
            this.telegram.setHeaderColor('#87ceeb');

            // Получаем данные пользователя
            this.user = this.telegram.initDataUnsafe?.user;

            // Инициализация кнопки "Share"
            this.initShareButton();

            // Инициализация кнопки для сохранения рекорда
            this.initSaveScoreButton();
        }
    }

    // Инициализация кнопки "Share"
    initShareButton() {
        if (!this.isTelegramApp) return;

        this.telegram.MainButton.text = 'Поделиться результатом';
        this.telegram.MainButton.color = '#2ea5e0';
        this.telegram.MainButton.textColor = '#ffffff';

        this.telegram.MainButton.onClick(() => {
            this.shareScore();
        });
    }

    // Показать/скрыть основную кнопку
    toggleMainButton(show) {
        if (!this.isTelegramApp) return;

        if (show) {
            this.telegram.MainButton.show();
        } else {
            this.telegram.MainButton.hide();
        }
    }

    // Поделиться результатом игры
    shareScore(score) {
        if (!this.isTelegramApp || !score) return;

        const shareText = `Я набрал ${Math.floor(score)} очков в игре Beaver Run! 🦫`;

        // Используем Telegram API для отправки сообщения
        this.telegram.openTelegramLink(`https://t.me/share/url?url=&text=${encodeURIComponent(shareText)}`);
    }

    // Инициализация кнопки сохранения счета
    initSaveScoreButton() {
        if (!this.isTelegramApp) return;

        // Кнопка SecondaryButton для сохранения счета
        this.telegram.SecondaryButton.text = 'Сохранить рекорд';
        this.telegram.SecondaryButton.color = '#654321';
        this.telegram.SecondaryButton.textColor = '#ffffff';

        this.telegram.SecondaryButton.onClick(() => {
            this.saveHighScore();
        });
    }

    // Показать/скрыть вторичную кнопку
    toggleSecondaryButton(show) {
        if (!this.isTelegramApp) return;

        if (show) {
            this.telegram.SecondaryButton.show();
        } else {
            this.telegram.SecondaryButton.hide();
        }
    }

    // Сохранить рекорд в Telegram
    saveHighScore(score) {
        if (!this.isTelegramApp || !score) return;

        // Здесь можно отправить рекорд на ваш сервер для сохранения
        // или использовать CloudStorage Telegram

        // Для примера используем localStorage
        const currentHighScore = localStorage.getItem('beaver_highscore') || 0;

        if (score > currentHighScore) {
            localStorage.setItem('beaver_highscore', score);

            // Показываем уведомление
            this.telegram.showPopup({
                title: 'Новый рекорд!',
                message: `Поздравляем! Вы установили новый рекорд: ${Math.floor(score)} очков!`,
                buttons: [{ id: 'ok', text: 'Отлично!' }]
            });
        }
    }

    // Показать всплывающее окно
    showPopup(options) {
        if (!this.isTelegramApp) return;

        this.telegram.showPopup(options);
    }

    // Вибрация
    vibrate(style = 'medium') {
        if (!this.isTelegramApp) return;

        if (this.telegram.HapticFeedback) {
            switch (style) {
                case 'light':
                    this.telegram.HapticFeedback.impactOccurred('light');
                    break;
                case 'medium':
                    this.telegram.HapticFeedback.impactOccurred('medium');
                    break;
                case 'heavy':
                    this.telegram.HapticFeedback.impactOccurred('heavy');
                    break;
                case 'success':
                    this.telegram.HapticFeedback.notificationOccurred('success');
                    break;
                case 'error':
                    this.telegram.HapticFeedback.notificationOccurred('error');
                    break;
            }
        }
    }
}
