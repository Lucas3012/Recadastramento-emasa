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

    const switchTab = (tabName) => {
        document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.container > div:not(.tab-buttons)').forEach(section => section.classList.add('hidden'));

        if (tabName === 'registration') {
            registrationSection.classList.remove('hidden');
            showRegistrationBtn.classList.add('active');
        } else if (tabName === 'history') {
            historySection.classList.remove('hidden');
            showHistoryBtn.classList.add('active');
            fetchEmployees();
        } else if (tabName === 'whatsapp') {
            whatsappSection.classList.remove('hidden');
            showWhatsappBtn.classList.add('active');
        }
    };

    showRegistrationBtn.addEventListener('click', () => switchTab('registration'));
    showHistoryBtn.addEventListener('click', () => switchTab('history'));
    showWhatsappBtn.addEventListener('click', () => switchTab('whatsapp'));

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/employees');
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados dos funcionários.');
            }
            const employees = await response.json();
            
            employeeTableBody.innerHTML = '';
            employeesCardList.innerHTML = '';

            employees.forEach(employee => {
                const row = employeeTableBody.insertRow();
                row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${employee.position}</td>
                    <td>${employee.sector}</td> <td>${employee.email}</td>
                    <td>${employee.phone}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${employee.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" data-id="${employee.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;

                const card = document.createElement('div');
                card.classList.add('employee-card');
                card.innerHTML = `
                    <div class="card-item"><span class="card-label">Nome:</span> ${employee.name}</div>
                    <div class="card-item"><span class="card-label">Cargo:</span> ${employee.position}</div>
                    <div class="card-item"><span class="card-label">Setor:</span> ${employee.sector}</div> <div class="card-item"><span class="card-label">Email:</span> ${employee.email}</div>
                    <div class="card-item"><span class="card-label">Telefone:</span> ${employee.phone}</div>
                    <div class="card-actions">
                        <button class="edit-btn" data-id="${employee.id}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="delete-btn" data-id="${employee.id}">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                `;
                employeesCardList.appendChild(card);
            });

        } catch (error) {
            console.error('Erro de Conexão:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando.',
            });
        }
    };
    
    employeeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const sector = document.getElementById('sector').value; // NOVO CAMPO
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const newEmployee = { name, position, sector, email, phone }; // ADICIONADO NO OBJETO

        try {
            const response = await fetch('http://localhost:3000/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployee),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Funcionário cadastrado com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                });
                employeeForm.reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro de Cadastro',
                    text: result.error || 'Erro desconhecido ao cadastrar funcionário.',
                });
            }

        } catch (error) {
            console.error('Erro de Rede:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Rede',
                text: 'Houve um problema com a sua conexão.',
            });
        }
    });

    const deleteEmployee = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Tem certeza?',
                text: "Você não poderá reverter isso!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    Swal.fire( 'Excluído!', 'O funcionário foi excluído.', 'success' );
                    fetchEmployees();
                } else {
                    const errorData = await response.json();
                    Swal.fire( 'Erro!', `Não foi possível excluir: ${errorData.error}`, 'error' );
                }
            }
        } catch (error) {
            console.error('Erro de Exclusão:', error);
            Swal.fire( 'Erro!', 'Houve um problema com a sua conexão.', 'error' );
        }
    };
    
    const editEmployee = async (employee) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Funcionário',
            html: `
                <input id="swal-input-name" class="swal2-input" placeholder="Nome" value="${employee.name}">
                <input id="swal-input-position" class="swal2-input" placeholder="Cargo" value="${employee.position}">
                <input id="swal-input-sector" class="swal2-input" placeholder="Setor" value="${employee.sector}"> <input id="swal-input-email" class="swal2-input" placeholder="Email" value="${employee.email}">
                <input id="swal-input-phone" class="swal2-input" placeholder="Telefone" value="${employee.phone}">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById('swal-input-name').value,
                    position: document.getElementById('swal-input-position').value,
                    sector: document.getElementById('swal-input-sector').value, // NOVO CAMPO
                    email: document.getElementById('swal-input-email').value,
                    phone: document.getElementById('swal-input-phone').value
                }
            }
        });

        if (formValues) {
            try {
                const updatedEmployee = { ...employee, ...formValues };
                const response = await fetch(`http://localhost:3000/api/employees/${employee.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedEmployee),
                });
                
                if (response.ok) {
                    Swal.fire( 'Atualizado!', 'O funcionário foi atualizado com sucesso.', 'success' );
                    fetchEmployees();
                } else {
                    const errorData = await response.json();
                    Swal.fire( 'Erro!', `Não foi possível atualizar: ${errorData.error}`, 'error' );
                }
            } catch (error) {
                console.error('Erro de Edição:', error);
                Swal.fire( 'Erro!', 'Houve um problema com a sua conexão.', 'error' );
            }
        }
    };

    document.addEventListener('click', async (e) => {
        if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('button').dataset.id;
            deleteEmployee(id);
        }

        if (e.target.closest('.edit-btn')) {
            const id = e.target.closest('button').dataset.id;
            const response = await fetch(`http://localhost:3000/api/employees`);
            const employees = await response.json();
            const employeeToEdit = employees.find(emp => emp.id == id);
            
            if (employeeToEdit) {
                editEmployee(employeeToEdit);
            }
        }
    });

    whatsappForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('whatsapp-name').value;
        const id = document.getElementById('whatsapp-id').value;
        const docs = document.getElementById('whatsapp-docs').value;

        const message = `Olá, *${name}*!%0A%0AÉ a empresa Águas do Brasil. Para a sua matrícula *${id}*, precisamos que nos envie os seguintes documentos:%0A%0A*${docs}*%0A%0AFavor responder esta mensagem com os arquivos.`;
        
        const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
    });

    fetchEmployees();
});
