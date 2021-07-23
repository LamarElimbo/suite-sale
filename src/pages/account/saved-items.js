import * as React from 'react'
import {ItemCardList} from '../../components/items'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const SavedItemsPage = () => {
  return (
    <Layout pageTitle="Your Cart" headerLink="Logout">
      <Content contentTitle="Your cart">
        <ItemCardList filter="saved"/>
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default SavedItemsPage