export const money = (value: string | number) => BigInt(value).toLocaleString('ko-KR')
