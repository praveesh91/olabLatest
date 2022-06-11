export interface IParamTypes {
  id: string;
}
export interface IProductDetail {
  id: number;
  in_stock?: number;
  available?: number;
  tracking_type?: number;
  image_url?: string;
  name: string;
  booked?: string;
  alert_threshold?: string;
  close_at_quantity?: string;
  updated?: string;
  created?: string;
  grade?: string;
  sku?: string;
  client?: string;
  uom?: string;
  tags?: any;
  tax?: any;
  barcode?: string;
  group1?: any;
  group1_id?: any;
  notes?: string;
  count_links?: string;
  incoming?: string;
  bundle_type?: string;
  is_archived?: boolean;
}

export interface IListingDetail {
  id: number;
  has_inventory_sync?: boolean;
  is_ebay_inventory_item?: boolean;
  inventory_item_id?: number;
  product?: IProductDetail;
  last_sync_time?: string;
  remote_name: string;
  remote_id?: string;
  remote_product_id?: number;
  remote_sku?: string;
  stock_update_time?: string;
  channel?: any;
  channel_id?: number;
}
export interface IStockLevelDetail {
  id: number;
  product?: IProductDetail;
  available: number;
  in_stock: number;
  warehouse_id: number;
  warehouse: IWareHouseDetail;
  updated: string;
  booked?: string;
  incoming?: string;
  client: number;
  stock_update_time?: string;
}
export interface IGroup {
  id: string;
  name: string;
}
export interface IWareHouseDetail {
  id: number;
  name: string;
  code: string;
  is_archived: boolean;
  client: number;
  address: number;
}
export interface IDetailsProps {
  onChangeDetails: (e: any) => void;
  productDetailProp: IProductDetail;
  validateName?: boolean;
  validateSku?: boolean;
  trackingType?: (e: any) => void;
  loading: boolean;
}
export interface IModalProps {
  title: string;
  visible: boolean;
  close: () => void;
  onAddProduct?: (e: any) => void;
}
export interface IProductTableProps {
  ref?: any;
  list: any;
  loading: boolean;
  hasSelectedPdt: (val: any) => void;
}
export interface ISuccessMsg {
  title: string;
  desc: string;
}
export interface ITagList {
  id: number;
  name: string;
  client: number;
}
export interface IGroupList {
  id: number;
  name: string;
}
export interface IFilterParams {
  selected_tag?: [ITagList];
  sku?: string;
  is_below_threshold?: string;
  group1?: [IGroupList];
  has_links?: string;
  warehouse?: number;
}
export interface IGroupProps {
  id: number;
  name: string;
}
export interface IProductFilterProps {
  filterAction: (filters: IFilterParams) => void;
  filterCount?: number;
}
export interface IDetailsProps {
  onChangeDetails: (e: any) => void;
  productDetailProp: IProductDetail;
}

export interface IListingsProps {
  // loading: boolean;
}

export interface IInventoryLogProps {
  // loading: boolean;
}

export interface IPurchasePriceProps {
  productDetailProp?: IProductDetail;
  // loading: boolean;
}

export interface IStockLevelsProps {
  // loading: boolean;
}

export interface IInventoryLogDetail {
  id: number;
  product: IProductDetail;
  warehouse_id: number;
  warehouse: IWareHouseDetail;
  channel_id: string;
  channel: string;
  content_type_id: number;
  content_type: any;
  user_id: 3;
  user: IUserDetails;
  updated: string;
  quantity: string;
  in_stock: string;
  document_number: string;
  object_id: number;
  reason: string;
  client: number;
}
export interface IUserDetails {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  full_name: string;
}
export interface IPurchasePriceDetails {
  id?: number;
  purchase_rate: number;
  shipping_rate: number;
  product_id: string;
  pack_size: number;
  currency: string;
  supplier: string;
  supplier_sku: string;
  pack_uom: string;
  moq: number;
  productDetail?: any;
  contact?: any;
  contact_id?: string;
}
export interface IParamTypes {
  id: string;
}
