param(
  [int]$Port = 5173,
  [string]$Root = $PSScriptRoot
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving '$Root' at http://localhost:$Port/component-playground.html"
Write-Host "Press Ctrl+C to stop."

$mimeMap = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".mjs"  = "text/javascript; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".ico"  = "image/x-icon"
  ".map"  = "application/json; charset=utf-8"
}

while ($listener.IsListening) {
  $context = $null
  try {
    $context = $listener.GetContext()
  } catch {
    break
  }
  $request = $context.Request
  $response = $context.Response
  try {
    $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
    if ($urlPath -eq "/") { $urlPath = "/component-playground.html" }
    $relative = $urlPath.TrimStart("/") -replace "/", [System.IO.Path]::DirectorySeparatorChar
    $filePath = Join-Path $Root $relative
    $fullRoot = (Resolve-Path $Root).Path
    $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")

    if ((Test-Path $filePath -PathType Leaf) -and ((Resolve-Path $filePath).Path.StartsWith($fullRoot))) {
      $item = Get-Item $filePath
      $ext = $item.Extension.ToLower()
      $contentType = $mimeMap[$ext]
      if (-not $contentType) { $contentType = "application/octet-stream" }
      $response.ContentType = $contentType
      $response.Headers.Add("Last-Modified", $item.LastWriteTimeUtc.ToString("R"))

      if ($request.HttpMethod -eq "HEAD") {
        $response.ContentLength64 = $item.Length
      } else {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
      $response.ContentType = "text/plain; charset=utf-8"
      $response.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    try {
      $response.StatusCode = 500
      $msg = [System.Text.Encoding]::UTF8.GetBytes("500: $($_.Exception.Message)")
      $response.OutputStream.Write($msg, 0, $msg.Length)
    } catch {}
  } finally {
    $response.OutputStream.Close()
  }
}
