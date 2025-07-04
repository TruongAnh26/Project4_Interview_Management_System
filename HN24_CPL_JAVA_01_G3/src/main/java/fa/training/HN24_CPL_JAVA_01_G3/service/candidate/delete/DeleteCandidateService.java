package fa.training.HN24_CPL_JAVA_01_G3.service.candidate.delete;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import org.springframework.transaction.annotation.Transactional;

public interface DeleteCandidateService {

    @Transactional
    SuccessResponse deleteCandidate(Long candidateId);
}
