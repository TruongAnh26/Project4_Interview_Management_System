package fa.training.HN24_CPL_JAVA_01_G3.service.schedule;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.ScheduleStatusEnums;
import fa.training.HN24_CPL_JAVA_01_G3.dto.candidate.response.CandidateListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.*;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate_job_map.CandidateJobMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job.JobRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job_benefit_map.JobBenefitMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job_level_map.JobLevelMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.job_skill_map.JobSkillMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.schedule.ScheduleInteviewerMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.schedule.ScheduleRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.account.AccountMapper;
import fa.training.HN24_CPL_JAVA_01_G3.service.candidate.CandidateMapperImpl;
import fa.training.HN24_CPL_JAVA_01_G3.service.job.JobMapper;
import fa.training.HN24_CPL_JAVA_01_G3.validation.ScheduleValidateHelper;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
    private final ScheduleMapper scheduleMapper;
    private final ScheduleRepository scheduleRepository;
    private final ScheduleInteviewerMapRepository scheduleInterviewerMapRepository;
    private final AccountJPARepository accountJPARepository;
    private final CandidateRepository candidateRepository;
    private final CustomRepository customRepository;
    private final JobRepository jobRepository;
    private final CandidateJobMapRepository candidateJobMapRepository;
    private final JavaMailSender javaMailSender;
    private final AccountMapper accountMapper;
    private final JobMapper jobMapper;
    private final JobSkillMapRepository jobSkillMapRepository;
    private final JobBenefitMapRepository jobBenefitMapRepository;
    private JobLevelMapRepository jobLevelMapRepository;
    private CandidateMapperImpl candidateMapper;

    @Transactional
    @Override
