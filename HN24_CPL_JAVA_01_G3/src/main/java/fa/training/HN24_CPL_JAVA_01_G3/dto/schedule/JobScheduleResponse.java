package fa.training.HN24_CPL_JAVA_01_G3.dto.schedule;

import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JobScheduleResponse {
    private Long id;
    private String jobTitle;
    private String workingAddress;
    private String description;
    private String status;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
}
