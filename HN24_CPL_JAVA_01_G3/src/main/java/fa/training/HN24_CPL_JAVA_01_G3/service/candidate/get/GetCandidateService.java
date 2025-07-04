package fa.training.HN24_CPL_JAVA_01_G3.service.candidate.get;

import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.AccountCreateCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateMapResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GetCandidateService {
    Page<CandidateListResponse> getCandidatesBy(String accessToken, String search, String status, int page, int size);
    CandidateDetailResponse getCandidateBy(Long id);

    AccountCreateCandidateResponse getNameUserLogin(String accessToken);

    CandidateMapResponse getListMapForCreateCandidate();
}
