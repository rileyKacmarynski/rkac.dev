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
            <p className="text-sm text-muted-fg text-balance">
              drag the seperator to resize.
            </p>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
