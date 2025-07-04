package fa.training.HN24_CPL_JAVA_01_G3.repository.custom;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.base.filter.Filter;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateMapResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobMapResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.benefit.BenefitRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.contract_type.ContractTypeRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.department.DepartmentRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job.JobRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.level.LevelRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.offer.OfferRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.position.PositionRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.schedule.ScheduleInteviewerMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.schedule.ScheduleRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.skill.SkillRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
@AllArgsConstructor
public class CustomRepository {
    private final ScheduleRepository scheduleRepository;
    private final LevelRepository levelRepository;
    private final OfferRepository offerRepository;
    private final PositionRepository positionRepository;
    private final CandidateRepository candidateRepository;
    private final AccountJPARepository accountJPARepository;
    private final ContractTypeRepository contractTypeRepository;
    private final DepartmentRepository departmentRepository;
    private final JobRepository jobRepository;
    private final ScheduleInteviewerMapRepository scheduleInteviewerMapRepository;
    private final EntityManager entityManager;
    private final SkillRepository skillRepository;
    private final BenefitRepository benefitRepository;

    public AccountEntity getAccountEntityBy(String email) {
        AccountEntity accountEntity = accountJPARepository.findByEmail(email);
        if (Objects.isNull(accountEntity)) {
            throw new RuntimeException(CodeAndMessage.ME102);
        }
        return accountEntity;
    }

