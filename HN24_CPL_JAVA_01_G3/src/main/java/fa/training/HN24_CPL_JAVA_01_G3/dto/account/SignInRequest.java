package fa.training.HN24_CPL_JAVA_01_G3.dto.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignInRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
