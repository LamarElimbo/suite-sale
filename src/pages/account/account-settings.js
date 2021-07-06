import * as React from 'react'
import { Link } from 'gatsby'
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const AccountSettingsPage = () => {
    return (
        <Layout pageTitle="Home Page" headerLink="Logout">
            <Content contentTitle="Your account settings" titlePosition='true'>
                <Link to='/account/change-email'>
                    <p className={FormCSS.inputItem__submit}>Change your email</p>
                </Link>
                <Link to='/account/change-password'>
                    <p className={FormCSS.inputItem__submit}>Change your password</p>
                </Link>
                <Link to='/account/delete-account'>
                    <p className={FormCSS.inputItem__submit}>Delete your account</p>
                </Link>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default AccountSettingsPage