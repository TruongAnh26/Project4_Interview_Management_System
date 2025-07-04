package fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state.concrete_product;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.CandidateStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.OfferStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.OfferEntity;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state.UpdateOfferState;
import fa.training.HN24_CPL_JAVA_01_G3.validation.OfferValidationHelper;

public class RejectedOffer implements UpdateOfferState {
    @Override
    @AuthenticationProxy(acceptRoles = {"MANAGER", "ADMIN"})
    public void updateState(String accessToken, OfferEntity offerEntity, CandidateEntity candidateEntity) {
        OfferValidationHelper.rejectValidate(offerEntity, CodeAndMessage.ERR0);
        offerEntity.setStatus(OfferStatusEnum.REJECTED.name());
        // set candidate's status to Rejected Offer
        candidateEntity.setStatus(CandidateStatusEnum.STATUS_REJECTED_OFFER.getStatus());
    }
}
