# Change all toggle button icons to use three horizontal lines (---)
$files = Get-ChildItem "public/views" -Filter "*.html" | Select-Object -ExpandProperty FullName

Write-Host "Found $($files.Count) HTML files to update..."

foreach ($file in $files) {
    Write-Host "Changing toggle icon to three lines in $file..."
    
    # Read file content
    $content = Get-Content $file -Raw
    
    # Replace hamburger menu icon with three horizontal lines
    $content = $content -replace '☰', '☰'
    
    # Write updated content back to file
    Set-Content $file $content -Encoding UTF8
    Write-Host "Changed toggle icon in $file successfully"
}

Write-Host "All toggle button icons changed to three lines across all pages!"
