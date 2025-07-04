package fa.training.HN24_CPL_JAVA_01_G3.dto.offer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InterviewForUpdateOfferResponse {
    private String interviewName;
    private String interviewers;
    private String note;
}
