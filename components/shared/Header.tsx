import React from 'react'

const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => {
  return (
    <>
      <h2 className="text-sm font-medium">{title}</h2>
      {subtitle && <p className="p-16-regular mt-2">{subtitle}</p>}
    </>
  )
}

export default Header