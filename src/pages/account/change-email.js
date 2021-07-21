import React, { useRef } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const ChangeEmailPage = () => {
    const email = useRef()
    const firebaseContext = useUser()
    const updateEmail = firebaseContext?.updateEmail

    const onSubmit = (e) => {
        e.preventDefault()
        updateEmail(email.current.value)
        navigate('/')
    }

    return (
        <Layout pageTitle="Home Page" headerLink="Logout">
            <Content contentTitle="Your account settings" titlePosition='true'>
                <form className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.inputItem}>
                        <label>
                            <p className={FormCSS.inputItem__label}>Update your email</p>
                            <input className={FormCSS.inputItem__textInput}
                                placeholder={firebaseContext?.userData.email}
                                type="text"
                                ref={email} />
                        </label>
                    </div>
                    <div className={FormCSS.inputItem}>
                        <input className={FormCSS.darkButton}
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

export default ChangeEmailPage