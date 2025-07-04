package fa.training.HN24_CPL_JAVA_01_G3.dto.account;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountDetailResponse {
    private String fullName;
    private String email;
    private OffsetDateTime dob;
    private String address;
    private String phoneNumber;
    private String gender; // Male/ Female
    private String role; // ADMIN, RECRUITER, INTERVIEWER, MANAGER
    private Long departmentId;
    private IdAndName department;
    private String note;
    private String status;
}
