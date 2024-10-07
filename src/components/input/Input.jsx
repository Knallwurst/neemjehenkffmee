import {useEffect} from "react";
import styles from "./Input.module.css";

function Input({id, type, name, register, errors, customValidateParams}) {
    useEffect(() => {
        register(name);
    }, [name, register, errors]);

    const validationParams = {
        required: {
            value: true,
            message: 'Dit veld is verplicht',
        },
        validate: {}
    };

    if (customValidateParams) {
        validationParams.validate = customValidateParams;
    }

    const inputProps = {
        id: id,
        ...register(name, type, validationParams)
    };

    return (
        <div className={styles["input-wrapper"]}>
                <input
                    {...inputProps}
                    className={styles["input__password"]}
                />
            {errors[name] && <small className={styles["errors"]}>{errors[name].message}</small>}
        </div>
    );
}

export default Input;