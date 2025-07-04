package fa.training.HN24_CPL_JAVA_01_G3.service.offer.get;

import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GetOfferService {
    OfferDetailResponse getOfferBy(Long id);
    Page<OfferListResponse> getOffersBy(String search, Long departmentId, String status, Pageable pageable);
}
