package fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state;

import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.OfferEntity;

public interface UpdateOfferState {
    void updateState(String accessToken, OfferEntity offerEntity, CandidateEntity candidateEntity);
}
