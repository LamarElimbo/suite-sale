import React, { useState, useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const ChangeEmailPage = () => {
    const currentPassword = useRef()
    const email = useRef()
    const [currentPasswordError, setCurrentPasswordError] = useState("")
    const [newEmailError, setNewEmailError] = useState("")
    const firebaseContext = useUser()
    console.log("userAuth: ", firebaseContext?.userAuth?.email)

    const onSubmit = (e) => {
        e.preventDefault()
        setCurrentPasswordError("")
        setNewEmailError("")
        const reauthentication = firebaseContext?.reauthenticateUser(currentPassword.current.value, 'email', email.current.value)
        console.log("reauthentication: ", reauthentication)
        if (reauthentication === "success") {
            if (typeof window !== 'undefined') navigate('/', { state: { message: "email" } })
        } else {
            setCurrentPasswordError("It looks like the password you entered was incorrect.")
        }
        if (email.current.value.length === 0) setNewEmailError("You're going to have to enter a new email")
    }

    if (!firebaseContext?.userAuth && typeof window !== 'undefined') navigate('/sign-in')
    return (
        <Layout pageTitle="Change Your Email" headerLink="Logout">
            <Content contentTitle="Change your email" titlePosition='center'>
                <form className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.formField}>
                        <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                            <label>
                                <p className={FormCSS.inputItem__label}>Step 1</p>
                                <p className={FormCSS.inputItem__label}>Enter your<br />current password</p>
                                <input className={FormCSS.inputItem__textInput}
                                    type="text"
                                    placeholder="*****"
                                    ref={currentPassword} />
                                {currentPasswordError && <p className={FormCSS.formError}>{currentPasswordError}</p>}
                            </label>
                        </div>
                    </div>
                    <div className={FormCSS.formField}>
                        <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                            <label>
                                <p className={FormCSS.inputItem__label}>Step 2</p>
                                <p className={FormCSS.inputItem__label}>What's your<br />new email?</p>
                                <input className={FormCSS.inputItem__textInput}
                                    type="text"
                                    placeholder={firebaseContext?.userAuth.email}
                                    ref={email} />
                                {newEmailError && <p className={FormCSS.formError}>{newEmailError}</p>}
                            </label>
                        </div>
                    </div>
                    <input className={FormCSS.submitButton}
                        type="submit"
                        value="Update Your Email" />
                </form>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default ChangeEmailPage