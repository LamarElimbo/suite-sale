import React, { useState, useEffect, useRef } from 'react'
import { useUser } from "../context/UserContext"
import { getAllItemTags } from '../components/items'
import { imgStorage } from "../components/firebase"
import * as FormCSS from '../css/form.module.css'
import camera_icon from '../images/camera_icon.png'
import remove_icon from '../images/remove_icon.png'

const ItemFormInfo = ({ itemData, handleSubmit }) => {
    const item = useRef()
    const cost = useRef('')
    const itemNotes = useRef('')
    const newTag = useRef('')
    const [tags, setTags] = useState([])
    const [existingTags, setExistingTags] = useState([])
    const [photo1, setPhoto1] = useState('')
    const [photo2, setPhoto2] = useState('')
    const [photo3, setPhoto3] = useState('')
    const [pickUp, setPickUp] = useState(false)
    const [dropOff, setDropOff] = useState(false)
    const [lobby, setLobby] = useState(false)
    const suite = useRef('')
    const [itemError, setItemError] = useState('')
    const [costError, setCostError] = useState('')
    const [itemNotesError, setItemNotesError] = useState('')
    const [tagError, setTagError] = useState('')
    const [locationExchangeError, setLocationExchangeError] = useState('')
    const [suiteError, setSuiteError] = useState('')

    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const addSuite = firebaseContext?.addSuite
    const allItems = firebaseContext?.allItems

    useEffect(() => {
        if (itemData) {
            item.current = itemData.item
            cost.current = itemData.cost
            itemNotes.current = itemData.itemNotes
            setTags(itemData.tags)
            setPhoto1(itemData.photo1)
            setPhoto2(itemData.photo2)
            setPhoto3(itemData.photo3)
            setPickUp(itemData.pickUp)
            setDropOff(itemData.dropOff)
            setLobby(itemData.lobby)
        }
    }, [itemData])

    useEffect(() => {
        function getTags() {
            let content = []
            for (let tag in getAllItemTags(allItems)) { content.push(tag) }
            setExistingTags(content)
        }
        getTags()
    }, [allItems])

    const onTagSelection = (e) => {
        let selectedTags = tags
        if (selectedTags.includes(e.target.id)) {
            const index = selectedTags.indexOf(e.target.id)
            if (index > -1) {
                selectedTags.splice(index, 1)
                setTags([...selectedTags])
            }
        } else {
            setTags([...selectedTags, e.target.id])
        }
    }

    const onAddTag = () => {
        setExistingTags([...existingTags, newTag.current.value])
        setTags([...tags, newTag.current.value])
        newTag.current.value = ""
    }

    const onPhoto1Upload = (e) => setPhoto1(e.target.files[0])
    const onPhoto2Upload = (e) => setPhoto2(e.target.files[0])
    const onPhoto3Upload = (e) => setPhoto3(e.target.files[0])

    const onPhoto1Remove = () => {
        setPhoto1('')
        if (itemData) {
            const img1Ref = imgStorage.child(`${itemData.id}/1`)
            img1Ref.delete()
        }
    }
    const onPhoto2Remove = () => {
        setPhoto2('')
        if (itemData) {
            const img2Ref = imgStorage.child(`${itemData.id}/2`)
            img2Ref.delete()
        }
    }
    const onPhoto3Remove = () => {
        setPhoto3('')
        if (itemData) {
            const img3Ref = imgStorage.child(`${itemData.id}/3`)
            img3Ref.delete()
        }
    }

    const onChangePickUp = () => setPickUp(!pickUp)
    const onChangeDropOff = () => setDropOff(!dropOff)
    const onChangeLobby = () => setLobby(!lobby)

    const onSubmit = (e) => {
        e.preventDefault()
        setItemError("")
        setCostError("")
        setItemNotesError("")
        setTagError("")
        setLocationExchangeError("")
        setSuiteError("")
        const locationExchange = (pickUp || dropOff || lobby) ? true : false
        let suiteErr = false
        if (!item.current.value) setItemError("You'll have to enter an item")
        if (!cost.current.value) setCostError("You'll have to enter a cost")
        if (!itemNotes.current.value) setItemNotesError("You'll have to enter a note")
        if (tags.length === 0) setTagError("You'll have to enter a tag")
        if (!locationExchange) setLocationExchangeError("You'll have to select a meet up location")
        if (!userData?.apartment && !suite.current.value && pickUp) {
            setSuiteError("You'll have to enter your suite number or remove 'Pick up from your suite' as one of your meet up options")
        } else {
            addSuite(suite.current.value, userData?.id)
        }
        if (item.current.value && cost.current.value && itemNotes.current.value && (tags.length === 0) && locationExchange && suite && !suiteErr) {
            const updatedItemData = {
                seller: userData?.id,
                item: item.current.value,
                cost: cost.current.value,
                photo1, photo2, photo3,
                itemNotes: itemNotes.current.value,
                tags,
                pickUp,
                dropOff,
                lobby
            }
            handleSubmit(updatedItemData)
        }
    }

    const padding30 = {padding: "30px"}
    return (
        <form className={FormCSS.form} onSubmit={onSubmit}>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Item</p>
                    <p className={FormCSS.inputItem__desc}>What are you selling?</p>
                    <input className={FormCSS.inputItem__textInput}
                        placeholder="Blue Balloons"
                        type="text"
                        ref={item}
                        defaultValue={itemData && item.current} />
                    {itemError && <p className={FormCSS.formError}>{itemError}</p>}
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Cost</p>
                    <p className={FormCSS.inputItem__desc}>How much are you charging?</p>
                    <input className={FormCSS.inputItem__textInput}
                        placeholder="$$$"
                        type="text"
                        ref={cost}
                        defaultValue={itemData && cost.current} />
                    {costError && <p className={FormCSS.formError}>{costError}</p>}
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Photos</p>
                    <p className={FormCSS.inputItem__desc}>Upload up to 3 photos</p>
                    <div className={FormCSS.photoInputs}>
                        <div className={FormCSS.imgUpload}>
                            {(typeof photo1 === 'object' || photo1?.length > 0) ?
                                <>
                                    <img src={itemData ? photo1 : URL.createObjectURL(photo1)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto1Remove}><img src={remove_icon} className={FormCSS.cameraIcon} alt="Remove this item preview" /></button>
                                </>
                                :
                                <>
                                    <label htmlFor="itemImg1">
                                        <img src={camera_icon} className={FormCSS.cameraIcon} alt="Upload a preview of what your item looks like" />
                                        <div className="action-area__text">Add<br />Image</div>
                                    </label>
                                    <input id="itemImg1" type="file" onChange={onPhoto1Upload} />
                                </>
                            }
                        </div>
                        <div className={FormCSS.imgUpload}>
                            {(typeof photo2 === 'object' || photo2?.length > 0) ?
                                <>
                                    <img src={itemData ? photo2 : URL.createObjectURL(photo2)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto2Remove}><img src={remove_icon} className={FormCSS.cameraIcon} alt="Remove this item preview" /></button>
                                </>
                                :
                                <>
                                    <label htmlFor="itemImg2">
                                        <img src={camera_icon} className={FormCSS.cameraIcon} alt="Upload a preview of what your item looks like" />
                                        <div className="action-area__text">Add<br />Image</div>
                                    </label>
                                    <input id="itemImg2" type="file" onChange={onPhoto2Upload} />
                                </>
                            }
                        </div>
                        <div className={FormCSS.imgUpload}>
                            {(typeof photo3 === 'object' || photo3?.length > 0) ?
                                <>
                                    <img src={itemData ? photo3 : URL.createObjectURL(photo3)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto3Remove}><img src={remove_icon} className={FormCSS.cameraIcon} alt="Remove this item preview" /></button>
                                </>
                                :
                                <>
                                    <label htmlFor="itemImg3">
                                        <img src={camera_icon} className={FormCSS.cameraIcon} alt="Upload a preview of what your item looks like" />
                                        <div className="action-area__text">Add<br />Image</div>
                                    </label>
                                    <input id="itemImg3" type="file" onChange={onPhoto3Upload} />
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Notes</p>
                    <p className={FormCSS.inputItem__desc}>What would you like buyers to know?</p>
                    <textarea className={FormCSS.inputItem__textAreaInput}
                        placeholder="Ex: item quality/description, accept cash/credit, ideal meet up times"
                        ref={itemNotes}
                        defaultValue={itemData && itemNotes.current}></textarea>
                    {itemNotesError && <p className={FormCSS.formError}>{itemNotesError}</p>}
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Tags</p>
                    <p className={FormCSS.inputItem__desc}>Select a tag or enter a new one</p>
                    <div id='box'>
                        {existingTags.map(tag =>
                            <button className={FormCSS.tagSelection + " " + (tags?.includes(tag) ? FormCSS.selected : FormCSS.unselected)}
                                type="button"
                                id={tag}
                                key={tag}
                                onClick={onTagSelection}>{tag}</button>
                        )}
                    </div>
                    <div className={FormCSS.addTagInput}>
                        <input className={FormCSS.inputItem__textInput}
                            placeholder="Enter a new tag"
                            type="text"
                            ref={newTag} />
                        <div className={FormCSS.addTagButton} onClick={onAddTag} onKeyDown={onAddTag} role="button" tabIndex={0}>Add Tag</div>
                    </div>
                    {tagError && <p className={FormCSS.formError}>{tagError}</p>}
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Exchange Location</p>
                    <p className={FormCSS.inputItem__desc}>Where are you comfortable meeting with your buyer?</p>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <label className={FormCSS.inputItem__checkboxContainer}>
                            <input className={FormCSS.inputItem__checkbox}
                                type="checkbox"
                                onChange={onChangePickUp} />
                            <span class={FormCSS.checkboxInput__checkmark}></span>
                            <span className={FormCSS.checkboxInput__label}>Your suite</span>
                        </label>
                        <label className={FormCSS.inputItem__checkboxContainer}>
                            <input className={FormCSS.inputItem__checkbox}
                                type="checkbox"
                                onChange={onChangeDropOff} />
                            <span class={FormCSS.checkboxInput__checkmark}></span>
                            <span className={FormCSS.checkboxInput__label}>Buyer's suite</span>
                        </label>
                        <label className={FormCSS.inputItem__checkboxContainer}>
                            <input className={FormCSS.inputItem__checkbox}
                                type="checkbox"
                                onChange={onChangeLobby} />
                            <span class={FormCSS.checkboxInput__checkmark}></span>
                            <span className={FormCSS.checkboxInput__label}>Lobby</span>
                        </label>
                        {(pickUp === 'pickUp' && !userData?.suite) &&
                            <div style={padding30}>
                                <p className={FormCSS.inputItem__label}>What's your suite number?</p>
                                <input className={FormCSS.inputItem__textInput}
                                    placeholder="###"
                                    type="number"
                                    maxLength="3"
                                    ref={suite} />
                            </div>
                        }
                    </div>
                    {locationExchangeError && <p className={FormCSS.formError}>{locationExchangeError}</p>}
                    {suiteError && <p className={FormCSS.formError}>{suiteError}</p>}
                </div>
            </div>
            <div className={FormCSS.inputItem}>
                <input className={FormCSS.darkButton}
                    type="submit"
                    value="Submit Listing" />
                {(itemError || costError || itemNotesError || tagError || locationExchangeError || suiteError) && <p className={FormCSS.formError}>Looks like you missed a spot</p>}

            </div>
        </form>
    )
}

export default ItemFormInfo