@echo off
title MACRO AUTO-ENTER ANTIGRAVITY
cd /d "%~dp0"

echo ============================================================
echo         MACRO AUTO-ENTER PARA O ANTIGRAVITY
echo ============================================================
echo.
echo  Este macro aperta ENTER automaticamente no Antigravity
echo  para aprovar tarefas pendentes quando voce estiver ausente.
echo.
set /p intervalo="Digite o intervalo em segundos [Pressione ENTER para 5s]: "
if "%intervalo%"=="" set intervalo=5

echo.
echo Iniciando macro com intervalo de %intervalo% segundos...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\macro_auto_enter.ps1" -IntervaloSegundos %intervalo%

pause
