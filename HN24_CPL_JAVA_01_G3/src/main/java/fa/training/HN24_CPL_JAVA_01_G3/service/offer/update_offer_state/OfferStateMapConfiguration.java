package fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state;

import fa.training.HN24_CPL_JAVA_01_G3.common.enums.OfferStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state.concrete_product.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class OfferStateMapConfiguration {
    @Bean
    public Map<String, UpdateOfferState> updateOfferStateMapConfiguration(){
        Map<String, UpdateOfferState> map = new HashMap<>();
        map.put(OfferStatusEnum.APPROVED.name(), new ApprovedOffer());
        map.put(OfferStatusEnum.REJECTED.name(), new RejectedOffer());
        map.put(OfferStatusEnum.ACCEPTED.name(), new AcceptedOffer());
        map.put(OfferStatusEnum.CANCELLED.name(), new CanceledOffer());
        map.put(OfferStatusEnum.DECLINED.name(), new DeclinedOffer());
        map.put(OfferStatusEnum.WAITING_FOR_RESPONSE.name(), new WaitingForResponseOffer());
        return Collections.unmodifiableMap(map);
    }
}
