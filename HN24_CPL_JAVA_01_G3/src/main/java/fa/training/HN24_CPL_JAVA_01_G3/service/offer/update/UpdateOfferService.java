package fa.training.HN24_CPL_JAVA_01_G3.service.offer.update;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.InterviewForUpdateOfferResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferRequest;

public interface UpdateOfferService {
    SuccessResponse createOffer(String accessToken, OfferRequest offerRequest);
    SuccessResponse updateOffer(String accessToken, Long id, OfferRequest offerRequest);
    SuccessResponse updateStateOffer(String accessToken, Long id, String state);
    InterviewForUpdateOfferResponse getInterviewInfoBy(Long id);
}
