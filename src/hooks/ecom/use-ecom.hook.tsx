import { ECOM_CONSTANTS } from "../../utils/constants/ecom.constants"


const useEcom = () => {
    const getMarketPlaceRegionName = (channelType: number, placeCode: string) => {
        if (channelType === ECOM_CONSTANTS.CHANNEL_TYPE.EBAY) {
            for (let marketPlace of ECOM_CONSTANTS.EBAY_MARKETPLACES) {
                console.log(marketPlace, placeCode);
                if (marketPlace.id === placeCode) {
                    return marketPlace.name
                }
            }
        }

        if (channelType === ECOM_CONSTANTS.CHANNEL_TYPE.AMAZON) {
            for (let marketPlace of ECOM_CONSTANTS.AMAZON_MARKETPLACES) {
                console.log(marketPlace, placeCode);
                if (marketPlace.id === placeCode) {
                    return marketPlace.name
                }
            }
        }
        return ""
    }
    const getChannelName = (channelType: number) => {
        return ECOM_CONSTANTS.CHANNEL_DATA[channelType]?.["NAME"];
    }
    return {
        getMarketPlaceRegionName,
        getChannelName
    }
}

export default useEcom;