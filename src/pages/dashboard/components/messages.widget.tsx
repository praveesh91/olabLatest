import { List, Typography } from "antd"

const Messages = () => {
    const data = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.',
    ];

    const renderMessageHeader = () => {
        return (
            <Typography.Title level={3}>Messages</Typography.Title>
        )
    }

    return (
        <div style={{ padding: "0px 10px" }}>
            <List
                header={renderMessageHeader()}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />
        </div>
    )
}

export default Messages;