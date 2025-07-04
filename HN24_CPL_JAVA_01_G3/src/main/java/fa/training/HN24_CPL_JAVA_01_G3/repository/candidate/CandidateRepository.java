package fa.training.HN24_CPL_JAVA_01_G3.repository.candidate;

import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<CandidateEntity, Long> {
    List<CandidateEntity> findAllByIdIn(Collection<Long> ids);
    @Query("SELECT c FROM CandidateEntity c " +
            "LEFT JOIN c.position p " +
            "LEFT JOIN c.recruiter r " +
            "WHERE (:search IS NULL OR " +
            "c.fullName LIKE %:search% OR " +
            "c.email LIKE %:search% OR " +
            "c.phoneNumber LIKE %:search% OR " +
            "p.name LIKE %:search% OR " +
            "r.fullName LIKE %:search%) " +
            "AND c.deleted = false " +
            "AND (:status IS NULL OR c.status = :status)" +
            "ORDER BY c.id DESC")
    Page<CandidateEntity> findByCriteria(@Param("search") String search, @Param("status") String status, Pageable pageable);

    @Query("SELECT c FROM CandidateEntity c WHERE c.id IN :ids")
    List<CandidateEntity> findAllBy(List<Long> ids);

    Boolean existsByEmail(String email);
}
