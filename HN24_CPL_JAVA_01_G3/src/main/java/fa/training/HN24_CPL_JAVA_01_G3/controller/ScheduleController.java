package fa.training.HN24_CPL_JAVA_01_G3.controller;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.*;
import fa.training.HN24_CPL_JAVA_01_G3.service.schedule.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/schedule")
@AllArgsConstructor
@CrossOrigin
public class ScheduleController {
    private final ScheduleService scheduleService;

    @Operation(summary = "Lấy danh sách Jobs theo candidate - for create schedule")
    @GetMapping("/list/candidateid")
    public JobCandidateResponse getJobsByCandidateId(
            @RequestHeader(Common.AUTHORIZATION) String accessToken,
            @RequestParam Long candidateId){
        return scheduleService.getJobsByCandidateId(accessToken, candidateId);
    }

    @Operation(summary = "Lấy danh sách Jobs status = Open")
    @GetMapping("/list/open")
    public List<IdAndName> getJobsStatusOpen(){
        return scheduleService.getJobStatusOpen();
    }
    @Operation(summary = "Create new Schedule.")
    @PostMapping("/create-new")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse createNewSchedule(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                             @Valid @RequestBody ScheduleRequest scheduleRequest) throws MessagingException, IOException {
        return scheduleService.createSchedule(accessToken,scheduleRequest);
    }

    @Operation(summary = "Update Schedule Interview.")
    @PutMapping("/update")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse updateScheduleInterview(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                                   @RequestParam Long scheduleId,
                                             @Valid @RequestBody UpdateScheduleRequest updateScheduleRequest){
        return scheduleService.updateSchedule(accessToken,scheduleId,updateScheduleRequest);
    }

    @Operation(summary = "Send Interview Result.")
    @PutMapping("/result-interview")
    @AuthenticationProxy(acceptRoles = {"INTERVIEWER"}) // chi cho interviewer gui
    public SuccessResponse sendInterviewResult(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                                   @RequestParam Long scheduleId,
                                                   @Valid @RequestBody ResultInterviewRequest resultInterviewRequest){
        return scheduleService.sendInterviewResult(accessToken,scheduleId,resultInterviewRequest);
    }

    @GetMapping("/search")
    @Operation(summary = "search Schedule ")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN","INTERVIEWER"})
    public Page<ScheduleResponse> geScheduleBySearch(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                               @RequestParam(required = false) String search,
                                               @RequestParam(required = false) Long interviewerId,
                                               @RequestParam(required = false) String status,
                                               @ParameterObject Pageable pageable) {
        return scheduleService.getSchedulesBySearch(search, interviewerId, status, pageable);
    }

    @Operation(summary = "Cancelled Interview Schedule.")
    @PutMapping("/cancel-interview")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse canceledScheduleInterview(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                               @RequestParam Long scheduleId){
        return scheduleService.cancelScheduleInterview(accessToken,scheduleId);
    }

    @Operation(summary = "View Schedule List.")
    @GetMapping("/list")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN", "INTERVIEWER"})
    public Page<ScheduleResponse> getListScheduleResponse(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                                          @ParameterObject Pageable pageable){
        return scheduleService.getListSchedule(accessToken, pageable);
    }

    @Operation(summary = "show Candidate have jobs")
    @GetMapping("/list/hasjob")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public Page<CandidateListResponse> getCandidateHasJobs(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                                           @ParameterObject Pageable pageable,
                                                           @RequestParam(required = false) String status,
                                                           @RequestParam(required = false) String search){
        return scheduleService.getCandidateHasJob(search,status,accessToken, pageable);
    }
    @Operation(summary = "View Schedule Details.")
    @GetMapping("/detail")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN", "INTERVIEWER"})
    public DetailScheduleResponse updateScheduleInterview(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                                          @RequestParam Long scheduleId){
        return scheduleService.getDetailSchedule(accessToken, scheduleId);
    }
}
