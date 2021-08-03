import React, { useState, useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const ChangePasswordPage = () => {
    const currentPassword = useRef()
    const newPassword = useRef()
    const [currentPasswordError, setCurrentPasswordError] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const firebaseContext = useUser()

    const onSubmit = (e) => {
        console.log('len: ', (newPassword.current.value.length === 0))
        e.preventDefault()
        setCurrentPasswordError("")
        setNewPasswordError("")
        const reauthentication = firebaseContext?.reauthenticateUser(currentPassword.current.value, 'password')
        console.log("reauthentication: ", reauthentication)
        if (reauthentication === "success") {
            navigate('/', { state: { message: "password" } })
        } else {
            setCurrentPasswordError("It looks like the password you entered was incorrect.")
        }
        if (newPassword.current.value.length === 0) setNewPasswordError("You're going to have to enter a new password")
    }

    !firebaseContext?.userAuth && navigate('/sign-in')
    return (
        <Layout pageTitle="Change Your Password" headerLink="Logout">
            <Content contentTitle="Change your password" titlePosition='center'>
                <form className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.formField}>
                        <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                            <label>
                                <p className={FormCSS.inputItem__label}>Step 1</p>
                                <p className={FormCSS.inputItem__label}>What is your<br />current password?</p>
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
                                <p className={FormCSS.inputItem__label}>What would you like<br />your new password to be?</p>
                                <input className={FormCSS.inputItem__textInput}
                                    type="text"
                                    placeholder="*****"
                                    ref={newPassword} />
                                {newPasswordError && <p className={FormCSS.formError}>{newPasswordError}</p>}
                            </label>
                        </div>
                    </div>
                    <input className={FormCSS.submitButton}
                        type="submit"
                        value="Update Your Password" />
                </form>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default ChangePasswordPage