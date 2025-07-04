package fa.training.HN24_CPL_JAVA_01_G3.service.job;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.TokenHelper;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.JobStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.*;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.benefit.BenefitRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job.JobRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job_benefit_map.JobBenefitMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job_level_map.JobLevelMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job_skill_map.JobSkillMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.level.LevelRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.skill.SkillRepository;
import fa.training.HN24_CPL_JAVA_01_G3.validation.JobValidationHelper;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class JobServiceImpl implements JobService {
    private final CustomRepository customRepository;
    private final JobMapper jobMapper;
    private final SkillRepository skillRepository;
    private final JobSkillMapRepository jobSkillMapRepository;
    private final JobLevelMapRepository jobLevelMapRepository;
    private final JobBenefitMapRepository jobBenefitMapRepository;
    private final LevelRepository levelRepository;
    private final JobRepository jobRepository;
    private final AccountJPARepository accountJPARepository;
    private final BenefitRepository benefitRepository;


    @Override
    @Transactional(readOnly = true)
    public Page<JobListResponse> getJobsBy(String search, String status, Pageable pageable) {
        if (!pageable.getSort().isSorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "updatedAt"));
        }
        Page<JobEntity> jobEntities = customRepository.getJobsBy(search, status, pageable);

        return jobEntities.map(jobEntity -> {
            JobListResponse jobListResponse = jobMapper.getResponseListBy(jobEntity);

            List<SkillEntity> skillEntities = skillRepository.findAllByIdIn(
                    jobSkillMapRepository.findAllByJobId(jobEntity.getId())
                            .stream().map(JobSkillMapEntity::getSkillId)
                            .collect(Collectors.toList())
            );
            List<IdAndName> requiredSkills = skillEntities.stream()
                    .map(skillEntity -> new IdAndName(skillEntity.getId(), skillEntity.getName()))
                    .collect(Collectors.toList());
            jobListResponse.setRequiredSkills(requiredSkills);

            List<LevelEntity> levelEntities = levelRepository.findAllByIdIn(
                    jobLevelMapRepository.findJobLevelMapEntitiesByJobId(jobEntity.getId())
                            .stream().map(JobLevelMapEntity::getLevelId)
                            .collect(Collectors.toList())
            );
            List<IdAndName> levels = levelEntities.stream()
                    .map(levelEntity -> new IdAndName(levelEntity.getId(), levelEntity.getName()))
                    .collect(Collectors.toList());
            jobListResponse.setLevel(levels);

            return jobListResponse;
        });
    }

    @Override
    @Transactional
    public SuccessResponse createJob(String accessToken, JobRequest jobRequest) {
        JobValidationHelper.createValidate(jobRequest);
        checkJobTitleExisted(jobRequest.getJobTitle());
        JobEntity jobEntity = jobMapper.getEntityBy(jobRequest);
        setStatusForJobWhenCreate(jobEntity);
        setUpdatedByForJob(jobEntity, accessToken);
        setDeletedFalseForJobWhenCreate(jobEntity);
        jobRepository.save(jobEntity);
        createJobMap(jobEntity.getId(), jobRequest.getLevelIds(), jobRequest.getBenefitIds(), jobRequest.getSkillIds());
        return SuccessHandle.success(CodeAndMessage.ME016);
    }

    @Override
    @Transactional
    public SuccessResponse updateJob(String accessToken, Long id, JobRequest jobRequest) {
        JobValidationHelper.updateValidate(jobRequest);
        JobEntity jobEntityExisted = customRepository.getJobEntityBy(id);
        if (!Objects.equals(jobRequest.getJobTitle(), jobEntityExisted.getJobTitle())) {
            checkJobTitleExisted(jobRequest.getJobTitle());
        }
        BeanUtils.copyProperties(jobRequest, jobEntityExisted, "deleted");
        setStatusWhenUpdateOrImportForJob(jobRequest, jobEntityExisted);
        setUpdatedByForJob(jobEntityExisted, accessToken);
        jobRepository.save(jobEntityExisted);
        updateJobMap(id, jobRequest.getLevelIds(), jobRequest.getBenefitIds(), jobRequest.getSkillIds());
        return SuccessHandle.success(CodeAndMessage.ME014);
    }

    @Override
    @Transactional
    public JobMapResponse getJobMapForCreateJob() {
        return customRepository.getJobMaps();
    }

    @Override
    @Transactional
    public JobDetailAndJobMapResponse getJobDetailAndJobMapToUpdate(Long id) {
        JobDetailAndJobMapResponse jobDetailAndJobMapResponse = new JobDetailAndJobMapResponse();
        JobEntity jobEntity = customRepository.getJobEntityBy(id);
        JobDetailResponse jobDetailResponse = jobMapper.getResponseBy(jobEntity);
        setMapValuesForJob(jobDetailResponse, id);
        jobDetailAndJobMapResponse.setJobDetail(jobDetailResponse);
        jobDetailAndJobMapResponse.setJobMap(customRepository.getJobMaps());
        return jobDetailAndJobMapResponse;
    }

    public List<JobRequest> parseExcelFile(MultipartFile file) throws IOException {
        List<JobRequest> jobRequests = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            if (row.getRowNum() == 0) {
                continue;
            }
            String jobTitle = row.getCell(0).getStringCellValue();
            OffsetDateTime startDate = OffsetDateTime.parse(row.getCell(1).getStringCellValue(), DateTimeFormatter.ISO_DATE_TIME);
            OffsetDateTime endDate = OffsetDateTime.parse(row.getCell(2).getStringCellValue(), DateTimeFormatter.ISO_DATE_TIME);
            String description = row.getCell(3).getStringCellValue();
            BigDecimal salaryRangeFrom = BigDecimal.valueOf(row.getCell(4).getNumericCellValue());
            BigDecimal salaryRangeTo = BigDecimal.valueOf(row.getCell(5).getNumericCellValue());
            String workingAddress = row.getCell(6).getStringCellValue();

            List<String> levelNames = Arrays.asList(row.getCell(7).getStringCellValue().split(","));
            List<Long> levelIds = levelRepository.findLevelEntitiesByNameIn(levelNames).stream().map(LevelEntity::getId).collect(Collectors.toList());

            List<String> benefitNames = Arrays.asList(row.getCell(8).getStringCellValue().split(","));
            List<Long> benefitIds = benefitRepository.findBenefitEntitiesByNameIn(benefitNames).stream().map(BenefitEntity::getId).collect(Collectors.toList());

            List<String> skillNames = Arrays.asList(row.getCell(9).getStringCellValue().split(","));
            List<Long> skillIds = skillRepository.findSkillEntitiesByNameIn(skillNames).stream().map(SkillEntity::getId).collect(Collectors.toList());

            jobRequests.add(new JobRequest(jobTitle, startDate, endDate, levelIds, benefitIds, skillIds, description, salaryRangeFrom, salaryRangeTo, workingAddress));
        }

        workbook.close();
        return jobRequests;
    }

    @Override
    @Transactional
    public SuccessResponse importJobs(String accessToken, MultipartFile file) throws IOException {
        List<JobRequest> jobRequests = parseExcelFile(file);

        jobRequests.forEach(jobRequest -> {
            try {
                JobValidationHelper.createValidate(jobRequest);
                checkJobTitleExisted(jobRequest.getJobTitle());
                JobEntity jobEntity = jobMapper.getEntityBy(jobRequest);
                setStatusWhenUpdateOrImportForJob(jobRequest, jobEntity);
                setUpdatedByForJob(jobEntity, accessToken);
                setDeletedFalseForJobWhenCreate(jobEntity);
                jobRepository.save(jobEntity);
                createJobMap(jobEntity.getId(), jobRequest.getLevelIds(), jobRequest.getBenefitIds(), jobRequest.getSkillIds());
            } catch (Exception e) {
                return;
            }
        });

        return SuccessHandle.success(CodeAndMessage.ME0161);
    }

    @Override
    @Transactional(readOnly = true)
    public JobDetailResponse getJobById(Long id) {
        JobEntity jobEntity = customRepository.getJobEntityBy(id);
        JobDetailResponse jobDetailResponse = jobMapper.getResponseBy(jobEntity);
        setMapValuesForJob(jobDetailResponse, id);
        return jobDetailResponse;
    }

    @Override
    @Transactional
    public SuccessResponse deleteJob(Long id) {
        JobEntity jobEntity = customRepository.getJobEntityBy(id);
        jobEntity.setDeleted(true);
        jobRepository.save(jobEntity);
        return SuccessHandle.success(CodeAndMessage.ME019);
    }

    private void setStatusForJobWhenCreate(JobEntity jobEntity) {
        OffsetDateTime now = OffsetDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDate().atStartOfDay().atOffset(ZoneOffset.UTC);
        if (jobEntity.getStartDate().isEqual(now)) {
            jobEntity.setStatus(JobStatusEnum.OPEN.name());
        } else {
            jobEntity.setStatus(JobStatusEnum.DRAFT.name());
        }
    }

    private void setUpdatedByForJob(JobEntity jobEntity, String accessToken) {
        Long userId = TokenHelper.getUserIdFromToken(accessToken);
        String username = accountJPARepository.findFirstById(userId).getUsername();
        jobEntity.setUpdatedBy(username);
    }

    private void setStatusWhenUpdateOrImportForJob(JobRequest jobRequest, JobEntity jobEntity) {
        OffsetDateTime now = OffsetDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDate().atStartOfDay().atOffset(ZoneOffset.UTC);
        if (!jobRequest.getStartDate().isAfter(now) && !jobRequest.getEndDate().isBefore(now)) {
            jobEntity.setStatus(JobStatusEnum.OPEN.name());
        } else if (jobRequest.getEndDate().isBefore(now)) {
            jobEntity.setStatus(JobStatusEnum.CLOSED.name());
        } else if (jobRequest.getStartDate().isAfter(now)) {
            jobEntity.setStatus(JobStatusEnum.DRAFT.name());
        }
    }

    private void setDeletedFalseForJobWhenCreate(JobEntity jobEntity) {
        jobEntity.setDeleted(false);
    }

    private void createJobMap(Long jobId, List<Long> levelIds, List<Long> benefitIds, List<Long> skillIds) {
        for (Long levelId : levelIds) {
            jobLevelMapRepository.save(
                    JobLevelMapEntity.builder()
                            .levelId(levelId)
                            .jobId(jobId)
                            .build()
            );
        }
        for (Long benefitId : benefitIds) {
            jobBenefitMapRepository.save(
                    JobBenefitMapEntity.builder()
                            .benefitId(benefitId)
                            .jobId(jobId)
                            .build()
            );
        }
        for (Long skillId : skillIds) {
            jobSkillMapRepository.save(
                    JobSkillMapEntity.builder()
                            .skillId(skillId)
                            .jobId(jobId)
                            .build()
            );
        }
    }

    private void updateJobMap(Long jobId, List<Long> levelIds, List<Long> benefitIds, List<Long> skillIds) {
        deleteJobMaps(jobId);
        createJobMap(jobId, levelIds, benefitIds, skillIds);
    }

    private void deleteJobMaps(Long jobId) {
        jobLevelMapRepository.deleteJobLevelMapEntitiesByJobId(jobId);
        jobSkillMapRepository.deleteJobSkillMapEntitiesByJobId(jobId);
        jobBenefitMapRepository.deleteJobBenefitMapEntitiesByJobId(jobId);
    }

    private void setMapValuesForJob(JobDetailResponse jobDetailResponse, Long jobId) {
        List<Long> levelIdsForJob = jobLevelMapRepository.findJobLevelMapEntitiesByJobId(jobId).stream()
                .map(JobLevelMapEntity::getLevelId).collect(Collectors.toList());
        List<LevelEntity> levelEntities = customRepository.getLevelEntitiesByIdIn(levelIdsForJob);
        List<IdAndName> levels = levelEntities.stream()
                .map(levelEntity -> new IdAndName(levelEntity.getId(), levelEntity.getName()))
                .collect(Collectors.toList());
        List<String> levelNames = levelEntities.stream().map(LevelEntity::getName).collect(Collectors.toList());
        jobDetailResponse.setLevels(levels);
        jobDetailResponse.setLevelNames(levelNames);

        List<Long> skillIdsForJob = jobSkillMapRepository.findAllByJobId(jobId).stream()
                .map(JobSkillMapEntity::getSkillId).collect(Collectors.toList());
        List<SkillEntity> skillEntities = customRepository.getSkillEntitiesByIdIn(skillIdsForJob);
        List<IdAndName> skills = skillEntities.stream()
                .map(skillEntity -> new IdAndName(skillEntity.getId(), skillEntity.getName()))
                .collect(Collectors.toList());
        List<String> skillNames = skillEntities.stream().map(SkillEntity::getName).collect(Collectors.toList());
        jobDetailResponse.setSkills(skills);
        jobDetailResponse.setSkillNames(skillNames);

        List<Long> benefitIdsForJob = jobBenefitMapRepository.findAllByJobId(jobId).stream()
                .map(JobBenefitMapEntity::getBenefitId).collect(Collectors.toList());
        List<BenefitEntity> benefitEntities = customRepository.getBenefitEntitiesByIdIn(benefitIdsForJob);
        List<IdAndName> benefits = benefitEntities.stream()
                .map(benefitEntity -> new IdAndName(benefitEntity.getId(), benefitEntity.getName()))
                .collect(Collectors.toList());
        List<String> benefitNames = benefitEntities.stream().map(BenefitEntity::getName).collect(Collectors.toList());
        jobDetailResponse.setBenefits(benefits);
        jobDetailResponse.setBenefitNames(benefitNames);
    }

    @Override
    public void updateJobStatuses() {
        OffsetDateTime now = OffsetDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDate().atStartOfDay().atOffset(ZoneOffset.UTC);

        List<JobEntity> draftJobs = jobRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(now);
        draftJobs.forEach(job -> {
            job.setStatus("OPEN");
            jobRepository.save(job);
        });

        List<JobEntity> openJobs = jobRepository.findByEndDateLessThan(now);
        openJobs.forEach(job -> {
            job.setStatus("CLOSED");
            jobRepository.save(job);
        });
    }

    private void checkJobTitleExisted(String jobTitleInRequest) {
        List<String> jobTitles = jobRepository.findAllNonDeletedJobs().stream().map(JobEntity::getJobTitle).collect(Collectors.toList());
        if (jobTitles.contains(jobTitleInRequest)) {
            throw new RuntimeException(CodeAndMessage.ME015);
        }
    }
}
