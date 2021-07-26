import * as React from 'react'
import { Layout, Content, SideNav } from '../components/layout'
import CreateAccountForm from '../components/create-account-form'
import LoginForm from '../components/login-form'
import * as FormsCSS from '../css/form.module.css'
import * as SideNavCSS from '../css/side-nav.module.css'

const SignIntoAccountPage = () => {
  return (
    <Layout pageTitle="Sign In" headerLink="None">
      <Content contentTitle="Create a new account" titlePosition='center'>
        <div className={FormsCSS.accountFormArea}>
          <CreateAccountForm />
        </div>
      </Content>
      <Content contentTitle="Log into your account" titlePosition='center' sideNav={false}>
        <div className={FormsCSS.accountFormArea}>
          <LoginForm />
        </div>
      </Content>
    </Layout>
  )
}

export default SignIntoAccountPage