package fa.training.HN24_CPL_JAVA_01_G3.service.candidate.create;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.CandidateStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.request.CandidateRequest;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateSkillMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate_job_map.CandidateJobMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.CandidateMapperImpl;
import fa.training.HN24_CPL_JAVA_01_G3.validation.CandidateValidationHelper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;


@Service
@AllArgsConstructor
public class CreateCandidateServiceImpl  implements CreateCandidateService{
    private final CandidateMapperImpl candidateMapper;
    private final CandidateRepository candidateRepository;
    private final CandidateSkillMapRepository candidateSkillMapRepository;
    private final CandidateJobMapRepository candidateJobMapRepository;
    private final CustomRepository customRepository;
    private final CandidateValidationHelper candidateValidationHelper;

    @Override
    @Transactional
    public SuccessResponse createCandidate(CandidateRequest candidateRequest) {
        candidateValidationHelper.emailCandidateValidate(candidateRequest);
        CandidateEntity candidateEntity = candidateMapper.getEntityFromRequest(candidateRequest);
        setStatusForCandidate(candidateEntity);
        candidateRepository.save(candidateEntity);
        createCandidateMapSkill(candidateRequest.getSkillIds(), candidateEntity.getId());
        createCandidateMapJob(candidateRequest.getJobIds(), candidateEntity.getId());
        return SuccessHandle.success(CodeAndMessage.ME012);
    }

    private void setStatusForCandidate(CandidateEntity candidateEntity) {
        candidateEntity.setStatus(CandidateStatusEnum.STATUS_OPEN.getStatus());
    }

    private void createCandidateMapSkill(List<Long> skillIds, Long candidateId) {
        CandidateEntity candidate = customRepository.getCandidateEntityBy(candidateId);

        for (Long skillId : skillIds) {
            SkillEntity skill = customRepository.getSkillEntityBy(skillId);

            if (skill != null && candidate != null) {
                CandidateSkillMapEntity mapEntity = CandidateSkillMapEntity.builder()
                        .skillEntity(skill)
                        .candidateEntity(candidate)
                        .status(CandidateStatusEnum.STATUS_OPEN.getStatus())
                        .build();
                candidateSkillMapRepository.save(mapEntity);
            } else {
                throw new RuntimeException("Skill or Candidate not found");
            }
        }
    }

    private void createCandidateMapJob(List<Long> jobIds, Long candidateId) {
        CandidateEntity candidate = customRepository.getCandidateEntityBy(candidateId);

        for (Long jobId : jobIds) {
            JobEntity job = customRepository.getJobEntityBy(jobId);

            if (job != null && candidate != null) {
                CandidateJobMapEntity mapEntity = CandidateJobMapEntity.builder()
                        .JobEntity(job)
                        .candidateEntity(candidate)
                        .status(CandidateStatusEnum.STATUS_OPENED.getStatus())
                        .build();
                candidateJobMapRepository.save(mapEntity);
            } else {
                throw new RuntimeException("Job or Candidate not found");
            }
        }
    }


}
