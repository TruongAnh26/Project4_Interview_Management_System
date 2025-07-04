package fa.training.HN24_CPL_JAVA_01_G3.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tbl_candidate")
public class CandidateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private LocalDate dob;
    private String phoneNumber;
    private String email;
    private String address;
    private String gender;
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String cvAttachment;
    private String note;
    private String status;
    private Long yearOfExperience;
    private String highestLevel;
    private boolean deleted = false;
    @ManyToOne
    @JoinColumn(name = "position_id")
    private PositionEntity position;
    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private AccountEntity recruiter;
}
