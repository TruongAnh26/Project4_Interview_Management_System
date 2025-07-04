package fa.training.HN24_CPL_JAVA_01_G3.service.job;

import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.JobScheduleResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.JobEntity;
import org.mapstruct.Mapper;

@Mapper
public interface JobMapper {
    JobListResponse getResponseListBy(JobEntity jobEntity);

    JobEntity getEntityBy(JobRequest jobRequest);

    JobDetailResponse getResponseBy(JobEntity jobEntity);

    JobScheduleResponse getJobOfSchedule(JobEntity jobEntity);

}
