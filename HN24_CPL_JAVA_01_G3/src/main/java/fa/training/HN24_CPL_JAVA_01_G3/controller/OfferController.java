package fa.training.HN24_CPL_JAVA_01_G3.controller;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.InterviewForUpdateOfferResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferRequest;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.update.UpdateOfferService;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.get.GetOfferService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/offer")
@AllArgsConstructor
@CrossOrigin
public class OfferController {
    private final UpdateOfferService updateOfferService;
    private final GetOfferService getOfferService;

    @GetMapping("/interview-info")
    @Operation(summary = "Lấy Interview info cho tạo mới, update Offer")
    public InterviewForUpdateOfferResponse getInterviewInfo(@RequestParam Long id){
        return updateOfferService.getInterviewInfoBy(id);
//        return new InterviewForUpdateOfferResponse("SBA", "ThuyNT,HaNN2", "note interview");
    }

    @PostMapping
    @Operation(summary = "Tạo mới Offer - UC24")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse createOffer(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                       @RequestBody @Valid OfferRequest offerRequest) {
        return updateOfferService.createOffer(accessToken, offerRequest);
    }

    @PutMapping
    @Operation(summary = "Chỉnh sửa Offer - UC25")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public SuccessResponse updateOffer(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                       @RequestParam Long id,
                                       @RequestBody @Valid OfferRequest offerRequest) {
        return updateOfferService.updateOffer(accessToken, id, offerRequest);
    }

    @PutMapping("update-state")
    @Operation(summary = "Cập nhật trạng thái cho Offer - UC28, 29")
    public SuccessResponse updateStateOfOffer(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                              @RequestParam Long id,
                                              @RequestParam String state) {
        updateOfferService.updateStateOffer(accessToken, id, state);
        return new SuccessResponse("ERR100", "Update state of offer success");
    }

    @GetMapping
    @Operation(summary = "Lấy chi tiết Offer - UC26")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public OfferDetailResponse getOfferBy(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                          @RequestParam Long id) {
        return getOfferService.getOfferBy(id);
    }

    @GetMapping("/list")
    @Operation(summary = "Lấy danh sách Offer - UC23")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public Page<OfferListResponse> getOffersBy(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                               @RequestParam(required = false) String search,
                                               @RequestParam(required = false) Long departmentId,
                                               @RequestParam(required = false) String status,
                                               @ParameterObject Pageable pageable) {
        return getOfferService.getOffersBy(search, departmentId, status, pageable);
    }
}
