package fa.training.HN24_CPL_JAVA_01_G3.service.sendmail;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.TokenHelper;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.RoleEnums;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.ScheduleStatusEnums;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.DetailScheduleResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.AccountEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.ScheduleEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.ScheduleInterviewerMapEntity;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.schedule.ScheduleInteviewerMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.schedule.ScheduleRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.schedule.ScheduleMapper;
import lombok.AllArgsConstructor;
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
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static fa.training.HN24_CPL_JAVA_01_G3.service.schedule.ScheduleServiceImpl.formatTimeSchedule;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;

@AllArgsConstructor
@Service
public class SendEmailService {
    private final JavaMailSender javaMailSender;
    private final AccountJPARepository accountJPARepository;
    private final ScheduleRepository scheduleRepository;
    private final ScheduleInteviewerMapRepository scheduleInterviewerMapRepository;
    private final CustomRepository customRepository;
    private final ScheduleMapper scheduleMapper;

    //auto send email when schedule have one day left
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional()
    public void sendEmailNotifyScheduleToAllInterviewer() {
        OffsetDateTime startOfTomorrow = OffsetDateTime.now().plusDays(1).truncatedTo(ChronoUnit.DAYS);
        OffsetDateTime startOfDayAfterTomorrow = OffsetDateTime.now().plusDays(2).truncatedTo(ChronoUnit.DAYS);
        List<ScheduleEntity> scheduleEntities = scheduleRepository.findSchedulesForTomorrow(startOfTomorrow,startOfDayAfterTomorrow);
        if (scheduleEntities.isEmpty()) throw new RuntimeException(CodeAndMessage.ERR1);
        List<Long> scheduleIds = scheduleEntities.stream()
                .map(ScheduleEntity::getId).collect(Collectors.toList());

        Map<Long, List<String>> interviewerEmailsByScheduleId = getInterviewerEmailsByScheduleIds(scheduleIds);
        sendEmailToAllInterviewer(interviewerEmailsByScheduleId);
        // set status to invited
        for(ScheduleEntity scheduleEntity : scheduleEntities){
            scheduleEntity.setStatus(ScheduleStatusEnums.Invited.name());
            scheduleRepository.save(scheduleEntity);
        }
    }

    @Transactional(readOnly = true)
    public void sendEmailNotifyScheduleManual(String accessToken, Long scheduleId) {
        if(Objects.isNull(customRepository.getScheduleEntityBy(scheduleId))) throw new RuntimeException(CodeAndMessage.ERR1);
        if(TokenHelper.getRoleFromToken(accessToken).equals(RoleEnums.INTERVIEWER.name())) throw new RuntimeException(CodeAndMessage.ERR4);
        Map<Long, List<String>> interviewerEmailsByScheduleId = getInterviewerEmailBySingleScheduleId(scheduleId);
        CompletableFuture.runAsync(() -> sendEmailToAllInterviewer(interviewerEmailsByScheduleId));
        //set status to invited
        ScheduleEntity scheduleEntity = customRepository.getScheduleEntityBy(scheduleId);
        scheduleEntity.setStatus(ScheduleStatusEnums.Invited.name());
        scheduleRepository.save(scheduleEntity);
    }

