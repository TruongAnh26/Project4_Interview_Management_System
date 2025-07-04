package fa.training.HN24_CPL_JAVA_01_G3.dto.job;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.JobScheduleResponse;
import lombok.*;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JobCandidateResponse {
    private Long candidateId;
    private List<JobScheduleResponse> jobs;
}
