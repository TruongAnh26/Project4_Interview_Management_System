package fa.training.HN24_CPL_JAVA_01_G3.service.candidate.create;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.request.CandidateRequest;

import javax.transaction.Transactional;

public interface CreateCandidateService {

    @Transactional
    SuccessResponse createCandidate (CandidateRequest candidateRequest);
}
