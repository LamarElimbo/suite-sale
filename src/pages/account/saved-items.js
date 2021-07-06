import * as React from 'react'
import {ItemCardList} from '../../components/items'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const SavedItemsPage = () => {
  return (
    <Layout pageTitle="Home Page" headerLink="Logout">
      <Content contentTitle="Your saved items">
        <ItemCardList filter="saved"/>
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default SavedItemsPage