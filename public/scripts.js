function renderChoice(param) {
    getData(param);
    createDivWithTable();
}

function getData(param) {
    let elems = ["type", "price", "duration"]

    for (let elem of elems) {
        var text = document.getElementById(elem);
        text.value = document.getElementById(elem + param).textContent.toString();
    }
}

function createDivWithTable() {
    var request = new XMLHttpRequest();
    function reqReadyStateChange() {
        if (request.readyState == 4) {
            var status = request.status;
            if (status == 200) {
                var appointments = JSON.parse(request.responseText);

                var newDiv = document.createElement('div');
                newDiv.className = 'choiceDialogTime';
                newDiv.id = 'choiceDialogTime';

                var time = document.createElement('p');
                var timeB = document.createElement('b');
                var timeText = document.createTextNode('Время:');
                timeB.appendChild(timeText);
                time.appendChild(timeB);

                var table = document.createElement('table');
                table.className = 'tableTime';
                table.id = 'tableTime';

                var row;
                var choosenDuration = Number(document.getElementById('duration').value) / 10;
                for (var i = 0; i < 60; i++) {
                    var isBusy = false;
                    var isDisabled = false;
                    var hours = Math.floor((600 + i * 10) / 60);
                    var minutes = (600 + i * 10) % 60;
                    appointments.forEach(function(appointment) {
                        if ((appointment.start_time <= i) && (i < (appointment.start_time + appointment.duration + 1))) {
                            isBusy = true;
                        }
                        if (((appointment.start_time - choosenDuration) <= i) && (i < appointment.start_time)) {
                            isDisabled = true;
                        }
                    });

                    if (minutes == 0) {
                        row = document.createElement('tr');
                        var cell = document.createElement('td');
                        cell.className = isBusy ? 'tableTimeBusy' : (isDisabled ? 'tableTimeDisabled' : 'tableTimeFree');
                        cell.id = 'cell' + i;
                        if (!isBusy && !isDisabled)
                        cell.onclick = changeChoosenStyle.bind(this, cell.id);

                        var text = document.createTextNode(hours + ' : ' + minutes + '0');
                        cell.appendChild(text);
                        row.appendChild(cell);
                        table.appendChild(row);
                    } else {
                        var cell = document.createElement('td');
                        cell.className = isBusy ? 'tableTimeBusy' : (isDisabled ? 'tableTimeDisabled' : 'tableTimeFree');
                        cell.id = 'cell' + i;
                        if (!isBusy && !isDisabled)
                            cell.onclick = changeChoosenStyle.bind(this, cell.id);

                        var text = document.createTextNode(hours + ' : ' + minutes);
                        cell.appendChild(text);
                        row.appendChild(cell);
                    }
                }

                newDiv.appendChild(time);
                newDiv.appendChild(table);
                document.forms[0].appendChild(newDiv);
            }
        }
    }

    request.open("GET", "/choice");
    request.send();
    request.onreadystatechange = reqReadyStateChange;
}

function deleteChoiceDiv() {
    var div = document.getElementById('choiceDialogTime');

    if (div)
        div.parentNode.removeChild(div);
}

function changeChoosenStyle(id) {
    var cell = document.getElementById(id);
    var timeText = document.getElementById('time');

    if (cell.className == 'tableTimeFree') {
        cell.className = 'tableTimeChoice';


        for (var i = 0; i < 60; i++) {
            var anotherCell = document.getElementById('cell' + i);
            if ('cell' + i != id)
                anotherCell.onclick = null;
        }

        timeText.value = Number(id.replace('cell', ''))
    } else {
        cell.className = 'tableTimeFree';

        for (var i = 0; i < 60; i++) {
            var anotherCell = document.getElementById('cell' + i);
            if (('cell' + i != id) && (anotherCell.className != 'tableTimeDisabled') && (anotherCell.className != 'tableTimeBusy'))
                anotherCell.onclick = changeChoosenStyle.bind(this, 'cell' + i);
        }

        timeText.value = 0;
    }
}