//    @Scheduled(cron = "0 0 17 * * ?")
    @Scheduled(fixedRate = 500000)
    public void UpdateStatusWhenDueDate(){
        List<ScheduleEntity> scheduleEntityList = scheduleRepository.findAllByStatus(ScheduleStatusEnums.Invited.name());

        LocalDate today = LocalDate.now();
        LocalDate twoDaysFromNow = today.minusDays(1);

        for (ScheduleEntity schedule : scheduleEntityList) {
            OffsetDateTime scheduleDate = schedule.getScheduleTime();
            LocalDate scheduleLocalDate = scheduleDate.toLocalDate();

            if (twoDaysFromNow.isAfter(scheduleLocalDate) && !schedule.getStatus().equals(ScheduleStatusEnums.Cancelled)) {
                schedule.setStatus(ScheduleStatusEnums.Closed.name());
                scheduleRepository.save(schedule);
            }
        }
    }


    @Transactional
    @Override
    public Page<CandidateListResponse> getCandidateHasJob(String search, String status, String accessToken, Pageable pageable) {
        Page<CandidateEntity> candidateEntities = candidateRepository.findByCriteria(search, status, pageable);
        List<Long> candidateIds = candidateEntities.stream().map(CandidateEntity::getId).collect(Collectors.toList());
        List<CandidateJobMapEntity> candidateJobMapEntities = candidateJobMapRepository
                .findAllJobsByCandidateIdAndStatus(candidateIds);
        List<CandidateEntity> candidateEntitiesHasOpenJob = candidateRepository
                .findAllByIdIn(candidateJobMapEntities.stream()
                        .map(candidateJobMapEntity -> candidateJobMapEntity.getCandidateEntity().getId())
                        .collect(Collectors.toList()));
        List<CandidateListResponse> candidateListResponses = candidateEntitiesHasOpenJob.stream().map(
                candidateEntity -> candidateMapper.getCandidateListResponse(candidateEntity)
        ).collect(Collectors.toList());

        return new PageImpl<>(candidateListResponses, pageable, candidateEntities.getTotalElements());
    }

    @Transactional(readOnly = true)
    @Override
    public JobCandidateResponse getJobsByCandidateId(String accessToken, Long candidateId) {
        List<CandidateJobMapEntity> candidateJobsMapEntities = candidateJobMapRepository.
                findJobsByCandidateIdAndStatus(candidateId);
        List<Long> jobIds = candidateJobsMapEntities.stream().map(
           candidateJobMapEntity -> candidateJobMapEntity.getJobEntity().getId()
        ).collect(Collectors.toList());
        List<JobScheduleResponse> jobScheduleResponses = jobRepository.findAllByIdIn(jobIds)
                .stream().map(jobMapper::getJobOfSchedule).collect(Collectors.toList());
        return JobCandidateResponse.builder()
                .candidateId(candidateId)
                .jobs(jobScheduleResponses).build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<IdAndName> getJobStatusOpen() {
        return jobRepository.findJobStatusOpen().stream().map(jobEntity ->
                IdAndName.builder()
                        .id(jobEntity.getId())
                        .name(jobEntity.getJobTitle())
                        .build()).collect(Collectors.toList()
        );
    }

    @Override
    @Transactional
    public SuccessResponse createSchedule(String accessToken, ScheduleRequest scheduleRequest){
        ScheduleValidateHelper.createValidate(scheduleRequest);
        ScheduleEntity scheduleEntity = scheduleMapper.getEtEntityFromRequest(scheduleRequest);
        setStatusForSchedule(scheduleEntity, ScheduleStatusEnums.Open.name());
        CandidateEntity candidateEntity = candidateRepository.findById(scheduleEntity.getCandidateId()).orElseThrow(
                () -> new RuntimeException(CodeAndMessage.ERR1)
        );
        scheduleEntity.setRecruiterId(candidateEntity.getRecruiter().getId());
        scheduleRepository.save(scheduleEntity);
        createScheduleMapInterviewer(scheduleRequest.getInterviewerIds(), scheduleEntity.getId());
        setStatusForCandidate(scheduleEntity.getCandidateId(), Common.WAITING_TO_INTERVIEW);

        // set status job show in candidate to closed
        CandidateJobMapEntity candidateJobMapEntity = candidateJobMapRepository.
                findByCandidateIdAndJobId(scheduleEntity.getCandidateId(), scheduleEntity.getJobId());
        candidateJobMapEntity.setStatus(ScheduleStatusEnums.Closed.name());

        // send email
        DetailScheduleResponse detailScheduleResponse = getDetailSchedule(scheduleEntity.getId());
        List<String> emailsOfInterviewer = accountJPARepository.findAllByIdIn(
                scheduleInterviewerMapRepository.findAllByScheduleId(scheduleEntity.getId()).stream()
                        .map(ScheduleInterviewerMapEntity::getInterviewerId).collect(Collectors.toList())
        ).stream().map(AccountEntity::getEmail).collect(Collectors.toList());
        String emailOfsCandidate = customRepository.getCandidateEntityBy(scheduleEntity.getCandidateId()).getEmail();
        emailsOfInterviewer.add(emailOfsCandidate); //merge email interviewer and candidate
        for (String email : emailsOfInterviewer) {
            CompletableFuture.runAsync(() -> {
                try {
                    sendEmail(email, "Interview Schedule", generateEmailContent(detailScheduleResponse), null);
                } catch (MessagingException | UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
            });
        }
        setStatusForSchedule(scheduleEntity, ScheduleStatusEnums.Invited.name());

        return SuccessHandle.success(CodeAndMessage.ME022);
    }

    @Override
    @Transactional
    public SuccessResponse updateSchedule(String accessToken, Long scheduleId, UpdateScheduleRequest updateScheduleRequest) {
        ScheduleValidateHelper.updateValidate(updateScheduleRequest);
        ScheduleEntity scheduleEntity = customRepository.getScheduleEntityBy(scheduleId);
        if (Objects.isNull(scheduleEntity)) throw new RuntimeException(CodeAndMessage.ERR1);
        scheduleMapper.updateEntity(scheduleEntity, updateScheduleRequest);
        scheduleRepository.save(scheduleEntity);
        updateScheduleInterviewerMap(scheduleId, updateScheduleRequest.getInterviewerIds());
        return SuccessHandle.success(CodeAndMessage.ME014);
    }

    @Override
    @Transactional
    public SuccessResponse cancelScheduleInterview(String accessToken, Long scheduleId) {
        ScheduleEntity scheduleEntity = customRepository.getScheduleEntityBy(scheduleId);
        if (Objects.isNull(scheduleEntity)) throw new RuntimeException(CodeAndMessage.ERR1);
        if (Boolean.FALSE.equals(checkOpenStatusOfSchedule(scheduleEntity)))
            throw new RuntimeException(CodeAndMessage.ER099);
        setStatusForSchedule(scheduleEntity, ScheduleStatusEnums.Cancelled.name());
        scheduleRepository.save(scheduleEntity);
        return SuccessHandle.success(CodeAndMessage.ME099);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ScheduleResponse> getSchedulesBySearch(String search, Long interviewerId,
                                                       String status, Pageable pageable) {
        Page<ScheduleEntity> scheduleEntities = customRepository.getSchedulesBy(search, interviewerId, status, pageable);
//        if (scheduleEntities.isEmpty()) throw new RuntimeException(CodeAndMessage.ERR1);
        List<Long> scheduleIds = scheduleEntities.stream()
                .map(ScheduleEntity::getId).collect(Collectors.toList());
        Map<Long, List<InterviewerScheduleResponse>> scheduleIdsInterviewerNameMap = getInterviewerAccountByScheduleIds(scheduleIds);

        Map<Long, String> candidateNameByScheduleIdsMap = getCandidateNameByScheduleIds(scheduleEntities);

        return scheduleEntities.map(
                scheduleEntity -> {
                    ScheduleResponse scheduleResponse = scheduleMapper.getResponseFrom(scheduleEntity);
                    scheduleResponse.setCandidateName(candidateNameByScheduleIdsMap.get(scheduleEntity.getCandidateId()));
                    scheduleResponse.setInterviewerInformation(scheduleIdsInterviewerNameMap.get(scheduleEntity.getId()));
                    scheduleResponse.setTimeSchedule(formatTimeSchedule(scheduleEntity));
                    scheduleResponse.setJobScheduleResponse(
                            jobMapper.getJobOfSchedule(customRepository.getJobEntityBy(scheduleEntity.getJobId()))
                    );
                    return scheduleResponse;
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ScheduleResponse> getListSchedule(String accessToken, Pageable pageable) {
        Page<ScheduleEntity> scheduleEntities = scheduleRepository.findAll(pageable);
        if (scheduleEntities.isEmpty()) throw new RuntimeException(CodeAndMessage.ERR1);
        List<Long> scheduleIds = scheduleEntities.stream()
                .map(ScheduleEntity::getId).collect(Collectors.toList());
        Map<Long, List<InterviewerScheduleResponse>> scheduleIdsInterviewerNameMap = getInterviewerAccountByScheduleIds(scheduleIds);

        Map<Long, String> candidateNameByScheduleIdsMap = getCandidateNameByScheduleIds(scheduleEntities);

        Map<Long, JobScheduleResponse> jobNameByScheduleIdsMap = getJobNameByScheduleIds(scheduleEntities);
        return scheduleEntities.map(
                scheduleEntity -> {
                    ScheduleResponse scheduleResponse = scheduleMapper.getResponseFrom(scheduleEntity);
                    scheduleResponse.setCandidateName(candidateNameByScheduleIdsMap.get(scheduleEntity.getCandidateId()));
                    scheduleResponse.setInterviewerInformation(scheduleIdsInterviewerNameMap.get(scheduleEntity.getId()));
                    scheduleResponse.setTimeSchedule(formatTimeSchedule(scheduleEntity));
                    scheduleResponse.setJobScheduleResponse(jobNameByScheduleIdsMap.get(scheduleEntity.getJobId()));
                    return scheduleResponse;
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public DetailScheduleResponse getDetailSchedule(String accessToken, Long scheduleId) {
        ScheduleEntity scheduleEntity = customRepository.getScheduleEntityBy(scheduleId);
        if (Objects.isNull(scheduleEntity)) throw new RuntimeException(CodeAndMessage.ERR1);
        AccountEntity recruiterInfor = customRepository.getAccountEntityBy(
                scheduleEntity.getRecruiterId()
        );
        Map<Long, List<IdAndName>> scheduleIdsInterviewerNameMap = getInterviewerNameBySingleScheduleId(scheduleId);
        String candidateName = customRepository.getCandidateEntityBy(scheduleEntity.getCandidateId()).getFullName();
        DetailScheduleResponse detailScheduleResponse = scheduleMapper.getDetailResponseFrom(scheduleEntity);
        detailScheduleResponse.setCandidateInformation(IdAndName.builder()
                        .id(scheduleEntity.getCandidateId())
                        .name(candidateName)
                .build());
        detailScheduleResponse.setJobInformation(IdAndName.builder()
                        .id(scheduleEntity.getJobId())
                        .name(customRepository.getJobEntityBy(scheduleEntity.getJobId()).getJobTitle())
                .build());
        detailScheduleResponse.setInterviewerInformation(scheduleIdsInterviewerNameMap.get(scheduleEntity.getId()));
        detailScheduleResponse.setTimeSchedule(formatTimeSchedule(scheduleEntity));
        detailScheduleResponse.setRecruiterInformation(IdAndName.builder()
                .id(recruiterInfor.getId())
                .name(recruiterInfor.getUsername())
                .build());
        return detailScheduleResponse;
    }

    @Override
    @Transactional
    public SuccessResponse sendInterviewResult(String accessToken, Long scheduleId, ResultInterviewRequest resultInterviewRequest) {
        ScheduleEntity scheduleEntity = customRepository.getScheduleEntityBy(scheduleId);
        if (Objects.isNull(scheduleEntity)) throw new RuntimeException(CodeAndMessage.ERR1);
        scheduleMapper.updateInterviewResult(scheduleEntity, resultInterviewRequest);
        scheduleRepository.save(scheduleEntity);
        setStatusForSchedule(scheduleEntity, ScheduleStatusEnums.Closed.name());
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(scheduleEntity.getCandidateId());
        candidateEntity.setStatus(scheduleEntity.getStatus().equals(Common.FAILED) ?
                Common.FAILED_INTERVIEWED : Common.PASSED_INTERVIEWED
        );
        candidateRepository.save(candidateEntity);
        return SuccessHandle.success(CodeAndMessage.ME014);
    }

    private Boolean checkOpenStatusOfSchedule(ScheduleEntity scheduleEntity) {
        return scheduleEntity.getStatus().equals(ScheduleStatusEnums.Open.name())||
                scheduleEntity.getStatus().equals(ScheduleStatusEnums.Invited.name());
    }

    private void setStatusForCandidate(Long candidateId, String status) {
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(candidateId);
        if (Objects.isNull(candidateEntity)) throw new RuntimeException(CodeAndMessage.ERR1);
        candidateEntity.setStatus(status);
        candidateRepository.save(candidateEntity);
    }

    private Map<Long, String> getCandidateNameByScheduleIds(Page<ScheduleEntity> scheduleEntities) {
        List<Long> candidateIds = scheduleEntities.stream().map(
                ScheduleEntity::getCandidateId
        ).collect(Collectors.toList());

        return candidateRepository.findAllBy(candidateIds).stream().collect(Collectors.toMap(
                CandidateEntity::getId, CandidateEntity::getFullName
        ));
    }

    private Map<Long, JobScheduleResponse> getJobNameByScheduleIds(Page<ScheduleEntity> scheduleEntities) {
        List<Long> jobIds = scheduleEntities.stream().map(
                ScheduleEntity::getJobId
        ).collect(Collectors.toList());

        return jobRepository.findAllByIdIn(jobIds).stream().collect(Collectors.toMap(
                JobEntity::getId, jobMapper::getJobOfSchedule
        ));
    }


    public static String formatTimeSchedule(ScheduleEntity scheduleEntity) {
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        OffsetDateTime scheduleTime = scheduleEntity.getScheduleTime();
        OffsetDateTime timeStart = scheduleEntity.getTimeStart();
        OffsetDateTime timeEnd = scheduleEntity.getTimeEnd();
        return scheduleTime.format(dayFormatter) + " " + timeStart.format(timeFormatter) + "-" + timeEnd.format(timeFormatter);
    }

    private Map<Long, List<InterviewerScheduleResponse>> getInterviewerAccountByScheduleIds(List<Long> scheduleIds) {
        Map<Long, InterviewerScheduleResponse> interviewerAccountIdsMap = accountJPARepository.findAllByIdIn(
                scheduleInterviewerMapRepository.findByScheduleIdIn(scheduleIds).stream()
                        .map(ScheduleInterviewerMapEntity::getInterviewerId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(AccountEntity::getId, accountMapper::getInterviewerInfor));

        return scheduleInterviewerMapRepository.findAllByScheduleIdIn(scheduleIds).stream()
                .collect(Collectors.groupingBy(
                        ScheduleInterviewerMapEntity::getScheduleId,
                        Collectors.mapping(scheduleInterviewerMapEntity ->
                                interviewerAccountIdsMap.get(scheduleInterviewerMapEntity.getInterviewerId()), Collectors.toList())
                ));
    }

    private Map<Long, List<IdAndName>> getInterviewerNameBySingleScheduleId(Long scheduleId) {
        Map<Long, IdAndName> interviewerNameIdsMap = accountJPARepository.findAllByIdIn(
                scheduleInterviewerMapRepository.findAllByScheduleId(scheduleId).stream()
                        .map(ScheduleInterviewerMapEntity::getInterviewerId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(AccountEntity::getId,
                accountEntity -> IdAndName.builder()
                .id(accountEntity.getId())
                .name(accountEntity.getUsername())
                .build())
        );

        return scheduleInterviewerMapRepository.findAllByScheduleId(scheduleId).stream()
                .collect(Collectors.groupingBy(
                        ScheduleInterviewerMapEntity::getScheduleId,
                        Collectors.mapping(scheduleInterviewerMapEntity ->
                                interviewerNameIdsMap.get(scheduleInterviewerMapEntity.getInterviewerId()), Collectors.toList()) // Giá trị là danh sách các interviewerId
                ));
    }

    private void updateScheduleInterviewerMap(Long scheduleId, List<Long> newInterviewerIds) {
        scheduleInterviewerMapRepository.deleteAllByScheduleId(scheduleId);
        for (Long interviewerId : newInterviewerIds) {
            scheduleInterviewerMapRepository.save(
                    ScheduleInterviewerMapEntity.builder()
                            .interviewerId(interviewerId)
                            .scheduleId(scheduleId)
                            .build()
            );
        }
    }

    private void createScheduleMapInterviewer(List<Long> interviewerIds, Long scheduleId) {
        for (Long id : interviewerIds) {
            scheduleInterviewerMapRepository.save(
                    ScheduleInterviewerMapEntity.builder()
                            .interviewerId(id)
                            .scheduleId(scheduleId)
                            .build()
            );
        }
    }

    private void setStatusForSchedule(ScheduleEntity scheduleEntity, String status) {
        scheduleEntity.setStatus(status);
    }

    public DetailScheduleResponse getDetailSchedule(Long scheduleId) {
        ScheduleEntity scheduleEntity = customRepository.getScheduleEntityBy(scheduleId);
        if (Objects.isNull(scheduleEntity)) throw new RuntimeException(CodeAndMessage.ERR1);
        String candidateName = customRepository.getCandidateEntityBy(scheduleEntity.getCandidateId()).getFullName();
        DetailScheduleResponse detailScheduleResponse = scheduleMapper.getDetailResponseFrom(scheduleEntity);
        detailScheduleResponse.setCandidateInformation(IdAndName.builder()
                        .id(scheduleEntity.getCandidateId())
                        .name(candidateName)
                .build());
        detailScheduleResponse.setJobInformation(IdAndName.builder()
                .id(scheduleEntity.getJobId())
                .name(customRepository.getJobEntityBy(scheduleEntity.getJobId()).getJobTitle())
                .build());
        detailScheduleResponse.setTimeSchedule(formatTimeSchedule(scheduleEntity));
        return detailScheduleResponse;
    }

    private String generateEmailContent(DetailScheduleResponse detailScheduleResponse) {
        return String.format(
                "<p>Subject: no-reply-email-IMS-system <%s></p>" +
                        "<p>Body: This email is from IMS system,</p>" +
                        "<p>You have an interview schedule at %s</p>" +
                        "<p>With Candidate %s position %s, the CV is attached with this no-reply-email</p>" +
                        "<p>If anything wrong, please refer recruiter %s or visit our website</p>" +
                        "<p>%s</p>" +
                        "<p></p>" +
                        "Please join interview room ID: %s",
                detailScheduleResponse.getScheduleTitle(), detailScheduleResponse.getTimeSchedule()
                , detailScheduleResponse.getCandidateInformation().getName(), detailScheduleResponse.getJobInformation().getName()
                , Common.SYSTEM_EMAIL, "Link website", detailScheduleResponse.getMeeting()
        );
    }

    public void sendEmail(String email, String subject, String content, MimeMessage message)
            throws MessagingException, UnsupportedEncodingException {
        if (message == null) {
            message = javaMailSender.createMimeMessage();
        }
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(Common.SYSTEM_EMAIL, "IMS");
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content, true);

        try {
            javaMailSender.send(message);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
