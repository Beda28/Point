export const user = {
  uuid: 'user-1',
  id: 'sample_user',
  balance: 100000,
  points: 5000,
}

export const products = [
  { pid: '1', pname: '캔버스 토트백', price: 28000, content: '가볍게 들기 좋은 기본 토트백입니다.\n소재: 면 100%\n크기: 35 × 38cm' },
  { pid: '2', pname: '미니 크로스백', price: 35000, content: '작은 소지품을 담기 좋은 크로스백입니다.\n소재: 나일론\n크기: 22 × 16cm' },
  { pid: '3', pname: '데일리 숄더백', price: 42000, content: '넉넉한 수납 공간의 숄더백입니다.\n소재: 면 100%\n크기: 40 × 32cm' },
]

export const payments = [
  { tid: '1', pid: '1', quantity: 1, total_amount: 28000, point_used: 1000, amount: 27000, status: 'COMPLETED', created_at: '2026-10-14 10:30' },
  { tid: '2', pid: '2', quantity: 1, total_amount: 35000, point_used: 0, amount: 35000, status: 'CANCELED', created_at: '2026-10-13 14:20' },
]

export const money = (value: number) => value.toLocaleString('ko-KR')
