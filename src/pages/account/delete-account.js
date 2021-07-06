import * as React from 'react'
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const DeleteAccountPage = () => {
    const { deleteAccount } = useUser()
    
    const onDeleteAccount = () => deleteAccount()

    return (
        <Layout pageTitle="Delete Account" headerLink="Logout">
            <Content contentTitle="Your account settings" titlePosition='true'>
                <p>Are you sure that you want to delete your account?</p>
                <div className={FormCSS.inputItem__submitArea}>
                    <button className={FormCSS.inputItem__submit} onClick={onDeleteAccount}>Delete your account</button>
                </div>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default DeleteAccountPage