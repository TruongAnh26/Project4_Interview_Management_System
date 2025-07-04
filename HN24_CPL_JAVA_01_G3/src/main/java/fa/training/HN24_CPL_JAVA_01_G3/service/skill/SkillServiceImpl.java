package fa.training.HN24_CPL_JAVA_01_G3.service.skill;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.skill.SkillCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateSkillMapEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.SkillEntity;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateSkillMapRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SkillServiceImpl implements SkillService{
    private final CandidateSkillMapRepository candidateSkillMapRepository;
    ;
    @Override
    @Transactional(readOnly = true)
    public SkillCandidateResponse getByCandidateId(String accessToken, Long candidateId){
        List<CandidateSkillMapEntity> candidateSkillMapEntities = candidateSkillMapRepository.
                findSkillByCandidateIdAndStatus(candidateId);
        List<IdAndName> skills = candidateSkillMapEntities.stream().map(
                candidateSkillMapEntity -> {
                    IdAndName idAndNameSkill = new IdAndName();
                    SkillEntity skillEntity = candidateSkillMapEntity.getSkillEntity();
                    idAndNameSkill.setId(skillEntity.getId());
                    idAndNameSkill.setName(skillEntity.getName());
                    return idAndNameSkill;
                }
        ).collect(Collectors.toList());
        return SkillCandidateResponse.builder()
                .candidateId(candidateId)
                .skills(skills).build();
    }
}
