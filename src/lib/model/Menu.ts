/* Models */
export type SubMenu = {
    name: string,
    path: string,
    img: string,
    explain: string,
    root: string,
    submenu: SubMenu[]
}
export type MainMenu = {
  name: string, //親メニュー名称
  path: string,
  img: string,
  active: boolean,
  explain: string
  submenu: SubMenu[]
}
