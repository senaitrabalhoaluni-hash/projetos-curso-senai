<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$db   = 'saep_db';
$user = 'root';
$pass = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

// --- MÓDULO 4: CLIENTES ---
if ($action === 'listar_clientes') {
    $busca = $_GET['busca'] ?? '';
    $stmt = $pdo->prepare("SELECT id, nome, telefone FROM clientes WHERE nome LIKE :busca ORDER BY id DESC");
    $stmt->execute(['busca' => "%$busca%"]);
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    exit;
}

if ($action === 'salvar_cliente') {
    $data = json_decode(file_get_contents('php://input'), true);
    $cpf_cripto = hash('sha256', $data['cpf'] ?? '');
    
    $stmt = $pdo->prepare("INSERT INTO clientes (nome, cpf, telefone) VALUES (:nome, :cpf, :telefone)");
    $stmt->execute([
        'nome' => $data['nome'],
        'cpf' => $cpf_cripto,
        'telefone' => $data['telefone']
    ]);
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'excluir_cliente') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("DELETE FROM clientes WHERE id = :id");
    $stmt->execute(['id' => $id]);
    echo json_encode(['success' => true]);
    exit;
}

// --- MÓDULO 5: VEÍCULOS ---
if ($action === 'listar_veiculos') {
    $stmt = $pdo->query("
        SELECT v.id, v.placa, v.modelo, v.cor, c.nome AS cliente_nome 
        FROM vehiculos v 
        JOIN clientes c ON v.cliente_id = c.id 
        ORDER BY v.id DESC
    ");
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    exit;
}

if ($action === 'salvar_veiculo') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO vehiculos (placa, modelo, cor, cliente_id) VALUES (:placa, :modelo, :cor, :cliente_id)");
    $stmt->execute([
        'placa' => $data['placa'],
        'modelo' => $data['modelo'],
        'cor' => $data['cor'],
        'cliente_id' => $data['cliente_id']
    ]);
    echo json_encode(['success' => true]);
    exit;
}

// --- MÓDULO 6: TRANSAÇÕES / EVENTOS ---
if ($action === 'listar_transacoes') {
    $stmt = $pdo->query("
        SELECT t.id, t.data_entrada, t.data_saida, t.status, t.valor,
               c.nome AS cliente_nome, v.modelo, v.placa
        FROM transacoes t
        JOIN clientes c ON t.cliente_id = c.id
        JOIN vehiculos v ON t.veiculo_id = v.id
        ORDER BY t.data_entrada DESC
    ");
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    exit;
}

if ($action === 'atualizar_status_transacao') {
    $data = json_decode(file_get_contents('php://input'), true);
    $data_saida = ($data['status'] === 'Concluído') ? date('Y-m-d H:i:s') : null;
    
    $stmt = $pdo->prepare("UPDATE transacoes SET status = :status, valor = :valor, data_saida = :data_saida WHERE id = :id");
    $stmt->execute([
        'status' => $data['status'],
        'valor' => $data['valor'],
        'data_saida' => $data_saida,
        'id' => $data['id']
    ]);
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Ação inválida']);