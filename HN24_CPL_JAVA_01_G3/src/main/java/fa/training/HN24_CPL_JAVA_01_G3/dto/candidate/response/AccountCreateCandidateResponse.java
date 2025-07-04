package fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountCreateCandidateResponse {
    private String name;
    private Long id;
}
