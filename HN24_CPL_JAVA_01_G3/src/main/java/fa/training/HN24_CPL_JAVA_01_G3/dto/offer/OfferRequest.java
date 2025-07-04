package fa.training.HN24_CPL_JAVA_01_G3.dto.offer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OfferRequest {
    @NotNull
    private Long candidateId;
    @NotNull
    private Long positionId;
    @NotNull
    private Long approveId; // manager
    private Long scheduleId; // Interview Info
    @NotNull
    private OffsetDateTime from;
    @NotNull
    private OffsetDateTime to;
    @NotNull
    private Long contractId;
    @NotNull
    private Long levelId;
    @NotNull
    private Long departmentId;
    @NotNull
    private Long recruiterId; //
    @NotNull
    private OffsetDateTime dueDate;
    @NotNull
    private BigDecimal basicSalary;
    @Size(max = 500)
    private String note;
}
