#!/bin/bash

# Get the directory where the script is located
script_dir=$(dirname "$0")

# Check if the directory exists
if [ -d "$script_dir/ServerData" ]; then
    # Change to the directory containing the Node.js application
    cd "$script_dir/ServerData"

    # Run the Node.js application
    node ./index.mjs ./config.json

    # Return to the previous working directory
    cd ../../
    echo ""
    echo "The application has stopped. Returned to the previous working directory."
else
    echo "Directory not found."
    read -p "Press Enter to continue..."
fi