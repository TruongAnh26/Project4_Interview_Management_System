package fa.training.HN24_CPL_JAVA_01_G3.service.offer.get;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.department.DepartmentRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.offer.OfferRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.OfferMapper;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;


@AllArgsConstructor
@Service
public class GetOfferServiceImpl implements GetOfferService{
    private final CustomRepository customRepository;
    private final OfferMapper offerMapper;
    private final CandidateRepository candidateRepository;
    private final DepartmentRepository departmentRepository;
    private final AccountJPARepository accountJPARepository;
    @Override
    @Transactional(readOnly = true)
    public OfferDetailResponse getOfferBy(Long id) {
        OfferEntity offerEntity = customRepository.getOfferEntityBy(id);
        OfferDetailResponse offerResponse = offerMapper.getResponseBy(offerEntity);
        setMapValuesForOffer(offerResponse);
        return offerResponse;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OfferListResponse> getOffersBy(String search, Long departmentId,
                                               String status, Pageable pageable) {
        Page<OfferEntity> offerEntities = customRepository.getOffersBy(search, departmentId, status, pageable);
        return mapOfferEntitiesToOfferListResponse(offerEntities);
    }

    private Page<OfferListResponse> mapOfferEntitiesToOfferListResponse(Page<OfferEntity> offerEntities){
        Map<Long, CandidateEntity> candidateEntityMap = candidateRepository.findAllByIdIn(
                offerEntities.stream().map(OfferEntity::getCandidateId).distinct().collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(CandidateEntity::getId, Function.identity()));

        Map<Long, AccountEntity> approveEntityMap = accountJPARepository.findAllByIdIn(
                offerEntities.stream().map(OfferEntity::getApproveId).distinct().collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(AccountEntity::getId, Function.identity()));

        Map<Long, DepartmentEntity> departmentEntityMap = departmentRepository.findAllByIdIn(
                offerEntities.stream().map(OfferEntity::getDepartmentId).distinct().collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(DepartmentEntity::getId, Function.identity()));

        return offerEntities.map(offerEntity -> {
            OfferListResponse offerListResponse = offerMapper.getResponseListBy(offerEntity);
            CandidateEntity candidateEntity = candidateEntityMap.get(offerEntity.getCandidateId());
            offerListResponse.setCandidate(new IdAndName(candidateEntity.getId(), candidateEntity.getFullName()));
            offerListResponse.setEmail(candidateEntity.getEmail());

            AccountEntity approve = approveEntityMap.get(offerEntity.getApproveId());
            offerListResponse.setApprover(new IdAndName(approve.getId(), approve.getFullName()));

            DepartmentEntity departmentEntity = departmentEntityMap.get(offerEntity.getDepartmentId());
            offerListResponse.setDepartment(new IdAndName(departmentEntity.getId(), departmentEntity.getName()));

            return offerListResponse;
        });
    }


    private OfferDetailResponse setMapValuesForOffer(OfferDetailResponse offerResponse){
        LevelEntity levelEntity = customRepository.getLevelEntityBy(offerResponse.getLevelId());
        offerResponse.setLevel(new IdAndName(levelEntity.getId(), levelEntity.getName()));

        PositionEntity positionEntity = customRepository.getPositionEntityBy(offerResponse.getPositionId());
        offerResponse.setPosition(new IdAndName(positionEntity.getId(), positionEntity.getName()));

        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(offerResponse.getCandidateId());
        offerResponse.setCandidate(new IdAndName(candidateEntity.getId(), candidateEntity.getFullName()));

        AccountEntity approveEntity = customRepository.getAccountEntityBy(offerResponse.getApproveId());
        offerResponse.setApprover(new IdAndName(approveEntity.getId(), approveEntity.getFullName()));

        ContractTypeEntity contractTypeEntity = customRepository.getContractTypeEntityBy(offerResponse.getContractId());
        offerResponse.setContract(new IdAndName(contractTypeEntity.getId(), contractTypeEntity.getName()));

        DepartmentEntity departmentEntity = customRepository.getDepartmentEntityBy(offerResponse.getDepartmentId());
        offerResponse.setDepartment(new IdAndName(departmentEntity.getId(), departmentEntity.getName()));

        AccountEntity recruiterEntity = customRepository.getAccountEntityBy(offerResponse.getRecruiterId());
        offerResponse.setRecruiter(new IdAndName(recruiterEntity.getId(), recruiterEntity.getFullName()));

        return offerResponse;
    }
}
