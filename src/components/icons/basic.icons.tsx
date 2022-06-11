import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import Icon from '@ant-design/icons';

const getSVG = (path: string, style: React.CSSProperties = {}) => (<img src={path} style={{ ...style }}></img>)

export const ShopifyShortHandIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/shopify-shorthand.svg", props.iconstyle)} {...props} />
)

export const WooCommerceShortHandIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/woo-shorthand.svg", props.iconstyle)} {...props} />
)

export const AmazonShortHandIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/amazon-shorthand.svg", props.iconstyle)} {...props} />
)

export const BigCommerceShortHandIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/big-commerce-shorthand.svg", props.iconstyle)} {...props} />
)
export const EbayShortHandIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/ebay-shorthand.svg", props.iconstyle)} {...props} />
)

export const EtsyShortHandIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/etsy-shorthand.svg", props.iconstyle)} {...props} />
)

export const DashboardIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/dashboard.svg", props.iconstyle)} {...props} />
)

export const OrdersIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/orders.svg", props.iconstyle)} {...props} />
)

export const ProductsIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/products.svg", props.iconstyle)} {...props} />
)

export const BundlesIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/bundles.svg", props.iconstyle)} {...props} />
)

export const ReportsIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/reports.svg", props.iconstyle)} {...props} />
)

export const StockLevelsIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/stock_levels.svg", props.iconstyle)} {...props} />
)

export const InventoryIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/inventory.svg", props.iconstyle)} {...props} />
)

export const SettingIcon = (props: Partial<CustomIconComponentProps> & { iconstyle?: React.CSSProperties }) => (
    <Icon component={() => getSVG("/images/setting.svg", props.iconstyle)} {...props} />
)

