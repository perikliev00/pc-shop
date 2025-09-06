# PowerShell script to populate PC Shop sections with images
Write-Host "PC Shop Section Population Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running (optional check)
Write-Host "Note: Make sure MongoDB is running on localhost:27017" -ForegroundColor Yellow
Write-Host "If using a different MongoDB connection, update the script accordingly." -ForegroundColor Yellow

Write-Host "`nStarting section population..." -ForegroundColor Cyan

# Run the populate script
try {
    node scripts/populate-sections.js
    Write-Host "`nSection population completed successfully!" -ForegroundColor Green
    Write-Host "You can now start your application and view the new section images." -ForegroundColor Green
} catch {
    Write-Host "`nError running populate script:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
