import axios from "axios";
import { setUserInfo } from "@app/userSlice";
import { backendBaseUrl, ChainConfig, arbitraryKey } from "@constant";

export const editUser = async (info, address, dispatch) => {
    const hash = await window.keplr.signArbitrary(
        ChainConfig.chainId,
        address,
        arbitraryKey
    );
    const newData = await axios.post(
        `${backendBaseUrl}/api/edit_user_info`,
        info,
        {
            params: {
                hash: hash.signature,
            },
        }
    );
    dispatch(setUserInfo(newData.data));
};
