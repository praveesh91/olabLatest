import { Typography, Table, Tag, Space, Image, Button } from 'antd';
import { useEffect, useState } from 'react';
import listChannels from '../../../services/apis/ecom/channels/list-channels.service';
import { SettingOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { ECOM_CONSTANTS } from '../../../utils/constants/ecom.constants';
import moment from 'antd/node_modules/moment';
import ChannelRefresh from './channel-refresh';
import SyncIntstruction from '../../../components/modals/sync-instruction.modal';
import PAGE_PATHS from '../../../utils/constants/page-paths.constants';
import { useHistory } from 'react-router-dom';
import ConnectChannel from '../../../components/ecom/connect-channel';

const StoreList = () => {
    const [rows, setRows] = useState<any>([]);
    const [channelsLoading, setChannelsLoading] = useState<boolean>(false);
    const history = useHistory();
    const fetchStoreList = async (args?: {
        beforeFetch?: () => void,
        afterFetch?: (stores: any) => void,
        onFailure?: (error: any) => void
    }) => {
        args?.beforeFetch?.();
        try {
            let res: any = await listChannels();
            args?.afterFetch?.(res.data);
        } catch (error: any) {
            args?.onFailure?.(error)
            console.log(error);
        }
    }

    const columns: any = [
        {
            title: 'Store',
            dataIndex: 'store',
            key: 'store',
        },
        {
            title: 'Connected',
            dataIndex: 'connected',
            key: 'connected',
        },
        {
            title: 'Inventory',
            dataIndex: 'inventory',
            key: 'inventory',
        },
        {
            title: 'Sync Time',
            key: 'syncTime',
            dataIndex: 'syncTime'
        },
        {
            title: "",
            key: "setting",
            dataIndex: "setting",
            fixed: "right"
        }
    ];

    const renderSyncTag = (sync: boolean) => {
        if (sync) {
            return <Tag color="green">Sync On</Tag>
        }

        return <Tag>Sync off</Tag>

    }

    const getSyncTimeMessage = (syncStartTime: string, syncEndTime: string) => {
        if (!syncStartTime && !syncEndTime) {
            return "";
        } else if (syncStartTime && !syncEndTime) {
            return "In progress..";
        } else if (syncStartTime && syncEndTime) {
            let a = moment();
            let diffInMinutes, diffInHours;
            let lastSyncStart = moment(syncStartTime);
            let lastSyncEnd = moment(syncEndTime);
            if (lastSyncEnd.isAfter(lastSyncStart)) {
                diffInMinutes = a.diff(lastSyncEnd, 'minutes');
                diffInHours = a.diff(lastSyncEnd, 'hours');
                if (diffInMinutes === 1) {
                    return diffInMinutes + " minute ago";
                } else if (diffInMinutes < 60) {
                    return diffInMinutes + " minutes ago";
                } else if (diffInMinutes > 60 && diffInHours === 1) {
                    return diffInHours + " hour ago";
                } else if (diffInMinutes > 60 && diffInHours < 24) {
                    return diffInHours + " hours ago";
                } else if (diffInHours > 24) {
                    return "> 1 day ago";
                }
            } else {
                return "In progress.."
            }
        }
    }



    const renderStore = (data: any) => {
        return (
            <Space>
                <Image src={ECOM_CONSTANTS.CHANNEL_DATA?.[data.channel_type]['shorthand']} width="20px"></Image>
                <div>
                    <div>
                        <Typography.Text>
                            {data.name}
                        </Typography.Text>
                    </div>
                    <div>
                        <Typography.Text>
                            {data.code}
                        </Typography.Text>
                    </div>
                </div>
            </Space>
        )
    }

    const renderConnectedStatus = (isConnected: boolean) => {
        return (
            <div style={{ display: "flex" }}>
                {isConnected ?
                    <div>
                        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "18px" }} />
                    </div>
                    :
                    <div>
                        <CloseCircleTwoTone twoToneColor="red" style={{ fontSize: "18px" }} />
                    </div>
                }
            </div>
        )
    }

    const renderSyncTime = ({ channel, afterRefresh }: { channel: any, afterRefresh: (channel: any) => void }) => {
        if (channel.is_connected) {
            if (channel.has_inventory_sync) {
                return (
                    <Space>
                        <Typography.Text>{getSyncTimeMessage(channel?.inventory_sync_start_time || "", channel?.inventory_sync_end_time || "")}</Typography.Text>
                        <ChannelRefresh id={channel.id} afterRefresh={(channel: any) => {
                            afterRefresh(channel);
                        }}></ChannelRefresh>
                    </Space>
                )
            }

            if (!channel.has_inventory_sync) {
                return (
                    <SyncIntstruction channel={{
                        id: channel?.id || -1,
                        channelType: channel?.channel_type || -1
                    }}
                        afterSync={(channel: any) => {
                            afterRefresh?.(channel);
                        }}></SyncIntstruction>
                )
            }
        }

        if (!channel.is_connected) {
            return (
                <ConnectChannel channel={{
                    channelType: channel?.channel_type || -1
                }}></ConnectChannel>
            )
        }
    }

    const createRows = (data: any) => {
        return data.map((channel: any, index: number) => createRow(channel, index));
    }

    const createRow = (channel: any, index: number) => {
        return {
            key: index,
            store: renderStore(channel),
            connected: renderConnectedStatus(channel?.is_connected || false),
            inventory: renderSyncTag(channel?.has_inventory_sync || false),
            syncTime: renderSyncTime({
                channel: channel, afterRefresh: (channel: any) => {
                    let row = createRow(channel, index);
                    setRows((rows: any[]) => {
                        let newRows: any[] = [...rows];
                        newRows[index] = row;
                        return newRows;
                    });
                }
            }),
            setting: <SettingOutlined color="7D7AB9" style={{ fontSize: "18px" }} onClick={() => {
                history.push("/" + PAGE_PATHS.CHANNEL.replace(":id", channel.id).replace(":tabKey", PAGE_PATHS.CHANNEL_TAB_KEYS.DETAILS))
            }} />
        }
    }


    useEffect(() => {
        fetchStoreList({
            beforeFetch: () => {
                setChannelsLoading(true);
            },
            afterFetch: (stores) => {
                setRows(createRows(stores));
                setChannelsLoading(false);
            },
            onFailure: (error: any) => {
                setChannelsLoading(false);
                console.log(error);
            }
        });
    }, []);


    useEffect(() => {
        const timer = setInterval(() => {
            fetchStoreList({
                afterFetch: (stores) => {
                    setRows(createRows(stores));
                }
            });
        }, 2000);
        return () => clearInterval(timer);
    }, []);


    return (
        <>
            <div style={{ padding: "10px" }}>
                <Typography.Title level={3} style={{ marginBottom: "2px" }}>Store List</Typography.Title>
                <Typography.Paragraph>
                    Different stores list with inventory details
                </Typography.Paragraph>
                <Table
                    loading={channelsLoading}
                    pagination={false}
                    columns={columns}
                    dataSource={rows}
                    scroll={{ x: "auto" }}
                ></Table>
            </div>

        </>
    )
}

export default StoreList;