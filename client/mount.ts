
import { createElement } from "react"
import { render } from "react-dom"
export function mount(component: any, props: any, elementId: any) {
  render(createElement(component, props), document.getElementById(elementId))
}