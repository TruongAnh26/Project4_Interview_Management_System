package fa.training.HN24_CPL_JAVA_01_G3.service.candidate.update;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.request.CandidateRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.UpdateScheduleRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UpdateCandidateService {
    @Transactional
    SuccessResponse updateCandidate(Long candidateId, CandidateRequest candidateRequest);

    @Transactional
    SuccessResponse banCandidate(Long candidateId);

    SuccessResponse updateFileCV(Long id, MultipartFile file) throws IOException;
}
