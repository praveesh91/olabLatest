import { Button, notification } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { FC, useState } from "react";
import getChannel from "../../../services/apis/ecom/channels/get-channel.service";
import syncChannel from "../../../services/apis/ecom/channels/sync-channel.service";

interface ChannelRefreshInterface {
    afterRefresh?: (channel: any) => void,
    id: number
}

const ChannelRefresh: FC<ChannelRefreshInterface> = ({ afterRefresh, id }) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            let channelSyncRes: any = await syncChannel({
                id: id
            });
            afterRefresh?.(channelSyncRes.data);
            setRefreshing(false);
            notification.success({
                message: "Sync",
                description: "Inventory sync is queued. It will be synced in few minutes."
            })
        } catch (error) {
            setRefreshing(false);
            console.log(error);
        }
    }

    return (
        <Button icon={<SyncOutlined spin={refreshing} />} onClick={handleRefresh}>Refresh</Button>
    )
}
export default ChannelRefresh;