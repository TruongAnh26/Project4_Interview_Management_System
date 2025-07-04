package fa.training.HN24_CPL_JAVA_01_G3.controller;

import fa.training.HN24_CPL_JAVA_01_G3.service.exportfile.ExportFileService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.OffsetDateTime;

@RestController
@RequestMapping("api/v1/export")
@AllArgsConstructor
@CrossOrigin
public class ExportController {
    private ExportFileService exportFileService;

    @Operation(summary = "export file excel")
    @PostMapping("/export-offer")
    public void exportDataToExcel(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startDate,
                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime endDate,
                                  @RequestParam String filePath) throws IOException {
        exportFileService.exportExcel(startDate, endDate, filePath);
    }

}
