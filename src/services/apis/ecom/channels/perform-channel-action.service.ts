import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const performChannelAction = ({
  id,
  action,
}: {
  id: number;
  action: string;
}) => {
  let url: string =
    BACKEND_API_PATHS.BASE +
    BACKEND_API_PATHS.CHANNEL_ACTIONS_URL.replace(":action", action).replace(
      ":id",
      id.toString()
    );

  return axios.post(url);
};

export default performChannelAction;
