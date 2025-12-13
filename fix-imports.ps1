# Script para corregir imports de servicios en Swapi
# Ejecutar desde la carpeta raíz del proyecto swapi

Write-Host "🔧 Corrigiendo imports de servicios..." -ForegroundColor Cyan

# Función para reemplazar en archivo
function Fix-Imports {
    param($filePath)
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Corregir imports de servicios (quitar .service)
        $content = $content -replace "from '../../services/auth\.service'", "from '../../services/auth'"
        $content = $content -replace "from '../../services/chat\.service'", "from '../../services/chat'"
        $content = $content -replace "from '../../services/publications\.service'", "from '../../services/publications'"
        $content = $content -replace "from '../../services/storage\.service'", "from '../../services/storage'"
        
        # Corregir import del guard
        $content = $content -replace "from '\./guards/auth\.guard'", "from './guards/auth.guard'"
        
        Set-Content $filePath $content -NoNewline
        Write-Host "  ✅ Corregido: $filePath" -ForegroundColor Green
    }
}

# Corregir app.routes.ts
Fix-Imports "src/app/app.routes.ts"

# Corregir todas las páginas
$pages = @(
    "src/app/pages/login/login.page.ts",
    "src/app/pages/register/register.page.ts",
    "src/app/pages/tabs/tabs.page.ts",
    "src/app/pages/dashboard/dashboard.page.ts",
    "src/app/pages/publicaciones/publicaciones.page.ts",
    "src/app/pages/buscador/buscador.page.ts",
    "src/app/pages/publicar/publicar.page.ts",
    "src/app/pages/chat/chat.page.ts",
    "src/app/pages/chat-conversation/chat-conversation.page.ts"
)

foreach ($page in $pages) {
    Fix-Imports $page
}

Write-Host ""
Write-Host "✨ ¡Imports corregidos exitosamente!" -ForegroundColor Green
Write-Host "Ahora ejecuta: ionic serve" -ForegroundColor Yellow
