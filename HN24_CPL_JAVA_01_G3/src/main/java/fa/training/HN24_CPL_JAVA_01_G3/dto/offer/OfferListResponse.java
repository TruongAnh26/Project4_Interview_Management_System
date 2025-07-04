package fa.training.HN24_CPL_JAVA_01_G3.dto.offer;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OfferListResponse {
    private Long id;
    private IdAndName candidate;
    private String email;
    private IdAndName approver;
    private IdAndName department;
    private String note;
    private String status;
}
