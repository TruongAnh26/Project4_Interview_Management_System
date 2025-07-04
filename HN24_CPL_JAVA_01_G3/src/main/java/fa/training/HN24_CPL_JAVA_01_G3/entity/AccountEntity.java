package fa.training.HN24_CPL_JAVA_01_G3.entity;

import fa.training.HN24_CPL_JAVA_01_G3.base.repo.BaseEntity;
import lombok.*;
import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tbl_account")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String fullName;
    private String email;
    private OffsetDateTime dob;
    private String address;
    private String phoneNumber;
    private String gender;
    private String role;
    private Long departmentId;
    private String status;
    private String note;
    private String usernamePreviousGenNumber;
}
