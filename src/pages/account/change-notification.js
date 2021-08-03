import React, { useEffect, useState } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../../context/UserContext"
import { Layout, Content, SideNav } from '../../components/layout'
import SideNavContent from '../../components/side-nav'
import * as FormCSS from '../../css/form.module.css'

const ChangeNotificationMethodPage = () => {
    const [notificationMethod, setNotificationMethod] = useState("email")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [notificationMethodError, setNotificationMethodError] = useState("")
    const [phoneNumberError, setPhoneNumberError] = useState("")
    const firebaseContext = useUser()

    useEffect(() => {
        (firebaseContext.userData?.notifyMethod?.by === "email") ? setNotificationMethod("email") : setNotificationMethod("phone")
    }, [firebaseContext])

    const onChangeNotifyByEmail = () => setNotificationMethod("email")
    const onChangeNotifyByPhone = () => setNotificationMethod("phone")
    const onChangePhoneNumber = (e) => setPhoneNumber(e.target.value)

    const onSubmit = (e) => {
        e.preventDefault()
        setNotificationMethodError("")
        setPhoneNumberError("")
        //if user only wants to update their phone number
        if (notificationMethod === "phone" && firebaseContext.userData?.notifyMethod?.by === "phone" && phoneNumber !== firebaseContext.userData?.notifyMethod?.at && phoneNumber.length > 0) {
            firebaseContext?.updateNotificationMethod("phone", phoneNumber)
            navigate('/', { state: { message: "notificationMethod" } })
        }
        if (notificationMethod !== firebaseContext.userData?.notifyMethod?.by) {
            if (notificationMethod === "phone") {
                if (phoneNumber.length > 0) {
                    firebaseContext?.updateNotificationMethod(notificationMethod, phoneNumber)
                    navigate('/', { state: { message: "notificationMethod" } })
                } else {
                    setPhoneNumberError("You'll have to enter a cell phone number")
                }
            } else {
                firebaseContext?.updateNotificationMethod("email", "")
                navigate('/', { state: { message: "notificationMethod" } })
            }
        } else {
            setNotificationMethodError("It looks like you didn't make any changes")
        }
    }

    !firebaseContext?.userAuth && navigate('/sign-in')
    return (
        <Layout pageTitle="Update Your Notification Method" headerLink="Logout">
            <Content contentTitle="Update your notification method" titlePosition='center'>
                <form className={FormCSS.form} onSubmit={onSubmit}>
                    <div className={FormCSS.formField}>
                        <p style={{ opacity: "50%" }}>You are currently getting notified by {firebaseContext.userData?.notifyMethod?.by}</p>
                        <p className={FormCSS.inputItem__label}>How would you like to be<br />notified of order updates?</p>
                        <div className={FormCSS.inputItem} style={{ justifyContent: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <label className={FormCSS.inputItem__checkboxContainer}>
                                    <input className={FormCSS.inputItem__checkbox} type="checkbox" checked={notificationMethod === "email" || false} onChange={onChangeNotifyByEmail} />
                                    <span className={FormCSS.checkboxInput__checkmark}></span>
                                    <span className={FormCSS.checkboxInput__label}>Get notified by email</span>
                                </label>
                                <label className={FormCSS.inputItem__checkboxContainer}>
                                    <input className={FormCSS.inputItem__checkbox} type="checkbox" checked={notificationMethod === "phone" || false} onChange={onChangeNotifyByPhone} />
                                    <span className={FormCSS.checkboxInput__checkmark}></span>
                                    <span className={FormCSS.checkboxInput__label}>Get notified by cell phone (SMS)</span>
                                </label>
                                {(notificationMethod === "phone") &&
                                    <div style={{ padding: "30px" }}>
                                        <p className={FormCSS.inputItem__label}>What's your cell phone number?</p>
                                        <input className={FormCSS.inputItem__textInput}
                                            type="tel"
                                            placeholder={firebaseContext.userData?.notifyMethod?.at}
                                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                            value={phoneNumber || ""}
                                            onChange={onChangePhoneNumber} />
                                        <small>Format: 123-456-7890</small>
                                        {phoneNumberError && <p className={FormCSS.formError}>{phoneNumberError}</p>}
                                    </div>
                                }
                            </div>
                        </div>
                        {notificationMethodError && <p className={FormCSS.formError}>{notificationMethodError}</p>}
                    </div>
                    <input className={FormCSS.submitButton}
                        type="submit"
                        value="Update your notification method" />
                </form>
            </Content>
            <SideNav>
                <SideNavContent type='account' />
            </SideNav>
        </Layout>
    )
}

export default ChangeNotificationMethodPage