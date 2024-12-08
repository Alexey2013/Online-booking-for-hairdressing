// Функция для логина
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, password: password })
    });
  
    const data = await response.json();
    localStorage.setItem('token', data.token);
  }
  
  // Функция для загрузки услуг
  async function loadAppointments() {
    const response = await fetch('/api/services');
    const services = await response.json();
    
    const serviceSelect = document.getElementById('serviceSelect');
    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service.id;
      option.textContent = `${service.name} (${service.price} ₽, ${service.duration} мин)`;
      serviceSelect.appendChild(option);
    });
  }
  
  // Функция для записи на прием
  async function makeAppointment() {
    const serviceId = document.getElementById('serviceSelect').value;
    const time = document.getElementById('timeSelect').value;
    const token = localStorage.getItem('token');
  
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        serviceId,
        time,
        name: 'Иван Иванов',
        phone: '1234567890'
      })
    });
  
    const data = await response.json();
    alert('Запись успешно сделана');
  }
  