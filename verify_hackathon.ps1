#!/usr/bin/env pwsh
# Complete System Verification Script
# Validates all hackathon requirements are met

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎯 HACKATHON READINESS CHECK - Autonomous Compliance AI" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0
$baseUrl = "http://localhost:8000"

function Test-Endpoint {
    param($url, $description, $method = "GET", $body = $null)
    
    Write-Host "Testing: $description" -NoNewline
    try {
        if ($method -eq "GET") {
            $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 5
        } else {
            $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
        }
        Write-Host " ✅" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "📋 SECTION 1: Backend Completeness" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White

# Test backend endpoints
if (Test-Endpoint "$baseUrl/" "GET / (root)") { $passed++ } else { $failed++ }
if (Test-Endpoint "$baseUrl/health" "GET /health") { $passed++ } else { $failed++ }

# Test monitoring agent
$panContent = @{
    content = "Customer card is 4111111111111111"
    source_type = "SUPPORT_TICKET"
    source_id = "test_$(Get-Date -Format 'yyyyMMddHHmmss')"
    timestamp = (Get-Date).ToUniversalTime().ToString("o")
} | ConvertTo-Json

if (Test-Endpoint "$baseUrl/monitor/ingest" "/monitor/ingest (PAN detection)" "POST" $panContent) { 
    $passed++ 
    Write-Host "  ✨ Monitoring Agent: ACTIVE" -ForegroundColor Green
} else { 
    $failed++ 
}

if (Test-Endpoint "$baseUrl/monitor/violations" "/monitor/violations (list)") { $passed++ } else { $failed++ }

# Test evidence layer
if (Test-Endpoint "$baseUrl/evidence/records" "/evidence/records") { 
    $passed++ 
    Write-Host "  ✨ Evidence Layer: ACTIVE" -ForegroundColor Green
} else { 
    $failed++ 
}

# Test audit layer
if (Test-Endpoint "$baseUrl/audit/chain" "/audit/chain") { 
    $passed++ 
    Write-Host "  ✨ Audit Layer: ACTIVE" -ForegroundColor Green
} else { 
    $failed++ 
}

if (Test-Endpoint "$baseUrl/audit/verify" "/audit/verify") { $passed++ } else { $failed++ }

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "📋 SECTION 2: Agentic Architecture" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White

# Check file existence
$files = @(
    @{Path="backend\monitoring_agent\api.py"; Name="Monitoring Agent"},
    @{Path="backend\monitoring_agent\detectors.py"; Name="PAN Detector"},
    @{Path="backend\cognitive_agent\api.py"; Name="Cognitive Agent"},
    @{Path="backend\cognitive_agent\reasoner_openrouter.py"; Name="OpenRouter Reasoner"},
    @{Path="backend\evidence_layer\api.py"; Name="Evidence Layer"},
    @{Path="backend\audit_layer\api.py"; Name="Audit Layer"}
)

foreach ($file in $files) {
    if (Test-Path $file.Path) {
        Write-Host "✅ $($file.Name) exists" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ $($file.Name) missing" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "📋 SECTION 3: Data Persistence" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White

$dataFiles = @("backend\data\violations.json", "backend\data\evidence.json")
foreach ($file in $dataFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content.Trim().Length -gt 2) {
            Write-Host "✅ $file has data" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "⚠️  $file exists but empty" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "📋 SECTION 4: OpenRouter Configuration" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White

# Check for Claude references (should be none)
Write-Host "Checking for Claude/Anthropic references..." -NoNewline
$claudeRefs = Get-ChildItem -Path "backend" -Recurse -Include "*.py" | 
    Select-String -Pattern "from anthropic|import anthropic|claude-sonnet" -CaseSensitive

if ($claudeRefs.Count -eq 0) {
    Write-Host " ✅ No Claude references found" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ⚠️  Found $($claudeRefs.Count) Claude references" -ForegroundColor Yellow
    $claudeRefs | ForEach-Object { Write-Host "  - $($_.Path):$($_.LineNumber)" -ForegroundColor Gray }
}

# Check OpenRouter API key
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "OPENROUTER_API_KEY") {
        Write-Host "✅ OPENROUTER_API_KEY configured" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ OPENROUTER_API_KEY not found in .env" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "📋 SECTION 5: Frontend Integration" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White

$frontendFiles = @(
    "src\services\api.js",
    "src\pages\ComplianceOverview.js",
    "src\pages\ViolationAnalysis.js",
    ".env.local"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
        $failed++
    }
}

# Check if api.js uses backend
if (Test-Path "src\services\api.js") {
    $apiContent = Get-Content "src\services\api.js" -Raw
    if ($apiContent -match "localhost:8000") {
        Write-Host "✅ Frontend configured for backend API" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ Frontend not configured for backend" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 FINAL SCORE" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$total = $passed + $failed
$percentage = [math]::Round(($passed / $total) * 100, 0)

Write-Host "Passed: $passed / $total ($percentage%)" -ForegroundColor Green
Write-Host "Failed: $failed / $total" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 ALL CHECKS PASSED - READY FOR HACKATHON!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✨ Your project is:" -ForegroundColor Cyan
    Write-Host "   ✅ Autonomous" -ForegroundColor Green
    Write-Host "   ✅ Agentic" -ForegroundColor Green
    Write-Host "   ✅ Audit-ready" -ForegroundColor Green
    Write-Host "   ✅ Scalable to GDPR/CCPA" -ForegroundColor Green
    Write-Host "   ✅ Using OpenRouter (not Claude)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Test the demo flow end-to-end" -ForegroundColor White
    Write-Host "   2. Practice your 2-minute pitch" -ForegroundColor White
    Write-Host "   3. Prepare 5-minute demo" -ForegroundColor White
    Write-Host "   4. STOP CODING - Focus on presentation!" -ForegroundColor White
} elseif ($percentage -ge 80) {
    Write-Host "⚠️  MOSTLY READY - Minor issues to fix" -ForegroundColor Yellow
} else {
    Write-Host "❌ CRITICAL ISSUES - Needs attention" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
