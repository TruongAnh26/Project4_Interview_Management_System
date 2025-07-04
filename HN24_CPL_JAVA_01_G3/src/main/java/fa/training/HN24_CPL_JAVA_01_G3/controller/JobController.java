package fa.training.HN24_CPL_JAVA_01_G3.controller;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.*;
import fa.training.HN24_CPL_JAVA_01_G3.service.job.JobService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/job")
@AllArgsConstructor
@CrossOrigin
public class JobController {
    private final JobService jobService;

    @GetMapping("/list")
    @Operation(summary = "Lấy danh sách Job - UC10")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN", "INTERVIEWER"})
    public Page<JobListResponse> getOffersBy(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                             @RequestParam(required = false) String search,
                                             @RequestParam(required = false) String status,
                                             @ParameterObject Pageable pageable) {
        return jobService.getJobsBy(search, status, pageable);
    }

    @GetMapping("/get-items-to-create-job")
    @Operation(summary = "Hiển thị danh sách levels, benefits, skills để Create Job - UC12")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public JobMapResponse showListMapForCreateJob(@RequestHeader(Common.AUTHORIZATION) String accessToken) {
        return jobService.getJobMapForCreateJob();
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới Job - UC12")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse createJob(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                     @RequestBody @Valid JobRequest jobRequest) {
        return jobService.createJob(accessToken, jobRequest);
    }

    @GetMapping("/view/{id}")
    @Operation(summary = "Xem chi tiết Job - UC13")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN", "INTERVIEWER"})
    public JobDetailResponse viewDetailJob(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                           @PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @GetMapping("/get-items-to-update-job/{id}")
    @Operation(summary = "Hiển thị chi tiết Job và danh sách levels, benefits, skills để Update Job - UC14")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public JobDetailAndJobMapResponse getJobDetailAndJobMapToUpdate(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                                                    @PathVariable Long id) {
        return jobService.getJobDetailAndJobMapToUpdate(id);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Chỉnh sửa Job - UC14")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse updateJob(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                     @PathVariable Long id,
                                     @RequestBody @Valid JobRequest jobRequest) {
        return jobService.updateJob(accessToken, id, jobRequest);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xoá Job - UC15")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse deleteJob(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                     @PathVariable Long id) {
        return jobService.deleteJob(id);
    }

    @PostMapping("/import")
    @Operation(summary = "Import Jobs từ file Excel")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse importJobs(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                      @RequestParam("file") MultipartFile file) throws IOException {
        return jobService.importJobs(accessToken, file);
    }
}
