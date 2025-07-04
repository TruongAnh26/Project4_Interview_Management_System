package fa.training.HN24_CPL_JAVA_01_G3.dto.account;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ForgotPasswordResponse {
    private String code;
    private String message;
    private Long userId;
}
