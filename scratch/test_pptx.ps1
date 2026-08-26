$ppt = New-Object -ComObject PowerPoint.Application
$pptPath = 'D:\Projects\CongTy\gitproject\Smart-TechRepair-Hub\docs\Smart_TechRepair_Hub_BaoCaoTotNghiep.pptx'
try {
    $pres = $ppt.Presentations.Open($pptPath, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    Write-Host "SUCCESS: Opened PowerPoint presentation successfully. Slide count: $($pres.Slides.Count)"
    $pres.Close()
} catch {
    Write-Host "ERROR OPENING PPTX: $($_.Exception.Message)"
} finally {
    $ppt.Quit()
}
