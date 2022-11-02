import { useForm } from "react-hook-form";
import Button from "@ui/button";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";

const ReportForm = () => {
    const router = useRouter();
    /* const [showReportModal, setShowReportModal] = useState(false);
    const handleReportModal = () => {
        setShowReportModal((prev) => !prev);
    }; */
    const thisPageURL = useMemo(() => {
        const origin =
            typeof window !== "undefined" && window.location.origin
                ? window.location.origin
                : "";
        const path = origin + router.asPath;
        return path;
    }, [router.asPath]);
    const [buttonText, setButtonText] = useState("Report");
    const [disabled, setDisabled] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    async function submitReport(values) {
        // console.log(values);
        const config = {
            method: "post",
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
            headers: {
                "Content-Type": "application/json",
            },
            data: values,
        };
        try {
            setButtonText("Sending...");
            setDisabled((value) => !value);
            const response = await axios(config);
            // eslint-disable-next-line no-console
            console.log("response = ", response);
            if (response.status === 200) {
                setDisabled((value) => !value);
                reset(); // clear form
                toast.success("Report sent"); // confirmation message
                // handleReportModal();
                setButtonText("Report");
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }

    return (
        <form
            className="nuron-information"
            onSubmit={handleSubmit(submitReport)}
        >
            <input
                type="hidden"
                value={thisPageURL}
                {...register("reportedNFT")}
            />
            <div className="report-form-box">
                <div className="mb-4">
                    <label htmlFor="contact-name" className="form-label">
                        Your Name
                    </label>
                    <input
                        {...register("name", {
                            required: {
                                value: true,
                                message: "Please enter your name",
                            },
                            minLength: {
                                value: 3,
                                message: "Please enter your full name",
                            },
                            maxLength: {
                                value: 100,
                                message: "Name is too long",
                            },
                        })}
                        id="contact-name"
                        type="text"
                        placeholder=""
                        className={`${errors.name ? ` border-danger ` : null}`}
                    />
                    <span className="text-danger">{errors?.name?.message}</span>
                </div>
                <div className="mb-4">
                    <label htmlFor="Email" className="form-label">
                        Your Email
                    </label>
                    <input
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Please enter your email",
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                            minLength: {
                                value: 4,
                                message: "Your email is too short",
                            },
                            maxLength: {
                                value: 100,
                                message: "Email address too long",
                            },
                        })}
                        id="Email"
                        type="text"
                        placeholder=""
                        className={`${errors.email ? ` border-danger ` : null}`}
                    />
                    <span className="text-danger">
                        {errors?.email?.message}
                    </span>
                </div>
                <div>
                    <label htmlFor="reportMessage" className="form-label">
                        Why are you reporting?
                    </label>
                    <textarea
                        {...register("reportMessage", {
                            required: {
                                value: true,
                                message: "Please enter a message",
                            },
                            minLength: {
                                value: 8,
                                message: "Your message is too short",
                            },
                            maxLength: {
                                value: 1000,
                                message:
                                    "Your message cannot be longer than 1000 characters",
                            },
                        })}
                        id="report-message"
                        placeholder="Describe why you think this item should be removed from
                marketplace"
                        className={`${
                            errors.reportMessage
                                ? `border-2 border-danger `
                                : null
                        } mb-0`}
                    />
                    <span className="text-danger">
                        {errors?.reportMessage?.message}
                    </span>
                </div>

                <div className="report-button">
                    <Button
                        type="submit"
                        size="medium"
                        className="mb-3 mt-5 w-100"
                        disabled={disabled}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ReportForm;
