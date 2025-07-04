package fa.training.HN24_CPL_JAVA_01_G3.dto.schedule;

import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ScheduleResponse {
    private Long id;
    private String scheduleTitle;
    private String candidateName;
    private List<InterviewerScheduleResponse> interviewerInformation;
    private String timeSchedule;
    private String result;
    private String status;
    private JobScheduleResponse jobScheduleResponse;
}