    public DepartmentEntity getDepartmentEntityBy(Long id) {
        return departmentRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public ContractTypeEntity getContractTypeEntityBy(Long id) {
        return contractTypeRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public AccountEntity getAccountEntityBy(Long id) {
        return accountJPARepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public CandidateEntity getCandidateEntityBy(Long id) {
        return candidateRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public PositionEntity getPositionEntityBy(Long id) {
        return positionRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public OfferEntity getOfferEntityBy(Long id) {
        return offerRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public ScheduleEntity getScheduleEntityBy(Long id) {
        return scheduleRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public LevelEntity getLevelEntityBy(Long id) {
        return levelRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public SkillEntity getSkillEntityBy(Long id) {
        return skillRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public JobEntity getJobEntityBy(Long id) {
        return jobRepository.findById(id).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
    }

    public List<LevelEntity> getLevelEntitiesByIdIn(List<Long> ids) {
        List<LevelEntity> levelEntities = levelRepository.findAllByIdIn(ids);
        if (levelEntities.isEmpty()) {
            throw new RuntimeException(CodeAndMessage.ERR1);
        }
        return levelEntities;
    }

    public List<SkillEntity> getSkillEntitiesByIdIn(List<Long> ids) {
        List<SkillEntity> skillEntities = skillRepository.findAllByIdIn(ids);
        if (skillEntities.isEmpty()) {
            throw new RuntimeException(CodeAndMessage.ERR1);
        }
        return skillEntities;
    }

    public List<BenefitEntity> getBenefitEntitiesByIdIn(List<Long> ids) {
        List<BenefitEntity> benefitEntities = benefitRepository.findAllByIdIn(ids);
        if (benefitEntities.isEmpty()) {
            throw new RuntimeException(CodeAndMessage.ERR1);
        }
        return benefitEntities;
    }

    public Page<AccountEntity> getAccountBy(String search, String role, Pageable pageable) {
        return Filter.builder(AccountEntity.class, entityManager)
                .filter()
                .isEqual("role", role)
                .isContain("username", search)
                .getPage(pageable);
    }

    public Page<OfferEntity> getOffersBy(String search, Long departmentId, String status, Pageable pageable) {
        List<Long> candidateIds = null;
        if (Objects.nonNull(search)) {
            List<CandidateEntity> candidateEntities = Filter.builder(CandidateEntity.class, entityManager)
                    .filter()
                    .isEqual("departmentId", departmentId)
                    .isEqual("status", status)
                    .build().getList();

            candidateIds = candidateEntities.stream().map(CandidateEntity::getId).distinct().collect(Collectors.toList());
        }

        Page<OfferEntity> page = Filter.builder(OfferEntity.class, entityManager)
                .filter()
                .isEqual("departmentId", departmentId)
                .isEqual("status", status)
                .isIn("candidateId", candidateIds)
                .getPage(pageable);
        if (page.getContent().isEmpty()) {
            throw new RuntimeException(CodeAndMessage.ME008);
        }
        return page;
    }

    public Page<JobEntity> getJobsBy(String search, String status, Pageable pageable) {
        if (Objects.nonNull(search)) {
            return jobRepository.searchJobs(search, status, pageable);
        } else {
            return jobRepository.searchJobsByStatusExist(status, pageable);
        }
    }

    public Page<ScheduleEntity> getSchedulesBy(String search,
                                               Long interviewerId,
                                               String status,
                                               Pageable pageable) {
        List<Long> scheduleIdsParams = null;
       List<Long> scheduleIds = getScheduleByInterviewerId(interviewerId,scheduleIdsParams);
        return Filter.builder(ScheduleEntity.class, entityManager)
                .filter()
                .isIn("id", scheduleIds)
                .isContain("scheduleTitle", search)
                .isEqual("status", status)
                .getPage(pageable);
    }

   private List<Long> getScheduleByInterviewerId(Long interviewerId, List<Long> scheduleIds){
       if(Objects.nonNull(interviewerId)){
           List<ScheduleInterviewerMapEntity> scheduleInterviewerMap =
                   scheduleInteviewerMapRepository.findAllByInterviewerId(interviewerId);
           if (Objects.nonNull(scheduleInterviewerMap) && !scheduleInterviewerMap.isEmpty()){
               scheduleIds = scheduleInterviewerMap.stream().map(ScheduleInterviewerMapEntity::getScheduleId)
                       .distinct()
                       .collect(Collectors.toList());
           } else {
               scheduleIds = Arrays.asList(-1L);
           }
       }
       return scheduleIds;
   }

//    public Page<ScheduleEntity> getSchedulesBy(String search,
//                                               Long interviewerId,
//                                               String status,
//                                               Pageable pageable){
//        List<Long> schdeduleIds = null;
//        List<Long> scheduleIds = scheduleRepository.findAll()
//                .stream().map(ScheduleEntity::getId).collect(Collectors.toList());
//
//        List<Long> scheduleIdsByInterviewerIds = scheduleInteviewerMapRepository.findAllByInterviewerId(interviewerId).
//                stream().map(ScheduleInterviewerMapEntity::getScheduleId).collect(Collectors.toList());
//        if (Objects.nonNull(search)){
//            List<ScheduleEntity> scheduleEntities =  Filter.builder(ScheduleEntity.class, entityManager)
//                    .filter()
//                    .isEqual("id", scheduleIdsByInterviewerIds)
//                    .isEqual("status", status)
//                    .build().getList();
//
//            schdeduleIds = scheduleEntities.stream().map(ScheduleEntity::getId).distinct().collect(Collectors.toList());
//        }
//
//        Page<ScheduleEntity> page = Filter.builder(ScheduleEntity.class, entityManager)
//                .filter()
////                .isEqual("id", schdeduleIds)
//                .isEqual("status", status)
//                .isIn("id", schdeduleIds)
//                .getPage(pageable);
//        if (page.getContent().isEmpty()){
//            throw new RuntimeException(CodeAndMessage.ME008);
//        }
//        return page;
//    }

    public JobMapResponse getJobMaps() {
        List<IdAndName> skills = skillRepository.findAll().stream().map(skillEntity -> new IdAndName(skillEntity.getId(), skillEntity.getName())).collect(Collectors.toList());
        List<IdAndName> benefits = benefitRepository.findAll().stream().map(benefitEntity -> new IdAndName(benefitEntity.getId(), benefitEntity.getName())).collect(Collectors.toList());
        List<IdAndName> levels = levelRepository.findAll().stream().map(levelEntity -> new IdAndName(levelEntity.getId(), levelEntity.getName())).collect(Collectors.toList());
        return new JobMapResponse(skills, levels, benefits);
    }

    public CandidateMapResponse getCandidateMaps() {
        List<IdAndName> skills = skillRepository.findAll().stream().map(skillEntity -> new IdAndName(skillEntity.getId(), skillEntity.getName())).collect(Collectors.toList());
        List<IdAndName> positions = positionRepository.findAll().stream().map(positionEntity -> new IdAndName(positionEntity.getId(), positionEntity.getName())).collect(Collectors.toList());
        List<IdAndName> levels = levelRepository.findAll().stream().map(levelEntity -> new IdAndName(levelEntity.getId(), levelEntity.getName())).collect(Collectors.toList());
        List<IdAndName> jobs = jobRepository.findAllNonDeletedJobs().stream().map(jobEntity -> new IdAndName(jobEntity.getId(), jobEntity.getJobTitle())).collect(Collectors.toList());
        return new CandidateMapResponse(skills, levels, positions, jobs);
    }
}
