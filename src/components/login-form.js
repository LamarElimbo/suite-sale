import React, { useState, useRef, useEffect } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import * as FormCSS from '../css/form.module.css'

const LoginForm = () => {
  const email = useRef()
  const password = useRef('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formSubmitError, setFormSubmitError] = useState('')
  const firebaseContext = useUser()
  const login = firebaseContext?.login

  useEffect(() => { firebaseContext?.userAuth && navigate('/') })

  function onSubmitLogin(e) {
    e.preventDefault()
    setEmailError("")
    setPasswordError("")
    if (!email.current.value) setEmailError("You'll have to enter an email")
    if (!password.current.value) setPasswordError("You'll have to enter a password")
    if (email.current.value && password.current.value) {
      login(email.current.value, password.current.value)
      setFormSubmitError("It looks like either the email or password you entered was incorrect")
    }
  }

  return (
    <form className={FormCSS.form} onSubmit={onSubmitLogin}>
      <div className={FormCSS.formField} style={{ flexDirection: "column" }}>
        <div className={FormCSS.inputItem}>
          <label>
            <p className={FormCSS.inputItem__label}>Email</p>
            <input className={FormCSS.inputItem__textInput}
              placeholder="example@gmail.com"
              type="text"
              ref={email} />
            {emailError && <p className={FormCSS.formError}>{emailError}</p>}
          </label>
        </div>
        <div className={FormCSS.inputItem}>
          <label>
            <p className={FormCSS.inputItem__label}>Password</p>
            <input className={FormCSS.inputItem__textInput}
              placeholder="*****"
              type="password"
              ref={password} />
            {passwordError && <p className={FormCSS.formError}>{passwordError}</p>}
          </label>
        </div>
        {(emailError || passwordError) && <p className={FormCSS.formError}>Looks like you missed a spot</p>}
        {formSubmitError && <p className={FormCSS.formError}>{formSubmitError}</p>}
      </div>
      <input className={FormCSS.submitButton}
        type="submit"
        value="Login" />
    </form>
  )
}

export default LoginForm