import firebase from "firebase/compat";

export interface IBlog {
  id: string
  author: string,
  title: string,
  category: string,
  date: firebase.firestore.Timestamp,
  description: string,
  text: string,
  imgUrl: string
}
