import * as React from 'react'
import { Layout, Content, SideNav } from '../components/layout'

const AboutPage = () => {
  const sectionStyle = {
    margin: "0 0 30px 0",
    width: "50ch"
  }

  const headerStyle = {
    padding: "10px 0 0 15px"
  }

  const paragraphStyle = {
    padding: "10px 0 0 15px",
    fontWeight: "400",
    lineHeight: "150%",
    margin: "0 0 10px 0"
  }

  const linkStyle = {
    fontWeight: "700",
    textDecoration: "underline"
  }

  return (
    <Layout pageTitle="About">
      <Content>
        <div style={{display: "flex", alignItems: "center", width: "100%", flexDirection: "column"}}>
          <section style={sectionStyle}>
            <h2 style={headerStyle}>Suite Sale</h2>
            <p style={paragraphStyle}>For when you want to sell your stuff, but you don’t want to deal with packaging, shipping, hidden costs, or take off your pajamas.</p>
          </section>
          <section style={sectionStyle}>
            <h2 style={headerStyle}>About Suite Sale</h2>
            <p style={paragraphStyle}>Welcome to Suite Sale! Built for the residents of 665 Roselawn Avenue by one of the residents of the building.</p>
            <p style={paragraphStyle}>Inspired by local yard sales and having several items that I'd like to sell, I built this as an tool for us to post and sell things that we hope to sell easily. The best parts are that because this is local to the building we can avoid having to deal with packaging, shipping, distant deliveries, and transaction fees.</p>
            <p style={paragraphStyle}>Which pretty much means that everyone gets to keep 100% of their profits and spend a lot less effort than we would normally need to in order to sell something.</p>
            <p style={paragraphStyle}>I hope you like the site, hope it can help you, and hope to see you around the building!</p>
            <p style={paragraphStyle}>Kindest regards,<br/>your friendly neighbourhood <span style={{ textDecoration: "line-through" }}>spider</span>man.</p>
          </section>
          <section style={sectionStyle}>
            <h2 style={headerStyle}>What if you don't keep cash on hand?</h2>
            <p style={paragraphStyle}>Consider giving the Wealthsimple Cash app a try. Canada's fastest and simplest way to send and receive money. No fees and totally secure. You can get a free $25 if you sign up with <a href="https://my.wealthsimple.com/app/public/cash-referral-signup?handle=$lamarelimbo" style={linkStyle}>my referral link</a></p>
            <p style={paragraphStyle}>You can learn more about it here: <a href="https://www.wealthsimple.com/en-ca/magazine/cash" style={linkStyle}>https://www.wealthsimple.com/en-ca/magazine/cash</a></p>
            <br />
          </section>
        </div>
      </Content>
      <SideNav>
      </SideNav>
    </Layout>
  )
}

export default AboutPage