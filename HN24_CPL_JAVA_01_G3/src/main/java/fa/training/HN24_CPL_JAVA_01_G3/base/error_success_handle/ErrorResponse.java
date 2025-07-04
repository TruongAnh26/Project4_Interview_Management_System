package fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ErrorResponse {
    private String code;
    private String message;
}
