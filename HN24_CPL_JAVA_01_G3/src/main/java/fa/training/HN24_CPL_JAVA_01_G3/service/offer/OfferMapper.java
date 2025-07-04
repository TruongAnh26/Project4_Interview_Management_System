package fa.training.HN24_CPL_JAVA_01_G3.service.offer;

import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.OfferEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper
public interface OfferMapper {
    OfferEntity getEntityBy(OfferRequest offerRequest);
    void updateEntityBy(@MappingTarget OfferEntity offerEntity, OfferRequest offerRequest);
    OfferDetailResponse getResponseBy(OfferEntity offerEntity);
    OfferListResponse getResponseListBy(OfferEntity offerEntity);
}
