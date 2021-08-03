import React, { useState } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const ChangeSuitePage = () => {
    const [suite, setSuite] = useState("")
    const [suiteError, setSuiteError] = useState("")
    const firebaseContext = useUser()
    
    const onChangeSuite = (e) => setSuite(e.target.value)

    const onSubmit = (e) => {
        e.preventDefault()
        setSuiteError("")
        if (suite.length > 0) {
            firebaseContext?.addSuite(suite)
            if (typeof window !== 'undefined') navigate('/', { state: { message: "suite" } })
        } else {
            setSuiteError("You'll have to enter a suite number")
        }
    }

    if (!firebaseContext?.userAuth && typeof window !== 'undefined') navigate('/sign-in')
    return (
        <Layout pageTitle="Update Your Suite Number" headerLink="Logout">
            <Content contentTitle="Update your suite number" titlePosition='center'>
                <form className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.formField}>
                        <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                            <label>
                                <p className={FormCSS.inputItem__label}>Enter your<br />suite number</p>
                                <input className={FormCSS.inputItem__textInput}
                                    type="number"
                                    maxLength="3"
                                    placeholder={firebaseContext?.userData?.suite || "###"}
                                    value={suite}
                                    onChange={onChangeSuite} />
                                {suiteError && <p className={FormCSS.formError}>{suiteError}</p>}
                            </label>
                        </div>
                    </div>
                    <input className={FormCSS.submitButton}
                        type="submit"
                        value="Update your suite number" />
                </form>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default ChangeSuitePage