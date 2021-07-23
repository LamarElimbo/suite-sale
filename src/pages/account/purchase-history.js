import * as React from 'react'
import {ItemCardList} from '../../components/items'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const PurchaseHistoryPage = () => {
  return (
    <Layout pageTitle="Your Purchase History" headerLink="Logout">
      <Content contentTitle="Your purchase history">
        <ItemCardList filter="purchase history"/>
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default PurchaseHistoryPage