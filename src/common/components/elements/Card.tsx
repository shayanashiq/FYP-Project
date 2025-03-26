import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    [propName: string]: unknown
}

export const Card = ({ children, className = '', ...others }: CardProps) => {
    return (
        <div className={`${className} rounded-md border border-white`}>
            {children}
        </div>
    )
}
