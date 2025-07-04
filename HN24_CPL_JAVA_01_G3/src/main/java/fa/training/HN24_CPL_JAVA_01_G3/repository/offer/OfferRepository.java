package fa.training.HN24_CPL_JAVA_01_G3.repository.offer;

import fa.training.HN24_CPL_JAVA_01_G3.entity.OfferEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<OfferEntity, Long> {
    @Query(value = "select  u from OfferEntity u where u.from >= :startDate and u.to <= :endDate")
    List<OfferEntity> findAllBetweenDates(OffsetDateTime startDate, OffsetDateTime endDate);

}
