package fa.training.HN24_CPL_JAVA_01_G3.entity;


import lombok.*;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "tbl_map_candidate_job")
public class CandidateJobMapEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private CandidateEntity candidateEntity;

    private String status;
    @ManyToOne
    @JoinColumn(name = "job_id")
    private JobEntity JobEntity;
}
