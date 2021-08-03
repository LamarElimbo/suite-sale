import * as React from "react"
import { Layout, Content, SideNav } from '../components/layout'
import SideNavContent from '../components/side-nav'
import * as ItemsCSS from '../css/items.module.css'

const NotFoundPage = () => {
  return (
    <Layout pageTitle="Page Not Found">
      <Content contentTitle="Page not found">
        <div className={ItemsCSS.itemBuffer2}>
          <p className={ItemsCSS.itemStatus} style={{ color: 'white' }}>Sorry, but the page you were looking for couldn’t be found</p>
        </div>
      </Content>
      <SideNav>
        <SideNavContent type='account' />
      </SideNav>
    </Layout>
  )
}

export default NotFoundPage