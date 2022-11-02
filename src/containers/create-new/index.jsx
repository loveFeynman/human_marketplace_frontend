import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import Button from "@ui/button";
import NftPreviewModal from "@components/modals/nft-preview-modal";
import ErrorText from "@ui/error-text";
import { toast } from "react-toastify";
import { uploadFileToIpfs, uploadJSONToIpfs } from "@utils/ipfs";
import { useAppSelector } from "@app/hooks";
import { useWalletManager } from "@noahsaso/cosmodal";
import { useContract } from "@hooks";
import NiceSelect from "@ui/nice-select";
import { useRouter } from "next/router";
import { validationFile } from "@utils/index";
import Video from "@components/video";
import { fileSizeLimit } from "@constant";

const CreateNewArea = ({ className, space }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    // eslint-disable-next-line no-unused-vars
    const [metadataSet, setMetadataSet] = useState([{ field: "", value: "" }]);
    const [attributesSet, setAttributesSet] = useState([
        { field: "", value: "" },
    ]);
    const [nftType, setNftType] = useState("");
    const [uploadShow, setUploadShow] = useState(false);
    const [hasImageError, setHasImageError] = useState(false);
    const [hasMetadataError, setHasMetadataError] = useState(false);
    const [previewData, setPreviewData] = useState({});

    const collectionInfo = useAppSelector((state) => state.collections);
    const { connectedWallet } = useWalletManager();
    const { runExecute } = useContract();
    const router = useRouter();
    const { nftAddress } = router.query;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        // reset: resetForm,
    } = useForm({
        mode: "onSubmit",
    });

    const collectionSelectOptions = useMemo(() => {
        const addresses = collectionInfo.addresses?.userDefined || [];

        return [{ value: "add new", text: "+ Create a New Collection" }].concat(
            addresses
                .filter(
                    (_address) => _address.creator === connectedWallet?.address
                )
                .map((collection) => {
                    const { address } = collection;
                    const crrCollectionInfo = collectionInfo[address];
                    return {
                        value: address,
                        text: crrCollectionInfo?.collection_info?.title || "",
                    };
                })
        );
    }, [collectionInfo, connectedWallet]);

    useEffect(() => {
        if (nftAddress) {
            const selectOptionValues = (collectionSelectOptions || []).map(
                (option) => option.value
            );
            if (selectOptionValues.includes(nftAddress)) {
                setValue("collection", nftAddress);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionSelectOptions, nftAddress]);

    const handleProductModal = () => {
        setShowProductModal(false);
    };

    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            if (!validationFile(e.target.files[0])) return;
            setSelectedImage(e.target.files[0]);
        }
    };

    // const handleAddNewMetadataItem = () => {
    //     setMetadataSet((prev) => prev.concat({ field: "", value: "" }));
    //     setHasMetadataError(false);
    // };

    const handleAddNewAttributeItem = () => {
        setAttributesSet((prev) => prev.concat({ field: "", value: "" }));
        setHasMetadataError(false);
    };

    // const handleChangeMetadataItem = (index, field, e) => {
    //     const { value } = e.target;
    //     const originSet = Array.from(metadataSet);
    //     originSet[index][field] = value;
    //     setMetadataSet(originSet);
    //     setHasMetadataError(false);
    // };

    const handleChangeAttributeItem = (index, field, e) => {
        const { value } = e.target;
        const originSet = Array.from(attributesSet);
        originSet[index][field] = value;
        setAttributesSet(originSet);
        setHasMetadataError(false);
    };

    const handleChangeCollection = (item, name) => {
        if (item.value === "add new") {
            router.push("/create-collection");
        } else {
            setValue(name, item.value);
        }
    };

    // const reset = () => {
    //     resetForm();
    //     setMetadataSet([{ field: "", value: "" }]);
    //     setAttributesSet([{ field: "", value: "" }]);
    // };

    const onSubmit = async (data, e) => {
        if (isSubmitting) return;

        if (!connectedWallet) {
            toast.error("Connect Wallet!");
            return;
        }
        const { target } = e;
        const submitBtn =
            target.localName === "span" ? target.parentElement : target;
        const isPreviewBtn = submitBtn.dataset?.btn;
        setHasImageError(!selectedImage);
        // building NFT data
        // building attributes data
        const attributes = [];
        attributesSet.forEach((attributeItem) => {
            const { field, value } = attributeItem;
            const _attribute = {};
            if (field && value) {
                _attribute.trait_type = field;
                _attribute.value = value;
            }
            attributes.push(_attribute);
        });
        const metadata = {};
        if (attributes.length) {
            metadata.attributes = attributes;
        }
        metadataSet.forEach((metadataItem) => {
            const { field, value } = metadataItem;
            if (field && value) {
                metadata[field] = value;
            }
        });
        if (!Object.keys(metadata).length) {
            setHasMetadataError(true);
            return;
        }
        if (!selectedImage) return;

        if (isPreviewBtn) {
            const nftData = {
                ...data,
                metadata,
            };
            setPreviewData({ ...nftData, image: selectedImage });
            setShowProductModal(true);
        }

        if (!isPreviewBtn) {
            setIsSubmitting(true);
            const queries = [
                uploadJSONToIpfs(data.token_id, metadata),
                uploadFileToIpfs(selectedImage),
            ];
            Promise.all(queries)
                .then(async (results) => {
                    const metadataHash = results[0];
                    const imageHash = results[1];
                    const token_uri = `https://secretsteampunks.mypinata.cloud/ipfs/${metadataHash}`;
                    const image_url = `https://secretsteampunks.mypinata.cloud/ipfs/${imageHash}`;
                    const msg = {
                        mint: {
                            token_id: data.token_id,
                            owner: connectedWallet.address,
                            token_uri,
                            content_type: nftType,
                            extension: {
                                minter: connectedWallet.address,
                                image_url,
                            },
                        },
                    };
                    try {
                        await runExecute(data.collection, msg);
                        toast.success("Uploaded Successfully!");
                        // reset();
                        // setSelectedImage();
                        // router.push(`/explore/${data.token_id}?collection=${data.collection}`)
                        router.push(`/explore/collections/${data.collection}`);
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        toast.error("Mint Failed!");
                        throw new Error(err);
                    }
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                    toast.error("Fail!");
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

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
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = [...e.dataTransfer.files];
        if (files.length && files[0]) {
            if (!validationFile(files[0])) return;
            setSelectedImage(files[0]);
        }
    };

    // const renderMetaSetItem = (metadataItem, index, totalData) => {
    //     const isLastElement = index === totalData.length - 1;
    //     return (
    //         <div key={index} className="row mt_lg--15 mt_md--15 mt_sm--15">
    //             <div className="col-md-12 col-xl-4">
    //                 <input
    //                     placeholder="Type"
    //                     value={metadataItem.field}
    //                     onChange={(e) =>
    //                         handleChangeMetadataItem(index, "field", e)
    //                     }
    //                 />
    //             </div>
    //             <div className="row col-md-12 col-xl-8 mt_lg--15 mt_md--15 mt_sm--15">
    //                 <div className={isLastElement ? "col-md-10" : "col-md-12"}>
    //                     <input
    //                         placeholder="Name"
    //                         value={metadataItem.value}
    //                         onChange={(e) =>
    //                             handleChangeMetadataItem(index, "value", e)
    //                         }
    //                     />
    //                 </div>
    //                 {isLastElement && (
    //                     <div className="col-md-2">
    //                         <div
    //                             style={{
    //                                 width: "100%",
    //                                 height: "100%",
    //                                 display: "flex",
    //                                 justifyContent: "center",
    //                                 alignItems: "center",
    //                             }}
    //                         >
    //                             <Button
    //                                 style={{
    //                                     minWidth: "unset",
    //                                     padding: 5,
    //                                     width: "100%",
    //                                 }}
    //                                 color="primary-alta"
    //                                 onClick={handleAddNewMetadataItem}
    //                             >
    //                                 +
    //                             </Button>
    //                         </div>
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //     );
    // };

    const renderAttributesSetItem = (attributeItem, index, totalData) => {
        const isLastElement = index === totalData.length - 1;
        return (
            <div key={index} className="row mt_lg--15 mt_md--15 mt_sm--15">
                <div className="col-md-12 col-xl-4">
                    <input
                        placeholder="Type"
                        value={attributeItem.field}
                        onChange={(e) =>
                            handleChangeAttributeItem(index, "field", e)
                        }
                    />
                </div>
                <div className="row col-md-12 col-xl-8 mt_lg--15 mt_md--15 mt_sm--15">
                    <div className={isLastElement ? "col-md-10" : "col-md-12"}>
                        <input
                            placeholder="Name"
                            value={attributeItem.value}
                            onChange={(e) =>
                                handleChangeAttributeItem(index, "value", e)
                            }
                        />
                    </div>
                    {isLastElement && (
                        <div className="col-md-2">
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    style={{
                                        minWidth: "unset",
                                        padding: 5,
                                        width: "100%",
                                    }}
                                    color="primary-alta"
                                    onClick={handleAddNewAttributeItem}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // const renderCollectionsOption = () => {
    //     const addresses = collectionInfo.addresses?.userDefined || [];
    //     return addresses.map((collection) => {
    //         const { address } = collection;
    //         const crrCollectionInfo = collectionInfo[address];
    //         return connectedWallet?.address === crrCollectionInfo?.minter ? (
    //             <option key={address} value={address}>
    //                 {crrCollectionInfo?.collection_info?.title || ""}
    //             </option>
    //         ) : null;
    //     });
    // };

    const renderImageVideoItem = () => {
        if (selectedImage?.type?.match("image.*")) {
            return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    id="createfileImage"
                    src={URL.createObjectURL(selectedImage)}
                    alt=""
                />
            );
        }
        if (selectedImage?.type?.match("video.*")) {
            return (
                <Video
                    className="upload-video-preview"
                    src={URL.createObjectURL(selectedImage)}
                    autoPlay
                    loop
                    alt=""
                />
            );
        }
        return null;
    };

    return (
        <>
            <div
                className={clsx(
                    "create-area",
                    space === 1 && "rn-section-gapTop",
                    className
                )}
            >
                <form action="#" onSubmit={handleSubmit(onSubmit)}>
                    <div className="container">
                        <div className="row g-5">
                            <div className="col-lg-3 offset-1 ml_md--0 ml_sm--0">
                                <div className="upload-area">
                                    <div className="upload-formate mb--30">
                                        <h6 className="title">Upload file</h6>
                                        <p className="formate">
                                            Choose your file to upload
                                        </p>
                                    </div>

                                    <div
                                        className="brows-file-wrapper"
                                        data-black-overlay="2"
                                        onMouseEnter={() => {
                                            setUploadShow(true);
                                        }}
                                        onMouseLeave={() => {
                                            setUploadShow(false);
                                        }}
                                        onDragEnter={(e) => handleDragEnter(e)}
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDragLeave={(e) => handleDragLeave(e)}
                                        onDrop={(e) => handleDrop(e)}
                                    >
                                        <input
                                            name="file"
                                            id="file"
                                            type="file"
                                            className="inputfile"
                                            data-multiple-caption="{count} files selected"
                                            multiple
                                            onChange={imageChange}
                                        />
                                        {selectedImage &&
                                            renderImageVideoItem()}

                                        <label
                                            htmlFor="file"
                                            title="No File Choosen"
                                        >
                                            {(!selectedImage || uploadShow) && (
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
                                    {hasImageError && !selectedImage && (
                                        <ErrorText>Image is required</ErrorText>
                                    )}
                                </div>

                                <div className="mt--100 mt_sm--30 mt_md--30 d-none d-lg-block">
                                    <h5> Note: </h5>
                                    <span>
                                        {" "}
                                        Service fee : <strong>2.5%</strong>{" "}
                                    </span>{" "}
                                    <br />
                                    {/* <span>
                                        {" "}
                                        You will receive :{" "}
                                        <strong>25.00 ETH $50,000</strong>
                                    </span> */}
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="form-wrapper-one">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="collection"
                                                    className="form-label"
                                                >
                                                    Collection
                                                </label>
                                                {/* <select
                                                    id="collection"
                                                    className="form-select form-select-lg"
                                                    aria-label="Default select example"
                                                    // defaultValue=""
                                                    {...register("collection", {
                                                        required:
                                                            "Collection is required",
                                                    })}
                                                >
                                                    <option value=""> </option>
                                                    {collectionInfo &&
                                                        renderCollectionsOption()}
                                                </select> */}
                                                <NiceSelect
                                                    id="collection"
                                                    className="form-select form-select-lg"
                                                    placeholder="Select a collection"
                                                    {...register("collection", {
                                                        required:
                                                            "Collection is required",
                                                    })}
                                                    onChange={
                                                        handleChangeCollection
                                                    }
                                                    options={
                                                        collectionSelectOptions
                                                    }
                                                    defaultCurrent={nftAddress}
                                                />
                                                {errors.collection && (
                                                    <ErrorText>
                                                        {
                                                            errors.collection
                                                                ?.message
                                                        }
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>
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
                                        <div className="col-md-12">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="tokenId"
                                                    className="form-label"
                                                >
                                                    Token ID
                                                </label>
                                                <input
                                                    id="tokenId"
                                                    placeholder="e. g. `Digital Awesome Game`"
                                                    {...register("token_id", {
                                                        required:
                                                            "Token ID is required",
                                                    })}
                                                />
                                                {errors.token_id && (
                                                    <ErrorText>
                                                        {
                                                            errors.token_id
                                                                ?.message
                                                        }
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            {/* <label
                                                htmlFor="metadata"
                                                className="form-label"
                                            >
                                                Metadata
                                            </label> */}
                                            {/* <div
                                                id="metadata"
                                                className="container"
                                            > */}
                                            {/* <div className="col-md-12">
                                                    <div className="input-box pb--20">
                                                        <div className="col-md-12">
                                                            {metadataSet.map(
                                                                (
                                                                    metadataItem,
                                                                    index
                                                                ) =>
                                                                    renderMetaSetItem(
                                                                        metadataItem,
                                                                        index,
                                                                        metadataSet
                                                                    )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div> */}
                                            <div className="col-md-12">
                                                <div className="input-box pb--20">
                                                    <label
                                                        htmlFor="attributes"
                                                        className="form-label"
                                                    >
                                                        Properties
                                                    </label>
                                                    <div
                                                        id="attributes"
                                                        className="col-md-12"
                                                    >
                                                        {attributesSet.map(
                                                            (
                                                                attributeItem,
                                                                index
                                                            ) =>
                                                                renderAttributesSetItem(
                                                                    attributeItem,
                                                                    index,
                                                                    attributesSet
                                                                )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {hasMetadataError && (
                                                <ErrorText>
                                                    Metadata is required
                                                </ErrorText>
                                            )}
                                            {/* </div> */}
                                        </div>

                                        {/* <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="price"
                                                    className="form-label"
                                                >
                                                    Item Price in $
                                                </label>
                                                <input
                                                    id="price"
                                                    placeholder="e. g. `20$`"
                                                    {...register("price", {
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message:
                                                                "Please enter a number",
                                                        },
                                                        required:
                                                            "Price is required",
                                                    })}
                                                />
                                                {errors.price && (
                                                    <ErrorText>
                                                        {errors.price?.message}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="Size"
                                                    className="form-label"
                                                >
                                                    Size
                                                </label>
                                                <input
                                                    id="size"
                                                    placeholder="e. g. `Size`"
                                                    {...register("size", {
                                                        required:
                                                            "Size is required",
                                                    })}
                                                />
                                                {errors.size && (
                                                    <ErrorText>
                                                        {errors.size?.message}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="Property"
                                                    className="form-label"
                                                >
                                                    Property
                                                </label>
                                                <input
                                                    id="Property"
                                                    placeholder="e. g. `Property`"
                                                    {...register("Property", {
                                                        required:
                                                            "Property is required",
                                                    })}
                                                />
                                                {errors.Property && (
                                                    <ErrorText>
                                                        {
                                                            errors.Property
                                                                ?.message
                                                        }
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4">
                                            <div className="input-box pb--20 rn-check-box">
                                                <input
                                                    className="rn-check-box-input"
                                                    type="checkbox"
                                                    id="putonsale"
                                                />
                                                <label
                                                    className="rn-check-box-label"
                                                    htmlFor="putonsale"
                                                >
                                                    Put on Sale
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4">
                                            <div className="input-box pb--20 rn-check-box">
                                                <input
                                                    className="rn-check-box-input"
                                                    type="checkbox"
                                                    id="instantsaleprice"
                                                />
                                                <label
                                                    className="rn-check-box-label"
                                                    htmlFor="instantsaleprice"
                                                >
                                                    Instant Sale Price
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4">
                                            <div className="input-box pb--20 rn-check-box">
                                                <input
                                                    className="rn-check-box-input"
                                                    type="checkbox"
                                                    id="unlockpurchased"
                                                />
                                                <label
                                                    className="rn-check-box-label"
                                                    htmlFor="unlockpurchased"
                                                >
                                                    Unlock Purchased
                                                </label>
                                            </div>
                                        </div> */}

                                        <div className="col-md-12 col-xl-4">
                                            <div className="input-box">
                                                <Button
                                                    color="primary-alta"
                                                    fullwidth
                                                    type="submit"
                                                    data-btn="preview"
                                                    onClick={handleSubmit(
                                                        onSubmit
                                                    )}
                                                >
                                                    Preview
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-xl-8 mt_lg--15 mt_md--15 mt_sm--15">
                                            <div className="input-box">
                                                <Button type="submit" fullwidth>
                                                    {`${
                                                        isSubmitting
                                                            ? "Submitting"
                                                            : "Submit"
                                                    } Item`}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt--100 mt_sm--30 mt_md--30 d-block d-lg-none">
                                <h5> Note: </h5>
                                <span>
                                    {" "}
                                    Service fee : <strong>2.5%</strong>{" "}
                                </span>{" "}
                                <br />
                                {/* <span>
                                    {" "}
                                    You will receive :{" "}
                                    <strong>25.00 ETH $50,000</strong>
                                </span> */}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {showProductModal && (
                <NftPreviewModal
                    show={showProductModal}
                    handleModal={handleProductModal}
                    data={previewData}
                />
            )}
        </>
    );
};

CreateNewArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
};

CreateNewArea.defaultProps = {
    space: 1,
};

export default CreateNewArea;
