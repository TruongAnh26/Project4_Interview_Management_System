package fa.training.HN24_CPL_JAVA_01_G3.dto.job;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobListResponse {
    private Long id;
    private String jobTitle;
    private List<IdAndName> requiredSkills;
    private List<IdAndName> level;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private String status;
}
