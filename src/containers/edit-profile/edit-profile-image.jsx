/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { pinataUrl } from "@constant";
import { useWalletManager } from "@noahsaso/cosmodal";
import { uploadFileToIpfs } from "@utils/ipfs";
import Image from "next/image";
import { editUser } from "./hooks";

const EditProfileImage = () => {
    const { connectedWallet } = useWalletManager();
    const { cover, logo } = useAppSelector((state) => state.user.userInfo);
    const dispatch = useAppDispatch();
    const imageChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const imageHash = await uploadFileToIpfs(e.target.files[0]);

            await editUser(
                { [e.target.name]: imageHash },
                connectedWallet?.address,
                dispatch
            );
        }
    };
    return (
        <div className="nuron-information">
            <div className="profile-change row g-5">
                <div className="profile-left col-lg-4">
                    <div className="profile-image mb--10">
                        <h6 className="title">Change Your Profile Picture</h6>
                        <div className="img-wrap">
                            {logo ? (
                                <img
                                    src={`${pinataUrl}/${logo}`}
                                    alt=""
                                    data-black-overlay="6"
                                />
                            ) : (
                                <Image
                                    id="rbtinput1"
                                    src="/images/profile/profile-01.jpg"
                                    alt="Profile-NFT"
                                    layout="fill"
                                />
                            )}
                        </div>
                    </div>
                    <div className="button-area">
                        <div className="brows-file-wrapper">
                            <input
                                name="logo"
                                id="fatima"
                                type="file"
                                onChange={imageChange}
                            />
                            <p className="photo-description">
                                140 X 140 px | <span>max</span> 10MB
                            </p>
                            <label htmlFor="fatima" title="No File Choosen">
                                <span className="text-center color-white">
                                    Upload Profile
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="profile-left right col-lg-8">
                    <div className="profile-image mb--10">
                        <h6 className="title">Change Your Cover Photo</h6>
                        <div className="img-wrap">
                            {cover ? (
                                <img
                                    src={`${pinataUrl}/${cover}`}
                                    alt=""
                                    data-black-overlay="6"
                                />
                            ) : (
                                <Image
                                    id="rbtinput2"
                                    src="/images/profile/cover-01.jpg"
                                    alt="Profile-NFT"
                                    layout="fill"
                                />
                            )}
                        </div>
                    </div>
                    <div className="button-area">
                        <div className="brows-file-wrapper">
                            <input
                                name="cover"
                                id="nipa"
                                type="file"
                                onChange={imageChange}
                            />
                            <p className="photo-description">
                                1024 X 300 px | <span>max</span> 20MB
                            </p>
                            <label htmlFor="nipa" title="No File Choosen">
                                <span className="text-center color-white">
                                    Upload Cover
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileImage;
