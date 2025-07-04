package fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.request;

import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CandidateRequest {
    @NotNull
    private String fullName;
    private LocalDate dob;
    private String phoneNumber;
    @NotNull
    private String email;
    @NotNull
    private String gender;
    private String address;
    @NotNull
    private String cvAttachment;
    @Size(max = 500)
    private String note;
    @NotNull
    private String status;
    private Long yearOfExperience;
    @NotNull
    private String highestLevel;
    @NotNull
    private Long positionId;
    @NotNull
    private Long recruiterId;
    @NotNull
    private List<Long> skillIds;
    private List<Long> jobIds;
}
