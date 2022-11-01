import { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import { useWalletManager } from "@noahsaso/cosmodal";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import { uploadFileToIpfs } from "@utils/ipfs";
import { useContract } from "@hooks";
import { CollectionCreatorContract, fileSizeLimit } from "@constant";
import { validationFile, getContractAddressFromResponse } from "@utils/index";
import { useRouter } from "next/router";

const CreateNewArea = ({ className, space, isAdminPage }) => {
    const [selectedBackgroundImage, setSelectedBackgroundImage] = useState();
    const [backgroundShow, setBackgroundShow] = useState(false);
    const [logoShow, setLogoShow] = useState(false);
    const [selectedLogoImage, setSelectedLogoImage] = useState();
    const [hasBackgroundImageError, setHasBackgroundImageError] =
        useState(false);
    const [nftType, setNftType] = useState("");
    const [hasLogoImageError, setHasLogoImageError] = useState(false);

    const { connectedWallet } = useWalletManager();
    const { runExecute } = useContract();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm({
        mode: "onSubmit",
    });

    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            if (!validationFile(e.target.files[0])) return;
            if (e.target.name === "logo-image") {
                setSelectedLogoImage(e.target.files[0]);
            } else {
                setSelectedBackgroundImage(e.target.files[0]);
            }
        }
    };

    const reset = () => {
        setSelectedBackgroundImage();
        setSelectedLogoImage();
        resetForm();
    };

    const onSubmit = async (data) => {
        if (!connectedWallet) {
            toast.error("Connect Wallet!");
            return;
        }
        setHasBackgroundImageError(!selectedBackgroundImage);
        setHasLogoImageError(!selectedLogoImage);

        if (!selectedBackgroundImage) return;
        if (!selectedLogoImage) return;

        const queries = [
            uploadFileToIpfs(selectedBackgroundImage),
            uploadFileToIpfs(selectedLogoImage),
        ];
        Promise.all(queries)
            .then(async (results) => {
                const royaltyRate =
                    Number(data.royaltyRate.replace(/%/, "")) / 100;
                const backgroundImageHash = results[0];
                const logoImageHash = results[1];
                const background_url = `https://secretsteampunks.mypinata.cloud/ipfs/${backgroundImageHash}`;
                const logo_url = `https://secretsteampunks.mypinata.cloud/ipfs/${logoImageHash}`;
                let msg = {};
                if (isAdminPage) {
                    const startTime = Number(new Date(data.startTime)) / 1000;
                    msg = {
                        add_admin_collection: {
                            collection_info: {
                                name: new Date().toString(),
                                symbol: new Date().toString(),
                                collection_info: {
                                    title: data.title,
                                    background_url,
                                    logo_url,
                                    description: data.description,
                                },
                                royalty_info: {
                                    address: connectedWallet.address,
                                    royalty_rate: `${royaltyRate}`,
                                },
                                mint_info: {
                                    base_token_uri: data.tokenUri,
                                    total_supply: data.totalSupply,
                                    start_mint_time: startTime,
                                    per_address_limit: data.perAddressLimit,
                                    public_price: {
                                        denom: "uheart",
                                        amount: String(
                                            Number(data.publicPrice) * 1e6
                                        ),
                                    },
                                    private_price: {
                                        denom: "uheart",
                                        amount: String(
                                            Number(data.privatePrice) * 1e6
                                        ),
                                    },
                                    mint_flag: true,
                                    is_public_mint: true,
                                    nft_base_name: data.baseName,
                                    base_image_uri: data.imageUri,
                                },
                            },
                            content_type: nftType,
                        },
                    };
                } else {
                    msg = {
                        add_user_collection: {
                            collection_info: {
                                name: new Date().toString(),
                                symbol: new Date().toString(),
                                collection_info: {
                                    title: data.title,
                                    background_url,
                                    logo_url,
                                    description: data.description,
                                },
                                royalty_info: {
                                    address: connectedWallet.address,
                                    royalty_rate: `${royaltyRate}`,
                                },
                            },
                        },
                    };
                }
                try {
                    const response = await runExecute(
                        CollectionCreatorContract,
                        msg
                    );
                    toast.success("Successfully Created!");
                    const createdAddress = getContractAddressFromResponse(
                        response,
                        "nft_address"
                    );
                    if (createdAddress) {
                        // router.push(`/marketplace?nftAddress=${createdAddress}`)
                        router.push(`/explore/collections/${createdAddress}`);
                    } else {
                        reset();
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                    toast.error("Create Failed!");
                }
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
                toast.error("Fail!");
            });
    };

    const backgroundImageError =
        hasBackgroundImageError && !selectedBackgroundImage;
    const logoImageError = hasLogoImageError && !selectedLogoImage;

    const handleChangeCheckbox = (e) => {
        setNftType(e.target.name);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "copy";
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e, name) => {
        e.preventDefault();
        e.stopPropagation();
        const files = [...e.dataTransfer.files];
        if (files.length && files[0]) {
            if (!validationFile(files[0])) return;
            if (name === "logo-image") {
                setSelectedLogoImage(files[0]);
            } else {
                setSelectedBackgroundImage(files[0]);
            }
        }
    };

    return (
        <div
            className={clsx(
                "create-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <form action="#" onSubmit={handleSubmit(onSubmit)}>
                <div className="container container-no-max-width ml_md--5 ml_sm--5 mr_md--5 mr_sm--5">
                    <div className="row g-5">
                        <div className="row col-sm-6">
                            <div className="col-md-6 ml_md--0 ml_sm--0">
                                <div className="upload-area">
                                    <div className="upload-formate mb--30">
                                        <h6 className="title">
                                            Upload Background Image
                                        </h6>
                                        <p className="formate">
                                            Choose your file to upload
                                        </p>
                                    </div>

                                    <div
                                        className="brows-file-wrapper"
                                        data-black-overlay="2"
                                        onMouseEnter={() => {
                                            setBackgroundShow(true);
                                        }}
                                        onMouseLeave={() => {
                                            setBackgroundShow(false);
                                        }}
                                        onDragEnter={(e) => handleDragEnter(e)}
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDragLeave={(e) => handleDragLeave(e)}
                                        onDrop={(e) =>
                                            handleDrop(e, "background-image")
                                        }
                                    >
                                        <input
                                            name="background-image"
                                            id="background-image"
                                            type="file"
                                            className="inputfile"
                                            data-multiple-caption="{count} files selected"
                                            multiple
                                            onChange={imageChange}
                                        />
                                        {selectedBackgroundImage && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                id="createfileImage"
                                                src={URL.createObjectURL(
                                                    selectedBackgroundImage
                                                )}
                                                alt=""
                                            />
                                        )}

                                        <label
                                            htmlFor="background-image"
                                            title="No File Choosen"
                                        >
                                            {(!selectedBackgroundImage ||
                                                backgroundShow) && (
                                                <>
                                                    <i className="feather-upload" />
                                                    <span className="text-center">
                                                        Choose a File
                                                    </span>
                                                    <p className="text-center mt--10">
                                                        JPG, PNG, GIF, SVG, MP4,
                                                        WEBM, MP3, WAV, OGG,
                                                        GLB, or GLTF. <br />{" "}
                                                        {`Max ${fileSizeLimit} MB`}
                                                        .
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {backgroundImageError && (
                                        <ErrorText>
                                            Background Image is required
                                        </ErrorText>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6 ml_md--0 ml_sm--0">
                                <div className="upload-area">
                                    <div className="upload-formate mb--30">
                                        <h6 className="title">
                                            Upload Logo Image
                                        </h6>
                                        <p className="formate">
                                            Choose your file to upload
                                        </p>
                                    </div>

                                    <div
                                        className="brows-file-wrapper"
                                        data-black-overlay="2"
                                        onMouseEnter={() => {
                                            setLogoShow(true);
                                        }}
                                        onMouseLeave={() => {
                                            setLogoShow(false);
                                        }}
                                        onDragEnter={(e) => handleDragEnter(e)}
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDragLeave={(e) => handleDragLeave(e)}
                                        onDrop={(e) =>
                                            handleDrop(e, "logo-image")
                                        }
                                    >
                                        <input
                                            name="logo-image"
                                            id="logo-image"
                                            type="file"
                                            className="inputfile"
                                            data-multiple-caption="{count} files selected"
                                            multiple
                                            onChange={imageChange}
                                        />
                                        {selectedLogoImage && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                id="createfileImage"
                                                src={URL.createObjectURL(
                                                    selectedLogoImage
                                                )}
                                                alt=""
                                                data-black-overlay="6"
                                            />
                                        )}

                                        <label
                                            htmlFor="logo-image"
                                            title="No File Choosen"
                                        >
                                            {(!selectedLogoImage ||
                                                logoShow) && (
                                                <>
                                                    <i className="feather-upload" />
                                                    <span className="text-center">
                                                        Choose a File
                                                    </span>
                                                    <p className="text-center mt--10">
                                                        JPG, PNG, GIF, SVG, MP4,
                                                        WEBM, MP3, WAV, OGG,
                                                        GLB, or GLTF. <br />{" "}
                                                        {`Max ${fileSizeLimit} MB`}
                                                        .
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {logoImageError && (
                                        <ErrorText>Image is required</ErrorText>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-wrapper-one">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="input-box pb--20">
                                            <label
                                                htmlFor="royaltyRate"
                                                className="form-label"
                                            >
                                                Royalty Rate
                                            </label>
                                            <InputMask
                                                id="royaltyRate"
                                                placeholder="e. g. `30%`"
                                                mask="99%"
                                                {...register("royaltyRate", {
                                                    required:
                                                        "Royalty Rate is required",
                                                })}
                                            />
                                            {errors.royaltyRate && (
                                                <ErrorText>
                                                    {
                                                        errors.royaltyRate
                                                            ?.message
                                                    }
                                                </ErrorText>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="input-box pb--20">
                                            <label
                                                htmlFor="title"
                                                className="form-label"
                                            >
                                                Title
                                            </label>
                                            <input
                                                id="title"
                                                placeholder="e. g. `ABC Collection`"
                                                {...register("title", {
                                                    required:
                                                        "Title is required",
                                                })}
                                            />
                                            {errors.title && (
                                                <ErrorText>
                                                    {errors.title?.message}
                                                </ErrorText>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="input-box pb--20">
                                            <label
                                                htmlFor="description"
                                                className="form-label"
                                            >
                                                Description
                                            </label>
                                            <input
                                                id="description"
                                                placeholder="e. g. `ABC Collection is ...`"
                                                {...register("description", {
                                                    required:
                                                        "Description is required",
                                                })}
                                            />
                                            {errors.description && (
                                                <ErrorText>
                                                    {
                                                        errors.description
                                                            ?.message
                                                    }
                                                </ErrorText>
                                            )}
                                        </div>
                                    </div>
                                    {isAdminPage && (
                                        <div className="col-md-12">
                                            <div className="input-box pb--20">
                                                <div className="form-label">
                                                    NFT Type
                                                </div>
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            nftType === "ai_nft"
                                                        }
                                                        className="rn-check-box-input"
                                                        onChange={
                                                            handleChangeCheckbox
                                                        }
                                                        id="ai-nft"
                                                        name="ai_nft"
                                                    />
                                                    <label
                                                        className="rn-check-box-label"
                                                        htmlFor="ai-nft"
                                                    >
                                                        AI NFT
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            nftType ===
                                                            "language_processing"
                                                        }
                                                        className="rn-check-box-input"
                                                        onChange={
                                                            handleChangeCheckbox
                                                        }
                                                        id="language-processing"
                                                        name="language_processing"
                                                    />
                                                    <label
                                                        className="rn-check-box-label"
                                                        htmlFor="language-processing"
                                                    >
                                                        Language Processing
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            nftType ===
                                                            "syntetic_media"
                                                        }
                                                        className="rn-check-box-input"
                                                        onChange={
                                                            handleChangeCheckbox
                                                        }
                                                        id="syntetic-media"
                                                        name="syntetic_media"
                                                    />
                                                    <label
                                                        className="rn-check-box-label"
                                                        htmlFor="syntetic-media"
                                                    >
                                                        Syntetic media
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {isAdminPage && (
                                        <div className="col-md-12">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="mintInfo"
                                                    className="form-label"
                                                >
                                                    Mint Info
                                                </label>
                                                <div
                                                    id="mintInfo"
                                                    // className="container"
                                                >
                                                    <div className="col-md-12">
                                                        <div className="input-box pb--20">
                                                            <label
                                                                htmlFor="totalSupply"
                                                                className="form-label"
                                                            >
                                                                Total Supply
                                                            </label>
                                                            <input
                                                                id="totalSupply"
                                                                type="number"
                                                                placeholder="e. g. `5000`"
                                                                {...register(
                                                                    "totalSupply",
                                                                    {
                                                                        required:
                                                                            "Total Supply is required",
                                                                    }
                                                                )}
                                                            />
                                                            {errors.description && (
                                                                <ErrorText>
                                                                    {
                                                                        errors
                                                                            .totalSupply
                                                                            ?.message
                                                                    }
                                                                </ErrorText>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="input-box pb--20">
                                                            <label
                                                                htmlFor="perAddressLimit"
                                                                className="form-label"
                                                            >
                                                                Limit per User
                                                            </label>
                                                            <input
                                                                id="perAddressLimit"
                                                                type="number"
                                                                placeholder="e. g. `3`"
                                                                {...register(
                                                                    "perAddressLimit",
                                                                    {
                                                                        required:
                                                                            "Limit per User is required",
                                                                    }
                                                                )}
                                                            />
                                                            {errors.description && (
                                                                <ErrorText>
                                                                    {
                                                                        errors
                                                                            .perAddressLimit
                                                                            ?.message
                                                                    }
                                                                </ErrorText>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="input-box pb--20">
                                                            <label
                                                                htmlFor="tokenUri"
                                                                className="form-label"
                                                            >
                                                                Token URI
                                                            </label>
                                                            <input
                                                                id="tokenUri"
                                                                placeholder="e. g. `https://...`"
                                                                {...register(
                                                                    "tokenUri",
                                                                    {
                                                                        required:
                                                                            "Token URI is required",
                                                                    }
                                                                )}
                                                            />
                                                            {errors.description && (
                                                                <ErrorText>
                                                                    {
                                                                        errors
                                                                            .tokenUri
                                                                            ?.message
                                                                    }
                                                                </ErrorText>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="input-box pb--20">
                                                            <label
                                                                htmlFor="imageUri"
                                                                className="form-label"
                                                            >
                                                                Image URI
                                                            </label>
                                                            <input
                                                                id="imageUri"
                                                                placeholder="e. g. `https://...`"
                                                                {...register(
                                                                    "imageUri",
                                                                    {
                                                                        required:
                                                                            "Image URI is required",
                                                                    }
                                                                )}
                                                            />
                                                            {errors.description && (
                                                                <ErrorText>
                                                                    {
                                                                        errors
                                                                            .imageUri
                                                                            ?.message
                                                                    }
                                                                </ErrorText>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="input-box pb--20">
                                                            <label
                                                                htmlFor="baseName"
                                                                className="form-label"
                                                            >
                                                                NFT Base Name
                                                            </label>
                                                            <input
                                                                id="baseName"
                                                                placeholder="e. g. `human`"
                                                                {...register(
                                                                    "baseName",
                                                                    {
                                                                        required:
                                                                            "NFT Base Name is required",
                                                                    }
                                                                )}
                                                            />
                                                            {errors.description && (
                                                                <ErrorText>
                                                                    {
                                                                        errors
                                                                            .baseName
                                                                            ?.message
                                                                    }
                                                                </ErrorText>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="input-box pb--20">
                                                            <label
                                                                htmlFor="publicPrice"
                                                                className="form-label"
                                                            >
                                                                Public Price
                                                            </label>
                                                            <input
                                                                id="publicPrice"
                                                                placeholder="e. g. `3 $HEART`"
                                                                {...register(
                                                                    "publicPrice",
                                                                    {
                                                                        required:
                                                                            "Public Price is required",
                                                                    }
                                                                )}
                                                            />
                                                            {errors.description && (
                                                                <ErrorText>
                                                                    {
                                                                        errors
                                                                            .publicPrice
                                                                            ?.message
                                                                    }
                                                                </ErrorText>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="input-box pb--20">
                                                            <label
                                                                htmlFor="privatePrice"
                                                                className="form-label"
                                                            >
                                                                Private Price
                                                            </label>
                                                            <input
                                                                id="privatePrice"
                                                                placeholder="e. g. `3 $HEART`"
                                                                {...register(
                                                                    "privatePrice",
                                                                    {
                                                                        required:
                                                                            "Private Price is required",
                                                                    }
                                                                )}
                                                            />
                                                            {errors.description && (
                                                                <ErrorText>
                                                                    {
                                                                        errors
                                                                            .privatePrice
                                                                            ?.message
                                                                    }
                                                                </ErrorText>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="input-box pb--20">
                                                            <label
                                                                className="form-label"
                                                                htmlFor="startTime"
                                                            >
                                                                Start Time (UTC)
                                                            </label>
                                                            <input
                                                                type="datetime-local"
                                                                id="startTime"
                                                                {...register(
                                                                    "startTime",
                                                                    {
                                                                        required:
                                                                            "Start Time is required",
                                                                    }
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-md-12 col-xl-8 mt_lg--15 mt_md--15 mt_sm--15">
                                        <div className="input-box">
                                            <Button type="submit" fullwidth>
                                                Create Collection
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

CreateNewArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
    isAdminPage: PropTypes.bool,
};

CreateNewArea.defaultProps = {
    space: 1,
};

export default CreateNewArea;
