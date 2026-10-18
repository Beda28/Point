export const paymentStatus = {
  PENDING: '결제 대기',
  PAYING: '결제 확인 필요',
  COMPLETED: '결제 완료',
  CONFIRMING: '구매확정 확인 필요',
  CONFIRMED: '구매확정 · 정산 완료',
  REFUNDING: '취소 확인 필요',
  CANCELED: '취소 완료',
  FAILED: '결제 실패',
}

export type TransactionData = {
  tid: string
  pid: string
  uid: string
  seller_id: string
  quantity: number
  unit_price: string
  total_amount: string
  point_used: string
  amount: string
  fee: string
  seller_amount: string
  point_earned: string
  status: keyof typeof paymentStatus
  point_tid: string | null
  point_refund_tid: string | null
  point_settle_tid: string | null
  created_at: string
}

export type PaymentPolicy = {
  point_value: number
  reward_bps: number
  fee_bps: number
}