    private Map<Long, List<String>> getInterviewerEmailsByScheduleIds(List<Long> scheduleIds) {
        Map<Long, String> interviewerEmailIdsMap = accountJPARepository.findAllByIdIn(
                scheduleInterviewerMapRepository.findByScheduleIdIn(scheduleIds).stream()
                        .map(ScheduleInterviewerMapEntity::getInterviewerId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(AccountEntity::getId, AccountEntity::getEmail));

        return scheduleInterviewerMapRepository.findAllByScheduleIdIn(scheduleIds).stream()
                .collect(Collectors.groupingBy(
                        ScheduleInterviewerMapEntity::getScheduleId,
                        Collectors.mapping(scheduleInterviewerMapEntity ->
                                interviewerEmailIdsMap.get(scheduleInterviewerMapEntity.getInterviewerId()), Collectors.toList()
                        )
                ));
    }

    private Map<Long, List<String>> getInterviewerEmailBySingleScheduleId(Long scheduleId) {
        Map<Long, String> interviewerEmailIdsMap = accountJPARepository.findAllByIdIn(
                scheduleInterviewerMapRepository.findAllByScheduleId(scheduleId).stream()
                        .map(ScheduleInterviewerMapEntity::getInterviewerId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(AccountEntity::getId, AccountEntity::getEmail));

        return scheduleInterviewerMapRepository.findAllByScheduleId(scheduleId).stream()
                .collect(Collectors.groupingBy(
                        ScheduleInterviewerMapEntity::getScheduleId,
                        Collectors.mapping(scheduleInterviewerMapEntity ->
                                interviewerEmailIdsMap.get(scheduleInterviewerMapEntity.getInterviewerId()), Collectors.toList()) // Giá trị là danh sách các interviewerId
                ));
    }
    private void sendEmailToAllInterviewer(Map<Long,List<String>> interviewerEmailsByScheduleId){
        for (Map.Entry<Long, List<String>> entry : interviewerEmailsByScheduleId.entrySet()) {
            Long scheduleId = entry.getKey();
            String emailCandidate = customRepository.getCandidateEntityBy(
                    customRepository.getScheduleEntityBy(scheduleId).getCandidateId()).getEmail();
            List<String> emailList = entry.getValue();
            emailList.add(emailCandidate);
            String content = generateEmailContent(getDetailSchedule(scheduleId));
            for (String email : emailList) {
                try {
                    sendEmail(email, "Schedule Interview", content, null);
                    System.out.println("success send email");
                } catch (MessagingException e) {
                    throw new RuntimeException(e);
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException("Can't send Email");
                }
            }
        }
    }

    public DetailScheduleResponse getDetailSchedule(Long scheduleId) {
        ScheduleEntity scheduleEntity = customRepository.getScheduleEntityBy(scheduleId);
        if (Objects.isNull(scheduleEntity)) throw new RuntimeException(CodeAndMessage.ERR1);
        String candidateName = customRepository.getCandidateEntityBy(scheduleEntity.getCandidateId()).getFullName();
        DetailScheduleResponse detailScheduleResponse = scheduleMapper.getDetailResponseFrom(scheduleEntity);
        detailScheduleResponse.setCandidateInformation(IdAndName.builder()
                        .id(scheduleEntity.getId())
                        .name(candidateName)
                .build());
        detailScheduleResponse.setJobInformation(IdAndName.builder()
                .id(scheduleEntity.getId())
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
                        "<p>With Candidate %s <p></p> With job : %s, the CV is attached with this no-reply-email</p>" +
                        "<p>If anything wrong, please refer recruiter %s or visit our website</p>" +
                        "<p>%s</p>" +
                        "<p></p>"+
                        "Please join interview room ID: %s",
                detailScheduleResponse.getScheduleTitle(), detailScheduleResponse.getTimeSchedule()
                , detailScheduleResponse.getCandidateInformation().getName(), detailScheduleResponse.getJobInformation().getName()
                , Common.SYSTEM_EMAIL, "Link website", detailScheduleResponse.getMeeting()
        );
    }

    public String generateEmailContentForCreateAccount(String username, String password, String recruiterEmail){
        return String.format(
                        "<p>This email is from IMS system,</p>" +
                        "<p></p>" +
                        "<p>Your account has been created. Please use the following credential to login:</p>" +
                        "<p>User name: %s</p>" +
                        "Password: %s</p>" +
                        "<p></p>"+
                        "<p>If anything wrong, please reach out to recruiter %s. We are so sorry for this inconvenience.</p>" +
                        "<p></p>"+
                        "<p>Thanks & Regards!</p>" +
                        "IMS Team.",
                username, password, recruiterEmail
        );
    }

    public String generateOtpContentWhenForgotPassword(Integer otp){
        return String.format(
                "<p>This is the Otp used to recover your account: %s</p>" +
                        "<p></p>" +
                        "<p>Remember that Otp is valid for 60 seconds</p>" +
                        "IMS Team.",
                otp
        );
    }

    public String generateSuccessRecoverPassword(String password){
        return String.format(
                "<p>The new password for your account is: %s</p>" +
                        "<p></p>" +
                        "<p>Don't forget your password next time :v</p>" +
                        "IMS Team.",
                password
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
