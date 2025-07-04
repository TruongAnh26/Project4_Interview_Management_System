package fa.training.HN24_CPL_JAVA_01_G3.validation;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.SignUpRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.request.CandidateRequest;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@AllArgsConstructor
@Component
public class CandidateValidationHelper {

    private final CandidateRepository candidateRepository;

    public void emailCandidateValidate(CandidateRequest candidateRequest){
        if (candidateRepository.existsByEmail(candidateRequest.getEmail())){
            throw new RuntimeException(CodeAndMessage.ME0104);
        }
    }

}
