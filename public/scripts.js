function selection(serviceId) {
    const serviceCard = document.getElementById('service' + serviceId);
    const serviceName = serviceCard.querySelector('.service-name').textContent;
    const serviceDuration = serviceCard.querySelector('.service-time').textContent.replace('Продолжительность: ', '').replace(' мин.', '');
    const serviceCost = serviceCard.querySelector('.service-cost').textContent.replace('Стоимость: ', '').replace(' руб.', '');

    document.getElementById('service-type').value = serviceName;
    document.getElementById('service-price').value = serviceCost;
    document.getElementById('service-duration').value = serviceDuration;

    displayAvailableTimes(serviceDuration);
}


function displayAvailableTimes(serviceDuration) {
    const timeContainer = document.getElementById('timeSlots');
    timeContainer.innerHTML = '';

    const currentTime = new Date();
    const workStart = new Date(currentTime.setHours(9, 0, 0));
    const workEnd = new Date(currentTime.setHours(18, 0, 0));

    const timeSlots = [];

    let slotStart = new Date(workStart);

    fetch('/get-appointments')
        .then(response => response.json())
        .then(appointments => {
            while (slotStart <= workEnd) {
                const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);
                const breakTime = new Date(slotEnd.getTime() + 5 * 60000);

                const slotId = `slot-${slotStart.getHours()}:${slotStart.getMinutes()}`;
                timeSlots.push({ start: slotStart, end: slotEnd, id: slotId });

                let isAvailable = true;

                appointments.forEach(appointment => {
                    const appointmentStart = appointment.start_time;
                    const appointmentEnd = appointmentStart + appointment.duration;

                    const slotStartMinutes = slotStart.getHours() * 60 + slotStart.getMinutes();
                    const slotEndMinutes = slotEnd.getHours() * 60 + slotEnd.getMinutes();

                    if (slotStartMinutes >= appointmentStart && slotStartMinutes < appointmentEnd ||
                        slotEndMinutes > appointmentStart && slotEndMinutes <= appointmentEnd) {
                        isAvailable = false;
                    }
                });

                const timeCell = document.createElement('div');
                timeCell.id = slotId;

                if (isAvailable) {
                    timeCell.className = 'available';
                    timeCell.textContent = `${slotStart.getHours()}:${slotStart.getMinutes() < 10 ? '0' : ''}${slotStart.getMinutes()}`;
                    timeCell.onclick = function () {
                        updateSelectedTime(timeCell.id);
                    };
                } else {
                    timeCell.className = 'unavailable';
                    timeCell.textContent = `${slotStart.getHours()}:${slotStart.getMinutes() < 10 ? '0' : ''}${slotStart.getMinutes()}`;
                }

                timeContainer.appendChild(timeCell);

                slotStart = breakTime;
            }
        })
        .catch(error => console.error('Ошибка загрузки записей:', error));
}

function updateSelectedTime(id) {
    const selectedCell = document.getElementById(id);
    const timeInput = document.getElementById('time');

    const allCells = document.querySelectorAll('.available, .selected, .unavailable');

    if (selectedCell.classList.contains('available')) {
        selectedCell.classList.replace('available', 'selected');

        allCells.forEach(cell => {
            if (cell !== selectedCell && cell.classList.contains('available')) {
                cell.onclick = null;
            }
        });

        timeInput.value = selectedCell.textContent;
    } else {
        selectedCell.classList.replace('selected', 'available');

        allCells.forEach(cell => {
            if (
                cell !== selectedCell &&
                !cell.classList.contains('unavailable')
            ) {
                cell.onclick = function () {
                    updateSelectedTime(cell.id);
                };
            }
        });

        timeInput.value = '';
    }
}
