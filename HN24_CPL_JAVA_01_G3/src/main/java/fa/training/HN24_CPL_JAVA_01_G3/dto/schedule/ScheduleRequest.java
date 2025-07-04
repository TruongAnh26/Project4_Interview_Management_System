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
public class ScheduleRequest {
   @NotNull
    private String scheduleTitle;
    @NotNull
    private String candidateName;
    @NotNull
    private OffsetDateTime scheduleTime;
    @NotNull
    private OffsetDateTime timeStart;
    @NotNull
    private OffsetDateTime timeEnd;
    @Size(max = 500)
    private String notes;
    @NotNull
    private String location;
    private String meeting;
    @NotNull
    private List<Long> interviewerIds;
    @NotNull
    private Long candidateId;
    @NotNull
    private Long jobId;
}
