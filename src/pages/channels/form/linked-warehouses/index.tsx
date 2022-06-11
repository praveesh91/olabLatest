import { Button, Col, Row, Space, Table } from "antd";
import { FC, useEffect, useState } from "react";
import listWarehouseLinks from "../../../../services/apis/ecom/warehouse-links/list-warehouse-links.service";
import { PlusOutlined } from '@ant-design/icons';


interface LinkedWarehousesProps {
    channel: {
        id: number
    }
}
const LinkedWarehouses: FC<LinkedWarehousesProps> = ({
    channel
}) => {
    const [linkedWarehousesList, setLinkedWarehousesList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        loadLinkedWarehouse();

    }, []);

    const [columns, setColumns] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState();

    useEffect(() => {
        let tempCols: any[] = [
            {
                title: 'Priority',
                dataIndex: 'priority',
                key: 'priority',
            },
            {
                title: 'Warehouse',
                dataIndex: 'warehouse',
                key: 'warehouse',
            },
            {
                title: 'Remote Location',
                dataIndex: 'remoteLocation',
                key: 'remoteLocation',
            },
            {
                title: '',
                dataIndex: 'actions',
                key: 'actions',
            },
        ]
        setColumns(tempCols);
    }, [])

    const createRows = (list: any[]) => {
        return list.map((link: any, index: number) => {
            // return {
            //     key: index,
            //     name: 'John Brown',
            //     age: 32,
            //     address: 'New York No. 1 Lake Park',
            //     tags: ['nice', 'developer'],
            // },
        })
    }


    const loadLinkedWarehouse = async () => {
        try {
            setLoading(true);
            let res: any = await listWarehouseLinks({
                queryParams: {
                    channel: channel.id
                }
            });
            setLinkedWarehousesList(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <div id="linked-warehouses-tab">
            <Row justify="space-between" style={{ marginBottom: "15px" }}>
                <Col span={24}>
                    <Space style={{ display: "flex", justifyContent: "right" }}>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />}>Add New Link</Button>
                        </div>
                    </Space>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table columns={columns}>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}

export default LinkedWarehouses;