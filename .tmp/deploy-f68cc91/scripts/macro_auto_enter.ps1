param(
    [int]$IntervaloSegundos = 5
)

$Host.UI.RawUI.WindowTitle = "MACRO AUTO-ENTER: Antigravity (Pressione Ctrl+C para parar)"

Clear-Host
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "         MACRO AUTO-ENTER PARA O ANTIGRAVITY                " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " [i] Intervalo: a cada $IntervaloSegundos segundos" -ForegroundColor White
Write-Host " [i] Janela alvo: Antigravity" -ForegroundColor White
Write-Host ""
Write-Host " [!] QUANDO FOR SAIR DO PC:" -ForegroundColor Green
Write-Host "     1. Deixe o Antigravity aberto na tela." -ForegroundColor Gray
Write-Host "     2. Deixe esta janela de macro rodando." -ForegroundColor Gray
Write-Host "     3. Ele vai focar o Antigravity e pressionar ENTER" -ForegroundColor Gray
Write-Host "        automaticamente sempre que houver confirmacao pendente!" -ForegroundColor Gray
Write-Host ""
Write-Host " [x] Para encerrar o macro a qualquer momento: pressione Ctrl + C" -ForegroundColor Red
Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

$wshell = New-Object -ComObject WScript.Shell
$contador = 0

while ($true) {
    # Tenta ativar pelo nome da janela ou pelos processos do Antigravity
    $ativou = $false
    
    # 1. Tentar por título 'Antigravity'
    $ativou = $wshell.AppActivate("Antigravity")
    
    # 2. Se não encontrou por título, tentar pelos PIDs dos processos Antigravity
    if (-not $ativou) {
        $procs = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
        foreach ($proc in $procs) {
            if ($wshell.AppActivate($proc.Id)) {
                $ativou = $true
                break
            }
        }
    }

    $hora = Get-Date -Format "HH:mm:ss"

    if ($ativou) {
        $contador++
        # Pequena pausa para a janela receber o foco
        Start-Sleep -Milliseconds 300
        # Envia o ENTER
        $wshell.SendKeys("{ENTER}")
        Write-Host "[$hora] [OK] ENTER enviado para o Antigravity! (Tentativa #$contador)" -ForegroundColor Green
    } else {
        Write-Host "[$hora] [..] Antigravity nao detectado ou minimizado. Tentando novamente em ${IntervaloSegundos}s..." -ForegroundColor Yellow
    }

    Start-Sleep -Seconds $IntervaloSegundos
}
