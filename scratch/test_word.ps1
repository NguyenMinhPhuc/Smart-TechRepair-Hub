$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = 'D:\Projects\CongTy\gitproject\Smart-TechRepair-Hub\docs\Smart_TechRepair_Hub_BaoCaoPhanTichHeThong.docx'
try {
    $doc = $word.Documents.Open($docPath)
    Write-Host "SUCCESS: Opened document successfully."
    $doc.Close()
} catch {
    Write-Host "ERROR OPENING DOC: $($_.Exception.Message)"
} finally {
    $word.Quit()
}
