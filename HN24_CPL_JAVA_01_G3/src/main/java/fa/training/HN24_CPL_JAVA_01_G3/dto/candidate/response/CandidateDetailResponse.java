package fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response;


import fa.training.HN24_CPL_JAVA_01_G3.entity.AccountEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.PositionEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateDetailResponse {
    private Long id;
    private String fullName;
    private LocalDate dob;
    private String phoneNumber;
    private String email;
    private String address;
    private String gender;
    private String note;
    private String status;
    private Long yearOfExperience;
    private String highestLevel;
    private Long positionId;
    private Long recruiterId;
    private String recruiterName;
    private List<Long> skillIds;
    private List<Long> jobIds;
    private String cvAttachment;
}
