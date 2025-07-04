package fa.training.HN24_CPL_JAVA_01_G3.dto.job;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobDetailResponse {
    private String jobTitle;
    private String workingAddress;
    private String description;
    private BigDecimal salaryRangeFrom;
    private BigDecimal salaryRangeTo;
    private String status;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<IdAndName> benefits;
    private List<String> benefitNames;
    private List<IdAndName> skills;
    private List<String> skillNames;
    private List<IdAndName> levels;
    private List<String> levelNames;
    private String updatedBy;
}
