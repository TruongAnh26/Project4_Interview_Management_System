package fa.training.HN24_CPL_JAVA_01_G3.entity;

import lombok.*;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "tbl_map_schedule_interviewer")
public class ScheduleInterviewerMapEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long scheduleId;
    private Long interviewerId;
}
