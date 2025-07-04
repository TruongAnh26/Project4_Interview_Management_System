package fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state.concrete_product;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.CandidateStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.OfferStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.OfferEntity;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state.UpdateOfferState;
import fa.training.HN24_CPL_JAVA_01_G3.validation.OfferValidationHelper;

public class AcceptedOffer implements UpdateOfferState {
    @Override
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public void updateState(String accessToken, OfferEntity offerEntity, CandidateEntity candidateEntity) {
        OfferValidationHelper.acceptValidate(offerEntity, CodeAndMessage.ERR0);
        offerEntity.setStatus(OfferStatusEnum.ACCEPTED.name());
        // set candidate's status to Accepted Offer
        candidateEntity.setStatus(CandidateStatusEnum.STATUS_ACCEPTED_OFFER.getStatus());
    }
}
