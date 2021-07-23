import * as React from 'react'
import { navigate } from "gatsby"
import { firestore, imgStorage } from "../components/firebase"
import { useUser } from "../context/UserContext"
import { Layout, Content, SideNav } from '../components/layout'
import ItemFormInfo from '../components/item-form-info'

const ItemCreatePage = () => {
  const firebaseContext = useUser()
  const updateUserItems = firebaseContext?.updateUserItems

  const createItem = (updatedItemData) => {
    const data = {
      seller: updatedItemData.seller,
      item: updatedItemData.item,
      cost: updatedItemData.cost,
      itemNotes: updatedItemData.itemNotes,
      tags: updatedItemData.tags,
      pickUp: updatedItemData.pickUp,
      dropOff: updatedItemData.dropOff,
      lobby: updatedItemData.lobby
    }

    firestore
      .collection("items")
      .add(data)
      .then((itemDoc) => {
        const docImgs = firestore.collection("items").doc(itemDoc.id)
        const img1Ref = imgStorage.child(`${itemDoc.id}/1`)
        const img2Ref = imgStorage.child(`${itemDoc.id}/2`)
        const img3Ref = imgStorage.child(`${itemDoc.id}/3`)

        if (typeof updatedItemData === 'object') {
          img1Ref.put(updatedItemData.photo1).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              const data = updatedItemData.photo1 ? downloadURL : ""
              docImgs.update({ photo1: data })
              .then(() => navigate('/', {state: { message: "item-create"}}))
            });
          })
        }

        if (typeof updatedItemData === 'object') {
          img2Ref.put(updatedItemData.photo2).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              const data = updatedItemData.photo2 ? downloadURL : ""
              docImgs.update({ photo2: data })
            });
          })
        }

        if (typeof updatedItemData === 'object') {
          img3Ref.put(updatedItemData.photo3).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              const data = updatedItemData.photo3 ? downloadURL : ""
              docImgs.update({ photo3: data })
            });
          })
        }
        updateUserItems('add', 'itemsPosted', itemDoc.id)
      })
      .catch(error => console.log("Error creating a new item: ", error))
  }

  return (
    <Layout pageTitle="Create New Listing">
      <Content contentTitle="Create a new listing" titlePosition='center'>
        <ItemFormInfo handleSubmit={createItem} />
      </Content>
      <SideNav />
    </Layout>
  )
}

export default ItemCreatePage