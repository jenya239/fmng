import { Sheet } from './tools/sheet'
import { View } from './components/view'
import { Component } from './tools/component'

const d = console.log

const sheet = new Sheet()

sheet.insert(
  `
  * {
    box-sizing: border-box;
    font-family: monospace;
    font-size: 11px;
  }
`
)
sheet.insert(
  `
  body {
    background-color: #bbffbb;
    height: 100%;
    padding: 0;
    margin: 0;
  }
`
)
sheet.insert(
  `
  html {
    height: 100%;
    padding: 0;
    margin: 0;
  }
`
)
sheet.insert(
  `
  .item {
    cursor: pointer;
    border-bottom: 1px dashed Grey;
    width: fit-content;
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    min-height: 15px;
  }
`
)
sheet.insert(
  `
  .item:hover {
    opacity: 1;
  }
`
)
sheet.insert(
  `
  .item.active {
    background-color: green;
  }
`
)
sheet.insert(
  `
  .item.oldActive {
    background-color: red;
  }
`
)
sheet.insert(
  `
  .view {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
`
)
sheet.insert(
  `
  .leftPanel {
    width: 150px;
    min-width: 100px;
    max-width: 300px;
    resize: horizontal;
    background-color: #bbffbb;
    height: 100%;
    overflow: hidden;
    padding: 10px 0px 10px 10px;
  }
`
)
sheet.insert(
  `
  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    overflow-y: auto;
    margin-right: 10px;
    scroll-behavior: smooth;
  }
`
)
sheet.insert(
  `
  .items > div:first-child {
    margin-bottom: 10px;
    font-size: 14px;
  }
`
)
sheet.insert(
  `
  .area {
    width: area;
    flex-grow: 1;
    background-color: #FDF6E3;
    white-space: pre-wrap;
    overflow: auto;
    color: Grey;
    font-size: 10px;
    padding: 10px;
    height: 100%;
    tab-size: 8px;
    overflow-wrap: break-word;
  }
`
)
sheet.insert(
  `
  .images {
    width: 100%;
    flex-grow: 1;
    background-color: #ee11dd;
    overflow: auto;
    padding: 10px;
    height: 100%;
  }
`
)
sheet.insert(
  `
  .images .imageViewer {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
`
)

const view = new View({ container: document.body } as unknown as Component)
