import React from 'react'

const Header = ({title, subtitle} : {title:string, subtitle?:string}) => {
  return (
    <>
        <h2 className='h2-bold text-dark-700'>{title}</h2>
        {subtitle && <p className='py-1 mt-4'>{subtitle}</p>}
    </>
  )
}

export default Header