export type UserData = {
  uuid: string
  id: string
  balance: string
  point: string
  status: 'ACTIVE' | 'INACTIVE'
  can_charge: boolean
}
