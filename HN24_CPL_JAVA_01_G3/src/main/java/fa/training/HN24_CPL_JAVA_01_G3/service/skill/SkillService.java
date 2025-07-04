package fa.training.HN24_CPL_JAVA_01_G3.service.skill;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.skill.SkillCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateSkillMapEntity;

import java.util.List;

public interface SkillService {
    SkillCandidateResponse getByCandidateId(String accessToken, Long candidateId);
}
