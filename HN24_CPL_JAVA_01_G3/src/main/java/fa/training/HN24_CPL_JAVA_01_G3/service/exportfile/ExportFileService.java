package fa.training.HN24_CPL_JAVA_01_G3.service.exportfile;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferExportRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.DetailScheduleResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.offer.OfferRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.schedule.ScheduleRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.OfferMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.apache.poi.ss.util.CellUtil.createCell;

@Service
@AllArgsConstructor
@Slf4j
public class ExportFileService {

    private final OfferRepository offerRepository;
    private final CustomRepository customRepository;
    private OfferMapper offerMapper;

    @Transactional(readOnly = true)
    public void exportExcel(OffsetDateTime startDate, OffsetDateTime endDate, String filePath) throws IOException {
        List<OfferEntity> offerEntities = offerRepository.findAllBetweenDates(startDate,endDate);
        if(offerEntities.isEmpty()) throw  new RuntimeException(CodeAndMessage.ERR1);
        Workbook workbook = new XSSFWorkbook();

        List<OfferDetailResponse> offerDetailResponses = offerEntities.stream().map(
                this::getOfferToExportFile
        ).collect(Collectors.toList());

        Sheet sheet = workbook.createSheet("OfferReport"); // name sheet
         // set chieu rong cho cot
        for (int i = 0; i <= 12; i++) {
            sheet.setColumnWidth(i, 6000);
        }
        Row header = sheet.createRow(0);// tao 1 hàng mới ( empty row begin row 0)

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());// set color background
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND); // set style background is solid

        XSSFFont font = ((XSSFWorkbook) workbook).createFont(); // create new font to set up new font
        font.setFontName("Arial"); // set font
        font.setFontHeightInPoints((short) 16); // set size
        font.setBold(true); // set type BOLD
        headerStyle.setFont(font); // set font for header style

        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // Set border for header cells
        ExportFileService.setCellBorders(headerStyle);

        ExportFileService.createHeaderTable(header, headerStyle);

        CellStyle style = workbook.createCellStyle(); // create a new style for data cells
        style.setAlignment(HorizontalAlignment.CENTER); // can giua data
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setWrapText(true);
        // Set border for data cells
        setCellBorders(style);

        // Create a date cell style
        CellStyle dateCellStyle = workbook.createCellStyle();
        dateCellStyle.setAlignment(HorizontalAlignment.CENTER);
        dateCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        CreationHelper createHelper = workbook.getCreationHelper();
        dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-MM-dd"));
        setCellBorders(dateCellStyle); // Set border for date cells

        ExportFileService.createDataForTableOffer(sheet, style, dateCellStyle, offerDetailResponses);

        File currDir = new File(".");

        try (FileOutputStream outputStream = new FileOutputStream(filePath)) {
            workbook.write(outputStream);
        }
        workbook.close();
    }

    public static void setCellBorders(CellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());
    }

    public static void createDataForTableOffer(Sheet sheet, CellStyle style, CellStyle dateCellStyle, List<OfferDetailResponse> data) {
        int size = data.size();
        for (int i = 0; i < size; i++) {
            Row row = sheet.createRow(i + 2);

            Cell cell = row.createCell(0); // Tạo một ô mới tại cột đầu tiên (cột 0) trong hàng này.
            cell.setCellValue(data.get(i).getCandidate().getName());
            cell.setCellStyle(style);// Áp dụng CellStyle cho ô này.

            cell = row.createCell(1);
            cell.setCellValue(data.get(i).getPosition().getName());
            cell.setCellStyle(style);

            cell = row.createCell(2);
            cell.setCellValue(data.get(i).getApprover().getName());
            cell.setCellStyle(style);

            cell = row.createCell(3);
            cell.setCellValue(data.get(i).getInterviewers());
            cell.setCellStyle(style);

            cell = row.createCell(4);
            cell.setCellValue(formatTimeSchedule(data.get(i).getFrom()) +" to "+ formatTimeSchedule(data.get(1).getTo()));
            cell.setCellStyle(style);

            cell = row.createCell(5);
            cell.setCellValue(data.get(i).getNote());
            cell.setCellStyle(style);

            cell = row.createCell(6);
            cell.setCellValue(data.get(i).getStatus());
            cell.setCellStyle(style);

            cell = row.createCell(7);
            cell.setCellValue(data.get(i).getContract().getName());
            cell.setCellStyle(style);

            cell = row.createCell(8);
            cell.setCellValue(data.get(i).getLevel().getName());
            cell.setCellStyle(style);

            cell = row.createCell(9);
            cell.setCellValue(data.get(i).getDepartment().getName());
            cell.setCellStyle(style);

            cell = row.createCell(10);
            cell.setCellValue(data.get(i).getRecruiter().getName());
            cell.setCellStyle(style);

            cell = row.createCell(11);
            cell.setCellValue(formatTimeSchedule(data.get(i).getDueDate()));
            cell.setCellStyle(style);

            cell = row.createCell(12);
            cell.setCellValue(String.valueOf(data.get(i).getBasicSalary())+"VND");
            cell.setCellStyle(style);

            cell = row.createCell(13);
            cell.setCellValue(data.get(i).getNote());
            cell.setCellStyle(style);
        }
    }

    public static String formatTimeSchedule(OffsetDateTime offsetDateTime) {
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return offsetDateTime.format(dayFormatter);
    }

    public static void createHeaderTable(Row header, CellStyle headerStyle) {
        Cell headerCell = header.createCell(0); // create new cell from first cell in first row
        headerCell.setCellValue("Candidate"); // set value for first cell
        headerCell.setCellStyle(headerStyle);// set style for first cell

        headerCell = header.createCell(1);
        headerCell.setCellValue("Position");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(2);
        headerCell.setCellValue("Approver");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(3);
        headerCell.setCellValue("Interview info");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(4);
        headerCell.setCellValue("Contract period");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(5);
        headerCell.setCellValue("Interview Notes");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(6);
        headerCell.setCellValue("Status");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(7);
        headerCell.setCellValue("Contract Type");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(8);
        headerCell.setCellValue("Level");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(9);
        headerCell.setCellValue("Department");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(10);
        headerCell.setCellValue("Recruiter Owner");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(11);
        headerCell.setCellValue("Due Date");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(12);
        headerCell.setCellValue("Basic Salary");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(13);
        headerCell.setCellValue("Notes");
        headerCell.setCellStyle(headerStyle);
    }

    private OfferDetailResponse getOfferToExportFile(OfferEntity offerEntity) {
        OfferDetailResponse offerResponse = offerMapper.getResponseBy(offerEntity);
        setMapValuesForOffer(offerResponse);
        return offerResponse;
    }
