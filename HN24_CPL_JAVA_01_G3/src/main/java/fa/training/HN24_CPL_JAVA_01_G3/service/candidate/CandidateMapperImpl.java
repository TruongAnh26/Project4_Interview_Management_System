package fa.training.HN24_CPL_JAVA_01_G3.service.candidate;

import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.request.CandidateRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.AccountCreateCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateSkillMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate_job_map.CandidateJobMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.position.PositionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.processing.Generated;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;


@Generated(
        value = "org.mapstruct.ap.MappingProcessor",
        date = "2024-07-21T12:44:23+0700",
        comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.10 (Oracle Corporation)"
)
@Component
@AllArgsConstructor
public class CandidateMapperImpl {

    private final CustomRepository customRepository;
    private final CandidateSkillMapRepository candidateSkillMapRepository;
    private final CandidateJobMapRepository candidateJobMapRepository;

    public CandidateEntity getEntityFromRequest(CandidateRequest candidateRequest) {
        if (candidateRequest == null) {
            return null;
        }

        CandidateEntity candidateEntity = new CandidateEntity();

        candidateEntity.setFullName(candidateRequest.getFullName());
        candidateEntity.setDob(candidateRequest.getDob());
        candidateEntity.setPhoneNumber(candidateRequest.getPhoneNumber());
        candidateEntity.setEmail(candidateRequest.getEmail());
        candidateEntity.setAddress(candidateRequest.getAddress());
        candidateEntity.setGender(candidateRequest.getGender());
        candidateEntity.setCvAttachment(candidateRequest.getCvAttachment());
        candidateEntity.setPosition(customRepository.getPositionEntityBy(candidateRequest.getPositionId()));
        candidateEntity.setRecruiter(customRepository.getAccountEntityBy(candidateRequest.getRecruiterId()));
        candidateEntity.setNote(candidateRequest.getNote());
        candidateEntity.setYearOfExperience(candidateRequest.getYearOfExperience());
        candidateEntity.setHighestLevel(candidateRequest.getHighestLevel());
        candidateEntity.setStatus(candidateRequest.getStatus());

        return candidateEntity;
    }

    public void updateEntityBy(CandidateEntity candidateEntity, CandidateRequest candidateRequest ) {
        if (candidateRequest == null) {
            return;
        }
        candidateEntity.setFullName(candidateRequest.getFullName());
        candidateEntity.setDob(candidateRequest.getDob());
        candidateEntity.setPhoneNumber(candidateRequest.getPhoneNumber());
        candidateEntity.setEmail(candidateRequest.getEmail());
        candidateEntity.setAddress(candidateRequest.getAddress());
        candidateEntity.setGender(candidateRequest.getGender());
        candidateEntity.setCvAttachment(candidateRequest.getCvAttachment());
        candidateEntity.setPosition(customRepository.getPositionEntityBy(candidateRequest.getPositionId()));
        candidateEntity.setRecruiter(customRepository.getAccountEntityBy(candidateRequest.getRecruiterId()));
        candidateEntity.setNote(candidateRequest.getNote());
        candidateEntity.setYearOfExperience(candidateRequest.getYearOfExperience());
        candidateEntity.setHighestLevel(candidateRequest.getHighestLevel());
        candidateEntity.setStatus(candidateRequest.getStatus());
    }

    public CandidateDetailResponse getCandidateDetailsResponse(CandidateEntity candidateEntity) {
        CandidateDetailResponse candidateDetailResponse = new CandidateDetailResponse();

        candidateDetailResponse.setId(candidateEntity.getId());
        candidateDetailResponse.setFullName(candidateEntity.getFullName());
        candidateDetailResponse.setDob(candidateEntity.getDob());
        candidateDetailResponse.setPhoneNumber(candidateEntity.getPhoneNumber());
        candidateDetailResponse.setEmail(candidateEntity.getEmail());
        candidateDetailResponse.setAddress(candidateEntity.getAddress());
        candidateDetailResponse.setGender(candidateEntity.getGender());
        candidateDetailResponse.setCvAttachment(candidateEntity.getCvAttachment());
        candidateDetailResponse.setStatus(candidateEntity.getStatus());
        candidateDetailResponse.setYearOfExperience(candidateEntity.getYearOfExperience());
        candidateDetailResponse.setHighestLevel(candidateEntity.getHighestLevel());
        candidateDetailResponse.setNote(candidateEntity.getNote());

        candidateDetailResponse.setPositionId(candidateEntity.getPosition().getId());
        candidateDetailResponse.setRecruiterName(candidateEntity.getRecruiter().getFullName());
        candidateDetailResponse.setRecruiterId(candidateEntity.getRecruiter().getId());

        List<SkillEntity> skillEntities  = candidateSkillMapRepository.findSkillByCandidateId(candidateEntity.getId());
        List<Long> skillIds = new ArrayList<>();
        for(SkillEntity skillEntity : skillEntities) {
            skillIds.add(skillEntity.getId());
        }
        List<JobEntity> jobEntities  = candidateJobMapRepository.findJobByCandidateId(candidateEntity.getId());
        List<Long> jobIds = new ArrayList<>();
        for(JobEntity jobEntity : jobEntities) {
            jobIds.add(jobEntity.getId());
        }
        candidateDetailResponse.setSkillIds(skillIds);
        candidateDetailResponse.setJobIds(jobIds);
        return candidateDetailResponse;

    }

    public CandidateListResponse getCandidateListResponse(CandidateEntity candidateEntity) {
        CandidateListResponse candidateListResponse = new CandidateListResponse();

        candidateListResponse.setId(candidateEntity.getId());
        candidateListResponse.setFullName(candidateEntity.getFullName());
        candidateListResponse.setPhoneNumber(candidateEntity.getPhoneNumber());
        candidateListResponse.setEmail(candidateEntity.getEmail());
        candidateListResponse.setStatus(candidateEntity.getStatus());
        candidateListResponse.setPositionName(candidateEntity.getPosition().getName());
        candidateListResponse.setRecruiterName(candidateEntity.getRecruiter().getFullName());
        return candidateListResponse;

    }

    public AccountCreateCandidateResponse getAccountCreateCandidateResponse (AccountEntity accountEntity) {
        AccountCreateCandidateResponse accountCreateCandidateResponse = new AccountCreateCandidateResponse();
        accountCreateCandidateResponse.setId(accountEntity.getId());
        accountCreateCandidateResponse.setName(accountEntity.getFullName());
        return accountCreateCandidateResponse;

    }


}
