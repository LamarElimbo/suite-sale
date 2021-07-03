import * as React from 'react'
import {Layout, Content, SideNav} from '../components/layout'
import {ItemCard, ItemCardList} from '../components/items'
import SideNavContent from '../components/side-nav'


const IndexPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <Content>
        <ItemCard create='true' />
        <ItemCardList filter='all items'/>
      </Content>
      <SideNav>
        <SideNavContent />
      </SideNav>
    </Layout>
  )
}

export default IndexPage