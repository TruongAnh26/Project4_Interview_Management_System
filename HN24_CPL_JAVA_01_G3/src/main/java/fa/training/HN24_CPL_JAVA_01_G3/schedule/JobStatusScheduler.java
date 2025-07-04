package fa.training.HN24_CPL_JAVA_01_G3.schedule;

import fa.training.HN24_CPL_JAVA_01_G3.service.job.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JobStatusScheduler {
    @Autowired
    private JobService jobService;

    @Scheduled(initialDelay = 2000, fixedDelay = 24 * 60 * 60 * 1000)
    public void updateJobStatuses() {
        jobService.updateJobStatuses();
    }
}
