import React, { useState, useEffect } from 'react'
import { navigate } from "gatsby"
import { useUser } from "../context/UserContext"
import { getAllItemTags } from '../components/items'
import { firebase, firestore, imgStorage } from "../components/firebase"
import * as FormCSS from '../css/form.module.css'
import camera_icon from '../images/camera_icon.png'

const ItemFormInfo = ({ itemData }) => {
    const [item, setItem] = useState()
    const [cost, setCost] = useState('')
    const [itemNotes, setItemNotes] = useState('')
    const [newTag, setNewTag] = useState('')
    const [tags, setTags] = useState([])
    const [existingTags, setExistingTags] = useState([])
    const [photo1, setPhoto1] = useState('')
    const [photo2, setPhoto2] = useState('')
    const [photo3, setPhoto3] = useState('')
    const [pickUp, setPickUp] = useState(false)
    const [dropOff, setDropOff] = useState(false)
    const [lobby, setLobby] = useState(false)
    const [suite, setSuite] = useState('')
    const [itemError, setItemError] = useState('')
    const [costError, setCostError] = useState('')
    const [itemNotesError, setItemNotesError] = useState('')
    const [tagError, setTagError] = useState('')
    const [locationExchangeError, setLocationExchangeError] = useState('')
    const [suiteError, setSuiteError] = useState('')
    const firebaseContext = useUser()
    const userData = firebaseContext?.userData
    const allItems = firebaseContext?.allItems
    const postedIndex = itemData ? itemData?.postedIndex : userData?.itemsPosted.length

    useEffect(() => {
        if (itemData) {
            setItem(itemData.item)
            setCost(itemData.cost)
            setItemNotes(itemData.itemNotes)
            setSuite(userData?.suite)
            setTags(itemData.tags)
            setPhoto1(itemData.photo1)
            setPhoto2(itemData.photo2)
            setPhoto3(itemData.photo3)
            setPickUp(itemData.pickUp)
            setDropOff(itemData.dropOff)
            setLobby(itemData.lobby)
        }
    }, [itemData, userData])

    useEffect(() => {
        function getTags() {
            let content = []
            for (let tag in getAllItemTags(allItems)) { content.push(tag) }
            setExistingTags(content)
        }
        getTags()
    }, [allItems])

    useEffect(() => {
        if (typeof photo1 === "object") {
            imgStorage.child(`${userData?.id}${postedIndex}/1`).put(photo1).then(snapshot => snapshot.ref.getDownloadURL().then(downloadURL => setPhoto1(downloadURL)))
        }
        if (typeof photo2 === "object") {
            imgStorage.child(`${userData?.id}${postedIndex}/2`).put(photo2).then(snapshot => snapshot.ref.getDownloadURL().then(downloadURL => setPhoto2(downloadURL)))
        }
        if (typeof photo3 === "object") {
            imgStorage.child(`${userData?.id}${postedIndex}/3`).put(photo3).then(snapshot => snapshot.ref.getDownloadURL().then(downloadURL => setPhoto3(downloadURL)))
        }
    }, [photo1, photo2, photo3])

    const onChangeItem = (e) => setItem(e.target.value)
    const onChangeCost = (e) => setCost(e.target.value)
    const onChangeItemNotes = (e) => setItemNotes(e.target.value)

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
        setExistingTags([...existingTags, newTag.toLowerCase()])
        setTags([...tags, newTag.toLowerCase()])
        setNewTag("")
    }

    const onChangeNewTag = (e) => setNewTag(e.target.value)
    const onPhoto1Upload = (e) => setPhoto1(e.target.files[0])
    const onPhoto2Upload = (e) => setPhoto2(e.target.files[0])
    const onPhoto3Upload = (e) => setPhoto3(e.target.files[0])

    const onPhoto1Remove = () => {
        setPhoto1('')
        itemData && imgStorage.child(`${userData?.id}${postedIndex}/1`).delete()
    }
    const onPhoto2Remove = () => {
        setPhoto2('')
        itemData && imgStorage.child(`${userData?.id}${postedIndex}/2`).delete()
    }
    const onPhoto3Remove = () => {
        setPhoto3('')
        itemData && imgStorage.child(`${userData?.id}${postedIndex}/3`).delete()
    }

    const onChangePickUp = () => setPickUp(!pickUp)
    const onChangeDropOff = () => setDropOff(!dropOff)
    const onChangeLobby = () => setLobby(!lobby)
    const onChangeSuite = (e) => setSuite(e.target.value)

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
        if (!item) setItemError("You'll have to enter an item")
        if (!cost) setCostError("You'll have to enter a cost")
        if (!itemNotes) setItemNotesError("You'll have to enter a note")
        if (tags.length === 0) setTagError("You'll have to enter a tag")
        if (!locationExchange) setLocationExchangeError("You'll have to select a meet up location")
        if (pickUp) {
            if (!userData?.suite && !suite) setSuiteError("You'll have to enter your suite number or remove 'Pick up from your suite' as one of your meet up options")
            if (!userData?.suite && suite) firebaseContext?.addSuite(suite)
        }
        if (item && cost && itemNotes && (tags.length > 0) && (pickUp || dropOff || lobby) && !suiteErr) {
            const updatedItemData = { seller: userData?.id, item, cost, itemNotes, tags, pickUp, dropOff, lobby, postedOn: firebase.firestore.FieldValue.serverTimestamp(), photo1, photo2, photo3, postedIndex}
            if (itemData) {
                firestore.collection("items").doc(itemData.itemId).update(updatedItemData)
                    .then(() => { console.log('Success updating an item') })
                    .catch(error => console.log("Error updating an item: ", error))
                const removedItem = firebaseContext?.allItems.filter(item => item.itemId !== itemData.itemId)
                firebaseContext?.setAllItems([updatedItemData, ...removedItem])
            } else {
                firestore.collection('items').add(updatedItemData).then(doc => {
                    updatedItemData.itemId = doc.id
                    firebaseContext?.updateUserItems('add', 'itemsPosted', doc.id)
                    firebaseContext?.setAllItems(prevState => [updatedItemData, ...prevState])
                    firestore.collection("items").doc(doc.id).update(updatedItemData)
                })
            }
            const message = itemData ? "item-update" : "item-create"
            if (typeof window !== 'undefined') navigate('/', { state: { message } })
        }
    }

    return (
        <form className={FormCSS.form} onSubmit={onSubmit}>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Item</p>
                    <p className={FormCSS.inputItem__desc}>What are you selling?</p>
                    <input className={FormCSS.inputItem__textInput}
                        placeholder="Blue Balloons"
                        type="text"
                        onChange={onChangeItem}
                        value={item || ""} />
                    {itemError && <p className={FormCSS.formError}>{itemError}</p>}
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Cost</p>
                    <p className={FormCSS.inputItem__desc}>How much are you charging?</p>
                    <input className={FormCSS.inputItem__textInput}
                        placeholder="$$$"
                        type="number"
                        onChange={onChangeCost}
                        value={cost || ""} />
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
                                    <img src={typeof photo1 === 'string' ? photo1 : URL.createObjectURL(photo1)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto1Remove}>Remove</button>
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
                                    <img src={typeof photo2 === 'string' ? photo2 : URL.createObjectURL(photo2)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto2Remove}>Remove</button>
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
                                    <img src={typeof photo3 === 'string' ? photo3 : URL.createObjectURL(photo3)} className={FormCSS.cameraIcon} alt="Item Preview" />
                                    <button onClick={onPhoto3Remove}>Remove</button>
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
                        onChange={onChangeItemNotes}
                        value={itemNotes || ""}></textarea>
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
                            value={newTag || ""}
                            onChange={onChangeNewTag} />
                        <div className={FormCSS.addTagButton} onClick={onAddTag} onKeyDown={onAddTag} role="button" tabIndex={0}>Add Tag</div>
                    </div>
                    {tagError && <p className={FormCSS.formError}>{tagError}</p>}
                </div>
            </div>
            <div className={FormCSS.formField}>
                <div className={FormCSS.inputItem}>
                    <p className={FormCSS.inputItem__label}>Exchange Location</p>
                    <p className={FormCSS.inputItem__desc}>Where are you comfortable meeting with your buyer?</p>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label className={FormCSS.inputItem__checkboxContainer}>
                            <input className={FormCSS.inputItem__checkbox} type="checkbox" checked={pickUp || false} onChange={onChangePickUp} />
                            <span className={FormCSS.checkboxInput__checkmark}></span>
                            <span className={FormCSS.checkboxInput__label}>Your suite</span>
                        </label>
                        <label className={FormCSS.inputItem__checkboxContainer}>
                            <input className={FormCSS.inputItem__checkbox} type="checkbox" checked={dropOff || false} onChange={onChangeDropOff} />
                            <span className={FormCSS.checkboxInput__checkmark}></span>
                            <span className={FormCSS.checkboxInput__label}>Buyer's suite</span>
                        </label>
                        <label className={FormCSS.inputItem__checkboxContainer}>
                            <input className={FormCSS.inputItem__checkbox} type="checkbox" checked={lobby || false} onChange={onChangeLobby} />
                            <span className={FormCSS.checkboxInput__checkmark}></span>
                            <span className={FormCSS.checkboxInput__label}>Lobby</span>
                        </label>
                        {(pickUp === true && !userData?.suite) &&
                            <div style={{ padding: "30px" }}>
                                <p className={FormCSS.inputItem__label}>What's your suite number?</p>
                                <input className={FormCSS.inputItem__textInput}
                                    placeholder="###"
                                    type="number"
                                    maxLength="3"
                                    value={suite || ""}
                                    onChange={onChangeSuite} />
                            </div>
                        }
                    </div>
                    {locationExchangeError && <p className={FormCSS.formError}>{locationExchangeError}</p>}
                    {suiteError && <p className={FormCSS.formError}>{suiteError}</p>}
                </div>
                {(itemError || costError || itemNotesError || tagError || locationExchangeError || suiteError) && <p className={FormCSS.formError}>Looks like you missed a spot</p>}
            </div>
            <input className={FormCSS.submitButton}
                type="submit"
                value="Submit Listing" />
        </form>
    )
}

export default ItemFormInfo