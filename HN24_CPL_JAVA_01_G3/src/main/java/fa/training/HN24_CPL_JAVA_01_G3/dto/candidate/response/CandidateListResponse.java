package fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateListResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String status;
    private String positionName;
    private String recruiterName;
}
