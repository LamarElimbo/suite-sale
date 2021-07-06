import React, { useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const ChangePasswordPage = () => {
    const newPassword = useRef()
    const { updatePassword } = useUser()
    
    const onSubmit = (e) => {
        e.preventDefault()

        updatePassword(newPassword.current.value)
        navigate('/')
    }

    return (
        <Layout pageTitle="Home Page" headerLink="Logout">
            <Content contentTitle="Your account settings" titlePosition='true'>
                <form className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.inputItem}>
                        <label>
                            <p className={FormCSS.inputItem__label}>What you would like you new password to be?</p>
                            <input className={FormCSS.inputItem__textInput}
                                type="text"
                                ref={newPassword} />
                        </label>
                    </div>
                    <div className={FormCSS.inputItem}>
                        <input className={FormCSS.inputItem__submit}
                            type="submit"
                            value="Submit" />
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