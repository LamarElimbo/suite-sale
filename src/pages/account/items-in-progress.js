import * as React from 'react'
import {ItemCardList} from '../../components/items'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const PostedItemsPage = () => {
  return (
    <Layout pageTitle="Home Page" headerLink="Logout">
      <Content contentTitle="Items in progress">
        <ItemCardList filter="in progress"/>
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default PostedItemsPage