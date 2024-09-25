'use client'

import styles from './component.module.css'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import useMeasure from 'react-use-measure'

export default function GridExample() {
  const [ref, measure] = useMeasure()
  const [itemRef, itemMeasure] = useMeasure()

  return (
    <div className={styles.container}>
      <PanelGroup direction="horizontal">
        <Panel minSize={20} maxSize={80}>
          <div className={styles.main}>
            <div ref={ref} className={styles.grid}>
              <div ref={itemRef}>
                <dl>
                  <dt>Grid Width</dt>
                  <dd>
                    {Math.round(measure.width)}
                    <span>px</span>
                  </dd>
                </dl>
              </div>
              <div>
                <dl>
                  <dt>Grid Height</dt>
                  <dd>
                    {Math.round(measure.height)}
                    <span>px</span>
                  </dd>
                </dl>
              </div>
              <div>
                <dl>
                  <dt>Item Width</dt>
                  <dd>
                    {Math.round(itemMeasure.width)}
                    <span>px</span>
                  </dd>
                </dl>
              </div>
              <div>
                <dl>
                  <dt>Item Height</dt>
                  <dd>
                    {Math.round(itemMeasure.height)}
                    <span>px</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle} />
        <Panel minSize={25}>
          <div className={styles.filler}>
            <div className="p-3 space-y-2 text-sm font-medium">
              <label className="flex gap-2 select-none" htmlFor="container">
                <input
                  defaultChecked={true}
                  onChange={(e) => {
                    const itemElements = document.querySelectorAll(`.${styles.grid} div`)
                    itemElements.forEach((el) => {
                      if (e.target.checked === true) {
                        ;(el as HTMLElement).style.setProperty(
                          'container-type',
                          'inline-size'
                        )
                      } else {
                        ;(el as HTMLElement).style.setProperty(
                          'container-type',
                          'initial'
                        )
                      }
                    })
                  }}
                  id="container"
                  type="checkbox"
                  className="accent-muted-fg mt-0.5"
                />
                enable container
              </label>
              <label className="flex gap-2 select-none" htmlFor="border">
                <input
                  onChange={(e) => {
                    const gridEl = document.querySelector(
                      `.${styles.grid}`
                    )! as HTMLElement
                    if (e.target.checked === true) {
                      gridEl.style.setProperty('--item-outline-width', '1px')
                    } else {
                      gridEl.style.setProperty('--item-outline-width', '0px')
                    }
                  }}
                  id="border"
                  type="checkbox"
                  className="accent-muted-fg mt-0.5"
                />
                show outline
              </label>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
