import * as React from 'react'
import { ItemCardList } from '../../components/items'
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const AccountPage = () => {
  return (
    <Layout pageTitle="Account" headerLink="Logout">
      <Content contentTitle="Your active listings">
        <ItemCardList filter="posted items" />
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default AccountPage