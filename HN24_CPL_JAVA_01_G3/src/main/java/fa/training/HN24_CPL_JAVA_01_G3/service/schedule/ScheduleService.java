package fa.training.HN24_CPL_JAVA_01_G3.service.schedule;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobDetailAndJobMapResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

public interface ScheduleService {


    @Transactional
    @Scheduled(cron = "0 0 17 * * ?")
    void UpdateStatusWhenDueDate();

    @Transactional
    Page<CandidateListResponse> getCandidateHasJob(String search, String status, String accessToken, Pageable pageable);

    @Transactional(readOnly = true)
    JobCandidateResponse getJobsByCandidateId(String accessToken, Long candidateId);

    @Transactional(readOnly = true)
    List<IdAndName> getJobStatusOpen();

    @Transactional
    SuccessResponse createSchedule (String accessToken, ScheduleRequest scheduleRequest) throws MessagingException, IOException;

    @Transactional
    SuccessResponse updateSchedule(String accessToken, Long scheduleId, UpdateScheduleRequest updateScheduleRequest);

    @Transactional
    SuccessResponse cancelScheduleInterview(String accessToken, Long scheduleId);

    @Transactional
    Page<ScheduleResponse> getSchedulesBySearch(String search, Long interviewerId,
                                                String status, Pageable pageable);

    @Transactional(readOnly = true)
    Page<ScheduleResponse> getListSchedule(String accessToken, Pageable pageable);

    @Transactional(readOnly = true)
    DetailScheduleResponse getDetailSchedule(String accessToken, Long scheduleId);

    @Transactional
    SuccessResponse sendInterviewResult(String accessToken, Long scheduleId, ResultInterviewRequest resultInterviewRequest);
}
