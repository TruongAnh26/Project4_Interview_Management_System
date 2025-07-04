package fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateMapResponse {
    private List<IdAndName> skills;
    private List<IdAndName> levels;
    private List<IdAndName> positions;
    private List<IdAndName> jobs;
}
