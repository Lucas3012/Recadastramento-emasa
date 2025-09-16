document.addEventListener('DOMContentLoaded', () => {
    const showRegistrationBtn = document.getElementById('showRegistration');
    const showHistoryBtn = document.getElementById('showHistory');
    const showWhatsappBtn = document.getElementById('showWhatsapp');
    
    const registrationSection = document.getElementById('registration');
    const historySection = document.getElementById('history');
    const whatsappSection = document.getElementById('whatsapp');

    const employeeForm = document.getElementById('employeeForm');
    const whatsappForm = document.getElementById('whatsappForm');
    
    const employeeTableBody = document.querySelector('#employeeTable tbody');
    const employeesCardList = document.getElementById('employees-card-list');
    
    let employees = [];
    
    // Funções para alternar as abas
    showRegistrationBtn.addEventListener('click', () => {
        registrationSection.classList.remove('hidden');
        historySection.classList.add('hidden');
        whatsappSection.classList.add('hidden');
        showRegistrationBtn.classList.add('active');
        showHistoryBtn.classList.remove('active');
        showWhatsappBtn.classList.remove('active');
    });

    showHistoryBtn.addEventListener('click', () => {
        registrationSection.classList.add('hidden');
        historySection.classList.remove('hidden');
        whatsappSection.classList.add('hidden');
        showRegistrationBtn.classList.remove('active');
        showHistoryBtn.classList.add('active');
        showWhatsappBtn.classList.remove('active');
    });

    showWhatsappBtn.addEventListener('click', () => {
        registrationSection.classList.add('hidden');
        historySection.classList.add('hidden');
        whatsappSection.classList.remove('hidden');
        showRegistrationBtn.classList.remove('active');
        showHistoryBtn.classList.remove('active');
        showWhatsappBtn.classList.add('active');
    });

    // Função de recadastramento
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        const newEmployee = { name, position, email, phone };
        employees.push(newEmployee);
        
        updateEmployeeList();
        
        employeeForm.reset();
        
        Swal.fire({
            icon: 'success',
            title: 'Cadastrado!',
            text: 'Funcionário recadastrado com sucesso.',
            confirmButtonColor: '#007bff'
        });
    });

    // Função para atualizar a lista de funcionários
    const updateEmployeeList = () => {
        employeeTableBody.innerHTML = '';
        employeesCardList.innerHTML = '';
        
        employees.forEach(employee => {
            // Adicionar à tabela (desktop)
            const row = employeeTableBody.insertRow();
            row.insertCell(0).textContent = employee.name;
            row.insertCell(1).textContent = employee.position;
            row.insertCell(2).textContent = employee.email;
            row.insertCell(3).textContent = employee.phone;
            
            // Adicionar aos cards (mobile)
            const card = document.createElement('div');
            card.classList.add('employee-card');
            card.innerHTML = `
                <div class="card-item"><span class="card-label">Nome:</span> ${employee.name}</div>
                <div class="card-item"><span class="card-label">Cargo:</span> ${employee.position}</div>
                <div class="card-item"><span class="card-label">Email:</span> ${employee.email}</div>
                <div class="card-item"><span class="card-label">Telefone:</span> ${employee.phone}</div>
            `;
            employeesCardList.appendChild(card);
        });
    };
    
    // Função para envio de documentos via WhatsApp
    whatsappForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('whatsapp-name').value;
        // NOVO CAMPO ADICIONADO AQUI
        const id = document.getElementById('whatsapp-id').value;
        // FIM DO NOVO CAMPO
        const docs = document.getElementById('whatsapp-docs').value;

        const message = `Olá, *${name}*!%0A%0AÉ a empresa Águas do Brasil. Para a sua matrícula *${id}*, precisamos que nos envie os seguintes documentos:%0A%0A*${docs}*%0A%0AFavor responder esta mensagem com os arquivos.`;
        
        const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
    });
});
