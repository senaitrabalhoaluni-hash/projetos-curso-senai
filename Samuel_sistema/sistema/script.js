document.addEventListener('DOMContentLoaded', () => {
    // Carrega a listagem de clientes automaticamente
    carregarClientes();

    // Evento de Inclusão de Cliente
    document.getElementById('form-cliente').addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch('api.php?action=salvar_cliente', {
            method: 'POST',
            body: JSON.stringify({
                nome: document.getElementById('cli-nome').value,
                cpf: document.getElementById('cli-cpf').value,
                telefone: document.getElementById('cli-tel').value
            })
        });
        e.target.reset();
        carregarClientes();
    });

    // Evento de Inclusão de Veículo
    document.getElementById('form-veiculo').addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch('api.php?action=salvar_veiculo', {
            method: 'POST',
            body: JSON.stringify({
                placa: document.getElementById('vei-placa').value,
                modelo: document.getElementById('vei-modelo').value,
                cor: document.getElementById('vei-cor').value,
                cliente_id: document.getElementById('vei-cliente').value
            })
        });
        e.target.reset();
        carregarVeiculos();
    });
});

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tab}`).style.display = 'block';
    document.getElementById(`btn-tab-${tab}`).classList.add('active');

    if (tab === 'clientes') carregarClientes();
    if (tab === 'veiculos') carregarVeiculos();
    if (tab === 'transacoes') carregarTransacoes();
}

async function carregarClientes() {
    const busca = document.getElementById('busca-cliente').value;
    const res = await fetch(`api.php?action=listar_clientes&busca=${busca}`);
    const result = await res.json();
    
    const tbody = document.getElementById('tbl-clientes');
    const selectVeiculo = document.getElementById('vei-cliente');
    tbody.innerHTML = '';
    selectVeiculo.innerHTML = '<option value="">Vincular a um Cliente (Dono)...</option>';

    if (result.data) {
        result.data.forEach(c => {
            tbody.innerHTML += `<tr>
                <td>${c.id}</td>
                <td><strong>${c.nome}</strong></td>
                <td>${c.telefone}</td>
                <td><button onclick="excluirCliente(${c.id})" class="btn-danger">Excluir</button></td>
            </tr>`;
            selectVeiculo.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });
    }
}

async function excluirCliente(id) {
    if (confirm('Tem certeza que deseja remover este cliente?')) {
        await fetch(`api.php?action=excluir_cliente&id=${id}`);
        carregarClientes();
    }
}

async function carregarVeiculos() {
    const res = await fetch('api.php?action=listar_veiculos');
    const result = await res.json();
    const tbody = document.getElementById('tbl-veiculos');
    tbody.innerHTML = '';

    if (result.data) {
        result.data.forEach(v => {
            tbody.innerHTML += `<tr>
                <td>${v.id}</td>
                <td><strong>${v.placa}</strong></td>
                <td>${v.modelo}</td>
                <td>${v.cor}</td>
                <td>${v.cliente_nome}</td>
            </tr>`;
        });
    }
}

async function carregarTransacoes() {
    const res = await fetch('api.php?action=listar_transacoes');
    const result = await res.json();
    const tbody = document.getElementById('tbl-transacoes');
    tbody.innerHTML = '';

    if (result.data) {
        result.data.forEach(t => {
            const isAberto = t.status === 'Em Aberto';
            const badgeClass = isAberto ? 'badge-open' : 'badge-closed';

            tbody.innerHTML += `<tr>
                <td>${t.data_entrada}</td>
                <td><strong>${t.cliente_nome}</strong></td>
                <td>${t.modelo} (${t.placa})</td>
                <td><span class="badge ${badgeClass}">${t.status}</span></td>
                <td>R$ ${parseFloat(t.valor).toFixed(2)}</td>
                <td>
                    ${isAberto ? `<button onclick="finalizarTransacao(${t.id})" class="btn-success">Concluir Saída</button>` : '---'}
                </td>
            </tr>`;
        });
    }
}

async function finalizarTransacao(id) {
    const valor = prompt("Digite o valor total da permanência (R$):", "15.00");
    if (valor !== null) {
        await fetch('api.php?action=atualizar_status_transacao', {
            method: 'POST',
            body: JSON.stringify({ id: id, status: 'Concluído', valor: valor })
        });
        carregarTransacoes();
    }
}