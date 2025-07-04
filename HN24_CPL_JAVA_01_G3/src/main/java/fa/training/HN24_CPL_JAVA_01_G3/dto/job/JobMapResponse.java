package fa.training.HN24_CPL_JAVA_01_G3.dto.job;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobMapResponse {
    private List<IdAndName> skills;
    private List<IdAndName> levels;
    private List<IdAndName> benefits;
}
