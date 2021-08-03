import * as React from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import {ItemCardList} from '../../components/items'
import {Layout, Content, SideNav} from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const PostedItemsPage = () => {

  const firebaseContext = useUser()
  !firebaseContext?.userAuth && navigate('/sign-in')
  return (
    <Layout pageTitle="Items In Progress" headerLink="Logout">
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