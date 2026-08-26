
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open('D:\\Projects\\CongTy\\gitproject\\Smart-TechRepair-Hub\\scratch\\docx_gen\\test_chap4.docx')
    Write-Host "PASS: chap4"
    $doc.Close()
} catch {
    Write-Host "FAIL: chap4 - $($_.Exception.Message)"
} finally {
    $word.Quit()
}
