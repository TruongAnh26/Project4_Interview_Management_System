package fa.training.HN24_CPL_JAVA_01_G3.entity;


import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "tbl_skill")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SkillEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
}
