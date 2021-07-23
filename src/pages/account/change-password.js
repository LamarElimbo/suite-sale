import React, { useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const ChangePasswordPage = () => {
    const newPassword = useRef()
    const firebaseContext = useUser()
    const updatePassword = firebaseContext?.updatePassword
    
    const onSubmit = (e) => {
        e.preventDefault()

        updatePassword(newPassword.current.value)
        navigate('/', {state: { message: "password"}})
    }

    return (
        <Layout pageTitle="Change Your Password" headerLink="Logout">
            <Content contentTitle="Change your password" titlePosition='center'>
                <form className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.inputItem}>
                        <label>
                            <p className={FormCSS.inputItem__label}>What would you like your new password to be?</p>
                            <input className={FormCSS.inputItem__textInput}
                                type="text"
                                placeholder="*****"
                                ref={newPassword} />
                        </label>
                    </div>
                    <div className={FormCSS.inputItem}>
                        <input className={FormCSS.darkButton}
                            type="submit"
                            value="Update Your Password" />
                    </div>
                </form>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default ChangePasswordPage