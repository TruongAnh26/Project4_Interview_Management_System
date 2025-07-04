package fa.training.HN24_CPL_JAVA_01_G3.dto.schedule;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Pattern;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ResultInterviewRequest {

    @Pattern(regexp = "Passed|Failed", message = "Invalid result: must be 'Passed' or 'Failed'")
    private String result;
    private String notes;
}
