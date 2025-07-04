package fa.training.HN24_CPL_JAVA_01_G3.service.candidate.get;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.TokenHelper;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.AccountCreateCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateMapResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobMapResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.OfferEntity;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.CandidateMapperImpl;
import lombok.AllArgsConstructor;
import org.aspectj.apache.bcel.classfile.Code;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GetCandidateServiceImpl implements GetCandidateService{
    private final CandidateRepository candidateRepository;
    private final CandidateMapperImpl candidateMapper;
    private final CustomRepository customRepository;


    @Override
    public Page<CandidateListResponse> getCandidatesBy(String accessToken, String search, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CandidateEntity> candidatesPage = candidateRepository.findByCriteria(search, status, pageable);

        if (candidatesPage.isEmpty()) {
            throw new RuntimeException(CodeAndMessage.ME008);
        }


        List<CandidateListResponse> candidateListResponses = candidatesPage.stream()
                .map(candidateEntity -> candidateMapper.getCandidateListResponse(candidateEntity))
                .collect(Collectors.toList());

        Page<CandidateListResponse> candidateListResponsePage = new PageImpl<>(candidateListResponses, pageable, candidatesPage.getTotalElements());

        return candidateListResponsePage;
    }


    @Override
    public CandidateDetailResponse getCandidateBy(Long id) {
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(id);
        CandidateDetailResponse candidateDetailResponse = candidateMapper.getCandidateDetailsResponse(candidateEntity);
        return candidateDetailResponse;
    }

    @Override
    public AccountCreateCandidateResponse getNameUserLogin(String accessToken) {
        return candidateMapper.getAccountCreateCandidateResponse(customRepository.getAccountEntityBy(TokenHelper.getUserIdFromToken(accessToken)));
    }

    @Override
    public CandidateMapResponse getListMapForCreateCandidate() {
        return customRepository.getCandidateMaps();
    }
}
