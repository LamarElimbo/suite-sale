import React, { useState, useEffect, useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import * as FormCSS from '../css/form.module.css'

const CreateAccountForm = () => {
    const email = useRef('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const firebaseContext = useUser()
    const signup = firebaseContext?.signup

    const onChangePassword = (e) => setPassword(e.target.value)
    const onChangeConfirmPassword = (e) => setConfirmPassword(e.target.value)

    async function onSubmit(e) {
        e.preventDefault()
        setEmailError("")
        setPasswordError("")
        if (!email.current.value) setEmailError("You'll have to enter an email")
        if (!password) setPasswordError("You'll have to enter a password")
        if (!confirmPassword) setConfirmPasswordError("You'll have to confirm your password")
        if (email.current.value && password && confirmPassword) {
            try {
                await signup(email.current.value, password)
                if (typeof window !== 'undefined') navigate('/')
            } catch {
                console.log("Failed to sign up")
            }
        }
    }

    useEffect(() => {
        password === confirmPassword ? setPasswordMatch('Passwords match') : setPasswordMatch("Passwords don't match")
    }, [password, confirmPassword])

    return (
        <form className={FormCSS.form} onSubmit={onSubmit}>
            <div className={FormCSS.formField} style={{ flexDirection: "column" }}>
                <div className={FormCSS.inputItem}>
                    <label>
                        <p className={FormCSS.inputItem__label}>Email</p>
                        <input className={FormCSS.inputItem__textInput}
                            placeholder="example@gmail.com"
                            type="text"
                            ref={email} />
                        {emailError && <p className={FormCSS.formError}>{emailError}</p>}
                    </label>
                </div>
                <div className={FormCSS.inputItem}>
                    <label>
                        <p className={FormCSS.inputItem__label}>Password</p>
                        <input className={FormCSS.inputItem__textInput}
                            placeholder="*****"
                            type="password"
                            value={password || ""}
                            onChange={onChangePassword} />
                        {passwordError && <p className={FormCSS.formError}>{passwordError}</p>}
                    </label>
                </div>
                <div className={FormCSS.inputItem}>
                    <label>
                        <p className={FormCSS.inputItem__label}>Confirm Password</p>
                        <input className={FormCSS.inputItem__textInput}
                            placeholder="*****"
                            type="password"
                            value={confirmPassword || ""}
                            onChange={onChangeConfirmPassword} />
                        {confirmPasswordError && <p className={FormCSS.formError}>{confirmPasswordError}</p>}
                    </label>
                    <p style={{ marginTop: "10px" }}>{(confirmPassword.length > 0) ? passwordMatch : ""}</p>
                </div>
                {(emailError || passwordError || confirmPasswordError) && <p className={FormCSS.formError}>Looks like you missed a spot</p>}
            </div>
            <input className={FormCSS.submitButton}
                type="submit"
                value="Create Your Account" />
        </form>
    )
}

export default CreateAccountForm