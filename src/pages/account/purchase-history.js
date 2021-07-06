import * as React from 'react'
import {ItemCardList} from '../../components/items'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const AccountPage = () => {
  return (
    <Layout pageTitle="Home Page" headerLink="Logout">
      <Content contentTitle="Your active listings">
        <ItemCardList filter="purchase history"/>
      </Content>
      <SideNav>
        <SideNavContent type='posted listings' />
        <SideNavContent type='purchase history' />
        <SideNavContent type='saved' />
        <SideNavContent type='account settings' />
      </SideNav>
    </Layout>
  )
}

export default AccountPage