package fa.training.HN24_CPL_JAVA_01_G3.service.candidate.delete;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateSkillMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate_job_map.CandidateJobMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@AllArgsConstructor
public class DeleteCandidateServiceImpl implements DeleteCandidateService{
    private final CandidateRepository candidateRepository;
    private final CandidateSkillMapRepository candidateSkillMapRepository;
    private final CandidateJobMapRepository candidateJobMapRepository;
    private final CustomRepository customRepository;

    @Override
    @Transactional
    public SuccessResponse deleteCandidate(Long candidateId) {

        if(candidateRepository.existsById(candidateId)) {
            candidateSkillMapRepository.deleteByCandidateId(candidateId);
            candidateJobMapRepository.deleteByCandidateId(candidateId);
//            candidateRepository.deleteById(candidateId);
            CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(candidateId);
            candidateEntity.setDeleted(true);
            candidateRepository.save(candidateEntity);
            return SuccessHandle.success(CodeAndMessage.ME0999);
        } else {
            return  SuccessHandle.success(CodeAndMessage.ME0998);
        }
    }
}
