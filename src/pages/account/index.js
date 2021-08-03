import * as React from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { ItemCardList } from '../../components/items'
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'

const AccountPage = () => {
  const firebaseContext = useUser()
  !firebaseContext?.userAuth && navigate('/sign-in')
  return (
    <Layout pageTitle="Account" headerLink="Logout">
      <Content contentTitle="Your items in progress">
        <ItemCardList filter="in progress" />
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default AccountPage