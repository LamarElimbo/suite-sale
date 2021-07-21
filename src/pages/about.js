import * as React from 'react'
import { Link } from 'gatsby'
import { Layout, Content, SideNav } from '../components/layout'
import { ItemCard, ItemCardList } from '../components/items'
import SideNavContent from '../components/side-nav'
import * as LayoutCSS from '../css/layout.module.css'

const AboutPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <Content>
      <p>For when you want to sell your stuff, but you don’t want to deal with shipping or take off your pajamas.</p>
      <p>Inspired by local yard sales, I built this online marketplace for the residents of building I live in. People can post things that they want to sell and organize a time to meet in the lobby. The best part is that they get to keep 100% of the profits and avoid the packaging, costs, and duration that come with shipping.</p>
      </Content>
      <SideNav>
      </SideNav>
    </Layout>
  )
}

export default AboutPage