$files = Get-ChildItem "c:\Users\negih\Computer_Science\Backend_Sriniously\*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($content -match 'LONGFORM_APPENDIX_START') {
        # Remove everything between LONGFORM_APPENDIX_START and LONGFORM_APPENDIX_END (inclusive of the section and comments)
        $pattern = '(?s)\s*<!-- LONGFORM_APPENDIX_START -->.*?<!-- LONGFORM_APPENDIX_END -->'
        $cleaned = $content -replace $pattern, ''
        Set-Content -Path $file.FullName -Value $cleaned -Encoding UTF8 -NoNewline
        Write-Output "STRIPPED: $($file.Name)"
    }
}
Write-Output "Done."
