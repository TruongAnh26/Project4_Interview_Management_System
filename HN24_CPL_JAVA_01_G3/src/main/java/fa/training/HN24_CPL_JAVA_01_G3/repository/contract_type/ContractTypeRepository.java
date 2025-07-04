package fa.training.HN24_CPL_JAVA_01_G3.repository.contract_type;

import fa.training.HN24_CPL_JAVA_01_G3.entity.ContractTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractTypeRepository extends JpaRepository<ContractTypeEntity, Long> {
}
