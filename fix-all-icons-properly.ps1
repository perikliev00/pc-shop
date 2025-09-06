# Fix ALL toggle button icons properly across all HTML files
$files = Get-ChildItem "public/views" -Filter "*.html" | Select-Object -ExpandProperty FullName

Write-Host "Found $($files.Count) HTML files to update..."

foreach ($file in $files) {
    Write-Host "Fixing toggle icon in $file..."
    
    # Read file content
    $content = Get-Content $file -Raw
    
    # Replace the broken toggle button icon with hamburger menu
    # Using multiple approaches to catch all variations
    $content = $content -replace 'в°', '☰'
    $content = $content -replace 'в°', '☰'
    $content = $content -replace 'в°', '☰'
    
    # Also try to replace the entire button line if needed
    $content = $content -replace '<button class="nav-toggle" id="mobile-nav-toggle">в°</button>', '<button class="nav-toggle" id="mobile-nav-toggle">☰</button>'
    
    # Write updated content back to file
    Set-Content $file $content -Encoding UTF8
    Write-Host "Fixed toggle icon in $file successfully"
}

Write-Host "All toggle button icons fixed across all pages!"
