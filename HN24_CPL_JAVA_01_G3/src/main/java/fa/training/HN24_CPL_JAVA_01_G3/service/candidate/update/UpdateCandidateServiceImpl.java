package fa.training.HN24_CPL_JAVA_01_G3.service.candidate.update;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.CandidateStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.request.CandidateRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.UpdateScheduleRequest;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateSkillMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate_job_map.CandidateJobMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.CandidateMapperImpl;
import fa.training.HN24_CPL_JAVA_01_G3.validation.CandidateValidationHelper;
import fa.training.HN24_CPL_JAVA_01_G3.validation.ScheduleValidateHelper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;


@Service
@AllArgsConstructor
public class UpdateCandidateServiceImpl implements UpdateCandidateService{

    private final CandidateRepository candidateRepository;
    private final CustomRepository customRepository;
    private final CandidateMapperImpl candidateMapper;
    private final CandidateSkillMapRepository candidateSkillMapRepository;
    private final CandidateJobMapRepository candidateJobMapRepository;
    private final CandidateValidationHelper candidateValidationHelper;


    @Override
    @Transactional
    public SuccessResponse updateCandidate(Long candidateId, CandidateRequest candidateRequest){
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(candidateId);
        candidateMapper.updateEntityBy(candidateEntity,candidateRequest);
        candidateRepository.save(candidateEntity);
        updateCandidateSkillMap(candidateId,candidateRequest.getSkillIds());
        updateCandidateJobMap(candidateId,candidateRequest.getJobIds());
        return SuccessHandle.success(CodeAndMessage.ME014);
    }

    @Override
    @Transactional
    public SuccessResponse banCandidate(Long candidateId) {
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(candidateId);
        candidateEntity.setStatus(CandidateStatusEnum.STATUS_BANNED.getStatus());
        candidateRepository.save(candidateEntity);
        return SuccessHandle.success(CodeAndMessage.ME0997);
    }

    @Override
    public SuccessResponse updateFileCV(Long id, MultipartFile file) throws IOException {
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(id);
        String base64File = Base64.getEncoder().encodeToString(file.getBytes());
        candidateEntity.setCvAttachment(base64File);
        candidateRepository.save(candidateEntity);
        return SuccessHandle.success(CodeAndMessage.ME0996);
    }

    private void updateCandidateSkillMap(Long candidateId, List<Long> skillIds) {
        candidateSkillMapRepository.deleteByCandidateId(candidateId);
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(candidateId);
        for (Long skillId : skillIds) {
            SkillEntity skillEntity = customRepository.getSkillEntityBy(skillId);
            candidateSkillMapRepository.save(
                    CandidateSkillMapEntity.builder()
                            .skillEntity(skillEntity)
                            .candidateEntity(candidateEntity)
                            .build()
            );
        }
    }

    private void updateCandidateJobMap(Long candidateId, List<Long> jobIds) {
        candidateJobMapRepository.deleteByCandidateId(candidateId);
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(candidateId);
        for (Long jobId : jobIds) {
            JobEntity jobEntity = customRepository.getJobEntityBy(jobId);
            candidateJobMapRepository.save(
                    CandidateJobMapEntity.builder()
                            .JobEntity(jobEntity)
                            .candidateEntity(candidateEntity)
                            .status(CandidateStatusEnum.STATUS_OPENED.getStatus())
                            .build()
            );
        }
    }
}
