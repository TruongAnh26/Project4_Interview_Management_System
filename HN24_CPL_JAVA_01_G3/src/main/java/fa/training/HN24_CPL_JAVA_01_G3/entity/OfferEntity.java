package fa.training.HN24_CPL_JAVA_01_G3.entity;

import fa.training.HN24_CPL_JAVA_01_G3.base.repo.BaseEntity;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tbl_offer")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class OfferEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long candidateId;
    private Long positionId;
    private Long approveId; // chỉ lấy account có type là MANAGER
    private Long scheduleId; // Interview Info
    private String interview;
    private String interviewers;
    @Column(name = "start_at")
    private OffsetDateTime from;
    @Column(name = "end_at")
    private OffsetDateTime to;
    private String interviewNote;
    private Long contractId;
    private Long levelId;
    private Long recruiterId;
    private Long departmentId;
    private OffsetDateTime dueDate; // >= current date
    private BigDecimal basicSalary;
    private String note;
    private String status;
    private OffsetDateTime createdAt;
    private Long updatedBy;
    private OffsetDateTime updatedAt;
}
