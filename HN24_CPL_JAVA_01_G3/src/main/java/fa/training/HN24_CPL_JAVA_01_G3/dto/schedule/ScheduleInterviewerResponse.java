package fa.training.HN24_CPL_JAVA_01_G3.dto.schedule;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ScheduleInterviewerResponse {
    private Long id;
    private Long interviewerId;
}
