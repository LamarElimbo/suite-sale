import * as React from 'react'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const AccountPage = () => {
  return (
    <Layout pageTitle="Home Page" headerLink="Logout">
      <Content contentTitle="Your active listings">
        
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default AccountPage