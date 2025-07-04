package fa.training.HN24_CPL_JAVA_01_G3.dto.offer;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OfferDetailResponse {
    private Long candidateId;
    private IdAndName candidate;
    private Long positionId;
    private IdAndName position;
    private Long approveId; // manager
    private IdAndName approver;
    private Long scheduleId; // Interview Info
    private String interview;
    private String interviewers;
    private OffsetDateTime from;
    private OffsetDateTime to;
    private Long contractId;
    private IdAndName contract;
    private Long levelId;
    private IdAndName level;
    private Long departmentId;
    private IdAndName department;
    private Long recruiterId;
    private IdAndName recruiter;
    private OffsetDateTime dueDate;
    private BigDecimal basicSalary;
    private String note;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private String updatedBy;
}
