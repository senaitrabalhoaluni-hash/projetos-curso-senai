<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'escola_verde';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha na conexão: " . $conn->connect_error]);
    exit();
}

$sql = "SELECT 
            t.id,
            t.nome_turma,
            t.periodo,
            COALESCE(SUM(r.pontos), 0) AS total_pontos
        FROM turma t
        LEFT JOIN registro_acao r ON t.id = r.turma_id
        GROUP BY t.id, t.nome_turma, t.periodo
        ORDER BY total_pontos DESC";

$result = $conn->query($sql);

$ranking = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ranking[] = [
            "id" => (int)$row['id'],
            "nome_turma" => $row['nome_turma'],
            "periodo" => $row['periodo'],
            "total_pontos" => (int)$row['total_pontos']
        ];
    }
}

echo json_encode($ranking, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

$conn->close();
?>