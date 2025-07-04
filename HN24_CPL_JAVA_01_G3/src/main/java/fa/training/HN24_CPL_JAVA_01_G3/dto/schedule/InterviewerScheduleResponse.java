package fa.training.HN24_CPL_JAVA_01_G3.dto.schedule;

import lombok.*;

import java.time.OffsetDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class InterviewerScheduleResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String address;
    private String phoneNumber;
    private String gender;
    private String role;
    private Long departmentId;
}
