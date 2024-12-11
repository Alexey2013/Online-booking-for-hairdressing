function renderChoice(param) {
    // Get the values from the clicked service card
    const serviceCard = document.getElementById('service' + param);
    const service_name = serviceCard.querySelector('.service-title').textContent;
    const serviceDuration = serviceCard.querySelector('.service-duration').textContent.replace('Продолжительность: ', '').replace(' мин.', '');
    const servicePrice = serviceCard.querySelector('.service-price').textContent.replace('Стоимость: ', '').replace(' руб.', '');

    // Set the form fields with the corresponding values
    document.getElementById('type').value = service_name;
    document.getElementById('price').value = servicePrice;
    document.getElementById('duration').value = serviceDuration;

    console.log('Service Type: ', service_name);
    console.log('Service Duration: ', serviceDuration);
    console.log('Service Price: ', servicePrice);

    // Fetch available times (dummy example for integration)
    renderAvailableTimes(); // This will populate time slots.
}

// Example function to render dummy available time slots
function renderAvailableTimes() {
    const timeContainer = document.createElement('div');
    timeContainer.className = 'time-container';

    for (let i = 0; i < 10; i++) {
        const timeCell = document.createElement('div');
        timeCell.className = 'tableTimeFree';
        timeCell.id = 'cell' + i;
        timeCell.textContent = `10:${i}0`;
        timeCell.onclick = function () {
            changeChoosenStyle(timeCell.id);
        };
        timeContainer.appendChild(timeCell);
    }

    // Append the time container to the form
    const choiceDialog = document.querySelector('.choiceDialog');
    choiceDialog.appendChild(timeContainer);
}

// Function to handle time slot selection
function changeChoosenStyle(id) {
    const cell = document.getElementById(id);
    const timeText = document.getElementById('time');

    // Get all cells
    const allCells = document.querySelectorAll('.tableTimeFree, .tableTimeChoice, .tableTimeDisabled, .tableTimeBusy');

    if (cell.classList.contains('tableTimeFree')) {
        // If the cell is free, change it to chosen
        cell.classList.replace('tableTimeFree', 'tableTimeChoice');

        // Disable clicks on all other free cells
        allCells.forEach(anotherCell => {
            if (anotherCell !== cell && anotherCell.classList.contains('tableTimeFree')) {
                anotherCell.onclick = null;
            }
        });

        // Set the selected time
        timeText.value = Number(id.replace('cell', ''));
    } else {
        // If the cell was already chosen, reset it
        cell.classList.replace('tableTimeChoice', 'tableTimeFree');

        // Re-enable clicks on all cells that are not disabled or busy
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

        // Reset the selected time
        timeText.value = '';
    }
}


function deleteChoiceDiv() {
    var div = document.getElementById('choiceDialogTime');
    div?.parentNode.removeChild(div);
}

function changeChoosenStyle(id) {
    const cell = document.getElementById(id);
    const timeText = document.getElementById('time');

    // Получаем все ячейки
    const allCells = document.querySelectorAll('.tableTimeFree, .tableTimeChoice, .tableTimeDisabled, .tableTimeBusy');

    if (cell.classList.contains('tableTimeFree')) {
        // Если ячейка свободна, меняем её на выбранную
        cell.classList.replace('tableTimeFree', 'tableTimeChoice');

        // Отключаем клики на все ячейки, кроме выбранной
        allCells.forEach(anotherCell => {
            if (anotherCell !== cell && anotherCell.classList.contains('tableTimeFree')) {
                anotherCell.onclick = null;
            }
        });

        // Устанавливаем выбранное время
        timeText.value = Number(id.replace('cell', ''));
    } else {
        // Если ячейка уже была выбрана, сбрасываем её
        cell.classList.replace('tableTimeChoice', 'tableTimeFree');

        // Восстанавливаем клики на все ячейки, которые не заблокированы
        allCells.forEach(anotherCell => {
            if (anotherCell !== cell && !anotherCell.classList.contains('tableTimeDisabled') && !anotherCell.classList.contains('tableTimeBusy')) {
                anotherCell.onclick = function() {
                    changeChoosenStyle(anotherCell.id);
                };
            }
        });

        // Сбрасываем выбранное время
        timeText.value = 0;
    }
}