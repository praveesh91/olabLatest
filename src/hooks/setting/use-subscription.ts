import moment from "moment";
import { useSelector } from "react-redux";
import APP_CONSTANTS from "../../utils/constants/app.constants";

const useSubscription = () => {
  const metaData = useSelector((state: any) => state.meta_data);

  const getLeftFreeTrialDays = () => {
    let subscription = metaData.subscription;
    let freeTrialDaysLeft: number | undefined;
    if (subscription) {
      if (subscription.is_free_trial_availed) {
        freeTrialDaysLeft = 0;
      } else {
        let currentTime = moment();
        let startTime = moment(subscription.start_time);
        let daysSinceStart = currentTime.diff(startTime, "days");
        freeTrialDaysLeft =
          subscription.free_trial_days - daysSinceStart > 0
            ? subscription.free_trial_days - daysSinceStart
            : 0;
      }
    }

    return freeTrialDaysLeft;
  };

  return {
    getLeftFreeTrialDays,
  };
};

export default useSubscription;
