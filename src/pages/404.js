import * as React from "react"
import { Layout, Content, SideNav } from '../components/layout'
import SideNavContent from '../components/side-nav'

const NotFoundPage = () => {
  const addMargin = {
    marginTop: "30px"
  }

  return (
    <Layout pageTitle="Page Not Found">
      <Content contentTitle="Page not found">
        <p style={addMargin}>Sorry, but the page you were looking for couldn’t be found</p>
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default NotFoundPage