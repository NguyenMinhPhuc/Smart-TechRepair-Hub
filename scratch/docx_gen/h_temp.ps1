
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open('D:\\Projects\\CongTy\\gitproject\\Smart-TechRepair-Hub\\scratch\\docx_gen\\h_test_callout.docx')
    Write-Host "PASS: callout"
    $doc.Close()
} catch {
    Write-Host "FAIL: callout - $($_.Exception.Message)"
} finally {
    $word.Quit()
}
