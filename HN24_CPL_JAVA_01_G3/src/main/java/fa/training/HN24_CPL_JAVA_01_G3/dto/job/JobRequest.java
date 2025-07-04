package fa.training.HN24_CPL_JAVA_01_G3.dto.job;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobRequest {
    @NotNull
    private String jobTitle;
    @NotNull
    private OffsetDateTime startDate;
     @NotNull
    private OffsetDateTime endDate;
    @NotNull
    private List<Long> levelIds;
    @NotNull
    private List<Long> benefitIds;
    @NotNull
    private List<Long> skillIds;
    @Size(max = 500)
    private String description;
    private BigDecimal salaryRangeFrom;
    private BigDecimal salaryRangeTo;
    private String workingAddress;
}
