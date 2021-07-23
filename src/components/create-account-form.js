import React, { useState, useEffect, useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import { form, inputItem, inputItem__label, inputItem__textInput, darkButton, formError } from '../css/form.module.css'

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
                navigate('/')
            } catch {
                console.log("Failed to sign up")
            }
        }
    }

    useEffect(() => {
        password === confirmPassword ? setPasswordMatch('Passwords match') : setPasswordMatch("Passwords don't match")
    }, [password, confirmPassword])

    return (
        <>
            <form className={form} onSubmit={onSubmit}>
                <div className={inputItem}>
                    <label>
                        <p className={inputItem__label}>Email</p>
                        <input className={inputItem__textInput}
                            placeholder="example@gmail.com"
                            type="text"
                            ref={email} />
                        {emailError && <p className={formError}>{emailError}</p>}
                    </label>
                </div>
                <div className={inputItem}>
                    <label>
                        <p className={inputItem__label}>Password</p>
                        <input className={inputItem__textInput}
                            placeholder="*****"
                            type="password"
                            value={password || ""}
                            onChange={onChangePassword} />
                        {passwordError && <p className={formError}>{passwordError}</p>}
                    </label>
                </div>
                <div className={inputItem}>
                    <label>
                        <p className={inputItem__label}>Confirm Password</p>
                        <input className={inputItem__textInput}
                            placeholder="*****"
                            type="password"
                            value={confirmPassword || ""}
                            onChange={onChangeConfirmPassword} />
                        {confirmPasswordError && <p className={formError}>{confirmPasswordError}</p>}
                    </label>
                    <p>{(confirmPassword.length > 0) ? passwordMatch : ""}</p>
                </div>
                <div className={inputItem}>
                    <input className={darkButton}
                        type="submit"
                        value="Create Your Account" />
                    {(emailError || passwordError || confirmPasswordError) && <p className={formError}>Looks like you missed a spot</p>}
                </div>
            </form>
        </>
    )
}

export default CreateAccountForm