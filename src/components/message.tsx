import React from 'react'

type Props = {
  message: string
}

const Message = ({ message }: Props) => {
  return (
    <div className='w-fit text-xs flex items-center rounded-lg rounded-tl-none text-white bg-black dark:bg-white dark:text-black py-2 px-4'>{message}</div>
  )
}

export default Message