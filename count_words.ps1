$files = @(
    "17_logging_observability.html",
    "18_graceful_shutdown.html", 
    "19_backend_security_injection.html",
    "20_backend_security_mitigation.html",
    "21_performance_measurement.html",
    "22_database_caching_scaling.html",
    "23_stateless_load_balancing.html",
    "24_cdns_queues_serverless.html",
    "25_concurrency_parallelism_io.html"
)

foreach ($f in $files) {
    $path = "c:\Users\negih\Computer_Science\Backend_Sriniously\$f"
    $content = Get-Content $path -Raw
    # Strip HTML tags to get text content
    $text = $content -replace '<[^>]+>', ' ' -replace '&[a-z]+;', ' ' -replace '\s+', ' '
    $words = ($text.Trim() -split '\s+').Count
    Write-Output "$f : $words words"
}
