package fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle;

public class SuccessHandle {
    public static SuccessResponse success(String successCode){
        String[] suCo = successCode.split("-");
        return new SuccessResponse(suCo[0], suCo[1]);
    }
}
