@echo off
title AUTENTICACAO FIGMA - SEIA PLATAFORMA (INEMA)
color 0A
echo ===============================================================
echo   AUTENTICACAO FIGMA - PROTOTIPO CLIENTE SEIA PLATAFORMA
echo ===============================================================
echo.
echo 1. O Google Chrome vai abrir na sua tela diretamente no prototipo.
echo 2. Faca o login normalmente com sua conta Figma da Acto.
echo 3. Aguarde o carregamento completo do arquivo no canvas.
echo 4. Volte no chat e envie "OK, logado" para iniciarmos a extracao.
echo.
echo Link: https://www.figma.com/design/P1fGiOC8rswWDiadWdMORL/Seia-Plataforma?node-id=3-5^&t=PkRuOSVLMm5ZtGwL-1
echo ===============================================================
echo.

set "PROFILE_DIR=%~dp0.figma_chrome_profile"
set "CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "FIGMA_URL=https://www.figma.com/design/P1fGiOC8rswWDiadWdMORL/Seia-Plataforma?node-id=3-5&t=PkRuOSVLMm5ZtGwL-1"

if not exist "%CHROME_BIN%" (
    set "CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

start "" "%CHROME_BIN%" --remote-debugging-port=9222 --user-data-dir="%PROFILE_DIR%" --no-first-run --no-default-browser-check "%FIGMA_URL%"

echo Chrome iniciado com sucesso!
echo.
echo Quando concluir o login e o arquivo estiver visivel,
echo apenas volte aqui no chat e envie: "OK, logado"
echo.
pause
