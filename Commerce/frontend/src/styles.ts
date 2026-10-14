import styled from 'styled-components'

export const HeaderBar = styled.header`
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  padding: 18px 24px;
  @media (max-width: 760px) { padding: 16px; }
`

export const HeaderInner = styled.div`
  max-width: 1080px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  nav { display: flex; justify-content: center; gap: 28px; }
  nav a.active { text-decoration: underline; text-underline-offset: 6px; }
  @media (max-width: 760px) {
    grid-template-columns: 1fr auto;
    gap: 16px 12px;
    nav { grid-column: 1 / -1; grid-row: 2; }
  }
`

export const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  a, button { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); color: var(--text); }
  a { padding: 7px 12px; font-size: 14px; }
  a:last-of-type { background: var(--primary); color: var(--on-primary); border-color: var(--primary); }
  button { width: 38px; height: 38px; padding: 0; font-size: 21px; }
  button:hover { background: var(--surface-soft); }
  a:hover { border-color: var(--muted); }
  @media (max-width: 360px) { gap: 5px; a { padding: 7px 8px; } }
`

export const Page = styled.main`
  max-width: 1128px;
  margin: auto;
  padding: 40px 24px;
`

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

export const Button = styled.button`
  display: inline-block;
  padding: 11px 20px;
  border: 1px solid var(--primary);
  border-radius: 12px;
  background: var(--primary);
  color: var(--on-primary);
  text-align: center;
  &:hover { background: var(--primary-hover); }
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover { transform: translateY(-1px); }
    &:active { transform: translateY(0); }
  }
`

export const TextLink = styled.span`
  text-decoration: underline;
  text-underline-offset: 4px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 420px;
  margin: 40px auto;
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  h1 { margin-bottom: 12px; }
  @media (max-width: 450px) { padding: 24px; margin: 12px auto; }
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  input { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--background); color: var(--text); }
`

export const Muted = styled.p`
  color: var(--muted);
  font-size: 14px;
`

export const Views = styled.div`
  display: flex;
  gap: 6px;
  button { padding: 7px 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; }
  button[aria-pressed='true'] { background: var(--primary); color: var(--on-primary); border-color: var(--primary); }
`

export const ProductList = styled.div<{ $list: boolean }>`
  display: grid;
  grid-template-columns: ${({ $list }) => $list ? '1fr' : 'repeat(3, minmax(0, 1fr))'};
  gap: 24px;
  @media (max-width: 650px) { grid-template-columns: ${({ $list }) => $list ? '1fr' : 'repeat(2, minmax(0, 1fr))'}; }
  @media (max-width: 400px) { grid-template-columns: 1fr; }
`

export const ProductItem = styled.article<{ $list: boolean }>`
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  a { display: ${({ $list }) => $list ? 'flex' : 'block'}; align-items: center; gap: 24px; }
  img { width: ${({ $list }) => $list ? '120px' : '100%'}; flex-shrink: 0; }
  h2 { margin-top: 12px; font-size: 17px; }
  p { margin-top: 4px; }
  @media (hover: hover) {
    &:hover { border-color: var(--muted); box-shadow: 0 8px 24px rgb(0 0 0 / 8%); }
  }
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover { transform: translateY(-2px); }
  }
`

export const ProductImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  background: var(--image-background);
  border-radius: 16px;
`

export const ProductSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
  @media (max-width: 700px) { grid-template-columns: 1fr; gap: 28px; }
`

export const Description = styled.p`
  white-space: pre-line;
  color: var(--muted);
`

export const Summary = styled.dl`
  margin: 0;
  padding: 4px 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  div { display: flex; justify-content: space-between; gap: 20px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  div:last-child { border-bottom: 0; }
  dt { color: var(--muted); }
  dd { margin: 0; text-align: right; }
`

export const AccountLayout = styled.div`
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 48px;
  nav { display: flex; flex-direction: column; align-items: start; gap: 14px; }
  nav a.active { font-weight: bold; text-decoration: underline; text-underline-offset: 6px; }
  @media (max-width: 700px) { grid-template-columns: 1fr; gap: 28px; nav { flex-direction: row; gap: 24px; } }
`

export const Balances = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  div { padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; }
  strong { display: block; margin-top: 12px; font-size: 24px; }
  @media (max-width: 450px) { grid-template-columns: 1fr; }
`

export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  table { width: 100%; border-collapse: collapse; white-space: nowrap; }
  th, td { padding: 16px 12px; border-bottom: 1px solid var(--border); text-align: left; }
  th { background: var(--surface-soft); font-weight: normal; color: var(--muted); }
  tbody tr:last-child td { border-bottom: 0; }
`
