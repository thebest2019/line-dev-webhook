param (
    [string]$env = "development"
)

# Set the environment file based on the parameter
$envFile = ".env.$env"

# Check if the environment file exists
if (-Not (Test-Path $envFile)) {
    Write-Host "Environment file $envFile does not exist."
    exit 1
}

# Set the environment variables
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^=]+)=(.*)\s*$') {
        $varName = $matches[1]
        $varValue = $matches[2]
        [Environment]::SetEnvironmentVariable($varName, $varValue)
    }
}

# Define the PM2 process name based on the environment
$processName = "line-message-$env"

# Check if the process is already running
$existingProcess = pm2 list | Select-String -Pattern $processName

if ($existingProcess) {
    Write-Host "Stopping and deleting existing PM2 process: $processName"
    pm2 stop $processName
    pm2 delete $processName
}

# Run the server using PM2
Write-Host "Starting server in $env mode using PM2 with process name: $processName"
pm2 start server.js --name $processName --env $env

Write-Host "Server is running in $env mode using PM2."