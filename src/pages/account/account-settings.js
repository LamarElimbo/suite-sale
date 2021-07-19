import * as React from 'react'
import { Link } from 'gatsby'
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const AccountSettingsPage = () => {
    return (
        <Layout pageTitle="Home Page" headerLink="Logout">
            <Content contentTitle="Your account settings" titlePosition='true'>
                <Link to='/account/change-email' className={FormCSS.lightButton}>Change your email</Link>
                <Link to='/account/change-password' className={FormCSS.lightButton}>Change your password</Link>
                <Link to='/account/delete-account' className={FormCSS.lightButton}>Delete your account</Link>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default AccountSettingsPage