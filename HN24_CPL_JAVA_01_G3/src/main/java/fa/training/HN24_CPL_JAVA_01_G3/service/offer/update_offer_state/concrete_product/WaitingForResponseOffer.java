package fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state.concrete_product;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.CandidateStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.OfferStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.OfferEntity;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state.UpdateOfferState;

public class WaitingForResponseOffer implements UpdateOfferState {
    @Override
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public void updateState(String accessToken, OfferEntity offerEntity, CandidateEntity candidateEntity) {
        offerEntity.setStatus(OfferStatusEnum.WAITING_FOR_RESPONSE.name());
        // set candidate's status to Waiting for response
        candidateEntity.setStatus(CandidateStatusEnum.STATUS_WAITING_FOR_RESPONSE.getStatus());
    }
}
