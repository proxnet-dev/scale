@echo off

rem Get the directory where the batch script is located
set "script_dir=%~dp0"

rem Check if the directory exists
if exist "%script_dir%\ServerData" (
    rem Change to the directory containing the Node.js application
    cd "%script_dir%\ServerData"
    
    rem Run the Node.js application
    node ./index.mjs ./config.json
    rem Return to terminal after the program stops
    cd ../../
    echo.
    echo The application has stopped. Returned to previous working directory.
    @echo on
    exit
) else (
    echo Directory not found.
    pause
)