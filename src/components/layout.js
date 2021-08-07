import * as React from 'react'
import { Link } from 'gatsby'
import { useUser } from "../context/UserContext"
import * as LayoutCSS from '../css/layout.module.css'

export const Content = ({ contentTitle, children, titlePosition, sideNav = true, message, setMessage }) => {
    const dismissMessage = () => setMessage("")
    const firebaseContext = useUser()

    const getMessage = () => {
        switch (message) {
            default:
                return null
            case 'item-create':
                return (
                    <>
                        <p className={LayoutCSS.notificationMessage}>Your item has been added!</p>
                        <p className={LayoutCSS.notificationAction}>You can find all of your posted items in your <Link to="/account/posted-items">account page</Link></p>
                        {firebaseContext?.userData?.itemsPosted.length === 0 && <Link to={'/account/change-notification'} style={{marginLeft: "10px"}} className={LayoutCSS.notificationAction}>Select how you'd like to be notified</Link>}
                    </>
                )
            case 'item-update':
                return <p className={LayoutCSS.notificationMessage}>Your item has been successfully updated!</p>
            case 'item-delete':
                return <p className={LayoutCSS.notificationMessage}>Your item has been successfully deleted!</p>
            case 'email':
                return <p className={LayoutCSS.notificationMessage}>Your email has been successfully updated!</p>
            case 'password':
                return <p className={LayoutCSS.notificationMessage}>Your password has been successfully updated!</p>
            case 'suite':
                return <p className={LayoutCSS.notificationMessage}>Your suite number has been successfully updated!</p>
            case 'notificationMethod':
                return <p className={LayoutCSS.notificationMessage}>Your notification method has been successfully updated!</p>
            case 'paymentMethod':
                return <p className={LayoutCSS.notificationMessage}>Your accepted payment methods have been successfully updated!</p>
            case 'item-buy':
                return (
                    <>
                        <p className={LayoutCSS.notificationMessage}>The seller has been notified of your interest in their item.</p>
                        <p className={LayoutCSS.notificationAction}>Once they confirm a time that they're available, you'll be notified with the final details.</p>
                        {firebaseContext?.userData?.itemsPurchased.length === 0 && <Link to={'/account/change-notification'} style={{marginLeft: "10px"}} className={LayoutCSS.notificationAction}>Select how you'd like to be notified</Link>}
                    </>
                )
            case 'item-confirm':
                return (
                    <>
                        <p className={LayoutCSS.notificationMessage}>The buyer has been notified of your time confirmation.</p>
                        <p className={LayoutCSS.notificationAction}>Next Step: Mark your calendar & meet your buyer.</p>
                    </>
                )
            case 'item-cancel':
                return <p className={LayoutCSS.notificationMessage}>The buyer has been notified that their order has been cancelled.</p>
        }
    }

    return (
        <div className={LayoutCSS.leftCol} style={sideNav ? { borderRight: "2px solid black", marginRight: "-1px" } : { border: "none" }}>
            {contentTitle &&
                <div className={LayoutCSS.title}>
                    <h2 className={titlePosition && LayoutCSS.isCentered}>{contentTitle}</h2>
                </div>
            }
            <div className={LayoutCSS.leftColBody}>
                {message?.length > 0 &&
                    <div className={LayoutCSS.aboutSection}>
                        <p className={LayoutCSS.aboutTagline}>Success!</p>
                        <div className={LayoutCSS.notificationLink}>
                            {getMessage()}
                            <button className={LayoutCSS.statusButton} onClick={dismissMessage}>Dismiss</button>
                        </div>
                    </div>
                }
                {children}
            </div>
        </div>
    )
}

export const SideNav = ({ children }) => <div className={LayoutCSS.rightCol}>{children}</div>

const HeaderLink = ({ headerLink }) => {
    const firebaseContext = useUser()
    switch (headerLink) {
        case "Logout":
            const onLogout = () => firebaseContext?.logout()
            return <Link to="/" onClick={onLogout}><h1>Logout</h1></Link>
        case "None":
            return null
        default:
            if (firebaseContext?.userAuth) {
                return <Link to="/account"><h1>Your Account</h1></Link>
            } else {
                return <Link to="/sign-in"><h1>Sign In</h1></Link>
            }
    }
}

export const Layout = ({ pageTitle, headerLink, children }) => {
    return (
        <main>
            <title>{pageTitle} | Suite Sale</title>
            <div className={LayoutCSS.body}>
                <div className={LayoutCSS.header}>
                    <Link to="/">
                        <h1>Suite Sale<span className={LayoutCSS.address}> - 665 Roselawn Avenue</span></h1>
                    </Link>
                    <HeaderLink headerLink={headerLink} />
                </div>
                <div className={LayoutCSS.content}>{children}</div>
            </div>
        </main>
    )
}