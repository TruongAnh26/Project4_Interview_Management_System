package fa.training.HN24_CPL_JAVA_01_G3.dto.skill;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.*;
import org.checkerframework.checker.units.qual.N;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SkillCandidateResponse {
    private Long candidateId;
    private List<IdAndName> skills;

}