//    public void export(HttpServletResponse response, XSSFWorkbook workbook) throws IOException {
//        writeHeaderLine( workbook);
//        writeDataLines(workbook);
//
//        ServletOutputStream outputStream = response.getOutputStream();
//        workbook.write(outputStream);
//        workbook.close();
//
//        outputStream.close();
//
//    }
//
//    private void writeDataLines(XSSFWorkbook workbook) {
//        int rowCount = 1;
//
//        CellStyle style = workbook.createCellStyle();
//        XSSFFont font = workbook.createFont();
//        font.setFontHeight(14);
//        style.setFont(font);
//    }
//
//    private void writeHeaderLine( XSSFWorkbook workbook) {
//         XSSFSheet sheet = workbook.createSheet("Users");
//
//        Row row = sheet.createRow(0);
//
//        CellStyle style = workbook.createCellStyle();
//        XSSFFont font = workbook.createFont();
//        font.setBold(true);
//        font.setFontHeight(16);
//        style.setFont(font);
//
//        createCell(row, 0, "Candidate", style);
//        createCell(row, 1, "Position", style);
//        createCell(row, 2, "Approver", style);
//        createCell(row, 3, "Interview info", style);
//        createCell(row, 4, "Contract period", style);
//        createCell(row, 5, "Interview Notes", style);
//        createCell(row, 6, "Status", style);
//        createCell(row, 7, "Contract Type", style);
//        createCell(row, 8, "Level", style);
//        createCell(row, 9, "Department", style);
//        createCell(row, 10, "Recruiter Owner", style);
//        createCell(row, 11, "Due Date", style);
//        createCell(row, 12, "Basic Salary", style);
//        createCell(row, 13, "Notes", style);
//    }
    private OfferDetailResponse setMapValuesForOffer(OfferDetailResponse offerResponse) {
//        LevelEntity levelEntity = customRepository.getLevelEntityBy(offerResponse.getLevelId());
//        offerResponse.setLevel(new IdAndName(levelEntity.getId(), levelEntity.getName()));
        offerResponse.setLevel(new IdAndName(1L,"level1"));


//        PositionEntity positionEntity = customRepository.getPositionEntityBy(offerResponse.getPositionId());
//        offerResponse.setPosition(new IdAndName(positionEntity.getId(), positionEntity.getName()));
        offerResponse.setPosition(new IdAndName(1L,"Position1"));

//        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(offerResponse.getCandidateId());
//        offerResponse.setCandidate(new IdAndName(candidateEntity.getId(), candidateEntity.getEmail()));
        offerResponse.setCandidate(new IdAndName(1L,"CandiDate1"));

//        AccountEntity approveEntity = customRepository.getAccountEntityBy(offerResponse.getApproveId());
//        offerResponse.setApprover(new IdAndName(approveEntity.getId(), approveEntity.getFullName()));
        offerResponse.setApprover(new IdAndName(1L,"Pham Thanh Phuc"));

//        ContractTypeEntity contractTypeEntity = customRepository.getContractTypeEntityBy(offerResponse.getContractId());
//        offerResponse.setContract(new IdAndName(contractTypeEntity.getId(), contractTypeEntity.getName()));
        offerResponse.setContract(new IdAndName(1L,"1 Nam"));

//        DepartmentEntity departmentEntity = customRepository.getDepartmentEntityBy(offerResponse.getDepartmentId());
//        offerResponse.setDepartment(new IdAndName(departmentEntity.getId(), departmentEntity.getName()));
        offerResponse.setDepartment(new IdAndName(1L,"IT"));

//        AccountEntity recruiterEntity = customRepository.getAccountEntityBy(offerResponse.getRecruiterId());
//        offerResponse.setRecruiter(new IdAndName(recruiterEntity.getId(), recruiterEntity.getFullName()));
        offerResponse.setRecruiter(new IdAndName(1L,"Do Nam Phu"));

        return offerResponse;
    }
}
