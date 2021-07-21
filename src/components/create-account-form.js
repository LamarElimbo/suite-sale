import React, { useState, useEffect, useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import { form, formTitle, inputItem, inputItem__label, inputItem__textInput, darkButton } from '../css/form.module.css'

const CreateAccountForm = () => {
    const email = useRef('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState('')
    const firebaseContext = useUser()
    const signup = firebaseContext?.signup

    const onChangePassword = (e) => setPassword(e.target.value)
    const onChangeConfirmPassword = (e) => setConfirmPassword(e.target.value)

    async function onSubmit(e) {
        e.preventDefault()

        try {
            await signup(email.current.value, password)
            navigate('/')
        } catch {
            console.log("Failed to sign up")
        }
    }

    useEffect(() => {
        password === confirmPassword ? setPasswordMatch('Passwords match') : setPasswordMatch("Passwords don't match")
    }, [password, confirmPassword])

    return (
        <>
            <h2 className={formTitle}>Create a new account</h2>
            <form className={form} onSubmit={onSubmit}>
                <div className={inputItem}>
                    <label>
                        <p className={inputItem__label}>Your email</p>
                        <input className={inputItem__textInput}
                            placeholder="example@gmail.com"
                            type="text"
                            ref={email} />
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
                    </label>
                    <p>{(confirmPassword.length > 0) ? passwordMatch : ""}</p>
                </div>
                <div className={inputItem}>
                    <input className={darkButton}
                        type="submit"
                        value="Submit" />
                </div>
            </form>
        </>
    )
}

export default CreateAccountForm