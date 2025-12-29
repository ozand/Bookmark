javascript: (function () {
    console.log("Запуск скрипта...");

    /* 1. Нажимаем кнопку раскрытия текста (по вашему классу) */
    const expandBtnSelector = 'button[class*="ButtonCore-module_wrapper"], button.read_more_btn, .read_mode_btn';
    const btn = document.querySelector(expandBtnSelector);
    if (btn) {
        console.log("Кнопка найдена, нажимаем...");
        btn.click();
    } else {
        console.log("Кнопка раскрытия не найдена (возможно, документ уже открыт полностью).");
    }

    /* 2. Функция медленной прокрутки для загрузки картинок (Scribd lazy loading) */
    let currentHeight = 0;
    const scrollStep = window.innerHeight * 0.8; // Прокручиваем по 80% экрана

    alert("Начинаю сканирование страниц и диаграмм. Не трогайте мышь, это займет секунд 20-30.");

    let scroller = setInterval(() => {
        window.scrollBy(0, scrollStep);
        currentHeight += scrollStep;

        // Если достигли конца страницы
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            clearInterval(scroller);
            setTimeout(processPagesForPrint, 3000); // Ждем 3 сек, чтобы последние картинки догрузились
        }
    }, 800); // Пауза 0.8 сек между скроллами, чтобы сервер успел отдать картинку

    function processPagesForPrint() {
        alert("Сканирование завершено. Подготовка PDF...");

        /* 3. Очистка DOM: Оставляем ТОЛЬКО страницы */
        // Находим контейнер со страницами
        const pageContainer = document.querySelector('.outer_page_container') || document.querySelector('#main_content_wrapper');

        if (!pageContainer) {
            alert("Не могу найти контейнер страниц. Структура сайта изменилась.");
            return;
        }

        // Собираем все страницы в массив
        const pages = document.querySelectorAll('.outer_page');

        // Создаем чистый контейнер для печати
        document.body.innerHTML = '';
        const printContainer = document.createElement('div');
        printContainer.id = 'print-area';
        document.body.appendChild(printContainer);

        // Переносим страницы в новый контейнер
        pages.forEach((page, index) => {
            // Клонируем узел, чтобы сохранить все стили и картинки
            const pageClone = page.cloneNode(true);

            // Сбрасываем абсолютное позиционирование, чтобы они шли друг за другом
            pageClone.style.position = 'relative';
            pageClone.style.top = 'auto';
            pageClone.style.left = 'auto';
            pageClone.style.margin = '0 auto 20px auto'; // Центрируем и добавляем отступ
            pageClone.style.pageBreakAfter = 'always'; // Разрыв страницы при печати
            pageClone.style.boxShadow = 'none';

            // Фикс для transform: scale (Scribd уменьшает страницы CSS-ом)
            // Пытаемся найти внутренний блок newpage и зафиксировать его
            const inner = pageClone.querySelector('.newpage');
            if (inner) {
                // Иногда нужно сбросить трансформацию для печати, но часто лучше оставить как есть,
                // так как координаты текста привязаны к scale. 
                // Мы просто гарантируем, что контейнер имеет правильные размеры.
            }

            printContainer.appendChild(pageClone);
        });

        /* 4. Добавляем стили для печати */
        const style = document.createElement('style');
        style.innerHTML = `
            body { background: #fff; margin: 0; padding: 0; }
            #print-area { width: 100%; }
            .outer_page { overflow: hidden; border: 1px solid #ccc; }
            /* Скрываем элементы управления, если они попали внутрь */
            .buttons, .toolbar, .promo { display: none !important; }
            @media print {
                .outer_page { border: none; margin-bottom: 0; }
                body { -webkit-print-color-adjust: exact; } /* Чтобы печатались фоновые картинки */
            }
        `;
        document.head.appendChild(style);

        /* 5. Вызываем печать */
        setTimeout(() => {
            window.print();
            // Предлагаем перезагрузить страницу, так как мы разрушили DOM
            if (confirm("Скачивание завершено? Перезагрузить страницу для возврата к сайту?")) {
                location.reload();
            }
        }, 1000);
    }
})();