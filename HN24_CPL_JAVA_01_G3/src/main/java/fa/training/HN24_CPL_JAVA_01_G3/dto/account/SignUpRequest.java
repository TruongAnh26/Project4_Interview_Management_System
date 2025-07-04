package fa.training.HN24_CPL_JAVA_01_G3.dto.account;

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
public class SignUpRequest {
    @NotBlank
    private String fullName;
    @NotBlank
    private String email;
    @NotNull
    private OffsetDateTime dob;
    @NotNull
    private String address;
    @NotBlank
    private String phoneNumber;
    @NotBlank
    private String gender; // Male/ Female
    @NotBlank
    private String role; // ADMIN, RECRUITER, INTERVIEWER, MANAGER
    @NotNull
    private Long departmentId;
    private String note;
}
