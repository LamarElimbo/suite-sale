import React, { useState, useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const DeleteAccountPage = () => {
    const currentPassword = useRef()
    const [currentPasswordError, setCurrentPasswordError] = useState("")
    const firebaseContext = useUser()

    const onSubmit = (e) => {
        e.preventDefault()
        setCurrentPasswordError("")
        const reauthentication = firebaseContext?.reauthenticateUser(currentPassword.current.value, 'delete')
        if (reauthentication === "success") {
            if (typeof window !== 'undefined') navigate('/', { state: { message: "delete" } })
        } else {
            setCurrentPasswordError("It looks like the password you entered was incorrect.")
        }
    }

    if (!firebaseContext?.userAuth && typeof window !== 'undefined') navigate('/sign-in')
    return (
        <Layout pageTitle="Delete Your Account" headerLink="Logout">
            <Content contentTitle="Delete your account" titlePosition='center'>
                <div className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.formField}>
                        <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                            <label>
                                <p className={FormCSS.inputItem__label}>Enter your<br />current password</p>
                                <input className={FormCSS.inputItem__textInput}
                                    type="text"
                                    placeholder="*****"
                                    ref={currentPassword} />
                                {currentPasswordError && <p className={FormCSS.formError}>{currentPasswordError}</p>}
                            </label>
                        </div>
                    </div>
                    <input className={FormCSS.submitButton}
                        type="submit"
                        value="Delete your account" />
                </div>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default DeleteAccountPage