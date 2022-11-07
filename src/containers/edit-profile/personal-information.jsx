import Button from "@ui/button";
import NiceSelect from "@ui/nice-select";
import { useWalletManager } from "@noahsaso/cosmodal";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@app/hooks";
import { countries } from "@constant";
import Anchor from "@ui/anchor";
import { editUser } from "./hooks";

const PersonalInformation = () => {
    const { connectedWallet } = useWalletManager();
    const [personalInformation, setPersonalInformation] = useState({});
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const dispatch = useAppDispatch();
    useEffect(() => {
        setPersonalInformation(userInfo);
    }, [userInfo]);
    const handleChangePersonalInfo = (e) => {
        const { name, value } = e.target;
        setPersonalInformation((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeSelect = (field, value) => {
        setPersonalInformation((prev) => ({
            ...prev,
            [field]: value.value,
        }));
    };

    const handleSave = async () => {
        try {
            await editUser(
                personalInformation,
                connectedWallet?.address,
                dispatch
            );
            toast.success("Successfully Registered.");
        } catch (err) {
            toast.error("Register Failed");
        }
    };
    return (
        <div className="nuron-information">
            <div className="profile-form-wrapper">
                <div className="input-two-wrapper mb--15">
                    <div className="first-name half-wid">
                        <label htmlFor="contact-name" className="form-label">
                            First Name
                        </label>
                        <input
                            name="first_name"
                            id="contact-name"
                            type="text"
                            placeholder="Mr."
                            value={personalInformation.first_name || ""}
                            onChange={handleChangePersonalInfo}
                        />
                    </div>
                    <div className="last-name half-wid">
                        <label
                            htmlFor="contact-name-last"
                            className="form-label"
                        >
                            Last Name
                        </label>
                        <input
                            name="last_name"
                            id="contact-name-last"
                            type="text"
                            placeholder="e.g. Sunayra"
                            value={personalInformation.last_name || ""}
                            onChange={handleChangePersonalInfo}
                        />
                    </div>
                </div>
                <div className="email-area">
                    <label htmlFor="Email" className="form-label">
                        Edit Your Email
                    </label>
                    <input
                        name="email"
                        id="Email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={personalInformation.email}
                        onChange={handleChangePersonalInfo}
                    />
                </div>
                <div className="input-two-wrapper mt--15">
                    <div className="half-wid">
                        <label htmlFor="instagram" className="form-label">
                            Instagram
                        </label>
                        <input
                            name="instagram"
                            id="instagram"
                            type="text"
                            placeholder=""
                            value={personalInformation.instagram || ""}
                            onChange={handleChangePersonalInfo}
                        />
                    </div>
                    <div className="half-wid">
                        <label htmlFor="twitter" className="form-label">
                            Twitter
                        </label>
                        <input
                            name="twitter"
                            id="twitter"
                            type="text"
                            placeholder=""
                            value={personalInformation.twitter || ""}
                            onChange={handleChangePersonalInfo}
                        />
                    </div>
                </div>
            </div>
            <div className="edit-bio-area mt--30">
                <label htmlFor="Discription" className="form-label">
                    Edit Your Bio
                </label>
                <textarea
                    id="Discription"
                    name="bio"
                    placeholder="Hello, I am Alamin, A Front-end Developer..."
                    value={personalInformation.bio}
                    onChange={handleChangePersonalInfo}
                />
            </div>

            <div className="input-two-wrapper mt--15">
                {/* <div className="half-wid role-area">
                    <label htmlFor="Role" className="form-label mb--10">
                        Your Role
                    </label>
                    <input
                        name="role"
                        id="Role"
                        type="text"
                        placeholder="Front-end Developer"
                        value={personalInformation.role || ""}
                        onChange={handleChangePersonalInfo}
                    />
                </div> */}
                <div className="half-wid gender">
                    <NiceSelect
                        options={[
                            { value: 1, text: "male" },
                            { value: 0, text: "female" },
                        ]}
                        placeholder="Select Your Gender"
                        className="profile-edit-select"
                        defaultCurrent={personalInformation.gender}
                        onChange={(e) => handleChangeSelect("gender", e)}
                    />
                </div>
                <div className="half-wid currency">
                    <NiceSelect
                        options={countries.map((country) => ({
                            value: country,
                            text: country,
                        }))}
                        placeholder="Location"
                        className="profile-edit-select"
                        defaultCurrent={personalInformation.location}
                        onChange={(e) => handleChangeSelect("location", e)}
                    />
                </div>
            </div>

            <div className="button-area save-btn-edit">
                <Anchor path={`/profile/${connectedWallet?.address}`}>
                    <Button
                        className="mr--15"
                        color="primary-alta"
                        size="medium"
                    >
                        Cancel
                    </Button>
                </Anchor>
                <Button size="medium" onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default PersonalInformation;
