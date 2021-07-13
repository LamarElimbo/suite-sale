import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { useUser } from "../context/UserContext"
import * as LayoutCSS from '../css/layout.module.css'


export const Content = ({ contentTitle, children, titlePosition }) => {
    return (
        <div className={LayoutCSS.leftCol}>
            <h2 className={titlePosition && LayoutCSS.isCentered}>{contentTitle}</h2>
            <div className={LayoutCSS.leftColBody}>{children}</div>
        </div>
    )
}

export const SideNav = ({ children }) => {
    return (
        <div className={LayoutCSS.rightCol}>
            {children}
        </div>
    )
}

const HeaderLink = ({ headerLink }) => {
    //const { userAuth, logout } = useUser()
    const firebaseContext = useUser()

    switch (headerLink) {
        case "Login":
            return (
                <Link to="/login">
                    <h1>Login</h1>
                </Link>
            )
        case "Logout":
            const onLogout = () => firebaseContext?.logout()
            return (
                <Link to="/" onClick={onLogout}>
                    <h1>Logout</h1>
                </Link>
            )
        default:
            if (firebaseContext?.userAuth) {
                return (
                    <Link to="/account">
                        <h1>Your Account</h1>
                    </Link>
                )
            } else {
                return (
                    <Link to="/create-account">
                        <h1>Create Account</h1>
                    </Link>
                )
            }
    }
}

export const Layout = ({ pageTitle, headerLink, children }) => {
    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                }
            }
        }  
    `)

    return (
        <main>
            <title>{pageTitle} | {data.site.siteMetadata.title}</title>
            <div className={LayoutCSS.body}>
                <div className={LayoutCSS.header}>
                    <Link to="/">
                        <h1>Suite Sale - 665 Roselawn Avenue</h1>
                    </Link>
                    <HeaderLink headerLink={headerLink} />
                </div>
                <div className={LayoutCSS.content}>
                    {children}
                </div>
            </div>
        </main>
    )
}