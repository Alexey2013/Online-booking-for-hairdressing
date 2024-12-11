function renderChoice(param) {
    // Получение данных о выбранной услуге
    const serviceCard = document.getElementById('service' + param);
    const service_name = serviceCard.querySelector('.service-title').textContent;
    const serviceDuration = serviceCard.querySelector('.service-duration').textContent.replace('Продолжительность: ', '').replace(' мин.', '');
    const servicePrice = serviceCard.querySelector('.service-price').textContent.replace('Стоимость: ', '').replace(' руб.', '');

    // Заполнение формы выбранной услугой
    document.getElementById('type').value = service_name;
    document.getElementById('price').value = servicePrice;
    document.getElementById('duration').value = serviceDuration;

    // Генерация доступных временных слотов с учетом продолжительности и перерыва
    renderAvailableTimes(serviceDuration);
}

// Функция для отрисовки доступных временных слотов с учетом занятых интервалов
function renderAvailableTimes(serviceDuration) {
    const timeContainer = document.getElementById('timeSlots');
    timeContainer.innerHTML = ''; // Очистка предыдущих временных слотов

    const currentTime = new Date(); // Получение текущего времени
    const workDayStart = new Date(currentTime.setHours(9, 0, 0)); // Начало рабочего дня в 9:00
    const workDayEnd = new Date(currentTime.setHours(18, 0, 0)); // Конец рабочего дня в 18:00

    const slots = []; // Массив для хранения доступных слотов

    let slotTime = new Date(workDayStart);

    // Заполнение слотов с шагом 10 минут
    while (slotTime <= workDayEnd) {
        const slotEndTime = new Date(slotTime.getTime() + serviceDuration * 60000); // Время окончания услуги
        const breakTime = new Date(slotEndTime.getTime() + 5 * 60000); // Время для перерыва

        // Проверяем, доступен ли слот
        const slotId = `slot-${slotTime.getHours()}:${slotTime.getMinutes()}`;
        slots.push({ start: slotTime, end: slotEndTime, id: slotId });

        const timeCell = document.createElement('div');
        timeCell.className = 'tableTimeFree';
        timeCell.id = slotId;
        timeCell.textContent = `${slotTime.getHours()}:${slotTime.getMinutes() < 10 ? '0' : ''}${slotTime.getMinutes()}`;
        
        timeCell.onclick = function () {
            changeChoosenStyle(timeCell.id);
        };

        timeContainer.appendChild(timeCell);

        slotTime = breakTime; // Переход к следующему возможному слоту
    }
}

// Функция для обработки выбора временного слота
function changeChoosenStyle(id) {
    const cell = document.getElementById(id);
    const timeText = document.getElementById('time');

    // Получаем все ячейки
    const allCells = document.querySelectorAll('.tableTimeFree, .tableTimeChoice, .tableTimeDisabled, .tableTimeBusy');

    if (cell.classList.contains('tableTimeFree')) {
        // Если ячейка свободна, помечаем её как выбранную
        cell.classList.replace('tableTimeFree', 'tableTimeChoice');

        // Отключаем клики на остальные свободные ячейки
        allCells.forEach(anotherCell => {
            if (anotherCell !== cell && anotherCell.classList.contains('tableTimeFree')) {
                anotherCell.onclick = null;
            }
        });

        // Устанавливаем выбранное время
        timeText.value = cell.textContent;
    } else {
        // Если ячейка уже выбрана, сбрасываем её
        cell.classList.replace('tableTimeChoice', 'tableTimeFree');

        // Включаем клики на все ячейки, которые не отключены или заняты
        allCells.forEach(anotherCell => {
            if (
                anotherCell !== cell &&
                !anotherCell.classList.contains('tableTimeDisabled') &&
                !anotherCell.classList.contains('tableTimeBusy')
            ) {
                anotherCell.onclick = function () {
                    changeChoosenStyle(anotherCell.id);
                };
            }
        });

        // Сбрасываем выбранное время
        timeText.value = '';
    }
}

function deleteChoiceDiv() {
    var div = document.getElementById('choiceDialogTime');
    div?.parentNode.removeChild(div);
}
