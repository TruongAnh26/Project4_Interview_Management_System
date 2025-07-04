package fa.training.HN24_CPL_JAVA_01_G3.repository.job;

import fa.training.HN24_CPL_JAVA_01_G3.entity.JobEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobEntity, Long> {
    List<JobEntity> findAllByIdIn(Collection<Long> ids);
    @Query("SELECT distinct j FROM JobEntity j " +
            "LEFT JOIN JobSkillMapEntity js ON j.id = js.jobId " +
            "LEFT JOIN SkillEntity s ON js.skillId = s.id " +
            "LEFT JOIN JobLevelMapEntity jl ON j.id = jl.jobId " +
            "LEFT JOIN LevelEntity l ON jl.levelId = l.id " +
            "WHERE (LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR CAST(j.startDate AS string) LIKE %:search% " +
            "OR CAST(j.endDate AS string) LIKE %:search% " +
            "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(l.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND j.deleted = false " +
            "AND (:status IS NULL OR LOWER(j.status) = LOWER(:status))")
    Page<JobEntity> searchJobs(@Param("search") String search, @Param("status") String status, Pageable pageable);

    @Query("SELECT j FROM JobEntity j " +
            "WHERE (:status IS NULL OR LOWER(j.status) = LOWER(:status)) " +
            "AND j.deleted = false")
    Page<JobEntity> searchJobsByStatusExist(@Param("status") String status, Pageable pageable);

    @Query("SELECT j FROM JobEntity j " +
            "WHERE :status like 'Open' " +
            "AND j.deleted = false")
    List<JobEntity> findJobStatusOpen();

    @Query("SELECT j FROM JobEntity j " +
            "WHERE j.startDate <= :now AND j.endDate >= :now " +
            "AND j.deleted = false")
    List<JobEntity> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(@Param("now") OffsetDateTime now);

    @Query("SELECT j FROM JobEntity j " +
            "WHERE j.endDate < :now " +
            "AND j.deleted = false")
    List<JobEntity> findByEndDateLessThan(OffsetDateTime now);

    @Query("SELECT j FROM JobEntity j WHERE j.deleted = false")
    List<JobEntity> findAllNonDeletedJobs();
}
