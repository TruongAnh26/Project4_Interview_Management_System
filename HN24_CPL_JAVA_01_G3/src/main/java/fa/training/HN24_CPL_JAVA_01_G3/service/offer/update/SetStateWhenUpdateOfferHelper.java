package fa.training.HN24_CPL_JAVA_01_G3.service.offer.update;

import fa.training.HN24_CPL_JAVA_01_G3.common.enums.CandidateStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class SetStateWhenUpdateOfferHelper {
    private final CustomRepository customRepository;
    private final CandidateRepository candidateRepository;

    public void setStateForCandidate(Long candidateId, String state){
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(candidateId);
        candidateEntity.setStatus(state);
        candidateRepository.save(candidateEntity);
    }
}
