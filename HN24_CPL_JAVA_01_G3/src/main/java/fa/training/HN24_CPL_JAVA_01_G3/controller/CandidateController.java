package fa.training.HN24_CPL_JAVA_01_G3.controller;


import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.request.CandidateRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.AccountCreateCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateMapResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobMapResponse;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.CloudinaryService;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.create.CreateCandidateService;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.delete.DeleteCandidateService;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.get.GetCandidateService;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.update.UpdateCandidateService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/candidate")
@AllArgsConstructor
@CrossOrigin
public class CandidateController {

    private final CreateCandidateService createCandidateService;
    private final GetCandidateService getCandidateService;
    private final UpdateCandidateService updateCandidateService;
    private final DeleteCandidateService deleteCandidateService;
    private final CloudinaryService cloudinaryService;

    @GetMapping("/list")
    @Operation(summary = "view candidate list")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN", "INTERVIEWER"})
    public Page<CandidateListResponse> getCandidateBy(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                                      @RequestParam(required = false) String search,
                                                      @RequestParam(required = false) String status,
                                                      @RequestParam(defaultValue = "1") int page,
                                                      @RequestParam(defaultValue = "10") int size) {
        return getCandidateService.getCandidatesBy(accessToken, search, status, page, size);
    }

    @GetMapping("")
    @Operation(summary = "View candidate information")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN", "INTERVIEWER"})
    public CandidateDetailResponse getCandidateBy(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                                  @RequestParam Long id) {
        return getCandidateService.getCandidateBy(id);
    }

    @Operation(summary = "Create new Candidate.")
    @PostMapping("/create-new")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse createNewCandidate(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                              @Valid @RequestBody CandidateRequest candidateRequest){
        return createCandidateService.createCandidate(candidateRequest);
    }

    @Operation(summary = "Edit Candidate information")
    @PutMapping("/update")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse updateCandidate(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                           @RequestParam Long candidateId,
                                           @Valid @RequestBody CandidateRequest candidateRequest){
        return updateCandidateService.updateCandidate(candidateId,candidateRequest);
    }

    @Operation(summary = "Delete Candidate")
    @DeleteMapping("/delete")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse deleteCandidate(
         @RequestHeader(Common.AUTHORIZATION) String accessToken,
            @RequestParam Long candidateId) {
        return deleteCandidateService.deleteCandidate(candidateId);
    }

    @Operation(summary = "Ban Candidate")
    @PutMapping("/ban")
//    @AcceptRole(values = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse banCandidate(
//            @RequestHeader(Common.AUTHORIZATION) String accessToken,
            @RequestParam Long candidateId){
        return updateCandidateService.banCandidate(candidateId);
    }

    @PostMapping("/uploadCV2")
    public ResponseEntity<?> uploadCV2(@RequestParam("fileCV") MultipartFile file){
        Map data = this.cloudinaryService.upload(file);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PostMapping("/uploadCV")
    public SuccessResponse uploadCVFile(@RequestParam("id") Long id, @RequestParam("file") MultipartFile file) throws IOException {
            return  updateCandidateService.updateFileCV(id, file);
    }

    @GetMapping("/nameUserLogin")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public AccountCreateCandidateResponse nameUserLogin(@RequestHeader(Common.AUTHORIZATION) String accessToken) {
        return getCandidateService.getNameUserLogin(accessToken);
    }

    @GetMapping("/get-items-to-create-candidate")
    @Operation(summary = "Hiển thị danh sách levels, position, skills để Create Candidate")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public CandidateMapResponse showListMapForCreateCandidate(@RequestHeader(Common.AUTHORIZATION) String accessToken) {
        return getCandidateService.getListMapForCreateCandidate();
    }




}
