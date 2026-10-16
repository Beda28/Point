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
  @media (max-width: 360px) { column-gap: 8px; }
`

export const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  a, button { display: inline-flex; align-items: center; justify-content: center; min-height: 38px; border: 1px solid var(--border); border-radius: var(--control-radius); background: var(--surface); color: var(--text); }
  a { padding: 7px 12px; font-size: 14px; line-height: 1.4; }
  a:last-of-type { background: var(--primary); color: var(--on-primary); border-color: var(--primary); }
  button { padding: 7px 12px; font-size: 14px; line-height: 1.4; }
  button[aria-pressed] { width: 38px; height: 38px; padding: 0; font-size: 21px; }
  button:hover { background: var(--surface-soft); }
  a:hover { border-color: var(--muted); }
  @media (max-width: 360px) {
    gap: 5px;
    a, button:not([aria-pressed]) { padding: 7px 8px; font-size: 12px; }
  }
`

export const Page = styled.main`
  max-width: 1128px;
  margin: auto;
  padding: 40px 24px 64px;
  @media (max-width: 450px) { padding: 28px 16px 48px; }
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 10px 18px;
  border: 1px solid var(--primary);
  border-radius: var(--control-radius);
  background: var(--primary);
  color: var(--on-primary);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  &:hover:not(:disabled) { background: var(--primary-hover); }
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover:not(:disabled) { transform: translateY(-1px); }
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
  width: 100%;
  max-width: 460px;
  margin: 24px auto;
  padding: 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  h1 { margin-bottom: 4px; font-size: 24px; letter-spacing: -0.03em; }
  > a, > p { text-align: center; font-size: 14px; }
  @media (max-width: 450px) { padding: 24px 20px; margin: 4px auto; }
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  input, textarea { width: 100%; padding: 11px 12px; border: 1px solid var(--border); border-radius: var(--control-radius); background: var(--background); color: var(--text); font-weight: 400; }
  input:hover, textarea:hover { border-color: var(--muted); }
  input:focus, textarea:focus { background: var(--surface); border-color: var(--focus); }
  textarea { min-height: 144px; }
`

export const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 460px;
`

export const Muted = styled.p`
  color: var(--muted);
  font-size: 14px;
`

export const Views = styled.div`
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-soft);
  button { padding: 6px 12px; border: 0; background: transparent; color: var(--muted); border-radius: 4px; font-size: 13px; }
  button[aria-pressed='true'] { background: var(--surface); color: var(--text); box-shadow: var(--shadow); }
`

export const ProductList = styled.div<{ $list: boolean }>`
  display: grid;
  grid-template-columns: ${({ $list }) => $list ? '1fr' : 'repeat(3, minmax(0, 1fr))'};
  gap: 20px;
  @media (max-width: 650px) { grid-template-columns: ${({ $list }) => $list ? '1fr' : 'repeat(2, minmax(0, 1fr))'}; }
  @media (max-width: 400px) { grid-template-columns: 1fr; }
`

export const ProductItem = styled.article<{ $list: boolean }>`
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  a { display: ${({ $list }) => $list ? 'flex' : 'block'}; align-items: center; height: 100%; }
  a > div { min-width: 0; padding: 18px 20px; }
  img { width: ${({ $list }) => $list ? '128px' : '100%'}; flex-shrink: 0; border: 0; border-radius: 0; border-${({ $list }) => $list ? 'right' : 'bottom'}: 1px solid var(--border); }
  h2 { font-size: 16px; font-weight: 500; overflow-wrap: anywhere; }
  p { margin-top: 6px; font-size: 18px; font-weight: 600; overflow-wrap: anywhere; }
  @media (hover: hover) {
    &:hover { border-color: var(--muted); }
  }
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    &:hover { transform: translateY(-1px); }
  }
  @media (max-width: 450px) {
    a > div { padding: 14px 16px; }
    img { width: ${({ $list }) => $list ? '96px' : '100%'}; }
  }
`

export const ProductImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  background: var(--image-background);
  border: 1px solid var(--border);
  border-radius: var(--control-radius);
`

export const ProductSplit = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  h1 { font-size: 24px; line-height: 1.4; overflow-wrap: anywhere; }
  h2 { font-size: 28px; overflow-wrap: anywhere; }
  > div { gap: 20px; padding: 8px 0; }
  @media (max-width: 700px) { grid-template-columns: 1fr; gap: 24px; padding: 20px; }
`

export const Description = styled.p`
  white-space: pre-line;
  color: var(--muted);
  overflow-wrap: anywhere;
  padding-top: 20px;
  border-top: 1px solid var(--border);
`

export const Summary = styled.dl`
  margin: 0;
  padding: 4px 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  div { display: flex; justify-content: space-between; gap: 20px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  div:last-child { border-bottom: 0; }
  dt { color: var(--muted); }
  dd { margin: 0; text-align: right; }
`

export const AccountLayout = styled.div`
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  align-items: start;
  gap: 24px;
  nav, > div { border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
  nav { display: flex; flex-direction: column; gap: 4px; padding: 8px; }
  nav a { padding: 10px 12px; border-radius: var(--control-radius); font-size: 14px; }
  nav a:hover, nav a.active { background: var(--surface-soft); }
  nav a.active { font-weight: 600; }
  > div { padding: 24px; min-height: 180px; }
  @media (max-width: 700px) { grid-template-columns: 1fr; gap: 20px; nav { flex-direction: row; flex-wrap: wrap; } }
`

export const Balances = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  div { padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
  strong { display: block; margin-top: 12px; font-size: 24px; }
  @media (max-width: 450px) { grid-template-columns: 1fr; }
`

export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  table { width: 100%; border-collapse: collapse; white-space: nowrap; }
  th, td { padding: 16px 12px; border-bottom: 1px solid var(--border); text-align: left; }
  th { background: var(--surface-soft); font-weight: normal; color: var(--muted); }
  tbody tr:last-child td { border-bottom: 0; }
`
