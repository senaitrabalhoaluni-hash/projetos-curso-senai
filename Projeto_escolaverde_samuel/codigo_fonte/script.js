let dadosTurmas = [];
let historicoAcoes = [
  { turma: '3º Ano A - Médio', descricao: 'Reciclagem de lâmpadas e óleo usado', pontos: 50 },
  { turma: '1º Ano A - Médio', descricao: 'Arrecadação de 50 garrafas PET', pontos: 40 },
  { turma: '6º Ano A - Fund. II', descricao: 'Descarte correto de 30 pilhas e baterias', pontos: 25 },
  { turma: '6º Ano A - Fund. II', descricao: 'Coleta de 15kg de papelão', pontos: 20 }
];

let meuGrafico = null;
let estaAutenticado = false;

const API_URL = 'http://localhost:8080/escola_verde/api.php';

async function carregarDados() {
  try {
    const resposta = await fetch(API_URL);
    dadosTurmas = await resposta.json();

    dadosTurmas.sort((a, b) => b.total_pontos - a.total_pontos);

    renderizarTabela(dadosTurmas);
    atualizarCards(dadosTurmas);
    preencherSelectTurmas(dadosTurmas);
    renderizarGrafico(dadosTurmas);
    renderizarHistorico();
  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
  }
}

function renderizarTabela(turmas) {
  const corpo = document.getElementById('corpoTabela');
  corpo.innerHTML = '';

  turmas.forEach((item, index) => {
    let medalha = '';
    if (index === 0) medalha = '🥇 ';
    else if (index === 1) medalha = '🥈 ';
    else if (index === 2) medalha = '🥉 ';

    corpo.innerHTML += `
      <tr>
        <td><strong>${medalha}#${index + 1}</strong></td>
        <td><strong>${item.nome_turma}</strong></td>
        <td>${item.periodo}</td>
        <td><strong>${item.total_pontos} pts</strong></td>
      </tr>
    `;
  });
}

function atualizarCards(turmas) {
  if (turmas.length > 0) {
    document.getElementById('turmaLider').innerText = turmas[0].nome_turma;
    document.getElementById('liderPontos').innerText = turmas[0].total_pontos + ' pts acumulados';
    const totalGeral = turmas.reduce((acc, t) => acc + parseInt(t.total_pontos), 0);
    document.getElementById('totalPontosGeral').innerText = totalGeral + ' pts';
    document.getElementById('totalTurmas').innerText = turmas.length;
  }
}

function renderizarHistorico() {
  const container = document.getElementById('listaHistorico');
  container.innerHTML = '';

  historicoAcoes.forEach(item => {
    container.innerHTML += `
      <div class="history-item">
        <div class="info">
          <h4>${item.turma}</h4>
          <p>${item.descricao}</p>
        </div>
        <span class="badge-pts">+${item.pontos} pts</span>
      </div>
    `;
  });
}

function preencherSelectTurmas(turmas) {
  const select = document.getElementById('selectTurma');
  select.innerHTML = '<option value="">Selecione...</option>';
  turmas.forEach(t => {
    select.innerHTML += `<option value="${t.id}">${t.nome_turma}</option>`;
  });
}

function filtrarTurmas() {
  const termo = document.getElementById('searchInput').value.toLowerCase();
  
  // Filtra tanto na tabela de turmas quanto no histórico
  const turmasFiltradas = dadosTurmas.filter(t => 
    t.nome_turma.toLowerCase().includes(termo) || 
    t.periodo.toLowerCase().includes(termo)
  );
  renderizarTabela(turmasFiltradas);

  const container = document.getElementById('listaHistorico');
  const historicoFiltrado = historicoAcoes.filter(h => 
    h.turma.toLowerCase().includes(termo) || 
    h.descricao.toLowerCase().includes(termo)
  );

  container.innerHTML = '';
  historicoFiltrado.forEach(item => {
    container.innerHTML += `
      <div class="history-item">
        <div class="info">
          <h4>${item.turma}</h4>
          <p>${item.descricao}</p>
        </div>
        <span class="badge-pts">+${item.pontos} pts</span>
      </div>
    `;
  });
}

function renderizarGrafico(turmas) {
  const ctx = document.getElementById('graficoPontos').getContext('2d');
  
  if (meuGrafico) meuGrafico.destroy();

  const topTurmas = turmas.slice(0, 6); // Pega as top 6 para o gráfico não poluir
  const nomes = topTurmas.map(t => t.nome_turma);
  const pontos = topTurmas.map(t => t.total_pontos);

  meuGrafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nomes,
      datasets: [{
        label: 'Pontuação',
        data: pontos,
        backgroundColor: '#22c55e',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

// Lógica de Autenticação / Login
function abrirModalOuSair() {
  if (estaAutenticado) {
    estaAutenticado = false;
    document.getElementById('painelCoordenador').classList.add('hidden');
    document.getElementById('btnAuthToggle').innerText = 'Área do Coordenador 🔒';
  } else {
    document.getElementById('modalLogin').classList.remove('hidden');
  }
}

function fecharModal() {
  document.getElementById('modalLogin').classList.add('hidden');
}

function fazerLogin(e) {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value;
  const senha = document.getElementById('senhaLogin').value;

  if (email === 'admin@escola.com' && senha === '123456') {
    estaAutenticado = true;
    fecharModal();
    document.getElementById('painelCoordenador').classList.remove('hidden');
    document.getElementById('btnAuthToggle').innerText = 'Sair da Conta 🔓';
    alert('Acesso concedido! O painel de lançamentos está disponível no final da página.');
  } else {
    alert('Email ou senha incorretos! Tente admin@escola.com e senha 123456');
  }
}

function adicionarAcao(event) {
  event.preventDefault();
  const idTurma = document.getElementById('selectTurma').value;
  const pontos = parseInt(document.getElementById('qtdPontos').value);
  const descricao = document.getElementById('descricaoAcao').value;

  const turma = dadosTurmas.find(t => t.id == idTurma);
  if (turma) {
    turma.total_pontos = parseInt(turma.total_pontos) + pontos;
    
    // Adiciona ao histórico de reciclagens
    historicoAcoes.unshift({
      turma: turma.nome_turma,
      descricao: descricao,
      pontos: pontos
    });

    dadosTurmas.sort((a, b) => b.total_pontos - a.total_pontos);
    
    renderizarTabela(dadosTurmas);
    atualizarCards(dadosTurmas);
    renderizarGrafico(dadosTurmas);
    renderizarHistorico();

    alert(`Sucesso! Lançamento registrado para ${turma.nome_turma}.`);
    document.getElementById('formPontos').reset();
  }
}

carregarDados();