import * as React from 'react'
import { Layout, Content, SideNav } from '../components/layout'
import CreateAccountForm from '../components/create-account-form'
import LoginForm from '../components/login-form'
import * as FormsCSS from '../css/form.module.css'
import * as SideNavCSS from '../css/side-nav.module.css'

const SignIntoAccountPage = () => {
  return (
    <Layout pageTitle="Create Account Page" headerLink="None">
      <Content>
        <div className={FormsCSS.accountFormArea}>
          <CreateAccountForm />
        </div>
      </Content>
      <Content>
        <div className={FormsCSS.accountFormArea}>
          <LoginForm />
        </div>
      </Content>
      <SideNav>
        <p className={SideNavCSS.notes}>Note about how your apartment number will be used.</p>
      </SideNav>
    </Layout>
  )
}

export default SignIntoAccountPage