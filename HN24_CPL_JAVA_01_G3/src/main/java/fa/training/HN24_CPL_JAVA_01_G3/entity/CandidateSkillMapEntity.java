package fa.training.HN24_CPL_JAVA_01_G3.entity;


import lombok.*;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "tbl_map_candidate_skill")
public class CandidateSkillMapEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String status;
    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private CandidateEntity candidateEntity;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    private SkillEntity skillEntity;
}
