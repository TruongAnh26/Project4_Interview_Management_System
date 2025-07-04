package fa.training.HN24_CPL_JAVA_01_G3.service.job;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface JobService {
    Page<JobListResponse> getJobsBy(String search, String status, Pageable pageable);

    SuccessResponse createJob(String accessToken, JobRequest jobRequest);

    JobDetailResponse getJobById(Long id);

    SuccessResponse deleteJob(Long id);

    SuccessResponse updateJob(String accessToken, Long id, JobRequest jobRequest);

    JobMapResponse getJobMapForCreateJob();

    JobDetailAndJobMapResponse getJobDetailAndJobMapToUpdate(Long id);

    SuccessResponse importJobs(String accessToken, MultipartFile file) throws IOException;

    void updateJobStatuses();
}
