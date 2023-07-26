import React from 'react'

export default function OGImage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 128,
        color: 'white',
        background: 'radial-gradient(ellipse at top,#3f3f46,#18181b,#000)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        // @ts-ignore -- new css rule, might not work everywhere
        textWrap: 'balance',
      }}
    >
      {children}
    </div>
  )
}
