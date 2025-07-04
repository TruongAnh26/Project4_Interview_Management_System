package fa.training.HN24_CPL_JAVA_01_G3.controller;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.service.sendmail.SendEmailService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/send-mail")
@CrossOrigin
@AllArgsConstructor
public class SendEmailController {
    private final SendEmailService sendEmailService;
    @Operation(summary = "send email notify due schedule interview to interviewer")
    @PostMapping("/schedule-duedate")
    @AuthenticationProxy(acceptRoles = {"MANAGER", "RECRUITER", "ADMIN"})
    public void sendEmailToInterviewer(@RequestHeader("Authorization") String accessToken,
                                      @RequestParam Long scheduleId){
        sendEmailService.sendEmailNotifyScheduleManual(accessToken,scheduleId);
    }
}
