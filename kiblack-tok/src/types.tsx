/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type Group = {
  id?:number,
  rootId?:number,
  parentId?:number,
  name:string,
  imageUrl?:string
}

export type User = {
  id:number,
  isAdmin:boolean,
  isGuest:boolean,
  name:string,
  username:string,
  imageUrl?:string
  groupList: Group[]
}

// export type Membership = {
//   id?:number
//   userId:number,
//   name:string,
//   imageUrl?:string
// }

// export type GroupMembership = Group & {
//   membershipList: Membership[]
// }
