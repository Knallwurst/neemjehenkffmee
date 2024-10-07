import styles from "./Register.module.css"
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Input from "../../components/input/Input.jsx";

function Register() {
    const {handleSubmit, formState: {errors, isDirty, isValid}, register, watch} = useForm({mode: 'onChange'});
    const navigate = useNavigate();
    const watchPassword = watch("password");
    const PW_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9';<>&|/\\]).{8,24}$/
    const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const UN_REGEX = /^[a-zA-Z]*[a-zA-Z0-9-_]{3,23}$/;

    async function handleFormSubmit(data) {
        const v1 = UN_REGEX.test(data.username);
        const v2 = PW_REGEX.test(data.password);
        const controller = new AbortController();

        try {
            // only request if button is not enabled with JS hack
            if (v1 && v2 && data.password === data["matching-password"]) {
                await axios.post('http://api.datavortex.nl/neemjehenkffmee/users', {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    info: data.email,
                    authorities: [
                        {
                            "authority": "USER"
                        }
                    ]
                }, {
                    signal: controller.signal,
                });
                console.log("Registration successful");
                navigate('/signin');
            }
        } catch (error) {
            if (controller.signal.aborted) {
                console.error('Request cancelled:', error.message);
            } else {
                console.error(error);
            }
        }
        controller.abort();
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleFormSubmit)} className={styles["register-form"]}>
                <h2>Register</h2>
                <label htmlFor="username-field" className={styles["label"]}>Username:</label>
                <Input
                    id="username-field"
                    name="username"
                    type="text"
                    register={register}
                    errors={errors}
                    customValidateParams={{
                        "minLength": (v) => v.length >= 3 || "Invalid username",
                        "maxLength": (v) => v.length <= 23 || "Max. number of characters is 23",
                        matchPattern: (v) => UN_REGEX.test(v) || "Only text, numbers and - or _ are allowed",
                    }}
                />
                <label htmlFor="email-field" className={styles["label"]}>Email:</label>
                <Input
                    id="email-field"
                    name="email"
                    register={register}
                    errors={errors}
                    customValidateParams={{
                        matchPattern: (v) => EMAIL_REGEX.test(v) || "Invalid email",
                    }}
                />
                <label htmlFor="password-field" className={styles["label"]}>Password:</label>
                <Input
                    id="password-field"
                    name="password"
                    type="password"
                    register={register}
                    errors={errors}
                    validationParams={{
                        required: {
                            value: true,
                            message: 'This field is required',
                        },
                        validate: {
                            matchPattern: (v) => PW_REGEX.test(v) || "Password should be at least 8 characters long,\n" +
                                "and have at least one uppercase letter,\n" +
                                "one lowercase letter,\n" +
                                "one digit,\n" +
                                "and one special character,\n" +
                                "' ; < > & | / \\ are not allowed"
                        }
                    }}
                />
                <label htmlFor="matching-password-field" className={styles["label"]}>Confirm password:</label>
                <Input
                    id="matching-password-field"
                    name="matching-password"
                    type="password"
                    register={register}
                    errors={errors}
                    validationParams={{
                        required: {
                            value: true,
                            message: 'This field is required',
                        },
                        validate: {
                            matchPattern: (v) => PW_REGEX.test(v) || "Password does not meet the requirements",
                            "match": (v) => v === watchPassword || 'Passwords do not match'
                        }
                    }}
                />
                <button className={styles["register-button"]}
                        type="submit"
                        id="register-button"
                        disabled={!isDirty || !isValid}
                >
                    Sign Up
                </button>
            </form>
            <p><Link to="/signin" className={styles["register-link"]}>Already registered? Sign in here</Link></p>
        </>
    );
}

export default Register;