package fa.training.HN24_CPL_JAVA_01_G3.dto.schedule;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DetailScheduleResponse {
    private Long id;
    private String scheduleTitle;
    private IdAndName candidateInformation;
    private String timeSchedule;
    private IdAndName jobInformation;
    private List<IdAndName> interviewerInformation;
    private String result;
    private String notes;
    private String location;
    private String meeting;
    private String status;
    private IdAndName recruiterInformation;
}
