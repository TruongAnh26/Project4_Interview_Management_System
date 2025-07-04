package fa.training.HN24_CPL_JAVA_01_G3.dto.schedule;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class ScheduleSearchResponse {
    private Long id;
    private String scheduleTitle;
    private String candidateName;
    private String timeSchedule;
    private String jobName;
    private String interviewerName;
    private String result;
    private String notes;
    private String location;
    private String meeting;
    private String status;
}
