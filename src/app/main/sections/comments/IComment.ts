import firebase from "firebase/compat";

export interface IComment {
  id: string
  uid: string,
  bid: string,
  date: firebase.firestore.Timestamp,
  text: string
}
