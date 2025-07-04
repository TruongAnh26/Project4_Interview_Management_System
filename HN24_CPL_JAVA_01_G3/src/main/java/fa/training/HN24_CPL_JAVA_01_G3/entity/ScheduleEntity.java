package fa.training.HN24_CPL_JAVA_01_G3.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.OffsetDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tbl_schedule")
public class ScheduleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String scheduleTitle;
    private String candidateName;
    private OffsetDateTime scheduleTime;
    private OffsetDateTime timeStart;
    private OffsetDateTime timeEnd;
    private String result;
    private String notes;
    private String location;
    private String meeting;
    private String status;
    private Long candidateId;
    private Long recruiterId;
    private Long jobId;
}
