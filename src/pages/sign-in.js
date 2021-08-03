import React, { useState } from 'react'
import { Layout, Content } from '../components/layout'
import CreateAccountForm from '../components/create-account-form'
import LoginForm from '../components/login-form'
import * as LayoutCSS from '../css/layout.module.css'
import * as FormsCSS from '../css/form.module.css'
import * as ItemsCSS from '../css/items.module.css'

const SignIntoAccountPage = () => {
  const [formSelected, setFormSelected] = useState("")
  const onNewAccountClick = () => setFormSelected("new account")
  const onLoginClick = () => setFormSelected("login")

  return (
    <Layout pageTitle="Sign In" headerLink="None">
      <Content contentTitle="How would you like to sign in?" titlePosition='center'>
        <div className={ItemsCSS.itemCardArea + ' ' + FormsCSS.signInPageButtons} onClick={onNewAccountClick} onKeyDown={onNewAccountClick} role="button" tabIndex="0">
          <div className={ItemsCSS.itemCard} style={{ flex: "1 0 350px", justifyContent: "center" }}>
            <h2 className={ItemsCSS.cardInfo__item}>Create a new account</h2>
          </div>
        </div>
        <div className={ItemsCSS.itemCardArea + ' ' + FormsCSS.signInPageButtons} onClick={onLoginClick} onKeyDown={onLoginClick} role="button" tabIndex="0">
          <div className={ItemsCSS.itemCard} style={{ flex: "1 0 350px", justifyContent: "center" }}>
            <h2 className={ItemsCSS.cardInfo__item}>Log into your account</h2>
          </div>
        </div>
        
          <div className={FormsCSS.accountFormArea} style={(formSelected === 'new account') ? {display: "block"} : {display: "none"}}>
            <div className={LayoutCSS.title}>
              <h2 className={LayoutCSS.isCentered}>Create a new account</h2>
            </div>
            <CreateAccountForm />
          </div>
          <div className={FormsCSS.accountFormArea} style={(formSelected === 'login') ? {display: "block"} : {display: "none"}}>
            <div className={LayoutCSS.title}>
              <h2 className={LayoutCSS.isCentered}>Log into your account</h2>
            </div>
            <LoginForm />
          </div>
      </Content>
    </Layout>
  )
}

export default SignIntoAccountPage