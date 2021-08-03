import * as React from 'react'
import { Link, navigate } from 'gatsby'
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as ItemsCSS from '../../css/items.module.css'

const AccountSettingsPage = () => {
    const firebaseContext = useUser()
    !firebaseContext?.userAuth && navigate('/sign-in')
    return (
        <Layout pageTitle="Account Settings" headerLink="Logout">
            <Content contentTitle="Your account settings" titlePosition='center'>
                <Link to='/account/change-email' className={ItemsCSS.itemCardArea}>
                    <div className={ItemsCSS.itemCard} style={{flex: "1 0 350px", justifyContent: "center"}}>
                        <h2 className={ItemsCSS.cardInfo__item}>Change your email</h2>
                    </div>
                </Link>
                <Link to='/account/change-password' className={ItemsCSS.itemCardArea}>
                    <div className={ItemsCSS.itemCard} style={{flex: "1 0 350px", justifyContent: "center"}}>
                        <h2 className={ItemsCSS.cardInfo__item}>Change your password</h2>
                    </div>
                </Link>
                <Link to='/account/change-suite' className={ItemsCSS.itemCardArea}>
                    <div className={ItemsCSS.itemCard} style={{flex: "1 0 350px", justifyContent: "center"}}>
                        <h2 className={ItemsCSS.cardInfo__item}>Change your suite</h2>
                    </div>
                </Link>
                <Link to='/account/change-notification' className={ItemsCSS.itemCardArea}>
                    <div className={ItemsCSS.itemCard} style={{flex: "1 0 350px", justifyContent: "center"}}>
                        <h2 className={ItemsCSS.cardInfo__item}>Change your notification method</h2>
                    </div>
                </Link>
                <Link to='/account/payment-methods' className={ItemsCSS.itemCardArea}>
                    <div className={ItemsCSS.itemCard} style={{flex: "1 0 350px", justifyContent: "center"}}>
                        <h2 className={ItemsCSS.cardInfo__item}>Change your accepted payment methods</h2>
                    </div>
                </Link>
                <Link to='/account/delete-account' className={ItemsCSS.itemCardArea}>
                    <div className={ItemsCSS.itemCard} style={{flex: "1 0 350px", justifyContent: "center"}}>
                        <h2 className={ItemsCSS.cardInfo__item}>Delete your account</h2>
                    </div>
                </Link>
                <div className={ItemsCSS.itemBuffer1}></div>
                <div className={ItemsCSS.itemBuffer2}></div>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default AccountSettingsPage