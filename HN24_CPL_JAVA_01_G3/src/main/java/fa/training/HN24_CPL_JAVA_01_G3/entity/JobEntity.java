package fa.training.HN24_CPL_JAVA_01_G3.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.checkerframework.common.aliasing.qual.Unique;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tbl_job")
public class JobEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String jobTitle;
    @Column(precision = 19, scale = 2)
    private BigDecimal salaryRangeFrom;
    @Column(precision = 19, scale = 2)
    private BigDecimal salaryRangeTo;
    private String workingAddress;
    private String description;
    private String status;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    @CreationTimestamp
    private OffsetDateTime createdAt;
    @UpdateTimestamp
    private OffsetDateTime updatedAt;
    private String updatedBy;
    private Boolean deleted;
}
